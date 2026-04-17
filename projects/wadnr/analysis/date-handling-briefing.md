# Date Handling in the WADNR Project: Analysis and Impact

## Why This Document Exists

The root cause analysis of date handling in VisualVault identified 14 confirmed bugs traceable to a shared architectural limitation: the platform does not preserve the *type* of a date value — calendar date, absolute instant, or pinned clock reading — across its storage and serialization layers. The companion Recommendation document proposed a two-behavior standard (Calendar Date and Business DateTime) to address this.

This document presents the analysis of how those defects manifest in the WADNR project specifically: which fields are exposed, the conditions under which the defects surface, the user populations affected, and what can be addressed at the customer level versus what requires platform-level engagement.

---

## Executive Summary

**Scope.** WADNR on vv5dev / fpOnline: 88 form templates (137 calendar fields), 251 web service scripts, 21 scheduled services, 157 global functions. 332 of 461 planned test cases executed; production records sampled; three targeted audits completed.

**Findings.** WADNR reproduces the defects catalogued in the root cause analysis without customer-specific deviations. Calendar fields split 89% Calendar Date / 11% Business DateTime — the distribution the Recommendation anticipated. Active defects concentrate in 12 Business DateTime fields across 8 templates.

**User-visible impact.** Three defect classes are active today. Users and integrations report them as bugs regardless of whether the root cause analysis classifies them as bugs or cross-layer inconsistencies.

| Defect class | Affects | What users see |
|---|---|---|
| Time shift on first form open of API-written records | 12 Business DateTime fields | Time shifts by the viewer's offset; save commits the shifted value |
| Cross-layer display and serialization inconsistency | 15 Business DateTime fields (plus cosmetic on all 137) | Same record shows different dates across Forms, Dashboards, and REST API |
| False UTC marker returned to form scripts (latent) | 12 Business DateTime fields if a script activates the pattern | No current WADNR script triggers this |

Triggers are inter-component, not user-driven. Every population is exposed: internal staff in Pacific, external applicants submitting via the public portal from any US state, and automated integrations. Only internal staff volume is measured.

**What's needed.** One field can be safely reclassified at the customer level; the `forminstance/` workaround is in place for API writes; a code-review rule prevents a latent regression. The remaining exposure — 9 Business DateTime fields carrying user-entered time, plus all three cross-component triggers — requires platform-level fixes coordinated with VV Engineering along the Recommendation's Option B.

---

## 1. Scope and Assumptions of This Analysis

### 1.1 What Was Examined

| Artifact | Count |
|---|---:|
| Form templates | 88 (77 XML, 11 JSON) |
| Calendar fields (across 35 templates) | 137 |
| Web service scripts | 251 |
| Scheduled service scripts | 21 schedules + 20 scripts |
| Site-level global functions | 157 |
| Custom queries | 447 |

Platform version at time of analysis: 6.1. Testing covered Forms UI, REST API, and Dashboards — 332 of 461 planned test slots executed, 88% pass rate, every failure reproduced on an independent baseline environment.

Targeted audits completed:

- `FillinAndRelateForm` (site-level, 36 templates) — code-reviewed; does not activate the script-read defect on any current path.
- Document Library index surface (16 fields) — no date-type fields; that defect class does not apply at WADNR.
- Production records sampled across the 12 Business DateTime fields for time-component usage (see § 5).

### 1.2 Assumptions Underlying This Analysis

Each assumption is stated with what changes if it is violated. Material departures require revising the corresponding findings.

1. **Field type classification matches business intent.** If a Calendar Date field is actually used to capture time (or a Business DateTime field is used only for dates), the exposure set and the reclassification options shift. Field-by-field SME review has not been performed.

2. **WADNR staff are concentrated in Pacific time.** Staff operating from UTC-positive locations would activate § 3.4 across all 122 Calendar Date fields and change the per-user magnitude of § 3.1.

3. **The `forminstance/` workaround covers every production write path to Business DateTime fields.** Any write path still using the standard API endpoint lets new records enter the § 3.1 chain. Coverage has not been independently verified.

4. **Production samples are not materially distorted by prior drift.** Some "non-midnight time" values in § 5 may be shifted versions of originally-midnight entries. This biases the reclassification analysis toward "unsafe"; the real share of safely reclassifiable fields may be higher.

5. **Baseline test coverage is representative of WADNR behavior.** The "no WADNR-specific defects" claim rests on 332 of 461 planned test cases. Untested slots and untested surfaces (Reports, Workflows, Custom Queries, Node.js client library) may expose additional defect categories.

6. **The root cause analysis framework holds.** If the four-model framework is revised, the mapping in § 3 and the fix categories in § 7 shift.

7. **Public-portal volume is material to the exposure story.** If external usage is negligible or entirely within Pacific time, the cross-timezone component of the exposure shrinks. § 3.1 and § 3.3 remain active independently.

