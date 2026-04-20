# SP-BUG-1: Scheduled Service Log Message column does not show the postCompletion message

## 1. What Happens

When a scheduled process runs on its recurring schedule, the "Message" column in the Scheduled Service Log does not show the completion message supplied by the script. Instead, it shows whatever text the script sent in its initial response.json HTTP acknowledgment to VisualVault.

## 3. Severity

**MEDIUM.**

- Affects every scheduled process on every VV customer environment.
- Workaround exists (send the outcome message via `response.json` at the end of execution instead of via `postCompletion`), but it has a real operational trade-off: it blocks the scheduler queue for the full script duration and requires accepting the microservice Timeout as an upper bound on job length.
- No data corruption or data loss — the defect is in observability only. The `Result` flag (True/False) does accurately reflect success or failure.

---

## 4. How to Reproduce

**Environment prerequisites:** any VV environment with an `outsideprocessadmin` microservice pointing at a reachable Node.js microservices server, and permission to create/edit scheduled processes in `scheduleradmin`.

A minimal reproduction script is already committed at [scripts/examples/scheduled/NodeJSTestCommunicationScheduledProcess.js](../../../../scripts/examples/scheduled/NodeJSTestCommunicationScheduledProcess.js) — it sends distinct strings on each channel.

**Steps:**

1. Deploy the test script above to the Node.js microservices server (or use an equivalent script that sends different text in `response.json` vs. `postCompletion`).
2. In `outsideprocessadmin`, register a microservice that points at the deployed script. Leave Completion Callback at its default (disabled).
3. In `scheduleradmin`, create a new scheduled process that invokes that microservice. Set it to run once, a few minutes in the future.
4. Wait for the scheduled run to fire automatically. Do **not** use the "Test" button — this bug report concerns the scheduler path.
5. Open the Scheduled Service Log via the "View" link on the scheduled process.
6. Inspect the Message column for the completed run.

**Expected result:** the Message column shows the string passed as the 4th argument to `postCompletion` (the completion summary produced after the script finishes its work).

**Actual result:** the Message column shows the string passed to `response.json` (the initial acknowledgment sent before work began). The `postCompletion` message is not displayed anywhere in the UI.

---

## 5. Background

A VisualVault scheduled process executes via two independent channels between VV and the Node.js microservices server:

| Channel                                         | Direction    | Purpose                                                                     |
| ----------------------------------------------- | ------------ | --------------------------------------------------------------------------- |
| `response.json(status, message)`                | Node.js → VV | HTTP response body for the `POST /scheduledscripts` call VV initiated.      |
| `vvClient.scheduledProcess.postCompletion(...)` | Node.js → VV | Separate, later REST call from the Node.js server back to VV to signal end. |

These are independent: after `response.json` fires, VV closes the HTTP connection and the script keeps running asynchronously on the Node.js server. `postCompletion` is issued later as a fresh outbound request.

The intended usage pattern (widely adopted across VV customer scripts, including the canonical [scheduledprocess-pattern.js](../../../../scripts/templates/scheduledprocess-pattern.js) template) is:

- Call `response.json` **at the start** of execution with a short acknowledgment, so VV's scheduler queue is not blocked while the script runs.
- Call `postCompletion` **in a `finally` block** with the true outcome (success/failure plus a human-readable summary).

This pattern only works if the UI shows the `postCompletion` message. If it shows the `response.json` message instead, the end user sees "Started" and has no visible record of what actually happened.

Mechanics of the log and the Completion Callback setting are documented in [response-vs-postcompletion.md](response-vs-postcompletion.md) in this folder.

---

## 6. The Problem in Detail

The `postCompletion` method accepts four parameters:

```js
vvClient.scheduledProcess.postCompletion(
    scheduledProcessGUID, // the GUID VV passed in as `token`
    'complete', // action
    true, // success flag — shown as "Result"
    'Completed successfully: imported 47 records' // message — NOT displayed anywhere
);
```

The 4th argument is accepted, transmitted over the network, and received by VV — but it is not surfaced in the Scheduled Service Log UI, nor (to our knowledge) in any other VV-hosted view. The Message column in the log is sourced from the HTTP response body that `response.json` wrote.

**Step-by-step example** (using the distinct-string repro script):

