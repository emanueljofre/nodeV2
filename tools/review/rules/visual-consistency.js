/**
 * Visual consistency rules (atomic)
 *
 * Exports 1 rule: font-consistency
 *
 * Checks that fonts, heading colors, and bolding are uniformly used
 * throughout the form.
 */

const LABEL_TYPE = 'FieldLabel';

module.exports = [
    {
        id: 'font-consistency',
        name: 'Fonts and Styles Must Be Consistent',
        component: 'form-templates',
        appliesTo: ['FieldLabel'],
        severity: 'info',

        check(context) {
            const findings = [];

            // Collect style properties from all labels
            const labels = context.fields.filter((f) => f.type === LABEL_TYPE);
            if (labels.length < 2) return findings;

            // Group labels by bold status and font size to find the dominant style
            const styleGroups = new Map(); // "fontSize|bold" → count
            const labelStyles = [];

            for (const label of labels) {
                const fontSize = Number(label._raw?.FontSize || 10);
                const bold = String(label._raw?.Bold).toLowerCase() === 'true';
                const color = label._raw?.ForegroundColorString || '';
                const key = `${fontSize}|${bold}|${color}`;

                if (!styleGroups.has(key)) styleGroups.set(key, 0);
                styleGroups.set(key, styleGroups.get(key) + 1);
                labelStyles.push({ label, fontSize, bold, color, key });
            }

            if (styleGroups.size <= 1) return findings; // All uniform

            // Find dominant style (most common combination)
            let dominantKey = '';
            let dominantCount = 0;
            for (const [key, count] of styleGroups) {
                if (count > dominantCount) {
                    dominantKey = key;
                    dominantCount = count;
                }
            }

            // Allow two styles: one for headings (bold/large) and one for regular labels.
            // Flag labels that don't match either common pattern.
            const sortedGroups = [...styleGroups.entries()].sort((a, b) => b[1] - a[1]);
            const allowedKeys = new Set();
            // Allow top 2 most common styles (regular + heading)
            allowedKeys.add(sortedGroups[0][0]);
            if (sortedGroups.length > 1) allowedKeys.add(sortedGroups[1][0]);

            for (const { label, fontSize, bold, color, key } of labelStyles) {
                if (allowedKeys.has(key)) continue;

                const parts = [];
                const [domSize, domBold, domColor] = dominantKey.split('|');
                if (String(fontSize) !== domSize) parts.push(`fontSize=${fontSize} (expected ${domSize})`);
                if (String(bold) !== domBold) parts.push(`bold=${bold} (expected ${domBold})`);
                if (color && domColor && color !== domColor) parts.push(`color=${color} (expected ${domColor})`);

                if (parts.length > 0) {
                    findings.push({
                        ruleId: 'font-consistency',
                        severity: 'info',
                        field: label.name,
                        page: label.pageName,
                        message: `Label style differs from form pattern: ${parts.join(', ')}`,
                    });
                }
            }

            return findings;
        },
    },
];
