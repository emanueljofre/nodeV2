# FORM-BUG-V2-EPOCH-PRESERVED: V2 Preserves Epoch-ms Input Instead of Normalizing to ISO

## What Happens

Under the V2 calendar pipeline (`useUpdatedCalendarValueLogic=true`), calling `VV.Form.SetFieldValue(field, <number-as-string>)` with a Unix epoch-ms value — for example `"1773543600000"` — stores the **stringified epoch number verbatim**. Both the raw partition and `GetFieldValue()` return `"1773543600000"` rather than the ISO/date string V1 produced (`"2026-03-15"` for a date-only field, `"2026-03-15T00:00:00"` for a DateTime field).

Downstream code expecting a parseable date string sees the epoch as a literal numeric string. `Date.parse("1773543600000")` returns `NaN` in Chrome/V8 because epoch-ms strings are not a recognized ISO input. The form display still renders the correct calendar date (V2 builds the in-memory `Date` object from the numeric input), but the stored and API-visible value is the raw epoch string — a silent format divergence from V1.

This bug is silent — no error, no warning. Scripts written against V1 semantics will compute `NaN` or `"Invalid Date"` when they try to parse the GFV return.

---

## When This Applies

Three conditions must all be true:

### 1. The customer/database must have V2 enabled

Only environments with **"Use Updated Calendar Control Logic"** checked (Database scope wins) run V2. On vv5dev with the EmanuelJofre customer, the DB-scope toggle is ON — confirmed via Central Admin. V1 environments (vvdemo, WADNR) are unaffected. The toggle is Forms-only and does not change REST API behavior.

### 2. The input to `SetFieldValue` must be an epoch-ms value (number or numeric string)

Confirmed cases use `sfvInput: '1773543600000'` with `sfvInputType: 'Unix ms'`. Native JS `Date` objects, ISO 8601 strings, US-format strings (`"03/15/2026"`), and typed calendar input all produce the V2 ISO path. Only epoch-ms bypasses normalization.

### 3. Configs A and C are confirmed; B/D/E/F/G/H unverified

Confirmed 2026-04-22 on vv5dev (build `20260418.1`):

| Config | Field Type                      | V1 Raw/GFV              | V2 Raw/GFV        | Status        |
| ------ | ------------------------------- | ----------------------- | ----------------- | ------------- |
| A      | Date-only baseline              | `"2026-03-15"`          | `"1773543600000"` | **Confirmed** |
| C      | DateTime UTC (`ignoreTZ=false`) | `"2026-03-15T00:00:00"` | `"1773543600000"` | **Confirmed** |
| B, D   | Date-only/DateTime + ignoreTZ   | —                       | —                 | Unverified    |
| E–H    | Legacy configs                  | —                       | —                 | Unverified    |

Given the V2 `parseDateString()` path runs for both `ignoreTimezone` branches and the epoch-preserve mechanism appears to sit upstream of the timezone branching, the bug is expected to generalise across all non-legacy configs. Legacy configs (E–H) have their own short-circuit and may not be affected — untested.

---

## Severity: Medium

Silent format divergence from V1. No data loss (the calendar date is preserved in the browser UI) but downstream consumers — scripts, reports, cross-form data passing — that `Date.parse()` or `new Date(gfv)` the return will produce `NaN` / `"Invalid Date"` where V1 produced a valid parseable string. Impacts any codebase with an SFV(epoch) pattern migrating from V1 to V2.

The V1/V2 difference is contained to the Forms layer. The REST API write path (`postForms`) is unaffected — V1/V2 API-write parity was confirmed 2026-04-22 (`b18dbfdb` vs `f36b65dd`, 133/133 identical audit slots).

---

## How to Reproduce

### Prerequisites

- V2 environment (e.g., vv5dev/EmanuelJofre) — confirm `useUpdatedCalendarValueLogic=true` in `userInfo`
- BRT timezone (any TZ reproduces the bug — not TZ-dependent)

### 1. Epoch-ms on Config A (date-only)

