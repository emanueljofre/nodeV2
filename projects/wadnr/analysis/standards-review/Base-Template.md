# Standards Review: Base-Template

Generated: 2026-04-16 | Rules: 49 | Findings: 54 (2 errors, 38 warnings, 14 info)

## Summary

| Severity | Count |
| :------- | ----: |
| Error    | 2 |
| Warning  | 38 |
| Info     | 14 |

## Errors

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| script-orphan-assignment | btnClose2_onClick | — | Script assignment references non-existent control ID: dcc4c208-d05e-cac1-fade-70334c13b657 |
| script-orphan-assignment | btnClose1_onClick | — | Script assignment references non-existent control ID: a4f97f0c-71b3-74d4-4ac2-3a7e899a1bce |

## Warnings

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| title-case | DataField59 | Page 1 | Field name "DataField59" is not in Title Case |
| default-name | Image57 | Page 1 | Default field name "Image57" — use a descriptive name |
| default-name | DataField49 | Page 1 | Default field name "DataField49" — use a descriptive name |
| default-name | DataField50 | Page 1 | Default field name "DataField50" — use a descriptive name |
| default-name | DataField10 | Page 1 | Default field name "DataField10" — use a descriptive name |
| default-name | DataField54 | Page 1 | Default field name "DataField54" — use a descriptive name |
| default-name | DataField19 | Page 1 | Default field name "DataField19" — use a descriptive name |
| default-name | DataField16 | Page 1 | Default field name "DataField16" — use a descriptive name |
| default-name | DataField17 | Page 1 | Default field name "DataField17" — use a descriptive name |
| default-name | DataField55 | Page 1 | Default field name "DataField55" — use a descriptive name |
| default-name | UploadButton56 | Page 1 | Default field name "UploadButton56" — use a descriptive name |
| default-name | DataField58 | Page 1 | Default field name "DataField58" — use a descriptive name |
| accessibility-label | DataField49 | Page 1 | Missing AccessibilityLabel |
| accessibility-label | DataField50 | Page 1 | Missing AccessibilityLabel |
| accessibility-label | DataField10 | Page 1 | Missing AccessibilityLabel |
| accessibility-label | DataField54 | Page 1 | Missing AccessibilityLabel |
| accessibility-label | DataField19 | Page 1 | Missing AccessibilityLabel |
| accessibility-label | DataField16 | Page 1 | Missing AccessibilityLabel |
| accessibility-label | DataField17 | Page 1 | Missing AccessibilityLabel |
| accessibility-label | DataField55 | Page 1 | Missing AccessibilityLabel |
| accessibility-label | UploadButton56 | Page 1 | Missing AccessibilityLabel |
| accessibility-label | DataField58 | Page 1 | Missing AccessibilityLabel |
| accessibility-label | DataField59 | Page 1 | Missing AccessibilityLabel |
| default-text | btnNext | Page 1 | Field text "Next" is a default value |
| simple-upload | UploadButton56 | Page 1 | DisplayUploadedFiles is true — should be false (simple upload mode) |
| distance-to-border | Top Form ID | Page 1 | Field is 10px from the right border (minimum: 30px) |
| label-overlap | DataField10 | Page 1 | Label "Label6" overlaps field by 42px |
| label-overlap | DataField54 | Page 1 | Label "Label7" overlaps field by 50px |
| label-overlap | DataField19 | Page 1 | Label "Label18" overlaps field by 32px |
| label-overlap | DataField16 | Page 1 | Label "Label8" overlaps field by 50px |
| label-overlap | DataField59 | Page 1 | Label "Label60" overlaps field by 40px |
| accessibility-label-match | btnSave | Page 1 | AccessibilityLabel "Save Button" does not match expected "Save" |
| accessibility-label-match | btnBack | Page 1 | AccessibilityLabel "Back Button" does not match expected "Back" |
| accessibility-label-match | btnNext | Page 1 | AccessibilityLabel "Next Button" does not match expected "Next" |
| accessibility-label-match | btnAdminSave | Page 1 | AccessibilityLabel "Admin Save Button" does not match expected "Admin Save" |
| label-truncation | DataField2 | Page 1 | Label text "<strong style="color:#9E0000;">*</strong> Indicates required field" (~462px) may be truncated in 132px width — increase width or enable wrapping |
| label-truncation | Label47 | Page 1 | Label text "Medium Input: <b style="color:#9E0000;">*</b>" (~315px) may be truncated in 112px width — increase width or enable wrapping |
| label-truncation | Label54 | Page 1 | Label text "Extra Small Input:" (~126px) may be truncated in 112px width — increase width or enable wrapping |

## Info

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| label-unnamed-in-group | DataField2 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField3 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| font-consistency | Label71 | Page 1 | Label style differs from form pattern: fontSize=18 (expected 10), bold=true (expected false), color=#ffffffff (expected #FF000000) |
| font-consistency | Label56 | Page 1 | Label style differs from form pattern: bold=true (expected false), color=#ff000000 (expected #FF000000) |
| font-consistency | Label22 | Page 1 | Label style differs from form pattern: bold=true (expected false), color=#ff000000 (expected #FF000000) |
| font-consistency | Label23 | Page 1 | Label style differs from form pattern: fontSize=9 (expected 10), color=#ff000000 (expected #FF000000) |
| font-consistency | Label57 | Page 1 | Label style differs from form pattern: fontSize=9 (expected 10), color=#ff000000 (expected #FF000000) |
| font-consistency | Label55 | Page 1 | Label style differs from form pattern: bold=true (expected false), color=#ff000000 (expected #FF000000) |
| font-consistency | Label33 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff9e0000 (expected #FF000000) |
| font-consistency | Label34 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10) |
| font-consistency | DataField3 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10) |
| font-consistency | Label38 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff000000 (expected #FF000000) |
| font-consistency | Label43 | Page 1 | Label style differs from form pattern: fontSize=9 (expected 10), color=#ff000000 (expected #FF000000) |
| font-consistency | Label41 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff000000 (expected #FF000000) |
