# TC-WS-14-A-filter — Config A, Custom Query Read via OData `q` filter

## Environment Specs

| Parameter          | Required Value                                                          |
| ------------------ | ----------------------------------------------------------------------- |
| **Execution Mode** | `run-ws-test.js --action WS-14` (API-only, no browser)                  |
| **API Server TZ**  | `America/Sao_Paulo` — UTC-3 (BRT)                                       |
| **Target Config**  | Config A: `enableTime=false`, `ignoreTimezone=false`, `useLegacy=false` |
| **Input**          | `"2026-03-15"`                                                          |
| **Custom Query**   | `DateTest - All Records` → `SELECT TOP 1000 * FROM [DateTest]`          |
| **Read Path**      | `vvClient.customQuery.getCustomQueryResultsByName(name, { q: … })`      |
| **Control Read**   | `vvClient.forms.getForms({ q: [instanceName] eq … })`                   |

## Scenario

Fresh DateTest record created via `postForms`. Read via `customQuery` using the OData `q` filter layer applied on top of `SELECT * FROM [DateTest]`. Compare the returned date field against the same field read via `forms.getForms` on the same record.

**Hypothesis**: The custom-query + `q` filter path normalizes dates identically to `getForms`. Config A (date-only) stored value is `"2026-03-15T00:00:00Z"` via `getForms` — custom query should return the same.

## Test Steps

| #   | Action                                                     | Expected Result                                   |
| --- | ---------------------------------------------------------- | ------------------------------------------------- |
| 1   | Create record via `postForms` with `Field7 = "2026-03-15"` | Instance created, returns `DhDocID`               |
| 2   | Read via `getForms` (control)                              | `Field7 = "2026-03-15T00:00:00Z"`                 |
| 3   | Read via `customQuery` + `q: [instanceName] eq …`          | `Field7 = "2026-03-15T00:00:00Z"` (match control) |
| 4   | Compare the two reads                                      | `match: true`                                     |

## Expected Outcome

**PASS** — Custom Query with OData `q` filter returns identical date value to `getForms`. No custom-query-specific serialization divergence.

## Related

| Reference       | Location                                                       |
| --------------- | -------------------------------------------------------------- |
| Matrix slot     | `ws-14-A-filter`                                               |
| Sibling variant | `tc-ws-14-A-param.md`                                          |
| Sibling config  | `tc-ws-14-C-filter.md`                                         |
| Custom queries  | `projects/emanueljofre-vvdemo/test-assets.md § Custom Queries` |
