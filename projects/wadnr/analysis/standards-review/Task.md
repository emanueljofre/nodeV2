# Standards Review: Task

Generated: 2026-04-16 | Rules: 49 | Findings: 64 (2 errors, 25 warnings, 37 info)

## Summary

| Severity | Count |
| :------- | ----: |
| Error    | 2 |
| Warning  | 25 |
| Info     | 37 |

## Errors

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| script-orphan-assignment | btnClose2_onClick | — | Script assignment references non-existent control ID: dcc4c208-d05e-cac1-fade-70334c13b657 |
| script-orphan-assignment | btnClose1_onClick | — | Script assignment references non-existent control ID: a4f97f0c-71b3-74d4-4ac2-3a7e899a1bce |

## Warnings

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| title-case | DNR Staff Assigned | Page 1 | Field name "DNR Staff Assigned" is not in Title Case |
| title-case | DNR Staff Assigned User ID | Page 1 | Field name "DNR Staff Assigned User ID" is not in Title Case |
| title-case | UserRoles | Page 1 | Field name "UserRoles" is not in Title Case |
| title-case | IsOfficeStaff | Page 1 | Field name "IsOfficeStaff" is not in Title Case |
| title-case | isInternalPersonnel | Page 1 | Field name "isInternalPersonnel" is not in Title Case |
| title-case | isFieldStaff | Page 1 | Field name "isFieldStaff" is not in Title Case |
| title-case | isGISEditor | Page 1 | Field name "isGISEditor" is not in Title Case |
| title-case | IsCurrentUserCreator | Page 1 | Field name "IsCurrentUserCreator" is not in Title Case |
| title-case | IsCurrentUserAssignee | Page 1 | Field name "IsCurrentUserAssignee" is not in Title Case |
| title-case | Notification was send | Page 1 | Field name "Notification was send" is not in Title Case |
| default-name | Image57 | Page 1 | Default field name "Image57" — use a descriptive name |
| accessibility-label | Form Saved | Page 1 | Missing AccessibilityLabel |
| accessibility-required | DNR Staff Assigned | Page 1 | Required field AccessibilityLabel "DNR Staff Assigned" should end with "field Required" |
| accessibility-required | Title | Page 1 | Required field AccessibilityLabel "Title" should end with "field Required" |
| distance-to-border | Top Form ID | Page 1 | Field is 10px from the right border (minimum: 30px) |
| accessibility-label-match | btnSave | Page 1 | AccessibilityLabel "Save Button" does not match expected "Save" |
| accessibility-label-match | btnComplete | Page 1 | AccessibilityLabel "Complete Button" does not match expected "Complete" |
| accessibility-label-match | btnAdminSave | Page 1 | AccessibilityLabel "Admin Save Button" does not match expected "Admin Save" |
| accessibility-label-match | Creator Position Management Form ID | Page 1 | AccessibilityLabel "Creator Position Management Form ID" does not match expected "Creator PM Form ID" |
| accessibility-label-match | Notification was send | Page 1 | AccessibilityLabel "IsCurrentUserCreator" does not match expected "Notification was send" |
| label-truncation | DataField2 | Page 1 | Label text "<strong style="color:#9E0000;">*</strong> Indicates required field" (~462px) may be truncated in 132px width — increase width or enable wrapping |
| label-truncation | Label7 | Page 1 | Label text "DNR Staff Assigned: <strong style="color:#9E0000;">*</strong>" (~427px) may be truncated in 132px width — increase width or enable wrapping |
| label-truncation | Label36 | Page 1 | Label text "Title: <strong style="color:#9E0000;">*</strong>" (~336px) may be truncated in 132px width — increase width or enable wrapping |
| label-truncation | Label42 | Page 1 | Label text "DNR Staff Assigned User ID:" (~189px) may be truncated in 160px width — increase width or enable wrapping |
| label-wrap-textbox | DataField6 | Page 1 | Label text "Creator PM Form ID:" wraps at 130px width next to "Creator Position Management Form ID" — widen label or shorten text |

## Info

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| calendar-name-match | Date Created | Page 1 | Name suggests date-only but enableTime is ON (Config D: DateTime + IgnoreTZ) — verify time component is needed |
| label-unnamed-in-group | DataField2 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField3 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField1 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField4 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField5 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField6 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| spelling | DNR Staff Assigned | Page 1 | Possible misspelling: "DNR" (suggestions: DVR, DAR, DIR) |
| spelling | DNR Staff Assigned User ID | Page 1 | Possible misspelling: "DNR" (suggestions: DVR, DAR, DIR) |
| spelling | UserRoles | Page 1 | Possible misspelling: "UserRoles" (suggestions: no suggestions) |
| spelling | IsOfficeStaff | Page 1 | Possible misspelling: "IsOfficeStaff" (suggestions: no suggestions) |
| spelling | isInternalPersonnel | Page 1 | Possible misspelling: "isInternalPersonnel" (suggestions: no suggestions) |
| spelling | isFieldStaff | Page 1 | Possible misspelling: "isFieldStaff" (suggestions: no suggestions) |
| spelling | isGISEditor | Page 1 | Possible misspelling: "isGISEditor" (suggestions: no suggestions) |
| spelling | IsCurrentUserCreator | Page 1 | Possible misspelling: "IsCurrentUserCreator" (suggestions: no suggestions) |
| spelling | IsCurrentUserAssignee | Page 1 | Possible misspelling: "IsCurrentUserAssignee" (suggestions: no suggestions) |
| listener-disabled | DNR Staff Assigned | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Title | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Status | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Creator | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Date Created | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Date Completed | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | DNR Staff Assigned User ID | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | UserRoles | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | IsOfficeStaff | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | isInternalPersonnel | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | isFieldStaff | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| field-max-length | Description of Task | Page 1 | TextArea MaxLength is 2000 — recommended minimum is 3000 for notes/text fields |
| font-consistency | Label71 | Page 1 | Label style differs from form pattern: fontSize=18 (expected 10), bold=true (expected false), color=#ffffffff (expected #FF000000) |
| font-consistency | DataField2 | Page 1 | Label style differs from form pattern: color=#ff000000 (expected #FF000000) |
| font-consistency | Label56 | Page 1 | Label style differs from form pattern: color=#ff000000 (expected #FF000000) |
| font-consistency | Label23 | Page 1 | Label style differs from form pattern: fontSize=9 (expected 10), color=#ff000000 (expected #FF000000) |
| font-consistency | Label33 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff9e0000 (expected #FF000000) |
| font-consistency | Label38 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff000000 (expected #FF000000) |
| font-consistency | Label43 | Page 1 | Label style differs from form pattern: fontSize=9 (expected 10), color=#ff000000 (expected #FF000000) |
| font-consistency | Label41 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff000000 (expected #FF000000) |
| data-lookup-in-properties | DNR Staff Assigned | — | Script "DNR_Staff_Assigned_onBlur" on drop-down contains API calls — prefer configuring data lookups in the properties panel |
