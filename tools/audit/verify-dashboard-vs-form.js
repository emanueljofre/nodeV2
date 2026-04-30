#!/usr/bin/env node

/**
 * Dashboard ↔ Form Display Comparison
 *
 * Closes the empirical loop on the forminstance-pattern task. For a list of
 * record instance names, opens the FormDataDetails dashboard, scrapes the row
 * for each record, then opens each record in the FormViewer and captures the
 * displayed value. Asserts dashboard cell == form display.
 *
 * Companion to research/forminstance-pattern/. Read-only.
 *
 * Usage:
 *   node tools/audit/verify-dashboard-vs-form.js \
 *     --pairs DateTest-002155=<dataId>,DateTest-002156=<dataId> \
 *     --configs C,D,G,H --out evidence.json
 *
 * --pairs format: <instanceName>=<DataID guid> per record, comma-separated.
 * The instanceName is used to find the row in the dashboard grid; the DataID
 * is used to load the FormViewer.
 */

const path = require('path');
const fs = require('fs');

const FIELD_MAP = {
    A: { field: 'Field7', enableTime: false, ignoreTimezone: false, useLegacy: false },
    B: { field: 'Field10', enableTime: false, ignoreTimezone: true, useLegacy: false },
    C: { field: 'Field6', enableTime: true, ignoreTimezone: false, useLegacy: false },
    D: { field: 'Field5', enableTime: true, ignoreTimezone: true, useLegacy: false },
    E: { field: 'Field12', enableTime: false, ignoreTimezone: false, useLegacy: true },
    F: { field: 'Field11', enableTime: false, ignoreTimezone: true, useLegacy: true },
    G: { field: 'Field14', enableTime: true, ignoreTimezone: false, useLegacy: true },
    H: { field: 'Field13', enableTime: true, ignoreTimezone: true, useLegacy: true },
};

const { loadConfig } = require('../../testing/fixtures/env-config');
const _envConfig = loadConfig();
const BASE_URL = _envConfig.baseUrl;
const XCID = _envConfig.customerAlias;
const XCDID = _envConfig.databaseAlias;

function parseArgs() {
    const args = process.argv.slice(2);
    const parsed = { tz: 'America/Sao_Paulo' };
    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--pairs':
                parsed.pairs = args[++i];
                break;
            case '--configs':
                parsed.configs = args[++i];
                break;
            case '--tz':
                parsed.tz = args[++i];
                break;
            case '--out':
                parsed.out = args[++i];
                break;
            case '--headed':
                parsed.headed = true;
                break;
            case '--help':
                console.log(
                    'Usage: --pairs <inst=dataId,inst=dataId,...> --configs <A,C,D|ALL> [--tz <IANA>] [--out <path>]'
                );
                process.exit(0);
        }
    }
    if (!parsed.pairs) throw new Error('--pairs is required (format: instanceName=dataId,...)');
    if (!parsed.configs) throw new Error('--configs is required');

    parsed.records = parsed.pairs.split(',').map((s) => {
        const [name, id] = s.split('=').map((p) => p.trim());
        if (!name || !id) throw new Error(`Invalid --pairs entry: "${s}". Expected "instanceName=dataId".`);
        return { instanceName: name, dataId: id };
    });
    return parsed;
}

function buildFormUrl(dataId) {
    return `/FormViewer/app?DataID=${dataId}&hidemenu=true&rOpener=1&xcid=${XCID}&xcdid=${XCDID}`;
}

function dashboardUrl() {
    // From testing/fixtures/vv-config.js dashboardDateTest
    return `${BASE_URL}/app/${XCID}/${XCDID}/FormDataDetails?Mode=ReadOnly&ReportID=e522c887-e72e-f111-ba23-0e3ceb11fc25`;
}

async function waitForVVForm(page, timeout = 60000) {
    await page.waitForFunction(() => typeof VV !== 'undefined' && VV.Form && VV.Form.VV && VV.Form.VV.FormPartition, {
        timeout,
    });
}

