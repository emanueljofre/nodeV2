/**
 * Unit tests for rules/label-layout.js
 *
 * Tests 2 rules: label-truncation, label-wrap-textbox
 */

const { buildContext, runRule, findingMatchers } = require('../helpers');

expect.extend(findingMatchers);

describe('label-layout rules', () => {
    // ------------------------------------------------------------------
    // label-truncation
    // ------------------------------------------------------------------
    describe('label-truncation', () => {
        it('flags a label whose text is much wider than its width', () => {
            // "This is a very long label text that will not fit" ~49 chars × 7px = ~343px > 100px
            const ctx = buildContext({
                fields: [
                    {
                        name: 'lbl Long',
                        type: 'FieldLabel',
                        width: 100,
                        text: 'This is a very long label text that will not fit',
                        _raw: {
                            LabelWrap: 'false',
                            FontSize: 10,
                            Bold: 'false',
                            Text: 'This is a very long label text that will not fit',
                            Width: 100,
                        },
                    },
                ],
            });
            const findings = runRule('label-truncation', ctx);
            expect(findings).toContainFindingMatch({ ruleId: 'label-truncation', field: 'lbl Long' });
        });

        it('passes when label text fits within width', () => {
            // "Name" = 4 chars × 7px = ~28px. Width=100 → fits easily
            const ctx = buildContext({
                fields: [
                    {
                        name: 'lbl Name',
                        type: 'FieldLabel',
                        width: 100,
                        text: 'Name',
                        _raw: { LabelWrap: 'false', FontSize: 10, Bold: 'false', Text: 'Name', Width: 100 },
                    },
                ],
            });
            const findings = runRule('label-truncation', ctx);
            expect(findings).toEqual([]);
        });

        it('skips labels with LabelWrap enabled (they wrap instead of truncating)', () => {
            const ctx = buildContext({
                fields: [
                    {
                        name: 'lbl Wrap',
                        type: 'FieldLabel',
                        width: 50,
                        text: 'This is a very long label that wraps',
                        _raw: {
                            LabelWrap: 'true',
                            FontSize: 10,
                            Text: 'This is a very long label that wraps',
                            Width: 50,
                        },
                    },
                ],
            });
            const findings = runRule('label-truncation', ctx);
            expect(findings).toEqual([]);
        });

        it('skips labels with empty text', () => {
            const ctx = buildContext({
                fields: [
                    {
                        name: 'lbl Empty',
                        type: 'FieldLabel',
                        width: 50,
                        text: '',
                        _raw: { LabelWrap: 'false', FontSize: 10, Text: '', Width: 50 },
                    },
                ],
            });
            const findings = runRule('label-truncation', ctx);
            expect(findings).toEqual([]);
        });

        it('skips non-label fields', () => {
            const ctx = buildContext({
                fields: [
                    {
                        name: 'Textbox',
                        type: 'FieldTextbox3',
                        width: 50,
                        _raw: { Text: 'Some long text value', Width: 50 },
                    },
                ],
            });
            const findings = runRule('label-truncation', ctx);
            expect(findings).toEqual([]);
        });

        it('accounts for bold text (wider characters)', () => {
            // Bold multiplier is 1.1, so "Short Label" = 11 chars × 7 × 1.1 = ~85px
            // Width=80 → 85 > 80*1.1=88? No... 85 > 88 is false. Let me use a tighter case.
            // "Medium Label Text" = 17 chars × 7 × 1.1 = ~131px, width=110 → 131 > 110*1.1=121 → flags
            const ctx = buildContext({
                fields: [
                    {
                        name: 'lbl Bold',
                        type: 'FieldLabel',
                        width: 110,
                        text: 'Medium Label Text',
                        _raw: { LabelWrap: 'false', FontSize: 10, Bold: 'true', Text: 'Medium Label Text', Width: 110 },
                    },
                ],
            });
            const findings = runRule('label-truncation', ctx);
            expect(findings).toContainFindingMatch({ ruleId: 'label-truncation', field: 'lbl Bold' });
        });

        it('accounts for larger font size', () => {
            // FontSize=18 → charWidth = 7 * 18/10 = 12.6. "Big Heading" = 11 chars × 12.6 = ~139px
            // Width=100 → 139 > 100*1.1=110 → flags
            const ctx = buildContext({
                fields: [
                    {
                        name: 'lbl Big',
                        type: 'FieldLabel',
                        width: 100,
                        text: 'Big Heading',
                        _raw: { LabelWrap: 'false', FontSize: 18, Bold: 'false', Text: 'Big Heading', Width: 100 },
                    },
                ],
            });
            const findings = runRule('label-truncation', ctx);
            expect(findings).toContainFindingMatch({ ruleId: 'label-truncation' });
        });

        it('allows 10% tolerance (borderline case passes)', () => {
            // "Name" = 4 chars × 7 = 28px. Width=26 → 28 > 26*1.1=28.6? No → passes
            const ctx = buildContext({
                fields: [
                    {
                        name: 'lbl Close',
                        type: 'FieldLabel',
                        width: 26,
                        text: 'Name',
                        _raw: { LabelWrap: 'false', FontSize: 10, Bold: 'false', Text: 'Name', Width: 26 },
                    },
                ],
            });
            const findings = runRule('label-truncation', ctx);
            expect(findings).toEqual([]);
        });

        it('skips labels with zero width', () => {
            const ctx = buildContext({
                fields: [
                    {
                        name: 'lbl No Width',
                        type: 'FieldLabel',
                        width: 0,
                        text: 'Something',
                        _raw: { LabelWrap: 'false', FontSize: 10, Text: 'Something', Width: 0 },
                    },
                ],
            });
            const findings = runRule('label-truncation', ctx);
            expect(findings).toEqual([]);
        });
    });

    // ------------------------------------------------------------------
    // label-wrap-textbox
    // ------------------------------------------------------------------
    describe('label-wrap-textbox', () => {
        it('flags a wrapping label next to a single-line textbox', () => {
            // "Very Long Label Text Here" = 25 chars × 7 = 175px > 80px width → wraps
            const ctx = buildContext({
                fields: [
                    {
                        name: 'lbl Wrap',
                        type: 'FieldLabel',
                        layoutLeft: 50,
                        layoutTop: 100,
                        width: 80,
                        text: 'Very Long Label Text Here',
                        _raw: {
                            LabelWrap: 'true',
                            FontSize: 10,
                            Bold: 'false',
                            Text: 'Very Long Label Text Here',
                            Width: 80,
                        },
                    },
                    {
                        name: 'First Name',
                        type: 'FieldTextbox3',
                        layoutLeft: 140,
                        layoutTop: 100,
                        width: 200,
                    },
                ],
            });
            const findings = runRule('label-wrap-textbox', ctx);
            expect(findings).toContainFindingMatch({ ruleId: 'label-wrap-textbox', field: 'lbl Wrap' });
        });

        it('passes when label text fits (no wrap needed)', () => {
            // "Name" = 4 chars × 7 = 28px < 80px → no wrap
            const ctx = buildContext({
                fields: [
                    {
                        name: 'lbl Name',
                        type: 'FieldLabel',
                        layoutLeft: 50,
                        layoutTop: 100,
                        width: 80,
                        text: 'Name',
                        _raw: { LabelWrap: 'true', FontSize: 10, Bold: 'false', Text: 'Name', Width: 80 },
                    },
                    {
                        name: 'First Name',
                        type: 'FieldTextbox3',
                        layoutLeft: 140,
                        layoutTop: 100,
                        width: 200,
                    },
                ],
            });
            const findings = runRule('label-wrap-textbox', ctx);
            expect(findings).toEqual([]);
        });

        it('passes when LabelWrap is false (label truncates instead)', () => {
            const ctx = buildContext({
                fields: [
                    {
                        name: 'lbl No Wrap',
                        type: 'FieldLabel',
                        layoutLeft: 50,
                        layoutTop: 100,
                        width: 80,
                        text: 'Very Long Label Text Here',
                        _raw: { LabelWrap: 'false', FontSize: 10, Text: 'Very Long Label Text Here', Width: 80 },
                    },
                    {
                        name: 'Field',
                        type: 'FieldTextbox3',
                        layoutLeft: 140,
                        layoutTop: 100,
                        width: 200,
                    },
                ],
            });
            const findings = runRule('label-wrap-textbox', ctx);
            expect(findings).toEqual([]);
        });

        it('passes when there is no adjacent textbox', () => {
            const ctx = buildContext({
                fields: [
                    {
                        name: 'lbl Alone',
                        type: 'FieldLabel',
                        layoutLeft: 50,
                        layoutTop: 100,
                        width: 80,
                        text: 'Very Long Label Text Here',
                        _raw: { LabelWrap: 'true', FontSize: 10, Text: 'Very Long Label Text Here', Width: 80 },
                    },
                ],
            });
            const findings = runRule('label-wrap-textbox', ctx);
            expect(findings).toEqual([]);
        });

        it('ignores fields on different rows (vertical tolerance 15px)', () => {
            const ctx = buildContext({
                fields: [
                    {
                        name: 'lbl Row1',
                        type: 'FieldLabel',
                        layoutLeft: 50,
                        layoutTop: 100,
                        width: 80,
                        text: 'Very Long Label Text Here',
                        _raw: { LabelWrap: 'true', FontSize: 10, Text: 'Very Long Label Text Here', Width: 80 },
                    },
                    {
                        name: 'Field',
                        type: 'FieldTextbox3',
                        layoutLeft: 140,
                        layoutTop: 130, // 30px diff > 15px tolerance
                        width: 200,
                    },
                ],
            });
            const findings = runRule('label-wrap-textbox', ctx);
            expect(findings).toEqual([]);
        });

        it('ignores fields to the left of the label', () => {
            const ctx = buildContext({
                fields: [
                    {
                        name: 'lbl Right',
                        type: 'FieldLabel',
                        layoutLeft: 200,
                        layoutTop: 100,
                        width: 80,
                        text: 'Very Long Label Text Here',
                        _raw: { LabelWrap: 'true', FontSize: 10, Text: 'Very Long Label Text Here', Width: 80 },
                    },
                    {
                        name: 'Field',
                        type: 'FieldTextbox3',
                        layoutLeft: 50, // to the LEFT of the label
                        layoutTop: 100,
                        width: 200,
                    },
                ],
            });
            const findings = runRule('label-wrap-textbox', ctx);
            expect(findings).toEqual([]);
        });

        it('also checks adjacent calendars and dropdowns', () => {
            const ctx = buildContext({
                fields: [
                    {
                        name: 'lbl Cal',
                        type: 'FieldLabel',
                        layoutLeft: 50,
                        layoutTop: 100,
                        width: 80,
                        text: 'Very Long Calendar Label',
                        _raw: { LabelWrap: 'true', FontSize: 10, Text: 'Very Long Calendar Label', Width: 80 },
                    },
                    {
                        name: 'Start Date',
                        type: 'FieldCalendar3',
                        layoutLeft: 140,
                        layoutTop: 100,
                        width: 200,
                    },
                ],
            });
            const findings = runRule('label-wrap-textbox', ctx);
            expect(findings).toContainFindingMatch({ ruleId: 'label-wrap-textbox' });
        });

        it('ignores fields on different pages', () => {
            const ctx = buildContext({
                pages: [
                    { index: 0, id: 'p1', name: 'Page 1', width: 800, height: 600 },
                    { index: 1, id: 'p2', name: 'Page 2', width: 800, height: 600 },
                ],
                fields: [
                    {
                        name: 'lbl P1',
                        type: 'FieldLabel',
                        layoutLeft: 50,
                        layoutTop: 100,
                        width: 80,
                        pageIndex: 0,
                        pageName: 'Page 1',
                        text: 'Very Long Label Text Here',
                        _raw: { LabelWrap: 'true', FontSize: 10, Text: 'Very Long Label Text Here', Width: 80 },
                    },
                    {
                        name: 'Field P2',
                        type: 'FieldTextbox3',
                        layoutLeft: 140,
                        layoutTop: 100,
                        width: 200,
                        pageIndex: 1,
                        pageName: 'Page 2',
                    },
                ],
            });
            const findings = runRule('label-wrap-textbox', ctx);
            expect(findings).toEqual([]);
        });
    });
});
