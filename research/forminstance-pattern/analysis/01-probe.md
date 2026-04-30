# Step 1 — FormsAPI / `forminstance/` Availability Probe

Before testing the create/update pattern, confirm the SDK is wired up on the target environment. The probe is read-only — no records created, no fields written.

## What's New

| File                                                                                          | Purpose                                                                                                             |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| [`scripts/examples/forminstance-probe.js`](../../../scripts/examples/forminstance-probe.js)   | Server-side script. Inspects `vvClient.formsApi` surface and resolves a target template's `templateRevisionIdGuid`. |
| [`tools/runners/run-forminstance-probe.js`](../../../tools/runners/run-forminstance-probe.js) | Local runner. Authenticates via `.env.json`, invokes the probe, prints a human-readable verdict.                    |

## How to Run

Active environment is selected by `activeServer`/`activeCustomer` in the root `.env.json`. For this task it should be `vvdemo` / `EmanuelJofre`.

```bash
# Default — probes "DateTest" (the canonical date-handling test form on EmanuelJofre)
node tools/runners/run-forminstance-probe.js

# Probe a specific template
node tools/runners/run-forminstance-probe.js --template "DateTest"

# Machine-readable
node tools/runners/run-forminstance-probe.js --json
```

## What the Probe Reports

Three layers of FormsAPI initialization, surfaced separately so a partial failure is unambiguous:

| Field                                            | What it means                                                                                                                                                                                                                                          |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `formsApi.hasUnderlyingInstance`                 | The SDK constructor reached the FormsAPI init block in [`VVRestApi.js:138-151`](../../../lib/VVRestApi/VVRestApiNodeJs/VVRestApi.js). False ⇒ `/configuration/formsapi` returned no usable data ⇒ FormsAPI not configured for this customer.           |
| `formsApi.isEnabled`                             | The customer-level `isEnabled` flag from `formsApiConfig`. False ⇒ FormsAPI configured but disabled.                                                                                                                                                   |
| `formsApi.baseUrl`                               | The `formsApiUrl` (typically `https://preformsapi.visualvault.com`). Missing ⇒ misconfiguration.                                                                                                                                                       |
| `formsApi.publicGetterIsNull`                    | The public `vvClient.formsApi` getter returned null even though the underlying instance exists — usually means the session token is not JWT.                                                                                                           |
| `formsApi.methods.postForm` / `postFormRevision` | The two SDK methods we'll call. Both must be `callable` for the pattern to work.                                                                                                                                                                       |
| `template.templateRevisionIdGuid`                | The 3rd argument every `forminstance/` call needs. Resolved via [`getFormTemplateIdByName`](../../../lib/VVRestApi/VVRestApiNodeJs/VVRestApi.js) which silently swallows errors — the probe explicit-null-checks and surfaces unresolved as a Warning. |

## Possible Outcomes & Next Action

| Outcome                                              | Meaning                                                              | Next action                                                                                                                                                                                                                          |
| ---------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Status: Success`                                    | All prerequisites met.                                               | Proceed to step 2 (build the create/update test harness).                                                                                                                                                                            |
| `Status: Warning` — template not resolved            | SDK is wired up but the named template doesn't exist on this env.    | Verify the template name (case/whitespace/existence) and re-run. Likely fix is just `--template "<exact name>"`.                                                                                                                     |
| `Status: Warning` — public getter null, JWT mismatch | FormsAPI is configured but the session token type is wrong.          | Inspect `_sessionToken.tokenType`. JWT exchange happens during vvClient init — failure usually means the user lacks `getJwt` permission for the `PREFORMS_AUDIENCE`.                                                                 |
| `Status: Error` — no underlying instance             | FormsAPI is not configured / not enabled for this customer/database. | Check Central Admin > Customer Configuration > FormsAPI. Without this, the entire forminstance/ workaround is unavailable on this env, and the script-level fallback (write naive-local strings via `postForms`) is the only option. |

## Recording the Result

When you run the probe, capture the JSON output to:

```
projects/emanueljofre-vvdemo/testing/forminstance-pattern/probe-<YYYY-MM-DD>.json
```

That's the immutable execution record. A one-line outcome summary lives in this analysis doc once the probe has run.

## Run Log

_(Add entries here as the probe is run. Format: date, env, template, outcome, evidence path.)_

| Date       | Env                          | Template           | Outcome                                                                                                                                                                           | Evidence                                                                                                            |
| ---------- | ---------------------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| 2026-04-28 | vvdemo / EmanuelJofre / Main | DateTest           | **Success** — SDK fully wired, JWT session, `postForm` + `postFormRevision` both callable, `templateRevisionIdGuid` resolved                                                      | [`probe-2026-04-28.json`](../../../projects/emanueljofre-vvdemo/testing/forminstance-pattern/probe-2026-04-28.json) |
| 2026-04-28 | vv5dev / WADNR / fpOnline    | Communications Log | **Success** — FormsAPI enabled for WADNR, Communications Log template registered, `postForm` + `postFormRevision` both callable. **No platform blocker for production adoption.** | [`probe-2026-04-28.json`](../../../projects/wadnr/testing/forminstance-pattern/probe-2026-04-28.json)               |
