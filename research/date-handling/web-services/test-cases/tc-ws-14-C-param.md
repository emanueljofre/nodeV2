# TC-WS-14-C-param — Config C, Custom Query Read via SQL `@instanceName` param (DateTime)

## Environment Specs

| Parameter          | Required Value                                                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| **Execution Mode** | `run-ws-test.js --action WS-14` (API-only, no browser)                                                                         |
| **API Server TZ**  | `America/Sao_Paulo` — UTC-3 (BRT)                                                                                              |
| **Target Config**  | Config C: `enableTime=true`, `ignoreTimezone=false`, `useLegacy=false`                                                         |
| **Input**          | `"2026-03-15T14:30:00"`                                                                                                        |
| **Custom Query**   | `DateTest - By Instance Name` → `SELECT TOP 100 * FROM [DateTest] WHERE DhDocID = @instanceName`                               |
| **Read Path**      | `vvClient.customQuery.getCustomQueryResultsByName(name, { params: JSON.stringify([{parameterName: 'instanceName', value}]) })` |
| **Control Read**   | `vvClient.forms.getForms({ q: [instanceName] eq … })`                                                                          |

## Scenario

Fresh DateTest record with datetime value created via `postForms`. Read via `customQuery` with SQL parameter binding on the instance name column. Compare against `forms.getForms` on the same record.

**Hypothesis**: SQL-param-bound datetime read matches `getForms`. Config C stored as `"2026-03-15T14:30:00Z"` — the `params` path should return the same Z-suffixed value. Divergence here (but not in filter variant) localizes a DateTime-specific bug to SQL param binding.

## Test Steps

| #   | Action                                                                     | Expected Result                                   |
| --- | -------------------------------------------------------------------------- | ------------------------------------------------- |
| 1   | Create record via `postForms` with `Field6 = "2026-03-15T14:30:00"`        | Instance created, returns `DhDocID`               |
| 2   | Read via `getForms` (control)                                              | `Field6 = "2026-03-15T14:30:00Z"`                 |
| 3   | Read via `customQuery` + `params: [{parameterName:'instanceName', value}]` | `Field6 = "2026-03-15T14:30:00Z"` (match control) |
| 4   | Compare the two reads                                                      | `match: true`                                     |

## Expected Outcome

**PASS** — SQL param binding with DhDocID string returns identical datetime to `getForms`. Validates string-param plumbing end-to-end for DateTime fields.

## Related

| Reference       | Location                                                       |
| --------------- | -------------------------------------------------------------- |
| Matrix slot     | `ws-14-C-param`                                                |
| Sibling variant | `tc-ws-14-C-filter.md`                                         |
| Sibling config  | `tc-ws-14-A-param.md`                                          |
| Related bug     | CB-8 (Z suffix on datetime) — WS-10 series                     |
| Backlog         | Matrix § WSG6 — SQL date-column binding                        |
| Custom queries  | `projects/emanueljofre-vvdemo/test-assets.md § Custom Queries` |
