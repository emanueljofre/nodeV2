# forminstance-pattern Matrix

Slot definitions for validating `vvClient.formsApi.formInstances.{postForm, postFormRevision}` as a workaround for [WEBSERVICE-BUG-1](../date-handling/web-services/analysis/ws-bug-1-cross-layer-shift.md).

Each slot pairs a harness action (data-layer assertion via `getForms`) with an optional cross-layer assertion (FormViewer load via `tools/audit/verify-ws10-browser.js`). The bug only fires when the field has `enableTime=true`, so the matrix focuses on Configs C, D, G, H.

| Config | Field   | enableTime | ignoreTimezone | useLegacy |
| ------ | ------- | ---------- | -------------- | --------- |
| C      | Field6  | ✅         | —              | —         |
| D      | Field5  | ✅         | ✅             | —         |
| G      | Field14 | ✅         | —              | ✅        |
| H      | Field13 | ✅         | ✅             | ✅        |

## Slots

| Slot ID                     | Action     | Path                                | Cross-layer | Asserts                                                                                                                                 |
| --------------------------- | ---------- | ----------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `fi-1-create-{C\|D\|G\|H}`  | FI-CREATE  | postForm                            | yes         | New record's stored value matches sent (no Z drift). Browser display = sent value.                                                      |
| `fi-2-update-{C\|D\|G\|H}`  | FI-UPDATE  | postFormRevision                    | yes         | Existing fi-record updates cleanly. Browser display = updated sent value (no shift).                                                    |
| `fi-3-cycle-{C\|D\|G\|H}`   | FI-CYCLE   | postForm + postFormRevision         | yes         | End-to-end create→update on a single record. Both phases store and display the sent value.                                              |
| `fi-4-vs-pf-{C\|D\|G\|H}`   | FI-VS-PF   | both endpoints                      | yes         | Data layer: postForms == forminstance/. Browser: postForms shifts, forminstance/ does not.                                              |
| `fi-5-migrate-{C\|D\|G\|H}` | FI-MIGRATE | postForms-create + postFormRevision | yes         | Updating an existing postForms-tainted record via formInstances.postFormRevision retroactively clears the shift. Browser display clean. |

## Baseline Run — vvdemo / EmanuelJofre — 2026-04-28

Browser TZ: `America/Sao_Paulo` (BRT, UTC-3). Code path: V1 (`useUpdatedCalendarValueLogic=false`). Build fingerprint: captured by harness `serverTime`.

### Data layer (harness, all runs)

| Slot                  | Result | Notes                                                                                                                     |
| --------------------- | :----: | ------------------------------------------------------------------------------------------------------------------------- |
| fi-1-create-{C,D,G,H} |  PASS  | `match=true` for all 4 configs. Evidence: `runs/fi-create-2026-04-28.json`.                                               |
| fi-2-update-{C,D,G,H} |  PASS  | `match=true` for all 4 configs (before/after differ correctly, after = sent). Evidence: `runs/fi-update-2026-04-28.json`. |
| fi-3-cycle-{C,D,G,H}  |  PASS  | `phase1Match=true` and `phase2Match=true`. Evidence: `runs/fi-cycle-2026-04-28.json`.                                     |
| fi-4-vs-pf-{C,D,G,H}  |  PASS  | `storedMatch=true` (data-layer parity, as predicted by WS-BUG-1). Evidence: `runs/fi-vs-pf-2026-04-28.json`.              |

### Cross-layer (browser, FI-VS-PF and FI-UPDATE)

Sent input: `2026-03-15T14:30:00` (FI-VS-PF) / `2026-04-01T10:00:00` (FI-UPDATE).

