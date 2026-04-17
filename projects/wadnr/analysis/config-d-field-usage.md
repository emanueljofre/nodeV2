# A3 — Config D Field Time-Component Usage

| Field | Value |
|---|---|
| **Date** | 2026-04-17 |
| **Scope** | Do the 12 Config D fields on WADNR actually store meaningful time components in production records, or are times always midnight (safe to reconfigure to Config B)? |
| **Method** | Read-only `getForms` via `lib/VVRestApi` (`expand: true`), classify per-record time portion of each field |
| **Environment** | vv5dev / WADNR / fpOnline, 2026-04-17 run |
| **Outcome** | **Appendix B.2 "reconfigure 8 fields to Config B" recommendation is unsafe for 7 of 8 fields.** Only 1 field has all-midnight time data; the rest store meaningful user-entered time values that would be hidden by a Config B reconfiguration. |

## Summary table

Disposition rubric applied to the populated record subset (empty records excluded):

- **reconfig-safe**: 100% of populated records have time = 00:00:00 (midnight)
- **reconfig-likely-safe**: <5% non-midnight
- **investigate**: 5–50% non-midnight (mixed use)
- **reconfig-risky**: >50% non-midnight (majority of users enter meaningful time data)
- **no-data**: 0 records

| Field | Template | Sample | Empty | Midnight | Non-midnight | % non-mid of populated | Disposition |
|---|---|---:|---:|---:|---:|---:|---|
| Received Date | Forest Practices Aerial Chemical Application | 1001 (capped) | 709 | 57 | 235 | 80% | **reconfig-risky** |
| Date of Receipt | Forest Practices Application Notification | 1001 (capped) | 966 | 35 | 0 | **0%** | **reconfig-safe** |
| Date of Receipt | FPAN Amendment Request | 653 | 529 | 14 | 110 | 89% | **reconfig-risky** |
| Date of Receipt | FPAN Renewal | 749 | 578 | 50 | 121 | 71% | **reconfig-risky** |
| Date of Receipt | Long-Term Application 5-Day Notice | 727 | 623 | 24 | 80 | 77% | **reconfig-risky** |
| Date of Violation | Multi-purpose | 229 (all) | 201 | 20 | 8 | 29% | **investigate** |
| Date of Receipt | Step 1 Long Term FPA | 1001 (capped) | 732 | 89 | 180 | 67% | **reconfig-risky** |
| Date Created | Task | 278 (all) | 16 | 0 | 262 | 100% | **reconfig-risky** |
| Date Completed | Task | 278 (all) | 219 | 0 | 59 | 100% | **reconfig-risky** |
| Meeting Date | Informal Conference Note | 814 | 777 | 11 | 26 | 70% | **reconfig-risky** |
| Meeting Date | Informal Conference Note - SUPPORT COPY | 0 | 0 | 0 | 0 | — | **no-data** (template unused) |
| ViolationDateAndTime | Notice to Comply | 572 | 555 | 5 | 12 | 71% | **reconfig-risky** (confirms B.4 "correct use") |

## Findings

### 1. Appendix B.2 premise is mostly wrong

Appendix B.2 of `date-handling-current-state.md` listed 8 fields as "misconfigured Config D — should be reconfigured to Config B." The claim was based on field-name heuristic ("Date of Receipt" sounds date-only). Empirical data refutes this for 7 of the 8 fields — **users actively enter time values**.

Only **Forest Practices Application Notification / Date of Receipt** (35 populated records, all midnight) is safe to reconfigure. This one field appears to be an exception where intake workflow sets only the date.

### 2. `Task` form fields are timestamps, not dates

- `Task / Date Created`: 278 populated, 100% non-midnight
- `Task / Date Completed`: 59 populated, 100% non-midnight

The `Task` template's "Date Created" and "Date Completed" fields are functionally **timestamps** — every populated record has a non-midnight time. The field names mislead; the semantics are "event instant" (Model 2 — Instant) not "calendar date" (Model 1). Config D's pinned/floating model is inappropriate but reconfiguring to Config B would discard the user-entered time.

### 3. Consistent pattern: "Date of Receipt" fields carry time of day

Across the four templates with `Date of Receipt` fields that have data:
- FPAN Amendment Request: 89% of populated records carry time
- FPAN Renewal: 71%
- Long-Term 5-Day Notice: 77%
- Step 1 Long Term FPA: 67%

The consistent skew indicates **users treat `Date of Receipt` as a date-time**, likely recording when during the day a document was received. The name suggested date-only but the workflow uses time.

### 4. `Multi-purpose / Date of Violation` is ambiguous

29% non-midnight means mixed use. Likely: some users record just a date, others record date + time. Would require per-record investigation or business-process interview to decide.

### 5. `Informal Conference Note - SUPPORT COPY` template has no records

0 records. The template may be deprecated or unused — check with WADNR before acting on it.

### 6. `Notice to Comply / ViolationDateAndTime` is correctly configured (B.4 intent confirmed)

71% non-midnight confirms the field is used as intended — a datetime (Pinned DateTime model). Stays as Config D.

## Implication for remediation

The "reconfigure 8 fields to Config B" track in current-state Part 6.2 is **largely not viable**. The real path forward:

| Path | Applicable fields | Notes |
|---|---|---|
| **Reconfigure to Config B** | 1 field (Forest Practices Application Notification / Date of Receipt) | Safe — no existing time data. Eliminates #124697 chain exposure for this field. |
| **Investigate then decide** | 2 fields (Multi-purpose / Date of Violation; Informal Conference Note - SUPPORT COPY / Meeting Date) | Requires WADNR SME input. |
| **Keep as Config D** (accept #124697 exposure until platform fix) | 9 fields | Time data is meaningful and actively entered. Cannot hide it via a Config B swap without data loss at the UI level. |
| **Platform fix** | All 9 retained Config D fields | FORM-BUG-1 + FORM-BUG-5 + WS-BUG-1/CB-29 must be fixed in VV engineering to eliminate drift. |

The mitigation stack for the 9 retained fields:

1. **Continue `forminstance/` workaround** for any API write path (migration, SDK, integrations). Addresses Stage 1 of the #124697 chain.
2. **Ban `GFV → SFV` round-trips** in code review for Config D fields (forward-looking control).
3. **FORM-BUG-6 defensive checks** remain necessary where scripts test emptiness via `GetFieldValue`.
4. **Escalate** FORM-BUG-1, FORM-BUG-5, WS-BUG-1 to VV Engineering.

## Sampling caveats

- `getForms` capped returned results at 1001 for the largest templates. Forest Practices Aerial Chemical Application, Step 1 Long Term FPA returned exactly 1001 records — the true population is likely higher. The percentage breakdown is assumed representative of the total population; true populated counts are lower-bound.
- Time classification rule: any value matching `T00:00:00` or `12:00:00 AM` counted as midnight; any other explicit `h:m:s` counted as non-midnight; null/empty counted as empty.
- The run samples the **current stored value**. For fields corrupted by the #124697 chain (Stage 2/3 shift), the stored value is the drifted value, not the original. The classification reflects what the DB contains today, not what was originally intended.

## Source pointers

- Probe script: [`tools/audit/probe-wadnr-configd-samples.js`](../../../tools/audit/probe-wadnr-configd-samples.js)
- Raw probe output: `testing/tmp/wadnr-configd-probe.json`
- Updated disposition feeds: current-state.md Appendix B.2/B.3/B.4 annotations
- Case study #124697: [`bug-analysis/case-study-124697.md`](bug-analysis/case-study-124697.md)
