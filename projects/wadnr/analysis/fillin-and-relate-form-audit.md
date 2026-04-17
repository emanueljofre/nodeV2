# A1 — FillinAndRelateForm Audit

| Field | Value |
|---|---|
| **Date** | 2026-04-17 |
| **Scope** | Does `VV.Form.Global.FillinAndRelateForm` and its callers propagate Config D calendar values through a URL-param chain that activates FORM-BUG-5 drift? |
| **Method** | Static code review of extracted global functions + template-script grep |
| **Input** | `projects/wadnr/extracts/global-functions/`, `projects/wadnr/extracts/form-templates/` (2026-04-08 extraction) |
| **Outcome** | **No live FORM-BUG-5 exposure via FillinAndRelateForm chains.** Latent risk persists for any new script. |

## Finding

**The base function itself is safe.** `FillinAndRelateForm.js` takes a pre-populated `fieldMappings` array and builds a URL query string via `encodeURIComponent`. It does no Date parsing, no `GetFieldValue` calls, and no `SetFieldValue` round-trip — the function cannot by itself trigger FORM-BUG-5.

```js
// FillinAndRelateForm — safe. No Date handling, only string URL assembly.
fieldMappings.forEach((fieldMapping) => {
  popupUrl += `&${encodeURIComponent(fieldMapping.targetFieldName)}=${encodeURIComponent(fieldMapping.sourceFieldValue)}`;
});
```

The risk relocates to **callers that populate `sourceFieldValue` with the output of `GetFieldValue` on a Config D calendar field**. The call chain is:

```
GetFieldValue(configD) ── returns 'YYYY-MM-DDTHH:mm:ss[Z]' (fake Z)
  → encodeURIComponent                                        (preserves literal)
  → URL param in target form
  → Target form parses param, calls SetFieldValue(target)     ← drift occurs here
```

## Caller inventory

### Wrapper global functions (6 identified)

| Wrapper | GFV calls | On date fields? | Risk |
|---|---|---|---|
| `FillinAndRelateForm` | none | — | base; safe |
| `FillAndRelateLTA5Day` | `FPAN Number` | No (text) | none |
| `FillAndRelateRenewal` | `FPAN Number` | No (text) | none |
| `FillAndRelateTransferRequest` | `FPAN Number` | No (text) | none |
| `FillAndRelateAmendmentRequest` | 10+ fields (FPAN Number, Region, Project Name, Landowner/Timber/Operator groups) | No date fields | none |
| `AssessFee` | `Individual ID` | No (text) | none |
| `AddRecordLogic` | generic — delegates `fieldArr` to caller | caller-dependent | see below |

### Template-script direct callers (55 files reference the function)

Two patterns exist in the 55 referencing files:

1. **Metadata-only mapping** (majority): pass record IDs, names, addresses — no date fields. Example: `Notice-to-Comply.xml`, `Signature-Access.xml`.
2. **Date field in `fieldMappings`**: only 1 template — `Forest-Roads.xml` `CreateNewRecord` script passes `Abandonment Date` and `Date Assessed` through the chain.

#### Forest-Roads.xml — the one ambiguous caller

Lines 4444–4531:
```js
const fieldNames = [..., "Abandonment Date", "Date Assessed", ...];
Promise.all(fieldNames.map(n => VV.Form.GetFieldValue(n)))
  .then(([..., abandonmentDate, dateAssessed, ...]) => {
    const fieldMappings = [
      ..., { sourceFieldValue: abandonmentDate, targetFieldName: "Abandonment Date" },
      ..., { sourceFieldValue: dateAssessed,    targetFieldName: "Date Assessed" }, ...
    ];
    VV.Form.Global.FillinAndRelateForm(templateId, fieldMappings, "self");
  });
```

