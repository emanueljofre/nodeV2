#!/usr/bin/env node
/**
 * A3 discovery probe: sample WADNR Config D calendar field values.
 *
 * For each of the 12 Config D fields (Appendix B.2 + B.3 + B.4 of
 * date-handling-current-state.md), fetch up to N form records and analyze
 * the time component of stored values. Output per-field distribution:
 *   { empty, midnight (00:00:00), nonMidnight, sampleSize }
 *
 * Read-only. No writes. Safe under `readOnly: true` in .env.json.
 */

const path = require('path');
const fs = require('fs');

const TARGETS = [
    { template: 'Forest Practices Aerial Chemical Application', field: 'Received Date', bucket: 'B.2 misconfigured' },
    { template: 'Forest Practices Application Notification', field: 'Date of Receipt', bucket: 'B.2 misconfigured' },
    { template: 'FPAN Amendment Request', field: 'Date of Receipt', bucket: 'B.2 misconfigured' },
    { template: 'FPAN Renewal', field: 'Date of Receipt', bucket: 'B.2 misconfigured' },
    { template: 'Long-Term Application 5-Day Notice', field: 'Date of Receipt', bucket: 'B.2 misconfigured' },
    { template: 'Multi-purpose', field: 'Date of Violation', bucket: 'B.2 misconfigured' },
    { template: 'Step 1 Long Term FPA', field: 'Date of Receipt', bucket: 'B.2 misconfigured' },
    { template: 'Task', field: 'Date Created', bucket: 'B.2 misconfigured' },
    // B.3 ambiguous — verify time usage
    { template: 'Task', field: 'Date Completed', bucket: 'B.3 ambiguous' },
    { template: 'Informal Conference Note', field: 'Meeting Date', bucket: 'B.3 ambiguous' },
    { template: 'Informal Conference Note - SUPPORT COPY', field: 'Meeting Date', bucket: 'B.3 ambiguous' },
    // B.4 correctly used — sanity check
    { template: 'Notice to Comply', field: 'ViolationDateAndTime', bucket: 'B.4 correct' },
];