1. `response.json(200, "COMMUNICATION ARRIVED SUCCESSFULLY.")` is called at t=0. VV's scheduler receives the HTTP response, closes the connection, and stores `"COMMUNICATION ARRIVED SUCCESSFULLY."` in the Message column.
2. The Node.js script continues running. At t=N seconds, the script calls `postCompletion(..., true, "Scheduled Process End has completed.")`.
3. VV accepts the `postCompletion` call and updates the Result column to `True`. The message argument is not persisted to the log row in a user-visible way.
4. An end user opens the log and sees Result `True` alongside Message `"COMMUNICATION ARRIVED SUCCESSFULLY."` — the outcome string supplied at the end is nowhere to be found.

**Consequence for the canonical pattern.** The template at [scripts/templates/scheduledprocess-pattern.js](../../../../scripts/templates/scheduledprocess-pattern.js) sends `` `${serviceName} Started` `` via `response.json` and the real outcome via `postCompletion`. In production this leaves every Message column entry stuck on `"MyScheduledProcess Started"` regardless of whether the run succeeded or failed — the True/False Result flag is the only outcome signal the user has.

---

## 7. Verification

- **What was tested.** A reproduction on a VV environment using a purpose-built script (see [NodeJSTestCommunicationScheduledProcess.js](../../../../scripts/examples/scheduled/NodeJSTestCommunicationScheduledProcess.js)) that sends clearly distinct strings over the two channels.
- **Scope of testing.** Scheduler path (automatic run) and "Test" button path in `scheduleradmin`. Completion Callback disabled (default) and enabled configurations. Platform timeout variants (0 = default 3–5 min, explicit seconds).
- **Key result.** Across all tested configurations, the Message column in the Scheduled Service Log reflected the `response.json` body, never the `postCompletion` message argument. The `postCompletion` message was not located in any VV UI surface.
- **Limitations.** VV platform source code was not inspected — root cause below is an external observation, not a code-level finding. No assertion is made about internal VV database storage of the `postCompletion` message; only the UI surface has been verified.

Supporting material (test scripts, analysis notes, and repro recordings) lives in a supporting repository at `research/_archive/scheduled-process-logs/`. Access can be requested.

---

## 8. Technical Root Cause

**Unverified — VV platform code was not inspected.** Based on external behavior only: the VV component that renders the Scheduled Service Log reads the Message column from the stored HTTP response body (what `response.json` wrote), rather than from the 4th argument (`message`) of the completion callback that the `postCompletion` endpoint receives.

For a fix, the expected change is server-side in the VV platform:

- The VV `scheduledProcess` completion endpoint (receives `postCompletion` calls) should persist the `message` argument to the log row for the corresponding scheduled run.
- The Scheduled Service Log renderer should prefer the `postCompletion` message when present, falling back to the `response.json` body only when no completion message has been recorded.

No changes are required in the Node.js microservices server or in the `vvClient.scheduledProcess.postCompletion` client wrapper — both already transmit the message argument correctly. The defect, if confirmed by VV engineering, is in how VV consumes and/or displays that value.

---

## 9. Workarounds

Two options are available to end users today; both have trade-offs:

1. **Send the outcome message via `response.json` at the end of the script**, omitting or ignoring the `postCompletion` message.
    - Pro: the outcome appears in the Message column as expected.
    - Con: VV's scheduler queue is blocked for the full script duration. The microservice Timeout must exceed the script's worst-case runtime, or VV will record a timeout error instead of the completion message. Long-running jobs become serialization points.
2. **Log the outcome externally** (Winston, external log aggregator, VV documents) and leave the Message column showing the generic "Started" acknowledgment.
    - Pro: the scheduler queue is freed immediately; no timeout pressure.
    - Con: end users cannot see the outcome from the VV UI. They must know where to look.

A fix recommendations companion doc is not included at this time because the fix is server-side in VV and outside this repository's scope.

---

## Related

- [response-vs-postcompletion.md](response-vs-postcompletion.md) — full execution model of the two channels, including Completion Callback and platform timeout behavior.
- [scripts/templates/scheduledprocess-pattern.js](../../../../scripts/templates/scheduledprocess-pattern.js) — canonical scheduled process template that exhibits the defect.
- [scripts/examples/scheduled/NodeJSTestCommunicationScheduledProcess.js](../../../../scripts/examples/scheduled/NodeJSTestCommunicationScheduledProcess.js) — minimal repro script.
