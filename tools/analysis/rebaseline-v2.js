#!/usr/bin/env node
/**
 * Phase 0 — V2 expected-value rebaseline.
 *
 * For each TC observed in a V2 regression run, ensure a scope=V2 entry exists in
 * `test-data.js` with the observed `expectedRaw`/`expectedApi`. Never touches V1
 * entries — V1 environments keep running against their V1 baseline unchanged.
 *
 * Strategy — line-anchored edits (no full-file parse):
 *   - UPDATE: find `id: '<tcIdOrV2>',`, replace `expectedRaw`/`expectedApi` within the
 *     next ~40 lines until the entry's closing `    },`.
 *   - CREATE: find the V1 entry's `id:` line, walk forward to the closing `    },`,
 *     copy that block, swap id/scope/expectedRaw/expectedApi, and insert right
 *     after the V1 entry.
 *
 * Usage:
 *   npm run rebaseline:v2 -- --project EmanuelJofre-vv5dev                 # dry-run (default)
 *   npm run rebaseline:v2 -- --project EmanuelJofre-vv5dev --write         # apply changes
 *   npm run rebaseline:v2 -- --project EmanuelJofre-vv5dev --tc 1-A-BRT    # single TC
 */
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const TEST_DATA_PATH = path.join(REPO_ROOT, 'testing', 'fixtures', 'test-data.js');
const NON_EXECUTABLE_ACTIONS = new Set(['umbrella', 'skip', 'theoretical']);

// --- CLI ---
const args = process.argv.slice(2);
function getArg(flag) {
    const i = args.indexOf(flag);
    return i !== -1 && i + 1 < args.length ? args[i + 1] : null;
}
const PROJECT = getArg('--project');
const TC_FILTER = getArg('--tc');
const WRITE = args.includes('--write');

if (!PROJECT) {
    console.error('Usage: npm run rebaseline:v2 -- --project <name> [--tc <id>] [--write]');
    process.exit(1);
}

// --- Load regression results ---
const resultsPath = path.join(
    REPO_ROOT,
    'projects',
    PROJECT.toLowerCase(),
    'testing',
    'date-handling',
    'regression-results-latest.json'
);
if (!fs.existsSync(resultsPath)) {
    console.error(`No regression-results-latest.json for project ${PROJECT} at:\n  ${resultsPath}`);
    process.exit(1);
}
const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));

const envKey = results.buildContext?.instance || '';
const isV2Env = /vv5dev/i.test(envKey);
if (!isV2Env) {
    console.error(`Refusing to rebaseline: regression JSON is from env "${envKey}" which does not look like a V2 env.`);
    process.exit(1);
}

const fingerprint = results.buildContext?.fingerprint || '(unknown)';
console.log(`Source: ${resultsPath}`);
console.log(`Env: ${envKey} · Build fingerprint: ${fingerprint}`);
console.log(`Total results: ${results.results.length}\n`);

// --- Load TEST_DATA via require to get the canonical list of entries by id+scope ---
delete require.cache[require.resolve(TEST_DATA_PATH)];
const { TEST_DATA } = require(TEST_DATA_PATH);
console.log(`Loaded ${TEST_DATA.length} entries via require()\n`);

const byId = new Map();
for (const e of TEST_DATA) if (e.id) byId.set(e.id, e);

// --- Decide per-observation action ---
const plan = { UPDATE: [], CREATE: [], SKIP: [] };
const seen = new Set();

