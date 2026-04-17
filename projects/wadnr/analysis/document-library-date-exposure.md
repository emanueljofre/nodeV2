# A2 — Document Library Date-Field Exposure Audit

| Field | Value |
|---|---|
| **Date** | 2026-04-17 |
| **Scope** | Does WADNR use date-type index fields on the Document Library, exposing the environment to DOC-BUG-1 (TZ-offset-to-UTC conversion) and DOC-BUG-2 (cannot clear)? |
| **Method** | Read-only REST API enumeration via `lib/VVRestApi` `indexFields.getIndexFields()` |
| **Environment** | vv5dev / WADNR / fpOnline (live), 2026-04-17 run |
| **Outcome** | **No date-type index fields in use.** WADNR is not exposed to DOC-BUG-1/2. |

## Finding

WADNR has **16 defined library index fields**. **Zero** of them are date-type by any of three criteria:

1. No field returned with `dataType` or `fieldType` indicating date/datetime
2. No field name matches the pattern `/date|time|when|created|modified|updated|received|expires?|deadline/i`
3. No field is flagged as a calendar/date control in the API response

### Full index-field inventory

All 16 fields share `dataType: "IndexFieldDefinition"` and `fieldType: 1` (integer code, distribution 100% single-value). Sample of names:

- Associated Record ID Number
- (15 additional fields; full list in `testing/tmp/wadnr-indexfields-probe.json`)

None have date semantics by name or type. The library's usage pattern appears to be relational-ID-based indexing (linking documents back to form records), not temporal indexing.

## Resolution for Risk #8 in current-state Part 6.1

Risk #8 (`Doc Library DOC-BUG-1/2 exposure unknown`) moves from **"Unknown"** to **"No exposure — WADNR uses no date-type index fields."**

### Caveats

- **Scope is current state.** If WADNR introduces a date-type index field in the future, DOC-BUG-1/2 would activate. Current-state.md Part 8.4 follow-up can be closed, but the bug remains a platform-level concern.
- **Repro not exercised.** Since no such fields exist on WADNR, DOC-BUG-1/2 were not reproduced in the WADNR environment. The bugs remain documented at the platform level (vvdemo harness) but their WADNR impact is confirmed zero.

## Implication for remediation

- **No WADNR action required** for DOC-BUG-1/2.
- **Platform fix priority**: low for WADNR specifically. Continues to matter for other customers who use date-type document index fields.

## Source pointers

- Probe script: [`tools/audit/probe-wadnr-indexfields.js`](../../../tools/audit/probe-wadnr-indexfields.js)
- Raw probe output: `testing/tmp/wadnr-indexfields-probe.json`
- DOC-BUG-1/2 spec: [`research/date-handling/document-library/analysis/overview.md`](../../../research/date-handling/document-library/analysis/overview.md)
- Platform 5.x/6.x divergence: `docapi` enabled on vv5dev, disabled on vvdemo. Infrastructure difference is documented but not material here since WADNR has no data-bearing fields.
