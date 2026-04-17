# Standards Review: Legal-Description

Generated: 2026-04-16 | Rules: 49 | Findings: 65 (5 errors, 20 warnings, 40 info)

## Summary

| Severity | Count |
| :------- | ----: |
| Error    | 5 |
| Warning  | 20 |
| Info     | 40 |

## Errors

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| script-orphan-assignment | btnHelpLegalDescription_onClick | — | Script assignment references non-existent control ID: e048cd9a-4361-9ee3-9174-fc4496aec1ef |
| script-orphan-assignment | btnClose2_onClick | — | Script assignment references non-existent control ID: dcc4c208-d05e-cac1-fade-70334c13b657 |
| script-orphan-assignment | btnTabFourTwo_onClick | — | Script assignment references non-existent control ID: 63d8f4ec-1ad7-e63b-78c0-862e7b86c7fb |
| script-orphan-assignment | btnClose1_onClick | — | Script assignment references non-existent control ID: a4f97f0c-71b3-74d4-4ac2-3a7e899a1bce |
| script-orphan-assignment | btnTabFourOne_onClick | — | Script assignment references non-existent control ID: ede21e46-85e5-9232-15c3-572e995ebf29 |

## Warnings

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| default-name | Image71 | Page 1 | Default field name "Image71" — use a descriptive name |
| accessibility-label | Temp Data Migration ID | Page 1 | Missing AccessibilityLabel |
| distance-to-border | Top Form ID | Page 1 | Field is 10px from the right border (minimum: 30px) |
| distance-to-border | btnHelpLegalDescription | Page 1 | Field is 20px from the right border (minimum: 30px) |
| accessibility-label-match | btnHelpLegalDescription | Page 1 | AccessibilityLabel "Help Button" does not match expected "?" |
| accessibility-label-match | btnSave | Page 1 | AccessibilityLabel "Save Button" does not match expected "Save" |
| accessibility-label-match | btnAdminSave | Page 1 | AccessibilityLabel "Admin Save Button" does not match expected "Admin Save" |
| tab-control-visible | TabControl | — | TabControl is in group "Hide Form Tabs" — tab visibility should be controlled via Menu tab, not groups |
| label-truncation | DataField2 | Page 1 | Label text "<b style="color:#9E0000;">*</b> Indicates required field" (~392px) may be truncated in 132px width — increase width or enable wrapping |
| label-truncation | Label33 | Page 1 | Label text "Visit the <a href="https://www.dnr.wa.gov/programs-and-services/forest-practices/review-applications-fpars/forest-practices-forms-and" target="_blank" style="color: forestgreen; font-weight: bold; text-decoration: underline;">Forest Practices Forms and Applications page</a> for more information on forest practices applications and forms." (~2373px) may be truncated in 840px width — increase width or enable wrapping |
| label-truncation | Label72 | Page 1 | Label text "Unit Number: <b style="color:#9E0000;">*</b>" (~308px) may be truncated in 92px width — increase width or enable wrapping |
| label-truncation | Label37 | Page 1 | Label text "Acres: <b style="color:#9E0000;">*</b>" (~266px) may be truncated in 92px width — increase width or enable wrapping |
| label-truncation | DataField4 | Page 1 | Label text "Section:<b style="color:#9E0000;">*</b>" (~273px) may be truncated in 72px width — increase width or enable wrapping |
| label-truncation | Label57 | Page 1 | Label text "Township:<b style="color:#9E0000;">*</b>" (~280px) may be truncated in 72px width — increase width or enable wrapping |
| label-truncation | Label59 | Page 1 | Label text "Range:<b style="color:#9E0000;">*</b>" (~259px) may be truncated in 62px width — increase width or enable wrapping |
| label-truncation | DataField6 | Page 1 | Label text "Range Direction:<b style="color:#9E0000;">*</b>" (~329px) may be truncated in 122px width — increase width or enable wrapping |
| label-truncation | Label58 | Page 1 | Label text "Tax Parcel Number:<b style="color:#9E0000;">*</b>" (~343px) may be truncated in 132px width — increase width or enable wrapping |
| label-truncation | Label60 | Page 1 | Label text "County:<b style="color:#9E0000;">*</b>" (~266px) may be truncated in 72px width — increase width or enable wrapping |
| label-truncation | DataField7 | Page 1 | Label text "Temp Data Migration ID:" (~161px) may be truncated in 122px width — increase width or enable wrapping |
| label-truncation | Label39 | Page 1 | Label text "Parent Context:" (~105px) may be truncated in 92px width — increase width or enable wrapping |

## Info

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| group-override-condition | Hide Form Tabs | — | Group does not reference an override field in its conditions |
| label-unnamed-in-group | DataField2 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField4 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField6 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField5 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField3 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField7 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| listener-disabled | Unit Number | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Acres | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Section | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Township | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Range | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Range Direction | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Tax Parcel Number | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | County | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Related Record ID | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Temp Data Migration ID | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Parent Context | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| field-max-length | Unit Number | Page 1 | MaxLength is 20 — recommended minimum is 50 |
| field-max-length | Acres | Page 1 | MaxLength is 5 — recommended minimum is 50 |
| field-max-length | Section | Page 1 | MaxLength is 5 — recommended minimum is 50 |
| field-max-length | Township | Page 1 | MaxLength is 5 — recommended minimum is 50 |
| field-max-length | Range | Page 1 | MaxLength is 5 — recommended minimum is 50 |
| field-max-length | Tax Parcel Number | Page 1 | MaxLength is 20 — recommended minimum is 50 |
| font-consistency | Label71 | Page 1 | Label style differs from form pattern: fontSize=18 (expected 10), bold=true (expected false), color=#ffffffff (expected #FF000000) |
| font-consistency | DataField2 | Page 1 | Label style differs from form pattern: color=#ff000000 (expected #FF000000) |
| font-consistency | DataField5 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff9e0000 (expected #FF000000) |
| font-consistency | Label34 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10) |
| font-consistency | DataField3 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10) |
| font-consistency | Label38 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff000000 (expected #FF000000) |
| font-consistency | Label43 | Page 1 | Label style differs from form pattern: fontSize=9 (expected 10), color=#ff000000 (expected #FF000000) |
| font-consistency | Label41 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff000000 (expected #FF000000) |
| data-lookup-in-properties | Range Direction | — | Script "Range_Direction_onBlur" on drop-down contains API calls — prefer configuring data lookups in the properties panel |
| data-lookup-in-properties | Range Direction | — | Script "Range_Direction_onChange" on drop-down contains API calls — prefer configuring data lookups in the properties panel |
| data-lookup-in-properties | County | — | Script "County_onChange" on drop-down contains API calls — prefer configuring data lookups in the properties panel |
| data-lookup-in-properties | County | — | Script "County_onBlur" on drop-down contains API calls — prefer configuring data lookups in the properties panel |
| field-width-standard | Acres | Page 1 | FieldTextbox3 width is 50px — recommended minimum is 80px |
| field-width-standard | Section | Page 1 | FieldTextbox3 width is 50px — recommended minimum is 80px |
| field-width-standard | Township | Page 1 | FieldTextbox3 width is 50px — recommended minimum is 80px |
| field-width-standard | Range | Page 1 | FieldTextbox3 width is 50px — recommended minimum is 80px |
