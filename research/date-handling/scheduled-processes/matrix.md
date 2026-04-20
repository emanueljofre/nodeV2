# Scheduled Processes — Date-Handling Test Matrix

Methodology and test slot definitions for scheduled process (SP) date-handling investigation.

**Status:** **New as of 2026-04-20** — no execution data yet. All slots PENDING. This matrix was created in response to the Central Admin exploration revealing SP-related date settings (Service Tasks, harness Scripting Server URL, Customer TZ propagation) not covered elsewhere.

**Execution results**: See `projects/{customer}/testing/date-handling/scheduled-processes/status.md` once established per environment.

Total slots: 14 (all PENDING — backlog)

**Scope boundary**: this matrix covers **date-related SP behavior only**. General SP execution mechanics (response.json, postCompletion, platform HTTP timeout, log discovery) are documented in the archived [`../_archive/scheduled-process-logs/`](../_archive/scheduled-process-logs/) investigation and not repeated here.

---

## Scope

- SP trigger firing window — which TZ decides "now" for cron-style SP schedules
- `DateTime.Now` / `GETDATE()` inside SP script bodies (cross-ref WS-13 for generic scripts)
- Service Task scheduled jobs (`Reindex suspect documents`, `Document Archive`, `User Expiration`, `Warning Task Escalation`, `Deadline Task Escalation`) — firing window TZ semantics
- Interaction between `Is Sandbox Server: false` (Other section) and SP firing — do sandboxes fire on the same schedule?
- Harness routing — on vv5dev, SPs hit `https://nodejs-preprod.visualvault.com` (Other → Scripting Server Url). Timestamps produced there may use a different TZ than the customer.

Out of scope (tracked elsewhere):

- SP log parsing, timeout classification, response.json vs postCompletion → [`../_archive/scheduled-process-logs/`](../_archive/scheduled-process-logs/)
- Scripts invoked via form buttons (not scheduled) → [`../web-services/matrix.md`](../web-services/matrix.md)
- Workflow escalation SPs that fire based on date thresholds → [`../workflows/matrix.md § WF-3`](../workflows/matrix.md)

---

## ID Convention