**Verdict: no FORM-BUG-5 exposure.** Both `Abandonment Date` and `Date Assessed` are **TextBox fields** (verified via `<FieldType>TextBox</FieldType>` at `Forest-Roads.xml:1714`), not Calendar controls. The format is `MM/YYYY`, validated by `VV.Form.Global.FormatDateTextField`. FORM-BUG-5 only affects Calendar controls with `enableTime=true` + `ignoreTimezone=true` (Config D). Neither qualifies.

### Other Config D field references in template scripts

Three templates invoke `GetFieldValue` on a Config D calendar field (`Date of Receipt`), but none write back or pass through the URL chain:

| Template | Line | Pattern | Risk |
|---|---|---|---|
| `FPAN-Renewal.xml` | 36849 | `const dateOfReceipt = VV.Form.GetFieldValue('Date of Receipt')` followed by `if (... === '' \|\| ... === null \|\| ... === 'Invalid Date')` | none — existence check only, no Date parsing, no SetFieldValue |
| `Forest-Practices-Application-Notification.xml` | 107610 | same pattern | same — existence check only |
| `Step-1-Long-Term-FPA.xml` | 34581 | same pattern | same — existence check only |

The three scripts explicitly compare against `'Invalid Date'` — a documented workaround for FORM-BUG-6 (empty Config D fields return the string `'Invalid Date'` instead of empty). The devs clearly encountered this issue and already mitigated it at the script level.

### Platform-level patterns checked (all negative)

Grepping the full `form-templates/` tree:

- `new Date(... GetFieldValue ...)` — **0 matches**
- `moment(... GetFieldValue ...)` — **0 matches**
- `Date.parse(... GetFieldValue ...)` — **0 matches**
- `targetFieldName: 'Date|Received|Meeting|Violation'` with Config D source — **0 matches** (only Forest-Roads' TextBox dates)

## Risk classification

| Concern | Status |
|---|---|
| **Live FORM-BUG-5 drift via FillinAndRelateForm chains** | **NONE** — no Config D calendar values passed through the URL chain. |
| **Live FORM-BUG-5 drift via GFV→SFV round-trips in template scripts** | **NONE** — no such patterns found; existence checks do not exercise the drift path. |
| **Latent risk — new script could introduce the pattern** | **PRESENT** — 36 templates use the function; pattern would be easy to add inadvertently. |
| **FORM-BUG-6 (Invalid Date on empty Config D)** | **ACKNOWLEDGED by WADNR devs** — 3 templates already have defensive `=== 'Invalid Date'` checks. |

## Resolution for Risk #9 in current-state Part 6.1

Risk #9 (`FillinAndRelateForm un-audited — site-level, 36 templates`) moves from **"Unknown"** to **"No live exposure identified. Latent risk only."**

Residual action: keep the code-review ban on `GFV → SFV` for Config D fields as a forward-looking control (noted in Risk #2's mitigation).

## Source pointers

- Base function: [`projects/wadnr/extracts/global-functions/FillinAndRelateForm.js`](../extracts/global-functions/FillinAndRelateForm.js)
- Wrappers: `FillAndRelateLTA5Day.js`, `FillAndRelateRenewal.js`, `FillAndRelateAmendmentRequest.js`, `FillAndRelateTransferRequest.js`, `AssessFee.js`, `AddRecordLogic.js`
- Forest-Roads TextBox verdict: `projects/wadnr/extracts/form-templates/Forest-Roads.xml:1714` (`<FieldType>TextBox</FieldType>`)
- Defensive Invalid Date checks: `FPAN-Renewal.xml:36850`, `Forest-Practices-Application-Notification.xml:107611`, `Step-1-Long-Term-FPA.xml:34583`
- FORM-BUG-5 spec: [`research/date-handling/forms-calendar/analysis/bug-5-fake-z-drift.md`](../../../research/date-handling/forms-calendar/analysis/bug-5-fake-z-drift.md)
- FORM-BUG-6 spec: [`research/date-handling/forms-calendar/analysis/bug-6-empty-invalid-date.md`](../../../research/date-handling/forms-calendar/analysis/bug-6-empty-invalid-date.md)
