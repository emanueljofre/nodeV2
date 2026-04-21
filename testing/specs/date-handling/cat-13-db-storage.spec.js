/**
 * Category 13 — Database Storage Verification (via REST API)
 *
 * Verifies what VV actually stores in the database for date fields under
 * different write paths. Reads back via the REST getForms endpoint — the
 * server-returned value reflects the stored datetime (with a trailing "Z"
 * appended by the API layer, even for naive local times).
 *
 * Each test creates a FRESH record per run — never asserts on pre-existing
 * fixture records. Old records may have been saved under a different platform
 * build; fresh-record-per-run ensures the assertion exercises current code.
 *
 * Action branches (see fixtures/test-data.js for Cat 13 entries):
 *   - apiWriteRead           POST /formtemplates/{id}/forms  → GET by instanceName → assert per-field
 *   - saveAndApiRead         Open template → SFV → saveFormOnly → GET by dataId → assert per-field
 *   - roundtripSaveAndApiRead Open template → SFV → roundTripCycle N × → saveFormOnly → GET → assert
 *   - querySameLogicalDate   Save from current TZ + from IST (2nd browser context) → OData query →
 *                             assert BRT record found, IST record not found
 *
 * Assumptions:
 *   - Expected values are V1-baselined (vvdemo, WADNR run V1). V2 has its own
 *     observables (vv5dev) — entries default to `scope: 'V1'`; add sibling `.V2`
 *     entries with `scope: 'V2'` and V2 observed values. The scope filter only
 *     applies to actions that exercise the Forms client pipeline; `apiWriteRead`
 *     is server-side and runs on both V1 and V2 environments.
 *   - Target environment must allow writes to the DateTest form template (vvdemo
 *     unrestricted OK; allowlist envs need the template in writePolicy.forms).
 *   - Expected API values carry a trailing "Z" even when the DB stores a naive
 *     datetime — the REST layer appends Z unconditionally on read.
 */
const { test, expect } = require('@playwright/test');
const { FIELD_MAP, FORM_TEMPLATE_URL, vvConfig, AUTH_STATE_PATH } = require('../../fixtures/vv-config');
const { TEST_DATA } = require('../../fixtures/test-data');
const { gotoAndWaitForVVForm, setFieldValue, saveFormOnly, roundTripCycle } = require('../../helpers/vv-form');
const { guardedPost } = require('../../helpers/vv-request');

const categoryTests = TEST_DATA.filter((t) => t.category === 13);

const API_BASE = `/api/v1/${vvConfig.customerAlias}/${vvConfig.databaseAlias}`;

// Known V2 customers — avoids a browser nav just for scope detection.
const V2_CUSTOMER_KEYS = new Set(['EmanuelJofre-vv5dev']);
const ENV_SCOPE = V2_CUSTOMER_KEYS.has(vvConfig.customerKey) ? 'V2' : 'V1';

function parseTemplateIdFromUrl(url) {
    const match = /[?&]formid=([^&]+)/i.exec(url);
    if (!match) {
        throw new Error(`Cannot extract formid from FORM_TEMPLATE_URL: ${url}`);
    }
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
    // VV postForms returns `revisionId` (record GUID) but no `id` field.
    const dataId = created.revisionId || created.id || created.dhDocId || created.DhDocID;
    return { instanceName: created.instanceName, revisionId: created.revisionId, id: dataId, raw: body };
}

async function apiGetFormByQuery(request, query) {
    const t = await getToken(request);
    const url = `${vvConfig.baseUrl}${API_BASE}/formtemplates/${TEMPLATE_ID}/forms`;
    const resp = await request.get(url, {
        headers: { Authorization: `Bearer ${t}` },
        params: { q: query, expand: 'true' },
    });
    expect(resp.ok()).toBeTruthy();
    const body = await resp.json();
    return body.data || [];
}

function caseInsensitiveField(record, fieldName) {
    if (!record) return undefined;
    const target = fieldName.toLowerCase();
    const key = Object.keys(record).find((k) => k.toLowerCase() === target);
    return key ? record[key] : undefined;
}

