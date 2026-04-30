# Step 2 — Canonical `forminstance/` Pattern (Production-Ready)

After the [step 1 probe](01-probe.md) confirmed `vvClient.formsApi` is wired up on the target environment, the harness validated the pattern at both layers. This document captures the **production-ready callsite** that WADNR Communications Log scripts (and any other postForms script affected by [WS-BUG-1](../../date-handling/web-services/analysis/ws-bug-1-cross-layer-shift.md)) should adopt.

## What Was Validated

vvdemo / EmanuelJofre / Main, BRT browser TZ, V1 calendar code path. 2026-04-28.

| Concern                                                   | Status        | Evidence                                                                                                                                                                                                                                                                                                                              |
| --------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FormsAPI SDK initialized for vvdemo                       | ✅ PASS       | [`probe-2026-04-28.json`](../../../projects/emanueljofre-vvdemo/testing/forminstance-pattern/probe-2026-04-28.json)                                                                                                                                                                                                                   |
| Create via `formInstances.postForm` — data layer          | ✅ PASS (4/4) | [`fi-create-2026-04-28.json`](../../../projects/emanueljofre-vvdemo/testing/forminstance-pattern/runs/fi-create-2026-04-28.json)                                                                                                                                                                                                      |
| Update via `formInstances.postFormRevision` — data layer  | ✅ PASS (4/4) | [`fi-update-2026-04-28.json`](../../../projects/emanueljofre-vvdemo/testing/forminstance-pattern/runs/fi-update-2026-04-28.json)                                                                                                                                                                                                      |
| Full create→update cycle stability                        | ✅ PASS (4/4) | [`fi-cycle-2026-04-28.json`](../../../projects/emanueljofre-vvdemo/testing/forminstance-pattern/runs/fi-cycle-2026-04-28.json)                                                                                                                                                                                                        |
| Data-layer parity vs `postForms`                          | ✅ PASS (4/4) | [`fi-vs-pf-2026-04-28.json`](../../../projects/emanueljofre-vvdemo/testing/forminstance-pattern/runs/fi-vs-pf-2026-04-28.json) — `storedMatch=true` (as WS-BUG-1 predicts)                                                                                                                                                            |
| **Cross-layer (browser): forminstance/ avoids the shift** | ✅ PASS (4/4) | [`browser-fi-vs-pf-2026-04-28.txt`](../../../projects/emanueljofre-vvdemo/testing/forminstance-pattern/runs/browser-fi-vs-pf-2026-04-28.txt) — postForms `11:30` / fi `14:30`                                                                                                                                                         |
| **Cross-layer after update: still no shift**              | ✅ PASS (4/4) | [`browser-fi-update-2026-04-28.txt`](../../../projects/emanueljofre-vvdemo/testing/forminstance-pattern/runs/browser-fi-update-2026-04-28.txt) — raw value matches sent                                                                                                                                                               |
| **Retroactive migration (FI-G1)**                         | ✅ PASS (4/4) | [`fi-migrate-2026-04-28.json`](../../../projects/emanueljofre-vvdemo/testing/forminstance-pattern/runs/fi-migrate-2026-04-28.json) + browser-after/before. postForms-created record updated via formInstances → cleanly displayed both pre- and post-migration.                                                                       |
| **Dashboard ↔ form display agreement (empirical)**        | ✅ PASS       | [`dashboard-vs-form-2026-04-28.json`](../../../projects/emanueljofre-vvdemo/testing/forminstance-pattern/runs/dashboard-vs-form-2026-04-28.json) — fi-record: SEMANTIC_MATCH all 4 configs (`2:30 PM` ≡ `02:30 PM`, cosmetic only). postForms-record: SHIFT on C/G (dashboard `2:30 PM` vs form `11:30 AM`) — original bug confirmed. |

Headline finding for the original Communication Log report: **using `vvClient.formsApi.formInstances.postForm` for creates and `postFormRevision` for updates eliminates the dashboard ↔ form mismatch**. Both views agree on the user-meaningful local time.

## The Canonical Helper Module

These four helpers are the production pattern. They're inlined in [`scripts/examples/forminstance-test-harness.js`](../../../scripts/examples/forminstance-test-harness.js) for the harness's self-containment, but should be **copied verbatim** into any WADNR script that needs to write date+time fields without triggering WS-BUG-1.

