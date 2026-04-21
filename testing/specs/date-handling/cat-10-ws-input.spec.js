/**
 * Category 10 — Web Service Input
 *
 * Simulates a REST API write (scheduled script, form button, WS call) then
 * verifies BOTH what the server stored AND what Forms V1 presents when the
 * record is opened. The gap between those two is the CB-8 cross-layer shift.
 *
 * Per-test pipeline (action: 'wsApiCreateAndLoad'):
 *   1. POST /api/v1/{customer}/{db}/formtemplates/{templateId}/forms with the
 *      target field set to tc.inputDateStr  →  record created, id returned
 *   2. GET the record via OData and assert expectedApiStored (server side)
 *   3. Navigate to /FormViewer/app?DataID=... using a tolerant nav helper that
 *      dismisses the Kendo "value undefined" notification fired during init
 *   4. Capture getValueObjectValue + GetFieldValue + display input
 *   5. Assert expectedRaw / expectedApi / expectedDisplay (client side)
 *
 * Fresh records per run — no reliance on pre-existing fixture records.
 *
 * Expected values reflect OBSERVED behavior so the regression detects drift.
 * Source: ws-4-batch-run-1.md + cat10-gaps-run-1.md (2026-04-02).
 */
const { test, expect } = require('@playwright/test');
const { FIELD_MAP, FORM_TEMPLATE_URL, vvConfig } = require('../../fixtures/vv-config');
const { TEST_DATA } = require('../../fixtures/test-data');
const { captureFieldValues, captureDisplayValue } = require('../../helpers/vv-form');
const { guardedPost } = require('../../helpers/vv-request');

const categoryTests = TEST_DATA.filter((t) => t.category === 10);

const API_BASE = `/api/v1/${vvConfig.customerAlias}/${vvConfig.databaseAlias}`;

// Known V2 customers — avoids a browser nav just for scope detection.
// Add entries when more customers migrate to useUpdatedCalendarValueLogic=true.
const V2_CUSTOMER_KEYS = new Set(['EmanuelJofre-vv5dev']);
const ENV_SCOPE = V2_CUSTOMER_KEYS.has(vvConfig.customerKey) ? 'V2' : 'V1';

function parseTemplateIdFromUrl(url) {
    const match = /[?&]formid=([^&]+)/i.exec(url);
    if (!match) throw new Error(`Cannot extract formid from FORM_TEMPLATE_URL: ${url}`);
    return match[1].toLowerCase();
}

const TEMPLATE_ID = parseTemplateIdFromUrl(FORM_TEMPLATE_URL);

let cachedToken = null;
async function getToken(request) {
    if (cachedToken) return cachedToken;
    const resp = await request.post(`${vvConfig.baseUrl}/OAuth/Token`, {
        form: {
            client_id: vvConfig.clientId,
            client_secret: vvConfig.clientSecret,
            username: vvConfig.username,
            password: vvConfig.password,
            grant_type: 'password',
        },
    });
    expect(resp.ok()).toBeTruthy();
    cachedToken = (await resp.json()).access_token;
    return cachedToken;
}

