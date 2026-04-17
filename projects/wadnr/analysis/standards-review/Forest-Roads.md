# Standards Review: Forest-Roads

Generated: 2026-04-16 | Rules: 49 | Findings: 65 (6 errors, 32 warnings, 27 info)

## Summary

| Severity | Count |
| :------- | ----: |
| Error    | 6 |
| Warning  | 32 |
| Info     | 27 |

## Errors

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| script-orphan-assignment | btnTabFourTwo_onClick | — | Script assignment references non-existent control ID: 63d8f4ec-1ad7-e63b-78c0-862e7b86c7fb |
| script-orphan-assignment | Abandonment_Date_onBlur | — | Script assignment references non-existent control ID: 660a4ea4-cea8-2f34-2197-bc567ed1321b |
| script-orphan-assignment | btnClose1_onClick | — | Script assignment references non-existent control ID: a4f97f0c-71b3-74d4-4ac2-3a7e899a1bce |
| script-orphan-assignment | btnClose2_onClick | — | Script assignment references non-existent control ID: dcc4c208-d05e-cac1-fade-70334c13b657 |
| script-orphan-assignment | btnTabFourOne_onClick | — | Script assignment references non-existent control ID: ede21e46-85e5-9232-15c3-572e995ebf29 |
| script-orphan-assignment | Date_Assessed_onBlur | — | Script assignment references non-existent control ID: 8789b379-d883-d847-0e2f-ee12a906450c |

## Warnings

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| default-name | Image32 | Page 1 | Default field name "Image32" — use a descriptive name |
| accessibility-label | Abandonment Date | Page 1 | Missing AccessibilityLabel |
| accessibility-label | Date Assessed | Page 1 | Missing AccessibilityLabel |
| accessibility-label | Related Record ID | Page 1 | Missing AccessibilityLabel |
| accessibility-label | Parent Context | Page 1 | Missing AccessibilityLabel |
| accessibility-label | Temp Data Migration ID | Page 1 | Missing AccessibilityLabel |
| accessibility-required | Road Assessed | Page 1 | Required field AccessibilityLabel "Road Assessed" should end with "field Required" |
| distance-to-border | Top Form ID | Page 1 | Field is 10px from the right border (minimum: 30px) |
| label-overlap | Related Record ID | Page 1 | Label "Label30" overlaps field by 30px |
| label-overlap | Parent Context | Page 1 | Label "Label44" overlaps field by 30px |
| button-min-size | btnHelpRoadIdentifier | Page 1 | Button is 20x20px — minimum is 24x24px (508 compliance) |
| button-min-size | btnHelpRoadConstruction | Page 1 | Button is 20x20px — minimum is 24x24px (508 compliance) |
| button-min-size | btnHelpRoadAbandonment | Page 1 | Button is 20x20px — minimum is 24x24px (508 compliance) |
| button-min-size | btnHelpDateAssessed | Page 1 | Button is 20x20px — minimum is 24x24px (508 compliance) |
| button-min-size | btnHelpRoadAssessed | Page 1 | Button is 20x20px — minimum is 24x24px (508 compliance) |
| button-min-size | btnHelpComments | Page 1 | Button is 20x20px — minimum is 24x24px (508 compliance) |
| accessibility-label-match | btnHelpRoadIdentifier | Page 1 | AccessibilityLabel "Road Identifier Help Button" does not match expected "?" |
| accessibility-label-match | Road Construction Length | Page 1 | AccessibilityLabel "Road Construction Length In Feet" does not match expected "Road Construction Length" |
| accessibility-label-match | btnHelpRoadConstruction | Page 1 | AccessibilityLabel "Road Construction Length Help Button" does not match expected "?" |
| accessibility-label-match | Road Abandonment Length | Page 1 | AccessibilityLabel "Road Abandonment Length In Feet" does not match expected "Road Abandonment Length" |
| accessibility-label-match | btnHelpRoadAbandonment | Page 1 | AccessibilityLabel "Road Abandonment Length Help Button" does not match expected "?" |
| accessibility-label-match | btnHelpDateAssessed | Page 1 | AccessibilityLabel "Date Assessed Help Button" does not match expected "?" |
| accessibility-label-match | Road Assessed | Page 1 | AccessibilityLabel "Road Assessed" does not match expected "Road Issue Assessed" |
| accessibility-label-match | btnHelpRoadAssessed | Page 1 | AccessibilityLabel "Road Assessed Help Button" does not match expected "?" |
| accessibility-label-match | btnHelpComments | Page 1 | AccessibilityLabel "Comments Help Button" does not match expected "?" |
| accessibility-label-match | btnSave | Page 1 | AccessibilityLabel "Save Button" does not match expected "Save" |
| accessibility-label-match | btnAdminSave | Page 1 | AccessibilityLabel "Admin Save Button" does not match expected "Admin Save" |
| tab-control-visible | TabControl | — | TabControl is in group "Hide Form Tabs" — tab visibility should be controlled via Menu tab, not groups |
| label-truncation | DataField2 | Page 1 | Label text "<strong style="color:#9E0000;">*</strong> Indicates required field" (~462px) may be truncated in 132px width — increase width or enable wrapping |
| label-truncation | lblRoadIdentifier | Page 1 | Label text "Road Identifier: <strong style="color:#9E0000;">*</strong>" (~406px) may be truncated in 112px width — increase width or enable wrapping |
| label-truncation | lblDateAssessed | Page 1 | Label text "Date Assessed: (MM/YYYY) <strong style="color:#9E0000;">*</strong>" (~462px) may be truncated in 212px width — increase width or enable wrapping |
| label-truncation | lblRoadAssessed | Page 1 | Label text "Road Issue Assessed: <strong style="color:#9E0000;">*</strong>" (~434px) may be truncated in 212px width — increase width or enable wrapping |

## Info

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| group-override-condition | Hide Form Tabs | — | Group does not reference an override field in its conditions |
| label-unnamed-in-group | DataField2 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | lblRoadIdentifier | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | lblDateAssessed | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | lblRoadAssessed | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField3 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| listener-disabled | Road Identifier | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Road Construction Length | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Steepest Side Slope | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Road Abandonment Length | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Abandonment Date | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Date Assessed | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Road Assessed | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Comments | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Related Record ID | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Parent Context | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Temp Data Migration ID | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| field-max-length | Abandonment Date | Page 1 | MaxLength is 7 — recommended minimum is 50 |
| field-max-length | Date Assessed | Page 1 | MaxLength is 7 — recommended minimum is 50 |
| font-consistency | Label71 | Page 1 | Label style differs from form pattern: fontSize=18 (expected 10), bold=true (expected false), color=#ffffffff (expected #FF000000) |
| font-consistency | DataField2 | Page 1 | Label style differs from form pattern: color=#ff000000 (expected #FF000000) |
| font-consistency | Label56 | Page 1 | Label style differs from form pattern: bold=true (expected false), color=#ff000000 (expected #FF000000) |
| font-consistency | Label33 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff9e0000 (expected #FF000000) |
| font-consistency | Label38 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff000000 (expected #FF000000) |
| font-consistency | Label43 | Page 1 | Label style differs from form pattern: fontSize=9 (expected 10), color=#ff000000 (expected #FF000000) |
| font-consistency | Label41 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff000000 (expected #FF000000) |
| data-lookup-in-properties | Road Assessed | — | Script "Road_Assessed_onBlur" on drop-down contains API calls — prefer configuring data lookups in the properties panel |
