/**
 * Field width rules (atomic)
 *
 * Exports 1 rule: field-width-standard
 *
 * Checks that fields have appropriate widths for the type of content
 * they capture, based on field name heuristics.
 */

// Name patterns → minimum width recommendations (in pixels)
const WIDTH_RULES = [
    { pattern: /\b(first|last|middle|maiden)\s*name\b/i, minWidth: 150, label: 'name field' },
    { pattern: /\bname\b/i, minWidth: 150, label: 'name field' },
    { pattern: /\b(street|mailing|physical|billing|shipping)\s*address\b/i, minWidth: 250, label: 'address field' },
    { pattern: /\baddress\b/i, minWidth: 250, label: 'address field' },
    { pattern: /\b(email|e-mail)\b/i, minWidth: 200, label: 'email field' },
    { pattern: /\bphone\b/i, minWidth: 120, label: 'phone field' },
    { pattern: /\b(notes|comments|description|remarks|narrative|explanation)\b/i, minWidth: 300, label: 'notes field' },
];

// Per-type minimum widths when no name pattern matches
const TYPE_MINIMUMS = {
    FieldTextbox3: 80,
    FieldTextArea3: 200,
    FieldCalendar3: 120,
    FieldDropDownList3: 100, // Also checked by dropdown-width, but this catches all types
};

const APPLICABLE_TYPES = Object.keys(TYPE_MINIMUMS);

module.exports = [
    {
        id: 'field-width-standard',
        name: 'Field Width Appropriate for Content',
        component: 'form-templates',
        appliesTo: APPLICABLE_TYPES,
        severity: 'info',

        check(context) {
            const findings = [];

            for (const field of context.fields) {
                if (!APPLICABLE_TYPES.includes(field.type)) continue;

                const width = field.width || Number(field._raw?.Width) || 0;
                if (width === 0) continue; // No width set — can't evaluate

                const name = field.name || '';
                if (!name.trim()) continue;

                // Skip default names
                if (/^DataField\d+$/.test(name)) continue;

                // Check name-based patterns first
                let matched = false;
                for (const rule of WIDTH_RULES) {
                    if (rule.pattern.test(name)) {
                        matched = true;
                        if (width < rule.minWidth) {
                            findings.push({
                                ruleId: 'field-width-standard',
                                severity: 'info',
                                field: name,
                                page: field.pageName,
                                message: `${rule.label} width is ${width}px — recommended minimum is ${rule.minWidth}px`,
                            });
                        }
                        break;
                    }
                }

                // If no pattern matched, check type-level minimum
                if (!matched) {
                    const typeMin = TYPE_MINIMUMS[field.type];
                    if (typeMin && width < typeMin) {
                        findings.push({
                            ruleId: 'field-width-standard',
                            severity: 'info',
                            field: name,
                            page: field.pageName,
                            message: `${field.type} width is ${width}px — recommended minimum is ${typeMin}px`,
                        });
                    }
                }
            }

            return findings;
        },
    },
];
