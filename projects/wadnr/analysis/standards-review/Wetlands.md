# Standards Review: Wetlands

Generated: 2026-04-16 | Rules: 49 | Findings: 74 (9 errors, 36 warnings, 29 info)

## Summary

| Severity | Count |
| :------- | ----: |
| Error    | 9 |
| Warning  | 36 |
| Info     | 29 |

## Errors

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| script-orphan-assignment | btnClose1_onClick | — | Script assignment references non-existent control ID: a4f97f0c-71b3-74d4-4ac2-3a7e899a1bce |
| script-orphan-assignment | btnClose2_onClick | — | Script assignment references non-existent control ID: dcc4c208-d05e-cac1-fade-70334c13b657 |
| script-orphan-assignment | btnTabFourTwo_onClick | — | Script assignment references non-existent control ID: 63d8f4ec-1ad7-e63b-78c0-862e7b86c7fb |
| script-orphan-assignment | DataField43_onClick | — | Script assignment references non-existent control ID: 992d812b-1491-e96b-963c-6b0e46d7b964 |
| script-orphan-assignment | How_Many_Acres_Will_Be_Filled_onBlur | — | Script assignment references non-existent control ID: 310affce-df3b-2095-06ed-6a6911e7c976 |
| script-orphan-assignment | Total_Wetland_Acres_onBlur | — | Script assignment references non-existent control ID: 5550a4b0-e923-7cd2-5ec5-537b9dc816e0 |
| script-orphan-assignment | How_Many_Acres_Will_Be_Drained_onBlur | — | Script assignment references non-existent control ID: 7f49d816-34a2-9af7-d738-eb9483e159d7 |
| script-orphan-assignment | Wetland_Identifier_onBlur | — | Script assignment references non-existent control ID: 12b0a5d5-7edf-3ec8-3b5b-e24c7c415361 |
| script-orphan-assignment | btnTabFourOne_onClick | — | Script assignment references non-existent control ID: ede21e46-85e5-9232-15c3-572e995ebf29 |