async function captureDashboardRow(page, instanceName, fields) {
    return page.evaluate(
        ({ instanceName, fields }) => {
            const headers = [];
            document.querySelectorAll('.rgMasterTable thead th').forEach((th) => {
                const link = th.querySelector('a');
                headers.push(link ? link.textContent.trim() : th.textContent.trim());
            });
            const formIdIdx = headers.indexOf('Form ID');
            if (formIdIdx === -1) return { _error: 'Form ID column not found in dashboard headers', headers };

            const out = {};
            const rows = document.querySelectorAll('.rgMasterTable tbody tr.rgRow, .rgMasterTable tbody tr.rgAltRow');
            for (const tr of rows) {
                const cells = tr.querySelectorAll('td');
                const formId = (cells[formIdIdx] && cells[formIdIdx].textContent.trim()) || '';
                if (formId === instanceName) {
                    fields.forEach((f) => {
                        const idx = headers.indexOf(f);
                        out[f] = idx >= 0 && cells[idx] ? cells[idx].textContent.trim() : '(column missing)';
                    });
                    return { found: true, values: out };
                }
            }
            return {
                found: false,
                _error: `record "${instanceName}" not in current page of dashboard`,
                rowCount: rows.length,
            };
        },
        { instanceName, fields }
    );
}

async function captureFormDisplay(page, fieldName) {
    return page.evaluate((name) => {
        const result = { displayValue: null, rawValue: null };
        try {
            result.rawValue = VV.Form.VV.FormPartition.getValueObjectValue(name);
        } catch (e) {}
        const el =
            document.querySelector(`kendo-datepicker[aria-label="${name}"] input`) ||
            document.querySelector(`kendo-datetimepicker[aria-label="${name}"] input`) ||
            document.querySelector(`[aria-label="${name}"] input`) ||
            document.querySelector(`[aria-label="${name}"]`);
        if (el) result.displayValue = el.value || el.textContent || null;
        return result;
    }, fieldName);
}

