# Standards Review: Unit-Identifier

Generated: 2026-04-16 | Rules: 49 | Findings: 46 (5 errors, 24 warnings, 17 info)

## Summary

| Severity | Count |
| :------- | ----: |
| Error    | 5 |
| Warning  | 24 |
| Info     | 17 |

## Errors

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| script-orphan-assignment | btnClose1_onClick | — | Script assignment references non-existent control ID: a4f97f0c-71b3-74d4-4ac2-3a7e899a1bce |
| script-orphan-assignment | btnClose2_onClick | — | Script assignment references non-existent control ID: dcc4c208-d05e-cac1-fade-70334c13b657 |
| script-orphan-assignment | btnTabFourTwo_onClick | — | Script assignment references non-existent control ID: 63d8f4ec-1ad7-e63b-78c0-862e7b86c7fb |
| script-orphan-assignment | btnTabFourOne_onClick | — | Script assignment references non-existent control ID: ede21e46-85e5-9232-15c3-572e995ebf29 |
| field-multiple-groups | Con_HiddenSection | — | Field appears in 2 groups: Hidden Fields, HideFormControls |

## Warnings

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| default-name | Image57 | Page 1 | Default field name "Image57" — use a descriptive name |
| distance-to-border | Top Form ID | Page 1 | Field is 10px from the right border (minimum: 30px) |
| label-overlap | btnHelpUnitIdentifier | Page 1 | Label "Label61" overlaps field by 152px |
| label-overlap | btnHelpDescription | Page 1 | Label "DataField4" overlaps field by 30px |
| button-min-size | btnHelpUnitIdentifier | Page 1 | Button is 20x20px — minimum is 24x24px (508 compliance) |
| button-min-size | btnHelpDescription | Page 1 | Button is 20x20px — minimum is 24x24px (508 compliance) |
| accessibility-label-match | btnHelpUnitIdentifier | Page 1 | AccessibilityLabel "Quick help unit identifier" does not match expected "?" |
| accessibility-label-match | btnHelpDescription | Page 1 | AccessibilityLabel "Quick help description" does not match expected "?" |
| accessibility-label-match | btnSave | Page 1 | AccessibilityLabel "Save button" does not match expected "Save" |
| accessibility-label-match | btnAdminSave | Page 1 | AccessibilityLabel "Admin Save Button" does not match expected "Admin Save" |
| accessibility-label-match | Related Record ID | Page 1 | AccessibilityLabel "Tab Control" does not match expected "Related Record ID" |
| accessibility-label-match | btnSaveDraft | Page 1 | AccessibilityLabel "Save draft button" does not match expected "Save Draft" |
| tab-control-visible | TabControl | — | TabControl is in group "Hide Form Tabs" — tab visibility should be controlled via Menu tab, not groups |
| label-truncation | DataField2 | Page 1 | Label text "<strong style="color:#9E0000;">*</strong> Indicates required field" (~462px) may be truncated in 132px width — increase width or enable wrapping |
| label-truncation | DataField1 | Page 1 | Label text "Complete this form if you answered Yes to the Question 6 on Appendix J." (~497px) may be truncated in 442px width — increase width or enable wrapping |
| label-truncation | Label57 | Page 1 | Label text "<strong>Are there any areas within this proposal or within 300 feet that:</strong> <strong style="color:#9E0000;">*</strong>" (~868px) may be truncated in 642px width — increase width or enable wrapping |
| label-truncation | Label58 | Page 1 | Label text "&#x2022; Are not surveyed, <strong> and</strong>;" (~343px) may be truncated in 272px width — increase width or enable wrapping |
| label-truncation | Label59 | Page 1 | Label text "&#x2022; Are not listed on Question 5, <strong> and</strong>;" (~427px) may be truncated in 332px width — increase width or enable wrapping |
| label-truncation | Label60 | Page 1 | Label text "&#x2022; Have trees that are at least 32 inches dbh (24 inches dbh for western hemlock)?" (~616px) may be truncated in 492px width — increase width or enable wrapping |
| label-truncation | Label61 | Page 1 | Label text "<strong>Unit Identifier:</strong><strong style="color:#9E0000;">*</strong>" (~518px) may be truncated in 282px width — increase width or enable wrapping |
| label-truncation | Label63 | Page 1 | Label text "<strong>Within the Unit:</strong><strong style="color:#9E0000;">*</strong>" (~518px) may be truncated in 352px width — increase width or enable wrapping |
| label-truncation | Label65 | Page 1 | Label text "<strong>Within 300' of the Unit</strong><strong style="color:#9E0000;">*</strong>" (~567px) may be truncated in 382px width — increase width or enable wrapping |
| label-truncation | DataField4 | Page 1 | Label text "<strong>Description:</strong><strong style="color:#9E0000;">*</strong>" (~490px) may be truncated in 160px width — increase width or enable wrapping |
| label-truncation | Label49 | Page 1 | Label text "Related Record ID:" (~126px) may be truncated in 82px width — increase width or enable wrapping |

## Info

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| group-override-condition | Hide Form Tabs | — | Group does not reference an override field in its conditions |
| label-unnamed-in-group | DataField2 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField1 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField4 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField3 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| spelling | Within 300 of the Unit | Page 1 | Possible misspelling: "300" (suggestions: 0, 300th, 30th) |
| listener-disabled | Related Record ID | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| field-max-length | Description | Page 1 | TextArea MaxLength is 1000 — recommended minimum is 3000 for notes/text fields |
| font-consistency | Label71 | Page 1 | Label style differs from form pattern: fontSize=18 (expected 10), bold=true (expected false), color=#ffffffff (expected #FF000000) |
| font-consistency | DataField2 | Page 1 | Label style differs from form pattern: color=#ff000000 (expected #FF000000) |
| font-consistency | Label56 | Page 1 | Label style differs from form pattern: bold=true (expected false), color=#ff000000 (expected #FF000000) |
| font-consistency | Label33 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff9e0000 (expected #FF000000) |
| font-consistency | Label38 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff000000 (expected #FF000000) |
| font-consistency | Label43 | Page 1 | Label style differs from form pattern: fontSize=9 (expected 10), color=#ff000000 (expected #FF000000) |
| font-consistency | Label41 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff000000 (expected #FF000000) |
| data-lookup-in-properties | Within the Unit | — | Script "Within_the_Unit_onChange" on drop-down contains API calls — prefer configuring data lookups in the properties panel |
| data-lookup-in-properties | Within 300 of the Unit | — | Script "Within_300_of_the_Unit_onChange" on drop-down contains API calls — prefer configuring data lookups in the properties panel |
