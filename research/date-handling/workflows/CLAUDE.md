# Workflows — Date Handling

## What This Is

Date behavior inside the VV workflow engine: task due-date computation, business-day arithmetic, escalation firing windows, condition re-evaluation timing, delete-cascade semantics.

**Status**: New task as of 2026-04-20. All 22 slots PENDING — no execution data yet.

## Scope

Platform-level settings covered:

- `Default Days for an Approval Task` (General → Workflow)
- `<WorkWeek>` XML (General → Resource Scheduler)
- `Check Previous Workflow Conditions ...` (General → Workflow)
- `Allow Legacy Workflow` (General → Workflow)
- `Terminate Active Workflows on Object Delete` (General → Workflow)
- `Warning Task Escalation` / `Deadline Task Escalation` (Service Tasks)
- Customer Time Zone propagation through workflow engine

## Contents

- [`matrix.md`](matrix.md) — 6 categories, 22 test slots

## Cross-References

- [`../forms-calendar/matrix.md`](../forms-calendar/matrix.md) — form fields consumed by workflows
- [`../scheduled-processes/matrix.md`](../scheduled-processes/matrix.md) — escalation SPs, firing-time semantics
- [`../web-services/matrix.md § WS-13`](../web-services/matrix.md#ws-13-customer-tz-in-server-scripts-platform-scope-backlog) — paired Customer-TZ question for scripts
- [`projects/emanueljofre-vv5dev/analysis/central-admin/SCOPE-HIERARCHY.md`](../../../projects/emanueljofre-vv5dev/analysis/central-admin/SCOPE-HIERARCHY.md) — workflow-related settings catalog