SP test IDs use the format `sp-{category}-{scenario}` (e.g. `sp-1-midnight-utc`, `sp-2-getdate-brt`).
Platform-scope suffix applies: `sp-1-midnight.custTZ-UTC`, `sp-3-archive.custTZ-BRT`. Scope tokens per [`forms-calendar/matrix.md § Platform Scope`](../forms-calendar/matrix.md#platform-scope).

---

## Platform Scope Dependencies

| Setting                                          | Location                                | Default (vv5dev)                         | Affects                                        |
| ------------------------------------------------ | --------------------------------------- | ---------------------------------------- | ---------------------------------------------- |
| Customer Time Zone                               | Customer Details → Time Zone            | UTC (vv5dev) / BRT (vvdemo)              | All: which TZ "now" resolves to                |
| `Scripting Server Url`                           | Configuration Sections → Other          | `https://nodejs-preprod.visualvault.com` | Where SP script bodies execute                 |
| `Is Sandbox Server`                              | Configuration Sections → Other          | ☐                                        | May gate whether SPs actually fire             |
| `Enable Server Scripting`                        | Configuration Sections → Other          | ☑                                        | Master enable for SP execution                 |
| `Days to Retain {Exception,Info,Email,LDAP} Log` | Configuration Sections → General → Logs | 1/2/30/30                                | Log retention affects what SP runs are visible |
| `Audit Log Purge Options` (XML)                  | Configuration Sections → Service Tasks  | Per-category days                        | Purge timing (itself an SP)                    |
| `Job Status Cache Seconds`                       | Configuration Sections → Service Tasks  | 60                                       | SP-status UI lag                               |
| Process Server Locations (XML)                   | Configuration Sections → Server Farm    | `net.tcp://localhost:8790 ...`           | Which server runs SP jobs                      |

---

## Coverage Summary

| Category                                            | Total  | Priority | Method                                           |
| --------------------------------------------------- | :----: | :------: | ------------------------------------------------ |
| SP-1. SP Trigger Firing Window                      |   4    |    P1    | Create SP with daily schedule, observe fire time |
| SP-2. `DateTime.Now` / `GETDATE()` inside SP Script |   4    |    P1    | SP script returns server clock                   |
| SP-3. Service Task Firing Window                    |   4    |    P2    | Observe built-in Service Tasks                   |
| SP-4. Harness vs VV-Server TZ Disagreement          |   2    |    P2    | Script captures both TZs                         |
| **TOTAL**                                           | **14** |          |                                                  |

---

## Execution Order

| Step | Category | Rationale                                                             |
| :--: | -------- | --------------------------------------------------------------------- |
|  1   | SP-2     | Capture `DateTime.Now` baseline first — establishes harness-side TZ   |
|  2   | SP-4     | Cross-check harness TZ vs VV-server expectation                       |
|  3   | SP-1     | Trigger firing window — longer observation loop                       |
|  4   | SP-3     | Service Tasks — hardest to observe (built-in schedules, less control) |

---

## SP-1. SP Trigger Firing Window

**Question**: A Scheduled Process configured to run "daily at 02:00" — is "02:00" in Customer TZ, harness `TZ` env, or SQL OS TZ? This determines whether a Brazilian customer with `Customer TZ = BRT` has SPs firing at Brazilian wall-clock 02:00 or UTC 02:00 (23:00 BRT previous day).

**Method**: Create a lightweight SP scheduled "daily at 02:00". Log the exact fire time. Compare against wall-clock in Customer TZ.

**Shape**: 2 Customer TZs × 2 schedule types (daily fixed time, hourly) = 4 slots.

| Test ID         | Customer TZ | Schedule Spec     | Expected fire (Customer TZ) | Hypothesis to falsify                       | Status  | Run Date | Evidence |
| --------------- | ----------- | ----------------- | --------------------------- | ------------------------------------------- | ------- | -------- | -------- |
| sp-1-daily-utc  | UTC         | Daily at 02:00    | 02:00 UTC wall-clock        | Customer TZ honored vs UTC default          | PENDING | —        | —        |
| sp-1-daily-brt  | BRT         | Daily at 02:00    | 02:00 BRT (05:00 UTC)       | If fires at 02:00 UTC → Customer TZ ignored | PENDING | —        | —        |
| sp-1-hourly-utc | UTC         | Every hour at :15 | :15 on every hour           | Verify TZ independence for short intervals  | PENDING | —        | —        |
| sp-1-hourly-brt | BRT         | Every hour at :15 | :15 on every hour           | Hourly should be TZ-agnostic; confirm       | PENDING | —        | —        |

> **Critical implication**: If Customer TZ is NOT honored, a customer expecting "start of business day" SPs may actually see them fire mid-afternoon. Document loudly if confirmed.
> **Prerequisite**: Need to confirm where SP schedule TZ is stored (likely in scheduledProcess metadata — extract from a test SP to verify).

---

## SP-2. `DateTime.Now` / `GETDATE()` inside SP Script

**Question**: Inside the SP body, when the script calls `DateTime.Now` (Node.js) or `GETDATE()` (SQL), which TZ does it resolve to? Paired with WS-13 (same question for non-SP scripts — answer _should_ be the same).

**Method**: Write a tiny SP script that returns `DateTime.Now.ToString()` + `process.env.TZ` + a SQL call to `SELECT GETDATE()`. Run it; compare to Customer TZ, harness TZ, and SQL OS TZ.

**Shape**: 2 Customer TZs × 2 mechanisms (Node, SQL) = 4 slots.

| Test ID          | Customer TZ | Mechanism                  | Expected value                                            | What we learn                                        | Status  | Run Date | Evidence |
| ---------------- | ----------- | -------------------------- | --------------------------------------------------------- | ---------------------------------------------------- | ------- | -------- | -------- |
| sp-2-now-utc     | UTC         | `new Date().toISOString()` | UTC wall-clock                                            | Harness `TZ` env vs Customer TZ disagreement         | PENDING | —        | —        |
| sp-2-now-brt     | BRT         | `new Date().toISOString()` | UTC wall-clock (Node always returns UTC from toISOString) | Separate: `new Date().toString()` vs `toISOString()` | PENDING | —        | —        |
| sp-2-getdate-utc | UTC         | SQL `GETDATE()`            | SQL Server OS TZ (not Customer TZ)                        | Confirm SQL OS independence                          | PENDING | —        | —        |
| sp-2-getdate-brt | BRT         | SQL `GETDATE()`            | SQL Server OS TZ (same SQL server on both customers)      | Confirm SQL OS independence                          | PENDING | —        | —        |

> **Expected finding (hypothesis)**: `DateTime.Now` follows harness `TZ` env var (`America/Sao_Paulo` if harness runs local, `UTC` on AWS). `GETDATE()` follows SQL OS TZ regardless of Customer TZ. If confirmed, **Customer TZ is effectively display-only** for server-generated timestamps in SPs — matching the expected WS-13 finding.

---

## SP-3. Service Task Firing Window

**Question**: Central Admin Service Tasks (`Document Archive`, `Document Expiration`, `Document Review`, `Reindex suspect documents`, `User Expiration`, `User Password Expiration`, `Warning Task Escalation`, `Deadline Task Escalation`, etc.) run on schedules we don't control directly. Do they fire in Customer TZ or another TZ? And does Customer TZ change mid-day affect the next firing?

**Method**: Pick one observable Service Task (e.g., `Document Archive` — easy to surface via doc state change). Set a doc to expire at a known wall-clock moment. Observe when the archive action fires.

**Shape**: 2 Service Tasks × 2 Customer TZs = 4 slots.

| Test ID           | Service Task     | Customer TZ | Setup                                          | Expected fire time                         | Status  | Run Date | Evidence |
| ----------------- | ---------------- | ----------- | ---------------------------------------------- | ------------------------------------------ | ------- | -------- | -------- |
| sp-3-archive-utc  | Document Archive | UTC         | Doc expires at 2026-03-15T01:00 (Customer TZ)  | Archive fires after 01:00 UTC wall-clock   | PENDING | —        | —        |
| sp-3-archive-brt  | Document Archive | BRT         | Same spec                                      | Archive fires after 01:00 BRT (04:00 UTC)? | PENDING | —        | —        |
| sp-3-user-exp-utc | User Expiration  | UTC         | User expires at 2026-03-15T01:00 (Customer TZ) | User disabled after 01:00 UTC              | PENDING | —        | —        |
| sp-3-user-exp-brt | User Expiration  | BRT         | Same                                           | User disabled after 01:00 BRT              | PENDING | —        | —        |

> **Caveat**: Service Task schedules may be daily (not minute-granular). Observation window may be 24h+.
> **Cross-reference**: [Workflows WF-3](../workflows/matrix.md) — escalation-specific Service Tasks.

---

## SP-4. Harness vs VV-Server TZ Disagreement

**Question**: The `Scripting Server Url` on vv5dev points at `https://nodejs-preprod.visualvault.com` — a cloud harness likely running with `TZ=UTC` (AWS default). Meanwhile the VV ASP.NET server runs on Windows with its own OS TZ. These may disagree with each other AND with Customer TZ. What does a date-producing SP return?

**Method**: SP script logs all three: `new Date().toString()`, `process.env.TZ`, and a SQL `GETDATE()` roundtrip. Compare.

**Shape**: 2 slots — one per Customer TZ.

| Test ID            | Customer TZ | Script logs                                             | Status  | Run Date | Evidence |
| ------------------ | ----------- | ------------------------------------------------------- | ------- | -------- | -------- |
| sp-4-tz-report-utc | UTC         | Node TZ, SQL GETDATE, Customer TZ (from getUserContext) | PENDING | —        | —        |
| sp-4-tz-report-brt | BRT         | Same                                                    | PENDING | —        | —        |

> **Key question**: Does the harness's `TZ` env var differ between the vv5dev preprod instance and the vvdemo instance? If yes, the TZ discrepancy between a customer's scripts running on "the same" harness is actually three-fold (Customer TZ, harness TZ, SQL OS TZ). Document for customer-support playbooks.

---

## Open Gaps & Backlog

All 14 slots above are in Tier 1-2 backlog (see [`forms-calendar/matrix.md § Open Gaps § G26`](../forms-calendar/matrix.md#open-gaps--backlog)). Additional:

| ID   | Gap                                                                        | Close by                  | Priority |
| ---- | -------------------------------------------------------------------------- | ------------------------- | -------- |
| SPG1 | DST transition fire-time behavior (spring-forward / fall-back)             | DST-scoped SP-1 additions | P3       |
| SPG2 | `Is Sandbox Server` flag — does turning it on gate SP firing?              | Spot-check                | P3       |
| SPG3 | SP log date display under customer Culture (cross-ref Dashboards DB-9)     | Extend SP-3               | P3       |
| SPG4 | `Distributed Cache Enabled` off/on — does it affect TZ cache invalidation? | Defer until perf concerns | P4       |
| SPG5 | `Audit Log Purge Options` XML — TZ used for "days=360" retention math      | Add to SP-3               | P3       |

---

## Relationship to Existing Tests

| Existing matrix / archive          | What it covers                                                                        | What SP adds                                              |
| ---------------------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `_archive/scheduled-process-logs/` | Platform execution mechanics (response.json, postCompletion, timeouts, log discovery) | Date/TZ semantics specifically                            |
| WS-9 / WS-13                       | `DateTime.Now` in generic scripts                                                     | Same mechanism, but inside an SP-triggered script context |
| Forms Cat 19                       | Server-generated timestamps on form save                                              | Server-generated timestamps on SP schedules               |
| Workflows WF-3                     | Workflow-specific escalation Service Tasks                                            | General Service Task firing semantics                     |

SP-2 and WS-13 ask the same question. The answer **must** match — if it doesn't, there's a platform-internal inconsistency between SP-triggered and form-triggered script execution paths.