async function captureInstanceName(page) {
    // VV exposes the instance name through several paths depending on version:
    //   V1 vvdemo: DOM element `.formInstanceName` (Angular directive-bound)
    //   V2 vv5dev: the shell header contains a truncated version; JS state holds the full name
    // Fall through strategies until one yields a non-empty value.
    return page.evaluate(() => {
        // 1. JS state (covers V2 shell)
        if (typeof VV !== 'undefined' && VV.Form) {
            const candidates = [
                VV.Form.InstanceName,
                VV.Form.instanceName,
                VV.Form.VV && VV.Form.VV.InstanceName,
                VV.Form.VV && VV.Form.VV.instanceName,
                VV.Form.VV && VV.Form.VV.FormPartition && VV.Form.VV.FormPartition.InstanceName,
            ];
            for (const c of candidates) {
                if (typeof c === 'string' && c.trim()) return c.trim();
            }
        }
        // 2. DOM element (V1 shell)
        const domEl = document.querySelector('.formInstanceName, [data-field="instanceName"]');
        if (domEl && domEl.textContent.trim()) return domEl.textContent.trim();
        // 3. Document title — VV sets it to the instance name on both shells
        const titleMatch = document.title && document.title.match(/([A-Za-z][\w\s]*-\d+)/);
        if (titleMatch) return titleMatch[1];
        return '';
    });
}

async function saveViaBrowser(page, inputs, testInfo) {
    for (const { field, value } of inputs) {
        await setFieldValue(page, field, value);
    }
    await page.waitForTimeout(300);
    const { dataId } = await saveFormOnly(page);
    const instanceName = await captureInstanceName(page);
    if (testInfo) {
        testInfo.annotations.push({ type: 'savedDataId', description: dataId });
        testInfo.annotations.push({ type: 'savedInstanceName', description: instanceName || '(empty)' });
    }
    return { dataId, instanceName };
}

async function readRecordByInstanceName(request, instanceName, dataId) {
    // Prefer instanceName (record name like "DateTest-000123"); fall back to dataId GUID.
    let rows = [];
    if (instanceName) {
        rows = await apiGetFormByQuery(request, `[instanceName] eq '${instanceName}'`);
    }
    if (!rows.length && dataId) {
        // Try multiple field names for the GUID query — VV OData exposes the record GUID
        // under different names depending on version (id / dhDocId / docId / revisionId).
        for (const field of ['id', 'dhDocId', 'DhDocID', 'docId', 'revisionId']) {
            rows = await apiGetFormByQuery(request, `[${field}] eq '${dataId}'`);
            if (rows.length) break;
        }
    }
    if (!rows.length) {
        throw new Error(
            `No record found for instanceName="${instanceName}" dataId="${dataId}". ` +
                `Tried [instanceName] and [id|dhDocId|DhDocID|docId|revisionId].`
        );
    }
    return rows[0];
}

function resolveField(config, variant) {
    const cfg = FIELD_MAP[config];
    if (!cfg) throw new Error(`Unknown config: ${config}`);
    return variant === 'preset' ? cfg.preset : variant === 'currentDate' ? cfg.currentDate : cfg.field;
}

