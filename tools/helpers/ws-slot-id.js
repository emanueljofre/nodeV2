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
 *   - format-only tests   (WS-5):      `${action}-${config}-${format}`
 *   - variant + TZ        (WS-9):      `${action}-${config}-${variant}-${tz}`
 *   - variant, TZ-agnostic (WS-6/7/8): `${action}-${config}-${variant}`
 * Always lowercased to match matrix.md IDs (which are lowercased by the matrix parsers).
 */

// Actions whose variant identity includes a TZ axis in the matrix IDs.
// WS-9 tests TZ-sensitive script date arithmetic per variant, so the matrix
// enumerates a (variant, tz) grid. All other variant-based actions are
// TZ-agnostic in the matrix (one row per variant).
const VARIANT_WITH_TZ_ACTIONS = new Set(['WS-9']);

function buildWsSlotId(r) {
    if (!r || !r.action || r.config == null) return null;
    const actionRaw = String(r.action);
    const action = actionRaw.toLowerCase();
    const config = r.config;
    const tz = r.tz;
    if (r.format) return `${action}-${config}-${r.format}`.toLowerCase();
    if (r.variant) {
        if (VARIANT_WITH_TZ_ACTIONS.has(actionRaw.toUpperCase())) {
            if (!tz) return null;
            return `${action}-${config}-${r.variant}-${tz}`.toLowerCase();
        }
        return `${action}-${config}-${r.variant}`.toLowerCase();
    }
    if (!tz) return null;
    return `${action}-${config}-${tz}`.toLowerCase();
}

module.exports = { buildWsSlotId };