async function main() {
    const args = parseArgs();
    const records = args.records; // [{instanceName, dataId}, ...]
    const configs = args.configs.split(',').map((s) => s.trim().toUpperCase());
    const fields = configs.map((c) => FIELD_MAP[c].field);

    const authStatePath = path.join(__dirname, '..', '..', 'testing', 'config', 'auth-state-pw.json');
    if (!fs.existsSync(authStatePath)) {
        console.error('Missing auth state. Run: node tools/runners/refresh-auth-state.js');
        process.exit(1);
    }

    const { chromium } = require('@playwright/test');
    const browser = await chromium.launch({ channel: 'chrome', headless: !args.headed });
    const context = await browser.newContext({
        baseURL: BASE_URL,
        storageState: JSON.parse(fs.readFileSync(authStatePath, 'utf8')),
        timezoneId: args.tz,
    });
    const page = await context.newPage();

    const browserTz = await page.evaluate(() => Intl.DateTimeFormat().resolvedOptions().timeZone);
    console.log(`Browser TZ: ${browserTz}`);
    console.log(`Dashboard:  ${dashboardUrl()}`);

    const evidence = {
        env: { customerAlias: XCID, databaseAlias: XCDID, baseUrl: BASE_URL, browserTz },
        records: [],
        capturedAt: new Date().toISOString(),
    };

    // Normalize "3/15/2026 2:30 PM" and "03/15/2026 02:30 PM" to a comparable
    // canonical form. Distinguishes actual time shifts (real WS-BUG-1) from
    // pure formatting differences (DB-BUG-1, cosmetic).
    function normalizeDisplay(s) {
        if (s == null) return null;
        const m = String(s)
            .trim()
            .match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?)?$/i);
        if (!m) return s; // Unrecognized — return as-is
        const month = String(parseInt(m[1], 10)).padStart(2, '0');
        const day = String(parseInt(m[2], 10)).padStart(2, '0');
        const year = m[3];
        if (!m[4]) return `${year}-${month}-${day}`;
        let hour = parseInt(m[4], 10);
        const min = m[5];
        const ampm = (m[7] || '').toUpperCase();
        if (ampm === 'PM' && hour < 12) hour += 12;
        if (ampm === 'AM' && hour === 12) hour = 0;
        return `${year}-${month}-${day} ${String(hour).padStart(2, '0')}:${min}`;
    }

    try {
        // 1) Capture dashboard row for each record
        await page.goto(dashboardUrl(), { waitUntil: 'networkidle', timeout: 60000 });
        // Allow grid to populate
        await page.waitForSelector('.rgMasterTable tbody tr', { timeout: 30000 });

        const dashboardByRecord = {};
        for (const r of records) {
            const row = await captureDashboardRow(page, r.instanceName, fields);
            dashboardByRecord[r.instanceName] = row;
        }

        // 2) Capture form display for each record
        for (const r of records) {
            console.log(`\n--- ${r.instanceName} (DataID ${r.dataId}) ---`);
            await page.goto(buildFormUrl(r.dataId), { waitUntil: 'networkidle', timeout: 60000 });
            await waitForVVForm(page);

            const dashboardRow = dashboardByRecord[r.instanceName];
            const recordEvidence = {
                instanceName: r.instanceName,
                dataId: r.dataId,
                dashboard: dashboardRow,
                form: {},
                comparison: [],
            };

            for (const c of configs) {
                const f = FIELD_MAP[c].field;
                const fv = await captureFormDisplay(page, f);
                recordEvidence.form[f] = fv;

                const dashCell = dashboardRow.found ? dashboardRow.values[f] : null;
                const formDisp = fv.displayValue;
                const dashNorm = normalizeDisplay(dashCell);
                const formNorm = normalizeDisplay(formDisp);
                const exactMatch = dashCell != null && formDisp != null && dashCell === formDisp;
                const semanticMatch = dashNorm != null && formNorm != null && dashNorm === formNorm;
                // Verdict: SEMANTIC_MATCH (true value agrees, only format differs — cosmetic DB-BUG-1)
                //          EXACT_MATCH (perfect string agreement)
                //          SHIFT (different absolute time — real WS-BUG-1)
                let verdict;
                if (exactMatch) verdict = 'EXACT_MATCH';
                else if (semanticMatch) verdict = 'SEMANTIC_MATCH (formatting only)';
                else verdict = 'SHIFT';

                recordEvidence.comparison.push({
                    config: c,
                    fieldName: f,
                    dashboard: dashCell,
                    dashboardNorm: dashNorm,
                    formDisplay: formDisp,
                    formDisplayNorm: formNorm,
                    formRaw: fv.rawValue,
                    exactMatch,
                    semanticMatch,
                    verdict,
                });

                console.log(`  ${c} ${f.padEnd(8)} dash="${dashCell}"  form="${formDisp}"  → ${verdict}`);
            }

            evidence.records.push(recordEvidence);
        }

        if (args.out) {
            fs.writeFileSync(args.out, JSON.stringify(evidence, null, 2));
            console.log(`\nEvidence written to ${args.out}`);
        }
    } finally {
        await browser.close();
    }

    const allSemantic = evidence.records.every((r) => r.comparison.every((c) => c.semanticMatch));
    const anyShift = evidence.records.some((r) => r.comparison.some((c) => c.verdict === 'SHIFT'));
    console.log('');
    if (anyShift) {
        console.log('Verdict: SHIFT detected — real WS-BUG-1 (form value differs from dashboard).');
    } else if (allSemantic) {
        console.log(
            'Verdict: SEMANTIC MATCH — all records agree on the value (any string differences are DB-BUG-1 cosmetic formatting).'
        );
    } else {
        console.log('Verdict: UNKNOWN — see per-row output.');
    }
    process.exit(anyShift ? 1 : 0);
}

main().catch((err) => {
    console.error(err && err.stack ? err.stack : err);
    process.exit(1);
});
