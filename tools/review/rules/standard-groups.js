/**
 * Standard group structure rules (atomic)
 *
 * Exports 2 rules: standard-hidden-group, standard-readonly-group
 *
 * Every template should have three standard groups:
 *   1. Admin — VaultAccess-only visibility (checked by admin-override.js)
 *   2. Hidden Fields — "Is Visible" condition when Admin Override = true
 *   3. Read-Only Fields — "Is ReadOnly" condition when Admin Override = false
 */

/**
 * Find the Admin Override checkbox field in the template.
 */
function findAdminOverrideField(context) {
    return context.fields.find((f) => f.type === 'FieldCheckbox' && /admin\s*override/i.test(f.name));
}

/**
 * Check if a condition collection references a specific field ID.
 */
function conditionReferencesField(conditionCollection, fieldId) {
    if (!conditionCollection) return false;
    const bases = conditionCollection.ConditionBase;
    if (!bases) return false;
    const list = Array.isArray(bases) ? bases : [bases];
    return list.some((cond) => cond?.FieldValue1?.FieldID === fieldId);
}

module.exports = [
    {
        id: 'standard-hidden-group',
        name: 'Template Must Have Hidden Fields Group',
        component: 'form-templates',
        appliesTo: 'template',
        severity: 'warning',

        check(context) {
            const findings = [];
            const overrideField = findAdminOverrideField(context);

            if (!overrideField) return findings; // No Admin Override — handled by admin-override-container

            // Look for a group whose visibility condition references the Admin Override field.
            // The standard pattern: "Is Visible" when Admin Override equals true — meaning
            // hidden fields become visible only when admin override is active.
            const hasHiddenGroup = context.groups.some((g) => {
                return conditionReferencesField(g.conditions, overrideField.id);
            });

            if (!hasHiddenGroup) {
                findings.push({
                    ruleId: 'standard-hidden-group',
                    severity: 'warning',
                    field: '—',
                    page: '—',
                    message:
                        'Template does not have a Hidden Fields group — expected a group with visibility condition referencing Admin Override',
                });
            }

            return findings;
        },
    },

    {
        id: 'standard-readonly-group',
        name: 'Template Must Have Read-Only Fields Group',
        component: 'form-templates',
        appliesTo: 'template',
        severity: 'warning',

        check(context) {
            const findings = [];
            const overrideField = findAdminOverrideField(context);

            if (!overrideField) return findings; // No Admin Override — handled by admin-override-container

            // Look for a group whose read-only condition references the Admin Override field.
            // The standard pattern: "Is ReadOnly" when Admin Override equals false — meaning
            // fields are read-only by default, editable when admin override is active.
            const hasReadOnlyGroup = context.groups.some((g) => {
                return conditionReferencesField(g.readOnlyConditions, overrideField.id);
            });

            if (!hasReadOnlyGroup) {
                findings.push({
                    ruleId: 'standard-readonly-group',
                    severity: 'warning',
                    field: '—',
                    page: '—',
                    message:
                        'Template does not have a Read-Only Fields group — expected a group with read-only condition referencing Admin Override',
                });
            }

            return findings;
        },
    },
];
