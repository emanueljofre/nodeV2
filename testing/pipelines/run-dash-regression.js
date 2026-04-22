#!/usr/bin/env node
/**
 * Run Dashboard date-handling regression tests and generate/update test artifacts.
 *
 * Launches Playwright, navigates to the DateTest Dashboard (Telerik RadGrid),
 * captures grid cell values, compares against matrix.md Expected column,
 * and generates artifacts.
 *
 * Dashboards are server-rendered — browser TZ is irrelevant.
 *
 * Usage:
 *   node testing/pipelines/run-dash-regression.js
 *   node testing/pipelines/run-dash-regression.js --category DB-1
 *   node testing/pipelines/run-dash-regression.js --artifacts-only
 *   node testing/pipelines/run-dash-regression.js --skip-artifacts
 *   node testing/pipelines/run-dash-regression.js --headed
 *
 * npm script: npm run test:dash:regression
 */
const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { captureBuildContext } = require('../../tools/helpers/build-context');
const { fingerprint } = require('../../tools/helpers/build-fingerprint');
const { customerTemplates, FIELD_MAP: VV_FIELD_MAP, vvConfig } = require('../fixtures/vv-config');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const AUTH_STATE_PATH = path.join(REPO_ROOT, 'testing', 'config', 'auth-state-pw.json');
const RESULTS_DIR = path.join(REPO_ROOT, 'testing', 'tmp');
const RESULTS_PATH = path.join(RESULTS_DIR, 'dash-regression-results-latest.json');
const GENERATOR_PATH = path.join(REPO_ROOT, 'tools', 'generators', 'generate-dash-artifacts.js');

// Resolve active-customer dashboard URL from vv-config.js (driven by .env.json activeCustomer).
if (!customerTemplates.dashboardDateTest) {
    throw new Error(
        `Active customer "${vvConfig.customerKey}" has no dashboardDateTest URL in CUSTOMER_TEMPLATES (testing/fixtures/vv-config.js)`
    );
}
const DASHBOARD_FULL_URL = customerTemplates.dashboardDateTest;

// Collapse the customer FIELD_MAP (Config -> {field,...}) to { Config: fieldName } for grid lookup.
const FIELD_MAP = Object.fromEntries(Object.entries(VV_FIELD_MAP).map(([config, def]) => [config, def.field]));

const ALL_DATE_FIELDS = Object.values(FIELD_MAP);

