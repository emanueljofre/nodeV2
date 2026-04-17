# Standards Review: Water-Crossings

Generated: 2026-04-16 | Rules: 49 | Findings: 88 (10 errors, 46 warnings, 32 info)

## Summary

| Severity | Count |
| :------- | ----: |
| Error    | 10 |
| Warning  | 46 |
| Info     | 32 |

## Errors

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| script-orphan-assignment | 0dafa57d-be80-3495-df7d-c041c48e97a2 | — | Script assignment references non-existent control ID: 7e632f3c-5fc2-09a8-f24f-d2ef6b8cb69d |
| script-orphan-assignment | 36cbff5d-3373-25b4-aca7-2dfea8e40662 | — | Script assignment references non-existent control ID: 7e632f3c-5fc2-09a8-f24f-d2ef6b8cb69d |
| script-orphan-assignment | df4e4d40-1144-682a-b84a-db732b725f30 | — | Script assignment references non-existent control ID: 6c3a886b-0ce9-542c-6b93-7fc108dc0b31 |
| script-orphan-assignment | btnClose1_onClick | — | Script assignment references non-existent control ID: a4f97f0c-71b3-74d4-4ac2-3a7e899a1bce |
| script-orphan-assignment | btnTabFourTwo_onClick | — | Script assignment references non-existent control ID: 63d8f4ec-1ad7-e63b-78c0-862e7b86c7fb |
| script-orphan-assignment | e2c41ccb-0afc-8fff-ade0-fe720ef6903f | — | Script assignment references non-existent control ID: d22296ef-5090-c928-0790-676bed024a89 |
| script-orphan-assignment | btnClose2_onClick | — | Script assignment references non-existent control ID: dcc4c208-d05e-cac1-fade-70334c13b657 |
| script-orphan-assignment | c905b1c0-3694-137b-ef26-fdeaaf552eb9 | — | Script assignment references non-existent control ID: 6c3a886b-0ce9-542c-6b93-7fc108dc0b31 |
| script-orphan-assignment | 73cb8bfe-6940-085a-5f90-2fe89b803fc6 | — | Script assignment references non-existent control ID: d22296ef-5090-c928-0790-676bed024a89 |
| script-orphan-assignment | btnTabFourOne_onClick | — | Script assignment references non-existent control ID: ede21e46-85e5-9232-15c3-572e995ebf29 |

