# Standards Review: Email-Template

Generated: 2026-04-16 | Rules: 49 | Findings: 61 (8 errors, 27 warnings, 26 info)

## Summary

| Severity | Count |
| :------- | ----: |
| Error    | 8 |
| Warning  | 27 |
| Info     | 26 |

## Errors

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| script-orphan-assignment | btnClose1_onClick | — | Script assignment references non-existent control ID: a4f97f0c-71b3-74d4-4ac2-3a7e899a1bce |
| script-orphan-assignment | btnClose2_onClick | — | Script assignment references non-existent control ID: dcc4c208-d05e-cac1-fade-70334c13b657 |
| script-orphan-assignment | btnTabFourOne_onClick | — | Script assignment references non-existent control ID: ede21e46-85e5-9232-15c3-572e995ebf29 |
| script-orphan-assignment | btnTabFourTwo_onClick | — | Script assignment references non-existent control ID: 63d8f4ec-1ad7-e63b-78c0-862e7b86c7fb |
| script-orphan-assignment | Region_Name_onBlur | — | Script assignment references non-existent control ID: 795af479-abe2-8bf1-c23b-a3cd43794a9c |
| script-orphan-assignment | Region_Zone_onChange | — | Script assignment references non-existent control ID: 00074206-45b1-8be5-c468-a09c67e71927 |
| script-orphan-assignment | Region_Code_onBlur | — | Script assignment references non-existent control ID: 5f763a52-df66-8455-b6c4-261c37fff56f |
| script-field-reference | Region_Zone_onChange | — | Script references non-existent field "Region Zone" via GetFieldValue() |

## Warnings

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| title-case | Send CC Selector | Page 1 | Field name "Send CC Selector" is not in Title Case |
| title-case | Send CC | Page 1 | Field name "Send CC" is not in Title Case |
| default-name | Image46 | Page 1 | Default field name "Image46" — use a descriptive name |
| accessibility-required | Subject Line | Page 1 | Required field AccessibilityLabel "Subject Line" should end with "field Required" |
| distance-to-border | Top Form ID | Page 1 | Field is 10px from the right border (minimum: 30px) |
| distance-to-border | Email Name | Page 1 | Field is 24px from the right border (minimum: 30px) |
| distance-to-border | Send To | Page 1 | Field is 24px from the right border (minimum: 30px) |
| distance-to-border | Send CC | Page 1 | Field is 24px from the right border (minimum: 30px) |
| distance-to-border | Subject Line | Page 1 | Field is 24px from the right border (minimum: 30px) |
| label-overlap | Send To | Page 1 | Label "Label33" overlaps field by 22px |
| label-overlap | Send CC | Page 1 | Label "Label38" overlaps field by 80px |
| label-overlap | Status | Page 1 | Label "DataField3" overlaps field by 12px |
| accessibility-label-match | Region | Page 1 | AccessibilityLabel "Region Code" does not match expected "Region" |
| accessibility-label-match | Email Name | Page 1 | AccessibilityLabel "Email Name field required" does not match expected "Name of Email" |
| accessibility-label-match | Send To Selector | Page 1 | AccessibilityLabel "Send To Selector field required" does not match expected "Select which email addresses you would like to send this email to" |
| accessibility-label-match | Send CC Selector | Page 1 | AccessibilityLabel "Send CC Selector field required" does not match expected "Please select which email addresses you would like to CC this email to" |
| accessibility-label-match | btnSave | Page 1 | AccessibilityLabel "Save Button" does not match expected "Save" |
| accessibility-label-match | btnAdminSave | Page 1 | AccessibilityLabel "Admin Save Button" does not match expected "Admin Save" |
| label-truncation | DataField2 | Page 1 | Label text "<strong style="color:#9E0000;">*</strong> Indicates required field" (~462px) may be truncated in 132px width — increase width or enable wrapping |
| label-truncation | DataField1 | Page 1 | Label text "Process Name: <strong style="color:#9E0000;">*</strong>" (~385px) may be truncated in 102px width — increase width or enable wrapping |
| label-truncation | Label27 | Page 1 | Label text "Select if this email will be Digest or Immediate Send: <b style="color:#9E0000;">*</b>" (~602px) may be truncated in 342px width — increase width or enable wrapping |
| label-truncation | Label46 | Page 1 | Label text "This template will be used for manual creation of emails or automation? <b style="color:#9E0000;">*</b>" (~721px) may be truncated in 342px width — increase width or enable wrapping |
| label-truncation | Label28 | Page 1 | Label text "Name of Email: <b style="color:#9E0000;">*</b>" (~322px) may be truncated in 112px width — increase width or enable wrapping |
| label-truncation | Label40 | Page 1 | Label text "Subject Line: <b style="color:#9E0000;">*</b>" (~315px) may be truncated in 92px width — increase width or enable wrapping |
| label-truncation | Label42 | Page 1 | Label text "Body: <b style="color:#9E0000;">*</b>" (~259px) may be truncated in 72px width — increase width or enable wrapping |
| label-wrap-textbox | Label30 | Page 1 | Label text "Select which email addresses you would like to send this email to: <b style="color:#9E0000;">*</b>" wraps at 332px width next to "Send To Selector" — widen label or shorten text |
| label-wrap-textbox | Label36 | Page 1 | Label text "Please select which email addresses you would like to CC this email to: <b style="color:#9E0000;">*</b>" wraps at 332px width next to "Send CC Selector" — widen label or shorten text |

