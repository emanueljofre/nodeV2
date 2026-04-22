/**
 * Single source of truth for composing a WS matrix slot ID from a result row.
 *
 * Consumed by:
 *   - testing/pipelines/run-ws-regression.js  (stamps r.tcId at write time)
 *   - tools/generators/generate-ws-artifacts.js
 *   - tools/analysis/audit-ws-v2.js
 *   - tools/analysis/task-status.js            (fallback when r.tcId is absent)
 *
 * Format: `${action}-${config}-${tz}` with variant/format overrides:
 *   - format-only tests (WS-5):  `${action}-${config}-${format}`
 *   - variant tests   (WS-9):    `${action}-${config}-${variant}-${tz}`
 * Always lowercased to match matrix.md IDs (which are lowercased by the matrix parsers).
 */
function buildWsSlotId(r) {
    if (!r || !r.action || r.config == null) return null;
    const action = String(r.action).toLowerCase();
    const config = r.config;
    const tz = r.tz;
    if (r.format) return `${action}-${config}-${r.format}`.toLowerCase();
    if (r.variant) return `${action}-${config}-${r.variant}-${tz}`.toLowerCase();
    if (!tz) return null;
    return `${action}-${config}-${tz}`.toLowerCase();
}

module.exports = { buildWsSlotId };
