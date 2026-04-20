# Workflows — Test Matrix

Methodology and test slot definitions for the workflow date-handling investigation.

**Status:** **New as of 2026-04-20** — no execution data yet. All slots PENDING. This matrix was created in response to the Central Admin exploration revealing workflow-related date settings that weren't covered by any existing matrix.

**Execution results**: See `projects/{customer}/testing/date-handling/workflows/status.md` once established per environment.

Total slots: 22 (all PENDING — backlog)

---

## Scope

This matrix covers date behavior in VV workflows that is **not** captured by the forms-calendar or web-services matrices:

- Workflow task due-date computation (`Default Days for an Approval Task` and related platform defaults)
- Work Week XML — business-day arithmetic (skip-weekend math)
- Warning and Deadline Task Escalation — scheduled by date thresholds
- Customer TZ propagation through the workflow engine
- Interaction with `Check Previous Workflow Conditions During Workflow Task Approval and Completion` (Central Admin toggle)

Out of scope (tracked elsewhere):

- Form date fields consumed by workflows → [`../forms-calendar/matrix.md`](../forms-calendar/matrix.md)
- Web service calls from workflow steps → [`../web-services/matrix.md`](../web-services/matrix.md)
- Scheduled Process triggers for workflow jobs → [`../scheduled-processes/matrix.md`](../scheduled-processes/matrix.md)

---

## ID Convention