| Config | postForms display (control)                            | forminstance/ display                      | Verdict                          |
| :----: | ------------------------------------------------------ | ------------------------------------------ | -------------------------------- |
|   C    | `03/15/2026 11:30 AM` ❌ shift                         | `03/15/2026 02:30 PM` ✅                   | postForms FAIL, fi PASS          |
|   D    | `03/15/2026 02:30 PM` (raw=11:30 hidden corruption) ❌ | `03/15/2026 02:30 PM` (raw=14:30 clean) ✅ | postForms FAIL (latent), fi PASS |
|   G    | `03/15/2026 11:30 AM` ❌ shift                         | `03/15/2026 02:30 PM` ✅                   | postForms FAIL, fi PASS          |
|   H    | `03/15/2026 02:30 PM` (raw=11:30 hidden corruption) ❌ | `03/15/2026 02:30 PM` (raw=14:30 clean) ✅ | postForms FAIL (latent), fi PASS |

For Configs D and H, `ignoreTimezone=true` masks the displayed time but the **internal `rawValue` is shifted -3h** for postForms records — first-save would commit corruption to the DB. forminstance/ records carry the original 14:30 in both display and raw.

| Slot           | postForms (control) | forminstance/ | Verdict |
| -------------- | :-----------------: | :-----------: | :-----: |
| fi-4-vs-pf-C   |        FAIL         |     PASS      |   ✅    |
| fi-4-vs-pf-D   |    FAIL (latent)    |     PASS      |   ✅    |
| fi-4-vs-pf-G   |        FAIL         |     PASS      |   ✅    |
| fi-4-vs-pf-H   |    FAIL (latent)    |     PASS      |   ✅    |
| fi-2-update-C  |         n/a         |     PASS      |   ✅    |
| fi-2-update-D  |         n/a         |     PASS      |   ✅    |
| fi-2-update-G  |         n/a         |     PASS      |   ✅    |
| fi-2-update-H  |         n/a         |     PASS      |   ✅    |
| fi-5-migrate-C |         n/a         |     PASS      |   ✅    |
| fi-5-migrate-D |         n/a         |     PASS      |   ✅    |
| fi-5-migrate-G |         n/a         |     PASS      |   ✅    |
| fi-5-migrate-H |         n/a         |     PASS      |   ✅    |

**fi-5-migrate finding (FI-G1 = YES, retroactive)**: The same record was created via `postForms` (would normally trigger WS-BUG-1) and then updated via `formInstances.postFormRevision`. Browser displays the updated value (`03/20/2026 09:15 AM`) cleanly across all 4 configs at both pre- and post-migration data IDs. Internal `rawValue` matches sent value (no shift). **Existing postForms-created records can be retroactively cleaned by a one-shot update sweep through formInstances.postFormRevision.**

Evidence: `runs/browser-fi-vs-pf-2026-04-28.txt`, `runs/browser-fi-update-2026-04-28.txt`, `runs/browser-fi-migrate-after-2026-04-28.txt`, `runs/browser-fi-migrate-before-2026-04-28.txt`, `runs/fi-migrate-2026-04-28.json`.

## Open Gaps & Backlog

| ID    | Question                                                                                                                   | Notes                                                                                                                                            |
| ----- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| FI-G1 | Does updating a `postForms`-created record via `formInstances.postFormRevision` retroactively fix the shift?               | **RESOLVED 2026-04-28: YES.** fi-5-migrate slots PASS for all 4 configs. Existing postForms records can be migrated via a one-shot update sweep. |
| FI-G2 | Does `formInstances.postFormRevision` on a `postForms`-created record still trigger Controls Z-suffix on subsequent reads? | **RESOLVED 2026-04-28: NO.** Browser audit shows raw value matches sent and display is clean post-migration — Controls re-classifies the record. |
| FI-G3 | Does the pattern survive cross-TZ browser reload? (BRT save → IST reload → check stability)                                | Standard Cat-3 cross-TZ check, applied to fi-records. Expected: PASS (no shift in either direction).                                             |
| FI-G4 | Behavior on V2 (`useUpdatedCalendarValueLogic=true`, vv5dev DB-scope)?                                                     | V2 fixes some Forms-side parsing bugs but Controls is server-side and unchanged. Expected: same result as V1.                                    |
| FI-G5 | Save-stabilize on a fi-record — does saving a fi-record corrupt it like a postForms record does?                           | Use `verify-ws10-browser.js --save-stabilize`. Expected: PASS (no corruption).                                                                   |
