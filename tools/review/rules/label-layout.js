/**
 * Label layout rules (atomic)
 *
 * Exports 2 rules: label-truncation, label-wrap-textbox
 *
 * These complement layout.js (distance-to-border, label-overlap, button-min-size)
 * with checks focused on label text fitting within its rendered bounds.
 */

// Approximate average character width in pixels at 10pt sans-serif.
// Conservative estimate — actual rendering depends on font, browser, zoom.
const CHAR_WIDTH_10PT = 7;

// Font size → approximate char width multiplier (relative to 10pt baseline)
function estimateCharWidth(fontSize) {
    const size = Number(fontSize) || 10;
    return CHAR_WIDTH_10PT * (size / 10);
}

/**
 * Estimate whether a label's text fits within its declared width.
 * Returns the estimated text width in pixels, or 0 if no estimate possible.
 */
function estimateTextWidth(field) {
    const text = field.text || field._raw?.Text || '';
    if (!text.trim()) return 0;
    const fontSize = field._raw?.FontSize || 10;
    const charWidth = estimateCharWidth(fontSize);
    const isBold = String(field._raw?.Bold).toLowerCase() === 'true';
    const boldMultiplier = isBold ? 1.1 : 1.0;
    return Math.ceil(text.length * charWidth * boldMultiplier);
}

const LABEL_INPUT_TYPES = ['FieldTextbox3', 'FieldCalendar3', 'FieldDropDownList3'];

module.exports = [
    {
        id: 'label-truncation',
        name: 'Labels Should Not Be Truncated',
        component: 'form-templates',
        appliesTo: ['FieldLabel'],
        severity: 'warning',

        check(context) {
            const findings = [];

            for (const field of context.fields) {
                if (field.type !== 'FieldLabel') continue;

                const text = field.text || field._raw?.Text || '';
                if (!text.trim()) continue;

                const labelWrap = String(field._raw?.LabelWrap).toLowerCase() === 'true';
                if (labelWrap) continue; // Wrapping labels don't truncate

                const fieldWidth = field.width || Number(field._raw?.Width) || 0;
                if (fieldWidth === 0) continue;

                const estimatedWidth = estimateTextWidth(field);
                if (estimatedWidth === 0) continue;

                if (estimatedWidth > fieldWidth * 1.1) {
                    // Allow 10% tolerance for estimation error
                    findings.push({
                        ruleId: 'label-truncation',
                        severity: 'warning',
                        field: field.name,
                        page: field.pageName,
                        message: `Label text "${text}" (~${estimatedWidth}px) may be truncated in ${fieldWidth}px width — increase width or enable wrapping`,
                    });
                }
            }

            return findings;
        },
    },

    {
        id: 'label-wrap-textbox',
        name: 'Labels Should Not Wrap Next to Single-Line Textboxes',
        component: 'form-templates',
        appliesTo: ['FieldLabel'],
        severity: 'warning',

        check(context) {
            const findings = [];
            const ROW_TOLERANCE = 15; // Same as label-overlap

            for (const label of context.fields) {
                if (label.type !== 'FieldLabel') continue;

                const labelWrap = String(label._raw?.LabelWrap).toLowerCase() === 'true';
                if (!labelWrap) continue; // Non-wrapping labels don't have this issue

                const text = label.text || label._raw?.Text || '';
                if (!text.trim()) continue;

                const labelWidth = label.width || Number(label._raw?.Width) || 0;
                if (labelWidth === 0) continue;

                const estimatedWidth = estimateTextWidth(label);
                if (estimatedWidth <= labelWidth) continue; // Fits in one line — no wrap

                // Label text would wrap. Check if there's a single-line input to its right on the same row.
                const adjacentInput = context.fields.find((f) => {
                    if (!LABEL_INPUT_TYPES.includes(f.type)) return false;
                    if (f.pageIndex !== label.pageIndex) return false;
                    // Same row?
                    if (Math.abs(f.layoutTop - label.layoutTop) > ROW_TOLERANCE) return false;
                    // To the right of the label?
                    if (f.layoutLeft <= label.layoutLeft) return false;
                    return true;
                });

                if (adjacentInput) {
                    findings.push({
                        ruleId: 'label-wrap-textbox',
                        severity: 'warning',
                        field: label.name,
                        page: label.pageName,
                        message: `Label text "${text}" wraps at ${labelWidth}px width next to "${adjacentInput.name}" — widen label or shorten text`,
                    });
                }
            }

            return findings;
        },
    },
];