async function main() {
    const args = process.argv.slice(2);
    const artifactsOnly = args.includes('--artifacts-only');
    const skipArtifacts = args.includes('--skip-artifacts');
    const headed = args.includes('--headed');
    const categoryIdx = args.indexOf('--category');
    const categoryFilter = categoryIdx >= 0 ? args[categoryIdx + 1] : null;

    if (!artifactsOnly) {
        console.log('\n=== Phase 1: Capturing dashboard grid data ===\n');
        fs.mkdirSync(RESULTS_DIR, { recursive: true });

        const browser = await chromium.launch({ headless: !headed, channel: 'chrome' });
        const context = await browser.newContext({ storageState: AUTH_STATE_PATH });
        const page = await context.newPage();

        // Navigate to dashboard
        console.log(`Loading dashboard for customer "${vvConfig.customerKey}"...`);
        console.log(`  URL: ${DASHBOARD_FULL_URL}`);
        await page.goto(DASHBOARD_FULL_URL, { waitUntil: 'networkidle', timeout: 60000 });
        await page.waitForTimeout(3000);

        // Capture initial pager info
        let pagerInfo = await page.evaluate(() => {
            const pager = document.querySelector('.rgPagerCell');
            const text = pager?.textContent?.replace(/\s+/g, ' ').trim() || '';
            const match = text.match(/(\d+) items in (\d+) pages/);
            return {
                totalItems: match ? parseInt(match[1]) : 0,
                totalPages: match ? parseInt(match[2]) : 0,
            };
        });
        console.log(`Grid loaded: ${pagerInfo.totalItems} records, ${pagerInfo.totalPages} pages (default page size)`);

        // Bump page size by calling Telerik's client-side set_pageSize() + rebind() on the
        // master table view. We have to route through a non-strict <script> tag because the
        // Telerik client API uses `arguments.callee`, which strict mode (page.evaluate) bans.
        const gridClientId = await page.evaluate(() => {
            const ids = [...document.querySelectorAll('[id$="_RadGrid1"]')].map((el) => el.id).filter(Boolean);
            return ids[0] || null;
        });
        let pageSizeResult;
        if (!gridClientId) {
            pageSizeResult = { changed: false, reason: 'no-grid-found' };
        } else {
            const desiredSize = 500;
            await page.addScriptTag({
                content: `(function() {
                    try {
                        var grid = $find(${JSON.stringify(gridClientId)});
                        if (!grid) { window.__dashPageSizeResult = { changed: false, reason: 'no-grid-client' }; return; }
                        var mtv = grid.get_masterTableView();
                        var cur = mtv.get_pageSize();
                        if (cur === ${desiredSize}) { window.__dashPageSizeResult = { changed: false, newSize: cur, gridId: ${JSON.stringify(gridClientId)}, reason: 'already-at-target' }; return; }
                        mtv.set_pageSize(${desiredSize});
                        mtv.rebind();
                        window.__dashPageSizeResult = { changed: true, newSize: ${desiredSize}, gridId: ${JSON.stringify(gridClientId)} };
                    } catch (e) {
                        window.__dashPageSizeResult = { changed: false, reason: 'telerik-api-failed: ' + e.message };
                    }
                })();`,
            });
            // eslint-disable-next-line no-undef
            pageSizeResult = await page.evaluate(
                () => window.__dashPageSizeResult || { changed: false, reason: 'no-result' }
            );
        }
        if (pageSizeResult.changed) {
            console.log(`Page size change attempted → ${pageSizeResult.newSize} (grid ${pageSizeResult.gridId})`);
            await page.waitForTimeout(2500);
            pagerInfo = await page.evaluate(() => {
                const pager = document.querySelector('.rgPagerCell');
                const text = pager?.textContent?.replace(/\s+/g, ' ').trim() || '';
                const match = text.match(/(\d+) items in (\d+) pages/);
                return { totalItems: match ? parseInt(match[1]) : 0, totalPages: match ? parseInt(match[2]) : 0 };
            });
            console.log(`After set_pageSize attempt: ${pagerInfo.totalItems} records, ${pagerInfo.totalPages} pages`);
        } else {
            console.log(`Page size not changed: ${JSON.stringify(pageSizeResult)}`);
        }

        // Capture grid data — iterate pages if the grid still shows <= 1 page worth of data.
        // Uses the RadGrid client API via an injected <script> tag (non-strict context).
        async function captureCurrentPage() {
            return await page.evaluate((fields) => {
                const headerCells = [];
                document.querySelectorAll('.rgMasterTable thead th').forEach((th) => {
                    const link = th.querySelector('a');
                    headerCells.push(link ? link.textContent.trim() : th.textContent.trim());
                });
                const rows = [];
                document
                    .querySelectorAll('.rgMasterTable tbody tr.rgRow, .rgMasterTable tbody tr.rgAltRow')
                    .forEach((tr) => {
                        const cells = {};
                        let formId = '';
                        tr.querySelectorAll('td').forEach((td, j) => {
                            const header = headerCells[j];
                            const text = td.textContent.trim();
                            if (header === 'Form ID') formId = text;
                            if (fields.includes(header)) cells[header] = text || null;
                        });
                        if (formId) rows.push({ formId, fields: cells });
                    });
                return { headers: headerCells, rows };
            }, ALL_DATE_FIELDS);
        }

        async function clickNextPage() {
            // Fire the Next-Page postback directly via an injected non-strict script.
            // The button's onclick is `javascript:__doPostBack('...$ctl28','')` but clicking
            // the element doesn't reliably trigger in headless Chrome. Bypassing via __doPostBack.
            const nextBtnName = await page.evaluate(() => {
                const btn = document.querySelector('.rgPagerCell input.rgPageNext');
                return btn ? btn.name : null;
            });
            if (!nextBtnName) return false;

            // Capture current first Form ID so we know when AJAX has replaced the grid.
            const beforeFirstId = await page.evaluate(() => {
                const headerCells = [];
                document.querySelectorAll('.rgMasterTable thead th').forEach((th) => {
                    const link = th.querySelector('a');
                    headerCells.push(link ? link.textContent.trim() : th.textContent.trim());
                });
                const fidIdx = headerCells.indexOf('Form ID');
                if (fidIdx < 0) return null;
                const tr = document.querySelector('.rgMasterTable tbody tr.rgRow, .rgMasterTable tbody tr.rgAltRow');
                return tr?.querySelectorAll('td')[fidIdx]?.textContent?.trim() || null;
            });

            await page.addScriptTag({
                content: `(function(){ try { __doPostBack(${JSON.stringify(nextBtnName)}, ''); window.__dashNextClicked = true; } catch(e){ window.__dashNextClicked = false; window.__dashNextErr = e.message; } })();`,
            });

            // eslint-disable-next-line no-undef
            const fired = await page.evaluate(() => window.__dashNextClicked === true);
            if (!fired) return false;

            try {
                await page.waitForFunction(
                    (before) => {
                        const headerCells = [];
                        document.querySelectorAll('.rgMasterTable thead th').forEach((th) => {
                            const link = th.querySelector('a');
                            headerCells.push(link ? link.textContent.trim() : th.textContent.trim());
                        });
                        const fidIdx = headerCells.indexOf('Form ID');
                        if (fidIdx < 0) return false;
                        const tr = document.querySelector(
                            '.rgMasterTable tbody tr.rgRow, .rgMasterTable tbody tr.rgAltRow'
                        );
                        const first = tr?.querySelectorAll('td')[fidIdx]?.textContent?.trim();
                        return first && first !== before;
                    },
                    beforeFirstId,
                    { timeout: 20000 }
                );
            } catch {
                return false;
            }
            await page.waitForTimeout(400);
            return true;
        }

        // Cap iterations to control wall time; prioritize a broad sample across the record set.
        const MAX_PAGES = Math.min(pagerInfo.totalPages, 40);
        const allRowsByFormId = new Map();
        let initial = await captureCurrentPage();
        for (const r of initial.rows) allRowsByFormId.set(r.formId, r);
        let pagesCaptured = 1;
        for (let p = 2; p <= MAX_PAGES; p++) {
            const ok = await clickNextPage();
            if (!ok) {
                console.log(`  (clickNextPage failed at page ${p} — stopping pagination)`);
                break;
            }
            const cap = await captureCurrentPage();
            for (const r of cap.rows) allRowsByFormId.set(r.formId, r);
            pagesCaptured++;
            if (p % 10 === 0)
                console.log(`  ...captured ${pagesCaptured} pages, ${allRowsByFormId.size} unique rows so far`);
        }
        const gridData = {
            headers: initial.headers,
            rows: [...allRowsByFormId.values()],
            totalRows: allRowsByFormId.size,
        };
        console.log(`Captured ${gridData.totalRows} rows across ${pagesCaptured} pages (of ${pagerInfo.totalPages})`);

        // Build results per test record × config
        const results = [];

        // DB-1, DB-2, DB-3: Grid cell value verification
        for (const row of gridData.rows) {
            for (const [config, field] of Object.entries(FIELD_MAP)) {
                const cellValue = row.fields[field] || null;
                results.push({
                    formId: row.formId,
                    config,
                    field,
                    cellValue,
                });
            }
        }

        await context.close();
        await browser.close();

        // Capture build context so the timeline tool can correlate this run with a platform build
        const buildContext = await captureBuildContext().catch(() => null);
        if (buildContext) buildContext.fingerprint = fingerprint(buildContext);

        // Save results
        const output = {
            timestamp: new Date().toISOString(),
            buildContext,
            pager: pagerInfo,
            totalRows: gridData.totalRows,
            totalResults: results.length,
            results,
        };

        fs.writeFileSync(RESULTS_PATH, JSON.stringify(output, null, 2));
        console.log(`\nResults saved: ${RESULTS_PATH}`);
        console.log(
            `Total: ${gridData.totalRows} rows × ${Object.keys(FIELD_MAP).length} configs = ${results.length} cell values`
        );
    }

    if (skipArtifacts) {
        console.log('\n--skip-artifacts: skipping artifact generation');
        return;
    }

    // Phase 2: Generate artifacts
    console.log('\n=== Phase 2: Generating artifacts ===\n');

    const genArgs = ['node', GENERATOR_PATH];
    if (categoryFilter) genArgs.push('--category', categoryFilter);

    try {
        require('child_process').execSync(genArgs.join(' '), {
            cwd: REPO_ROOT,
            stdio: 'inherit',
        });
    } catch (err) {
        console.error('Artifact generation failed:', err.message);
        process.exit(1);
    }

    console.log('\n=== Done ===');
}

main().catch((err) => {
    console.error(`Dashboard regression error: ${err.message}`);
    process.exit(1);
});
