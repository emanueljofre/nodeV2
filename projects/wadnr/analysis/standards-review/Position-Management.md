# Standards Review: Position-Management

Generated: 2026-04-16 | Rules: 49 | Findings: 39 (4 errors, 20 warnings, 15 info)

## Summary

| Severity | Count |
| :------- | ----: |
| Error    | 4 |
| Warning  | 20 |
| Info     | 15 |

## Errors

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| script-orphan-assignment | btnClose2_onClick | — | Script assignment references non-existent control ID: dcc4c208-d05e-cac1-fade-70334c13b657 |
| script-orphan-assignment | btnTabFourTwo_onClick | — | Script assignment references non-existent control ID: 63d8f4ec-1ad7-e63b-78c0-862e7b86c7fb |
| script-orphan-assignment | btnTabFourOne_onClick | — | Script assignment references non-existent control ID: ede21e46-85e5-9232-15c3-572e995ebf29 |
| script-orphan-assignment | btnClose1_onClick | — | Script assignment references non-existent control ID: a4f97f0c-71b3-74d4-4ac2-3a7e899a1bce |

## Warnings

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| title-case | PositionManagementTitle | Page 1 | Field name "PositionManagementTitle" is not in Title Case |
| title-case | FP Unit Name | Page 1 | Field name "FP Unit Name" is not in Title Case |
| default-name | Image57 | Page 1 | Default field name "Image57" — use a descriptive name |
| accessibility-label | Related Record ID | Page 1 | Missing AccessibilityLabel |
| distance-to-border | Top Form ID | Page 1 | Field is 10px from the right border (minimum: 30px) |
| distance-to-border | Last Name | Page 1 | Field is 20px from the right border (minimum: 30px) |
| distance-to-border | FP Unit Name | Page 1 | Field is 24px from the right border (minimum: 30px) |
| distance-to-border | Phone No | Page 1 | Field is 20px from the right border (minimum: 30px) |
| distance-to-border | btnSave | Page 1 | Field is 25px from the right border (minimum: 30px) |
| distance-to-border | btnAdminSave | Page 1 | Field is 14px from the right border (minimum: 30px) |
| accessibility-label-match | Position No | Page 1 | AccessibilityLabel "Position Number input field required" does not match expected "Position No." |
| accessibility-label-match | First Name | Page 1 | AccessibilityLabel "First Name input field" does not match expected "First Name" |
| accessibility-label-match | Last Name | Page 1 | AccessibilityLabel "Last Name input field" does not match expected "Last Name" |
| accessibility-label-match | FP Unit Name | Page 1 | AccessibilityLabel "FP Unit Name input field" does not match expected "FP Unit Name" |
| accessibility-label-match | Email | Page 1 | AccessibilityLabel "Email input field" does not match expected "Email" |
| accessibility-label-match | Phone No | Page 1 | AccessibilityLabel "Phone number input field" does not match expected "Phone No." |
| accessibility-label-match | btnSave | Page 1 | AccessibilityLabel "Save Button" does not match expected "Save" |
| accessibility-label-match | btnAdminSave | Page 1 | AccessibilityLabel "Admin Save Button" does not match expected "Admin Save" |
| label-truncation | DataField2 | Page 1 | Label text "<strong style="color:#9E0000;">*</strong> Indicates required field" (~462px) may be truncated in 132px width — increase width or enable wrapping |
| label-truncation | Label57 | Page 1 | Label text "Position No. <strong style="color:#9E0000;">*</strong>" (~378px) may be truncated in 102px width — increase width or enable wrapping |

## Info

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| label-unnamed-in-group | DataField2 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField1 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField3 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| spelling | PositionManagementTitle | Page 1 | Possible misspelling: "PositionManagementTitle" (suggestions: no suggestions) |
| spelling | FP Unit Name | Page 1 | Possible misspelling: "FP" (suggestions: DP, FE, FR) |
| field-max-length | Position No | Page 1 | MaxLength is 5 — recommended minimum is 50 |
| field-max-length | First Name | Page 1 | MaxLength is 50 for name field — recommended minimum is 100 |
| field-max-length | Last Name | Page 1 | MaxLength is 50 for name field — recommended minimum is 100 |
| font-consistency | Label71 | Page 1 | Label style differs from form pattern: fontSize=18 (expected 10), bold=true (expected false), color=#ffffffff (expected #FF000000) |
| font-consistency | DataField2 | Page 1 | Label style differs from form pattern: color=#ff000000 (expected #FF000000) |
| font-consistency | Label56 | Page 1 | Label style differs from form pattern: bold=true (expected false) |
| font-consistency | Label33 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff9e0000 (expected #FF000000) |
| font-consistency | Label38 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff000000 (expected #FF000000) |
| font-consistency | Label43 | Page 1 | Label style differs from form pattern: fontSize=9 (expected 10), color=#ff000000 (expected #FF000000) |
| font-consistency | Label41 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff000000 (expected #FF000000) |
