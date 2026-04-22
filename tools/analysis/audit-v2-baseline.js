#!/usr/bin/env node
/**
 * Audit the V2 baseline for silent bug absorption.
 *
 * Compares each `*.V2` sibling to its V1 parent and flags cases where the V2
 * expected value differs but the entry has no bug marker. These are the
 * highest-risk entries — the rebaseline may have baked buggy V2 behavior
 * into the "passing" baseline without telling anyone.
 *
 * Classifications:
 *   IDENTICAL              — V2 expected == V1 expected. No review needed.
 *   FORMAT_ONLY            — V1 and V2 expected parse to the same UTC moment
 *                            AND the same calendar date in the entry's TZ.
 *                            Likely a benign format/type difference.
 *   SAME_LOCAL_DATE        — Different UTC moments but same calendar date
 *                            when viewed in the entry's TZ. Common for
 *                            date-only fields serialized differently.
 *   KNOWN_BUG_PERSISTS     — Semantic difference AND V1 entry has `bugs: [...]`
 *                            listing one or more bug IDs. V1 bug survived to V2.
 *   UNFLAGGED_DIFFERENCE   — Semantic difference AND V1 entry has `bugs: []`.
 *                            ★ REVIEW: may be a new V2 bug, an existing bug
 *                            that was silently inherited, or a deliberate V2
 *                            behavior change. Needs human judgment.
 *
 * Usage:
 *   npm run audit:v2 -- --project EmanuelJofre-vv5dev [--json] [--write]
 *
 * Writes a reviewable report to
 *   projects/{project}/testing/date-handling/v2-baseline-audit.md
 * when --write is passed.
 */
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const TEST_DATA_PATH = path.join(REPO_ROOT, 'testing', 'fixtures', 'test-data.js');

// --- CLI ---
const args = process.argv.slice(2);
function getArg(flag) {
    const i = args.indexOf(flag);
    return i !== -1 && i + 1 < args.length ? args[i + 1] : null;
}
const PROJECT = getArg('--project');
const JSON_OUTPUT = args.includes('--json');
const WRITE = args.includes('--write');

if (!PROJECT) {
    console.error('Usage: npm run audit:v2 -- --project <name> [--json] [--write]');
    process.exit(1);
}

// --- Load test data ---
delete require.cache[require.resolve(TEST_DATA_PATH)];
const { TEST_DATA } = require(TEST_DATA_PATH);

// Fields we compare. Tests use different conventions per category.
const EXPECTED_FIELDS = [
    'expectedRaw',
    'expectedApi',
    'expectedGdocIso',
    'expectedStored',
    'expectedSourceRaw',
    'expectedSourceGfv',
];

// Parse a stored value into a "calendar date in entry's TZ" comparison key.
// Handles three common shapes:
//   - Bare `YYYY-MM-DD` → treat as local calendar date in the entry's TZ
//     (NOT UTC — JS's `new Date('YYYY-MM-DD')` wrongly interprets as UTC).
//   - ISO datetime with time / Z / offset → parse as Date, convert to local
//     calendar date in entry's TZ.
//   - `YYYY-MM-DDTHH:MM:SS` (naive, no Z/offset) → treat as local in TZ
//     (represents wall-clock in that TZ).
function parseMaybeDate(str, tzName) {
    if (str == null || str === '') return null;
    const s = String(str);
    // Bare date-only → calendar-date-in-TZ (no moment)
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return { calendarDate: s, moment: null };
    // Naive datetime (no Z/offset) → local wall-clock in TZ
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?$/.test(s)) {
        return { calendarDate: s.slice(0, 10), moment: null, naive: true, str: s };
    }
    // ISO with Z or offset — absolute moment
    const d = new Date(s);
    if (isNaN(d.getTime())) return null;
    return { calendarDate: null, moment: d };
}