8. **Extracted configurations match current production state.** Extracts dated 2026-04-08 (scripts, globals, schedules) and 2026-04-16 (form templates, custom queries). Later changes not reflected.

---

## 2. Distribution of Date Usage at WADNR

| Behavior | Count | Share | Examples |
|---|---:|---:|---|
| Calendar Date (no time, no timezone) | 122 | 89% | Application filing date, permit effective date, renewal deadline, violation date |
| Business DateTime (time meaningful in the project timezone) | 15 | 11% | Inspection time, meeting time, record created/modified timestamps |

The 89/11 split matches the customer profile Option B of the Recommendation is designed for.

Of the 15 Business DateTime fields: 12 are user-entered (where the active defects surface), concentrated on 8 templates — FPA Notification with its Amendment / Renewal / Long-Term variants, Long-Term 5-Day Notice, Aerial Chemical Application, Notice to Comply, Task, and Informal Conference Note. The remaining 3 are system-generated timestamps, affected only by § 3.3.

---

## 3. Defects Active at WADNR

The RCA distinguishes confirmed platform bugs (14) from cross-layer inconsistencies (17, XLAYER-N). From a user or integration perspective both are the same — records showing different dates in different places, reported as bugs. Three classes are active at WADNR; one is latent.

### 3.1 Time shift when API-written records are opened in the form

*Pinned DateTime interpreted as Instant.*

A Business DateTime value written via the standard REST API, then opened in the Forms UI, is shifted on load by the viewer's UTC offset. Saving the form — even without edits — commits the shift. Corruption is one-time per record and irreversible.

Affects 12 user-entered Business DateTime fields across 8 templates. The `forminstance/` workaround prevents the shift on new writes; it does not protect records already in the database or records written via the standard endpoint.

### 3.2 Corrupted copy returned to form scripts reading stored values

*Pinned DateTime interpreted as Instant, developer-API layer.*

Scripts reading a Business DateTime value through the developer API receive a string with a false UTC marker. Any script that parses the string as a timestamp — for date arithmetic, deadline computation, cross-field propagation — shifts the value by the user's UTC offset. A shifted value written back to any field is permanent.

Latent at WADNR: all 88 template scripts and 6 site-level global helpers were inspected; none activate the pattern today. Three templates already defend against the related empty-field "Invalid Date" behavior. Would expose the same 12 Business DateTime fields if a future script introduced the pattern.

### 3.3 Cross-layer inconsistencies — same record, different values by surface

*Inconsistent serialization and rendering (XLAYER-3, 4, 6, 7, 11, 14).*

A single stored value is displayed or reported differently depending on which surface reads it. Four inconsistencies are active at WADNR:

- **Forms vs Dashboards.** Forms apply the viewer's local timezone to certain Business DateTime values; Dashboards show the raw stored value. Users see different clock times for the same record.
- **REST API endpoint disagreement.** `getForms` attaches a UTC marker; `forminstance/` does not. Same record, different representations depending on the consumer's endpoint. This is also why the write-side workaround works.
- **Display format disagreement.** Same date, different format in Forms (`03/15/2026`), Dashboards (`3/15/2026`), REST API (ISO + Z), and dashboard exports. Cosmetic for most fields but consistently reported by users as a product-quality concern.
- **Empty-field handling.** Forms render blank; the developer API returns `"Invalid Date"`. Scripts and integrations testing for emptiness get different answers depending on the surface.

Stored values are not corrupted — the inconsistency is in the read paths — but users and integrations see different dates in different places and report them as bugs.

### 3.4 Calendar Date wrong-day shift — latent at WADNR

*Calendar Date interpreted as Instant.*

Active platform-wide, dormant at WADNR because all US timezones are UTC-negative and the defect requires a UTC-positive offset. Activates if WADNR users operate from UTC-positive locations, if a migration imports UTC-positive-origin values, or if the customer expands to overseas applicants. None apply today.

Latent across all 122 Calendar Date fields.

---

## 4. Conditions Under Which the Defects Surface

| Condition | Activates | Location-dependent? |
|---|---|---|
| Record written via standard REST API, then opened in the form | § 3.1 | No |
| Same record read through two or more surfaces (Forms, Dashboards, REST API, developer API) | § 3.3 | No |
| Script reads a Business DateTime field and parses the value as a date | § 3.2 (latent) | No |

### Affected populations at WADNR

- **Internal staff.** ~300 users, all Pacific. Direct exposure evidence most complete.
- **External applicants via the public portal.** Several of the most-affected templates (FPA Notification, Amendment, Renewal, Long-Term FPA, Aerial Chemical Application) are exposed publicly. Submission-origin distribution unmeasured; may span all US timezones.
- **Automated integrations.** Any consumer of the REST API for Business DateTime fields receives § 3.3 inconsistencies. Read-then-save audit not yet performed.

