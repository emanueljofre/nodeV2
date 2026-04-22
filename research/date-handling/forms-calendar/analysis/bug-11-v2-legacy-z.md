# FORM-BUG-V2-LEGACY-Z: V2 Appends `.000Z` to Values V1 Stored as Naive Local Strings

## What Happens

Under the V2 calendar pipeline, DateTime values (Configs C, D, G, H) stored through save/reload cycles come back as full ISO-with-Z strings — `"2026-03-15T00:00:00.000Z"` — where V1 stored the same logical value as a Z-less local string — `"2026-03-15T00:00:00"`. Both values represent the same calendar instant after the FormViewer re-hydrates them for display, but the stored representation has changed: V2 adds the millisecond + `Z` suffix that V1's `getSaveValue()` deliberately stripped (see [FORM-BUG-4](bug-4-legacy-save-format.md)).

The effect shows up in every DateTime config, both legacy (`useLegacy=true` — G, H) and non-legacy (C, D), across the typed-input path, the save-reload path, the round-trip path, and the GDOC read path. The audit counts 77 `.V2` expected-value entries carrying the `FORM-BUG-V2-LEGACY-Z` tag — the most widespread V2 behavior change on the baseline.

The calendar date is preserved. The user-visible form display is identical. The divergence is only observable in the stored raw string (partition value, API response, database cell).

---

## When This Applies

Three conditions must all be true:

### 1. The customer/database must have V2 enabled

V1 environments (vvdemo, WADNR) store the Z-less format via `getSaveValue()`'s legacy branch (`YYYY-MM-DD[T]HH:mm:ss` — explicitly no Z). V2 environments route the same save through `moment(input).toISOString()` (with `.tz('UTC', true)` for `ignoreTimezone=true`), producing the full ISO-with-Z.

### 2. The field must be DateTime (`enableTime=true`)

Configs C, D, G, H are affected. Date-only fields (`enableTime=false`, Configs A, B, E, F) have their own V2 divergence — see the `FORM-BUG-V2-UTCMIDNIGHT` tag in the baseline audit, which produces a similar `T00:00:00.000Z` suffix but on strings that V1 stored bare as `"2026-03-15"`. That is a distinct — though related — pattern; it is tracked in the audit under a different tag name but fires from the same V2 `getSaveValue` branch.

### 3. The write path must reach `getSaveValue()`

Typed input, popup input, `SetFieldValue`, and save-reload all hit `getSaveValue()` and therefore inherit the V2 format. URL-param init does not hit `getSaveValue` in the init sequence — it writes `data.value` directly from `parseDateString` output and is governed by `FORM-BUG-V2-URL-PARAM-NORMALIZE` instead.

---

## Severity: Low

No data loss. The calendar date is preserved. The `.000Z` suffix is _more honest_ about the value than V1's bare local string — FORM-BUG-4 considered V1's Z-stripping a genuine defect because it discarded timezone information. V2 restores the full ISO representation, which is the correct behavior; the "bug" status reflects the _inconsistency_ with V1 rather than a platform defect.

Why tagged as a bug rather than an improvement:

1. Downstream consumers with hard-coded expectations of the V1 format (regex matches on `T\d{2}:\d{2}:\d{2}$`, substring operations that strip the time portion assuming no suffix) will break when they encounter V2 output.
2. Cross-environment data flows (WADNR export → vv5dev import, or vice versa) produce records with mixed representations. Reports filtering on exact string equality will miss half the data.
3. The change was introduced without a documented migration path.

Severity is **Low** because the fix path is trivial (string normalization at the consumer) and no data is lost. The bug is a cross-environment consistency concern, not a runtime failure.

---

## How to Reproduce

### Prerequisites

- V2 environment (e.g., vv5dev/EmanuelJofre)
- A DateTime field (Config C, D, G, or H) — the Date Test Harness provides Field6 (C), Field5 (D), Field14 (G), Field13 (H)

### 1. Typed Input on Config H (Legacy DateTime + ignoreTZ)

```javascript
// Type "03/15/2026 12:00 AM" into Field13 (Config H)
VV.Form.VV.FormPartition.getValueObjectValue('Field13');
// V2: "2026-03-15T00:00:00.000Z"
// V1: "2026-03-15T00:00:00"
```

### 2. Save-Reload on Config C

Save the form with Field6 set to `2026-03-15T00:00:00`, reload, re-read:

```javascript
VV.Form.VV.FormPartition.getValueObjectValue('Field6');
// V2: "2026-03-15T00:00:00.000Z"
// V1 (per FORM-BUG-4): "2026-03-15T00:00:00" (Z stripped on save)
```

