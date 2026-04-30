#!/usr/bin/env node

/**
 * Direct Node.js runner for the forminstance/ test harness.
 * Authenticates with VV using credentials from the active .env.json profile,
 * then invokes scripts/examples/forminstance-test-harness.js with a mocked response.
 *
 * Companion to research/forminstance-pattern/. Mirrors the ergonomics of run-ws-test.js.
 *
 * Usage:
 *   node tools/runners/run-forminstance-test.js --action FI-CREATE
 *   node tools/runners/run-forminstance-test.js --action FI-UPDATE --record-id DateTest-001234
 *   node tools/runners/run-forminstance-test.js --action FI-CYCLE
 *   node tools/runners/run-forminstance-test.js --action FI-VS-PF --configs C,D
 *   node tools/runners/run-forminstance-test.js --action FI-CREATE --input-date "2026-04-27T15:17:00" --debug
 *
 * Note on --input-date:
 *   Pass naive-local strings only (no trailing Z). The whole point of this
 *   pattern is to write naive-local values so Controls doesn't re-emit them
 *   with a UTC marker — including Z would defeat the test.
 */

const path = require('path');

function parseArgs() {
    const args = process.argv.slice(2);
    const parsed = {};
    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--action':
                parsed.action = args[++i];
                break;
            case '--configs':
                parsed.configs = args[++i];
                break;
            case '--record-id':
                parsed.recordId = args[++i];
                break;
            case '--input-date':
                parsed.inputDate = args[++i];
                break;
            case '--second-input-date':
                parsed.secondInputDate = args[++i];
                break;
            case '--debug':
                parsed.debug = true;
                break;
            case '--json':
                parsed.json = true;
                break;
            case '--help':
                console.log(`
forminstance/ Test Harness Runner

Options:
  --action <FI-CREATE|FI-UPDATE|FI-CYCLE|FI-VS-PF|FI-MIGRATE>  Required.
  --configs <A,C,D|ALL>             Default: C,D,G,H (the date+time configs)
  --record-id <name>                Required for FI-UPDATE
  --input-date <iso-naive>          Default: "2026-03-15T14:30:00"
  --second-input-date <iso-naive>   Default: "2026-03-20T09:15:00" (FI-CYCLE only)
  --debug                           Include raw API responses in output
  --json                            Emit raw JSON only (suppress human summary)
  --help                            Show this help
`);
                process.exit(0);
                break;
            default:
                console.error(`Unknown argument: ${args[i]}. Use --help for usage.`);
                process.exit(1);
        }
    }
    if (!parsed.action) {
        console.error('Error: --action is required. Use --help for usage.');
        process.exit(1);
    }
    return parsed;
}

async function main() {
    const args = parseArgs();

    // In --json mode, the lib emits chatty stdout logs (auth/transport) that
    // corrupt the JSON output. Silence stdout from non-runner code; the runner
    // restores stdout itself when it's ready to emit the final JSON.
    let _origStdoutWrite;
    if (args.json) {
        _origStdoutWrite = process.stdout.write.bind(process.stdout);
        process.stdout.write = () => true;
    }

    const { loadConfig } = require('../../testing/fixtures/env-config');

    let config;
    try {
        config = loadConfig();
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }

    const required = ['loginUrl', 'customerAlias', 'databaseAlias', 'clientId', 'clientSecret', 'username', 'password'];
    const missing = required.filter((f) => !config[f]);
    if (missing.length > 0) {
        console.error(`Missing fields in .env.json: ${missing.join(', ')}`);
        process.exit(1);
    }

    const clientLibrary = require(path.join(__dirname, '..', '..', 'lib', 'VVRestApi', 'VVRestApiNodeJs', 'VVRestApi'));
    const vvAuthorize = new clientLibrary.authorize();
    vvAuthorize.readOnly = config.readOnly || false;
    vvAuthorize.writePolicy = config.writePolicy || null;

    if (!args.json) {
        console.log(`Authenticating with ${config.loginUrl} as ${config.customerAlias}/${config.databaseAlias}...`);
    }

    let vvClient;
    try {
        vvClient = await vvAuthorize.getVaultApi(
            config.clientId,
            config.clientSecret,
            config.username,
            config.password,
            null,
            config.loginUrl,
            config.customerAlias,
            config.databaseAlias
        );
    } catch (err) {
        console.error(`Authentication failed: ${err.message}`);
        process.exit(1);
    }

    // Resolve write-policy form names → GUIDs (same hook the WS runner uses)
    const policy = vvClient._httpHelper._writePolicy;
    if (policy && policy.mode === 'allowlist' && policy.forms) {
        for (const form of policy.forms) {
            if (form.name) {
                try {
                    const resp = await vvClient.forms.getFormTemplateIdByName(form.name);
                    if (resp.templateIdGuid) form.templateId = resp.templateIdGuid;
                    if (resp.templateRevisionIdGuid) form.revisionId = resp.templateRevisionIdGuid;
                } catch (err) {
                    if (!args.json) console.warn(`Warning: could not resolve "${form.name}": ${err.message}`);
                }
            }
        }
    }

    const fields = [
        { name: 'Action', value: args.action },
        { name: 'TargetConfigs', value: args.configs || 'C,D,G,H' },
        { name: 'RecordID', value: args.recordId || '' },
        { name: 'InputDate', value: args.inputDate || '' },
        { name: 'SecondInputDate', value: args.secondInputDate || '' },
        { name: 'Debug', value: args.debug ? 'true' : 'false' },
    ];
    const ffCollection = new clientLibrary.forms.formFieldCollection(fields);

    let captured = null;
    const mockResponse = {
        json: (status, data) => {
            captured = data;
        },
    };

    const harness = require(path.join(__dirname, '..', '..', 'scripts', 'examples', 'forminstance-test-harness'));
    await harness.main(ffCollection, vvClient, mockResponse);

    if (!captured) {
        console.error('Harness returned no output.');
        process.exit(1);
    }

    if (args.json) {
        // Restore stdout and emit the only thing the caller wants
        process.stdout.write = _origStdoutWrite;
        process.stdout.write(JSON.stringify(captured, null, 2) + '\n');
        process.exit(captured.status === 'Error' ? 1 : 0);
    }

    // Human-readable summary
    console.log('');
    console.log(`=== forminstance/ harness — ${args.action} ===`);
    console.log(`Status: ${captured.status}`);
    if (captured.errors.length > 0) {
        console.log('Errors:');
        for (const e of captured.errors) console.log(`  - ${e}`);
    }
    if (captured.data) {
        console.log('');
        console.log(JSON.stringify(captured.data, null, 2));
    }
    console.log('');
    process.exit(captured.status === 'Error' ? 1 : 0);
}

main().catch((err) => {
    console.error(err && err.stack ? err.stack : err);
    process.exit(1);
});