```javascript
// Epoch for 2026-03-15T00:00:00 BRT (UTC-3) = 1773543600000
VV.Form.SetFieldValue('Field7', '1773543600000');

VV.Form.VV.FormPartition.getValueObjectValue('Field7');
// V2 returns: "1773543600000"  ← stringified epoch preserved
// V1 returned: "2026-03-15"

VV.Form.GetFieldValue('Field7');
// V2 returns: "1773543600000"  ← same
// V1 returned: "2026-03-15"

Date.parse(VV.Form.GetFieldValue('Field7'));
// V2: NaN  ← epoch string is not a recognized Date.parse input
// V1: 1773532800000 (valid timestamp)
```

### 2. Epoch-ms on Config C (DateTime, ignoreTZ=false)

```javascript
VV.Form.SetFieldValue('Field6', '1773543600000');

VV.Form.GetFieldValue('Field6');
// V2 returns: "1773543600000"
// V1 returned: "2026-03-15T00:00:00"
```

**Expected**: V2 normalizes epoch-ms to an ISO/date string matching the field's native format.
**Actual**: V2 passes the epoch through unchanged in both the raw partition and GFV.

This bug report is backed by a supporting test repository containing Playwright automation scripts, additional per-bug analysis documents, raw test data, and test case specifications. Access can be requested from the Solution Architecture team.

---

## The Problem in Detail

### V1 Behavior (baseline)

V1's `normalizeCalValue()` passes the numeric input to `moment(...)`, which accepts epoch-ms and returns a valid `Moment` object. `calChange()` then calls `.toISOString()` and `getSaveValue()` strips the Z for legacy format or extracts the date portion for date-only fields. The final stored value is a string in the field's native format:

- Config A: `"2026-03-15"`
- Config C: `"2026-03-15T00:00:00"`

This means any V1 script pattern `new Date(VV.Form.GetFieldValue(f))` works regardless of whether the upstream write used epoch, ISO, or US-format.

### V2 Behavior (observed)

Under V2, `calendarValueService.parseDateString(input, enableTime, ignoreTimezone)` is the single entry point for input normalization. But the observed V2 behavior on vv5dev shows the epoch-ms string **never enters `parseDateString`** — it's stored into `data.value` and `getSaveValue()` returns it verbatim because the current `getSaveValue` V2 branch is:

```javascript
if (this.useUpdatedCalendarValueLogic) {
    result = ignoreTimezone ? moment(input).tz('UTC', true).toISOString() : moment(input).toISOString();
}
```

`moment('1773543600000')` interpreted as a string is ambiguous — moment.js does not auto-detect epoch-ms strings. Without an explicit format token (`moment(input, 'x')`), the library treats the numeric string as unparseable, falls through, and the caller's fallback path appears to short-circuit, storing the input unchanged. The net effect is the same as if V2 had an explicit "numeric input → pass through" rule.

This contrasts with V1 where `moment(Number(input))` (native JS coercion on the `moment.js` input path) correctly recognised the epoch-ms.

### Why the Form Display Still Works

The form's in-memory `Date` object is built separately from the stored string. `new Date(1773543600000)` is a valid JS operation that returns March 15 at the epoch-ms boundary, so the calendar control displays the correct day. The divergence is only visible through the partition value or GFV.

### Relationship to Other Bugs

| Bug                             | Relationship                                                                                                                                                                                                                                                        |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FORM-BUG-5                      | Independent mechanism. Bug 5 is a V1 GFV transformation defect (fake Z on Config D). V2 fixes Bug 5 by returning raw values from GFV, but the V2 raw-pass-through is _what exposes_ FORM-BUG-V2-EPOCH-PRESERVED — V2 doesn't re-normalize the input on the way out. |
| FORM-BUG-V2-URL-PARAM-NORMALIZE | Same V2 layer, opposite symptom. URL-param init forces normalization through `parseDateString`; SFV(epoch) skips it. Two inconsistent input paths on the same V2 field.                                                                                             |
| FORM-BUG-V2-LEGACY-Z            | Same V2 layer, same direction. LEGACY-Z adds `.000Z` to what V1 stored bare (`"2026-03-15T00:00:00"` → `"2026-03-15T00:00:00.000Z"`). EPOCH-PRESERVED retains the epoch instead of normalizing it. Both reflect V2's more permissive input pass-through.            |

---

## Verification

