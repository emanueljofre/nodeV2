#!/usr/bin/env node
/* eslint-disable no-undef */
/**
 * V1/V2 calendar logic probe.
 *
 * Checks whether `VV.Form.calendarValueService.useUpdatedCalendarValueLogic`
 * is enabled on a given VV environment. For a bare form-template load (no
 * ObjectID, no modelId context), the flag reflects only what `setUserInfo()`
 * pushes — i.e., the platform-level toggle for the customer/database.
 *
 * Usage:
 *   node tools/explore/probe-v1-v2-flag.js --project <customerKey>
 *
 * Read-only: lists templates and opens one template URL. No writes.
 */
const { chromium } = require('@playwright/test');
const { findCustomer, loadEnvConfig, login } = require('../helpers/vv-admin');
const { getTemplates } = require('../helpers/vv-templates');

const args = process.argv.slice(2);
const projectIdx = args.indexOf('--project');
const projectName = projectIdx >= 0 ? args[projectIdx + 1] : null;
if (!projectName) {
    console.error('Usage: node tools/explore/probe-v1-v2-flag.js --project <customerKey>');
    process.exit(1);
}

(async () => {
    const found = findCustomer(projectName);
    if (!found) {
        console.error(`Customer "${projectName}" not found in .env.json`);
        process.exit(1);
    }
    const config = loadEnvConfig(found.server, found.customer);
    console.log(`Target: ${found.server} / ${found.customer}`);
    console.log(`Base:   ${config.baseUrl}`);
    console.log(`Alias:  ${config.customerAlias}/${config.databaseAlias}`);

    console.log('\nListing form templates via API...');
    let templates;
    try {
        templates = await getTemplates(config, { excludePrefix: null });
    } catch (e) {
        console.error(`Template list failed: ${e.message}`);
        process.exit(1);
    }
    console.log(`  ${templates.length} templates found`);
    if (!templates.length) {
        console.error('\nNo templates available to probe. Create at least one form template first.');
        process.exit(2);
    }

    const pick = templates[0];
    console.log(`  Using: "${pick.name}" (formid=${pick.formId || pick.id})`);

    const formId = pick.formId || pick.id;
    const url =
        `${config.baseUrl}/FormViewer/app?hidemenu=true` +
        `&formid=${formId}` +
        `&xcid=${config.customerAlias}` +
        `&xcdid=${config.databaseAlias}`;

    console.log(`\nOpening: ${url}`);
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        await login(page, config);
        await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
        await page.waitForFunction(
            () =>
                typeof VV !== 'undefined' &&
                VV.Form &&
                VV.Form.calendarValueService &&
                typeof VV.Form.calendarValueService.useUpdatedCalendarValueLogic !== 'undefined',
            { timeout: 30000 }
        );

        const flag = await page.evaluate(() => ({
            flag: VV.Form.calendarValueService.useUpdatedCalendarValueLogic,
            modelId: VV.Form.modelId || null,
            hasObjectId: /[?&]ObjectID=/i.test(location.search),
        }));

        console.log('\n--- Probe Result ---');
        console.log(`  useUpdatedCalendarValueLogic = ${flag.flag}`);
        console.log(`  modelId present              = ${flag.modelId ? 'yes' : 'no'}`);
        console.log(`  ObjectID in URL              = ${flag.hasObjectId}`);
        console.log(`\n  ACTIVE PATH: ${flag.flag === true ? 'V2' : 'V1'}`);
        if (flag.flag === true && !flag.modelId && !flag.hasObjectId) {
            console.log('  → V2 enabled at platform level (setUserInfo push).');
        } else if (flag.flag === false) {
            console.log('  → V1 (platform default). V2 not pushed by setUserInfo.');
        }
    } catch (e) {
        console.error(`\nProbe failed: ${e.message}`);
        process.exitCode = 1;
    } finally {
        await browser.close();
    }
})();
