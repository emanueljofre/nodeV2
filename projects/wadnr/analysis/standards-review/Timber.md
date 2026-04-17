# Standards Review: Timber

Generated: 2026-04-16 | Rules: 49 | Findings: 115 (16 errors, 39 warnings, 60 info)

## Summary

| Severity | Count |
| :------- | ----: |
| Error    | 16 |
| Warning  | 39 |
| Info     | 60 |

## Errors

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| script-orphan-assignment | Salvage_Volume_Harvested_onBlur | — | Script assignment references non-existent control ID: 2d9f05c2-d918-91a3-5508-f19dc65ac040 |
| script-orphan-assignment | btnTabFourOne_onClick | — | Script assignment references non-existent control ID: ede21e46-85e5-9232-15c3-572e995ebf29 |
| script-orphan-assignment | Harvest_Type_All_onChange | — | Script assignment references non-existent control ID: 6786a259-e9b1-a516-6722-dde5b0d61073 |
| script-orphan-assignment | Logging_System_All_onChange | — | Script assignment references non-existent control ID: cdc2199f-e1ca-a0b5-e2b6-c3825154e047 |
| script-orphan-assignment | Volume_Harvested_Percentage_onBlur | — | Script assignment references non-existent control ID: eb4bb6d6-3251-9d66-2b06-427f8777151b |
| script-orphan-assignment | Harvest_Type_All_onBlur | — | Script assignment references non-existent control ID: 6786a259-e9b1-a516-6722-dde5b0d61073 |
| script-orphan-assignment | Less_than_10_dbh_onBlur | — | Script assignment references non-existent control ID: c7b7e591-aaae-3a69-19b9-3ae55a785775 |
| script-orphan-assignment | Greater_than_or_equal_to_10_dbh_onBlur | — | Script assignment references non-existent control ID: e239afd1-853a-f93f-b982-745cb7af9e42 |
| script-orphan-assignment | Logging_System_All_onBlur | — | Script assignment references non-existent control ID: cdc2199f-e1ca-a0b5-e2b6-c3825154e047 |
| script-orphan-assignment | btnTabFourTwo_onClick | — | Script assignment references non-existent control ID: 63d8f4ec-1ad7-e63b-78c0-862e7b86c7fb |
| script-orphan-assignment | Acres_Harvested_onBlur | — | Script assignment references non-existent control ID: 3d80d4de-8416-3365-7170-72f2d9b4df5f |
| script-orphan-assignment | Biomass_Volume_Harvested_onBlur | — | Script assignment references non-existent control ID: 81a00665-ee4d-a453-3e64-a015d33ea691 |
| script-orphan-assignment | btnClose1_onClick | — | Script assignment references non-existent control ID: a4f97f0c-71b3-74d4-4ac2-3a7e899a1bce |
| script-orphan-assignment | Volume_Harvested_onBlur | — | Script assignment references non-existent control ID: 46f44f8d-03da-cf0d-db8f-134ec261c78b |
| script-orphan-assignment | btnClose2_onClick | — | Script assignment references non-existent control ID: dcc4c208-d05e-cac1-fade-70334c13b657 |
| script-orphan-assignment | Steepest_Slope_Harvested_Unit_onBlur | — | Script assignment references non-existent control ID: 29b1c2a7-4395-268e-1df8-e2d8d643589c |

