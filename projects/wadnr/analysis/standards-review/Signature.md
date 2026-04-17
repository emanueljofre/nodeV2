# Standards Review: Signature

Generated: 2026-04-16 | Rules: 49 | Findings: 116 (5 errors, 60 warnings, 51 info)

## Summary

| Severity | Count |
| :------- | ----: |
| Error    | 5 |
| Warning  | 60 |
| Info     | 51 |

## Errors

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| script-orphan-assignment | btnClose1_onClick | — | Script assignment references non-existent control ID: a4f97f0c-71b3-74d4-4ac2-3a7e899a1bce |
| script-orphan-assignment | btnClose2_onClick | — | Script assignment references non-existent control ID: dcc4c208-d05e-cac1-fade-70334c13b657 |
| script-orphan-assignment | btnTabFourOne_onClick | — | Script assignment references non-existent control ID: ede21e46-85e5-9232-15c3-572e995ebf29 |
| script-orphan-assignment | Acknowledge_One_Notice_Of_Transfer_onChange | — | Script assignment references non-existent control ID: 84d07035-fbb8-13d9-279b-cda7f040b209 |
| script-orphan-assignment | btnTabFourTwo_onClick | — | Script assignment references non-existent control ID: 63d8f4ec-1ad7-e63b-78c0-862e7b86c7fb |

