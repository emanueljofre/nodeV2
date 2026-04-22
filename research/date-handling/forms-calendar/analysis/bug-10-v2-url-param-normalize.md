# FORM-BUG-V2-URL-PARAM-NORMALIZE: V2 URL-Param Init Normalizes to UTC ISO, Ignoring `ignoreTimezone`

## What Happens

Under the V2 calendar pipeline, a date value arriving via URL query parameter (`?Field7=03/15/2026` on a Config A date-only field, `ignoreTimezone=false`) is stored as `"2026-03-15T00:00:00.000Z"` — UTC midnight, serialised as a full ISO string with a `Z` suffix. V1 stored the same URL parameter verbatim in its input form (`"03/15/2026"`).

The crucial detail: the value V2 stores for the same field via `SetFieldValue` or typed calendar input is **different** — it would be `"2026-03-15T03:00:00.000Z"` in BRT (UTC-3) because the SFV path applies local-to-UTC conversion (producing the UTC representation of local midnight). The URL-param init path, by contrast, treats the value as TZ-naive and anchors it to UTC midnight regardless of the user's browser timezone or the field's `ignoreTimezone` flag.

Result: the same form field stores different UTC values depending on which input channel populated it. A record created by URL-param presets and one created by user-typed input diverge at the database level even though the calendar date displays identically.

---

## When This Applies

Three conditions must all be true:

### 1. The customer/database must have V2 enabled

Only environments with **"Use Updated Calendar Control Logic"** checked run V2 (confirmed on vv5dev/EmanuelJofre). V1 environments store the URL param verbatim and never reach this code path.

### 2. The field must have `enableQListener=true` and be populated via a URL query parameter

