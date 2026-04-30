# forminstance-pattern — `vvClient.formsApi.formInstances` create + update validation

## What This Is

Validation of the `vvClient.formsApi.formInstances.postForm` (create) and `postFormRevision` (update) callsite pattern as a workaround for [WEBSERVICE-BUG-1](../date-handling/web-services/analysis/ws-bug-1-cross-layer-shift.md) (cross-layer date shift). Goal: confirm that records created and updated via the `forminstance/` endpoint avoid the Controls Z-appending behavior so dashboard and form views agree on date+time fields.

## Scope

| Component                     | Status        | Notes                                                                                                                                                          |
| ----------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FormsAPI registration probe   | ✅ Baselined  | [`scripts/examples/forminstance-probe.js`](../../scripts/examples/forminstance-probe.js) + runner. Confirmed enabled on vvdemo/EmanuelJofre 2026-04-28.        |
| `postForm` (create)           | ✅ Baselined  | Both data-layer and cross-layer (browser). 4/4 PASS for Configs C/D/G/H on vvdemo BRT 2026-04-28. See [matrix.md](matrix.md).                                  |
| `postFormRevision` (update)   | ✅ Baselined  | New ground — first validation of this path. Both data-layer and cross-layer 4/4 PASS. See [matrix.md](matrix.md).                                              |
| Callsite pattern (helpers)    | ✅ Documented | Canonical four-helper module documented in [analysis/02-pattern.md](analysis/02-pattern.md) with copy-pasteable code and the WADNR Communication Log refactor. |
| Cross-layer parity validation | ✅ Baselined  | Browser audit confirms postForms shifts (`11:30 AM`), forminstance/ stays correct (`02:30 PM`). Update path preserves the no-shift state.                      |

Target environment: **vvdemo / EmanuelJofre** (unrestricted writes). Test form: `DateTest` harness — uses Configs C, D, G, H (datetime configs affected by WS-BUG-1).

## Folder Structure

```
research/forminstance-pattern/
  analysis/      # Pattern documentation, observed behavior, fix recommendations
  test-cases/    # (added when test slots are defined)
  matrix.md      # (added when slot matrix is needed)
```

## Key Facts

- SDK wrapper lives at [`lib/VVRestApi/VVRestApiNodeJs/FormsApi.js`](../../lib/VVRestApi/VVRestApiNodeJs/FormsApi.js) — `postForm` (POST) and `postFormRevision` (PUT) on the `formInstances` manager.
- Both methods require the **template revision GUID** (not the template name or template GUID) — resolve via `vvClient.forms.getFormTemplateIdByName(name).templateRevisionIdGuid`.
- Field payload shape differs from `postForms`: `{ formName: '', fields: [{ key, value }, ...] }` (array, not object).
- Create response is `{ name, formId, ... }` (vs `postForms`'s `{ instanceName, revisionId, ... }`).
- The `getFormTemplateIdByName` SDK method silently swallows errors on failure ([VVRestApi.js:654-664](../../lib/VVRestApi/VVRestApiNodeJs/VVRestApi.js)) — consumers must explicit-null-check `templateRevisionIdGuid`.
- Reference create test cases: [`tc-ws-10b-A-BRT.md`](../date-handling/web-services/test-cases/tc-ws-10b-A-BRT.md), [`tc-ws-10b-C-BRT.md`](../date-handling/web-services/test-cases/tc-ws-10b-C-BRT.md), [`tc-ws-10b-D-BRT.md`](../date-handling/web-services/test-cases/tc-ws-10b-D-BRT.md).
- Update path has no existing test cases — closing this gap is the main task contribution.

## Confirmed Bugs

_(none yet — this task is validation, not bug discovery. Any defects found in the SDK wrapper or update-path semantics will be added here.)_

| ID  | Name | Severity | File |
| --- | ---- | -------- | ---- |

Each bug, if any, gets its own file in `analysis/` following [`docs/standards/bug-report-investigation.md`](../../docs/standards/bug-report-investigation.md). See [`docs/standards/bug-reporting.md`](../../docs/standards/bug-reporting.md) for the format index.

## Next Steps

Vvdemo baseline is complete. Remaining work moves to WADNR adoption + open gaps.

1. **Probe WADNR**: flip `.env.json` activeCustomer to `WADNR`, run `node tools/runners/run-forminstance-probe.js --template "Communications Log"`. If FormsAPI is enabled there, the pattern is viable in production. If disabled, open ops ticket.
2. **Resolve [FI-G1](matrix.md#open-gaps--backlog) — retroactive fix question**: does updating an existing `postForms`-created record via `formInstances.postFormRevision` retroactively eliminate the cross-layer shift? Determines whether existing Communication Log records can be migrated or only new records benefit. Add a `FI-MIGRATE` action to the harness.
3. **Save-stabilize on fi-records** (FI-G5): use `tools/audit/verify-ws10-browser.js --save-stabilize` to confirm fi-records don't corrupt on first save the way postForms records do.
4. **Refactor the three WADNR scripts** ([`LibFormCreateCommunicationLog.js`](../../projects/wadnr/extracts/web-services/scripts/LibFormCreateCommunicationLog.js), [`LibGenerateCommLogEmailSendNow.js`](../../projects/wadnr/extracts/web-services/scripts/LibGenerateCommLogEmailSendNow.js), [`CommunicationLogSendImmediate.js`](../../projects/wadnr/extracts/schedules/scripts/CommunicationLogSendImmediate.js)) per [analysis/02-pattern.md § Communication Log Refactor](analysis/02-pattern.md#usage--communication-log-refactor). Requires explicit user approval to add `Communications Log` to WADNR's `writePolicy` allowlist.
5. **Cross-link**: add this task as a documented workaround in [`ws-bug-1-fix-recommendations.md`](../date-handling/web-services/analysis/ws-bug-1-fix-recommendations.md) once WADNR adoption is decided.
