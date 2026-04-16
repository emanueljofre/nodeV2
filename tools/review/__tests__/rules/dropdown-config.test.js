/**
 * Unit tests for rules/dropdown-config.js
 *
 * Tests 3 rules: dropdown-width, query-not-default, data-lookup-in-properties
 */

const { buildContext, runRule, findingMatchers } = require('../helpers');

expect.extend(findingMatchers);

describe('dropdown-config rules', () => {
    // ------------------------------------------------------------------
    // dropdown-width
    // ------------------------------------------------------------------
    describe('dropdown-width', () => {
        it('flags dropdowns narrower than 100px', () => {
            const ctx = buildContext({
                fields: [{ name: 'Status', type: 'FieldDropDownList3', width: 80 }],
            });
            const findings = runRule('dropdown-width', ctx);
            expect(findings).toContainFindingMatch({ ruleId: 'dropdown-width', field: 'Status' });
            expect(findings[0].message).toContain('80px');
            expect(findings[0].message).toContain('100px');
        });

        it('passes for dropdowns at exactly 100px', () => {
            const ctx = buildContext({
                fields: [{ name: 'Status', type: 'FieldDropDownList3', width: 100 }],
            });
            expect(runRule('dropdown-width', ctx)).toEqual([]);
        });

        it('passes for dropdowns wider than 100px', () => {
            const ctx = buildContext({
                fields: [{ name: 'Status', type: 'FieldDropDownList3', width: 200 }],
            });
            expect(runRule('dropdown-width', ctx)).toEqual([]);
        });

        it('skips non-dropdown fields', () => {
            const ctx = buildContext({
                fields: [{ name: 'Small', type: 'FieldTextbox3', width: 50 }],
            });
            expect(runRule('dropdown-width', ctx)).toEqual([]);
        });

        it('skips dropdowns with zero width', () => {
            const ctx = buildContext({
                fields: [{ name: 'Status', type: 'FieldDropDownList3', width: 0 }],
            });
            expect(runRule('dropdown-width', ctx)).toEqual([]);
        });

        it('flags multiple narrow dropdowns', () => {
            const ctx = buildContext({
                fields: [
                    { name: 'A', type: 'FieldDropDownList3', width: 60 },
                    { name: 'B', type: 'FieldDropDownList3', width: 70 },
                ],
            });
            expect(runRule('dropdown-width', ctx)).toHaveFindingCount('dropdown-width', 2);
        });
    });

    // ------------------------------------------------------------------
    // query-not-default
    // ------------------------------------------------------------------
    describe('query-not-default', () => {
        it('flags dropdowns with EnableFormQuery=true', () => {
            const ctx = buildContext({
                fields: [
                    {
                        name: 'Status',
                        type: 'FieldDropDownList3',
                        _raw: { EnableFormQuery: 'true' },
                    },
                ],
            });
            const findings = runRule('query-not-default', ctx);
            expect(findings).toContainFindingMatch({ ruleId: 'query-not-default', field: 'Status' });
            expect(findings[0].message).toContain('auto-generated');
        });

        it('passes when EnableFormQuery is false', () => {
            const ctx = buildContext({
                fields: [
                    {
                        name: 'Status',
                        type: 'FieldDropDownList3',
                        _raw: { EnableFormQuery: 'false' },
                    },
                ],
            });
            expect(runRule('query-not-default', ctx)).toEqual([]);
        });

        it('passes when EnableFormQuery is not set', () => {
            const ctx = buildContext({
                fields: [
                    {
                        name: 'Status',
                        type: 'FieldDropDownList3',
                        _raw: {},
                    },
                ],
            });
            expect(runRule('query-not-default', ctx)).toEqual([]);
        });

        it('skips non-dropdown fields', () => {
            const ctx = buildContext({
                fields: [
                    {
                        name: 'Field',
                        type: 'FieldTextbox3',
                        _raw: { EnableFormQuery: 'true' },
                    },
                ],
            });
            expect(runRule('query-not-default', ctx)).toEqual([]);
        });

        it('handles boolean true (not just string)', () => {
            const ctx = buildContext({
                fields: [
                    {
                        name: 'Status',
                        type: 'FieldDropDownList3',
                        _raw: { EnableFormQuery: true },
                    },
                ],
            });
            const findings = runRule('query-not-default', ctx);
            expect(findings).toContainFindingMatch({ ruleId: 'query-not-default' });
        });
    });

    // ------------------------------------------------------------------
    // data-lookup-in-properties
    // ------------------------------------------------------------------
    describe('data-lookup-in-properties', () => {
        it('flags dropdown event scripts containing API calls', () => {
            const ctx = buildContext({
                fields: [
                    {
                        name: 'Status',
                        type: 'FieldDropDownList3',
                        id: 'dd1',
                    },
                ],
                scripts: [
                    {
                        id: 'script1',
                        name: 'Status_OnChange',
                        code: 'var result = $.ajax({ url: "/api/lookup" });',
                        type: 'ControlEventScriptItem',
                    },
                ],
                assignments: [
                    {
                        scriptId: 'script1',
                        controlId: 'dd1',
                        eventId: 'OnChange',
                    },
                ],
            });
            const findings = runRule('data-lookup-in-properties', ctx);
            expect(findings).toContainFindingMatch({ ruleId: 'data-lookup-in-properties', field: 'Status' });
            expect(findings[0].message).toContain('Status_OnChange');
        });

        it('flags scripts using fetch()', () => {
            const ctx = buildContext({
                fields: [{ name: 'Type', type: 'FieldDropDownList3', id: 'dd2' }],
                scripts: [
                    {
                        id: 's2',
                        name: 'TypeLookup',
                        code: 'fetch("/api/types").then(r => r.json());',
                        type: 'ControlEventScriptItem',
                    },
                ],
                assignments: [{ scriptId: 's2', controlId: 'dd2', eventId: 'OnChange' }],
            });
            expect(runRule('data-lookup-in-properties', ctx)).toContainFindingMatch({
                ruleId: 'data-lookup-in-properties',
            });
        });

        it('flags scripts using VV.Form.Template calls', () => {
            const ctx = buildContext({
                fields: [{ name: 'County', type: 'FieldDropDownList3', id: 'dd3' }],
                scripts: [
                    {
                        id: 's3',
                        name: 'CountyLookup',
                        code: 'VV.Form.Template.LookupCounty();',
                        type: 'ControlEventScriptItem',
                    },
                ],
                assignments: [{ scriptId: 's3', controlId: 'dd3', eventId: 'OnChange' }],
            });
            expect(runRule('data-lookup-in-properties', ctx)).toContainFindingMatch({
                ruleId: 'data-lookup-in-properties',
            });
        });

        it('passes for scripts without API calls', () => {
            const ctx = buildContext({
                fields: [{ name: 'Status', type: 'FieldDropDownList3', id: 'dd1' }],
                scripts: [
                    {
                        id: 's1',
                        name: 'StatusChange',
                        code: 'var val = VV.Form.GetFieldValue("Status"); if (val === "Active") { VV.Form.SetFieldValue("Color", "green"); }',
                        type: 'ControlEventScriptItem',
                    },
                ],
                assignments: [{ scriptId: 's1', controlId: 'dd1', eventId: 'OnChange' }],
            });
            expect(runRule('data-lookup-in-properties', ctx)).toEqual([]);
        });

        it('passes when dropdown has no assigned scripts', () => {
            const ctx = buildContext({
                fields: [{ name: 'Status', type: 'FieldDropDownList3', id: 'dd1' }],
                scripts: [],
                assignments: [],
            });
            expect(runRule('data-lookup-in-properties', ctx)).toEqual([]);
        });

        it('ignores scripts assigned to non-dropdown fields', () => {
            const ctx = buildContext({
                fields: [
                    { name: 'Status', type: 'FieldDropDownList3', id: 'dd1' },
                    { name: 'Name', type: 'FieldTextbox3', id: 'tb1' },
                ],
                scripts: [
                    { id: 's1', name: 'NameLookup', code: '$.ajax({ url: "/api" });', type: 'ControlEventScriptItem' },
                ],
                assignments: [{ scriptId: 's1', controlId: 'tb1', eventId: 'OnChange' }],
            });
            expect(runRule('data-lookup-in-properties', ctx)).toEqual([]);
        });

        it('returns no findings when template has no dropdowns', () => {
            const ctx = buildContext({
                fields: [{ name: 'Name', type: 'FieldTextbox3' }],
            });
            expect(runRule('data-lookup-in-properties', ctx)).toEqual([]);
        });

        it('handles empty script body', () => {
            const ctx = buildContext({
                fields: [{ name: 'Status', type: 'FieldDropDownList3', id: 'dd1' }],
                scripts: [{ id: 's1', name: 'Empty', code: '', type: 'ControlEventScriptItem' }],
                assignments: [{ scriptId: 's1', controlId: 'dd1', eventId: 'OnChange' }],
            });
            expect(runRule('data-lookup-in-properties', ctx)).toEqual([]);
        });
    });
});
