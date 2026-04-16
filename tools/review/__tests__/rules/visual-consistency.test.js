/**
 * Unit tests for rules/visual-consistency.js
 *
 * Tests 1 rule: font-consistency
 */

const { buildContext, runRule, findingMatchers } = require('../helpers');

expect.extend(findingMatchers);

describe('visual-consistency rules', () => {
    describe('font-consistency', () => {
        it('passes when all labels have the same style', () => {
            const ctx = buildContext({
                fields: [
                    {
                        name: 'lbl A',
                        type: 'FieldLabel',
                        _raw: { FontSize: 10, Bold: 'false', ForegroundColorString: '#FF000000' },
                    },
                    {
                        name: 'lbl B',
                        type: 'FieldLabel',
                        _raw: { FontSize: 10, Bold: 'false', ForegroundColorString: '#FF000000' },
                    },
                    {
                        name: 'lbl C',
                        type: 'FieldLabel',
                        _raw: { FontSize: 10, Bold: 'false', ForegroundColorString: '#FF000000' },
                    },
                ],
            });
            const findings = runRule('font-consistency', ctx);
            expect(findings).toEqual([]);
        });

        it('allows two styles (regular + heading)', () => {
            const ctx = buildContext({
                fields: [
                    // 3 regular labels
                    {
                        name: 'lbl A',
                        type: 'FieldLabel',
                        _raw: { FontSize: 10, Bold: 'false', ForegroundColorString: '#FF000000' },
                    },
                    {
                        name: 'lbl B',
                        type: 'FieldLabel',
                        _raw: { FontSize: 10, Bold: 'false', ForegroundColorString: '#FF000000' },
                    },
                    {
                        name: 'lbl C',
                        type: 'FieldLabel',
                        _raw: { FontSize: 10, Bold: 'false', ForegroundColorString: '#FF000000' },
                    },
                    // 2 heading labels
                    {
                        name: 'lbl H1',
                        type: 'FieldLabel',
                        _raw: { FontSize: 18, Bold: 'true', ForegroundColorString: '#FF000000' },
                    },
                    {
                        name: 'lbl H2',
                        type: 'FieldLabel',
                        _raw: { FontSize: 18, Bold: 'true', ForegroundColorString: '#FF000000' },
                    },
                ],
            });
            const findings = runRule('font-consistency', ctx);
            expect(findings).toEqual([]);
        });

        it('flags labels with a third unique style', () => {
            const ctx = buildContext({
                fields: [
                    // 3 regular labels (dominant)
                    {
                        name: 'lbl A',
                        type: 'FieldLabel',
                        _raw: { FontSize: 10, Bold: 'false', ForegroundColorString: '#FF000000' },
                    },
                    {
                        name: 'lbl B',
                        type: 'FieldLabel',
                        _raw: { FontSize: 10, Bold: 'false', ForegroundColorString: '#FF000000' },
                    },
                    {
                        name: 'lbl C',
                        type: 'FieldLabel',
                        _raw: { FontSize: 10, Bold: 'false', ForegroundColorString: '#FF000000' },
                    },
                    // 2 heading labels (second style)
                    {
                        name: 'lbl H1',
                        type: 'FieldLabel',
                        _raw: { FontSize: 18, Bold: 'true', ForegroundColorString: '#FF000000' },
                    },
                    {
                        name: 'lbl H2',
                        type: 'FieldLabel',
                        _raw: { FontSize: 18, Bold: 'true', ForegroundColorString: '#FF000000' },
                    },
                    // 1 outlier — different size AND bold
                    {
                        name: 'lbl Odd',
                        type: 'FieldLabel',
                        _raw: { FontSize: 14, Bold: 'true', ForegroundColorString: '#FFFF0000' },
                    },
                ],
            });
            const findings = runRule('font-consistency', ctx);
            expect(findings).toContainFindingMatch({ ruleId: 'font-consistency', field: 'lbl Odd' });
        });

        it('flags labels with inconsistent color', () => {
            const ctx = buildContext({
                fields: [
                    {
                        name: 'lbl A',
                        type: 'FieldLabel',
                        _raw: { FontSize: 10, Bold: 'false', ForegroundColorString: '#FF000000' },
                    },
                    {
                        name: 'lbl B',
                        type: 'FieldLabel',
                        _raw: { FontSize: 10, Bold: 'false', ForegroundColorString: '#FF000000' },
                    },
                    {
                        name: 'lbl C',
                        type: 'FieldLabel',
                        _raw: { FontSize: 10, Bold: 'false', ForegroundColorString: '#FF000000' },
                    },
                    // Same size/bold but different color (3rd style)
                    {
                        name: 'lbl Red',
                        type: 'FieldLabel',
                        _raw: { FontSize: 10, Bold: 'false', ForegroundColorString: '#FFFF0000' },
                    },
                    // Another heading style (2nd)
                    {
                        name: 'lbl H',
                        type: 'FieldLabel',
                        _raw: { FontSize: 18, Bold: 'true', ForegroundColorString: '#FF000000' },
                    },
                    {
                        name: 'lbl H2',
                        type: 'FieldLabel',
                        _raw: { FontSize: 18, Bold: 'true', ForegroundColorString: '#FF000000' },
                    },
                ],
            });
            const findings = runRule('font-consistency', ctx);
            expect(findings).toContainFindingMatch({ ruleId: 'font-consistency', field: 'lbl Red' });
        });

        it('skips non-label fields', () => {
            const ctx = buildContext({
                fields: [
                    { name: 'Field A', type: 'FieldTextbox3', _raw: { FontSize: 10, Bold: 'false' } },
                    { name: 'Field B', type: 'FieldTextbox3', _raw: { FontSize: 14, Bold: 'true' } },
                ],
            });
            const findings = runRule('font-consistency', ctx);
            expect(findings).toEqual([]);
        });

        it('returns no findings when fewer than 2 labels', () => {
            const ctx = buildContext({
                fields: [{ name: 'lbl Only', type: 'FieldLabel', _raw: { FontSize: 10, Bold: 'false' } }],
            });
            const findings = runRule('font-consistency', ctx);
            expect(findings).toEqual([]);
        });

        it('handles missing _raw properties gracefully', () => {
            const ctx = buildContext({
                fields: [
                    { name: 'lbl A', type: 'FieldLabel', _raw: {} },
                    { name: 'lbl B', type: 'FieldLabel', _raw: {} },
                    { name: 'lbl C', type: 'FieldLabel', _raw: {} },
                ],
            });
            // All have same defaults → uniform
            const findings = runRule('font-consistency', ctx);
            expect(findings).toEqual([]);
        });

        it('reports specific differences in the message', () => {
            const ctx = buildContext({
                fields: [
                    {
                        name: 'lbl A',
                        type: 'FieldLabel',
                        _raw: { FontSize: 10, Bold: 'false', ForegroundColorString: '#FF000000' },
                    },
                    {
                        name: 'lbl B',
                        type: 'FieldLabel',
                        _raw: { FontSize: 10, Bold: 'false', ForegroundColorString: '#FF000000' },
                    },
                    {
                        name: 'lbl C',
                        type: 'FieldLabel',
                        _raw: { FontSize: 10, Bold: 'false', ForegroundColorString: '#FF000000' },
                    },
                    {
                        name: 'lbl H',
                        type: 'FieldLabel',
                        _raw: { FontSize: 18, Bold: 'true', ForegroundColorString: '#FF000000' },
                    },
                    {
                        name: 'lbl H2',
                        type: 'FieldLabel',
                        _raw: { FontSize: 18, Bold: 'true', ForegroundColorString: '#FF000000' },
                    },
                    {
                        name: 'lbl Odd',
                        type: 'FieldLabel',
                        _raw: { FontSize: 12, Bold: 'false', ForegroundColorString: '#FF000000' },
                    },
                ],
            });
            const findings = runRule('font-consistency', ctx);
            expect(findings).toHaveLength(1);
            expect(findings[0].message).toContain('fontSize=12');
        });
    });
});
