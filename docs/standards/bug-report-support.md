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

1. {step}
2. {step}
3. {step}

**Expected result:** {what should happen}

**Actual result:** {what actually happened, with concrete values}

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

- **Metadata first.** Triagers scan the header in under 30 seconds to decide priority and routing. Don't bury the environment or severity.
- **Concrete values in the repro.** "Enter 2026-03-15 in the Approval Date field" beats "enter a date." Real IDs, real strings, real timezones.
- **One bug per report.** If you found two defects, file two. Linking related bugs is fine; bundling them muddles triage.
- **Evidence over description.** A 30-second screen recording is worth more than a paragraph of prose.
- **Don't speculate on root cause.** If you have a hypothesis, add it under a `## Hypothesis (unverified)` heading at the bottom — clearly marked. The support team's diagnosis may differ.

See the core writing principles in [bug-reporting.md](bug-reporting.md#core-writing-principles) — neutral language, no jargon before definition, every claim backed or marked unverified.