## Warnings

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| title-case | Acknowledge One LTA | Page 1 | Field name "Acknowledge One LTA" is not in Title Case |
| title-case | Acknowledge Two LTA | Page 1 | Field name "Acknowledge Two LTA" is not in Title Case |
| title-case | Acknowledge Three LTA | Page 1 | Field name "Acknowledge Three LTA" is not in Title Case |
| title-case | Acknowledge Four LTA | Page 1 | Field name "Acknowledge Four LTA" is not in Title Case |
| title-case | Acknowledge Five LTA | Page 1 | Field name "Acknowledge Five LTA" is not in Title Case |
| title-case | Acknowledge One LTA5DN | Page 1 | Field name "Acknowledge One LTA5DN" is not in Title Case |
| title-case | Acknowledge Two LTA5DN | Page 1 | Field name "Acknowledge Two LTA5DN" is not in Title Case |
| title-case | Acknowledge Three LTA5DN | Page 1 | Field name "Acknowledge Three LTA5DN" is not in Title Case |
| title-case | Acknowledge Four LTA5DN | Page 1 | Field name "Acknowledge Four LTA5DN" is not in Title Case |
| title-case | Acknowledge Five LTA5DN | Page 1 | Field name "Acknowledge Five LTA5DN" is not in Title Case |
| title-case | Acknowledge Six LTA5DN | Page 1 | Field name "Acknowledge Six LTA5DN" is not in Title Case |
| title-case | ParentIsFPAN | Page 1 | Field name "ParentIsFPAN" is not in Title Case |
| title-case | ParentIsLTA | Page 1 | Field name "ParentIsLTA" is not in Title Case |
| title-case | ParentIsLTA5DN | Page 1 | Field name "ParentIsLTA5DN" is not in Title Case |
| title-case | ParentIsAerial | Page 1 | Field name "ParentIsAerial" is not in Title Case |
| title-case | ParentIsAmendment | Page 1 | Field name "ParentIsAmendment" is not in Title Case |
| title-case | ParentIsRenewal | Page 1 | Field name "ParentIsRenewal" is not in Title Case |
| title-case | ParentIsNoticeOfTransfer | Page 1 | Field name "ParentIsNoticeOfTransfer" is not in Title Case |
| default-name | Image47 | Page 1 | Default field name "Image47" — use a descriptive name |
| accessibility-label | Related Record ID | Page 1 | Missing AccessibilityLabel |
| accessibility-label | Public User | Page 1 | Missing AccessibilityLabel |
| accessibility-label | Signature | Page 1 | Missing AccessibilityLabel |
| accessibility-label | Email | Page 1 | Missing AccessibilityLabel |
| accessibility-label | Decline Reason | Page 1 | Missing AccessibilityLabel |
| accessibility-label | Contact Information Relation ID | Page 1 | Missing AccessibilityLabel |
| accessibility-label | Redirected From | Page 1 | Missing AccessibilityLabel |
| script-unused-template | GetReportURLAndRedirect | — | Template helper "GetReportURLAndRedirect" is never referenced from any other script |
| distance-to-border | Top Form ID | Page 1 | Field is 10px from the right border (minimum: 30px) |
| distance-to-border | btnViewApplication | Page 1 | Field is 25px from the right border (minimum: 30px) |
| label-overlap | Status | Page 1 | Label "DataField3" overlaps field by 22px |
| label-overlap | Decline Reason | Page 1 | Label "DataField9" overlaps field by 20px |
| accessibility-label-match | btnViewApplication | Page 1 | AccessibilityLabel "View Apllication Button" does not match expected "View Application" |
| accessibility-label-match | Public Signature | Page 1 | AccessibilityLabel "Public Signature checkbox" does not match expected "Signature" |
| accessibility-label-match | btnSubmitSignature | Page 1 | AccessibilityLabel "Submit Signature Button" does not match expected "Submit Signature" |
| accessibility-label-match | btnDeclineSignature | Page 1 | AccessibilityLabel "Decline Button" does not match expected "Decline" |
| accessibility-label-match | btnAdminSave | Page 1 | AccessibilityLabel "Admin Save Button" does not match expected "Admin Save" |
| accessibility-label-match | Access Code | Page 1 | AccessibilityLabel "Tab Control" does not match expected "Access Code" |
| accessibility-label-match | Zip Code | Page 1 | AccessibilityLabel "Tab Control" does not match expected "Zip Code" |
| accessibility-label-match | ParentIsFPAN | Page 1 | AccessibilityLabel "ParentIsFPAN" does not match expected "Parent Is FPAN" |
| accessibility-label-match | ParentIsLTA | Page 1 | AccessibilityLabel "ParentIsLTA" does not match expected "Parent Is LTA" |
| accessibility-label-match | ParentIsLTA5DN | Page 1 | AccessibilityLabel "ParentIsLTA5DN" does not match expected "Parent Is LTA 5-Day Notice" |
| accessibility-label-match | ParentIsAerial | Page 1 | AccessibilityLabel "ParentIsAerial" does not match expected "Parent Is Aerial" |
| accessibility-label-match | ParentIsAmendment | Page 1 | AccessibilityLabel "ParentIsAmendment" does not match expected "Parent Is Amendment" |
| accessibility-label-match | ParentIsRenewal | Page 1 | AccessibilityLabel "ParentIsRenewal" does not match expected "Parent Is Renewal" |
| accessibility-label-match | ParentIsNoticeOfTransfer | Page 1 | AccessibilityLabel "ParentIsNoticeOfTransfer" does not match expected "Parent Is Notice Of Transfer" |
| tab-control-visible | TabControl | — | TabControl is in group "Hide Form Tabs" — tab visibility should be controlled via Menu tab, not groups |
| label-truncation | DataField2 | Page 1 | Label text "<b style="color:#9E0000;">*</b> Indicates required field" (~392px) may be truncated in 132px width — increase width or enable wrapping |
| label-truncation | Label57 | Page 1 | Label text "I acknowledge the following:" (~216px) may be truncated in 160px width — increase width or enable wrapping |
| label-truncation | Label30 | Page 1 | Label text "<b style="color:#9E0000;">*</b>The information on this application/notification is true." (~616px) may be truncated in 392px width — increase width or enable wrapping |
| label-truncation | Label61 | Page 1 | Label text "I/We acknowledge the following:" (~239px) may be truncated in 160px width — increase width or enable wrapping |
| label-truncation | Label63 | Page 1 | Label text "<b style="color:#9E0000;">*</b>The information on this application/notification is true." (~616px) may be truncated in 392px width — increase width or enable wrapping |
| label-truncation | Label74 | Page 1 | Label text "I/We acknowledge the following:" (~239px) may be truncated in 160px width — increase width or enable wrapping |
| label-truncation | Label76 | Page 1 | Label text "<b style="color:#9E0000;">*</b>The information on this application/notification is true." (~616px) may be truncated in 392px width — increase width or enable wrapping |
| label-truncation | Label89 | Page 1 | Label text "I/We acknowledge the following:" (~239px) may be truncated in 160px width — increase width or enable wrapping |
| label-truncation | Label91 | Page 1 | Label text "<b style="color:#9E0000;">*</b>The information on this application/notification is true." (~616px) may be truncated in 392px width — increase width or enable wrapping |
| label-truncation | Label104 | Page 1 | Label text "I/We acknowledge the following:" (~239px) may be truncated in 160px width — increase width or enable wrapping |
| label-truncation | Label106 | Page 1 | Label text "<b style="color:#9E0000;">*</b>The information on this application/notification is true." (~616px) may be truncated in 392px width — increase width or enable wrapping |
| label-truncation | Label118 | Page 1 | Label text "I/We acknowledge the following:" (~239px) may be truncated in 160px width — increase width or enable wrapping |
| label-truncation | Label60 | Page 1 | Label text "Type Name: <b style="color:red;">*</b>" (~266px) may be truncated in 82px width — increase width or enable wrapping |
| label-truncation | DataField11 | Page 1 | Label text "Contact Information Relation ID:" (~224px) may be truncated in 132px width — increase width or enable wrapping |

