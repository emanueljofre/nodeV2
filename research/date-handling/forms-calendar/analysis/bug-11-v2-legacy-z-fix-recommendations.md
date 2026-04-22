# FORM-BUG-V2-LEGACY-Z: Workarounds and Fix Recommendations

Companion document to [bug-11-v2-legacy-z.md](bug-11-v2-legacy-z.md). Read the bug report first for full context on the defect.

---

## Workarounds

### Recommended: Normalize at the Consumer

The simplest mitigation is a one-liner at any script that consumes a raw DateTime value from a V2 environment:

```javascript
function stripMsZ(v) {
    return v && v.endsWith('.000Z') ? v.substring(0, 19) : v;
}

const normalized = stripMsZ(VV.Form.GetFieldValue('Field6'));
// "2026-03-15T00:00:00.000Z" → "2026-03-15T00:00:00"
// Works identically on V1 output (no-op)
```

This is safe across V1 and V2 environments. Use it wherever a script compares DateTime strings for equality, does regex parsing, or passes the value to a report filter.

### Alternative: Parse to Date Object Everywhere

Avoid string comparisons entirely. `new Date()` accepts both V1 and V2 formats:

```javascript
const d = new Date(VV.Form.GetFieldValue('Field6'));
```

Downstream logic works on the `Date` object. Format-agnostic. Preferred for any new code.

### Alternative: Use `GetDateObjectFromCalendar` Instead of GFV

For V2 environments, `VV.Form.GetDateObjectFromCalendar(fieldName)` returns a native `Date` directly without the string transformation path. Bypasses both this bug and FORM-BUG-5 (which V2 already fixes). See [bug-5-fix-recommendations.md § Workarounds](bug-5-fix-recommendations.md#workarounds).

### Alternative: Accept the Format Change

If downstream consumers are tolerant of either format — ISO-with-Z and ISO-without-Z both parse correctly in `new Date()`, `moment()`, most SQL `DATETIME` columns, and the VV API — no action is required. The bug is a cosmetic inconsistency that only affects code doing exact string comparisons.

---

## Proposed Fix

### Recommended: Defer — V2 Behavior Is Correct, Not a Bug

The honest recommendation: **do not fix V2 to match V1**. V1's Z-stripping is the underlying defect ([FORM-BUG-4](bug-4-legacy-save-format.md)) — it discards timezone information and creates the "mixed timezone storage" problem that has caused repeated customer confusion (WADNR-10407 / Freshdesk #124697, among others). V2's full-ISO output is the correct long-term representation.

The FORM-BUG-V2-LEGACY-Z tag exists to flag the diff for the baseline audit, not to trigger a code change. The platform direction should be:

1. **Keep V2 as-is** — full ISO with `.000Z` is the canonical stored format
2. **Migrate V1 environments** to V2 on a controlled schedule (toggle the Database-scope "Use Updated Calendar Control Logic" flag)
3. **Document the format contract** in `docs/reference/form-fields.md` — V2 stores `YYYY-MM-DDTHH:mm:ss.SSSZ`, V1 stores `YYYY-MM-DDTHH:mm:ss` (no Z)
4. **Provide a consumer-side normalization utility** in the VV script runtime so custom scripts don't need to re-implement `stripMsZ`

### Alternative: Match V1 Format in V2 (Not Recommended)

If backwards compatibility with V1 consumers is the deciding factor, the minimal change is:

```javascript
// Current V2 branch:
if (this.useUpdatedCalendarValueLogic) {
    result = ignoreTimezone ? moment(input).tz('UTC', true).toISOString() : moment(input).toISOString();
}

// Proposed — match V1 format for enableTime fields
if (this.useUpdatedCalendarValueLogic) {
    if (enableTime) {
        const m = ignoreTimezone ? moment(input).tz('UTC', true) : moment(input);
        result = m.format('YYYY-MM-DD[T]HH:mm:ss'); // No Z — V1 parity
    } else {
        result = ignoreTimezone ? moment(input).tz('UTC', true).toISOString() : moment(input).toISOString();
    }
}
```

This reintroduces FORM-BUG-4 (Z stripping) into V2, re-creating the mixed-timezone storage problem V2 was supposed to fix. **Strongly not recommended** — the only reason to consider it is if a major customer has hard-coded V1 format dependencies that cannot be migrated.

### Alternative: Platform-Level Format Contract

A middle path — introduce a Central Admin toggle for the save format, letting each customer/database pick V1 (Z-less) or V2 (full ISO) output. Adds complexity but lets migrations proceed at customer pace. Not recommended for ongoing maintenance cost; better to commit to V2 format.

---

## Fix Impact Assessment (for the "Defer — V2 is correct" path)

### What Changes

Nothing in V2. Documentation added to `docs/reference/form-fields.md` clarifying the V1 vs V2 format contract. Optionally, a `stripMsZ`-style utility in the VV script runtime.

### Backwards Compatibility Risk: NONE

V2 behavior is already in production on vv5dev/EmanuelJofre. Deferring means no code change, no risk.

### Migration Risk for V1→V2 Customer Moves

When a customer migrates from a V1 environment to V2 (toggle the Database-scope flag), existing records continue to carry the V1 format (`"2026-03-15T00:00:00"`, no Z). New saves under V2 carry the V2 format (`"2026-03-15T00:00:00.000Z"`). The database ends up with mixed formats.

Impact:

- `new Date()` and `moment()` parse both formats → display layer unaffected
- SQL filters on `CAST` or `CONVERT(datetime, value)` parse both formats → most queries unaffected
- Exact string-equality filters (`WHERE Field6 = '2026-03-15T00:00:00'`) will miss V2-saved records
- Reports that substring the raw value (`LEFT(value, 19)`) will produce identical output for both formats

**Mitigation**: run a one-time migration script post-V2-toggle to normalize existing records to full ISO format. The migration is idempotent (running it twice does nothing) and does not shift calendar dates.

### Regression Testing Scope (for Defer path)

Minimal — confirm existing 77 `.V2` entries continue to match `"YYYY-MM-DDTHH:mm:ss.000Z"` across a regression run after any FormViewer bundle update. No new test slots required.

### Code Path Reference

The V2 `getSaveValue` branch lives in the bundled FormViewer (`main.js` in the Angular front-end package, not in this repo). Structural reference: [`overview.md § A.1`](overview.md#a1-calendarvalueservice-class) lines 1174–1175.

### Coordinated Fix Opportunity

FORM-BUG-4 (V1 Z-stripping) and FORM-BUG-V2-LEGACY-Z (V2 Z-preservation) are two views of the same fork in the road. Committing to V2 format as the platform standard resolves both:

- FORM-BUG-4 ceases to be a concern in new deployments
- FORM-BUG-V2-LEGACY-Z reclassifies as "expected behavior change" rather than "bug"

See [bug-4-fix-recommendations.md](bug-4-fix-recommendations.md) for the V1 side of the conversation. A unified platform decision — announced, documented, scheduled — closes both items without code risk.
