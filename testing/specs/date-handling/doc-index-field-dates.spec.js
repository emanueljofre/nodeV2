/**
 * Document Index Field Date Handling Tests
 *
 * Data-driven tests for document library date storage, retrieval, and timezone
 * handling via the REST API. Test cases defined in testing/fixtures/test-data.js
 * (DOC_TEST_DATA array).
 *
 * Confirmed bugs tested:
 *   DOC-BUG-1: Timezone offset converted to UTC with Z stripped → ambiguous values
 *   DOC-BUG-2: Cannot clear a date index field once set
 *
 * Matrix: research/date-handling/document-library/matrix.md (8 categories, 52 slots)
 *
 * Prerequisites:
 *   - Test document with Date index field (per-customer config in vv-config.js)
 *   - Configured via .env.json
 *
 * Run:
 *   npx playwright test --config=testing/playwright.config.js --project=BRT-chromium testing/specs/date-handling/doc-index-field-dates.spec.js
 */
const { test, expect } = require('@playwright/test');
const { loadConfig } = require('../../fixtures/env-config');
const { customerDocConfig } = require('../../fixtures/vv-config');
const { DOC_TEST_DATA } = require('../../fixtures/test-data');
const { guardedPut, guardedPost } = require('../../helpers/vv-request');

const config = loadConfig();
const BASE_URL = config.baseUrl;
const API_BASE = `/api/v1/${config.customerAlias}/${config.databaseAlias}`;

// Skip the whole spec if this customer has no doc-test assets configured
// (missing testDocumentId, docapi disabled, etc.). Prevents 30+ noisy failures.
const DOC_ENABLED = !!(customerDocConfig && customerDocConfig.testDocumentId);
const DOC_ID = customerDocConfig?.testDocumentId || null;
const DATE_FIELD_LABEL = customerDocConfig?.dateFieldLabel || null;
const PRESET_FIELD_LABEL = customerDocConfig?.presetDateFieldLabel || null;
const TEST_FOLDER_ID = customerDocConfig?.testFolderId || null;
const DOC11_ENABLED = DOC_ENABLED && !!PRESET_FIELD_LABEL && !!TEST_FOLDER_ID;

let token;

async function getToken(request) {
    if (token) return token;
    const resp = await request.post(`${BASE_URL}/OAuth/Token`, {
        form: {
            client_id: config.clientId,
            client_secret: config.clientSecret,
            username: config.username,
            password: config.password,
            grant_type: 'password',
        },
    });
    expect(resp.ok()).toBeTruthy();
    token = (await resp.json()).access_token;
    return token;
}

