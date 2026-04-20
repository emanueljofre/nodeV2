# Bug Report — Support Format

Short-form bug report for filing tickets with VV support, product teams, or customer contacts. Target length: **one page**.

For the deep internal format with root-cause analysis, use [bug-report-investigation.md](bug-report-investigation.md). Shared conventions (bug ID, severity, naming) live in [bug-reporting.md](bug-reporting.md).

---

## When to Use This Format

- You hit a bug in a live environment and need it fixed by someone else.
- You don't own the fix and won't be producing the full analysis.
- The receiving team needs enough to reproduce and triage — not a research artifact.

If you plan to analyze the defect yourself, skip this and use the investigation format.

---

## Template

Copy this into your ticket or a `bug-N-support-report.md` file. Every field is required unless marked optional.

```markdown
# {BUG-ID}: {short descriptive title}

## Metadata

- **Bug ID:** {e.g., FORM-BUG-8} — see [bug-reporting.md](bug-reporting.md) for the convention
- **Reporter:** {name, team}
- **Date observed:** {YYYY-MM-DD}
- **Environment:** {customer name + base URL}
- **Build / platform version:** {from the VV footer or `env:profile`}
- **Browser / OS:** {e.g., Chrome 131 / macOS 15.1}
- **User role:** {role that hit the bug — admin, end user, public portal, etc.}
- **Timezone:** {user system TZ — critical for date/time bugs}
- **Frequency:** Always / Intermittent / Once
- **First noticed:** {date or "unknown"}
- **Recent changes:** {recent deploys, config updates, script pushes — or "none known"}
- **Severity:** {CRITICAL / HIGH / MEDIUM / LOW — see rubric in bug-reporting.md}

## Summary

{One or two sentences. What happened vs. what should have happened. Plain language — no jargon, no internal terms.}

## Steps to Reproduce

Structure this section like a QA test case, not prose. A triager should be able to sit down cold and reproduce the defect in under three minutes without re-reading to infer setup.

### Preconditions

{Everything that must be true before step 1 runs. Bulleted list — one fact per line. If you have multiple reproductions below, put everything they share here.}

- Access: {customer env, URL, user account with {role}}
- Browser setup: {timezone, DevTools open, specific flags if any}
- Platform setup: {form template / record / dashboard to open, pre-existing data required, feature flags}
- Permissions or write-policy: {if any reproduction writes data, name the allowlisted artifacts}

### Test data

{The exact values the steps will use. Use on-screen formats, not serialization formats. If multiple reproductions use the same inputs, share them here.}

- {Field name}: `{value}` ({format note if needed, e.g., "entered via the date picker"})
- {API body field}: `{value}` ({format note})
- {Record ID / instance}: `{id or "freshly created in step 2"}`

### Reproduction steps

If the bug has a single natural reproduction path, give one Steps + Expected + Actual block. If there are multiple reproduction paths that are independently informative for triage — i.e., a reader might prefer any one of them — give each its own peer-level subsection (`### Reproduction A — {label}`, `### Reproduction B — {label}`, …). Each subsection has its own numbered Steps and its own Expected / Actual. Do **not** rank one reproduction as primary and bury the others under "Other triggers" when they are all valid user-facing manifestations; that framing makes them look like edge cases, which biases triage.

Use "Other triggers" (below) only for paths that are genuinely secondary — edge cases, configuration-specific variants, rare or intermittent manifestations, or cases that only produce a subset of the symptom.

Per reproduction:

1. {Atomic action. One verb per step. Exact values from Test data above.}
2. {…}
3. {…}

**Expected result:** {what should happen after the last step — concrete values, not "the date shows correctly"}

**Actual result:** {what actually happens — concrete values, exactly what the user sees on screen}

### Other triggers (optional)

{For genuinely secondary paths — edge cases, narrower configurations, rare variants. Each bullet is one sentence plus the concrete trigger. Do not use this section as a dumping ground for equal-hierarchy reproductions.}

- {Short label} — {one-sentence trigger}: {concrete input → concrete observed value}.

## Affected Artifacts

{IDs the support team will need to locate the record. Omit fields that don't apply.}

- Form template: {name / ID}
- Form instance: {ID / revision}
- Document: {name / ID}
- Web service: {name / ID}
- Scheduled process: {name}
- Dashboard / report: {name}

## Evidence

- Screenshots / video: {attach or link}
- Browser console errors: {paste or "none"}
- Network response (if API-related): {status, body snippet, or "n/a"}
- Server log excerpts: {if available}

## Scope

- **Other users affected?** {yes / no / unknown}
- **Other environments affected?** {tested elsewhere? results?}
- **Workaround:** {if known, otherwise "none identified"}
```

---

## Filling It Out Well

- **Frame around user-observable effects, not the mechanism.** Title, summary, and reproduction steps describe what the user sees, does, and ends up with — not why the platform behaves that way. Good: _"The form displays and saves the wrong date when a record is opened."_ Bad: _"Calendar control strips Z suffix before parsing."_ The first is a symptom the support team can verify with their own eyes; the second is an assumed root cause that narrows triage before it starts. Internal terms (Z, ISO 8601, function names, code paths, V1/V2 flags, config letter codes) are out of place in the title, summary, and repro — keep them in the evidence or hypothesis section if they belong at all. See [bug-reporting.md — Core Writing Principles](bug-reporting.md#core-writing-principles) § 6.
- **Metadata first.** Triagers scan the header in under 30 seconds to decide priority and routing. Don't bury the environment or severity.
- **Concrete values in the repro.** "Enter 2026-03-15 in the Approval Date field" beats "enter a date." Real IDs, real strings, real timezones. Use the format the user would read on screen (e.g. `03/15/2026 12:00 PM`) rather than the serialization format the API sends (`2026-03-15T12:00:00.000Z`), unless the API is itself the surface being described.
- **Equal-hierarchy reproductions.** If the bug reproduces through several paths that are all real user-facing manifestations (not edge cases), give each its own peer-level subsection with its own Steps and Expected/Actual. Share Preconditions and Test data at the top so the paths do not drift apart. Do not promote one path to "main steps" and bury the rest under "Other triggers" — that framing makes the buried paths look like edge cases and biases triage. Reserve "Other triggers" for paths that are genuinely narrower (specific configurations, rare variants, intermittent edge cases).
- **Atomic steps.** One verb per step. "Open the form" is one step; "open the form and save it" is two. A triager should be able to stop after any step and still know what state the system is in.
- **One bug per report.** If you found two defects, file two. Linking related bugs is fine; bundling them muddles triage.
- **Evidence over description.** A 30-second screen recording is worth more than a paragraph of prose.
- **Don't speculate on root cause.** If you have a hypothesis, add it under a `## Hypothesis (unverified)` heading at the bottom — clearly marked. The support team's diagnosis may differ.

See the core writing principles in [bug-reporting.md](bug-reporting.md#core-writing-principles) — neutral language, no jargon before definition, every claim backed or marked unverified.
