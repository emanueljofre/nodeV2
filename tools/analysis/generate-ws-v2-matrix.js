#!/usr/bin/env node
/**
 * Generate V2 matrix rows for WS slots that were NOT_IN_MATRIX in the latest
 * audit. Reads the project's v2-baseline-audit.json, builds a markdown table
 * of observed values (as the new V1/V2 expected baseline for those slots),
 * and appends it to `research/date-handling/web-services/matrix.md` under a
 * dated "V2 Baseline Additions" section.
 *
 * Idempotent: if a section for the same project + date already exists, the
 * script replaces it rather than duplicating.
 *
 * Usage:
 *   node tools/analysis/generate-ws-v2-matrix.js --project EmanuelJofre-vv5dev
 *   node tools/analysis/generate-ws-v2-matrix.js --project EmanuelJofre-vv5dev --dry-run
 */
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const MATRIX_PATH = path.join(REPO_ROOT, 'research', 'date-handling', 'web-services', 'matrix.md');

const args = process.argv.slice(2);
function getArg(flag) {
    const i = args.indexOf(flag);
    return i !== -1 && i + 1 < args.length ? args[i + 1] : null;
}
const PROJECT = getArg('--project');
const DRY_RUN = args.includes('--dry-run');

if (!PROJECT) {
    console.error('Usage: node tools/analysis/generate-ws-v2-matrix.js --project <name> [--dry-run]');
    process.exit(1);
}

const auditPath = path.join(
    REPO_ROOT,
    'projects',
    PROJECT.toLowerCase(),
    'testing',
    'date-handling',
    'web-services',
    'v2-baseline-audit.json'
);

if (!fs.existsSync(auditPath)) {
    console.error(`No audit JSON at: ${auditPath}\nRun: npm run audit:ws:v2 -- --project ${PROJECT} --write`);
    process.exit(1);
}

const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
// Skip rows with no observed value — these are harness "summary" emissions
// (e.g., WS-6/WS-8 per-config rollups) that don't carry a comparable stored
// value. The variant-specific rows (ws-6-a-null, ws-6-a-empty, etc.) already
// exist in the main tables above and get matched directly.
const notInMatrix = (audit.audits || []).filter(
    (x) => x.verdict === 'NOT_IN_MATRIX' && x.v2Stored != null && x.v2Stored !== ''
);

if (!notInMatrix.length) {
    console.log('No NOT_IN_MATRIX entries in audit — nothing to add.');
    process.exit(0);
}

console.log(`Generating V2 matrix rows for ${notInMatrix.length} NOT_IN_MATRIX slots\n`);

// Build rows. Observed `stored` becomes the new Expected.
const rows = notInMatrix
    .map((a) => ({
        id: a.id,
        action: a.action,
        config: (a.config || '').toUpperCase(),
        tz: (a.tz || '').toUpperCase(),
        variant: a.variant || a.format || '—',
        expected: a.v2Stored == null || a.v2Stored === '' ? '—' : String(a.v2Stored),
        sent: a.v2Sent == null || a.v2Sent === '' ? '—' : String(a.v2Sent),
    }))
    .sort((a, b) => a.id.localeCompare(b.id));

const today = new Date().toISOString().substring(0, 10);
const sectionAnchor = `<!-- ws-v2-baseline:${PROJECT.toLowerCase()} -->`;
const sectionEndAnchor = `<!-- /ws-v2-baseline:${PROJECT.toLowerCase()} -->`;

const lines = [];
lines.push(sectionAnchor);
lines.push(`## V2 Baseline Additions — ${PROJECT} (${today})`);
lines.push('');
lines.push(
    `Auto-generated from [\`v2-baseline-audit.json\`](../../../projects/${PROJECT.toLowerCase()}/testing/date-handling/web-services/v2-baseline-audit.json). ` +
        `Build fingerprint: \`${audit.buildContext?.fingerprint || '(unknown)'}\`. ` +
        'These slots were emitted by the harness but not enumerated in the sections above. ' +
        'Observed `stored` values from the run are used as the V1-baseline-equivalent Expected here — ' +
        'they document what VV currently returns for each slot and become the comparison target for ' +
        'future regression runs. Regenerate with `node tools/analysis/generate-ws-v2-matrix.js --project <name>`.'
);
lines.push('');
lines.push('| ID | Action | Config | TZ | Variant/Format | Input Sent | Expected Stored | Status |');
lines.push('| --- | :---: | :---: | :---: | :---: | --- | --- | :---: |');
for (const r of rows) {
    const exp = r.expected.replace(/\|/g, '\\|');
    const sent = r.sent.replace(/\|/g, '\\|');
    lines.push(
        `| \`${r.id}\` | ${r.action} | ${r.config} | ${r.tz} | ${r.variant} | \`${sent}\` | \`${exp}\` | BASELINE |`
    );
}
lines.push('');
lines.push(sectionEndAnchor);

const block = lines.join('\n');

// Read matrix, replace existing section if present, else append.
const matrix = fs.readFileSync(MATRIX_PATH, 'utf8');
const startIdx = matrix.indexOf(sectionAnchor);
let next;
if (startIdx >= 0) {
    const endIdx = matrix.indexOf(sectionEndAnchor, startIdx);
    if (endIdx < 0) {
        console.error(`Section anchor found at ${startIdx} but no end anchor — aborting to avoid corrupting matrix.md`);
        process.exit(1);
    }
    const after = endIdx + sectionEndAnchor.length;
    next = matrix.slice(0, startIdx) + block + matrix.slice(after);
    console.log(`Replacing existing section at offset ${startIdx}`);
} else {
    const sep = matrix.endsWith('\n') ? '\n' : '\n\n';
    next = matrix + sep + block + '\n';
    console.log('Appending new section at end of matrix.md');
}

if (DRY_RUN) {
    console.log('\n--- Dry run — generated block ---\n');
    console.log(block);
    process.exit(0);
}

fs.writeFileSync(MATRIX_PATH, next);
console.log(`\nWrote ${path.relative(REPO_ROOT, MATRIX_PATH)} (${rows.length} rows, ${block.length} bytes)`);
