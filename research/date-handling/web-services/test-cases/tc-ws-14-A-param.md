# TC-WS-14-A-param — Config A, Custom Query Read via SQL `@instanceName` param

## Environment Specs

| Parameter          | Required Value                                                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| **Execution Mode** | `run-ws-test.js --action WS-14` (API-only, no browser)                                                                         |
| **API Server TZ**  | `America/Sao_Paulo` — UTC-3 (BRT)                                                                                              |
| **Target Config**  | Config A: `enableTime=false`, `ignoreTimezone=false`, `useLegacy=false`                                                        |
| **Input**          | `"2026-03-15"`                                                                                                                 |
| **Custom Query**   | `DateTest - By Instance Name` → `SELECT TOP 100 * FROM [DateTest] WHERE DhDocID = @instanceName`                               |
| **Read Path**      | `vvClient.customQuery.getCustomQueryResultsByName(name, { params: JSON.stringify([{parameterName: 'instanceName', value}]) })` |
| **Control Read**   | `vvClient.forms.getForms({ q: [instanceName] eq … })`                                                                          |

## Scenario

Fresh DateTest record created via `postForms`. Read via `customQuery` with SQL parameter binding — `DhDocID = @instanceName`. Compare the returned date field against `forms.getForms` on the same record.

**Hypothesis**: SQL-parameter-bound custom queries return date values identically to `getForms`. Config A stored as `"2026-03-15T00:00:00Z"` — the `params` path should match. Any divergence here (but not in the filter variant) would localize a bug to SQL parameter binding specifically.

## Test Steps

| #   | Action                                                                     | Expected Result                                   |
| --- | -------------------------------------------------------------------------- | ------------------------------------------------- |
| 1   | Create record via `postForms` with `Field7 = "2026-03-15"`                 | Instance created, returns `DhDocID`               |
| 2   | Read via `getForms` (control)                                              | `Field7 = "2026-03-15T00:00:00Z"`                 |
| 3   | Read via `customQuery` + `params: [{parameterName:'instanceName', value}]` | `Field7 = "2026-03-15T00:00:00Z"` (match control) |
| 4   | Compare the two reads                                                      | `match: true`                                     |

## Expected Outcome

**PASS** — Custom Query with SQL parameter binding returns identical date value to `getForms`. If this passes but a future date-column param variant (WSG6) fails, the bug is localized to date-value binding specifically, not string param binding.

## Related

| Reference       | Location                                                       |
| --------------- | -------------------------------------------------------------- |
| Matrix slot     | `ws-14-A-param`                                                |
| Sibling variant | `tc-ws-14-A-filter.md`                                         |
| Sibling config  | `tc-ws-14-C-param.md`                                          |
| Backlog         | Matrix § WSG6 — SQL date-column binding                        |
| Custom queries  | `projects/emanueljofre-vvdemo/test-assets.md § Custom Queries` |