## Warnings

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| title-case | Greater than or equal to 10 dbh | Page 1 | Field name "Greater than or equal to 10 dbh" is not in Title Case |
| title-case | Less than 10 dbh | Page 1 | Field name "Less than 10 dbh" is not in Title Case |
| default-name | Image64 | Page 1 | Default field name "Image64" — use a descriptive name |
| accessibility-label | Acres Harvested | Page 1 | Missing AccessibilityLabel |
| accessibility-label | Volume Harvested | Page 1 | Missing AccessibilityLabel |
| accessibility-label | Biomass Volume Harvested | Page 1 | Missing AccessibilityLabel |
| accessibility-label | Volume Harvested Percentage | Page 1 | Missing AccessibilityLabel |
| accessibility-label | Steepest Slope Harvest Unit | Page 1 | Missing AccessibilityLabel |
| accessibility-label | Salvage Volume Harvested | Page 1 | Missing AccessibilityLabel |
| accessibility-label | Greater than or equal to 10 dbh | Page 1 | Missing AccessibilityLabel |
| accessibility-label | Less than 10 dbh | Page 1 | Missing AccessibilityLabel |
| accessibility-label | Temp Data Migration ID | Page 1 | Missing AccessibilityLabel |
| distance-to-border | Timber ID | Page 1 | Field is 10px from the right border (minimum: 30px) |
| accessibility-label-match | Cable Assist Tethered | Page 1 | AccessibilityLabel "Cable Assist Tethered" does not match expected "Cable assist/tethered" |
| accessibility-label-match | btnSave | Page 1 | AccessibilityLabel "Save Button" does not match expected "Save" |
| accessibility-label-match | btnAdminSave | Page 1 | AccessibilityLabel "Admin Save Button" does not match expected "Admin Save" |
| accessibility-label-match | Harvest Method List | Page 1 | AccessibilityLabel "Harvest Type List" does not match expected "Harvest Method List" |
| accessibility-label-match | Logging System List | Page 1 | AccessibilityLabel "Harvest Type List" does not match expected "Logging System List" |
| button-label-camelcase | Harvest Method | Page 1 | Label name should start with "lbl" prefix (camelCase convention) |
| button-label-camelcase | Logging System | Page 1 | Label name should start with "lbl" prefix (camelCase convention) |
| tab-control-visible | TabControl | — | TabControl is in group "Hide Form Tabs" — tab visibility should be controlled via Menu tab, not groups |
| label-truncation | DataField2 | Page 1 | Label text "<strong style="color:#9E0000;">*</strong> Indicates required field" (~462px) may be truncated in 132px width — increase width or enable wrapping |
| label-truncation | DataField1 | Page 1 | Label text "Region:<strong style="color:#9E0000;">*</strong>" (~336px) may be truncated in 160px width — increase width or enable wrapping |
| label-truncation | Label57 | Page 1 | Label text "Harvest Unit Number:<strong style="color:#9E0000;">*</strong>" (~427px) may be truncated in 160px width — increase width or enable wrapping |
| label-truncation | Harvest Method | Page 1 | Label text "Harvest Method:<strong style="color:#9E0000;">*</strong>" (~392px) may be truncated in 160px width — increase width or enable wrapping |
| label-truncation | Logging System | Page 1 | Label text "Logging System:<strong style="color:#9E0000;">*</strong>" (~392px) may be truncated in 160px width — increase width or enable wrapping |
| label-truncation | Label48 | Page 1 | Label text "Acres to be Harvested:<strong style="color:#9E0000;">*</strong>" (~441px) may be truncated in 152px width — increase width or enable wrapping |
| label-truncation | Label49 | Page 1 | Label text "Volume to be Harvested (mbf) :<strong style="color:#9E0000;">*</strong>" (~497px) may be truncated in 192px width — increase width or enable wrapping |
| label-truncation | Label50 | Page 1 | Label text "Biomass Volume to be Harvested (tonnage):<strong style="color:#9E0000;">*</strong>" (~574px) may be truncated in 272px width — increase width or enable wrapping |
| label-truncation | Label51 | Page 1 | Label text "Volume to be Harvested (%):<strong style="color:#9E0000;">*</strong>" (~476px) may be truncated in 182px width — increase width or enable wrapping |
| label-truncation | Label52 | Page 1 | Label text "Steepest Slope in Harvest Unit (%):<strong style="color:#9E0000;">*</strong>" (~532px) may be truncated in 242px width — increase width or enable wrapping |
| label-truncation | lblSalvageVolumeHarvested | Page 1 | Label text "Salvage Volume to be Harvested (%):<strong style="color:#9E0000;">*</strong>" (~532px) may be truncated in 232px width — increase width or enable wrapping |
| label-truncation | lblEstimatedNumOfTreesRemaining | Page 1 | Label text "Estimated Numbers of Trees per acre Remaining after Harvest:<strong style="color:#9E0000;">*</strong>" (~778px) may be truncated in 412px width — increase width or enable wrapping |
| label-truncation | lblGEQ10dbh | Page 1 | Label text "Greater than or equal to 10"dbh:<strong style="color:#9E0000;">*</strong>" (~511px) may be truncated in 272px width — increase width or enable wrapping |
| label-truncation | lblLT10dbh | Page 1 | Label text "Less than 10"dbh:<strong style="color:#9E0000;">*</strong>" (~406px) may be truncated in 272px width — increase width or enable wrapping |
| label-truncation | Label62 | Page 1 | Label text "Related Record ID:" (~126px) may be truncated in 82px width — increase width or enable wrapping |
| label-truncation | Label67 | Page 1 | Label text "Temp Data Migration ID:" (~161px) may be truncated in 82px width — increase width or enable wrapping |
| label-truncation | Label65 | Page 1 | Label text "Harvest Method List:" (~140px) may be truncated in 122px width — increase width or enable wrapping |
| label-truncation | DataField4 | Page 1 | Label text "Logging System List:" (~140px) may be truncated in 122px width — increase width or enable wrapping |