// YYYY-MM-DD in a given IANA TZ
function calendarDateInTz(date, tzName) {
    if (!date) return null;
    const fmt = new Intl.DateTimeFormat('en-CA', {
        timeZone: tzName,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    try {
        return fmt.format(date);
    } catch {
        return null;
    }
}

// Resolve a parsed value to a calendar date in the entry's TZ.
function toLocalDate(parsed, tzName) {
    if (!parsed) return null;
    if (parsed.calendarDate) return parsed.calendarDate;
    if (parsed.moment) return calendarDateInTz(parsed.moment, tzName);
    return null;
}

// Entry's `tz` field may be 'BRT', 'IST', etc. Map to IANA.
const TZ_MAP = {
    BRT: 'America/Sao_Paulo',
    IST: 'Asia/Kolkata',
    UTC0: 'Etc/UTC',
    PST: 'America/Los_Angeles',
    JST: 'Asia/Tokyo',
};

function classify(v1Val, v2Val, tzName) {
    if (v1Val === v2Val) return { verdict: 'IDENTICAL' };
    const v1p = parseMaybeDate(v1Val, tzName);
    const v2p = parseMaybeDate(v2Val, tzName);
    if (!v1p || !v2p) {
        return { verdict: 'SEMANTIC_DIFF', v1Local: null, v2Local: null };
    }
    // Same UTC moment (both have `moment` and match)
    if (v1p.moment && v2p.moment && v1p.moment.getTime() === v2p.moment.getTime()) {
        return { verdict: 'FORMAT_ONLY' };
    }
    const v1Local = toLocalDate(v1p, tzName);
    const v2Local = toLocalDate(v2p, tzName);
    if (v1Local && v2Local && v1Local === v2Local) {
        return { verdict: 'SAME_LOCAL_DATE', v1Local, v2Local };
    }
    return {
        verdict: 'SEMANTIC_DIFF',
        v1Local,
        v2Local,
        v1Iso: v1p.moment ? v1p.moment.toISOString() : v1Val,
        v2Iso: v2p.moment ? v2p.moment.toISOString() : v2Val,
    };
}

// --- Audit ---
const byId = new Map();
for (const e of TEST_DATA) if (e.id) byId.set(e.id, e);

const audits = [];
for (const v2 of TEST_DATA) {
    if (!v2.id || !(v2.id.endsWith('.V2') || v2.scope === 'V2')) continue;
    const baseId = v2.id.replace(/\.V2$/, '');
    const v1 = byId.get(baseId);
    if (!v1) {
        audits.push({ id: v2.id, verdict: 'ORPHAN_V2', reason: 'no V1 parent by base id' });
        continue;
    }
    const tzName = TZ_MAP[v2.tz] || null;
    const fieldDiffs = [];
    for (const f of EXPECTED_FIELDS) {
        if (v1[f] === undefined && v2[f] === undefined) continue;
        const c = classify(v1[f], v2[f], tzName);
        if (c.verdict === 'IDENTICAL') continue;
        fieldDiffs.push({ field: f, v1: v1[f], v2: v2[f], ...c });
    }
    if (fieldDiffs.length === 0) {
        audits.push({ id: v2.id, baseId, verdict: 'IDENTICAL' });
        continue;
    }
    // "Documented" if EITHER V1 or V2 entry carries a bug marker. V2-specific
    // tags (e.g., FORM-BUG-V2-*) added post-rebaseline count as documentation.
    const v1Bugs = Array.isArray(v1.bugs) ? v1.bugs : [];
    const v2Bugs = Array.isArray(v2.bugs) ? v2.bugs : [];
    const hasBugs = v1Bugs.length > 0 || v2Bugs.length > 0;
    const allFormat = fieldDiffs.every((d) => d.verdict === 'FORMAT_ONLY');
    const allLocalSame = fieldDiffs.every((d) => d.verdict === 'FORMAT_ONLY' || d.verdict === 'SAME_LOCAL_DATE');
    let overall;
    if (allFormat) overall = 'FORMAT_ONLY';
    else if (allLocalSame) overall = 'SAME_LOCAL_DATE';
    else if (hasBugs) overall = 'KNOWN_BUG_PERSISTS';
    else overall = 'UNFLAGGED_DIFFERENCE';

    audits.push({
        id: v2.id,
        baseId,
        verdict: overall,
        tz: v2.tz,
        config: v2.config,
        category: v2.category,
        action: v2.action,
        bugs: [...new Set([...v1Bugs, ...v2Bugs])],
        fieldDiffs,
        notes: v1.notes || v2.notes || '',
    });
}

// --- Output ---
if (JSON_OUTPUT) {
    console.log(JSON.stringify({ project: PROJECT, total: audits.length, audits }, null, 2));
    process.exit(0);
}

const counts = {};
for (const a of audits) counts[a.verdict] = (counts[a.verdict] || 0) + 1;

const lines = [];
lines.push('# V2 Baseline Audit — ' + PROJECT);
lines.push('');
lines.push('Generated: ' + new Date().toISOString());
lines.push('');
lines.push(
    '**Purpose**: flag `*.V2` entries whose expected values drifted from V1 ' +
        "without a documented bug marker, so we don't silently absorb V2 bugs into the regression baseline."
);
lines.push('');
lines.push('## Summary');
lines.push('');
lines.push('| Verdict | Count | Meaning |');
lines.push('| --- | ---: | --- |');
const VERDICT_DESC = {
    IDENTICAL: 'V2 expected matches V1 exactly. No action needed.',
    FORMAT_ONLY: 'Same UTC moment — V1 and V2 differ only in serialization format. Benign.',
    SAME_LOCAL_DATE:
        "Same calendar date in the entry's TZ (different UTC representations). Usually benign for date-only.",
    KNOWN_BUG_PERSISTS: 'V2 differs from V1 AND V1 has a `bugs: [...]` marker. V1 bug carried over to V2 — documented.',
    UNFLAGGED_DIFFERENCE:
        '★ **REVIEW** — V2 differs from V1 AND V1 has no bug marker. Potential silently-absorbed V2 bug.',
    SEMANTIC_DIFF: 'Non-parseable difference (empty string, boolean, etc.). Review manually.',
    ORPHAN_V2: 'V2 sibling with no V1 parent. Likely a test-data structural issue.',
};
for (const [v, n] of Object.entries(counts).sort(([, a], [, b]) => b - a)) {
    lines.push(`| ${v} | ${n} | ${VERDICT_DESC[v] || ''} |`);
}
lines.push('');

// Focus sections — listed in review-priority order
const priority = [
    'UNFLAGGED_DIFFERENCE',
    'SEMANTIC_DIFF',
    'ORPHAN_V2',
    'KNOWN_BUG_PERSISTS',
    'SAME_LOCAL_DATE',
    'FORMAT_ONLY',
    'IDENTICAL',
];
for (const v of priority) {
    const bucket = audits.filter((a) => a.verdict === v);
    if (!bucket.length) continue;
    lines.push(`## ${v} (${bucket.length})`);
    lines.push('');
    if (v === 'UNFLAGGED_DIFFERENCE') {
        lines.push('**Review each entry. Decide whether:**');
        lines.push(
            "1. Add a bug ID to the V2 sibling's `bugs: [...]` array (new V2 bug or V1 bug inherited but previously undocumented)."
        );
        lines.push(
            '2. Confirm benign (V2-design format change) — no action needed, but consider a neutral tag like `V2-FORMAT` for clarity.'
        );
        lines.push('3. Revert the V2 expected to the V1 value if the rebaseline was wrong.');
        lines.push('');
    }
    if (v === 'IDENTICAL' || v === 'FORMAT_ONLY') {
        lines.push('<details><summary>Expand</summary>');
        lines.push('');
    }
    lines.push('| ID | TZ · Cat · Config | V1 bugs | Field | V1 expected | V2 expected | Sub-verdict |');
    lines.push('| --- | --- | --- | --- | --- | --- | --- |');
    for (const a of bucket) {
        const bugs = (a.bugs || []).join(', ') || '—';
        const ctx = [a.tz, a.category, a.config].filter(Boolean).join(' · ');
        if (!a.fieldDiffs || !a.fieldDiffs.length) {
            lines.push(`| \`${a.id}\` | ${ctx} | ${bugs} | — | — | — | — |`);
            continue;
        }
        for (const d of a.fieldDiffs) {
            const v1 = String(d.v1 ?? '')
                .replace(/\|/g, '\\|')
                .slice(0, 40);
            const v2 = String(d.v2 ?? '')
                .replace(/\|/g, '\\|')
                .slice(0, 40);
            lines.push(`| \`${a.id}\` | ${ctx} | ${bugs} | ${d.field} | \`${v1}\` | \`${v2}\` | ${d.verdict} |`);
        }
    }
    lines.push('');
    if (v === 'IDENTICAL' || v === 'FORMAT_ONLY') {
        lines.push('</details>');
        lines.push('');
    }
}

const md = lines.join('\n');
console.log(md);

if (WRITE) {
    const outDir = path.join(REPO_ROOT, 'projects', PROJECT.toLowerCase(), 'testing', 'date-handling');
    fs.mkdirSync(outDir, { recursive: true });
    const outPath = path.join(outDir, 'v2-baseline-audit.md');
    fs.writeFileSync(outPath, md);
    console.error(`\nWrote ${path.relative(REPO_ROOT, outPath)}`);
}