## Warnings

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| title-case | Planned Activities In Maximum Width WMZ | Page 1 | Field name "Planned Activities In Maximum Width WMZ" is not in Title Case |
| default-name | Image34 | Page 1 | Default field name "Image34" — use a descriptive name |
| accessibility-label | Wetland Identifier | Page 1 | Missing AccessibilityLabel |
| accessibility-label | Total Wetland Acres | Page 1 | Missing AccessibilityLabel |
| accessibility-label | How Many Acres Will Be Drained | Page 1 | Missing AccessibilityLabel |
| accessibility-label | How Many Acres Will Be Filled | Page 1 | Missing AccessibilityLabel |
| accessibility-label | Temp Data Migration ID | Page 1 | Missing AccessibilityLabel |
| accessibility-required | Planned Activities In Maximum Width WMZ | Page 1 | Required field AccessibilityLabel "Planned Activities In Maximum Width WMZ required field" should end with "field Required" |
| distance-to-border | Top Form ID | Page 1 | Field is 10px from the right border (minimum: 30px) |
| button-min-size | btnHelpWetlandIdentifier | Page 1 | Button is 20x20px — minimum is 24x24px (508 compliance) |
| button-min-size | btnHelpWetlandType | Page 1 | Button is 20x20px — minimum is 24x24px (508 compliance) |
| button-min-size | btnHelpPlannedActivitiesInWetland | Page 1 | Button is 20x20px — minimum is 24x24px (508 compliance) |
| button-min-size | btnHelpPlannedActivitiesInMaxWidthWMZ | Page 1 | Button is 20x20px — minimum is 24x24px (508 compliance) |
| button-min-size | btnHelpTotalWetlandAcres | Page 1 | Button is 20x20px — minimum is 24x24px (508 compliance) |
| button-min-size | btnHelpDrainedAcres | Page 1 | Button is 20x20px — minimum is 24x24px (508 compliance) |
| button-min-size | btnHelpFilledAcres | Page 1 | Button is 20x20px — minimum is 24x24px (508 compliance) |
| accessibility-label-match | btnHelpWetlandIdentifier | Page 1 | AccessibilityLabel "Wetland Identifier Help Button" does not match expected "?" |
| accessibility-label-match | btnHelpWetlandType | Page 1 | AccessibilityLabel "Wetland Type Help Button" does not match expected "?" |
| accessibility-label-match | btnHelpPlannedActivitiesInWetland | Page 1 | AccessibilityLabel "Planned Activities in Wetland Help Button" does not match expected "?" |
| accessibility-label-match | Planned Activities In Maximum Width WMZ | Page 1 | AccessibilityLabel "Planned Activities In Maximum Width WMZ required field" does not match expected "Planned Activities in Maximum Width WMZ" |
| accessibility-label-match | btnHelpPlannedActivitiesInMaxWidthWMZ | Page 1 | AccessibilityLabel "Planned Activities in Maximum Width WMZ Help Button" does not match expected "?" |
| accessibility-label-match | btnHelpTotalWetlandAcres | Page 1 | AccessibilityLabel "Total Wetland Acres Help Button" does not match expected "?" |
| accessibility-label-match | btnHelpDrainedAcres | Page 1 | AccessibilityLabel "How Many Acres Will be Drained Help Button" does not match expected "?" |
| accessibility-label-match | btnHelpFilledAcres | Page 1 | AccessibilityLabel "How Many Acres Will be Filled Help Button" does not match expected "?" |
| accessibility-label-match | btnSave | Page 1 | AccessibilityLabel "Save Button" does not match expected "Save" |
| accessibility-label-match | btnAdminSave | Page 1 | AccessibilityLabel "Admin Save Button" does not match expected "Admin Save" |
| button-label-camelcase | fpOnlineTitle | Page 1 | Label name should start with "lbl" prefix (camelCase convention) |
| tab-control-visible | TabControl | — | TabControl is in group "Hide Form Tabs" — tab visibility should be controlled via Menu tab, not groups |
| label-truncation | DataField2 | Page 1 | Label text "<strong style="color:#9E0000;">*</strong> Indicates required field" (~462px) may be truncated in 132px width — increase width or enable wrapping |
| label-truncation | Label59 | Page 1 | Label text "Planned Activities in Wetland:<strong style="color:#9E0000;">*</strong>" (~497px) may be truncated in 192px width — increase width or enable wrapping |
| label-truncation | Label60 | Page 1 | Label text "Planned Activities in Maximum Width WMZ:<strong style="color:#9E0000;">*</strong>" (~567px) may be truncated in 282px width — increase width or enable wrapping |
| label-truncation | Label66 | Page 1 | Label text "How many Acres Will be Drained:<strong style="color:#9E0000;">*</strong>" (~504px) may be truncated in 222px width — increase width or enable wrapping |
| label-truncation | Label68 | Page 1 | Label text "How many Acres Will be Filled:<strong style="color:#9E0000;">*</strong>" (~497px) may be truncated in 322px width — increase width or enable wrapping |
| label-truncation | DataField4 | Page 1 | Label text "Related Record ID:" (~126px) may be truncated in 72px width — increase width or enable wrapping |
| label-truncation | DataField1 | Page 1 | Label text "Temp Data Migration ID:" (~161px) may be truncated in 72px width — increase width or enable wrapping |
| label-truncation | Label36 | Page 1 | Label text "Parent Context:" (~105px) may be truncated in 72px width — increase width or enable wrapping |

## Info

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| group-override-condition | Hide Form Tabs | — | Group does not reference an override field in its conditions |
| label-unnamed-in-group | fpOnlineTitle | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField2 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | lblWetlandIdentifier | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | lblWetlandType | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | lblTotalWetlandAcres | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField3 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField4 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField1 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| spelling | Planned Activities In Maximum Width WMZ | Page 1 | Possible misspelling: "WMZ" (suggestions: DMZ, WIZ, WM) |
| listener-disabled | Wetland Identifier | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Wetland Type | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Planned Activities In Wetland | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Planned Activities In Maximum Width WMZ | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Total Wetland Acres | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | How Many Acres Will Be Drained | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | How Many Acres Will Be Filled | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Status | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Related Record ID | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Temp Data Migration ID | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Parent Context | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| font-consistency | fpOnlineTitle | Page 1 | Label style differs from form pattern: fontSize=18 (expected 10), bold=true (expected false), color=#ffffffff (expected #FF000000) |
| font-consistency | DataField2 | Page 1 | Label style differs from form pattern: color=#ff000000 (expected #FF000000) |
| font-consistency | Label56 | Page 1 | Label style differs from form pattern: bold=true (expected false), color=#ff000000 (expected #FF000000) |
| font-consistency | Label33 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff9e0000 (expected #FF000000) |
| font-consistency | Label38 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff000000 (expected #FF000000) |
| font-consistency | Label43 | Page 1 | Label style differs from form pattern: fontSize=9 (expected 10), color=#ff000000 (expected #FF000000) |
| font-consistency | Label41 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff000000 (expected #FF000000) |
| data-lookup-in-properties | Wetland Type | — | Script "Wetland_Type_onBlur" on drop-down contains API calls — prefer configuring data lookups in the properties panel |
