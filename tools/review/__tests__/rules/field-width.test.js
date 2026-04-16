/**
 * Unit tests for rules/field-width.js
 *
 * Tests 1 rule: field-width-standard
 */

const { buildContext, runRule, findingMatchers } = require('../helpers');

expect.extend(findingMatchers);

describe('field-width rules', () => {
    describe('field-width-standard', () => {
        // --- Name-based pattern matching ---
        it('flags name fields narrower than 150px', () => {
            const ctx = buildContext({
                fields: [{ name: 'First Name', type: 'FieldTextbox3', width: 100 }],
            });
            const findings = runRule('field-width-standard', ctx);
            expect(findings).toContainFindingMatch({ ruleId: 'field-width-standard', field: 'First Name' });
            expect(findings[0].message).toContain('150px');
        });

        it('passes name fields at 150px or wider', () => {
            const ctx = buildContext({
                fields: [{ name: 'Last Name', type: 'FieldTextbox3', width: 150 }],
            });
            expect(runRule('field-width-standard', ctx)).toEqual([]);
        });

        it('flags address fields narrower than 250px', () => {
            const ctx = buildContext({
                fields: [{ name: 'Street Address', type: 'FieldTextbox3', width: 200 }],
            });
            const findings = runRule('field-width-standard', ctx);
            expect(findings).toContainFindingMatch({ field: 'Street Address' });
            expect(findings[0].message).toContain('250px');
        });

        it('flags email fields narrower than 200px', () => {
            const ctx = buildContext({
                fields: [{ name: 'Email', type: 'FieldTextbox3', width: 120 }],
            });
            const findings = runRule('field-width-standard', ctx);
            expect(findings).toContainFindingMatch({ field: 'Email' });
            expect(findings[0].message).toContain('200px');
        });

        it('flags phone fields narrower than 120px', () => {
            const ctx = buildContext({
                fields: [{ name: 'Phone', type: 'FieldTextbox3', width: 80 }],
            });
            const findings = runRule('field-width-standard', ctx);
            expect(findings).toContainFindingMatch({ field: 'Phone' });
            expect(findings[0].message).toContain('120px');
        });

        it('flags notes/comments fields narrower than 300px', () => {
            const ctx = buildContext({
                fields: [{ name: 'Comments', type: 'FieldTextbox3', width: 200 }],
            });
            const findings = runRule('field-width-standard', ctx);
            expect(findings).toContainFindingMatch({ field: 'Comments' });
        });

        // --- Type-level minimums ---
        it('flags textbox narrower than 80px (type minimum)', () => {
            const ctx = buildContext({
                fields: [{ name: 'Code', type: 'FieldTextbox3', width: 50 }],
            });
            const findings = runRule('field-width-standard', ctx);
            expect(findings).toContainFindingMatch({ field: 'Code' });
            expect(findings[0].message).toContain('80px');
        });

        it('flags textarea narrower than 200px', () => {
            const ctx = buildContext({
                fields: [{ name: 'Bio', type: 'FieldTextArea3', width: 150 }],
            });
            const findings = runRule('field-width-standard', ctx);
            expect(findings).toContainFindingMatch({ field: 'Bio' });
            expect(findings[0].message).toContain('200px');
        });

        it('flags calendar narrower than 120px', () => {
            const ctx = buildContext({
                fields: [{ name: 'Due Date', type: 'FieldCalendar3', width: 90 }],
            });
            const findings = runRule('field-width-standard', ctx);
            expect(findings).toContainFindingMatch({ field: 'Due Date' });
            expect(findings[0].message).toContain('120px');
        });

        it('flags dropdown narrower than 100px (type minimum)', () => {
            const ctx = buildContext({
                fields: [{ name: 'Type', type: 'FieldDropDownList3', width: 80 }],
            });
            const findings = runRule('field-width-standard', ctx);
            expect(findings).toContainFindingMatch({ field: 'Type' });
        });

        // --- Pass cases ---
        it('passes fields meeting type minimum', () => {
            const ctx = buildContext({
                fields: [
                    { name: 'Code', type: 'FieldTextbox3', width: 100 },
                    { name: 'Bio', type: 'FieldTextArea3', width: 300 },
                    { name: 'Due Date', type: 'FieldCalendar3', width: 150 },
                ],
            });
            expect(runRule('field-width-standard', ctx)).toEqual([]);
        });

        // --- Skip cases ---
        it('skips default names', () => {
            const ctx = buildContext({
                fields: [{ name: 'DataField1', type: 'FieldTextbox3', width: 30 }],
            });
            expect(runRule('field-width-standard', ctx)).toEqual([]);
        });

        it('skips fields with zero width', () => {
            const ctx = buildContext({
                fields: [{ name: 'First Name', type: 'FieldTextbox3', width: 0 }],
            });
            expect(runRule('field-width-standard', ctx)).toEqual([]);
        });

        it('skips empty-named fields', () => {
            const ctx = buildContext({
                fields: [{ name: '', type: 'FieldTextbox3', width: 30 }],
            });
            expect(runRule('field-width-standard', ctx)).toEqual([]);
        });

        it('skips non-applicable field types', () => {
            const ctx = buildContext({
                fields: [
                    { name: 'My Label', type: 'FieldLabel', width: 10 },
                    { name: 'Box', type: 'FieldContainer', width: 10 },
                ],
            });
            expect(runRule('field-width-standard', ctx)).toEqual([]);
        });

        it('name pattern takes priority over type minimum', () => {
            // "Address" matches address pattern (min 250px), not type minimum (80px)
            const ctx = buildContext({
                fields: [{ name: 'Address', type: 'FieldTextbox3', width: 100 }],
            });
            const findings = runRule('field-width-standard', ctx);
            expect(findings[0].message).toContain('250px');
        });
    });
});
