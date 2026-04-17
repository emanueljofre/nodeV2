# Standards Review: ActivityMapView

Generated: 2026-04-16 | Rules: 49 | Findings: 32 (4 errors, 13 warnings, 15 info)

## Summary

| Severity | Count |
| :------- | ----: |
| Error    | 4 |
| Warning  | 13 |
| Info     | 15 |

## Errors

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| script-orphan-assignment | btnTabFourOne_onClick | — | Script assignment references non-existent control ID: ede21e46-85e5-9232-15c3-572e995ebf29 |
| script-orphan-assignment | btnClose2_onClick | — | Script assignment references non-existent control ID: dcc4c208-d05e-cac1-fade-70334c13b657 |
| script-orphan-assignment | btnTabFourTwo_onClick | — | Script assignment references non-existent control ID: 63d8f4ec-1ad7-e63b-78c0-862e7b86c7fb |
| script-orphan-assignment | btnClose1_onClick | — | Script assignment references non-existent control ID: a4f97f0c-71b3-74d4-4ac2-3a7e899a1bce |

## Warnings

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| title-case | WebMapSelection | Page 1 | Field name "WebMapSelection" is not in Title Case |
| title-case | ActivityMapView | Page 1 | Field name "ActivityMapView" is not in Title Case |
| default-name | Image57 | Page 1 | Default field name "Image57" — use a descriptive name |
| accessibility-label | WebMapSelection | Page 1 | Missing AccessibilityLabel |
| accessibility-label | ActivityMapView | Page 1 | Missing AccessibilityLabel |
| container-responsive-flow | Container2 | Page 1 | Container has 3 fields but ResponsiveFlow is not set to 1 Column or 2 Columns (current: none) |
| distance-to-border | Top Form ID | Page 1 | Field is 10px from the right border (minimum: 30px) |
| label-overlap | WebMapSelection | Page 1 | Label "Label58" overlaps field by 12px |
| accessibility-label-match | btnAdminSave | Page 1 | AccessibilityLabel "Admin Save Button" does not match expected "Admin Save" |
| accessibility-label-match | Related Record ID | Page 1 | AccessibilityLabel "Tab Control" does not match expected "Related Record ID" |
| button-label-camelcase | ActivityMapViewLabel | Page 1 | Label name should start with "lbl" prefix (camelCase convention) |
| label-truncation | DataField2 | Page 1 | Label text "<strong style="color:#9E0000;">*</strong> Indicates required field" (~462px) may be truncated in 132px width — increase width or enable wrapping |
| label-truncation | Label62 | Page 1 | Label text "Related Record ID" (~119px) may be truncated in 82px width — increase width or enable wrapping |

## Info

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| label-unnamed-in-group | DataField2 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField4 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField3 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | ActivityMapViewLabel | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| spelling | WebMapSelection | Page 1 | Possible misspelling: "WebMapSelection" (suggestions: no suggestions) |
| spelling | ActivityMapView | Page 1 | Possible misspelling: "ActivityMapView" (suggestions: no suggestions) |
| listener-disabled | Related Record ID | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| field-max-length | ActivityMapView | Page 1 | TextArea MaxLength is 50 — recommended minimum is 3000 for notes/text fields |
| font-consistency | Label71 | Page 1 | Label style differs from form pattern: fontSize=18 (expected 10), bold=true (expected false), color=#ffffffff (expected #FF000000) |
| font-consistency | DataField2 | Page 1 | Label style differs from form pattern: color=#ff000000 (expected #FF000000) |
| font-consistency | Label56 | Page 1 | Label style differs from form pattern: bold=true (expected false), color=#ff000000 (expected #FF000000) |
| font-consistency | Label33 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff9e0000 (expected #FF000000) |
| font-consistency | Label38 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff000000 (expected #FF000000) |
| font-consistency | Label43 | Page 1 | Label style differs from form pattern: fontSize=9 (expected 10), color=#ff000000 (expected #FF000000) |
| font-consistency | Label41 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff000000 (expected #FF000000) |
