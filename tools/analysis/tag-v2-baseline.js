#!/usr/bin/env node
/**
 * Tag V2 siblings where expected values differ from V1 parent and the
 * V1 entry has no bug marker. Classifies each case into one of five
 * patterns and adds a V2-specific bug tag so the baseline documents
 * the behavior instead of silently absorbing it.
 *
 * Patterns identified:
 *   A — date-only stored as UTC midnight           → FORM-BUG-V2-UTCMIDNIGHT
 *   B — legacy naive DateTime gets Z suffix        → FORM-BUG-V2-LEGACY-Z
 *   C — preset date shifts to year boundary         → FORM-BUG-V2-PRESET-YEAR
 *   D — cat-6 spurious 'false' expected (housekeeping) → reset to 'dynamic'
 *   E — previous-day shift (FORM-BUG-7 on V2)      → FORM-BUG-7-persists-on-V2
 *   (leaves SAME_LOCAL_DATE, FORMAT_ONLY, KNOWN_BUG_PERSISTS, IDENTICAL untouched)
 *
 * Usage:
 *   node tools/analysis/tag-v2-baseline.js                     # dry-run (default)
 *   node tools/analysis/tag-v2-baseline.js --write             # apply
 *   node tools/analysis/tag-v2-baseline.js --json              # machine-readable
 */
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const TEST_DATA_PATH = path.join(REPO_ROOT, 'testing', 'fixtures', 'test-data.js');

const args = process.argv.slice(2);
const WRITE = args.includes('--write');
const JSON_OUTPUT = args.includes('--json');

// --- Load entries (structured) + raw text for editing ---
delete require.cache[require.resolve(TEST_DATA_PATH)];
const { TEST_DATA } = require(TEST_DATA_PATH);
const byId = new Map();
for (const e of TEST_DATA) if (e.id) byId.set(e.id, e);

const TZ_MAP = {
    BRT: 'America/Sao_Paulo',
    IST: 'Asia/Kolkata',
    UTC0: 'Etc/UTC',
    PST: 'America/Los_Angeles',
    JST: 'Asia/Tokyo',
};

// --- Pattern matchers ---
// Regex helpers (pattern classification only — doesn't parse actual dates)
const BARE_DATE = /^\d{4}-\d{2}-\d{2}$/;
const NAIVE_DT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?$/;
const UTC_DT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z$/;

function classifyFieldDiff(v1, v2, v1Entry, v2Entry) {
    if (v1 === v2) return null;

    // Pattern D — cat-6 spurious 'false' expected value (housekeeping, not a real diff)
    if (v2Entry.category === 6 && (v2 === 'false' || v2 === false)) {
        return { pattern: 'D', tag: null, reset: v1 };
    }

    // Pattern C — preset date shifts to year/month boundary under V2.
    // Covers both V1 shapes: bare date string ("2026-03-01") and ISO DT
    // ("2026-03-01T03:00:00.000Z"). Compares the date part only.
    if (v2Entry.action === 'preset' && UTC_DT.test(String(v2))) {
        const v1Date = BARE_DATE.test(String(v1))
            ? String(v1).slice(0, 10)
            : UTC_DT.test(String(v1))
              ? String(v1).slice(0, 10)
              : null;
        const v2Date = String(v2).slice(0, 10);
        if (v1Date && (v1Date.slice(0, 4) !== v2Date.slice(0, 4) || v1Date.slice(5, 7) !== v2Date.slice(5, 7))) {
            return { pattern: 'C', tag: 'FORM-BUG-V2-PRESET-YEAR' };
        }
    }

    // Pattern E — V1 bare date → V2 UTC with previous day
    if (BARE_DATE.test(String(v1)) && UTC_DT.test(String(v2))) {
        const v1D = new Date(String(v1));
        const v2D = new Date(String(v2));
        // If V2's calendar date in entry TZ is different from V1's (one day off)
        if (v1D && v2D) {
            const tzName = TZ_MAP[v2Entry.tz];
            if (tzName) {
                const fmt = new Intl.DateTimeFormat('en-CA', {
                    timeZone: tzName,
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                });
                const v2Local = fmt.format(v2D);
                // V1 treated as its own string value (calendar date)
                if (v2Local !== String(v1)) {
                    // A — V2 is still UTC midnight of the SAME date (config B/F date-only ignoreTZ)
                    if (String(v2).endsWith('T00:00:00.000Z') && v2D.toISOString().slice(0, 10) === String(v1)) {
                        return { pattern: 'A', tag: 'FORM-BUG-V2-UTCMIDNIGHT' };
                    }
                    // Otherwise: real day shift — FORM-BUG-7 style
                    return { pattern: 'E', tag: 'FORM-BUG-7-persists-on-V2' };
                }
            }
        }
    }

    // Pattern B — V1 naive ISO → V2 same ISO + Z (legacy DateTime + ignoreTZ)
    if (NAIVE_DT.test(String(v1)) && UTC_DT.test(String(v2))) {
        const v1NoZ = String(v1);
        const v2NoZ = String(v2)
            .replace(/\.000Z$/, '')
            .replace(/\.\d+Z$/, '');
        if (v1NoZ === v2NoZ || v1NoZ + '.000' === v2NoZ) {
            // Legacy DateTime + ignoreTZ (Config H / G on legacy path) losing its
            // "local wall-clock" semantics by gaining a Z. Apply tag regardless of
            // config; if the config is non-legacy, the tag still surfaces the drift.
            return { pattern: 'B', tag: 'FORM-BUG-V2-LEGACY-Z' };
        }
    }

    return null;
}

