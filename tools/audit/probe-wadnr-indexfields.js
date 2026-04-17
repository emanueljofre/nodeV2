#!/usr/bin/env node
/**
 * A2 discovery probe: enumerate WADNR Document Library index fields.
 *
 * Goal: quantify WADNR exposure to DOC-BUG-1/2 by identifying date-type index
 * fields in the library, counting how many exist, and flagging the ones at risk.
 *
 * Read-only. No writes. Safe under `readOnly: true` in .env.json.
 */

const path = require('path');
const fs = require('fs');

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

    console.log('Authenticated. Calling indexFields.getIndexFields()...\n');
    const resp = await vvClient.indexFields.getIndexFields({ count: 'true', limit: 1000 });
    const parsed = typeof resp === 'string' ? JSON.parse(resp) : resp;
    const items = parsed.data || parsed;

    if (!Array.isArray(items)) {
        console.log('Unexpected response shape:', JSON.stringify(parsed).slice(0, 300));
        return;
    }

    console.log(`Total index fields: ${items.length}\n`);

    if (items.length === 0) return;

    // Dump first item keys so we know the shape
    console.log('=== Sample item keys ===');
    console.log(Object.keys(items[0]).join(', '));
    console.log('\n=== First item sample values ===');
    for (const [k, v] of Object.entries(items[0])) {
        const s = typeof v === 'string' ? v : JSON.stringify(v);
        console.log(`  ${k}: ${s && s.length > 120 ? s.substring(0, 120) + '...' : s}`);
    }

    // Identify date-type fields. VV types vary; check both 'type' and 'dataType'
    const candidateKeys = ['type', 'dataType', 'fieldType', 'indexFieldType'];
    const typeKey = candidateKeys.find((k) => items[0][k] !== undefined);

    if (!typeKey) {
        console.log('\nNo obvious type key; dumping unique values for each string key...');
        const strKeys = Object.keys(items[0]).filter((k) => typeof items[0][k] === 'string');
        for (const k of strKeys) {
            const uniques = [...new Set(items.map((i) => i[k]))].sort();
            if (uniques.length > 1 && uniques.length < 20) {
                console.log(`  ${k}: ${uniques.join(', ')}`);
            }
        }
        return;
    }

    console.log(`\n=== Type distribution (key = ${typeKey}) ===`);
    const typeCounts = {};
    for (const it of items) {
        const t = it[typeKey] || '(null)';
        typeCounts[t] = (typeCounts[t] || 0) + 1;
    }
    for (const [t, n] of Object.entries(typeCounts).sort((a, b) => b[1] - a[1])) {
        console.log(`  ${t}: ${n}`);
    }

    // Filter date-type candidates by name pattern (since 'type' values vary)
    const dateNamePattern = /date|time|when|created|modified|updated|received|expires?|deadline/i;

    console.log('\n=== Date-type index field candidates ===');
    const dateCandidates = items.filter(
        (i) =>
            (typeof i[typeKey] === 'string' && /date|time/i.test(i[typeKey])) ||
            (i.name && dateNamePattern.test(i.name))
    );

    console.log(`Found ${dateCandidates.length} candidates (by type or name pattern).\n`);
    for (const f of dateCandidates) {
        console.log(`  name=${f.name} | type=${f[typeKey]} | id=${f.id || f.indexFieldId || f.fieldId || '?'}`);
    }

    // Write JSON output for downstream analysis
    const outPath = path.resolve(__dirname, '..', '..', 'testing', 'tmp', 'wadnr-indexfields-probe.json');
    fs.writeFileSync(
        outPath,
        JSON.stringify(
            {
                generatedAt: new Date().toISOString(),
                totalCount: items.length,
                typeDistribution: typeCounts,
                dateCandidates: dateCandidates,
                allFields: items.map((i) => ({
                    name: i.name,
                    type: i[typeKey],
                    id: i.id || i.indexFieldId || i.fieldId,
                })),
            },
            null,
            2
        )
    );
    console.log(`\nWrote: ${outPath}`);
}

main().catch((err) => {
    console.error('Probe failed:', err.message || err);
    console.error(err.stack);
    process.exit(1);
});
