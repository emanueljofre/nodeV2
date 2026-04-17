# Field Type → Standards Matrix

Generated: 2026-04-16 | Rules: 49

## By Field Type

| Field Type | Standards |
| :--------- | :-------- |
| BarCodeFormControl | default-name, distance-to-border |
| CellField | title-case, default-name, accessibility-label, accessibility-required, tab-order-zero, tab-order-unique, distance-to-border, accessibility-label-match, spelling, listener-disabled |
| FieldCalendar3 | title-case, default-name, accessibility-label, accessibility-required, tab-order-zero, tab-order-unique, calendar-name-match, calendar-legacy, calendar-valid-config, distance-to-border, accessibility-label-match, spelling, listener-disabled, field-width-standard |
| FieldCheckbox | title-case, default-name, accessibility-label, accessibility-required, tab-order-zero, tab-order-unique, default-text, distance-to-border, accessibility-label-match, spelling, listener-disabled |
| FieldContainer | container-responsive-flow |
| FieldDataGrid | default-name, spelling |
| FieldDropDownList3 | title-case, default-name, accessibility-label, accessibility-required, tab-order-zero, tab-order-unique, distance-to-border, accessibility-label-match, spelling, listener-disabled, dropdown-width, query-not-default, field-width-standard |
| FieldLabel | label-unnamed-in-group, label-overlap, button-label-camelcase, label-truncation, label-wrap-textbox, font-consistency |
| FieldRectangle | default-name |
| FieldSlider | title-case, default-name, accessibility-label, accessibility-required, tab-order-zero, tab-order-unique, distance-to-border, accessibility-label-match, spelling, listener-disabled |
| FieldTextArea3 | title-case, default-name, accessibility-label, accessibility-required, tab-order-zero, tab-order-unique, distance-to-border, accessibility-label-match, spelling, listener-disabled, field-max-length, field-width-standard |
| FieldTextbox3 | title-case, default-name, accessibility-label, accessibility-required, tab-order-zero, tab-order-unique, distance-to-border, accessibility-label-match, spelling, listener-disabled, field-max-length, field-width-standard |
| FormButton | tab-order-zero, tab-order-unique, default-text, distance-to-border, button-min-size, accessibility-label-match, button-label-camelcase |
| FormIDStamp | default-name, distance-to-border, accessibility-label-match, spelling |
| ImageFormControl | default-name, distance-to-border |
| QuestionsControl | default-name, distance-to-border |
| RepeatingRowControl | default-name, spelling |
| RepeatingRowControlColumn | spelling |
| UploadButton | default-name, accessibility-label, accessibility-required, tab-order-zero, tab-order-unique, simple-upload, distance-to-border, accessibility-label-match |
| UserIDStamp | title-case, accessibility-label, accessibility-required, default-text, distance-to-border, accessibility-label-match |
| WizardStep | default-name |

## All Fields

These standards apply to every field type:

- `duplicate-name` — Duplicate Field Names (error)
- `empty-name` — Empty Field Names (error)
- `valid-identifier` — Valid Identifier Characters (warning)

## Template-Level

These standards operate on the template as a whole (scripts, assignments, groups):

- `script-orphan-assignment` — Script Assignments Reference Valid Controls (error)
- `script-unassigned` — Event Scripts Must Be Assigned to a Control (warning)
- `script-unused-template` — Template Helper Scripts Must Be Referenced (warning)
- `script-empty-body` — Scripts Have Non-Empty Bodies (warning)
- `script-field-reference` — Script Field References Exist (error)
- `tab-reference-by-name` — Tab References Should Use Names Not Numbers (warning)
- `orphan-container-ref` — Container References Valid (error)
- `orphan-group-member` — Group Members Reference Valid Fields (error)
- `field-multiple-groups` — Fields Must Not Appear in Multiple Groups (error)
- `group-override-condition` — Group Override Condition (info)
- `group-meaningful-name` — Group Names Should Be Descriptive (info)
- `group-consolidate-conditions` — Groups With Identical Conditions Should Be Consolidated (info)
- `admin-override-container` — Template Must Have Admin Override Container (warning)
- `admin-override-security` — Admin Override Container Must Have Security Visibility (error)
- `save-button-hidden` — SaveButton Must Be Hidden (warning)
- `tab-control-visible` — TabControl Must Not Be Hidden (warning)
- `standard-hidden-group` — Template Must Have Hidden Fields Group (warning)
- `standard-readonly-group` — Template Must Have Read-Only Fields Group (warning)
- `data-lookup-in-properties` — Data Lookups Should Use Properties Panel, Not Event Scripts (info)

**Total:** 49 standards across 21 field types