## Info

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| group-override-condition | Already Submited Read Only | — | Group does not reference an override field in its conditions |
| group-override-condition | Hide Form Tabs | — | Group does not reference an override field in its conditions |
| group-override-condition | Submit Signature Read Only | — | Group does not reference an override field in its conditions |
| label-unnamed-in-group | DataField2 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField12 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField1 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField4 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField3 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField5 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField10 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField7 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField8 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField9 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField11 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| spelling | Acknowledge One LTA | Page 1 | Possible misspelling: "LTA" (suggestions: LEA, ALTA, ETA) |
| spelling | Acknowledge Two LTA | Page 1 | Possible misspelling: "LTA" (suggestions: LEA, ALTA, ETA) |
| spelling | Acknowledge Three LTA | Page 1 | Possible misspelling: "LTA" (suggestions: LEA, ALTA, ETA) |
| spelling | Acknowledge Four LTA | Page 1 | Possible misspelling: "LTA" (suggestions: LEA, ALTA, ETA) |
| spelling | Acknowledge Five LTA | Page 1 | Possible misspelling: "LTA" (suggestions: LEA, ALTA, ETA) |
| spelling | Acknowledge One LTA5DN | Page 1 | Possible misspelling: "LTA5DN" (suggestions: no suggestions) |
| spelling | Acknowledge Two LTA5DN | Page 1 | Possible misspelling: "LTA5DN" (suggestions: no suggestions) |
| spelling | Acknowledge Three LTA5DN | Page 1 | Possible misspelling: "LTA5DN" (suggestions: no suggestions) |
| spelling | Acknowledge Four LTA5DN | Page 1 | Possible misspelling: "LTA5DN" (suggestions: no suggestions) |
| spelling | Acknowledge Five LTA5DN | Page 1 | Possible misspelling: "LTA5DN" (suggestions: no suggestions) |
| spelling | Acknowledge Six LTA5DN | Page 1 | Possible misspelling: "LTA5DN" (suggestions: no suggestions) |
| spelling | ParentIsFPAN | Page 1 | Possible misspelling: "ParentIsFPAN" (suggestions: no suggestions) |
| spelling | ParentIsLTA | Page 1 | Possible misspelling: "ParentIsLTA" (suggestions: no suggestions) |
| spelling | ParentIsLTA5DN | Page 1 | Possible misspelling: "ParentIsLTA5DN" (suggestions: no suggestions) |
| spelling | ParentIsAerial | Page 1 | Possible misspelling: "ParentIsAerial" (suggestions: no suggestions) |
| spelling | ParentIsAmendment | Page 1 | Possible misspelling: "ParentIsAmendment" (suggestions: no suggestions) |
| spelling | ParentIsRenewal | Page 1 | Possible misspelling: "ParentIsRenewal" (suggestions: no suggestions) |
| spelling | ParentIsNoticeOfTransfer | Page 1 | Possible misspelling: "ParentIsNoticeOfTransfer" (suggestions: no suggestions) |
| listener-disabled | Public Signature | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Related Record ID | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Public User | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Signature | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Contact Information Relation ID | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Access Code | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Zip Code | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| field-max-length | Type Name | Page 1 | MaxLength is 50 for name field — recommended minimum is 100 |
| field-max-length | Decline Reason | Page 1 | TextArea MaxLength is 50 — recommended minimum is 3000 for notes/text fields |
| font-consistency | Label71 | Page 1 | Label style differs from form pattern: fontSize=18 (expected 10), bold=true (expected false), color=#ffffffff (expected #FF000000) |
| font-consistency | DataField2 | Page 1 | Label style differs from form pattern: color=#ff000000 (expected #FF000000) |
| font-consistency | Label56 | Page 1 | Label style differs from form pattern: bold=true (expected false), color=#ff000000 (expected #FF000000) |
| font-consistency | DataField1 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff9e0000 (expected #FF000000) |
| font-consistency | DataField4 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10) |
| font-consistency | DataField3 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10) |
| font-consistency | Label38 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff000000 (expected #FF000000) |
| font-consistency | Label43 | Page 1 | Label style differs from form pattern: fontSize=9 (expected 10), color=#ff000000 (expected #FF000000) |
| font-consistency | DataField5 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff000000 (expected #FF000000) |
| font-consistency | Label54 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff000000 (expected #FF000000) |