```javascript
// ============================================================
// forminstance/ pattern — production helpers
// Copy into any server-side VV script. Requires the standard
// parseRes / checkMetaAndStatus / checkDataPropertyExists /
// checkDataIsNotEmpty helpers (already used by postForms callers).
// ============================================================

const _templateRevisionCache = {};

function getTemplateRevisionId(formTemplateName) {
    const shortDescription = `GetTemplateRevisionId for "${formTemplateName}"`;
    if (_templateRevisionCache[formTemplateName]) {
        return Promise.resolve(_templateRevisionCache[formTemplateName]);
    }
    return vvClient.forms.getFormTemplateIdByName(formTemplateName).then((res) => {
        // The SDK silently swallows errors here and resolves with empty strings.
        // Explicit null-check turns that into a real error rather than a cryptic
        // 404 from postForm two calls later.
        if (!res || !res.templateRevisionIdGuid) {
            throw new Error(`${shortDescription}: template not found, unauthorized, or FormsAPI registration missing`);
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
            new Error('vvClient.formsApi.formInstances is not available — FormsAPI not enabled for this customer')
        );
    }
    const shortDescription = `Create form record (forminstance/) on "${formTemplateName}"`;
    const data = { formName: '', fields }; // fields = [{ key, value }, ...]
    return getTemplateRevisionId(formTemplateName)
        .then((revisionId) => vvClient.formsApi.formInstances.postForm(null, data, revisionId))
        .then((res) => parseRes(res))
        .then((res) => checkMetaAndStatus(res, shortDescription))
        .then((res) => checkDataPropertyExists(res, shortDescription))
        .then((res) => checkDataIsNotEmpty(res, shortDescription))
        .then((res) => res.data); // { name, formId, ... }
}

function updateRecord(formTemplateName, formId, fields) {
    if (!vvClient.formsApi || !vvClient.formsApi.formInstances) {
        return Promise.reject(
            new Error('vvClient.formsApi.formInstances is not available — FormsAPI not enabled for this customer')
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
```

## Usage — Communication Log Refactor

Three scripts in WADNR currently trigger WS-BUG-1 by writing `Communication Date` via `postForms` / `postFormRevision`:

| Script                                                                                                                             | Operation | Current line                                                                                              | Recommended change                                                                           |
| ---------------------------------------------------------------------------------------------------------------------------------- | --------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| [`LibFormCreateCommunicationLog.js:226`](../../../projects/wadnr/extracts/web-services/scripts/LibFormCreateCommunicationLog.js)   | create    | `targetFields['Communication Date'] = new Date().toISOString();` then `vvClient.forms.postForms(...)`     | Replace creation call with `createRecord(...)` from this pattern; pass naive-local datetime. |
| [`LibGenerateCommLogEmailSendNow.js:456`](../../../projects/wadnr/extracts/web-services/scripts/LibGenerateCommLogEmailSendNow.js) | update    | `updateObj['Communication Date'] = new Date().toISOString();` then `vvClient.forms.postForms(...)`        | Replace with `updateRecord(...)`; resolve `formId` via `getRecordFormId(...)`.               |
| [`CommunicationLogSendImmediate.js:195`](../../../projects/wadnr/extracts/schedules/scripts/CommunicationLogSendImmediate.js)      | update    | `updateObj['Communication Date'] = new Date().toISOString();` then `vvClient.forms.postFormRevision(...)` | Replace with `updateRecord(...)`.                                                            |

### Setting Date Fields for WADNR — TZ Reference

WADNR has a few moving parts that interact with the date-field write:

| Concern                         | WADNR value                                                                 | Notes                                                                                                                          |
| ------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Server timezone                 | UTC-7 (Mountain, **fixed — no DST**)                                        | Per [research/CLAUDE.md](../../CLAUDE.md). Server `new Date()` produces UTC; server-local format would equal MST, NOT Pacific. |
| End-user timezone               | Pacific Time (UTC-8 PST / UTC-7 PDT, **DST-aware**)                         | The audience for the dashboard and form.                                                                                       |
| Coincidence                     | Server-local == PT only in summer (PDT)                                     | In winter (PST), server-local is **1 hour fast** vs what users expect.                                                         |
| forminstance/ display semantics | "Wall clock" — value is rendered verbatim regardless of viewer's browser TZ | Means: every viewer sees the same string. Choose the TZ once at write time and live with it.                                   |

**Recommended write pattern for WADNR Communication Log**: format the value in **explicit Pacific Time** (DST-aware), as a naive ISO string (no `Z`), through `forminstance/`. Don't rely on server-local — that's MST/Arizona-fixed and will skew by 1 hour in winter.

```javascript
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);

const CUSTOMER_TZ = 'America/Los_Angeles'; // Pacific Time, DST-aware
```

### Refactored snippet (Send-Immediate, the scheduled process)

```javascript
// Old (WS-BUG-1 trigger — note the 2/4/2022 Jason comment in the file
// shows a previous "fix" attempt landed on .toISOString() and stuck):
//   var updateObj = {};
//   updateObj['Communication Date'] = new Date().toISOString();   // UTC w/ Z → triggers Controls Z re-emission → form/dashboard mismatch
//   updateObj['Communication Sent'] = 'Yes';
//   let updateRecordResp = await vvClient.forms.postFormRevision(
//       null, updateObj, commLogTemplateID, locItem.dhid,
//   );

// New (forminstance/ pattern — naive PT datetime, no Z):
const fields = [
    {
        key: 'Communication Date',
        // Produces e.g. "2026-04-27T15:17:00" for 3:17 PM PDT.
        // tz('America/Los_Angeles') survives DST automatically — no need to
        // track summer/winter offsets in the script.
        value: dayjs().tz(CUSTOMER_TZ).format('YYYY-MM-DDTHH:mm:ss'),
    },
    { key: 'Communication Sent', value: 'Yes' },
];

// Look up the formId via the canonical helper (handles getForms revisionId mapping).
const formId = await getRecordFormId('Communications Log', locItem['comm Log ID']);

// Write through formInstances.postFormRevision — the path that avoids WS-BUG-1.
const updateRecordResp = await updateRecord('Communications Log', formId, fields);
```

