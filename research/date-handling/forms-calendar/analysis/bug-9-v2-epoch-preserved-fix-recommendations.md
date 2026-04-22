# FORM-BUG-V2-EPOCH-PRESERVED: Workarounds and Fix Recommendations

Companion document to [bug-9-v2-epoch-preserved.md](bug-9-v2-epoch-preserved.md). Read the bug report first for full context on the defect.

---

## Workarounds

### Recommended: Stringify Epoch to ISO Before `SetFieldValue`

Convert the epoch-ms to an ISO 8601 string before passing it to `SetFieldValue`. This forces V2 down the ISO normalization path, matching V1 behavior.

```javascript
// UNSAFE — triggers FORM-BUG-V2-EPOCH-PRESERVED
VV.Form.SetFieldValue('Field7', String(Date.now()));

// SAFE — force V2 into the ISO path
VV.Form.SetFieldValue('Field7', new Date(Date.now()).toISOString());
```

For date-only fields, strip the time portion if your field format expects `"YYYY-MM-DD"`:

```javascript
const iso = new Date(epoch).toISOString(); // "2026-03-15T00:00:00.000Z"
const dateOnly = iso.substring(0, 10); // "2026-03-15"
VV.Form.SetFieldValue('Field7', dateOnly);
```

### Alternative: Parse GFV Defensively

If you cannot control the upstream write path (e.g., the value came from another script or a third-party integration), wrap `GetFieldValue` reads with a numeric-coercion fallback:

```javascript
function safeDateFromField(fieldName) {
    const gfv = VV.Form.GetFieldValue(fieldName);
    if (!gfv) return null;
    // Try ISO parse first, fall back to epoch-ms
    let d = new Date(gfv);
    if (isNaN(d)) d = new Date(+gfv); // Coerce numeric string to Number
    return isNaN(d) ? null : d;
}
```

This is verbose but tolerates both V1 ISO output and V2 epoch-preserved output. Use in migration windows where scripts run across V1 and V2 environments.

### Alternative: Block Epoch Inputs in Application Code

Add a linter rule or code review gate: `SetFieldValue` must receive either a `Date` object, an ISO string, or a `"MM/DD/YYYY"` string — never a raw epoch. Document in the team's scripting standards.

---

## Proposed Fix

### Recommended: Normalize Numeric Inputs in V2 `getSaveValue`

The V2 `getSaveValue` branch currently does:

```javascript
if (this.useUpdatedCalendarValueLogic) {
    result = ignoreTimezone ? moment(input).tz('UTC', true).toISOString() : moment(input).toISOString();
}
```

The fix is to detect numeric inputs and use moment's explicit epoch-ms format token:

```javascript
if (this.useUpdatedCalendarValueLogic) {
    // Normalize numeric inputs (epoch-ms) before formatting
    const normalized = /^\d+$/.test(input) ? moment(Number(input)) : moment(input);
    result = ignoreTimezone ? normalized.tz('UTC', true).toISOString() : normalized.toISOString();
}
```

Or more explicitly with the format token:

```javascript
const isEpoch = /^\d+$/.test(input);
const m = isEpoch ? moment(input, 'x') : moment(input); // 'x' = unix ms
result = ignoreTimezone ? m.tz('UTC', true).toISOString() : m.toISOString();
```

**Why this option**:

1. Matches V1 behavior (epoch-ms → ISO normalization)
2. Explicit about the numeric-vs-string detection — no reliance on moment.js heuristics
3. Symmetric with the URL-param path (which already routes through `parseDateString`)
4. Fixes both `ignoreTimezone=true` and `ignoreTimezone=false` branches with one change

### Alternative: Defer — Document as Expected V2 Behavior

If the platform team's position is "V2 accepts any input type the form display can render, and downstream code must handle the GFV return type," then the defect becomes a documentation item:

- Add a `SetFieldValue` input-type contract to `docs/reference/vv-form-api.md`
- Warn that V2 preserves numeric inputs verbatim
- Point consumers at the `GetDateObjectFromCalendar()` alternative (returns a real `Date` object — no string-parsing ambiguity)

This is acceptable only if V2 is the long-term target and no customers have scripts that round-trip epoch values. Given that `Date.now()` is the canonical way to produce a current timestamp in JS, the epoch input pattern is common enough that the fix path is preferred.

---

## Fix Impact Assessment

### What Changes If Fixed

- V2 SFV(epoch) writes an ISO-normalized value matching V1
- GFV(epoch-field) returns a parseable ISO/date string — `Date.parse(gfv)` and `new Date(gfv)` both succeed
- No change for ISO, US-format, native `Date`, or calendar-popup inputs (already normalized)

### Backwards Compatibility Risk: LOW

No V2 code paths currently rely on the epoch-preserved output — the behavior is a regression from V1 rather than an intentional feature. Scripts that accidentally round-tripped `"1773543600000"` to another field via `GetFieldValue → SetFieldValue` would change behavior, but the new behavior matches what V1 already did (silent normalization to ISO), so the fix restores the platform-wide consistent contract.

### Regression Testing Scope

- Re-run Category 7 (SetFieldValue Formats) on V2 for all 8 configs × BRT/IST with epoch-ms input — verify V2 matches V1 normalized output
- Verify non-epoch inputs (ISO, US-format, Date objects, calendar popup) continue to produce the existing V2 expected values
- Confirm the `getSaveValue` change does not perturb the URL-param or typed-input paths (they enter `getSaveValue` with already-normalized input)
- Update `testing/fixtures/test-data.js` `7-A-epoch.V2` and `7-C-epoch.V2` expected values to the ISO forms, remove the `FORM-BUG-V2-EPOCH-PRESERVED` tag

### Code Path Reference

The defective path lives in the bundled FormViewer (`main.js` in the Angular front-end package, not this repo). The structural reference is in [`overview.md § A.1 calendarValueService Class`](overview.md#a1-calendarvalueservice-class) (`getSaveValue` V2 branch, around source line 1174 in `overview.md`). The sibling V2 init entry points — `initCalendarValueV2` and `parseDateString` — are also shown there (§ A.2). Any fix should be coordinated with the platform team that owns the FormViewer bundle; this repo can only propose the change and verify through regression.
