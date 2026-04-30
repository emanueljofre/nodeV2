'use strict';

/**
 * Script Name:    forminstance/ Test Harness
 * Customer:       VisualVault
 * Purpose:        Exercise vvClient.formsApi.formInstances.{postForm, postFormRevision}
 *                 against the DateTest form on EmanuelJofre/vvdemo. Targets the
 *                 forminstance-pattern research task — validates the pattern as
 *                 a workaround for WS-BUG-1 (cross-layer date shift).
 *
 *                 Companion to scripts/examples/webservice-test-harness.js.
 *                 Where WS-10 in that harness compares create paths, this
 *                 harness adds the update path and an end-to-end stability cycle.
 *
 * Preconditions:
 *                 - DateTest form template registered with FormsAPI on the env
 *                 - vvClient.formsApi != null (run forminstance-probe.js first)
 *                 - For FI-UPDATE / FI-CYCLE: writes are allowed on this env
 *
 * Parameters (ffCollection):
 *                 Action:        Required. "FI-CREATE" | "FI-UPDATE" | "FI-CYCLE" | "FI-VS-PF" | "FI-MIGRATE"
 *                 TargetConfigs: Optional. Comma-separated config letters (A-H) or "ALL".
 *                                Default: "C,D,G,H" (the date+time configs affected by WS-BUG-1)
 *                 RecordID:      Required for FI-UPDATE. Instance name (e.g. "DateTest-001234")
 *                 InputDate:     Optional. Naive-local datetime string. Default: "2026-03-15T14:30:00"
 *                                IMPORTANT: do NOT include a trailing 'Z' — the whole point is
 *                                to write naive-local values that don't trigger Controls re-emission
 *                                with a UTC marker.
 *                 SecondInputDate: Optional. For FI-CYCLE — the second value the update writes.
 *                                Default: "2026-03-20T09:15:00"
 *                 Debug:         Optional. "true" to include raw API responses.
 *
 * Returns:
 *                 status:   'Success' | 'Warning' | 'Error'
 *                 data:     Action-specific result envelope (see each handler)
 *                 errors:   string[]
 */

module.exports.getCredentials = function () {
    var env = global.VV_ENV || {};
    return {
        customerAlias: env.customerAlias || 'CUSTOMER ALIAS',
        databaseAlias: env.databaseAlias || 'DATABASE ALIAS',
        clientId: env.clientId || 'CLIENT ID',
        clientSecret: env.clientSecret || 'CLIENT SECRET',
        userId: env.clientId || 'CLIENT ID',
        password: env.clientSecret || 'CLIENT SECRET',
        audience: env.audience || '',
    };
};