async function writeDateField(request, value) {
    const t = await getToken(request);
    const resp = await guardedPut(request, `${BASE_URL}${API_BASE}/documents/${DOC_ID}/indexfields`, {
        headers: { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' },
        data: { indexFields: JSON.stringify({ [DATE_FIELD_LABEL]: value }) },
    });
    expect(resp.ok()).toBeTruthy();
}

async function readDateField(request) {
    const t = await getToken(request);
    const resp = await request.get(`${BASE_URL}${API_BASE}/documents/${DOC_ID}/indexfields`, {
        headers: { Authorization: `Bearer ${t}` },
    });
    expect(resp.ok()).toBeTruthy();
    const data = (await resp.json()).data || [];
    const field = data.find((f) => f.label === DATE_FIELD_LABEL);
    return field?.value ?? null;
}

test.describe.configure({ mode: 'serial' });

// Top-level skip: no test assets or docapi disabled for this env.
test.beforeEach(() => {
    test.skip(
        !DOC_ENABLED,
        `Document-library tests skipped for ${config.instance} — no customerDocConfig or docapi disabled. ` +
            `Populate CUSTOMER_DOC_CONFIG in testing/fixtures/vv-config.js with a test document + date field to enable.`
    );
});

// ---------------------------------------------------------------------------
// DOC-1: API Write Format Normalization
// ---------------------------------------------------------------------------
const doc1Tests = DOC_TEST_DATA.filter((t) => t.category === 1);

test.describe('DOC-1: Format Normalization', () => {
    for (const tc of doc1Tests) {
        const skip = tc.expectedStored === null; // TBD slots
        test(`${tc.id}: ${tc.notes}`, async ({ request }) => {
            if (skip) {
                // Run the test but record actual value for TBD slots
                await writeDateField(request, tc.inputValue);
                const stored = await readDateField(request);
                console.log(`[TBD] ${tc.id}: input="${tc.inputValue}" → stored="${stored}"`);
                expect(stored).toBeTruthy(); // At minimum, something was stored
                return;
            }
            await writeDateField(request, tc.inputValue);
            const stored = await readDateField(request);
            expect(stored).toBe(tc.expectedStored);
        });
    }
});

// ---------------------------------------------------------------------------
// DOC-2: Timezone Offset Handling (DOC-BUG-1)
// ---------------------------------------------------------------------------
const doc2Tests = DOC_TEST_DATA.filter((t) => t.category === 2);

test.describe('DOC-2: TZ Offset Handling (DOC-BUG-1)', () => {
    for (const tc of doc2Tests) {
        const skip = tc.expectedStored === null;
        test(`${tc.id}: ${tc.notes}`, async ({ request }) => {
            if (skip) {
                await writeDateField(request, tc.inputValue);
                const stored = await readDateField(request);
                console.log(`[TBD] ${tc.id}: input="${tc.inputValue}" → stored="${stored}"`);
                expect(stored).toBeTruthy();
                return;
            }
            await writeDateField(request, tc.inputValue);
            const stored = await readDateField(request);
            expect(stored).toBe(tc.expectedStored);

            // DOC-BUG-1 verification: response should never contain Z
            if (tc.id === 'doc-2-no-z-resp') {
                expect(stored).not.toContain('Z');
            }
        });
    }
});

// ---------------------------------------------------------------------------
// DOC-3: Field Clearing & Empty Values (DOC-BUG-2)
// ---------------------------------------------------------------------------
const doc3Tests = DOC_TEST_DATA.filter((t) => t.category === 3);

test.describe('DOC-3: Field Clearing (DOC-BUG-2)', () => {
    // Set a known value before all clearing attempts
    const SEED_VALUE = '2026-06-01T12:00:00';

    for (const tc of doc3Tests) {
        test(`${tc.id}: ${tc.notes}`, async ({ request }) => {
            // Seed with known value
            await writeDateField(request, SEED_VALUE);
            const before = await readDateField(request);
            expect(before).toBe(SEED_VALUE);

            // Attempt to clear
            await writeDateField(request, tc.inputValue);
            const after = await readDateField(request);

            // DOC-BUG-2: previous value persists for all known clearing methods
            if (tc.expectedStored === null) {
                // TBD slot — log actual behavior
                console.log(`[TBD] ${tc.id}: clear="${tc.inputValue}" → after="${after}"`);
                // Most likely persists, but log for confirmation
            } else {
                expect(after).toBe(SEED_VALUE); // BUG: should be null/empty, but persists
            }
        });
    }
});

// ---------------------------------------------------------------------------
// DOC-4: Update Path & Overwrite
// ---------------------------------------------------------------------------
const doc4Tests = DOC_TEST_DATA.filter((t) => t.category === 4);

test.describe('DOC-4: Update Path & Overwrite', () => {
    for (const tc of doc4Tests) {
        test(`${tc.id}: ${tc.notes}`, async ({ request }) => {
            // First write
            await writeDateField(request, tc.inputValue);
            const first = await readDateField(request);
            expect(first).toBeTruthy();

            // Second write (overwrite)
            await writeDateField(request, tc.inputValue2);
            const second = await readDateField(request);
            expect(second).toBe(tc.expectedStored);
        });
    }
});

// ---------------------------------------------------------------------------
// Cross-cutting verifications (not data-driven)
// ---------------------------------------------------------------------------
test.describe('Cross-cutting: Z suffix behavior', () => {
    test('API response never includes Z suffix on index field dates', async ({ request }) => {
        await writeDateField(request, '2026-03-15T14:30:00');
        const stored = await readDateField(request);
        expect(stored).not.toContain('Z');
        expect(stored).toBe('2026-03-15T14:30:00');
    });

    test('Built-in document dates include Z suffix (UTC)', async ({ request }) => {
        const t = await getToken(request);
        const resp = await request.get(`${BASE_URL}${API_BASE}/documents/${DOC_ID}`, {
            headers: { Authorization: `Bearer ${t}` },
        });
        const doc = (await resp.json()).data;

        // Built-in dates have Z — they're explicitly UTC
        expect(doc.createDate).toMatch(/Z$/);
        expect(doc.modifyDate).toMatch(/Z$/);
        // This proves the same server handles both, but index fields strip Z
    });
});

// ---------------------------------------------------------------------------
// DOC-11 helpers — fresh-doc upload and arbitrary-field read/write
// ---------------------------------------------------------------------------

async function uploadFreshDoc(request) {
    const t = await getToken(request);
    const name = `zzz-doc11-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const resp = await guardedPost(request, `${BASE_URL}${API_BASE}/documents`, {
        headers: { Authorization: `Bearer ${t}` },
        multipart: {
            name,
            filename: `${name}.txt`,
            folderId: TEST_FOLDER_ID,
            description: 'DOC-11 fresh doc (auto-cleanup candidate)',
            revision: '1',
            indexFields: JSON.stringify({}),
            fileUpload: {
                name: `${name}.txt`,
                mimeType: 'text/plain',
                buffer: Buffer.from('DOC-11 test fixture', 'utf8'),
            },
        },
    });
    expect(resp.ok()).toBeTruthy();
    const body = await resp.json();
    const row = Array.isArray(body?.data) ? body.data[0] : body?.data;
    expect(row?.id).toBeTruthy();
    // POST /documents returns the revisionId as `id`. Resolve the stable documentId
    // by re-listing the folder and matching on revision id.
    const listResp = await request.get(`${BASE_URL}${API_BASE}/folders/${TEST_FOLDER_ID}/documents`, {
        headers: { Authorization: `Bearer ${t}` },
    });
    expect(listResp.ok()).toBeTruthy();
    const listed = (await listResp.json()).data || [];
    const full = listed.find((d) => d.id === row.id);
    expect(full?.documentId).toBeTruthy();
    return { revisionId: full.id, documentId: full.documentId, name };
}

async function readFieldValue(request, docId, fieldLabel) {
    const t = await getToken(request);
    const resp = await request.get(`${BASE_URL}${API_BASE}/documents/${docId}/indexfields`, {
        headers: { Authorization: `Bearer ${t}` },
    });
    expect(resp.ok()).toBeTruthy();
    const data = (await resp.json()).data || [];
    const f = data.find((x) => x.label === fieldLabel);
    return f?.value ?? null;
}

async function writeFieldValue(request, docId, fieldLabel, value) {
    const t = await getToken(request);
    const resp = await guardedPut(request, `${BASE_URL}${API_BASE}/documents/${docId}/indexfields`, {
        headers: { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' },
        data: { indexFields: JSON.stringify({ [fieldLabel]: value }) },
    });
    expect(resp.ok()).toBeTruthy();
}

async function readFieldDefinition(request, fieldLabel) {
    const t = await getToken(request);
    const resp = await request.get(`${BASE_URL}${API_BASE}/indexfields`, {
        headers: { Authorization: `Bearer ${t}` },
    });
    expect(resp.ok()).toBeTruthy();
    const data = (await resp.json()).data || [];
    return data.find((f) => f.label === fieldLabel || f.name === fieldLabel) || null;
}

// ---------------------------------------------------------------------------
// DOC-11: Index Field Default Value Behavior
// ---------------------------------------------------------------------------
const doc11Tests = DOC_TEST_DATA.filter((t) => t.category === 11);

test.describe('DOC-11: Index Field Default Value', () => {
    test.beforeEach(() => {
        test.skip(
            !DOC11_ENABLED,
            `DOC-11 skipped — customerDocConfig needs testFolderId + presetDateFieldLabel. Provision via: node tools/admin/setup-doc-test-assets.js`
        );
    });

    for (const tc of doc11Tests) {
        test(`${tc.id}: ${tc.notes}`, async ({ request }) => {
            const fieldLabel = tc.field === 'preset' ? PRESET_FIELD_LABEL : DATE_FIELD_LABEL;
            const skip = tc.expectedStored === null; // TBD slots — log actual and pass through

            // Field-definition inspection (no doc needed)
            if (tc.action === 'field-definition-inspect') {
                const def = await readFieldDefinition(request, fieldLabel);
                expect(def).toBeTruthy();
                console.log(`[${tc.id}] defaultValue="${def.defaultValue}"`);
                expect(def.defaultValue).toBe(tc.expectedStored);
                expect(def.defaultValue).not.toContain('Z');
                return;
            }

            // Existing-doc round-trip
            if (tc.action === 'api-write-read') {
                await writeFieldValue(request, DOC_ID, fieldLabel, tc.inputValue);
                const stored = await readFieldValue(request, DOC_ID, fieldLabel);
                expect(stored).toBe(tc.expectedStored);
                return;
            }

            // Fresh-doc flows
            const doc = await uploadFreshDoc(request);

            if (tc.action === 'fresh-doc-read') {
                const stored = await readFieldValue(request, doc.documentId, fieldLabel);
                console.log(`[${tc.id}] doc=${doc.documentId} read="${stored}"`);
                if (!skip) expect(stored).toBe(tc.expectedStored);
                return;
            }

            if (tc.action === 'fresh-doc-update') {
                // Read default first (if present) for context
                const before = await readFieldValue(request, doc.documentId, fieldLabel);
                await writeFieldValue(request, doc.documentId, fieldLabel, tc.inputValue);
                const after = await readFieldValue(request, doc.documentId, fieldLabel);
                console.log(
                    `[${tc.id}] doc=${doc.documentId} before="${before}" wrote="${tc.inputValue}" after="${after}"`
                );
                if (!skip) expect(after).toBe(tc.expectedStored);
                return;
            }

            throw new Error(`Unknown DOC-11 action: ${tc.action}`);
        });
    }
});

// ---------------------------------------------------------------------------
// DOC-5 through DOC-10: Future categories (require additional infrastructure)
//
// DOC-5: UI Round-Trip — needs Playwright helper for RadDateTimePicker + checkout
// DOC-6: Cross-Layer Comparison — needs forms test coordination
// DOC-7: Query & Search — needs document query API investigation
// DOC-8: DocAPI Infrastructure Differential — needs WADNR test document setup
// DOC-9: Culture (ptBR) — needs Central Admin customer-culture toggle
// DOC-10: Lifecycle defaults — needs fresh-doc uploads + date math verification
// ---------------------------------------------------------------------------
