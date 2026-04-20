# Scheduled Processes — Date Handling

## What This Is

Date/TZ semantics of the VV Scheduled Process subsystem and the Central Admin Service Tasks (built-in scheduled jobs). Scoped to date behavior only — general SP execution mechanics are documented in the archived investigation (`../_archive/scheduled-process-logs/`).

**Status**: New task as of 2026-04-20. All 14 slots PENDING — no execution data yet.

## Scope

- SP trigger firing window (which TZ decides "now"?)
- `DateTime.Now` / `GETDATE()` inside SP script bodies (paired with WS-13)
- Service Task (Central Admin → Service Tasks) firing window semantics
- Harness vs VV-server vs SQL OS vs Customer TZ disagreement

## Contents

- [`matrix.md`](matrix.md) — 4 categories, 14 test slots

## Cross-References

- [`../_archive/scheduled-process-logs/`](../_archive/scheduled-process-logs/) — platform execution mechanics (out of scope here)
- [`../workflows/matrix.md § WF-3`](../workflows/matrix.md) — workflow-specific escalation Service Tasks
- [`../web-services/matrix.md § WS-13`](../web-services/matrix.md#ws-13-customer-tz-in-server-scripts-platform-scope-backlog) — generic script TZ semantics (paired question)
- [`../forms-calendar/matrix.md § Cat 19`](../forms-calendar/matrix.md) — form-save server timestamps (paired question)
- [`projects/emanueljofre-vv5dev/analysis/central-admin/SCOPE-HIERARCHY.md`](../../../projects/emanueljofre-vv5dev/analysis/central-admin/SCOPE-HIERARCHY.md) — Service Tasks + Other section toggles
