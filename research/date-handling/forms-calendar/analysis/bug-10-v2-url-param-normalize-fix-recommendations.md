# FORM-BUG-V2-URL-PARAM-NORMALIZE: Workarounds and Fix Recommendations

Companion document to [bug-10-v2-url-param-normalize.md](bug-10-v2-url-param-normalize.md). Read the bug report first for full context on the defect.

---

## Workarounds

### Recommended: Post-Load Re-normalization via `SetFieldValue`

If the application needs consistent stored values across URL-param and typed input paths, immediately re-apply the value via `SetFieldValue` after form load:

```javascript
// Re-normalize URL-param values after load
VV.Form.OnLoad(() => {
    ['Field7', 'Field10'].forEach((f) => {
        const v = VV.Form.GetFieldValue(f);
        if (v) VV.Form.SetFieldValue(f, v); // Routes through SFV path → consistent UTC-of-local-midnight
    });
});
```

**Tradeoff**: In UTC+ timezones, this re-triggers FORM-BUG-7 on the SFV path (local midnight → previous UTC day). If the field is a date-only config in an IST deployment, leaving the URL-param UTC-midnight is actually _more_ correct than the SFV path.

### Alternative: Always Use ISO URL Parameters

Pass the value via URL in full ISO form rather than US-format:

```
?Field7=2026-03-15T00:00:00.000Z
```

V2 normalises this identically via `parseDateString` — `Z` is stripped, then re-anchored. The stored raw value is the same as for `03/15/2026`, but your calling code is explicit about the UTC intent. Does not fix the SFV/URL divergence but removes ambiguity about what the URL is asserting.

### Alternative: Document and Accept the Divergence

If downstream consumers (reports, cross-form chains) don't filter on the raw ISO representation of the stored value and only consume the calendar _date_, the divergence is invisible. Accepting it is a legitimate choice — the bug is low-impact when no code depends on the exact UTC timestamp.

---

## Proposed Fix

### Recommended: Align URL-Param Path with SFV Anchoring

The cleanest fix is to make `initCalendarValueV2` route the URL-param path through the same `getSaveValue` normalization the SFV path uses, so both inputs produce identical stored values:

```javascript
// Current (URL-param branch in initCalendarValueV2):
if (this.data.enableQListener && this.data.text) {
    this.data.value = this.calendarValueService.parseDateString(
        this.data.text,
        this.data.enableTime,
        this.data.ignoreTimezone
    );
    this.value = new Date(this.data.value);
}

// Proposed: normalize via the SFV path
if (this.data.enableQListener && this.data.text) {
    // Parse into a Date object first, then route through getSaveValue
    const parsed = new Date(
        this.calendarValueService.parseDateString(this.data.text, this.data.enableTime, this.data.ignoreTimezone)
    );
    this.data.value = this.calendarValueService.getSaveValue(
        parsed.toISOString(),
        this.data.enableTime,
        this.data.ignoreTimezone
    );
    this.value = parsed;
}
```

**Why this option**: eliminates the URL-vs-SFV divergence, which is the core defect. The trade-off is that URL-param input in UTC+ timezones will inherit FORM-BUG-7 (date-only fields store previous UTC day) — but that's a separate, already-tracked bug, and a coordinated fix for FORM-BUG-7 + URL-PARAM-NORMALIZE is cleaner than leaving two inconsistent paths.

### Alternative: Make URL-Param the Canonical Path

Reverse the alignment: change the SFV path (`getSaveValue` V2 branch) to use the UTC-midnight anchor instead of the current `moment(input).toISOString()`. This would fix FORM-BUG-7 and URL-PARAM-NORMALIZE simultaneously — all inputs would resolve to UTC midnight of the intended calendar day.

```javascript
// Proposed getSaveValue V2 branch (for date-only fields)
if (this.useUpdatedCalendarValueLogic) {
    if (!enableTime) {
        // Anchor on UTC midnight — matches URL-param path
        const dateOnly = typeof input === 'string' ? input.substring(0, 10) : input.toISOString().substring(0, 10);
        return dateOnly + 'T00:00:00.000Z';
    }
    // DateTime branch unchanged
    result = ignoreTimezone ? moment(input).tz('UTC', true).toISOString() : moment(input).toISOString();
}
```

This is the option that aligns V2 behavior with the FORM-BUG-7 fix recommendation in [bug-7-fix-recommendations.md](bug-7-fix-recommendations.md). Higher backwards-compatibility risk because every existing V2 date-only record would shift by one UTC-offset worth of hours on next save.

### Alternative: Defer — Document and Monitor

If the URL-param pattern is rare in customer scripts (anecdotally, few customers use URL-param-driven form presets for date values), the defect can be left as a documentation item. Add a note to `docs/reference/form-fields.md` § Known Bugs that URL-param and SFV paths produce different stored representations on V2. Watch for customer escalations before investing in a code fix.

---

## Fix Impact Assessment

### What Changes If Fixed (Option 1 — Align URL-Param with SFV)

- URL-param init on Config A in BRT stores `"2026-03-15T03:00:00.000Z"` (matches SFV)
- In IST, URL-param init stores `"2026-03-14T18:30:00.000Z"` (FORM-BUG-7 re-enters — the SFV path's existing bug)
- Reports and SQL queries that filter on the raw ISO field value become consistent across URL-param and SFV input channels
- No change on V1

### Backwards Compatibility Risk: MEDIUM

Any existing V2 records populated via URL-param currently carry `"T00:00:00.000Z"`. After the fix, new URL-param saves carry `"T03:00:00.000Z"` (BRT) or `"T18:30:00.000Z"` (IST, FORM-BUG-7). The two cohorts are indistinguishable at query time, creating a split database. Partial remediation: no migration, accept the mixed state — new saves are self-consistent with SFV records, old records remain at UTC midnight.

### Regression Testing Scope

- Category 4 (URL Parameters) on V2 for all 8 configs × BRT/IST — verify URL-param output matches SFV output for the same calendar date
- Category 1/2/7 (popup, typed, SFV) on V2 for all configs × BRT/IST — verify SFV behavior unchanged
- Cross-form data chains (FillinAndRelate) that pass values between URL-param fields — verify chain integrity
- Update `testing/fixtures/test-data.js` `4-A-us-BRT.V2` expected values, remove the `FORM-BUG-V2-URL-PARAM-NORMALIZE` tag

### Code Path Reference

The defective path lives in the bundled FormViewer:

- `CalendarValueService.initCalendarValueV2()` URL-param branch — [overview.md § A.2](overview.md#a2-initcalendarvaluev2-function) lines 1218–1228 (`data.enableQListener && data.text` branch)
- `CalendarValueService.parseDateString()` — [overview.md § A.1](overview.md#a1-calendarvalueservice-class) lines 1189–1204

Any fix should be coordinated with the platform team that owns the FormViewer bundle; this repo can only propose the change and verify through regression.

### Coordinated Fix Opportunity

FORM-BUG-7 (date-only wrong day in UTC+) and FORM-BUG-V2-URL-PARAM-NORMALIZE share the same root cause — inconsistent anchoring between local midnight and UTC midnight across different input paths. A platform-wide decision on the canonical anchor (preferably UTC midnight per the FORM-BUG-7 recommendation) would close both bugs with a single design change. See [bug-7-fix-recommendations.md § Proposed Fix](bug-7-fix-recommendations.md#proposed-fix).