for (const r of results.results) {
    if (!r.tcId) continue;
    if (TC_FILTER && r.tcId !== TC_FILTER) continue;
    if (seen.has(r.tcId)) continue;
    if (r.status !== 'passed' && r.status !== 'failed') continue;

    const tcId = r.tcId;
    const v2Id = `${tcId}.V2`;

    let op, targetEntry, baseEntry;
    if (byId.has(v2Id)) {
        op = 'UPDATE';
        targetEntry = byId.get(v2Id);
    } else if (byId.has(tcId) && byId.get(tcId).scope === 'V2') {
        op = 'UPDATE';
        targetEntry = byId.get(tcId);
    } else if (byId.has(tcId)) {
        baseEntry = byId.get(tcId);
        if (NON_EXECUTABLE_ACTIONS.has(baseEntry.action)) {
            plan.SKIP.push({ tcId, reason: `V1 entry action=${baseEntry.action}` });
            seen.add(tcId);
            continue;
        }
        op = 'CREATE';
    } else {
        plan.SKIP.push({ tcId, reason: 'no matching V1 entry in test-data.js' });
        seen.add(tcId);
        continue;
    }

    let newRaw, newApi;
    if (r.status === 'passed') {
        const src = targetEntry || baseEntry;
        newRaw = src.expectedRaw;
        newApi = src.expectedApi;
    } else {
        newRaw = r.actualRaw;
        newApi = r.actualApi;
    }

    // Treat empty strings the same as null — reporter emits '' when it can't
    // parse a value out of the assertion error (e.g., serial-dependent tests
    // that reference a prior test's state that wasn't captured).
    const hasRaw = newRaw != null && newRaw !== '';
    const hasApi = newApi != null && newApi !== '';
    if (!hasRaw && !hasApi) {
        plan.SKIP.push({ tcId, reason: 'no usable actualRaw/actualApi (empty/null observation)' });
        seen.add(tcId);
        continue;
    }
    const apiFallback = !hasApi && hasRaw;
    if (apiFallback) newApi = newRaw;
    if (!hasRaw && hasApi) newRaw = newApi; // symmetric guard, rare

    plan[op].push({
        op,
        tcId,
        v2Id: op === 'CREATE' ? v2Id : targetEntry.id,
        baseId: baseEntry ? baseEntry.id : null,
        newRaw,
        newApi,
        apiFallback,
    });
    seen.add(tcId);
}

// --- Print plan ---
console.log('Plan:');
console.log(`  UPDATE existing V2 entries: ${plan.UPDATE.length}`);
console.log(`  CREATE new V2 siblings:     ${plan.CREATE.length}`);
console.log(`  SKIP (can't rebaseline):    ${plan.SKIP.length}\n`);

const showSample = (title, list, fmt) => {
    if (!list.length) return;
    console.log(`  ${title} (first ${Math.min(5, list.length)} of ${list.length}):`);
    for (const it of list.slice(0, 5)) console.log('    ' + fmt(it));
    if (list.length > 5) console.log('    ...');
    console.log();
};
showSample(
    'UPDATE',
    plan.UPDATE,
    (it) => `${it.v2Id}  raw=${String(it.newRaw).slice(0, 50)}  api=${String(it.newApi).slice(0, 50)}`
);
showSample(
    'CREATE',
    plan.CREATE,
    (it) => `${it.v2Id}  raw=${String(it.newRaw).slice(0, 50)}  api=${String(it.newApi).slice(0, 50)}`
);
showSample('SKIP', plan.SKIP, (it) => `${it.tcId}  (${it.reason})`);

if (!WRITE) {
    console.log('Dry-run — no file changes. Re-run with `--write` to apply.');
    process.exit(0);
}

// --- Apply changes via line-anchored edits ---
let src = fs.readFileSync(TEST_DATA_PATH, 'utf8');

/**
 * Find the text bounds of an entry by its `id` value.
 * Returns { start, end } — start is at the `    {` line, end is just after `    },\n`.
 * Returns null if not found.
 */
function findEntryBounds(id) {
    // Anchor: `id: '<id>',` on its own line (possibly with different quote styles)
    const idLine = src.indexOf(`id: '${id}',`);
    if (idLine === -1) return null;
    // Walk backward to find the opening `    {` preceding this line
    let s = idLine;
    while (s > 0 && src[s] !== '{') s--;
    // Walk back to line start
    while (s > 0 && src[s - 1] !== '\n') s--;
    // Walk forward from idLine to find the closing `    },` of THIS entry
    // Track brace depth starting from the `{` we found.
    let e = s;
    let depth = 0;
    let inStr = null;
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
    // Consume `,` + trailing `\n`
    while (e < src.length && (src[e] === ',' || src[e] === ' ' || src[e] === '\t')) e++;
    if (src[e] === '\n') e++;
    return { start: s, end: e };
}

