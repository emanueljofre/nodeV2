# Standards Review: Signature-Access

Generated: 2026-04-16 | Rules: 49 | Findings: 35 (4 errors, 15 warnings, 16 info)

## Summary

| Severity | Count |
| :------- | ----: |
| Error    | 4 |
| Warning  | 15 |
| Info     | 16 |

## Errors

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| script-orphan-assignment | btnClose2_onClick | — | Script assignment references non-existent control ID: dcc4c208-d05e-cac1-fade-70334c13b657 |
| script-orphan-assignment | btnTabFourOne_onClick | — | Script assignment references non-existent control ID: ede21e46-85e5-9232-15c3-572e995ebf29 |
| script-orphan-assignment | btnTabFourTwo_onClick | — | Script assignment references non-existent control ID: 63d8f4ec-1ad7-e63b-78c0-862e7b86c7fb |
| script-orphan-assignment | btnClose1_onClick | — | Script assignment references non-existent control ID: a4f97f0c-71b3-74d4-4ac2-3a7e899a1bce |

## Warnings

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| default-name | Image57 | Page 1 | Default field name "Image57" — use a descriptive name |
| accessibility-required | Access Code | Page 1 | Required field AccessibilityLabel "Access Code Required" should end with "field Required" |
| accessibility-required | Zip Code | Page 1 | Required field AccessibilityLabel "Zip Code Required" should end with "field Required" |
| distance-to-border | Top Form ID | Page 1 | Field is 10px from the right border (minimum: 30px) |
| accessibility-label-match | Access Code | Page 1 | AccessibilityLabel "Access Code Required" does not match expected "Access Code" |
| accessibility-label-match | Zip Code | Page 1 | AccessibilityLabel "Zip Code Required" does not match expected "Zip Code" |
| accessibility-label-match | btnSubmit | Page 1 | AccessibilityLabel "Next Button" does not match expected "Submit" |
| accessibility-label-match | btnAdminSave | Page 1 | AccessibilityLabel "Admin Save Button" does not match expected "Admin Save" |
| tab-control-visible | TabControl | — | TabControl is in group "Hide Form Tabs" — tab visibility should be controlled via Menu tab, not groups |
| label-truncation | DataField2 | Page 1 | Label text "<strong style="color:#9E0000;">*</strong> Indicates required field" (~462px) may be truncated in 132px width — increase width or enable wrapping |
| label-truncation | Label47 | Page 1 | Label text "Access Code: <b style="color:#9E0000;">*</b>" (~308px) may be truncated in 112px width — increase width or enable wrapping |
| label-truncation | DataField1 | Page 1 | Label text "Zip Code: <b style="color:#9E0000;">*</b>" (~287px) may be truncated in 112px width — increase width or enable wrapping |
| label-truncation | Label49 | Page 1 | Label text "Contact Information Relation ID:" (~224px) may be truncated in 82px width — increase width or enable wrapping |
| label-truncation | Label58 | Page 1 | Label text "Related Record ID:" (~126px) may be truncated in 82px width — increase width or enable wrapping |
| dropdown-width | Status | Page 1 | Drop-down width is 70px — minimum recommended is 100px |

## Info

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| group-override-condition | Hide Form Tabs | — | Group does not reference an override field in its conditions |
| label-unnamed-in-group | DataField2 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField1 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField3 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| listener-disabled | Contact Information Relation ID | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Related Record ID | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| font-consistency | Label71 | Page 1 | Label style differs from form pattern: fontSize=18 (expected 10), bold=true (expected false), color=#ffffffff (expected #ff000000) |
| font-consistency | Label56 | Page 1 | Label style differs from form pattern: bold=true (expected false) |
| font-consistency | Label33 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff9e0000 (expected #ff000000) |
| font-consistency | Label34 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), color=#FF000000 (expected #ff000000) |
| font-consistency | Label38 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false) |
| font-consistency | Label41 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false) |
| font-consistency | Label49 | Page 1 | Label style differs from form pattern: color=#FF000000 (expected #ff000000) |
| font-consistency | DataField3 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), color=#FF000000 (expected #ff000000) |
| font-consistency | Label58 | Page 1 | Label style differs from form pattern: color=#FF000000 (expected #ff000000) |
| field-width-standard | Status | Page 1 | FieldDropDownList3 width is 70px — recommended minimum is 100px |
