# Bug Reporting

Index for bug documentation in this repo. Two formats exist — use the one that matches your audience.

## Which format to use?

| Situation                                                                  | Format                   | File                                                       |
| -------------------------------------------------------------------------- | ------------------------ | ---------------------------------------------------------- |
| Filing a ticket with VV support, a product team, or a customer             | **Support report**       | [bug-report-support.md](bug-report-support.md)             |
| Documenting a defect you're analyzing yourself (root cause, evidence, fix) | **Investigation report** | [bug-report-investigation.md](bug-report-investigation.md) |

**Rule of thumb:** if you're handing off the bug for someone else to fix without your help, use the support format. If you're producing the analysis that will drive the fix, use the investigation format.

A single bug may have both: a support ticket filed externally and an investigation report living in `research/` or `projects/{customer}/analysis/`.

---

## Shared Conventions

The following rules apply to **both** formats. Format-specific guidance lives in each format's own document.

### Bug ID Convention

Bug IDs follow the pattern `{COMPONENT}-BUG-{N}`:

| Component               | Prefix               | Example                |
| ----------------------- | -------------------- | ---------------------- |
| Forms calendar fields   | `FORM-BUG-`          | FORM-BUG-1, FORM-BUG-7 |
| Web Services (REST API) | `WEBSERVICE-BUG-`    | WEBSERVICE-BUG-1       |
| Analytic Dashboards     | `FORMDASHBOARD-BUG-` | FORMDASHBOARD-BUG-1    |
| Reports                 | `REPORT-BUG-`        | (future)               |
| Node.js Client Library  | `NODECLIENT-BUG-`    | (future)               |

Numbers are sequential within each component. Once assigned, a bug ID is permanent — do not renumber.

### Severity Rubric

| Level        | Definition                                                                                                                                                                          |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **CRITICAL** | Data loss or corruption that cannot be recovered, or the defect affects all users in all configurations with no workaround                                                          |
| **HIGH**     | Incorrect data is stored or returned, affecting a broad set of users or configurations. Workarounds exist but require non-obvious changes                                           |
| **MEDIUM**   | Incorrect behavior with a narrow trigger (specific configuration, specific data source, specific timezone). Workarounds are available or the most common usage paths are unaffected |
| **LOW**      | Cosmetic, edge-case-only, or theoretical — the defect exists in code but has no confirmed real-world impact under tested conditions                                                 |

Justify the rating in one sentence. Don't overstate ("all users affected") or understate ("dormant") — describe the actual scope.

### Core Writing Principles

These apply regardless of format. The investigation format adds more (see its own principles section).

1. **Neutral, precise language.** Bug reports describe defective behavior — they are not editorials. Avoid informal, judgmental, or emotionally loaded words.

    | Avoid                        | Use instead                                                            |
    | ---------------------------- | ---------------------------------------------------------------------- |
    | "garbage", "junk", "bogus"   | "invalid", "incorrect", "malformed"                                    |
    | "tricks", "fools", "lies to" | "causes", "results in", "leads to"                                     |
    | "insidious", "nasty", "ugly" | "silent" (if no warning), "difficult to detect"                        |
    | "explodes", "blows up"       | "throws an uncaught exception", "crashes"                              |
    | "breaks" (when vague)        | "fails", "produces incorrect results", "does not function as expected" |

2. **Zero prior context.** Readers don't know what you know. Define technical terms the first time you use them.

3. **Every claim is backed or marked unverified.** "Verified via automated testing" or "code-level observation — not verified in a live environment."

4. **Don't claim knowledge about environments you haven't tested.** Say "the demo environment" not "production."

5. **State what you don't know.** If you see code-level triggers but don't know what admin setting controls them, say so.

### File Naming and Location

| File                           | Purpose                                                          |
| ------------------------------ | ---------------------------------------------------------------- |
| `bug-N-short-description.md`   | Investigation report (problem description, evidence, root cause) |
| `bug-N-fix-recommendations.md` | Companion fix doc (workarounds, proposed fix, impact assessment) |
| `bug-N-support-report.md`      | Support ticket draft (if archived locally before filing)         |

The `N` matches the bug ID number (e.g., `bug-1-timezone-stripping.md` for FORM-BUG-1). All files live in the same `analysis/` directory of the owning research topic or project.
