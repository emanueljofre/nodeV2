#!/usr/bin/env node
/**
 * Debug probe: dump a single WADNR form record to understand response shape.
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

    // Get Task form (should have ~278 records with Date Created)
    console.log('Sampling Task form, no field filter...');
    const resp = await vvClient.forms.getForms({ limit: 1 }, 'Task');
    const parsed = typeof resp === 'string' ? JSON.parse(resp) : resp;
    console.log('\n=== Top-level keys ===');
    console.log(Object.keys(parsed));
    console.log('\n=== Meta ===');
    console.log(JSON.stringify(parsed.meta || parsed.Meta || {}, null, 2));
    const items = parsed.data || [];
    if (items.length) {
        console.log('\n=== First item keys ===');
        console.log(Object.keys(items[0]));
        console.log('\n=== First item (truncated 2000 chars) ===');
        console.log(JSON.stringify(items[0], null, 2).slice(0, 2000));
    } else {
        console.log('No items. Full response first 500:');
        console.log(JSON.stringify(parsed).slice(0, 500));
    }
}

main().catch((err) => {
    console.error(err.message);
    console.error(err.stack);
    process.exit(1);
});
