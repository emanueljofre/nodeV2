/**
 * DB-4 — Dashboard Column Sort Tests
 *
 * Tests sort ordering on date columns in the DateTest dashboard.
 * Triggers column header sort via __doPostBack and verifies that
 * date values are in correct ascending/descending order.
 *
 * Converted from research/date-handling/dashboards/test-sort-v4.js
 */
const { test, expect } = require('@playwright/test');
const path = require('path');
const { customerTemplates, FIELD_MAP } = require('../../fixtures/vv-config');

const AUTH_STATE_PATH = path.join(__dirname, '..', '..', 'config', 'auth-state-pw.json');
const DASHBOARD_URL = customerTemplates.dashboardDateTest;

// Matrix slot IDs use field-alias `f7` (Config A) and `f6` (Config C) for historical
// compatibility with the vvdemo Field7/Field6 naming. Mirror those aliases here so
// tcIds in the reporter match matrix slots regardless of active customer.
const SORT_FIELDS = [
    { matrixAlias: 'f7', field: FIELD_MAP.A.field, desc: 'Config A — date-only, ignoreTZ=false' },
    { matrixAlias: 'f6', field: FIELD_MAP.C.field, desc: 'Config C — DateTime, ignoreTZ=false' },
];

function parseDateValue(str) {
    if (!str || str.trim() === '') return null;
    return new Date(str);
}

function checkOrder(values, ascending) {
    const dates = values.map((v) => parseDateValue(v.value)).filter((d) => d !== null && !isNaN(d));
    let violations = 0;
    for (let i = 1; i < dates.length; i++) {
        const ok = ascending ? dates[i] >= dates[i - 1] : dates[i] <= dates[i - 1];
        if (!ok) violations++;
    }
    return { total: dates.length, violations };
}

test.describe('DB-4: Dashboard Column Sort', () => {
    test.use({ storageState: AUTH_STATE_PATH });

    async function runSort({ page, field, direction }) {
        await page.goto(DASHBOARD_URL, { waitUntil: 'networkidle', timeout: 60000 });
        await page.waitForTimeout(3000);

        const postbackArg = await page.evaluate((fieldName) => {
            const links = document.querySelectorAll('.rgMasterTable thead th a.GridHeaderLink');
            for (const link of links) {
                if (link.textContent.trim() === fieldName) {
                    const href = link.getAttribute('href') || '';
                    const match = href.match(/__doPostBack\('([^']+)'/);
                    return match ? match[1] : null;
                }
            }
            return null;
        }, field);

        expect(postbackArg).not.toBeNull();

        async function captureColumn() {
            return await page.evaluate((fieldName) => {
                const headerCells = [];
                document.querySelectorAll('.rgMasterTable thead th').forEach((th) => {
                    const link = th.querySelector('a');
                    headerCells.push(link ? link.textContent.trim() : th.textContent.trim());
                });
                const colIdx = headerCells.indexOf(fieldName);
                const formIdIdx = headerCells.indexOf('Form ID');
                if (colIdx === -1) return [];
                const values = [];
                document
                    .querySelectorAll('.rgMasterTable tbody tr.rgRow, .rgMasterTable tbody tr.rgAltRow')
                    .forEach((tr) => {
                        const cells = tr.querySelectorAll('td');
                        values.push({
                            formId: cells[formIdIdx]?.textContent.trim() || '',
                            value: cells[colIdx]?.textContent.trim() || '',
                        });
                    });
                return values;
            }, field);
        }

        async function triggerSort() {
            await page.addScriptTag({
                content: `(function() { __doPostBack('${postbackArg}', ''); })();`,
            });
            try {
                await page.waitForResponse((resp) => resp.url().includes('FormDataDetails') && resp.status() === 200, {
                    timeout: 15000,
                });
            } catch {
                // AJAX partial postback
            }
            await page.waitForTimeout(4000);
        }

        // First click = ascending. Second click = descending.
        await triggerSort();
        if (direction === 'desc') await triggerSort();

        const data = await captureColumn();
        const nonEmpty = data.filter((v) => v.value && v.value.trim() !== '');
        const check = checkOrder(nonEmpty, direction === 'asc');

        console.log(`${field} ${direction.toUpperCase()}: ${check.violations} violations / ${check.total} dates`);
        expect(check.violations).toBe(0);
    }

    for (const { matrixAlias, field, desc } of SORT_FIELDS) {
        test(`db-4-${matrixAlias}-asc: ${field} sort ascending — ${desc}`, async ({ page }) => {
            await runSort({ page, field, direction: 'asc' });
        });
        test(`db-4-${matrixAlias}-desc: ${field} sort descending — ${desc}`, async ({ page }) => {
            await runSort({ page, field, direction: 'desc' });
        });
    }
});