Confirmed on vv5dev EmanuelJofre (V2 path, build `20260418.1`, prog `6.1.20260416.1`) 2026-04-22 via the `testing/fixtures/test-data.js` entries:

- [`7-A-epoch.V2`](../../../../testing/fixtures/test-data.js) (line 6236) — Config A, BRT, SFV `'1773543600000'` → expected raw `'1773543600000'`, expected API `'1773543600000'`
- [`7-C-epoch.V2`](../../../../testing/fixtures/test-data.js) (line 5781) — Config C, BRT, SFV `'1773543600000'` → expected raw `'1773543600000'`, expected API `'1773543600000'`

Both entries passed the V2 regression run on 2026-04-22 (build fingerprint `f36b65dd`). V1 parity confirmed against vvdemo build fingerprint `b18dbfdb`: V1 stored `"2026-03-15"` (A) and `"2026-03-15T00:00:00"` (C) for the same input. See [`projects/emanueljofre-vv5dev/testing/date-handling/v2-review-queue.md`](../../../../projects/emanueljofre-vv5dev/testing/date-handling/v2-review-queue.md) for the review queue closure record and [`v2-baseline-audit.md`](../../../../projects/emanueljofre-vv5dev/testing/date-handling/v2-baseline-audit.md) for the full diff context.

Catalog entry: [`docs/reference/form-fields.md § Known Bugs`](../../../../docs/reference/form-fields.md#known-bugs-calendar-field).

---

## Technical Root Cause

**Environment**: V2 pipeline (`useUpdatedCalendarValueLogic=true`) only. Code lives in the bundled FormViewer application — `main.js` in the Angular front-end package (not in this repo; likely in the `vv-vueforms` or equivalent VV client bundle).

**Likely entry point**: `CalendarValueService.getSaveValue()` V2 branch — shown in [`overview.md § A.1`](overview.md#a1-calendarvalueservice-class). The `moment(input).toISOString()` call fails silently when `input` is a numeric string that moment.js cannot parse without an explicit format token. The fallthrough preserves the input verbatim in `this.data.value`.

**Call chain for V2 SFV(epoch)**:

```text
VV.Form.SetFieldValue('Field7', '1773543600000')
  → normalizeCalValue('1773543600000')          V2 routes via parseDateString (enableTime-gated)
    → parseDateString('1773543600000', …)        moment('1773543600000') returns an invalid Moment
  → calChange(value)                              calls toISOString() on the Date (still valid via epoch coercion)
  → getSaveValue(…)                               V2 branch: moment(input).toISOString() — returns 'Invalid date' or preserves input
  → setValueObjectValueByName('Field7', '1773543600000')   raw epoch stored
```

The root cause is V2's reliance on `moment(input)` without an explicit format token — moment.js treats numeric strings as ambiguous and does not auto-detect epoch-ms.

---

## Appendix: Field Configuration Reference

The test form has 8 field configurations referred to by letter throughout this document:

| Config | Field   | enableTime | ignoreTimezone | useLegacy | Description                                 |
| ------ | ------- | ---------- | -------------- | --------- | ------------------------------------------- |
| A      | Field7  | —          | —              | —         | Date-only baseline **(confirmed affected)** |
| B      | Field10 | —          | ✅             | —         | Date-only + ignoreTZ (unverified)           |
| C      | Field6  | ✅         | —              | —         | DateTime UTC **(confirmed affected)**       |
| D      | Field5  | ✅         | ✅             | —         | DateTime + ignoreTZ (unverified)            |
| E      | Field12 | —          | —              | ✅        | Legacy date-only (unverified)               |
| F      | Field11 | —          | ✅             | ✅        | Legacy date-only + ignoreTZ (unverified)    |
| G      | Field14 | ✅         | —              | ✅        | Legacy DateTime (unverified)                |
| H      | Field13 | ✅         | ✅             | ✅        | Legacy DateTime + ignoreTZ (unverified)     |

---

## Workarounds and Fix Recommendations

See [bug-9-v2-epoch-preserved-fix-recommendations.md](bug-9-v2-epoch-preserved-fix-recommendations.md) for workarounds, proposed remediation path, and backwards-compatibility assessment.