for (const tc of categoryTests) {
    test.describe(`TC-${tc.id}: ${tc.categoryName}`, () => {
        test(`${tc.action} — ${tc.notes || ''}`.trim(), async ({ page, request, browser }, testInfo) => {
            // Run only in the matching timezone project (first browser engine only —
            // these tests exercise the server storage path, browser engine is not a variable).
            test.skip(
                !testInfo.project.name.startsWith(tc.tz) || !testInfo.project.name.endsWith('chromium'),
                `Skipping — test is for ${tc.tz}-chromium`
            );

            // V1/V2 scope filter — resolved from customerKey. apiWriteRead is pure REST
            // and runs unconditionally on both scopes; other actions gate early so we
            // don't load a form template we're about to skip.
            if (tc.action !== 'apiWriteRead') {
                const entryScope = tc.scope || 'V1';
                test.skip(ENV_SCOPE !== entryScope, `Entry scope=${entryScope} but active env is ${ENV_SCOPE}`);
                await gotoAndWaitForVVForm(page, FORM_TEMPLATE_URL);
            }

            if (tc.action === 'apiWriteRead') {
                // Pure API path — no browser. Build field values from tc.apiInput map.
                const fieldValues = {};
                for (const [config, value] of Object.entries(tc.apiInput)) {
                    const fieldName = resolveField(config, 'base');
                    fieldValues[fieldName] = value;
                }
                const created = await apiPostForm(request, fieldValues);
                const record = await readRecordByInstanceName(request, created.instanceName, created.id);
                for (const [config, expected] of Object.entries(tc.apiAssertions)) {
                    const fieldName = resolveField(config, 'base');
                    const actual = caseInsensitiveField(record, fieldName);
                    expect(actual, `Config ${config} (${fieldName})`).toBe(expected);
                }
                return;
            }

            if (tc.action === 'saveAndApiRead') {
                // Already on template (gotoAndWaitForVVForm was called for V1/V2 check).
                const inputs = (tc.browserInputs || []).map((b) => ({
                    field: resolveField(b.config, b.variant || 'base'),
                    value: b.value,
                }));
                const { dataId, instanceName } = await saveViaBrowser(page, inputs, testInfo);
                const record = await readRecordByInstanceName(request, instanceName, dataId);
                for (const a of tc.apiAssertions) {
                    const fieldName = resolveField(a.config, a.variant || 'base');
                    const actual = caseInsensitiveField(record, fieldName);
                    expect(actual, `Config ${a.config} (${fieldName}, variant ${a.variant || 'base'})`).toBe(
                        a.expected
                    );
                }
                return;
            }

            if (tc.action === 'roundtripSaveAndApiRead') {
                const fieldName = resolveField(tc.config, 'base');
                await setFieldValue(page, fieldName, tc.sfvInput);
                await page.waitForTimeout(300);
                await roundTripCycle(page, fieldName, tc.roundTrips);
                await page.waitForTimeout(300);
                const { dataId } = await saveFormOnly(page);
                const instanceName = await captureInstanceName(page);
                testInfo.annotations.push({ type: 'savedDataId', description: dataId });
                testInfo.annotations.push({ type: 'savedInstanceName', description: instanceName || '(empty)' });
                const record = await readRecordByInstanceName(request, instanceName, dataId);
                const actual = caseInsensitiveField(record, fieldName);
                expect(actual, `Config ${tc.config} (${fieldName}) after ${tc.roundTrips} round-trip(s)`).toBe(
                    tc.expectedApi
                );
                return;
            }

            if (tc.action === 'querySameLogicalDate') {
                // 1) Save record in current (BRT) TZ using the already-loaded page
                const inputsA = (tc.browserInputs || []).map((b) => ({
                    field: resolveField(b.config, b.variant || 'base'),
                    value: b.value,
                }));
                const recA = await saveViaBrowser(page, inputsA, testInfo);

                // 2) Save another record in a second TZ via a new browser context
                const ctxB = await browser.newContext({
                    timezoneId: tc.altTz.timezoneId,
                    storageState: AUTH_STATE_PATH,
                });
                const pageB = await ctxB.newPage();
                await gotoAndWaitForVVForm(pageB, FORM_TEMPLATE_URL);
                const recB = await saveViaBrowser(pageB, inputsA, testInfo);
                await ctxB.close();

                // 3) Query by field value — expect only recA to match
                const queryField = resolveField(tc.queryConfig, 'base');
                const matches = await apiGetFormByQuery(request, `[${queryField}] eq '${tc.queryDate}'`);
                const names = matches.map((m) => m.instanceName);
                expect(names, `query for ${tc.queryDate} should find ${recA.instanceName}`).toContain(
                    recA.instanceName
                );
                expect(
                    names,
                    `query for ${tc.queryDate} should NOT find ${recB.instanceName} (FORM-BUG-7)`
                ).not.toContain(recB.instanceName);
                return;
            }

            throw new Error(`Unknown Cat 13 action: ${tc.action}`);
        });
    });
}
