# EmanuelJofre-vvdemo Project — Personal Sandbox on vvdemo

## Environment

| Setting   | Value                                    |
| --------- | ---------------------------------------- |
| Server    | vvdemo                                   |
| Customer  | EmanuelJofre                             |
| Database  | Main                                     |
| Base URL  | https://vvdemo.visualvault.com           |
| Read-Only | No                                       |
| Write Policy | `unrestricted` — development sandbox, all writes allowed |

Full environment profile (platform versions, services, front-end stack): [`environment.json`](environment.json) — generate with `npm run env:profile -- --project emanueljofre-vvdemo`.

## Extracts

All data extracted via `tools/extract/` from the EmanuelJofre admin panels on vvdemo.

| Component          | Count | Location                    |
| ------------------ | ----- | --------------------------- |
| Web Services       | 36 scripts | `extracts/web-services/`     |
| Scheduled Services | 10 schedules + 6 scripts | `extracts/schedules/`        |
| Global Functions   | 24 functions | `extracts/global-functions/` |
| Form Templates     | 108 templates | `extracts/form-templates/`   |
| Custom Queries     | 129 queries | `extracts/custom-queries/` |

Last full extraction: 2026-04-09. Schedules re-extracted 2026-04-14 (10 schedules, up from 5). Note: GetSites script skipped (empty source).

## Commands

```bash
# Extract all components
node tools/extract/extract.js --project emanueljofre-vvdemo

# Extract just scripts
node tools/extract/extract.js --project emanueljofre-vvdemo --component scripts

# Dry-run
node tools/extract/extract.js --project emanueljofre-vvdemo --dry-run
```

## Analysis

No analysis files yet. Run extractions first, then use:

- `node tools/inventory/inventory-fields.js` for field inventory
- `node tools/inventory/inventory-scripts.js` for script inventory

## Testing

Execution data for all date-handling test components lives in `testing/date-handling/`:

- **Rollup**: [`testing/date-handling/status.md`](testing/date-handling/status.md) — cross-component summary

| Component      | Status file                                       |
| -------------- | ------------------------------------------------- |
| Dashboards     | `testing/date-handling/dashboards/status.md`      |
| Web Services   | `testing/date-handling/web-services/status.md`    |
| Forms Calendar | `testing/date-handling/forms-calendar/status.md`  |

Each component has `runs/` (immutable execution records) and `summaries/` (per-TC tracking).

## Related

- This is the primary development/testing environment for platform investigations
- **Test assets catalog: [`test-assets.md`](test-assets.md)** — DateTest forms, saved records, WS harness, field map
- Playwright executable config: `testing/fixtures/vv-config.js`
- Platform date bugs: `research/date-handling/`
