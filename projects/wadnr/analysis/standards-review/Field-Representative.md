# Standards Review: Field-Representative

Generated: 2026-04-16 | Rules: 49 | Findings: 35 (5 errors, 17 warnings, 13 info)

## Summary

| Severity | Count |
| :------- | ----: |
| Error    | 5 |
| Warning  | 17 |
| Info     | 13 |

## Errors

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| script-orphan-assignment | btnClose2_onClick | — | Script assignment references non-existent control ID: dcc4c208-d05e-cac1-fade-70334c13b657 |
| script-orphan-assignment | btnClose1_onClick | — | Script assignment references non-existent control ID: a4f97f0c-71b3-74d4-4ac2-3a7e899a1bce |
| script-orphan-assignment | btnTabFourOne_onClick | — | Script assignment references non-existent control ID: ede21e46-85e5-9232-15c3-572e995ebf29 |
| script-orphan-assignment | btnTabFourTwo_onClick | — | Script assignment references non-existent control ID: 63d8f4ec-1ad7-e63b-78c0-862e7b86c7fb |
| field-multiple-groups | Con_HiddenSection | — | Field appears in 2 groups: Hidden Fields, HideFormControls |

## Warnings

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| default-name | Image57 | Page 1 | Default field name "Image57" — use a descriptive name |
| accessibility-required | Date | Page 1 | Required field AccessibilityLabel "Date field, required" should end with "field Required" |
| accessibility-required | Name | Page 1 | Required field AccessibilityLabel "Name field, required" should end with "field Required" |
| accessibility-required | Title Position | Page 1 | Required field AccessibilityLabel "Title or position, required" should end with "field Required" |
| distance-to-border | Top Form ID | Page 1 | Field is 10px from the right border (minimum: 30px) |
| distance-to-border | btnHelpInstructions | Page 1 | Field is 10px from the right border (minimum: 30px) |
| button-min-size | btnHelpInstructions | Page 1 | Button is 20x20px — minimum is 24x24px (508 compliance) |
| accessibility-label-match | btnHelpInstructions | Page 1 | AccessibilityLabel "Quick help instructions button" does not match expected "?" |
| accessibility-label-match | btnSave | Page 1 | AccessibilityLabel "Save button" does not match expected "Save" |
| accessibility-label-match | btnAdminSave | Page 1 | AccessibilityLabel "Admin Save Button" does not match expected "Admin Save" |
| accessibility-label-match | btnSaveDraft | Page 1 | AccessibilityLabel "Save draft button" does not match expected "Save Draft" |
| tab-control-visible | TabControl | — | TabControl is in group "Hide Form Tabs" — tab visibility should be controlled via Menu tab, not groups |
| label-truncation | DataField2 | Page 1 | Label text "<strong style="color:#9E0000;">*</strong> Indicates required field" (~462px) may be truncated in 132px width — increase width or enable wrapping |
| label-truncation | Label61 | Page 1 | Label text "<strong>Date:</strong><strong style="color:#9E0000;">*</strong>" (~441px) may be truncated in 152px width — increase width or enable wrapping |
| label-truncation | Label37 | Page 1 | Label text "<strong>Name:</strong><strong style="color:#9E0000;">*</strong>" (~441px) may be truncated in 152px width — increase width or enable wrapping |
| label-truncation | Label39 | Page 1 | Label text "<strong>Title / Position:</strong><strong style="color:#9E0000;">*</strong>" (~525px) may be truncated in 162px width — increase width or enable wrapping |
| label-truncation | Label49 | Page 1 | Label text "Related Record ID:" (~126px) may be truncated in 82px width — increase width or enable wrapping |

## Info

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| group-override-condition | Hide Form Tabs | — | Group does not reference an override field in its conditions |
| label-unnamed-in-group | DataField2 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField1 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField3 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| listener-disabled | Related Record ID | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| field-max-length | Name | Page 1 | MaxLength is 50 for name field — recommended minimum is 100 |
| font-consistency | Label71 | Page 1 | Label style differs from form pattern: fontSize=18 (expected 10), bold=true (expected false), color=#ffffffff (expected #FF000000) |
| font-consistency | DataField2 | Page 1 | Label style differs from form pattern: color=#ff000000 (expected #FF000000) |
| font-consistency | Label56 | Page 1 | Label style differs from form pattern: bold=true (expected false), color=#ff000000 (expected #FF000000) |
| font-consistency | Label33 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff9e0000 (expected #FF000000) |
| font-consistency | Label38 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff000000 (expected #FF000000) |
| font-consistency | Label43 | Page 1 | Label style differs from form pattern: fontSize=9 (expected 10), color=#ff000000 (expected #FF000000) |
| font-consistency | Label41 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff000000 (expected #FF000000) |
