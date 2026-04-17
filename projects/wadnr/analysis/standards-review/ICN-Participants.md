# Standards Review: ICN-Participants

Generated: 2026-04-16 | Rules: 49 | Findings: 29 (4 errors, 10 warnings, 15 info)

## Summary

| Severity | Count |
| :------- | ----: |
| Error    | 4 |
| Warning  | 10 |
| Info     | 15 |

## Errors

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| script-orphan-assignment | btnTabFourTwo_onClick | — | Script assignment references non-existent control ID: 63d8f4ec-1ad7-e63b-78c0-862e7b86c7fb |
| script-orphan-assignment | btnTabFourOne_onClick | — | Script assignment references non-existent control ID: ede21e46-85e5-9232-15c3-572e995ebf29 |
| script-orphan-assignment | btnClose2_onClick | — | Script assignment references non-existent control ID: dcc4c208-d05e-cac1-fade-70334c13b657 |
| script-orphan-assignment | btnClose1_onClick | — | Script assignment references non-existent control ID: a4f97f0c-71b3-74d4-4ac2-3a7e899a1bce |

## Warnings

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| default-name | Image57 | Page 1 | Default field name "Image57" — use a descriptive name |
| accessibility-label | Participant Name | Page 1 | Missing AccessibilityLabel |
| accessibility-label | Attended | Page 1 | Missing AccessibilityLabel |
| accessibility-label | Related Record ID | Page 1 | Missing AccessibilityLabel |
| distance-to-border | Top Form ID | Page 1 | Field is 10px from the right border (minimum: 30px) |
| accessibility-label-match | Representing | Page 1 | AccessibilityLabel "Reviewer Type" does not match expected "Representing" |
| accessibility-label-match | btnSave | Page 1 | AccessibilityLabel "Save Button" does not match expected "Save" |
| accessibility-label-match | btnAdminSave | Page 1 | AccessibilityLabel "Admin Save Button" does not match expected "Admin Save" |
| label-truncation | DataField2 | Page 1 | Label text "<strong style="color:#9E0000;">*</strong> Indicates required field" (~462px) may be truncated in 132px width — increase width or enable wrapping |
| label-truncation | Label29 | Page 1 | Label text "Participant Name:" (~119px) may be truncated in 102px width — increase width or enable wrapping |

## Info

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| label-unnamed-in-group | DataField2 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField1 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| listener-disabled | Participant Name | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Representing | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Comments | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Attended | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Related Record ID | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| field-max-length | Comments | Page 1 | TextArea MaxLength is 50 — recommended minimum is 3000 for notes/text fields |
| font-consistency | Label71 | Page 1 | Label style differs from form pattern: fontSize=18 (expected 10), bold=true (expected false), color=#ffffffff (expected #ff000000) |
| font-consistency | Label56 | Page 1 | Label style differs from form pattern: bold=true (expected false) |
| font-consistency | Label33 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff9e0000 (expected #ff000000) |
| font-consistency | Label34 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), color=#FF000000 (expected #ff000000) |
| font-consistency | Label43 | Page 1 | Label style differs from form pattern: fontSize=9 (expected 10) |
| font-consistency | Label49 | Page 1 | Label style differs from form pattern: color=#FF000000 (expected #ff000000) |
| font-consistency | Label27 | Page 1 | Label style differs from form pattern: color=#FF000000 (expected #ff000000) |