Workflow test IDs use the format `wf-{category}-{scenario}` (e.g. `wf-1-brt`, `wf-2-weekend`).
Platform-scope suffix applies: `wf-1-brt.custTZ-UTC`, `wf-3-esc.V2`. Scope tokens per [`forms-calendar/matrix.md § Platform Scope`](../forms-calendar/matrix.md#platform-scope).

---

## Platform Scope Dependencies

Workflow date math depends on these Central Admin settings (all currently untested):

| Setting                                                                | Location                                              | Default (vv5dev) | Affects                             |
| ---------------------------------------------------------------------- | ----------------------------------------------------- | ---------------- | ----------------------------------- |
| `Default Days for an Approval Task`                                    | Configuration Sections → General → Workflow           | 5                | wf-1 task due-date offset           |
| `Days of the Work Week` (`<WorkWeek>` XML)                             | Configuration Sections → General → Resource Scheduler | Mon-Fri          | wf-2 business-day math              |
| `Check Previous Workflow Conditions During Workflow Task Approval ...` | Configuration Sections → General → Workflow           | ☑                | wf-4 condition re-evaluation timing |
| `Allow Legacy Workflow`                                                | Configuration Sections → General → Workflow           | ☐                | wf-5 legacy path behavior           |
| `Terminate Active Workflows on Object Delete`                          | Configuration Sections → General → Workflow           | ☐                | wf-6 delete-cascade timing          |
| Customer Time Zone                                                     | Customer Details → Time Zone                          | UTC              | all: which TZ "today" resolves to   |
| `Warning Task Escalation` (Service Task)                               | Configuration Sections → Service Tasks                | ☑                | wf-3 escalation firing window       |
| `Deadline Task Escalation` (Service Task)                              | Configuration Sections → Service Tasks                | ☑                | wf-3 deadline firing window         |

---

## Coverage Summary

| Category                                 | Total  | Priority | Method                                 |
| ---------------------------------------- | :----: | :------: | -------------------------------------- |
| WF-1. Approval Task Due Date Computation |   6    |    P1    | Start workflow + read task.DueDate     |
| WF-2. Work Week (business-day skip)      |   4    |    P2    | Start near weekend boundary            |
| WF-3. Escalation Firing Window           |   4    |    P2    | Observe Service Task fires             |
| WF-4. Condition Re-evaluation Timing     |   3    |    P3    | Task approval at different moments     |
| WF-5. Legacy Workflow Date Math          |   2    |    P3    | Requires Allow Legacy Workflow ON      |
| WF-6. Delete-Cascade Timing              |   3    |    P3    | Requires Terminate Active Workflows ON |
| **TOTAL**                                | **22** |          |                                        |

---

## Execution Order

| Step | Category | Rationale                                                          |
| :--: | -------- | ------------------------------------------------------------------ |
|  1   | WF-1     | Establishes the baseline: does "now + N days" respect Customer TZ? |
|  2   | WF-2     | Work-week math — verify skip-weekend behavior                      |
|  3   | WF-3     | Escalation — requires observation over time (minutes to hours)     |
|  4   | WF-4     | Condition timing — depends on WF-1 baseline                        |
|  5   | WF-5/6   | Non-default flag toggles — run last                                |

---

## WF-1. Approval Task Due Date Computation

**Question**: When a workflow with an approval step starts, the task's `DueDate` = `start_date + Default Days for an Approval Task`. Which TZ is used for the day arithmetic — Customer TZ, SQL OS TZ, harness `TZ` env, or browser?

**Method**: Start a workflow at a known wall-clock time close to midnight in Customer TZ. Read the resulting task's `DueDate` via API. Compute expected under each TZ hypothesis and match.

**Shape**: 3 test conditions × 2 Customer TZs = 6 slots.

| Test ID           | Customer TZ | Start Time (UTC)                          | Default Days | Expected DueDate (Customer TZ hypothesis)        | Status  | Run Date | Evidence |
| ----------------- | ----------- | ----------------------------------------- | :----------: | ------------------------------------------------ | ------- | -------- | -------- |
| wf-1-utc-midnight | UTC         | 2026-03-15T23:30:00Z                      |      5       | 2026-03-20 (Customer=UTC: no day cross)          | PENDING | —        | —        |
| wf-1-utc-midday   | UTC         | 2026-03-15T12:00:00Z                      |      5       | 2026-03-20 (baseline)                            | PENDING | —        | —        |
| wf-1-utc-yearend  | UTC         | 2026-12-30T23:30:00Z                      |      5       | 2027-01-04 (year crossed)                        | PENDING | —        | —        |
| wf-1-brt-midnight | BRT (UTC-3) | 2026-03-15T02:30:00Z (23:30 BRT prev day) |      5       | 2026-03-20 in BRT → depends which TZ drives math | PENDING | —        | —        |
| wf-1-brt-midday   | BRT         | 2026-03-15T12:00:00Z (09:00 BRT)          |      5       | 2026-03-20 (expected; baseline)                  | PENDING | —        | —        |
| wf-1-brt-yearend  | BRT         | 2026-12-31T02:00:00Z (23:00 BRT prev day) |      5       | 2027-01-05 in BRT or 2027-01-04 in UTC?          | PENDING | —        | —        |

> **Key result**: Delta between `wf-1-utc-midnight` and `wf-1-brt-midnight` (or `wf-1-utc-yearend` vs `wf-1-brt-yearend`) reveals whether the workflow engine uses Customer TZ or defaults to UTC/SQL-OS for day arithmetic. Informs platform-wide TZ consistency story (cross-ref Forms Cat 19, WS-13, DOC-10).

---

## WF-2. Work Week (business-day skip)

**Question**: Does `<WorkWeek>` XML (Mon-Fri on vv5dev/EmanuelJofre) skip weekends when computing due-dates? Or is the "N days" literal calendar days?

**Method**: Start a workflow on Friday. Approval due in 2 days → is it Sunday (literal) or Tuesday (business-day)? Same for 5 days (Sunday → Friday literal vs. Friday business-day).

**Shape**: 4 slots covering weekday start/weekend-overlap × 2 default-day counts.

| Test ID        | Start Day (Customer TZ) | Default Days | Expected DueDate (literal calendar) | Expected DueDate (business-day)    | Status  | Run Date | Evidence |
| -------------- | ----------------------- | :----------: | ----------------------------------- | ---------------------------------- | ------- | -------- | -------- |
| wf-2-fri-2days | Friday                  |      2       | Sunday                              | Tuesday (skip Sat/Sun)             | PENDING | —        | —        |
| wf-2-fri-5days | Friday                  |      5       | Wednesday (next week)               | Friday next week (skip 2 weekends) | PENDING | —        | —        |
| wf-2-mon-5days | Monday                  |      5       | Saturday                            | Monday next week                   | PENDING | —        | —        |
| wf-2-thu-3days | Thursday                |      3       | Sunday                              | Tuesday (skip weekend)             | PENDING | —        | —        |

> **If VV uses literal calendar days**: `<WorkWeek>` is display-only (e.g., Resource Scheduler UI). Document this.
> **If VV uses business days**: Changing `<WorkWeek>` to include Saturday (some global customers) would shift every downstream due-date. Flag as a customer-config dimension.
> **Edge cases not counted above**: holidays (US Thanksgiving, Carnaval, Diwali) — VV has no holiday calendar; these are always literal days. Deferred.

---

## WF-3. Escalation Firing Window

**Question**: The Service Tasks `Warning Task Escalation` and `Deadline Task Escalation` (both ☑ by default on vv5dev) fire on scheduled intervals. Which TZ determines "today" for escalation — Customer TZ, SQL OS TZ, or harness TZ?

**Method**: Create a workflow task with a `WarningDate` set to a specific wall-clock moment. Observe whether the warning fires at the Customer-TZ-interpreted wall-clock or UTC/SQL-OS.

**Shape**: 2 escalation types × 2 Customer TZs = 4 slots. Requires observation window of minutes to hours.

| Test ID           | Escalation Type | Customer TZ | WarningDate (set)                                      | Expected fire window                                             | Status  | Run Date | Evidence |
| ----------------- | --------------- | ----------- | ------------------------------------------------------ | ---------------------------------------------------------------- | ------- | -------- | -------- |
| wf-3-warn-utc     | Warning Task    | UTC         | 2026-03-15T14:00:00 (interpreted as Customer TZ = UTC) | Fires at or shortly after 14:00 UTC                              | PENDING | —        | —        |
| wf-3-warn-brt     | Warning Task    | BRT         | 2026-03-15T14:00:00 (interpreted as BRT = 17:00 UTC)   | Fires near 17:00 UTC if Customer TZ honored, else near 14:00 UTC | PENDING | —        | —        |
| wf-3-deadline-utc | Deadline Task   | UTC         | Same shape                                             | Same hypothesis                                                  | PENDING | —        | —        |
| wf-3-deadline-brt | Deadline Task   | BRT         | Same shape                                             | Same hypothesis                                                  | PENDING | —        | —        |

> **Prerequisite**: Need to identify where the escalation job is configured (Service Task interval) and the script/code that decides which tasks are "due". The Central Admin toggle only gates whether it runs, not when or in which TZ.
> **Cross-reference**: [Scheduled Processes matrix](../scheduled-processes/matrix.md) — ties escalation to SP firing semantics.

---

## WF-4. Condition Re-evaluation Timing

**Question**: When `Check Previous Workflow Conditions During Workflow Task Approval and Completion` is ☑ (default on vv5dev), the workflow re-evaluates conditions at approval time. If a condition uses **dates** (e.g., "due before Mar 15"), which "today" does the re-evaluation use?

**Shape**: 3 slots — approval before/on/after a date-based condition boundary.

| Test ID               | Condition                    | Approval Time (Customer TZ)  | Expected Behavior                            | Status  | Run Date | Evidence |
| --------------------- | ---------------------------- | ---------------------------- | -------------------------------------------- | ------- | -------- | -------- |
| wf-4-condition-before | `approval_date < 2026-03-15` | 2026-03-14T23:30 Customer TZ | Condition passes (before)                    | PENDING | —        | —        |
| wf-4-condition-at     | Same                         | 2026-03-15T00:00 Customer TZ | Boundary — platform decides ≤ vs < semantics | PENDING | —        | —        |
| wf-4-condition-after  | Same                         | 2026-03-15T00:30 Customer TZ | Condition fails (after)                      | PENDING | —        | —        |

> **Relevance**: Cross-TZ workflow approvals (offshore support team) may hit the wrong side of a condition boundary if Customer TZ isn't honored.

---

## WF-5. Legacy Workflow Date Math

Requires flipping `Allow Legacy Workflow = ☑` at DB scope. Likely a different engine. Defer until a customer surfaces legacy workflow date issues.

| Test ID         | Scenario                              | Status  |
| --------------- | ------------------------------------- | ------- |
| wf-5-legacy-due | Legacy workflow approval task DueDate | PENDING |
| wf-5-legacy-tz  | Legacy engine Customer TZ propagation | PENDING |

---

## WF-6. Delete-Cascade Timing

Requires flipping `Terminate Active Workflows on Object Delete = ☑`. Observe whether cascade termination is immediate or batch-processed (and if batch, at what TZ/time).

| Test ID               | Scenario                                                    | Status  |
| --------------------- | ----------------------------------------------------------- | ------- |
| wf-6-delete-immediate | Delete object; verify active workflow cancelled immediately | PENDING |
| wf-6-delete-batch-tz  | If batch-processed, when does the batch run?                | PENDING |
| wf-6-delete-reopen    | Object undelete — does workflow restart? At what stage?     | PENDING |

---

## Open Gaps & Backlog

All 22 slots above are in the Tier 1-2 backlog (see [`forms-calendar/matrix.md § Open Gaps § G25`](../forms-calendar/matrix.md#open-gaps--backlog)). Additional gaps not yet promoted to slots:

| ID   | Gap                                                                    | Close by                | Priority |
| ---- | ---------------------------------------------------------------------- | ----------------------- | -------- |
| WFG1 | Holiday calendar awareness                                             | Defer until requested   | P4       |
| WFG2 | Workflow assignment rule date fields (complex — assignee + due + cron) | Extend WF-1 to 12 slots | P3       |
| WFG3 | Escalation notification email timestamp vs due-date discrepancy        | Add to WF-3             | P3       |
| WFG4 | Legacy vs new workflow engine date-handling divergence                 | WF-5 expansion          | P3       |

---

## Relationship to Existing Tests

| Existing matrix | What it covers                                              | What WF adds that it doesn't                              |
| --------------- | ----------------------------------------------------------- | --------------------------------------------------------- |
| Forms Cat 19    | Form-save auto-fields (Created Date) respecting Customer TZ | Task due-date computation from workflow start             |
| WS-9            | Script date math via `DateTime.Now`                         | Workflow-engine internal date math (not script-triggered) |
| WS-13           | `DateTime.Now` / `GETDATE()` under Customer TZ variation    | Workflow-specific due-date arithmetic                     |
| SP matrix       | SP trigger-time semantics                                   | How escalation SPs decide which tasks are "due"           |
| DOC-10          | Doc Library `Days for Training Task due`                    | Workflow task due for non-training tasks                  |

The overlap with WS-13 is intentional — the _question_ (whose TZ?) is the same, the _mechanism_ (workflow vs script) is different. If answers diverge, we have a platform-consistency bug worth documenting.
