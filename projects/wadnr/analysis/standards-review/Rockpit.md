# Standards Review: Rockpit

Generated: 2026-04-16 | Rules: 49 | Findings: 39 (11 errors, 12 warnings, 16 info)

## Summary

| Severity | Count |
| :------- | ----: |
| Error    | 11 |
| Warning  | 12 |
| Info     | 16 |

## Errors

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| script-orphan-assignment | btnTabFourTwo_onClick | — | Script assignment references non-existent control ID: 63d8f4ec-1ad7-e63b-78c0-862e7b86c7fb |
| script-orphan-assignment | Total_Wetland_Acres_onBlur | — | Script assignment references non-existent control ID: 5550a4b0-e923-7cd2-5ec5-537b9dc816e0 |
| script-orphan-assignment | How_Many_Acres_Will_Be_Filled_onBlur | — | Script assignment references non-existent control ID: 310affce-df3b-2095-06ed-6a6911e7c976 |
| script-orphan-assignment | Planned_Activities_In_Maximum_Width_WMZ_onBlur | — | Script assignment references non-existent control ID: f22f0c84-cd63-25ef-f420-81ab1a87686a |
| script-orphan-assignment | Wetland_Type_onBlur | — | Script assignment references non-existent control ID: d2a05dbc-e7c6-0f68-1fc1-32410d406fec |
| script-orphan-assignment | Wetland_Identifier_onBlur | — | Script assignment references non-existent control ID: 12b0a5d5-7edf-3ec8-3b5b-e24c7c415361 |
| script-orphan-assignment | Planned_Activities_In_Wetland_onBlur | — | Script assignment references non-existent control ID: 07852c66-08c4-d8a6-05ad-a7ee5955498b |
| script-orphan-assignment | btnClose2_onClick | — | Script assignment references non-existent control ID: dcc4c208-d05e-cac1-fade-70334c13b657 |
| script-orphan-assignment | How_Many_Acres_Will_Be_Drained_onBlur | — | Script assignment references non-existent control ID: 7f49d816-34a2-9af7-d738-eb9483e159d7 |
| script-orphan-assignment | btnTabFourOne_onClick | — | Script assignment references non-existent control ID: ede21e46-85e5-9232-15c3-572e995ebf29 |
| script-orphan-assignment | btnClose1_onClick | — | Script assignment references non-existent control ID: a4f97f0c-71b3-74d4-4ac2-3a7e899a1bce |

## Warnings

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| default-name | Image26 | Page 1 | Default field name "Image26" — use a descriptive name |
| distance-to-border | Top Form ID | Page 1 | Field is 10px from the right border (minimum: 30px) |
| accessibility-label-match | btnSave | Page 1 | AccessibilityLabel "Save Button" does not match expected "Save" |
| accessibility-label-match | btnAdminSave | Page 1 | AccessibilityLabel "Admin Save Button" does not match expected "Admin Save" |
| accessibility-label-match | Related Record ID | Page 1 | AccessibilityLabel "FPAN ID" does not match expected "Related Record ID" |
| button-label-camelcase | fpOnlineTitle | Page 1 | Label name should start with "lbl" prefix (camelCase convention) |
| tab-control-visible | TabControl | — | TabControl is in group "Hide Form Tabs" — tab visibility should be controlled via Menu tab, not groups |
| label-truncation | DataField2 | Page 1 | Label text "<strong style="color:#9E0000;">*</strong> Indicates required field" (~462px) may be truncated in 132px width — increase width or enable wrapping |
| label-truncation | Label34 | Page 1 | Label text "Rockpit Identifier:<strong style="color:#9E0000;">*</strong>" (~420px) may be truncated in 160px width — increase width or enable wrapping |
| label-truncation | Label35 | Page 1 | Label text "Acres of New Rock Pit Developed:" (~224px) may be truncated in 160px width — increase width or enable wrapping |
| label-truncation | Label26 | Page 1 | Label text "Acres of Existing Rock Pit Developed:" (~259px) may be truncated in 160px width — increase width or enable wrapping |
| label-truncation | Label70 | Page 1 | Label text "Related Record ID:" (~126px) may be truncated in 72px width — increase width or enable wrapping |

## Info

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| group-override-condition | Hide Form Tabs | — | Group does not reference an override field in its conditions |
| label-unnamed-in-group | fpOnlineTitle | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField2 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField3 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField1 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField4 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| spelling | Rockpit Identifier | Page 1 | Possible misspelling: "Rockpit" (suggestions: Cockpit) |
| spelling | Rockpit ID | Page 1 | Possible misspelling: "Rockpit" (suggestions: Cockpit) |
| font-consistency | fpOnlineTitle | Page 1 | Label style differs from form pattern: fontSize=18 (expected 10), bold=true (expected false), color=#ffffffff (expected #FF000000) |
| font-consistency | DataField2 | Page 1 | Label style differs from form pattern: color=#ff000000 (expected #FF000000) |
| font-consistency | Label56 | Page 1 | Label style differs from form pattern: bold=true (expected false), color=#ff000000 (expected #FF000000) |
| font-consistency | Label33 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff9e0000 (expected #FF000000) |
| font-consistency | DataField4 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff000000 (expected #FF000000) |
| font-consistency | Label43 | Page 1 | Label style differs from form pattern: fontSize=9 (expected 10), color=#ff000000 (expected #FF000000) |
| font-consistency | Label41 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff000000 (expected #FF000000) |
| field-width-standard | Rockpit Identifier | Page 1 | FieldTextbox3 width is 65px — recommended minimum is 80px |