### 3. Round-Trip Stability on Config H (Legacy Immunity)

```javascript
VV.Form.SetFieldValue('Field13', VV.Form.GetFieldValue('Field13'));
VV.Form.VV.FormPartition.getValueObjectValue('Field13');
// V2: "2026-03-15T00:00:00.000Z" — stable (zero drift)
// V1: "2026-03-15T00:00:00" — stable (useLegacy=true immunity to FORM-BUG-5)
```

V2's suffix is present after a round-trip but does not drift — `useLegacy=true` still blocks FORM-BUG-5 under V2.

**Expected**: V2 preserves the V1 format `"2026-03-15T00:00:00"`.
**Actual**: V2 returns the full ISO with `.000Z` suffix.

This bug report is backed by a supporting test repository containing Playwright automation scripts, additional per-bug analysis documents, raw test data, and test case specifications. Access can be requested from the Solution Architecture team.

---

## The Problem in Detail

### V1 vs V2 Save Format

`CalendarValueService.getSaveValue()` ([overview.md § A.1](overview.md#a1-calendarvalueservice-class)) has two branches:

```javascript
getSaveValue(input, enableTime, ignoreTimezone) {
    let result = typeof input === 'string' ? input : input.toISOString();

    if (this.useUpdatedCalendarValueLogic) {
        // V2 path — full ISO with Z
        result = ignoreTimezone
            ? moment(input).tz('UTC', true).toISOString()
            : moment(input).toISOString();
    } else if (input.length > 0) {
        // V1 legacy path — strips Z for DateTime, extracts date portion for date-only
        if (enableTime) {
            result = moment(input).format('YYYY-MM-DD[T]HH:mm:ss');  // ← FORM-BUG-4: no Z
        } else {
            if (input.indexOf('T') > 0) {
                result = input.substring(0, input.indexOf('T'));
            }
        }
    }

    return result;
}
```

V1's legacy DateTime branch uses `moment.format('YYYY-MM-DD[T]HH:mm:ss')` — a bare local-time string without timezone marker. V2 uses `moment(input).toISOString()` — full ISO 8601 with `.SSSZ` suffix. The format diverges by exactly `.000Z`.

### Example Value Transformations

| Input to `getSaveValue`             | V1 Output                                           | V2 Output                                     |
| ----------------------------------- | --------------------------------------------------- | --------------------------------------------- |
| `"2026-03-15T03:00:00.000Z"`        | `"2026-03-15T00:00:00"` (BRT formatter)             | `"2026-03-15T00:00:00.000Z"` (ignoreTZ=true)  |
| `"2026-03-15T03:00:00.000Z"`        | `"2026-03-15T03:00:00"` (BRT formatter, enableTime) | `"2026-03-15T03:00:00.000Z"` (ignoreTZ=false) |
| Naive local `"2026-03-15T00:00:00"` | `"2026-03-15T00:00:00"`                             | `"2026-03-15T00:00:00.000Z"`                  |

The `.000Z` appears consistently in V2 output regardless of input format, `ignoreTimezone` flag, or `useLegacy` flag. V2's `getSaveValue` is the single write-path normalization point, and it always emits full ISO.

### Why the Form Display Is Identical

The FormViewer's in-memory `Date` object is the source of truth for UI rendering. Both `"2026-03-15T00:00:00"` and `"2026-03-15T00:00:00.000Z"` parse to a `Date` on reload — V1's bare string parses as local, V2's Z-suffixed string parses as UTC — but the display layer converts to local TZ for rendering and the user sees the same calendar value. The divergence is storage-only.

### Relationship to Other Bugs

| Bug                             | Relationship                                                                                                                                                                                                                                                                                                                                              |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FORM-BUG-4                      | Direct inverse. FORM-BUG-4 describes V1 _stripping_ the Z on save as a defect (loss of timezone information). FORM-BUG-V2-LEGACY-Z describes V2 _preserving_ the Z as a defect (inconsistency with V1). The two bugs cannot both be "fixes"; V2 is closer to the correct semantic but breaks V1 consumers. See [FORM-BUG-4](bug-4-legacy-save-format.md). |
| FORM-BUG-5                      | Independent on V2. FORM-BUG-5 (fake-Z drift) is V1-only — V2's GFV returns raw values and skips the fake-Z branch entirely. Config D under V2 is immune to drift. The `.000Z` on V2 Config D output is real (from `getSaveValue`), not fake (from `getCalendarFieldValue`).                                                                               |
| FORM-BUG-V2-EPOCH-PRESERVED     | Same V2 layer. EPOCH-PRESERVED is a specific case where V2's input normalization fails to recognize epoch-ms; LEGACY-Z is the general V2 output pattern. A coordinated `getSaveValue` fix for both is feasible.                                                                                                                                           |
| FORM-BUG-V2-URL-PARAM-NORMALIZE | Same V2 layer. URL-PARAM-NORMALIZE affects a different input path (URL query string, skips `getSaveValue` at init) and produces a different anchor (UTC midnight rather than UTC-of-local-midnight). The two together demonstrate V2's lack of a single normalization contract across input paths.                                                        |

---

## Verification

Confirmed on vv5dev EmanuelJofre (V2 path, build `20260418.1`, prog `6.1.20260416.1`) across 77 baseline audit entries, spanning Categories 1, 2, 3, 8, 8B, 9, and 9-GDOC (typed, save/reload, round-trip, and GDOC read paths) on Configs C, D, G, H in BRT, IST, and PST. Selected entries:

- [`2-H-BRT.V2`](../../../../testing/fixtures/test-data.js) (line 998) — Config H typed input, BRT, `"2026-03-15T00:00:00.000Z"`
- [`2-H-IST.V2`](../../../../testing/fixtures/test-data.js) (line 1263) — Config H typed input, IST
- [`3-H-BRT-BRT.V2`](../../../../testing/fixtures/test-data.js) (line 1881) — Config H save-reload BRT→BRT
- [`8-C-BRT.V2`](../../../../testing/fixtures/test-data.js) (line 2266) — Config C round-trip BRT
- [`9-GDOC-C-BRT-1.V2`](../../../../testing/fixtures/test-data.js) — Config C GDOC read

V2 baseline fingerprint: `f36b65dd`. V1 baseline (vvdemo): `b18dbfdb`. V1 stored these entries as `"2026-03-15T00:00:00"` (no Z, no milliseconds). The diff is uniformly `.000Z` appended on every V2 DateTime write.

See [`projects/emanueljofre-vv5dev/testing/date-handling/v2-baseline-audit.md`](../../../../projects/emanueljofre-vv5dev/testing/date-handling/v2-baseline-audit.md) § KNOWN_BUG_PERSISTS for the 77 tagged entries.

Catalog entry: [`docs/reference/form-fields.md § Known Bugs`](../../../../docs/reference/form-fields.md#known-bugs-calendar-field).

Cross-cutting V1 vs V2 story: [`overview.md § V1 vs V2`](overview.md).

---

## Technical Root Cause

**Environment**: V2 pipeline only (`useUpdatedCalendarValueLogic=true`).

**Entry point**: `CalendarValueService.getSaveValue()` V2 branch ([overview.md § A.1](overview.md#a1-calendarvalueservice-class) lines 1174–1175):

```javascript
if (this.useUpdatedCalendarValueLogic) {
    result = ignoreTimezone ? moment(input).tz('UTC', true).toISOString() : moment(input).toISOString();
}
```

`moment.toISOString()` always emits `YYYY-MM-DDTHH:mm:ss.SSSZ`. V1's legacy branch uses `moment.format('YYYY-MM-DD[T]HH:mm:ss')` which is Z-less by design (the `[...]` brackets escape the `T` as a literal; no format token for the zone suffix). The V2 branch does not mirror the V1 format — it chose full ISO.

**Call chain for any V2 DateTime write**:

```text
User input / SetFieldValue / popup
  → normalizeCalValue()        V2 routes via parseDateString
  → calChange(Date)            calls toISOString() → full ISO with Z
  → getSaveValue(input, …)     V2 branch always emits full ISO with Z
  → setValueObjectValueByName  stores 'YYYY-MM-DDTHH:mm:ss.000Z'
```

The defect is the format choice in the V2 `getSaveValue` branch. Changing `.toISOString()` to `.format('YYYY-MM-DD[T]HH:mm:ss')` would restore V1 parity but reintroduce FORM-BUG-4 (timezone stripping). The platform team faces a pick-one: either V2 preserves the Z (current) or V2 drops the Z for V1 parity.

---

## Appendix: Field Configuration Reference

See [bug-9-v2-epoch-preserved.md § Appendix](bug-9-v2-epoch-preserved.md#appendix-field-configuration-reference) for the field map. FORM-BUG-V2-LEGACY-Z affects all DateTime configs (C, D, G, H) — legacy and non-legacy alike.

---

## Workarounds and Fix Recommendations

See [bug-11-v2-legacy-z-fix-recommendations.md](bug-11-v2-legacy-z-fix-recommendations.md) for workarounds, proposed remediation path, and backwards-compatibility assessment.
