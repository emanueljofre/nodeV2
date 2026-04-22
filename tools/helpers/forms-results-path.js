/**
 * Single source of truth for resolving where forms-calendar regression
 * artifacts land.
 *
 * Consumed by:
 *   - testing/pipelines/run-regression.js  (writes results JSON)
 *   - tools/generators/generate-artifacts.js (reads results JSON; writes
 *     per-run artifacts — runs/, summaries/, results.md — alongside it)
 *
 * Routes observed execution data to the active customer's project folder
 * (personal/env-bound). Falls back to testing/tmp/ when no projects/{customer}/
 * exists, so the pipeline still works on fresh checkouts. Shared platform
 * truth — matrix.md, analysis/, test-cases/ — stays in research/.
 */
const fs = require('fs');
const path = require('path');
const { vvConfig } = require('../../testing/fixtures/vv-config');

const REPO_ROOT = path.resolve(__dirname, '..', '..');

/**
 * Directory that should hold all per-customer forms-calendar execution
 * artifacts (regression JSON, runs/, summaries/, results.md). Falls back
 * to testing/tmp/ when no project folder exists.
 *
 * @param {object} [opts]
 * @param {string} [opts.projectSlug] explicit project slug (CLI override);
 *   takes precedence over vvConfig-derived slug.
 */
function resolveArtifactsDir(opts = {}) {
    const explicitSlug = opts.projectSlug ? String(opts.projectSlug).toLowerCase() : null;
    const customerKey = vvConfig.customerKey || vvConfig.customerAlias;
    const configSlug = customerKey ? customerKey.toLowerCase() : null;
    const projectSlug = explicitSlug || configSlug;
    const projectDir = projectSlug ? path.join(REPO_ROOT, 'projects', projectSlug) : null;
    if (projectDir && fs.existsSync(projectDir)) {
        return path.join(projectDir, 'testing', 'date-handling', 'forms-calendar');
    }
    return path.join(REPO_ROOT, 'testing', 'tmp');
}

/**
 * Directory that holds the pipeline-stamped regression results JSON.
 * Lives one level up from the forms-calendar artifacts dir — per project
 * convention, `projects/{customer}/testing/date-handling/` holds the
 * Phase-1 JSON (regression-results-latest.json) and per-task subfolders
 * (forms-calendar/, web-services/, dashboards/, ...) hold Phase-2 outputs.
 */
function resolveResultsPath(opts = {}) {
    const artifactsDir = resolveArtifactsDir(opts);
    // Results JSON sits one level above the forms-calendar subdir when a
    // project folder exists (date-handling/regression-results-latest.json).
    // In the testing/tmp/ fallback it sits alongside (testing/tmp/regression-results-latest.json).
    const tmpFallback = path.join(REPO_ROOT, 'testing', 'tmp');
    if (artifactsDir === tmpFallback) {
        return path.join(tmpFallback, 'regression-results-latest.json');
    }
    return path.join(path.dirname(artifactsDir), 'regression-results-latest.json');
}

module.exports = { resolveArtifactsDir, resolveResultsPath };