---

## 5. Production Data Findings

An initial hypothesis based on field naming — that several Business DateTime fields had been misconfigured and could be reclassified as Calendar Date — was tested against production records. Of 8 fields examined, 7 carry real user-entered time.

| Field / Template | Populated Records | Share with Non-Midnight Time | Reclassification |
|---|---:|---:|---|
| Received Date / Forest Practices Aerial Chemical Application | 292 | 80% | Not safe |
| Date of Receipt / Forest Practices Application Notification | 35 | 0% | **Safe** |
| Date of Receipt / FPAN Amendment Request | 124 | 89% | Not safe |
| Date of Receipt / FPAN Renewal | 171 | 71% | Not safe |
| Date of Receipt / Long-Term Application 5-Day Notice | 104 | 77% | Not safe |
| Date of Violation / Multi-purpose | 28 | 29% | Requires customer input |
| Date of Receipt / Step 1 Long-Term FPA | 269 | 67% | Not safe |
| Date Created / Task | 262 | 100% | Not safe (effectively a timestamp) |

Three additional fields follow the same pattern (`Date Completed` on Task, `Meeting Date` on Informal Conference Note, `ViolationDateAndTime` on Notice to Comply — 70–100% non-midnight). A fourth (`Meeting Date` on Informal Conference Note SUPPORT COPY) has zero records; customer confirmation needed on whether the template is still in use.

One field is safely reclassifiable. The other nine are not — their exposure is addressable only at the platform level.

---

## 6. Mitigation Options Available at the Customer Level

Three low-risk actions without platform changes:

- **Reclassify `Date of Receipt` on Forest Practices Application Notification to Calendar Date.** Zero time-of-day usage in production; removes the field from § 3.1 exposure with no data hidden.
- **Retain the `forminstance/` workaround** for all API-based writes to Business DateTime fields. Prevents § 3.1 on new writes only; does not protect existing records or records written via the standard endpoint.
- **Adopt a code-review rule** blocking new scripts from passing Business DateTime values from the read API into any write API or JS date-parsing function. Prevents regression on § 3.2.

Two items need customer business input:

- `Date of Violation` / Multi-purpose — 29% of records have time; confirm intent with SMEs.
- `Meeting Date` / Informal Conference Note SUPPORT COPY — zero records; confirm whether the template is still in use.

The remaining nine Business DateTime fields stay exposed until platform-level changes land.

---

## 7. What Requires Platform Action

The Recommendation's fix categories, ranked by WADNR impact:

| Fix category | Addresses | WADNR urgency |
|---|---|---|
| Pinned DateTime correctness | § 3.1, § 3.2 | **Highest.** Active on 12 fields; irreversible once saved. |
| Instant correctness and cross-layer consistency | § 3.3 | Display and serialization disagreements across Forms, Dashboards, REST API, developer API. 15 fields, plus cosmetic on all 137. |
| Calendar Date correctness | § 3.4 | Latent. Becomes material if the customer expands to non-US populations. |

Adopting Option B as the shared standard — Calendar Date bypasses timezone logic, Business DateTime is pinned to the project timezone — resolves the active WADNR defects and prevents recurrence in new work.

---

## 8. Open Items

The following would sharpen the analysis but are not blocking a platform engagement decision.

- **Submission-origin distribution for the public portal.** Quantifies the external-applicant component of the affected population.
- **Read-then-save workflow audit.** Scheduled scripts and web services have been extracted but not audited for patterns that could reintroduce § 3.1 on records otherwise protected by the workaround.
- **API-write scope across the 12 Business DateTime fields.** Determines the set of records already protected by the workaround versus those still exposed.
- **Traveling-staff frequency.** Internal staff operating outside the local timezone would increase the per-record magnitude of § 3.1 and affect the cross-viewer component of § 3.3.

---

## References

- **Root Cause Analysis**: `research/date-handling/analysis/temporal-models.md` — the architectural diagnosis, the four-model framework, and the 14-bug catalogue referenced throughout this document.
- **Recommendation**: `research/date-handling/analysis/date-model-argument.md` — the two-behavior standard (Option B) referenced in § 2 and § 7.
- **Detailed WADNR current-state report**: `projects/wadnr/analysis/date-handling-current-state.md` — full per-layer walkthrough, per-scenario evidence, and per-configuration matrices. Supplements this document where deeper evidence is required.
- **Production data sampling**: `projects/wadnr/analysis/config-d-field-usage.md` — full per-field time-component analysis behind § 5.
- **Targeted audits**: `projects/wadnr/analysis/fillin-and-relate-form-audit.md` and `projects/wadnr/analysis/document-library-date-exposure.md` — the closed discovery items in § 1.