## Warnings

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| title-case | FPAN ID | Page 1 | Field name "FPAN ID" is not in Title Case |
| default-name | Image43 | Page 1 | Default field name "Image43" — use a descriptive name |
| accessibility-label | Proposed Size Width in Inches X | Page 1 | Missing AccessibilityLabel |
| accessibility-label | Proposed Size Width in Inches Y | Page 1 | Missing AccessibilityLabel |
| accessibility-label | Proposed Size Length Feet | Page 1 | Missing AccessibilityLabel |
| accessibility-label | Temp Data Migration ID | Page 1 | Missing AccessibilityLabel |
| accessibility-label | Culvert Design Method Option | Page 1 | Missing AccessibilityLabel |
| accessibility-required | Crossing Identifier | Page 1 | Required field AccessibilityLabel "Crossing Identifier required field" should end with "field Required" |
| accessibility-required | Structure Type | Page 1 | Required field AccessibilityLabel "Structure Type" should end with "field Required" |
| script-unused-template | DismissSaveModal | — | Template helper "DismissSaveModal" is never referenced from any other script |
| container-responsive-flow | Con_Proposed_Size_Width_Length | Page 1 | Container has 7 fields but ResponsiveFlow is not set to 1 Column or 2 Columns (current: none) |
| distance-to-border | Top Form ID | Page 1 | Field is 10px from the right border (minimum: 30px) |
| label-overlap | Proposed Size Width in Inches X | Page 1 | Label "Label47" overlaps field by 10px |
| label-overlap | Proposed Size Length Feet | Page 1 | Label "Label48" overlaps field by 10px |
| button-min-size | btn_HelpCrossingIdentifier | Page 1 | Button is 20x20px — minimum is 24x24px (508 compliance) |
| button-min-size | btn_HelpProposedSizeWidthInches | Page 1 | Button is 20x20px — minimum is 24x24px (508 compliance) |
| button-min-size | btn_HelpCulvertDesign | Page 1 | Button is 20x20px — minimum is 24x24px (508 compliance) |
| button-min-size | btn_HelpChannelBedWidth | Page 1 | Button is 20x20px — minimum is 24x24px (508 compliance) |
| button-min-size | btn_HelpStreamGradient | Page 1 | Button is 20x20px — minimum is 24x24px (508 compliance) |
| accessibility-label-match | Crossing Identifier | Page 1 | AccessibilityLabel "Crossing Identifier required field" does not match expected "Crossing Identifier" |
| accessibility-label-match | btn_HelpCrossingIdentifier | Page 1 | AccessibilityLabel "Quick Help: Proposed Size Width in Inches" does not match expected "?" |
| accessibility-label-match | btn_HelpProposedSizeWidthInches | Page 1 | AccessibilityLabel "Quick Help: Proposed Size Width in Inches" does not match expected "?" |
| accessibility-label-match | btn_HelpCulvertDesign | Page 1 | AccessibilityLabel "Quick Help: Culvert Design Method" does not match expected "?" |
| accessibility-label-match | Channel Bed Width | Page 1 | AccessibilityLabel "Channel Bed Width" does not match expected "Channel Bed Width (ft)" |
| accessibility-label-match | btn_HelpChannelBedWidth | Page 1 | AccessibilityLabel "Quick Help: Channel Bed Width" does not match expected "?" |
| accessibility-label-match | Stream Gradient | Page 1 | AccessibilityLabel "Stream Gradient" does not match expected "Stream Gradient (%)" |
| accessibility-label-match | btn_HelpStreamGradient | Page 1 | AccessibilityLabel "Quick Help: Stream Gradient" does not match expected "?" |
| accessibility-label-match | btnSave | Page 1 | AccessibilityLabel "Save Button" does not match expected "Save" |
| accessibility-label-match | btnAdminSave | Page 1 | AccessibilityLabel "Admin Save Button" does not match expected "Admin Save" |
| accessibility-label-match | Make Questions Mandatory | Page 1 | AccessibilityLabel "Make Questions Mandatory" does not match expected "Make Last Questions Mandatory" |
| button-label-camelcase | Label Culvert Design Not Mandatory | Page 1 | Label name should start with "lbl" prefix (camelCase convention) |
| button-label-camelcase | Label Culvert Design Mandatory | Page 1 | Label name should start with "lbl" prefix (camelCase convention) |
| button-label-camelcase | Label Channel Bed Not Mandatory | Page 1 | Label name should start with "lbl" prefix (camelCase convention) |
| button-label-camelcase | Label Channel Bed Mandatory | Page 1 | Label name should start with "lbl" prefix (camelCase convention) |
| button-label-camelcase | Label Stream Gradient Not Mandatory | Page 1 | Label name should start with "lbl" prefix (camelCase convention) |
| button-label-camelcase | Label Stream Gradient Mandatory | Page 1 | Label name should start with "lbl" prefix (camelCase convention) |
| tab-control-visible | TabControl | — | TabControl is in group "Hide Form Tabs" — tab visibility should be controlled via Menu tab, not groups |
| label-truncation | DataField2 | Page 1 | Label text "<strong style="color:#9E0000;">*</strong> Indicates required field" (~462px) may be truncated in 132px width — increase width or enable wrapping |
| label-truncation | Label20 | Page 1 | Label text "Crossing Identifier:<strong style="color:#9E0000;">*</strong>" (~427px) may be truncated in 132px width — increase width or enable wrapping |
| label-truncation | Label22 | Page 1 | Label text "Water Type:<strong style="color:#9E0000;">*</strong>" (~364px) may be truncated in 102px width — increase width or enable wrapping |
| label-truncation | Label25 | Page 1 | Label text "Planned Activity:<strong style="color:#9E0000;">*</strong>" (~406px) may be truncated in 112px width — increase width or enable wrapping |
| label-truncation | Label27 | Page 1 | Label text "Structure Type:<strong style="color:#9E0000;">*</strong>" (~392px) may be truncated in 160px width — increase width or enable wrapping |
| label-truncation | Label Channel Bed Not Mandatory | Page 1 | Label text "Channel Bed Width (ft):" (~161px) may be truncated in 142px width — increase width or enable wrapping |
| label-truncation | Label Channel Bed Mandatory | Page 1 | Label text "Channel Bed Width (ft):" (~161px) may be truncated in 132px width — increase width or enable wrapping |
| label-truncation | Label52 | Page 1 | Label text "Temp Data Migration ID:" (~161px) may be truncated in 72px width — increase width or enable wrapping |
| label-truncation | Label55 | Page 1 | Label text "Culvert Design Method Option:" (~203px) may be truncated in 160px width — increase width or enable wrapping |

## Info

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| group-override-condition | Hide Form Tabs | — | Group does not reference an override field in its conditions |
| label-unnamed-in-group | DataField2 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField1 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField3 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField5 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField4 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| spelling | FPAN ID | Page 1 | Possible misspelling: "FPAN" (suggestions: FRAN, FAN, FLAN) |
| listener-disabled | Crossing Identifier | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Water Type | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Planned Activity | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Structure Type | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Proposed Size Width in Inches X | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Proposed Size Width in Inches Y | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Proposed Size Length Feet | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Proposed Size | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Culvert Design Method | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Channel Bed Width | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Stream Gradient | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | FPAN ID | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Temp Data Migration ID | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| font-consistency | Label71 | Page 1 | Label style differs from form pattern: fontSize=18 (expected 10), bold=true (expected false), color=#ffffffff (expected #FF000000) |
| font-consistency | DataField2 | Page 1 | Label style differs from form pattern: color=#ff000000 (expected #FF000000) |
| font-consistency | Label56 | Page 1 | Label style differs from form pattern: bold=true (expected false), color=#ff000000 (expected #FF000000) |
| font-consistency | Label49 | Page 1 | Label style differs from form pattern: bold=true (expected false) |
| font-consistency | DataField1 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff9e0000 (expected #FF000000) |
| font-consistency | Label38 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff000000 (expected #FF000000) |
| font-consistency | DataField5 | Page 1 | Label style differs from form pattern: fontSize=9 (expected 10), color=#ff000000 (expected #FF000000) |
| font-consistency | Label41 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff000000 (expected #FF000000) |
| data-lookup-in-properties | Planned Activity | — | Script "Planned_Activity_onBlur" on drop-down contains API calls — prefer configuring data lookups in the properties panel |
| data-lookup-in-properties | Water Type | — | Script "Water_Type_onBlur" on drop-down contains API calls — prefer configuring data lookups in the properties panel |
| data-lookup-in-properties | Structure Type | — | Script "Structure_Type_onBlur" on drop-down contains API calls — prefer configuring data lookups in the properties panel |
| data-lookup-in-properties | Culvert Design Method | — | Script "Culvert_Design_Method_onBlur" on drop-down contains API calls — prefer configuring data lookups in the properties panel |