// --- Walk V2 entries ---
const plans = []; // { id, patterns: Set, tagsToAdd: Set, resets: [{field, value}] }
for (const v2 of TEST_DATA) {
    if (!v2.id || !(v2.id.endsWith('.V2') || v2.scope === 'V2')) continue;
    const baseId = v2.id.replace(/\.V2$/, '');
    const v1 = byId.get(baseId);
    if (!v1) continue;
    // Only UNFLAGGED entries — V1 bugs array must be empty
    if (Array.isArray(v1.bugs) && v1.bugs.length > 0) continue;

    const fields = ['expectedRaw', 'expectedApi', 'expectedGdocIso', 'expectedStored'];
    const patterns = new Set();
    const tags = new Set();
    const resets = [];
    for (const f of fields) {
        if (v1[f] === undefined && v2[f] === undefined) continue;
        const c = classifyFieldDiff(v1[f], v2[f], v1, v2);
        if (!c) continue;
        patterns.add(c.pattern);
        if (c.tag) tags.add(c.tag);
        if (c.reset !== undefined) resets.push({ field: f, value: c.reset });
    }
    if (patterns.size > 0) {
        plans.push({ id: v2.id, patterns: [...patterns], tagsToAdd: [...tags], resets });
    }
}

// --- Summary ---
const patternCounts = { A: 0, B: 0, C: 0, D: 0, E: 0 };
for (const p of plans) for (const pat of p.patterns) patternCounts[pat]++;

if (JSON_OUTPUT) {
    console.log(JSON.stringify({ patternCounts, total: plans.length, plans }, null, 2));
    process.exit(0);
}

console.log('V2 baseline bug-tag sweep\n');
console.log('Pattern counts (some entries match multiple):');
for (const [p, n] of Object.entries(patternCounts)) console.log('  ' + p + ':', n);
console.log('\nEntries to update:', plans.length, '\n');

const samples = (pat) =>
    plans
        .filter((p) => p.patterns.includes(pat))
        .slice(0, 3)
        .map((p) => p.id);
console.log('Sample entries per pattern:');
for (const p of ['A', 'B', 'C', 'D', 'E']) if (patternCounts[p]) console.log('  ' + p + ':', samples(p).join(', '));

if (!WRITE) {
    console.log('\nDry-run — no file changes. Re-run with --write to apply.');
    process.exit(0);
}

// --- Apply ---
let src = fs.readFileSync(TEST_DATA_PATH, 'utf8');

function findEntryBlock(id) {
    const anchor = `id: '${id}',`;
    const idx = src.indexOf(anchor);
    if (idx === -1) return null;
    // Walk backward to opening `{`
    let s = idx;
    while (s > 0 && src[s] !== '{') s--;
    while (s > 0 && src[s - 1] !== '\n') s--;
    // Find closing `},` at matching depth
    let depth = 0;
    let inStr = null;
    let e = s;
    for (; e < src.length; e++) {
        const ch = src[e];
        if (inStr) {
            if (ch === '\\') {
                e++;
                continue;
            }
            if (ch === inStr) {
                inStr = null;
                continue;
            }
            continue;
        }
        if (ch === "'" || ch === '"' || ch === '`') {
            inStr = ch;
            continue;
        }
        if (ch === '{') depth++;
        else if (ch === '}') {
            depth--;
            if (depth === 0) {
                e++;
                break;
            }
        }
    }
    while (e < src.length && (src[e] === ',' || src[e] === ' ' || src[e] === '\t')) e++;
    if (src[e] === '\n') e++;
    return { start: s, end: e };
}

function replaceField(text, name, newValue) {
    const re = new RegExp(`(\\b${name}:\\s*)(['"\`])([^'"\`]*)(['"\`])`);
    if (!re.test(text)) return null;
    const v = newValue == null ? '' : String(newValue);
    return text.replace(re, (_, pre, q1, _old, q2) => `${pre}${q1}${v}${q2}`);
}

// Add tags to bugs: []. Preserve formatting.
function addBugTags(text, tags) {
    // Match an empty bugs array `bugs: [],`
    const emptyRe = /(\bbugs:\s*\[)\s*(\]\s*,)/;
    if (emptyRe.test(text)) {
        const quoted = tags.map((t) => `'${t}'`).join(', ');
        return text.replace(emptyRe, `$1${quoted}$2`);
    }
    // Match non-empty bugs array and append
    const nonEmptyRe = /(\bbugs:\s*\[)([^\]]*)(\])/;
    if (nonEmptyRe.test(text)) {
        return text.replace(nonEmptyRe, (_, open, inner, close) => {
            const existing = inner.match(/'([^']+)'/g) || [];
            const existingVals = new Set(existing.map((s) => s.slice(1, -1)));
            const toAdd = tags.filter((t) => !existingVals.has(t)).map((t) => `'${t}'`);
            if (!toAdd.length) return _;
            const trimmed = inner.trim().replace(/,\s*$/, '');
            const merged = trimmed.length ? trimmed + ', ' + toAdd.join(', ') : toAdd.join(', ');
            return open + merged + close;
        });
    }
    return text;
}

// Apply edits — iterate end-to-start so offsets don't shift
const sorted = plans
    .map((p) => ({ ...p, block: findEntryBlock(p.id) }))
    .filter((p) => p.block)
    .sort((a, b) => b.block.start - a.block.start);

let applied = 0;
for (const p of sorted) {
    let text = src.slice(p.block.start, p.block.end);
    const orig = text;
    if (p.tagsToAdd.length) text = addBugTags(text, p.tagsToAdd);
    for (const r of p.resets) {
        const upd = replaceField(text, r.field, r.value);
        if (upd) text = upd;
    }
    if (text !== orig) {
        src = src.slice(0, p.block.start) + text + src.slice(p.block.end);
        applied++;
    }
}

fs.writeFileSync(TEST_DATA_PATH, src);
console.log(`\nApplied tags to ${applied} V2 entries.`);
