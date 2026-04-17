# Standards Review: Channel-Characteristics

Generated: 2026-04-16 | Rules: 49 | Findings: 45 (4 errors, 25 warnings, 16 info)

## Summary

| Severity | Count |
| :------- | ----: |
| Error    | 4 |
| Warning  | 25 |
| Info     | 16 |

## Errors

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| script-orphan-assignment | btnClose1_onClick | — | Script assignment references non-existent control ID: a4f97f0c-71b3-74d4-4ac2-3a7e899a1bce |
| script-orphan-assignment | btnTabFourOne_onClick | — | Script assignment references non-existent control ID: ede21e46-85e5-9232-15c3-572e995ebf29 |
| script-orphan-assignment | btnClose2_onClick | — | Script assignment references non-existent control ID: dcc4c208-d05e-cac1-fade-70334c13b657 |
| script-orphan-assignment | btnTabFourTwo_onClick | — | Script assignment references non-existent control ID: 63d8f4ec-1ad7-e63b-78c0-862e7b86c7fb |

## Warnings

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| title-case | Number of bankfull width measurements | Page 1 | Field name "Number of bankfull width measurements" is not in Title Case |
| title-case | Average bankfull width | Page 1 | Field name "Average bankfull width" is not in Title Case |
| title-case | Average wetted width | Page 1 | Field name "Average wetted width" is not in Title Case |
| title-case | Number of protocol pools | Page 1 | Field name "Number of protocol pools" is not in Title Case |
| title-case | Any ponds or impoundments over 0.5 acres | Page 1 | Field name "Any ponds or impoundments over 0.5 acres" is not in Title Case |
| default-name | Image57 | Page 1 | Default field name "Image57" — use a descriptive name |
| valid-identifier | Any ponds or impoundments over 0.5 acres | Page 1 | Field name "Any ponds or impoundments over 0.5 acres" contains invalid identifier characters |
| accessibility-required | Number of bankfull width measurements | Page 1 | Required field AccessibilityLabel "Number of bankfull width measurements" should end with "field Required" |
| accessibility-required | Any ponds or impoundments over 0.5 acres | Page 1 | Required field AccessibilityLabel "Any ponds or impoundments over 0.5 acres" should end with "field Required" |
| distance-to-border | Top Form ID | Page 1 | Field is 10px from the right border (minimum: 30px) |
| button-min-size | btn_HelpInstructions | Page 1 | Button is 20x20px — minimum is 24x24px (508 compliance) |
| accessibility-label-match | btn_HelpInstructions | Page 1 | AccessibilityLabel "Quick Help: Instructions" does not match expected "?" |
| accessibility-label-match | Any ponds or impoundments over 0.5 acres | Page 1 | AccessibilityLabel "Any ponds or impoundments over 0.5 acres" does not match expected "Any ponds or impoundments >0.5 acres? (Y or N)" |
| accessibility-label-match | btnSave | Page 1 | AccessibilityLabel "Save Button" does not match expected "Save" |
| accessibility-label-match | btnAdminSave | Page 1 | AccessibilityLabel "Admin Save Button" does not match expected "Admin Save" |
| tab-control-visible | TabControl | — | TabControl is in group "Hide Form Tabs" — tab visibility should be controlled via Menu tab, not groups |
| label-truncation | DataField2 | Page 1 | Label text "<strong style="color:#9E0000;">*</strong> Indicates required field" (~462px) may be truncated in 132px width — increase width or enable wrapping |
| label-truncation | Label57 | Page 1 | Label text "Water Segment Identifier:<strong style="color:#9E0000;">*</strong>" (~462px) may be truncated in 160px width — increase width or enable wrapping |
| label-truncation | Label59 | Page 1 | Label text "Number of bankfull width measurements:<strong style="color:#9E0000;">*</strong>" (~553px) may be truncated in 252px width — increase width or enable wrapping |
| label-truncation | Label61 | Page 1 | Label text "Average bankfull width (feet):<strong style="color:#9E0000;">*</strong>" (~497px) may be truncated in 192px width — increase width or enable wrapping |
| label-truncation | Label63 | Page 1 | Label text "Average Gradient (%):<strong style="color:#9E0000;">*</strong>" (~434px) may be truncated in 160px width — increase width or enable wrapping |
| label-truncation | Label65 | Page 1 | Label text "Average wetted width (feet):<strong style="color:#9E0000;">*</strong>" (~483px) may be truncated in 182px width — increase width or enable wrapping |
| label-truncation | Label67 | Page 1 | Label text "Number of protocol pools:<strong style="color:#9E0000;">*</strong>" (~462px) may be truncated in 160px width — increase width or enable wrapping |
| label-truncation | Label69 | Page 1 | Label text "Any ponds or impoundments >0.5 acres? (Y or N):<strong style="color:#9E0000;">*</strong>" (~616px) may be truncated in 272px width — increase width or enable wrapping |
| label-truncation | Label36 | Page 1 | Label text "Related Record ID:" (~126px) may be truncated in 82px width — increase width or enable wrapping |

## Info

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| group-override-condition | Hide Form Tabs | — | Group does not reference an override field in its conditions |
| label-unnamed-in-group | DataField2 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField3 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| spelling | Number of bankfull width measurements | Page 1 | Possible misspelling: "bankfull" (suggestions: bankroll) |
| spelling | Average bankfull width | Page 1 | Possible misspelling: "bankfull" (suggestions: bankroll) |
| spelling | Average wetted width | Page 1 | Possible misspelling: "wetted" (suggestions: petted, wetter, jetted) |
| spelling | Any ponds or impoundments over 0.5 acres | Page 1 | Possible misspelling: "impoundments" (suggestions: no suggestions) |
| spelling | Any ponds or impoundments over 0.5 acres | Page 1 | Possible misspelling: "0.5" (suggestions: 0, 5, 0th) |
| listener-disabled | Related Record ID | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| font-consistency | Label71 | Page 1 | Label style differs from form pattern: fontSize=18 (expected 10), bold=true (expected false), color=#ffffffff (expected #FF000000) |
| font-consistency | DataField2 | Page 1 | Label style differs from form pattern: color=#ff000000 (expected #FF000000) |
| font-consistency | Label56 | Page 1 | Label style differs from form pattern: bold=true (expected false), color=#ff000000 (expected #FF000000) |
| font-consistency | Label33 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff9e0000 (expected #FF000000) |
| font-consistency | Label38 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff000000 (expected #FF000000) |
| font-consistency | Label43 | Page 1 | Label style differs from form pattern: fontSize=9 (expected 10), color=#ff000000 (expected #FF000000) |
| font-consistency | Label41 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff000000 (expected #FF000000) |