## Info

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| label-unnamed-in-group | DataField2 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField1 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField7 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField4 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField3 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField5 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| field-max-length | Send To | Page 1 | TextArea MaxLength is 1000 — recommended minimum is 3000 for notes/text fields |
| field-max-length | Send CC | Page 1 | TextArea MaxLength is 1000 — recommended minimum is 3000 for notes/text fields |
| font-consistency | Label71 | Page 1 | Label style differs from form pattern: fontSize=18 (expected 10), bold=true (expected false), color=#ffffffff (expected #FF000000) |
| font-consistency | DataField2 | Page 1 | Label style differs from form pattern: color=#ff000000 (expected #FF000000) |
| font-consistency | Label56 | Page 1 | Label style differs from form pattern: bold=true (expected false), color=#ff000000 (expected #FF000000) |
| font-consistency | Label44 | Page 1 | Label style differs from form pattern: bold=true (expected false), color=#ff000000 (expected #FF000000) |
| font-consistency | DataField4 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff9e0000 (expected #FF000000) |
| font-consistency | Label34 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10) |
| font-consistency | DataField3 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10) |
| font-consistency | DataField5 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff000000 (expected #FF000000) |
| font-consistency | Label43 | Page 1 | Label style differs from form pattern: fontSize=9 (expected 10), color=#ff000000 (expected #FF000000) |
| font-consistency | Label41 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff000000 (expected #FF000000) |
| data-lookup-in-properties | Process Name | — | Script "Process_Name_onBlur" on drop-down contains API calls — prefer configuring data lookups in the properties panel |
| data-lookup-in-properties | Send To Selector | — | Script "Send_To_Selector_onChange" on drop-down contains API calls — prefer configuring data lookups in the properties panel |
| data-lookup-in-properties | Send Select | — | Script "Send_Select_onBlur" on drop-down contains API calls — prefer configuring data lookups in the properties panel |
| data-lookup-in-properties | Send Select | — | Script "Send_Select_onChange" on drop-down contains API calls — prefer configuring data lookups in the properties panel |
| data-lookup-in-properties | Process Name | — | Script "Process_Name_onChange" on drop-down contains API calls — prefer configuring data lookups in the properties panel |
| data-lookup-in-properties | Send To Selector | — | Script "Send_To_Selector_onBlur" on drop-down contains API calls — prefer configuring data lookups in the properties panel |
| data-lookup-in-properties | Send CC Selector | — | Script "Send_CC_Selector_onBlur" on drop-down contains API calls — prefer configuring data lookups in the properties panel |
| data-lookup-in-properties | Send CC Selector | — | Script "Send_CC_Selector_onChange" on drop-down contains API calls — prefer configuring data lookups in the properties panel |
