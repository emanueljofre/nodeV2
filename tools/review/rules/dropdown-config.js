/**
 * Drop-down configuration rules (atomic)
 *
 * Exports 3 rules: dropdown-width, query-not-default, data-lookup-in-properties
 */

const MIN_DROPDOWN_WIDTH = 100;

function toBool(val) {
    if (typeof val === 'boolean') return val;
    if (typeof val === 'string') return val.toLowerCase() === 'true';
    return false;
}

module.exports = [
    {
        id: 'dropdown-width',
        name: 'Drop-Down Fields Must Have Appropriate Width',
        component: 'form-templates',
        appliesTo: ['FieldDropDownList3'],
        severity: 'warning',

        check(context) {
            const findings = [];

            for (const field of context.fields) {
                if (field.type !== 'FieldDropDownList3') continue;

                const width = field.width || Number(field._raw?.Width) || 0;
                if (width > 0 && width < MIN_DROPDOWN_WIDTH) {
                    findings.push({
                        ruleId: 'dropdown-width',
                        severity: 'warning',
                        field: field.name,
                        page: field.pageName,
                        message: `Drop-down width is ${width}px — minimum recommended is ${MIN_DROPDOWN_WIDTH}px`,
                    });
                }
            }

            return findings;
        },
    },

    {
        id: 'query-not-default',
        name: 'Drop-Downs Must Not Use Auto-Generated Form Query',
        component: 'form-templates',
        appliesTo: ['FieldDropDownList3'],
        severity: 'warning',

        check(context) {
            const findings = [];

            for (const field of context.fields) {
                if (field.type !== 'FieldDropDownList3') continue;

                const enableFormQuery = toBool(field._raw?.EnableFormQuery);
                if (enableFormQuery) {
                    findings.push({
                        ruleId: 'query-not-default',
                        severity: 'warning',
                        field: field.name,
                        page: field.pageName,
                        message:
                            'Drop-down uses the auto-generated VisualVault form query — create a dedicated custom query instead',
                    });
                }
            }

            return findings;
        },
    },

    {
        id: 'data-lookup-in-properties',
        name: 'Data Lookups Should Use Properties Panel, Not Event Scripts',
        component: 'form-templates',
        appliesTo: 'template',
        severity: 'info',

        check(context) {
            const findings = [];

            // Build a set of FieldDropDownList3 field IDs
            const dropdownIds = new Set();
            const dropdownNameById = new Map();
            for (const field of context.fields) {
                if (field.type === 'FieldDropDownList3') {
                    dropdownIds.add(field.id);
                    dropdownNameById.set(field.id, field.name);
                }
            }

            if (dropdownIds.size === 0) return findings;

            // Find script assignments targeting dropdown fields
            const dropdownScriptIds = new Set();
            const scriptToDropdown = new Map();
            for (const assign of context.assignments) {
                if (dropdownIds.has(assign.controlId)) {
                    dropdownScriptIds.add(assign.scriptId);
                    scriptToDropdown.set(assign.scriptId, assign.controlId);
                }
            }

            if (dropdownScriptIds.size === 0) return findings;

            // Check if any of those scripts contain server-side API call patterns
            const apiPatterns = [
                /\$\.ajax/,
                /\bfetch\s*\(/,
                /XMLHttpRequest/,
                /vvClient\./,
                /VV\.Form\.Template\./,
                /\.getCustomQuery/i,
                /\.getForms/i,
                /\.postFormData/i,
            ];

            for (const script of context.scripts) {
                if (!dropdownScriptIds.has(script.id)) continue;
                const code = script.code || '';
                if (!code.trim()) continue;

                const hasApiCall = apiPatterns.some((p) => p.test(code));
                if (hasApiCall) {
                    const dropdownId = scriptToDropdown.get(script.id);
                    const dropdownName = dropdownNameById.get(dropdownId) || dropdownId;
                    findings.push({
                        ruleId: 'data-lookup-in-properties',
                        severity: 'info',
                        field: dropdownName,
                        page: '—',
                        message: `Script "${script.name}" on drop-down contains API calls — prefer configuring data lookups in the properties panel`,
                    });
                }
            }

            return findings;
        },
    },
];
