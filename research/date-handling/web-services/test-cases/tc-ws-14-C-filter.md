# TC-WS-14-C-filter — Config C, Custom Query Read via OData `q` filter (DateTime)

## Environment Specs

| Parameter          | Required Value                                                         |
| ------------------ | ---------------------------------------------------------------------- |
| **Execution Mode** | `run-ws-test.js --action WS-14` (API-only, no browser)                 |
| **API Server TZ**  | `America/Sao_Paulo` — UTC-3 (BRT)                                      |
| **Target Config**  | Config C: `enableTime=true`, `ignoreTimezone=false`, `useLegacy=false` |
| **Input**          | `"2026-03-15T14:30:00"`                                                |
| **Custom Query**   | `DateTest - All Records` → `SELECT TOP 1000 * FROM [DateTest]`         |
| **Read Path**      | `vvClient.customQuery.getCustomQueryResultsByName(name, { q: … })`     |
| **Control Read**   | `vvClient.forms.getForms({ q: [instanceName] eq … })`                  |

## Scenario

Fresh DateTest record with datetime value created via `postForms`. Read via `customQuery` with OData `q` filter. Compare against `forms.getForms` on the same record.

**Hypothesis**: Same as Config A filter variant, but for DateTime fields. Config C stored as `"2026-03-15T14:30:00Z"` (Z suffix per CB-8) — custom query should match.

## Test Steps

| #   | Action                                                              | Expected Result                                   |
| --- | ------------------------------------------------------------------- | ------------------------------------------------- |
| 1   | Create record via `postForms` with `Field6 = "2026-03-15T14:30:00"` | Instance created, returns `DhDocID`               |
| 2   | Read via `getForms` (control)                                       | `Field6 = "2026-03-15T14:30:00Z"`                 |
| 3   | Read via `customQuery` + `q: [instanceName] eq …`                   | `Field6 = "2026-03-15T14:30:00Z"` (match control) |
| 4   | Compare the two reads                                               | `match: true`                                     |

## Expected Outcome

**PASS** — Custom Query returns same Z-suffixed datetime as `getForms`. Serialization parity across read paths confirmed for DateTime fields.

## Related

| Reference       | Location                                                       |
| --------------- | -------------------------------------------------------------- |
| Matrix slot     | `ws-14-C-filter`                                               |
| Sibling variant | `tc-ws-14-C-param.md`                                          |
| Sibling config  | `tc-ws-14-A-filter.md`                                         |
| Related bug     | CB-8 (Z suffix on datetime) — WS-10 series                     |
| Custom queries  | `projects/emanueljofre-vvdemo/test-assets.md § Custom Queries` |