function replaceFieldInBlock(block, name, newValue) {
    const re = new RegExp(`(\\b${name}:\\s*)(['"\`])([^'"\`]*)(['"\`])`);
    if (!re.test(block)) return null;
    const v = newValue == null ? '' : String(newValue);
    return block.replace(re, (_, pre, q1, _old, q2) => `${pre}${q1}${v}${q2}`);
}

function ensureFieldInBlock(block, name, newValue, insertAfter) {
    const updated = replaceFieldInBlock(block, name, newValue);
    if (updated) return updated;
    // Insert a new `<name>: '<value>',` line after the `<insertAfter>:` line, matching its indent
    const re = new RegExp(`(^(\\s*)\\b${insertAfter}:[^\\n]*\\n)`, 'm');
    const v = newValue == null ? '' : String(newValue);
    return block.replace(re, (whole, line, indent) => `${line}${indent}${name}: '${v}',\n`);
}

// Apply UPDATE — in-place; iterate from end-to-start so offsets don't shift
const updates = plan.UPDATE.slice();
updates.sort((a, b) => {
    const bA = findEntryBounds(a.v2Id)?.start ?? 0;
    const bB = findEntryBounds(b.v2Id)?.start ?? 0;
    return bB - bA; // descending
});
let updatedCount = 0;
for (const it of updates) {
    const bounds = findEntryBounds(it.v2Id);
    if (!bounds) {
        console.warn(`[UPDATE] entry not found: ${it.v2Id}`);
        continue;
    }
    let block = src.slice(bounds.start, bounds.end);
    let next = block;
    if (it.newRaw != null) next = replaceFieldInBlock(next, 'expectedRaw', it.newRaw) || next;
    if (it.newApi != null) next = replaceFieldInBlock(next, 'expectedApi', it.newApi) || next;
    next = ensureFieldInBlock(next, 'scope', 'V2', 'id');
    if (next !== block) {
        src = src.slice(0, bounds.start) + next + src.slice(bounds.end);
        updatedCount++;
    }
}

// Apply CREATE — insert a sibling after the V1 base entry. Iterate end-to-start.
const creates = plan.CREATE.slice();
creates.sort((a, b) => {
    const bA = findEntryBounds(a.baseId)?.start ?? 0;
    const bB = findEntryBounds(b.baseId)?.start ?? 0;
    return bB - bA; // descending
});
let createdCount = 0;
for (const it of creates) {
    const bounds = findEntryBounds(it.baseId);
    if (!bounds) {
        console.warn(`[CREATE] base entry not found: ${it.baseId}`);
        continue;
    }
    let block = src.slice(bounds.start, bounds.end);
    // Duplicate, swap id, inject scope, update expected values
    let sib = block;
    sib = sib.replace(/(\bid:\s*)(['"`])([^'"`]+)(['"`])/, (_, pre, q1, _old, q2) => `${pre}${q1}${it.v2Id}${q2}`);
    sib = ensureFieldInBlock(sib, 'scope', 'V2', 'id');
    if (it.newRaw != null) sib = replaceFieldInBlock(sib, 'expectedRaw', it.newRaw) || sib;
    if (it.newApi != null) sib = replaceFieldInBlock(sib, 'expectedApi', it.newApi) || sib;
    // Insert sibling right after the base entry
    src = src.slice(0, bounds.end) + sib + src.slice(bounds.end);
    createdCount++;
}

fs.writeFileSync(TEST_DATA_PATH, src);
console.log(`Wrote ${TEST_DATA_PATH}`);
console.log(`  ${updatedCount} V2 entries updated in place`);
console.log(`  ${createdCount} new V2 siblings inserted after V1 parents`);
console.log(`  ${plan.SKIP.length} skipped`);