module.exports.main = async function (ffCollection, vvClient, response) {
    /* ------------------------------ Configuration ------------------------------ */

    const FORM_TEMPLATE_NAME = 'DateTest';
    const DEFAULT_INPUT = '2026-03-15T14:30:00'; // naive local — no Z
    const DEFAULT_SECOND_INPUT = '2026-03-20T09:15:00'; // naive local — no Z

    // Field config map — mirrors the WS harness FIELD_MAP for DateTest.
    // FI-CREATE/UPDATE/CYCLE default to the date+time configs (C, D, G, H)
    // because WS-BUG-1 only affects enableTime=true fields.
    const FIELD_MAP = {
        A: { field: 'Field7', enableTime: false, ignoreTimezone: false, useLegacy: false },
        B: { field: 'Field10', enableTime: false, ignoreTimezone: true, useLegacy: false },
        C: { field: 'Field6', enableTime: true, ignoreTimezone: false, useLegacy: false },
        D: { field: 'Field5', enableTime: true, ignoreTimezone: true, useLegacy: false },
        E: { field: 'Field12', enableTime: false, ignoreTimezone: false, useLegacy: true },
        F: { field: 'Field11', enableTime: false, ignoreTimezone: true, useLegacy: true },
        G: { field: 'Field14', enableTime: true, ignoreTimezone: false, useLegacy: true },
        H: { field: 'Field13', enableTime: true, ignoreTimezone: true, useLegacy: true },
    };

    /* ------------------------------ Output Envelope ----------------------------- */

    const output = { data: null, errors: [], status: 'Success' };

    function readField(name, fallback) {
        try {
            const f = ffCollection && ffCollection.getFormFieldByName && ffCollection.getFormFieldByName(name);
            return f && f.value ? f.value : fallback;
        } catch (e) {
            return fallback;
        }
    }

    const action = readField('Action', '');
    const rawConfigs = readField('TargetConfigs', 'C,D,G,H');
    const recordID = readField('RecordID', '');
    const inputDate = readField('InputDate', DEFAULT_INPUT);
    const secondInputDate = readField('SecondInputDate', DEFAULT_SECOND_INPUT);
    const isDebug = readField('Debug', 'false') === 'true';

    if (!action) {
        output.status = 'Error';
        output.errors.push('Action parameter is required (FI-CREATE | FI-UPDATE | FI-CYCLE | FI-VS-PF)');
        return response.json(200, output);
    }

    /* --------------------------- Standard Helpers ------------------------------- */

    function parseRes(vvClientRes) {
        try {
            const obj = JSON.parse(vvClientRes);
            if (obj && typeof obj === 'object') return obj;
        } catch (e) {
            /* already parsed */
        }
        return vvClientRes;
    }

    function checkMetaAndStatus(res, shortDescription) {
        if (!res.meta) {
            throw new Error(`${shortDescription} error. No meta in response.`);
        }
        const status = res.meta.status;
        if (status != 200 && status != 201) {
            const reason = res.meta.errors && res.meta.errors[0] ? res.meta.errors[0].reason : 'unspecified';
            throw new Error(`${shortDescription} error. Status: ${status}. Reason: ${reason}`);
        }
        return res;
    }

    function checkDataPropertyExists(res, shortDescription) {
        if (!res.data) throw new Error(`${shortDescription} data property missing. Status: ${res.meta.status}.`);
        return res;
    }

    function checkDataIsNotEmpty(res, shortDescription) {
        const isArr = Array.isArray(res.data);
        const isObj = res.data !== null && typeof res.data === 'object';
        const empty = (isArr && res.data.length === 0) || (isObj && !isArr && Object.keys(res.data).length === 0);
        if (empty) throw new Error(`${shortDescription} returned empty data. Status: ${res.meta.status}.`);
        return res;
    }

    function parseTargetConfigs(raw) {
        if (!raw || raw.toUpperCase() === 'ALL') return Object.keys(FIELD_MAP);
        const configs = raw.split(',').map((s) => s.trim().toUpperCase());
        const invalid = configs.filter((c) => !FIELD_MAP[c]);
        if (invalid.length > 0) throw new Error(`Invalid config(s): ${invalid.join(', ')}. Valid: A-H`);
        return configs;
    }

    function buildResultEntry(configKey, extras) {
        const cfg = FIELD_MAP[configKey];
        return {
            config: configKey,
            fieldName: cfg.field,
            enableTime: cfg.enableTime,
            ignoreTimezone: cfg.ignoreTimezone,
            useLegacy: cfg.useLegacy,
            ...extras,
        };
    }

    function extractDateFields(record, targetConfigs) {
        const recordKeys = Object.keys(record);
        const extracted = {};
        for (const configKey of targetConfigs) {
            const targetLower = FIELD_MAP[configKey].field.toLowerCase();
            const matched = recordKeys.find((k) => k.toLowerCase() === targetLower);
            extracted[configKey] = matched && record[matched] != null ? record[matched] : '';
        }
        return extracted;
    }

    // getForms normalizes datetime fields to ISO+Z on read, regardless of how
    // the record was created or what was sent. To assert "the value we sent
    // round-tripped correctly" we strip the trailing Z and any millisecond
    // suffix from both sides before comparing. The Controls layer (where
    // WS-BUG-1 actually fires) is observed separately via the browser audit.
    function normalizeForCompare(s) {
        if (s == null) return '';
        return String(s)
            .replace(/\.\d{3}Z$/, '')
            .replace(/Z$/, '');
    }
    function valuesMatch(sent, stored) {
        return normalizeForCompare(sent) === normalizeForCompare(stored);
    }

    /* ------------------- Production-Grade forminstance/ Pattern ----------------- */
    // These are the canonical helpers we want to leave behind. Once validated by
    // this harness they should be lifted into a reusable module that WADNR
    // production scripts can import. See research/forminstance-pattern/analysis/02-pattern.md.

    const _templateRevisionCache = {};

    function getTemplateRevisionId(formTemplateName) {
        const shortDescription = `GetTemplateRevisionId for "${formTemplateName}"`;
        if (_templateRevisionCache[formTemplateName]) {
            return Promise.resolve(_templateRevisionCache[formTemplateName]);
        }
        return vvClient.forms.getFormTemplateIdByName(formTemplateName).then((res) => {
            if (!res || !res.templateRevisionIdGuid) {
                throw new Error(
                    `${shortDescription}: template not found, unauthorized, or FormsAPI registration missing`
                );
            }
            _templateRevisionCache[formTemplateName] = res.templateRevisionIdGuid;
            return res.templateRevisionIdGuid;
        });
    }

    function getRecordFormId(formTemplateName, instanceName) {
        const shortDescription = `GetRecordFormId ${instanceName}`;
        const params = {
            q: `[instanceName] eq '${instanceName}'`,
            fields: 'revisionId',
        };
        return vvClient.forms
            .getForms(params, formTemplateName)
            .then((res) => parseRes(res))
            .then((res) => checkMetaAndStatus(res, shortDescription))
            .then((res) => checkDataPropertyExists(res, shortDescription))
            .then((res) => checkDataIsNotEmpty(res, shortDescription))
            .then((res) => res.data[0].revisionId);
    }

    function createRecord(formTemplateName, fields) {
        if (!vvClient.formsApi || !vvClient.formsApi.formInstances) {
            return Promise.reject(
                new Error('vvClient.formsApi.formInstances is not available — run forminstance-probe first')
            );
        }
        const shortDescription = `Create form record (forminstance/) on "${formTemplateName}"`;
        const data = { formName: '', fields };
        return getTemplateRevisionId(formTemplateName)
            .then((revisionId) => vvClient.formsApi.formInstances.postForm(null, data, revisionId))
            .then((res) => parseRes(res))
            .then((res) => checkMetaAndStatus(res, shortDescription))
            .then((res) => checkDataPropertyExists(res, shortDescription))
            .then((res) => checkDataIsNotEmpty(res, shortDescription))
            .then((res) => res.data);
    }

    function updateRecord(formTemplateName, formId, fields) {
        if (!vvClient.formsApi || !vvClient.formsApi.formInstances) {
            return Promise.reject(
                new Error('vvClient.formsApi.formInstances is not available — run forminstance-probe first')
            );
        }
        const shortDescription = `Update form record (forminstance/) ${formId}`;
        const data = { formName: '', fields };
        return getTemplateRevisionId(formTemplateName)
            .then((revisionId) => vvClient.formsApi.formInstances.postFormRevision(null, data, revisionId, formId))
            .then((res) => parseRes(res))
            .then((res) => checkMetaAndStatus(res, shortDescription))
            .then((res) => checkDataPropertyExists(res, shortDescription))
            .then((res) => checkDataIsNotEmpty(res, shortDescription))
            .then((res) => res.data);
    }

    /* ------------------------- postForms control helpers ------------------------ */

    function createFormRecordPostForms(fieldValuesObj) {
        const shortDescription = 'Create record via postForms (control)';
        return vvClient.forms
            .postForms(null, fieldValuesObj, FORM_TEMPLATE_NAME)
            .then((res) => parseRes(res))
            .then((res) => checkMetaAndStatus(res, shortDescription))
            .then((res) => checkDataPropertyExists(res, shortDescription))
            .then((res) => checkDataIsNotEmpty(res, shortDescription))
            .then((res) => res.data);
    }

    function readFormRecord(instanceName) {
        const shortDescription = `Read DateTest record ${instanceName}`;
        const params = {
            q: `[instanceName] eq '${instanceName}'`,
            expand: true,
        };
        return vvClient.forms
            .getForms(params, FORM_TEMPLATE_NAME)
            .then((res) => parseRes(res))
            .then((res) => checkMetaAndStatus(res, shortDescription))
            .then((res) => checkDataPropertyExists(res, shortDescription))
            .then((res) => checkDataIsNotEmpty(res, shortDescription))
            .then((res) => res.data[0]);
    }

    /* ----------------------------- Action Handlers ------------------------------ */

    function dateValueForConfig(configKey, isoNaive) {
        // Date-only fields get just the date portion; date+time get the full naive ISO
        const dateOnly = isoNaive.split('T')[0];
        return FIELD_MAP[configKey].enableTime ? isoNaive : dateOnly;
    }

    function buildFieldsArray(targetConfigs, isoNaive) {
        return targetConfigs.map((configKey) => ({
            key: FIELD_MAP[configKey].field,
            value: dateValueForConfig(configKey, isoNaive),
        }));
    }

    async function actionFiCreate(targetConfigs) {
        const fields = buildFieldsArray(targetConfigs, inputDate);
        const created = await createRecord(FORM_TEMPLATE_NAME, fields);

        // forminstance/ create response shape: { name, formId }
        const instanceName = created.name || created.instanceName;
        const formId = created.formId || created.revisionId;

        const record = await readFormRecord(instanceName);
        const stored = extractDateFields(record, targetConfigs);

        const results = targetConfigs.map((configKey) =>
            buildResultEntry(configKey, {
                sent: dateValueForConfig(configKey, inputDate),
                stored: stored[configKey],
                match: valuesMatch(dateValueForConfig(configKey, inputDate), stored[configKey]),
            })
        );

        const result = {
            action: 'FI-CREATE',
            targetConfigs,
            inputDate,
            recordID: instanceName,
            formId,
            serverTime: new Date().toISOString(),
            results,
        };

        if (isDebug) {
            result.rawCreateResponse = created;
            result.rawRecord = record;
        }

        return result;
    }

    async function actionFiUpdate(targetConfigs) {
        if (!recordID) throw new Error('RecordID is required for FI-UPDATE');

        const formIdBefore = await getRecordFormId(FORM_TEMPLATE_NAME, recordID);
        const recordBefore = await readFormRecord(recordID);
        const storedBefore = extractDateFields(recordBefore, targetConfigs);

        const fields = buildFieldsArray(targetConfigs, inputDate);
        const updated = await updateRecord(FORM_TEMPLATE_NAME, formIdBefore, fields);

        const recordAfter = await readFormRecord(recordID);
        const storedAfter = extractDateFields(recordAfter, targetConfigs);

        const results = targetConfigs.map((configKey) =>
            buildResultEntry(configKey, {
                before: storedBefore[configKey],
                sent: dateValueForConfig(configKey, inputDate),
                after: storedAfter[configKey],
                changed: storedBefore[configKey] !== storedAfter[configKey],
                match: valuesMatch(dateValueForConfig(configKey, inputDate), storedAfter[configKey]),
            })
        );

        const result = {
            action: 'FI-UPDATE',
            targetConfigs,
            inputDate,
            recordID,
            formId: formIdBefore,
            serverTime: new Date().toISOString(),
            results,
        };

        if (isDebug) {
            result.rawUpdateResponse = updated;
            result.rawRecordBefore = recordBefore;
            result.rawRecordAfter = recordAfter;
        }

        return result;
    }

    async function actionFiCycle(targetConfigs) {
        // Full create-then-update stability cycle. Confirms:
        //  1. Initial create writes value as expected
        //  2. Update via postFormRevision changes the value cleanly
        //  3. The values stored at each phase match what we sent (no drift)

        const phase1Fields = buildFieldsArray(targetConfigs, inputDate);
        const created = await createRecord(FORM_TEMPLATE_NAME, phase1Fields);
        const instanceName = created.name || created.instanceName;
        const formId = created.formId || created.revisionId;

        const recordPhase1 = await readFormRecord(instanceName);
        const storedPhase1 = extractDateFields(recordPhase1, targetConfigs);

        const phase2Fields = buildFieldsArray(targetConfigs, secondInputDate);
        const updated = await updateRecord(FORM_TEMPLATE_NAME, formId, phase2Fields);

        const recordPhase2 = await readFormRecord(instanceName);
        const storedPhase2 = extractDateFields(recordPhase2, targetConfigs);

        const results = targetConfigs.map((configKey) =>
            buildResultEntry(configKey, {
                phase1Sent: dateValueForConfig(configKey, inputDate),
                phase1Stored: storedPhase1[configKey],
                phase1Match: valuesMatch(dateValueForConfig(configKey, inputDate), storedPhase1[configKey]),
                phase2Sent: dateValueForConfig(configKey, secondInputDate),
                phase2Stored: storedPhase2[configKey],
                phase2Match: valuesMatch(dateValueForConfig(configKey, secondInputDate), storedPhase2[configKey]),
                changed: storedPhase1[configKey] !== storedPhase2[configKey],
            })
        );

        const result = {
            action: 'FI-CYCLE',
            targetConfigs,
            inputDate,
            secondInputDate,
            recordID: instanceName,
            formId,
            serverTime: new Date().toISOString(),
            results,
        };

        if (isDebug) {
            result.rawCreateResponse = created;
            result.rawUpdateResponse = updated;
            result.rawRecordPhase1 = recordPhase1;
            result.rawRecordPhase2 = recordPhase2;
        }

        return result;
    }

    async function actionFiVsPf(targetConfigs) {
        // Side-by-side: same naive input through postForms vs forminstance/.
        // Data layer comparison only (records read via getForms). The
        // FormViewer/Controls divergence captured separately in the Playwright
        // cross-layer spec. WS-BUG-1 predicts: stored values identical, but
        // Controls re-emits postForms records with Z suffix.

        const fieldValuesObj = {};
        for (const configKey of targetConfigs) {
            fieldValuesObj[FIELD_MAP[configKey].field] = dateValueForConfig(configKey, inputDate);
        }
        const pfCreated = await createFormRecordPostForms(fieldValuesObj);
        const pfRecord = await readFormRecord(pfCreated.instanceName);
        const pfStored = extractDateFields(pfRecord, targetConfigs);

        const fiFields = buildFieldsArray(targetConfigs, inputDate);
        const fiCreated = await createRecord(FORM_TEMPLATE_NAME, fiFields);
        const fiInstanceName = fiCreated.name || fiCreated.instanceName;
        const fiFormId = fiCreated.formId || fiCreated.revisionId;
        const fiRecord = await readFormRecord(fiInstanceName);
        const fiStored = extractDateFields(fiRecord, targetConfigs);

        const results = targetConfigs.map((configKey) =>
            buildResultEntry(configKey, {
                sent: dateValueForConfig(configKey, inputDate),
                postForms: { recordID: pfCreated.instanceName, stored: pfStored[configKey] },
                formInstance: { recordID: fiInstanceName, formId: fiFormId, stored: fiStored[configKey] },
                storedMatch: pfStored[configKey] === fiStored[configKey],
            })
        );

        const result = {
            action: 'FI-VS-PF',
            targetConfigs,
            inputDate,
            postFormsRecordID: pfCreated.instanceName,
            postFormsDataId: pfCreated.revisionId, // for verify-ws10-browser --postforms-id
            formInstanceRecordID: fiInstanceName,
            formInstanceDataId: fiFormId, // for verify-ws10-browser --forminstance-id
            serverTime: new Date().toISOString(),
            results,
        };

        if (isDebug) {
            result.rawPfRecord = pfRecord;
            result.rawFiRecord = fiRecord;
        }

        return result;
    }

    async function actionFiMigrate(targetConfigs) {
        // Open question FI-G1: does updating an existing postForms-created
        // record via formInstances.postFormRevision retroactively fix the
        // cross-layer shift? If yes → existing WADNR records can be cleaned up
        // with a one-shot update sweep. If no → only new records benefit.
        //
        // Sequence:
        //   1. Create record via postForms (control — known to be Z'd by Controls)
        //   2. Read back, capture stored value
        //   3. Update SAME record via formInstances.postFormRevision (the test)
        //   4. Read back again, capture post-migration stored value
        //   5. Return both data IDs so verify-ws10-browser can be run on the
        //      same record before/after to compare cross-layer behavior

        const fieldValuesObj = {};
        for (const configKey of targetConfigs) {
            fieldValuesObj[FIELD_MAP[configKey].field] = dateValueForConfig(configKey, inputDate);
        }

        // Step 1: postForms create
        const pfCreated = await createFormRecordPostForms(fieldValuesObj);
        const recordName = pfCreated.instanceName;
        const dataIdBefore = pfCreated.revisionId; // browser DataID for "before" state

        // Step 2: read back after postForms create
        const recordBefore = await readFormRecord(recordName);
        const storedBefore = extractDateFields(recordBefore, targetConfigs);

        // Step 3: update SAME record via formInstances.postFormRevision
        // We need the formId — for postForms-created records, the revisionId
        // returned by postForms IS the formId for forminstance/ purposes
        // (per the harness's WS-10 fallback `formId || revisionId`).
        const fiFields = buildFieldsArray(targetConfigs, secondInputDate);
        const fiUpdated = await updateRecord(FORM_TEMPLATE_NAME, dataIdBefore, fiFields);

        // Step 4: read back after fi-update
        const recordAfter = await readFormRecord(recordName);
        const storedAfter = extractDateFields(recordAfter, targetConfigs);

        // Find the new dataId — fi-update may rev the record to a new revisionId
        const dataIdAfter = (fiUpdated && (fiUpdated.formId || fiUpdated.revisionId)) || dataIdBefore;

        const results = targetConfigs.map((configKey) =>
            buildResultEntry(configKey, {
                phase1Sent: dateValueForConfig(configKey, inputDate),
                phase1Stored: storedBefore[configKey],
                phase1Match: valuesMatch(dateValueForConfig(configKey, inputDate), storedBefore[configKey]),
                phase2Sent: dateValueForConfig(configKey, secondInputDate),
                phase2Stored: storedAfter[configKey],
                phase2Match: valuesMatch(dateValueForConfig(configKey, secondInputDate), storedAfter[configKey]),
                changed: storedBefore[configKey] !== storedAfter[configKey],
            })
        );

        const result = {
            action: 'FI-MIGRATE',
            targetConfigs,
            inputDate,
            secondInputDate,
            recordID: recordName,
            dataIdBefore, // for verify-ws10-browser --postforms-id (state pre-migration)
            dataIdAfter, // for verify-ws10-browser --forminstance-id (state post-migration)
            note: 'Same record at both data IDs. If browser display matches post-migration value at dataIdAfter, the migration is retroactive (FI-G1=YES). If still shifted, only new records benefit (FI-G1=NO).',
            serverTime: new Date().toISOString(),
            results,
        };

        if (isDebug) {
            result.rawCreateResponse = pfCreated;
            result.rawUpdateResponse = fiUpdated;
            result.rawRecordBefore = recordBefore;
            result.rawRecordAfter = recordAfter;
        }

        return result;
    }

    /* --------------------------------- Dispatch -------------------------------- */

    try {
        const targetConfigs = parseTargetConfigs(rawConfigs);
        let result;
        switch (action) {
            case 'FI-CREATE':
                result = await actionFiCreate(targetConfigs);
                break;
            case 'FI-UPDATE':
                result = await actionFiUpdate(targetConfigs);
                break;
            case 'FI-CYCLE':
                result = await actionFiCycle(targetConfigs);
                break;
            case 'FI-VS-PF':
                result = await actionFiVsPf(targetConfigs);
                break;
            case 'FI-MIGRATE':
                result = await actionFiMigrate(targetConfigs);
                break;
            default:
                throw new Error(
                    `Unknown Action: "${action}". Valid: FI-CREATE | FI-UPDATE | FI-CYCLE | FI-VS-PF | FI-MIGRATE`
                );
        }
        output.data = result;
    } catch (err) {
        output.status = 'Error';
        output.errors.push(err && err.message ? err.message : String(err));
    }

    response.json(200, output);
};