function classifyTime(value) {
    if (value === null || value === undefined || value === '') return 'empty';
    const s = String(value);
    // Match patterns: time zero across common formats
    // ISO-ish: 2025-01-15T00:00:00, 2025-01-15 00:00:00, 2025-01-15T00:00:00.000Z
    // US: 01/15/2025 00:00:00 AM or 12:00:00 AM
    if (/T?\s*00:00:00(\.000)?(Z|[+-]\d{2}:\d{2})?$/.test(s)) return 'midnight';
    if (/\s12:00:00\s*AM/i.test(s)) return 'midnight';
    // Has non-zero time?
    if (/(T|\s)([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)/.test(s)) {
        // Extract h:m:s
        const m = s.match(/(T|\s)([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)/);
        if (m && (m[2] !== '00' || m[3] !== '00' || m[4] !== '00')) return 'nonMidnight';
        return 'midnight';
    }
    if (/\s\d{1,2}:\d{2}:\d{2}\s*(AM|PM)/i.test(s)) {
        // US format, 12:00:00 AM = midnight
        if (/\s12:00:00\s*AM/i.test(s) || /\s00:00:00/i.test(s)) return 'midnight';
        return 'nonMidnight';
    }
    // Date-only string (no time component)
    return 'dateOnly';
}

async function sampleTemplate(vvClient, templateName, fieldName, pageSize = 5000) {
    try {
        const resp = await vvClient.forms.getForms({ count: 'true', limit: pageSize, expand: true }, templateName);
        const parsed = typeof resp === 'string' ? JSON.parse(resp) : resp;
        const items = parsed.data || parsed;
        if (!Array.isArray(items)) {
            return { error: 'unexpected shape', sample: JSON.stringify(parsed).slice(0, 200) };
        }

        const buckets = { empty: 0, midnight: 0, nonMidnight: 0, dateOnly: 0, other: 0 };
        const samples = { nonMidnight: [], midnight: [], dateOnly: [] };

        // Response uses camelCase-first variant: "Date Created" → "date Created"
        // Build case-insensitive lookup on first record
        const sampleKeys = items[0] ? Object.keys(items[0]) : [];
        const normalize = (s) =>
            s
                .toLowerCase()
                .replace(/[\s_-]+/g, ' ')
                .trim();
        const targetNorm = normalize(fieldName);
        const matchingKey = sampleKeys.find((k) => normalize(k) === targetNorm);

        for (const rec of items) {
            let raw = matchingKey ? rec[matchingKey] : undefined;
            if (raw === undefined) raw = rec[fieldName];

            const cls = classifyTime(raw);
            buckets[cls] = (buckets[cls] || 0) + 1;
            if (cls !== 'empty' && samples[cls] && samples[cls].length < 3) samples[cls].push(String(raw));
        }

        // Track which key we used for debugging
        if (!matchingKey) {
            return {
                totalRecords: items.length,
                totalAvailable: parsed.meta?.totalCount || items.length,
                buckets,
                samples,
                warning: `field "${fieldName}" not found in response; available keys: ${sampleKeys.slice(0, 50).join(', ')}`,
            };
        }

        return {
            totalRecords: items.length,
            totalAvailable: parsed.meta?.totalCount || parsed.meta?.total || items.length,
            buckets,
            samples,
        };
    } catch (e) {
        return { error: e.message || String(e) };
    }
}

async function main() {
    const envPath = path.resolve(__dirname, '..', '..', '.env.json');
    const raw = JSON.parse(fs.readFileSync(envPath, 'utf8'));
    const server = raw.servers['vv5dev'];
    const wadnr = server.customers['WADNR'];

    const clientLibrary = require(path.join(__dirname, '..', '..', 'lib', 'VVRestApi', 'VVRestApiNodeJs', 'VVRestApi'));
    const vvAuthorize = new clientLibrary.authorize();
    vvAuthorize.readOnly = true;

    console.log('Authenticating to vv5dev/WADNR...');
    const vvClient = await vvAuthorize.getVaultApi(
        wadnr.clientId,
        wadnr.clientSecret,
        wadnr.username,
        wadnr.loginPassword,
        wadnr.audience || '',
        server.baseUrl,
        wadnr.customerAlias,
        wadnr.databaseAlias
    );
    console.log('Authenticated. Sampling Config D fields...\n');

    const results = [];
    for (const t of TARGETS) {
        process.stdout.write(`  ${t.template} / ${t.field} ... `);
        const r = await sampleTemplate(vvClient, t.template, t.field);
        results.push({ ...t, ...r });
        if (r.error) {
            console.log(`ERROR: ${r.error}`);
        } else {
            const b = r.buckets;
            console.log(
                `n=${r.totalRecords} | empty=${b.empty} midnight=${b.midnight} dateOnly=${b.dateOnly} nonMidnight=${b.nonMidnight}`
            );
        }
    }

    // Summary
    console.log('\n=== Summary ===');
    console.log('| Bucket | Template | Field | Sample | Empty | Midnight | DateOnly | NonMidnight | Disposition |');
    console.log('|---|---|---|---:|---:|---:|---:|---:|---|');
    for (const r of results) {
        if (r.error) {
            console.log(`| ${r.bucket} | ${r.template} | ${r.field} | ERR | - | - | - | - | ${r.error} |`);
            continue;
        }
        const b = r.buckets;
        const nonMid = b.nonMidnight || 0;
        const populated = (b.midnight || 0) + (b.dateOnly || 0) + nonMid;
        let disposition;
        if (populated === 0) disposition = 'no-data';
        else if (nonMid === 0) disposition = 'reconfig-safe (all midnight)';
        else if (nonMid / populated < 0.05) disposition = 'reconfig-likely-safe (<5% non-midnight)';
        else if (nonMid / populated < 0.5) disposition = 'investigate (mixed use)';
        else disposition = 'reconfig-risky (majority has time)';
        console.log(
            `| ${r.bucket} | ${r.template} | ${r.field} | ${r.totalRecords} | ${b.empty || 0} | ${b.midnight || 0} | ${b.dateOnly || 0} | ${nonMid} | ${disposition} |`
        );
    }

    const outPath = path.resolve(__dirname, '..', '..', 'testing', 'tmp', 'wadnr-configd-probe.json');
    fs.writeFileSync(outPath, JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2));
    console.log(`\nWrote: ${outPath}`);
}

main().catch((err) => {
    console.error('Probe failed:', err.message || err);
    console.error(err.stack);
    process.exit(1);
});