The URL-param init path only fires when `enableQListener` is set on the field (part of the calendar field definition) **and** a matching query string arrives on form load. The value arrives as `this.data.text` in `initCalendarValueV2` and is routed directly through `parseDateString` (see [overview.md § A.2](overview.md#a2-initcalendarvaluev2-function), lines 1218–1228).

### 3. Config A (date-only, `ignoreTimezone=false`) is confirmed; other configs unverified

Confirmed 2026-04-22 on vv5dev (build `20260418.1`) via the `4-A-us-BRT.V2` slot.

| Config    | `ignoreTimezone` | V1 URL-param store | V2 URL-param store           | SFV/typed store (V2, BRT)    | Divergent in V2?      |
| --------- | ---------------- | ------------------ | ---------------------------- | ---------------------------- | --------------------- |
| A         | false            | `"03/15/2026"`     | `"2026-03-15T00:00:00.000Z"` | `"2026-03-15T03:00:00.000Z"` | **Yes (confirmed)**   |
| B         | true             | —                  | —                            | —                            | Expected — unverified |
| C, D, E–H | varies           | —                  | —                            | —                            | Unverified            |

Given V2 routes all configs' URL-param input through `parseDateString`, the bug is expected to apply broadly — though the _magnitude_ of the divergence depends on the timezone and `ignoreTimezone` flag. At UTC+0, the bug is structurally present but numerically invisible (UTC midnight matches local midnight).

---

## Severity: Medium

Not data-lossy — the calendar date (`2026-03-15`) is preserved across both input paths — but the stored UTC representation differs between URL-param init and SFV/typed input on the same field. Impact:

- Reports, SQL queries, and API filters that compare `Field7 eq '2026-03-15T00:00:00.000Z'` will match URL-param records but miss user-typed records (which store `'2026-03-15T03:00:00.000Z'` in BRT).
- Cross-form data chains that consume the raw stored value see different timestamps depending on which form populated the upstream field.
- The `ignoreTimezone=false` flag is semantically ignored on the URL-param path — a contract violation.

The bug is lower-severity than FORM-BUG-7 (which stores the wrong _calendar day_) because the day component is correct. It's more like a "format/TZ-anchor inconsistency" than a data-integrity defect.

---

## How to Reproduce

### Prerequisites

- V2 environment (e.g., vv5dev/EmanuelJofre)
- BRT timezone (the divergence is visible at any non-UTC+0 timezone — UTC+0 masks it)
- A Config A field with `enableQListener=true` (the vv5dev Date Test Harness form Field7 meets this)

### 1. Load the form via URL parameter

```
https://vv5dev.visualvault.com/#/forms/view/{formid}?Field7=03/15/2026
```

Inspect the stored raw value:

```javascript
VV.Form.VV.FormPartition.getValueObjectValue('Field7');
// V2: "2026-03-15T00:00:00.000Z"
// V1: "03/15/2026"
```

### 2. Compare against SFV on the same field

```javascript
VV.Form.SetFieldValue('Field7', '03/15/2026');
VV.Form.VV.FormPartition.getValueObjectValue('Field7');
// V2 (BRT): "2026-03-15T03:00:00.000Z"  ← different from URL-param value
```

**Expected**: URL-param and SFV paths produce the same stored representation for the same field.
**Actual**: URL-param stores UTC midnight; SFV stores UTC-of-local-midnight.

This bug report is backed by a supporting test repository containing Playwright automation scripts, additional per-bug analysis documents, raw test data, and test case specifications. Access can be requested from the Solution Architecture team.

---

## The Problem in Detail

### The Two V2 Input Paths

V2 has two distinct entry points for calendar value initialization, and they route through `parseDateString` with different `ignoreTimezone` arguments:

```javascript
// initCalendarValueV2() — from overview.md § A.2
if (this.data.enableQListener && this.data.text) {
    // URL Query String path
    this.data.value = this.calendarValueService.parseDateString(
        this.data.text,
        this.data.enableTime,
        this.data.ignoreTimezone // ← Uses the field's flag
    );
    this.value = new Date(this.data.value);
}
```

At first glance this looks correct — `ignoreTimezone` is passed through. But inspect `parseDateString` ([overview.md § A.1](overview.md#a1-calendarvalueservice-class)):

```javascript
parseDateString(input, enableTime, ignoreTimezone) {
    let stripped = input.replace('Z', '');
    let result;
    if (ignoreTimezone) {
        result = moment(stripped);                         // local parse
    } else {
        result = moment(stripped).tz('UTC', true).local(); // UTC-anchored, local display
    }
    if (!enableTime) {
        result = result.startOf('day');                    // startOf('day') in UTC or local depending on prior branch
    }
    return result.toISOString();
}
```

For Config A (`enableTime=false`, `ignoreTimezone=false`) with input `"03/15/2026"`:

1. `stripped = "03/15/2026"`
2. `ignoreTimezone=false` → `moment("03/15/2026").tz("UTC", true).local()` — `.tz("UTC", true)` treats the input as if it were already UTC; `.local()` converts for display. The resulting moment is "local representation of 2026-03-15 00:00 UTC".
3. `result.startOf('day')` — in the local TZ, this rolls back to local midnight of the same calendar day (so BRT March 15 00:00 local = March 15 03:00 UTC).
4. `.toISOString()` — but wait: the earlier `.tz('UTC', true).local()` set the internal UTC moment to March 15 00:00 UTC. `.startOf('day')` at BRT resolves to March 15 00:00 local = March 15 03:00 UTC, overwriting the prior UTC anchor.

The observed result on vv5dev is `"2026-03-15T00:00:00.000Z"` — which means the `.startOf('day')` fires _before_ the `.local()` effect is material, or the moment chain resolves to UTC midnight through a path the simplified source reading misses. The obfuscated bundled code may differ subtly from the reconstruction in overview.md.

Regardless of the exact moment.js chain, the _observable_ V2 behavior on the URL-param path produces `"2026-03-15T00:00:00.000Z"` — TZ-naive UTC midnight — while the SFV path produces `"2026-03-15T03:00:00.000Z"` — UTC-of-local-midnight.

### Why the Two Paths Diverge

`SetFieldValue` flows through `normalizeCalValue → calChange → getSaveValue`. The V2 `getSaveValue` branch is `moment(input).toISOString()` (no `.tz('UTC', true)`), which for input `"03/15/2026"` in BRT gives March 15 03:00 UTC. The URL-param path skips `getSaveValue` entirely in the init sequence — it writes `this.data.value` directly from `parseDateString` output, and the later `setValueObjectValueByName` call uses that pre-computed value. The two paths hit different normalization logic on the same input.

### Why FORM-BUG-7 Still Applies Under V2 on SFV But Not URL-Param

FORM-BUG-7 (wrong day stored for UTC+ timezones) occurs when local midnight on a UTC+ user's machine falls on the previous UTC calendar day. The SFV path under V2 reproduces FORM-BUG-7 (confirmed via `FORM-BUG-7-persists-on-V2` tag on the baseline audit) because SFV anchors on local midnight. The URL-param path is **immune** — it anchors on UTC midnight directly, so an IST user loading `?Field7=03/15/2026` stores March 15 UTC (correct), while an IST user typing March 15 into the calendar stores March 14 UTC (wrong).

This creates an odd situation: the URL-param path is both the _cause_ of FORM-BUG-V2-URL-PARAM-NORMALIZE (it disagrees with SFV) and the _workaround_ for FORM-BUG-7 (it bypasses the local-midnight parse). See FORM-BUG-7's "URL parameter input is immune" note in [`bug-7-wrong-day-utc-plus.md`](bug-7-wrong-day-utc-plus.md#3-most-input-methods-are-affected).

### Relationship to Other Bugs

| Bug                         | Relationship                                                                                                                                                                                                                                                                                                                    |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FORM-BUG-7                  | Inverse symptom on the same structural choice. URL-param anchors on UTC midnight; SFV anchors on local midnight. FORM-BUG-7 affects the SFV path in UTC+ timezones; URL-PARAM-NORMALIZE affects the URL-param path in all non-UTC+0 timezones. A coordinated fix should pick one anchor (UTC midnight) and apply it everywhere. |
| FORM-BUG-1                  | Same root mechanism: V2 `parseDateString` unconditionally strips the `Z` suffix and re-parses. For URL-param input without a `Z`, the strip is a no-op, but the `.tz('UTC', true).local()` chain is the V2-specific addition that produces the UTC-midnight anchor.                                                             |
| FORM-BUG-V2-EPOCH-PRESERVED | Same V2 layer. Opposite direction — URL-param _over-normalizes_ (adds a UTC anchor the SFV path doesn't); EPOCH-PRESERVED _under-normalizes_ (doesn't convert epoch to ISO the way V1 did). Both reflect V2's fragmented input-normalization pipeline.                                                                          |
| FORM-BUG-V2-LEGACY-Z        | V2's pattern of adding `.000Z` to values that V1 stored bare. URL-PARAM-NORMALIZE is a specific case where that `.000Z` appears on a URL-param init; LEGACY-Z is the broader pattern on save format.                                                                                                                            |

---

## Verification

Confirmed on vv5dev EmanuelJofre (V2 path, build `20260418.1`, prog `6.1.20260416.1`) 2026-04-22 via:

- [`4-A-us-BRT.V2`](../../../../testing/fixtures/test-data.js) (line 6872) — Config A, BRT, URL param `03/15/2026` → expected raw `'2026-03-15T00:00:00.000Z'`, expected API `'2026-03-15T00:00:00.000Z'`

V1 baseline (vvdemo, fingerprint `b18dbfdb`): same URL param stored as `"03/15/2026"` verbatim. V2 baseline fingerprint: `f36b65dd`.

See [`projects/emanueljofre-vv5dev/testing/date-handling/v2-review-queue.md`](../../../../projects/emanueljofre-vv5dev/testing/date-handling/v2-review-queue.md) for the closure record and [`v2-baseline-audit.md`](../../../../projects/emanueljofre-vv5dev/testing/date-handling/v2-baseline-audit.md) for the full diff context.

Catalog entry: [`docs/reference/form-fields.md § Known Bugs`](../../../../docs/reference/form-fields.md#known-bugs-calendar-field).

The cross-cutting story for V1 vs V2 divergence is in [`overview.md § V1 vs V2`](overview.md).

---

## Technical Root Cause

**Environment**: V2 pipeline only (`useUpdatedCalendarValueLogic=true`).

**Likely entry points** (in the bundled FormViewer, `main.js` in the Angular front-end package — not in this repo):

- `CalendarValueService.initCalendarValueV2()` — URL-param branch ([overview.md § A.2](overview.md#a2-initcalendarvaluev2-function), lines 1218–1228)
- `CalendarValueService.parseDateString()` ([overview.md § A.1](overview.md#a1-calendarvalueservice-class))

**Call chain for V2 URL-param load**:

```text
Form loads with ?Field7=03/15/2026
  → initCalendarValueV2()
    → data.enableQListener && data.text branch fires
    → parseDateString('03/15/2026', enableTime=false, ignoreTimezone=false)
      → moment('03/15/2026').tz('UTC', true).local().startOf('day').toISOString()
      → "2026-03-15T00:00:00.000Z"
  → data.value = "2026-03-15T00:00:00.000Z"
  → setValueObjectValueByName('Field7', "2026-03-15T00:00:00.000Z")
```

The divergence from the SFV path is structural: SFV hits `normalizeCalValue → calChange → getSaveValue`, which for V2 uses `moment(input).toISOString()` without the `.tz('UTC', true)` anchor. Two different normalization functions, two different outputs, same input.

---

## Appendix: Field Configuration Reference

See [bug-9-v2-epoch-preserved.md § Appendix](bug-9-v2-epoch-preserved.md#appendix-field-configuration-reference) for the field map. The URL-param bug is confirmed on Config A and expected to apply to all configs with `enableQListener=true`.

---

## Workarounds and Fix Recommendations

See [bug-10-v2-url-param-normalize-fix-recommendations.md](bug-10-v2-url-param-normalize-fix-recommendations.md) for workarounds, proposed remediation path, and backwards-compatibility assessment.