async function apiPostForm(request, fieldValues) {
    const t = await getToken(request);
    const resp = await guardedPost(request, `${vvConfig.baseUrl}${API_BASE}/formtemplates/${TEMPLATE_ID}/forms`, {
        headers: { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' },
        data: fieldValues,
    });
    expect(resp.ok()).toBeTruthy();
    const body = await resp.json();
    const created = (body.data && (Array.isArray(body.data) ? body.data[0] : body.data)) || body;
    // VV postForms returns `revisionId` (record GUID, used as DataID in URLs) but no `id` field.
    const dataId = created.revisionId || created.id || created.dhDocId || created.DhDocID;
    return { instanceName: created.instanceName, revisionId: created.revisionId, id: dataId, dataId };
}

async function apiGetFormByQuery(request, query) {
    const t = await getToken(request);
    const resp = await request.get(`${vvConfig.baseUrl}${API_BASE}/formtemplates/${TEMPLATE_ID}/forms`, {
        headers: { Authorization: `Bearer ${t}` },
        params: { q: query, expand: 'true' },
    });
    expect(resp.ok()).toBeTruthy();
    return (await resp.json()).data || [];
}

async function apiReadRecord(request, instanceName, dataId) {
    // Prefer instanceName (e.g., "DateTest-000123"); fall back to id GUID.
    let rows = [];
    if (instanceName) rows = await apiGetFormByQuery(request, `[instanceName] eq '${instanceName}'`);
    if (!rows.length && dataId) rows = await apiGetFormByQuery(request, `[id] eq '${dataId}'`);
    return rows[0];
}

function caseInsensitiveField(record, fieldName) {
    if (!record) return undefined;
    const target = fieldName.toLowerCase();
    const key = Object.keys(record).find((k) => k.toLowerCase() === target);
    return key ? record[key] : undefined;
}

function buildRecordUrl(dataId) {
    return FORM_TEMPLATE_URL.replace(/([?&])formid=[^&]+/i, `$1DataID=${dataId}`);
}

/**
 * Navigate to a saved record URL tolerating Kendo "The value 'undefined' is not
 * valid" notifications that VV fires when a record has sparse fields (e.g. only
 * the POST target was set). The alert blocks `networkidle` because it keeps an
 * Angular digest loop pending, so we use `domcontentloaded` and poll for
 * fieldMaster while dismissing any notification/popover Close buttons we find.
 */
async function gotoSavedRecord(page, url, timeout = 45000) {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout });
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
        // Dismiss any Kendo notifications / popovers that block init.
        await page
            .evaluate(() => {
                const selectors = [
                    '.k-notification .k-i-close',
                    '.k-notification a.k-notification-close',
                    '.k-notification [class*="close"]',
                    '.notification-close',
                    '[aria-label="Close"]',
                ];
                selectors.forEach((sel) => document.querySelectorAll(sel).forEach((el) => el.click && el.click()));
            })
            .catch(() => {});
        const ready = await page
            .evaluate(
                () =>
                    typeof VV !== 'undefined' &&
                    VV.Form &&
                    VV.Form.VV &&
                    VV.Form.VV.FormPartition &&
                    VV.Form.VV.FormPartition.fieldMaster
            )
            .catch(() => false);
        if (ready) return;
        await page.waitForTimeout(250);
    }
    throw new Error(
        `Saved record did not initialize within ${timeout}ms (even after dismissing notifications). URL: ${url}`
    );
}

for (const tc of categoryTests) {
    test.describe(`TC-${tc.id}: ${tc.categoryName}, Config ${tc.config}`, () => {
        test(`${tc.action} via ${tc.inputDateStr || '(empty)'}`, async ({ page, request }, testInfo) => {
            test.skip(
                !testInfo.project.name.startsWith(tc.tz) || !testInfo.project.name.endsWith('chromium'),
                `Skipping — test is for ${tc.tz}-chromium`
            );
            const entryScope = tc.scope || 'V1';
            test.skip(ENV_SCOPE !== entryScope, `Entry scope=${entryScope} but active env is ${ENV_SCOPE}`);

            const fieldCfg = FIELD_MAP[tc.config];
            const fieldName = fieldCfg.field;

            // 1) Create record via API
            const created = await apiPostForm(request, { [fieldName]: tc.inputDateStr });

            // 2) Read back via API — server-side assertion (expectedApiStored)
            const record = await apiReadRecord(request, created.instanceName, created.id);
            const stored = caseInsensitiveField(record, fieldName) ?? '';
            expect(stored, `API-stored value for ${fieldName}`).toBe(tc.expectedApiStored);

            // If the API stored nothing (e.g., epoch input silently discarded), there's
            // no meaningful browser observable — the API-side assertion above is the test.
            if (tc.expectedApiStored === '' && tc.expectedRaw === '' && tc.expectedApi === '') {
                return;
            }

            // 3) Open the record in the browser — client-side observables
            await gotoSavedRecord(page, buildRecordUrl(created.id));
            // Wait for the target field's rawValue to populate. On some loads VV does a
            // deferred population pass after fieldMaster is ready. If the expected value
            // is empty (e.g. epoch case with null storage), settle briefly then capture.
            if (tc.expectedRaw) {
                await page
                    .waitForFunction(
                        (name) => {
                            const v = VV.Form.VV.FormPartition.getValueObjectValue(name);
                            return v !== undefined && v !== null && v !== '';
                        },
                        fieldName,
                        { timeout: 15000 }
                    )
                    .catch(() => {}); // Swallow — the assertion below surfaces a clearer error
            } else {
                await page.waitForTimeout(1000);
            }

            const values = await captureFieldValues(page, fieldName);
            const display = await captureDisplayValue(page, fieldName);

            // Soft asserts so a single run reveals all three observations per test
            // (otherwise the first failure short-circuits and hides api/display drift).
            expect.soft(values.raw ?? '', `rawValue for ${fieldName}`).toBe(tc.expectedRaw);
            expect.soft(values.api ?? '', `GetFieldValue for ${fieldName}`).toBe(tc.expectedApi);
            if (tc.expectedDisplay !== undefined) {
                expect.soft(display ?? '', `display for ${fieldName}`).toBe(tc.expectedDisplay);
            }
        });
    });
}
