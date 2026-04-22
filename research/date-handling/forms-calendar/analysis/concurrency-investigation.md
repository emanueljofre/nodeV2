# Multi-User Concurrency — Investigation Design

**Status**: design-only (2026-04-22). Cat 20 scaffolded with 13 PENDING slots; no execution yet.

**Why this exists**: Every category 1–19 covers **one user, one session, one browser**. Real VV customers run forms multi-tenant, multi-TZ, multi-session. A helpdesk rep in IST creates a record, a BRT admin reviews it, a UTC0 analyst closes a workflow on it. Date bugs that are invisible under single-user testing (or that silently compound across users) would slip through the entire existing matrix. Cat 20 is the first attempt at probing this axis.

## Motivating observations

1. **FORM-BUG-5 is known to compound across users.** TC-11-roundtrip-cross (already in the matrix) captures the 2-user BRT→IST pattern: A round-trips at -3h, B round-trips at +5:30h, net +2:30h from original. This is documented but not systematically extended to (a) more users in a chain, (b) different configs, (c) V2, or (d) cross-user writes that DON'T round-trip (ordinary save-without-edit). Cat 20 formalizes it.
2. **The V2 baseline tells us stable single-user behavior.** With v11 projecting ~0 failures, we have a foundation to detect _deltas_ from adding a second user — anything that breaks under two browsers is a concurrency-specific bug, not a baseline drift.
3. **Optimistic-concurrency semantics are undocumented.** We don't know if VV rejects stale writes (ETag/If-Match-style), silently overwrites, or uses last-modified conflict detection. The existing specs all save once per record with no second writer; the first-level-of-concurrency behavior is entirely unexplored.
4. **The save pipeline may re-evaluate stored values idempotently.** If a BRT admin opens a record saved by an IST user and clicks Save without editing the date field, does the save pipeline re-apply normalization (and thus re-trigger FORM-BUG-7 on the BRT side), or is it read-only? We have no test for this.

## Scenarios and why they matter

See [`matrix.md § 20 — Multi-User Concurrency`](../matrix.md#20--multi-user-concurrency) for the 13 test-slot specifications. The groups:

- **Group A — Race/stale write (5 slots)**. Probe optimistic-concurrency semantics on the write path. Highest probability of finding an unfixed silent-data-loss bug. Covers same-TZ race, cross-TZ race (BRT+IST, IST+UTC0), and stale-write patterns (user A opens, user B saves, user A overwrites without warning).
- **Group B — Cross-user pipeline drift (4 slots)**. Extends the TC-11-roundtrip-cross pattern to 2-user and 3-user chains on Config D (datetime, fake-Z path). One slot on Config B checks that ignoreTZ=true is actually sufficient to avoid cross-user drift.
- **Group C — Helpdesk-style save-without-edit (2 slots)**. IST user sets a Config A date (exposing FORM-BUG-7 at write); BRT admin opens and saves an unrelated field. Does the BRT admin's save re-apply the Config A normalization (amplifying the shift) or stay idempotent?
- **Group D — Timing edge cases (2 slots)**. Midnight-crossing current-date (does the stored value reflect form-load time or form-save time?) and long-session save (does idle → re-auth drop dirty state?). Harder to automate cleanly; deferred behind Groups A–C.

## Environment-agnostic design

Cat 20 was designed explicitly to be **runnable on any customer** that has the Date Test Harness form. Everything flows through:

- `fixtures/vv-config.js` `FIELD_MAP` — per-customer semantic field names (vvdemo uses `Field1-28`; vv5dev uses `dateTzAwareV2Empty` etc.).
- `fixtures/vv-config.js` `customerTemplates[{customerKey}].dateTest` — per-customer form template URL.
- `global-setup.js` authenticated state files per TZ project — already separate contexts per project.

**Playwright multi-context pattern**: a single test spawns 2+ `browser.newContext({ timezoneId: ... })` within the same worker. Each context has its own cookies/auth, its own timezone, and its own `new Date()` clock. Tests orchestrate the interleaved flows via `Promise.all` and per-context `page.evaluate`. No modification to `global-setup.js` needed — the test provisions its own contexts.

**Auth separation** (future): if a customer needs distinct user accounts for A and B (for audit trails or permission-scope testing), add `testUsers` array under `.env.json` → `customers.{name}`. Cat 20 spec can pick A-user and B-user from that list. Current assumption: same user in multiple contexts is acceptable for the race tests (they're all write-policy-guarded and the sandboxes are personal).

## Expected values (why all start as "baseline V1")

Every slot records a **baseline (V1) expected** derived from:

- Single-user Cat 1–13 behavior (already verified)
- Known FORM-BUG-5 / FORM-BUG-7 propagation rules

These are the "if there's no new concurrency bug, this is what we'd see" answers. The **Probe Question** column captures the real test: what are the failure modes we're hunting for?

First-run results will falsify or confirm each baseline. Any deviation is either a new bug or a refinement of the single-user expected (e.g., "the save pipeline is idempotent on reload, so BRT admin's save doesn't re-shift Config A"). Second pass converts each probe question into a concrete expected value.

## Anti-patterns to avoid during implementation

- **Don't delete records between tests.** DELETE is destructive; race tests create many records but leave them (sandbox retention will clean up). Generated instance names are disambiguating.
- **Don't share a context across sub-tests.** Each concurrency scenario must construct its own contexts from scratch so there's no cookie or cache leakage.
- **Don't rely on true simultaneity.** `Promise.all([page1.click('save'), page2.click('save')])` is "close enough" — the server still serializes requests. If we need exact ordering we have to control it via request-interception, which is overkill for round-1.
- **Don't assert on wall-clock times in timing tests.** Record the observation with an annotation; assertion is "the stored value is consistent with the expected pipeline behavior", not "stored value equals exactly X".

## Cross-references

- FORM-BUG-5 multi-user drift documented in [`bug-5-fake-z-drift.md`](bug-5-fake-z-drift.md) § Multi-user compound drift.
- [`docs/reference/form-fields.md`](../../../../docs/reference/form-fields.md) § Known Bugs lists the full V1/V2 bug table.
- WS [`matrix.md`](../../web-services/matrix.md) WS-11 probes a related concurrency axis on the REST side (server-side TZ emulation under T1/T2) — different scope, no overlap with Cat 20.

## When to run

Cat 20 is NOT blocking the V2 baseline close-out. It's a follow-up investigation after the baseline is stable, driven by the question "we proved single-user V2 is consistent with the recorded bugs — are there silent bugs only concurrency exposes?" Highest priority if:

- A real customer reports a multi-user date-corruption scenario.
- A second investigation finds a candidate concurrency-specific code path (e.g., read-modify-write in VV.Form.Save).
- We want to generate concrete evidence for the fix-strategy recommendation that currently says "FORM-BUG-5 compounds across users" — Cat 20's 3-user chain is the proof.

Otherwise it sits PENDING until the next platform regression-detection cycle.
