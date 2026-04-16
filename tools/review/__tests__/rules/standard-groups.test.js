/**
 * Unit tests for rules/standard-groups.js
 *
 * Tests 2 rules: standard-hidden-group, standard-readonly-group
 */

const { buildContext, runRule, findingMatchers } = require('../helpers');

expect.extend(findingMatchers);

// Helper: build a context with Admin Override checkbox and configurable groups
function buildAdminContext({ groups = [], extraFields = [] } = {}) {
    return buildContext({
        fields: [
            {
                name: 'Admin Override Container',
                type: 'FieldContainer',
                id: 'container-admin',
            },
            {
                name: 'Admin Override',
                type: 'FieldCheckbox',
                id: 'chk-admin-override',
                containerId: 'container-admin',
            },
            ...extraFields,
        ],
        groups,
    });
}

describe('standard-groups rules', () => {
    // ------------------------------------------------------------------
    // standard-hidden-group
    // ------------------------------------------------------------------
    describe('standard-hidden-group', () => {
        it('passes when a group has visibility condition referencing Admin Override', () => {
            const ctx = buildAdminContext({
                groups: [
                    {
                        name: 'Hidden Fields',
                        fieldMembers: [{ fieldId: 'some-field', fieldType: 'FieldTextbox3' }],
                        formControlMembers: [],
                        conditions: {
                            ConditionBase: {
                                FieldValue1: { FieldID: 'chk-admin-override' },
                                FieldValue2: { ParentType: 'Value', Value: 'True' },
                                Outcome: 'IsVisible',
                            },
                        },
                        readOnlyConditions: null,
                        securityMembers: null,
                        _raw: {},
                    },
                ],
            });
            const findings = runRule('standard-hidden-group', ctx);
            expect(findings).toEqual([]);
        });

        it('flags when no group has visibility condition referencing Admin Override', () => {
            const ctx = buildAdminContext({
                groups: [
                    {
                        name: 'Some Other Group',
                        fieldMembers: [],
                        formControlMembers: [],
                        conditions: {
                            ConditionBase: {
                                FieldValue1: { FieldID: 'unrelated-field' },
                                Outcome: 'IsVisible',
                            },
                        },
                        readOnlyConditions: null,
                        securityMembers: null,
                        _raw: {},
                    },
                ],
            });
            const findings = runRule('standard-hidden-group', ctx);
            expect(findings).toContainFindingMatch({ ruleId: 'standard-hidden-group' });
        });

        it('flags when template has no groups at all', () => {
            const ctx = buildAdminContext({ groups: [] });
            const findings = runRule('standard-hidden-group', ctx);
            expect(findings).toContainFindingMatch({ ruleId: 'standard-hidden-group' });
        });

        it('skips check when no Admin Override checkbox exists', () => {
            const ctx = buildContext({
                fields: [{ name: 'First Name', type: 'FieldTextbox3' }],
                groups: [],
            });
            const findings = runRule('standard-hidden-group', ctx);
            expect(findings).toEqual([]);
        });

        it('handles array of conditions', () => {
            const ctx = buildAdminContext({
                groups: [
                    {
                        name: 'Hidden Fields',
                        fieldMembers: [],
                        formControlMembers: [],
                        conditions: {
                            ConditionBase: [
                                { FieldValue1: { FieldID: 'other-field' }, Outcome: 'IsVisible' },
                                { FieldValue1: { FieldID: 'chk-admin-override' }, Outcome: 'IsVisible' },
                            ],
                        },
                        readOnlyConditions: null,
                        securityMembers: null,
                        _raw: {},
                    },
                ],
            });
            const findings = runRule('standard-hidden-group', ctx);
            expect(findings).toEqual([]);
        });

        it('handles null ConditionBase gracefully', () => {
            const ctx = buildAdminContext({
                groups: [
                    {
                        name: 'Empty Group',
                        fieldMembers: [],
                        formControlMembers: [],
                        conditions: { ConditionBase: null },
                        readOnlyConditions: null,
                        securityMembers: null,
                        _raw: {},
                    },
                ],
            });
            const findings = runRule('standard-hidden-group', ctx);
            expect(findings).toContainFindingMatch({ ruleId: 'standard-hidden-group' });
        });
    });

    // ------------------------------------------------------------------
    // standard-readonly-group
    // ------------------------------------------------------------------
    describe('standard-readonly-group', () => {
        it('passes when a group has read-only condition referencing Admin Override', () => {
            const ctx = buildAdminContext({
                groups: [
                    {
                        name: 'Read-Only Fields',
                        fieldMembers: [{ fieldId: 'some-field', fieldType: 'FieldTextbox3' }],
                        formControlMembers: [],
                        conditions: null,
                        readOnlyConditions: {
                            ConditionBase: {
                                FieldValue1: { FieldID: 'chk-admin-override' },
                                FieldValue2: { ParentType: 'Value', Value: 'False' },
                                Outcome: 'IsReadOnly',
                            },
                        },
                        securityMembers: null,
                        _raw: {},
                    },
                ],
            });
            const findings = runRule('standard-readonly-group', ctx);
            expect(findings).toEqual([]);
        });

        it('flags when no group has read-only condition referencing Admin Override', () => {
            const ctx = buildAdminContext({
                groups: [
                    {
                        name: 'Some Group',
                        fieldMembers: [],
                        formControlMembers: [],
                        conditions: null,
                        readOnlyConditions: {
                            ConditionBase: {
                                FieldValue1: { FieldID: 'unrelated-field' },
                                Outcome: 'IsReadOnly',
                            },
                        },
                        securityMembers: null,
                        _raw: {},
                    },
                ],
            });
            const findings = runRule('standard-readonly-group', ctx);
            expect(findings).toContainFindingMatch({ ruleId: 'standard-readonly-group' });
        });

        it('flags when template has no groups at all', () => {
            const ctx = buildAdminContext({ groups: [] });
            const findings = runRule('standard-readonly-group', ctx);
            expect(findings).toContainFindingMatch({ ruleId: 'standard-readonly-group' });
        });

        it('skips check when no Admin Override checkbox exists', () => {
            const ctx = buildContext({
                fields: [{ name: 'First Name', type: 'FieldTextbox3' }],
                groups: [],
            });
            const findings = runRule('standard-readonly-group', ctx);
            expect(findings).toEqual([]);
        });

        it('handles array of read-only conditions', () => {
            const ctx = buildAdminContext({
                groups: [
                    {
                        name: 'RO Group',
                        fieldMembers: [],
                        formControlMembers: [],
                        conditions: null,
                        readOnlyConditions: {
                            ConditionBase: [
                                { FieldValue1: { FieldID: 'other-field' }, Outcome: 'IsReadOnly' },
                                { FieldValue1: { FieldID: 'chk-admin-override' }, Outcome: 'IsReadOnly' },
                            ],
                        },
                        securityMembers: null,
                        _raw: {},
                    },
                ],
            });
            const findings = runRule('standard-readonly-group', ctx);
            expect(findings).toEqual([]);
        });

        it('does NOT match visibility conditions — only read-only conditions', () => {
            const ctx = buildAdminContext({
                groups: [
                    {
                        name: 'Visibility Group',
                        fieldMembers: [],
                        formControlMembers: [],
                        conditions: {
                            ConditionBase: {
                                FieldValue1: { FieldID: 'chk-admin-override' },
                                Outcome: 'IsVisible',
                            },
                        },
                        readOnlyConditions: null,
                        securityMembers: null,
                        _raw: {},
                    },
                ],
            });
            const findings = runRule('standard-readonly-group', ctx);
            expect(findings).toContainFindingMatch({ ruleId: 'standard-readonly-group' });
        });
    });
});