## Info

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| group-override-condition | Hide Form Tabs | — | Group does not reference an override field in its conditions |
| label-unnamed-in-group | DataField2 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField1 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | Harvest Method | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | Logging System | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | lblSalvageVolumeHarvested | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | lblEstimatedNumOfTreesRemaining | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | lblGEQ10dbh | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | lblLT10dbh | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField3 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField4 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| spelling | Rubber Tired Skidder | Page 1 | Possible misspelling: "Skidder" (suggestions: Skidded, Kidder) |
| spelling | Tracked Skidder | Page 1 | Possible misspelling: "Skidder" (suggestions: Skidded, Kidder) |
| spelling | Dozer | Page 1 | Possible misspelling: "Dozer" (suggestions: Doper, Doter, Dower) |
| spelling | Slash Bundler | Page 1 | Possible misspelling: "Bundler" (suggestions: Bundled, Bundle, Bundles) |
| spelling | Greater than or equal to 10 dbh | Page 1 | Possible misspelling: "10" (suggestions: 0, 1) |
| spelling | Greater than or equal to 10 dbh | Page 1 | Possible misspelling: "dbh" (suggestions: db, dbl, duh) |
| spelling | Less than 10 dbh | Page 1 | Possible misspelling: "10" (suggestions: 0, 1) |
| spelling | Less than 10 dbh | Page 1 | Possible misspelling: "dbh" (suggestions: db, dbl, duh) |
| listener-disabled | Region Zone | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Harvest Unit Number | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Even Aged | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Uneven Aged | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Salvage | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Right of Way | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Rubber Tired Skidder | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Tracked Skidder | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Dozer | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Shovel | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Full Suspension Cable | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Leading End Suspension Cable | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Helicopter | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Cable Assist Tethered | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Animal | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Chipper | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Forwarder | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Slash Bundler | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Other | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Acres Harvested | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Volume Harvested | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Biomass Volume Harvested | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Volume Harvested Percentage | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Steepest Slope Harvest Unit | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Salvage Volume Harvested | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Greater than or equal to 10 dbh | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Less than 10 dbh | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Related Record ID | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Region | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Temp Data Migration ID | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Harvest Method List | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Logging System List | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| font-consistency | Label71 | Page 1 | Label style differs from form pattern: fontSize=18 (expected 10), bold=true (expected false), color=#ffffffff (expected #FF000000) |
| font-consistency | DataField2 | Page 1 | Label style differs from form pattern: color=#ff000000 (expected #FF000000) |
| font-consistency | Label56 | Page 1 | Label style differs from form pattern: bold=true (expected false), color=#ff000000 (expected #FF000000) |
| font-consistency | lblEstimatedNumOfTreesRemaining | Page 1 | Label style differs from form pattern: bold=true (expected false) |
| font-consistency | Label33 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff9e0000 (expected #FF000000) |
| font-consistency | Label38 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff000000 (expected #FF000000) |
| font-consistency | Label43 | Page 1 | Label style differs from form pattern: fontSize=9 (expected 10), color=#ff000000 (expected #FF000000) |
| font-consistency | Label41 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff000000 (expected #FF000000) |
| field-width-standard | Region Zone | Page 1 | FieldTextbox3 width is 50px — recommended minimum is 80px |
