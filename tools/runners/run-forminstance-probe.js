#!/usr/bin/env node

/**
 * Direct Node.js runner for the FormsAPI / forminstance/ probe.
 * Authenticates with VV using credentials from the active .env.json profile,
 * then invokes scripts/examples/forminstance-probe.js with a mocked response.
 *
 * Read-only — no writes, no record creation. Safe to run on any environment.
 *
 * Usage:
 *   node tools/runners/run-forminstance-probe.js
 *   node tools/runners/run-forminstance-probe.js --template "DateTest"
 *   node tools/runners/run-forminstance-probe.js --template "Communications Log"
 *   node tools/runners/run-forminstance-probe.js --json   # emit raw JSON only (machine-readable)
 *
 * Companion to research/forminstance-pattern/.
 */

const path = require('path');

function parseArgs() {
    const args = process.argv.slice(2);
    const parsed = { template: 'DateTest', json: false };
    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--template':
                parsed.template = args[++i];
                break;
            case '--json':
                parsed.json = true;
                break;
            case '--help':
                console.log(`
FormsAPI / forminstance/ Probe Runner

Options:
  --template <name>   Form template to probe (default: "DateTest")
  --json              Emit raw JSON only (suppress human-readable summary)
  --help              Show this help
`);
                process.exit(0);
                break;
            default:
                console.error(`Unknown argument: ${args[i]}. Use --help for usage.`);
                process.exit(1);
        }
    }
    return parsed;
}

async function main() {
    const args = parseArgs();

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

    const ffCollection = new clientLibrary.forms.formFieldCollection([{ name: 'TemplateName', value: args.template }]);

    let captured = null;
    const mockResponse = {
        json: (status, data) => {
            captured = data;
        },
    };

    const probe = require(path.join(__dirname, '..', '..', 'scripts', 'examples', 'forminstance-probe'));
    await probe.main(ffCollection, vvClient, mockResponse);

    if (!captured) {
        console.error('Probe returned no output.');
        process.exit(1);
    }

    if (args.json) {
        process.stdout.write = _origStdoutWrite;
        process.stdout.write(JSON.stringify(captured, null, 2) + '\n');
        process.exit(captured.status === 'Error' ? 1 : 0);
    }

    // Human-readable summary
    const { formsApi, template, environment } = captured.data;
    console.log('');
    console.log('=== FormsAPI / forminstance/ probe ===');
    console.log(
        `Environment:  ${environment.customerAlias}/${environment.databaseAlias} (token: ${environment.tokenType || 'unknown'})`
    );
    console.log('');
    console.log('FormsAPI SDK surface');
    console.log(`  publicGetter (vvClient.formsApi):     ${formsApi.publicGetterIsNull ? 'NULL' : 'present'}`);
    console.log(`  underlying instance (_formsApi):      ${formsApi.hasUnderlyingInstance ? 'present' : 'NULL'}`);
    console.log(`  isEnabled:                            ${formsApi.isEnabled}`);
    console.log(`  baseUrl:                              ${formsApi.baseUrl || '(none)'}`);
    console.log(`  formInstances manager:                ${formsApi.hasFormInstancesManager ? 'present' : 'NULL'}`);
    console.log(`  formInstances.postForm:               ${formsApi.methods.postForm ? 'callable' : 'missing'}`);
    console.log(
        `  formInstances.postFormRevision:       ${formsApi.methods.postFormRevision ? 'callable' : 'missing'}`
    );
    console.log('');
    console.log(`Template: "${template.name}"`);
    console.log(`  templateIdGuid:                       ${template.templateIdGuid || '(unresolved)'}`);
    console.log(`  templateRevisionIdGuid:               ${template.templateRevisionIdGuid || '(unresolved)'}`);
    console.log(`  resolved:                             ${template.resolved}`);
    console.log('');
    console.log(`Status: ${captured.status}`);
    if (captured.errors.length > 0) {
        console.log('Errors:');
        for (const e of captured.errors) console.log(`  - ${e}`);
    }
    if (captured.nextSteps.length > 0) {
        console.log('Next steps:');
        for (const s of captured.nextSteps) console.log(`  - ${s}`);
    }
    console.log('');

    process.exit(captured.status === 'Error' ? 1 : 0);
}

main().catch((err) => {
    console.error(err && err.stack ? err.stack : err);
    process.exit(1);
});
