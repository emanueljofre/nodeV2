# Standards Review: NP-Waters

Generated: 2026-04-16 | Rules: 49 | Findings: 58 (14 errors, 14 warnings, 30 info)

## Summary

| Severity | Count |
| :------- | ----: |
| Error    | 14 |
| Warning  | 14 |
| Info     | 30 |

## Errors

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| script-orphan-assignment | Total_Wetland_Acres_onBlur | — | Script assignment references non-existent control ID: 5550a4b0-e923-7cd2-5ec5-537b9dc816e0 |
| script-orphan-assignment | Spoils_Area_Identifier_onBlur | — | Script assignment references non-existent control ID: f2a554aa-e36d-d9e1-c2f7-db9f7b09413f |
| script-orphan-assignment | How_Many_Acres_Will_Be_Drained_onBlur | — | Script assignment references non-existent control ID: 7f49d816-34a2-9af7-d738-eb9483e159d7 |
| script-orphan-assignment | Wetland_Type_onBlur | — | Script assignment references non-existent control ID: d2a05dbc-e7c6-0f68-1fc1-32410d406fec |
| script-orphan-assignment | Planned_Activities_In_Wetland_onBlur | — | Script assignment references non-existent control ID: 07852c66-08c4-d8a6-05ad-a7ee5955498b |
| script-orphan-assignment | Wetland_Identifier_onBlur | — | Script assignment references non-existent control ID: 12b0a5d5-7edf-3ec8-3b5b-e24c7c415361 |
| script-orphan-assignment | btnClose2_onClick | — | Script assignment references non-existent control ID: dcc4c208-d05e-cac1-fade-70334c13b657 |
| script-orphan-assignment | btnTabFourTwo_onClick | — | Script assignment references non-existent control ID: 63d8f4ec-1ad7-e63b-78c0-862e7b86c7fb |
| script-orphan-assignment | Amount_of_Spoils_Deposited_onBlur | — | Script assignment references non-existent control ID: f68c954c-1f47-4025-91d6-23c47ed7f95a |
| script-orphan-assignment | btnTabFourOne_onClick | — | Script assignment references non-existent control ID: ede21e46-85e5-9232-15c3-572e995ebf29 |
| script-orphan-assignment | How_Many_Acres_Will_Be_Filled_onBlur | — | Script assignment references non-existent control ID: 310affce-df3b-2095-06ed-6a6911e7c976 |
| script-orphan-assignment | btnClose1_onClick | — | Script assignment references non-existent control ID: a4f97f0c-71b3-74d4-4ac2-3a7e899a1bce |
| script-orphan-assignment | Planned_Activities_In_Maximum_Width_WMZ_onBlur | — | Script assignment references non-existent control ID: f22f0c84-cd63-25ef-f420-81ab1a87686a |
| script-field-reference | SaveForm | — | Script references non-existent field "Relationship Verified" via GetFieldValue() |

## Warnings

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| default-name | Image34 | Page 1 | Default field name "Image34" — use a descriptive name |
| distance-to-border | Top Form ID | Page 1 | Field is 10px from the right border (minimum: 30px) |
| accessibility-label-match | btnSave | Page 1 | AccessibilityLabel "Save Button" does not match expected "Save" |
| accessibility-label-match | btnAdminSave | Page 1 | AccessibilityLabel "Admin Save Button" does not match expected "Admin Save" |
| accessibility-label-match | Related Record ID | Page 1 | AccessibilityLabel "FPAN ID" does not match expected "Related Record ID" |
| accessibility-label-match | Region | Page 1 | AccessibilityLabel "Region required field" does not match expected "Region" |
| tab-control-visible | TabControl | — | TabControl is in group "Hide Form Tabs" — tab visibility should be controlled via Menu tab, not groups |
| label-truncation | DataField2 | Page 1 | Label text "<strong style="color:#9E0000;">*</strong> Indicates required field" (~462px) may be truncated in 132px width — increase width or enable wrapping |
| label-truncation | Label34 | Page 1 | Label text "Region:<strong style="color:#9E0000;">*</strong>" (~336px) may be truncated in 62px width — increase width or enable wrapping |
| label-truncation | lblStreamSegmentIdentifierRequired | Page 1 | Label text "Stream Segment Identifier:<strong style="color:#9E0000;">*</strong>" (~469px) may be truncated in 162px width — increase width or enable wrapping |
| label-truncation | lblTotalStreamLengthInHarvestUnitRequired | Page 1 | Label text "Total Stream Length in Harvest Unit:<strong style="color:#9E0000;">*</strong>" (~539px) may be truncated in 222px width — increase width or enable wrapping |
| label-truncation | lblLengthOfNoHarvest50FtRequired | Page 1 | Label text "Length of No-harvest 50-foot Buffers in Harvest Unit:<strong style="color:#9E0000;">*</strong>" (~658px) may be truncated in 322px width — increase width or enable wrapping |
| label-truncation | lblSelectedStrategyRequired | Page 1 | Label text "Selected Strategy:<strong style="color:#9E0000;">*</strong>" (~413px) may be truncated in 122px width — increase width or enable wrapping |
| label-truncation | Label70 | Page 1 | Label text "Related Record ID:" (~126px) may be truncated in 72px width — increase width or enable wrapping |

## Info

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| group-override-condition | Eastern Fields | — | Group does not reference an override field in its conditions |
| group-override-condition | Hide Form Tabs | — | Group does not reference an override field in its conditions |
| group-override-condition | Western Fields | — | Group does not reference an override field in its conditions |
| label-unnamed-in-group | DataField2 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | lblStreamSegmentIdentifierRequired | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | lblTotalStreamLengthInHarvestUnitRequired | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | lblLengthOfNoHarvest50FtRequired | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | lblSelectedStrategyRequired | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField3 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField1 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField4 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| spelling | Length Of No Harvest 50 Ft | Page 1 | Possible misspelling: "50" (suggestions: 0, 5) |
| listener-disabled | Region Zone | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Stream Segment Identifier | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Total Stream Length In Harvest Unit | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Length Of No Harvest 50 Ft | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Selected Strategy | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Related Record ID | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Region | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| font-consistency | Label71 | Page 1 | Label style differs from form pattern: fontSize=18 (expected 10), bold=true (expected false), color=#ffffffff (expected #FF000000) |
| font-consistency | DataField2 | Page 1 | Label style differs from form pattern: color=#ff000000 (expected #FF000000) |
| font-consistency | Label56 | Page 1 | Label style differs from form pattern: bold=true (expected false), color=#ff000000 (expected #FF000000) |
| font-consistency | Label33 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff9e0000 (expected #FF000000) |
| font-consistency | DataField4 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff000000 (expected #FF000000) |
| font-consistency | Label43 | Page 1 | Label style differs from form pattern: fontSize=9 (expected 10), color=#ff000000 (expected #FF000000) |
| font-consistency | Label41 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff000000 (expected #FF000000) |
| data-lookup-in-properties | Selected Strategy | — | Script "Selected_Strategy_onChange" on drop-down contains API calls — prefer configuring data lookups in the properties panel |
| data-lookup-in-properties | Selected Strategy | — | Script "Selected_Strategy_onBlur" on drop-down contains API calls — prefer configuring data lookups in the properties panel |
| field-width-standard | Region Zone | Page 1 | FieldTextbox3 width is 65px — recommended minimum is 80px |
| field-width-standard | Stream Segment Identifier | Page 1 | FieldTextbox3 width is 65px — recommended minimum is 80px |