### What each piece achieves

| Choice                                                   | Effect                                                                                                                                                                                                                                                                                                                                                                             |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dayjs().tz('America/Los_Angeles')` instead of `dayjs()` | DST-aware Pacific Time, regardless of which TZ the server is fixed at. Users always see the time _they_ would call it locally.                                                                                                                                                                                                                                                     |
| `.format('YYYY-MM-DDTHH:mm:ss')` (ISO naive, no Z)       | The whole point — no UTC marker for Controls to misinterpret. US format `'MM/DD/YYYY hh:mm A'` works equally well; ISO is easier to grep and matches how forminstance/ already serializes internally.                                                                                                                                                                              |
| Stored in DB as `2026-04-27 15:17:00` (naive)            | Dashboard renders it verbatim → `4/27/2026 3:17 PM`. Form (forminstance/-tracked) renders it verbatim → `04/27/2026 03:17 PM`. **They agree on the value** — the only remaining difference is the leading-zero formatting (cosmetic [DB-BUG-1](../../date-handling/dashboards/analysis/formdashboard-bug-1-format-inconsistency.md), Low severity, not addressed by this pattern). |
| Read by every viewer the same                            | A WADNR PT user, a dev in EST, a viewer in BRT all see the same string — `3:17 PM` (or `03:17 PM` depending on layer). For audit-style "when was this sent" data, **this is the correct semantic**: the recorded timestamp doesn't shift based on who's looking at it.                                                                                                             |

### Date-only fields don't need this

If a Communications Log field is configured `enableTime=false` (e.g., a "scheduled date" without time), the time portion is irrelevant and date-only fields are immune to WS-BUG-1 anyway. Use plain `dayjs().tz(CUSTOMER_TZ).format('YYYY-MM-DD')` (or skip the TZ entirely — for a date-only field on a fixed UTC-7 server, `dayjs().format('YYYY-MM-DD')` produces the same date 99% of the time, with edge cases only across midnight in either zone).

## Pre-Adoption Checklist for WADNR

| Step | Action                                                                                                                                                                                                             | Status                                                                                                                                                                                                  |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Run [`forminstance-probe.js`](../../../tools/runners/run-forminstance-probe.js) on `vv5dev/WADNR/fpOnline` to confirm FormsAPI is enabled and `Communications Log` template is registered.                         | ✅ **DONE 2026-04-28** — FormsAPI enabled, template registered, both methods callable. Evidence: [`probe-2026-04-28.json`](../../../projects/wadnr/testing/forminstance-pattern/probe-2026-04-28.json). |
| 2    | If probe fails: open ticket with VV ops to enable FormsAPI for the WADNR customer/database.                                                                                                                        | ✅ Not needed — probe passed.                                                                                                                                                                           |
| 3    | Resolve [FI-G1](../matrix.md#open-gaps--backlog) — does updating an existing `postForms` record via `forminstance/` retroactively fix it? Determines whether historical Communication Log records can be migrated. | ✅ **DONE 2026-04-28: YES, retroactive.** fi-5-migrate validated on vvdemo. Existing records can be cleaned via a one-shot update sweep.                                                                |
| 4    | Dev-test the refactor on `zzzDate Test Harness` (already in WADNR's writePolicy allowlist) before touching Communications Log.                                                                                     | Pending.                                                                                                                                                                                                |
| 5    | Add `Communications Log` template to WADNR's `writePolicy.forms` allowlist (requires explicit user approval per write-safety rules).                                                                               | Pending.                                                                                                                                                                                                |
| 6    | Refactor the three scripts.                                                                                                                                                                                        | Pending.                                                                                                                                                                                                |
| 7    | Optional: write a one-shot migration script that sweeps existing Communication Log records and updates each via `formInstances.postFormRevision` to retroactively clean the cross-layer shift.                     | Pending — depends on whether stakeholders want historical records fixed.                                                                                                                                |

## Why This Solves the Original Report

The Communication Log dashboard ↔ form mismatch screenshot ([WS-BUG-1 in this codebase](../../date-handling/web-services/analysis/ws-bug-1-cross-layer-shift.md)) is caused by `FormInstance/Controls` re-emitting `postForms`-created datetime values with a `Z` suffix that the FormViewer V1 then interprets as UTC and shifts to local time.

`forminstance/`-created records are tagged differently in the platform's internal metadata. `Controls` does NOT add a `Z` to their serialization. The FormViewer parses the un-suffixed value as local-naive (no conversion, no shift). Result: the form display matches what the user actually entered, and matches the dashboard.

The browser evidence in [`browser-fi-vs-pf-2026-04-28.txt`](../../../projects/emanueljofre-vvdemo/testing/forminstance-pattern/runs/browser-fi-vs-pf-2026-04-28.txt) shows this directly: paired records (same input, same form, same browser session) — `postForms` shifts to `11:30 AM`, `forminstance/` stays at `02:30 PM`. The pattern is real, the fix works.
