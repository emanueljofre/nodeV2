# Standards Review: Shopping-Cart

Generated: 2026-04-16 | Rules: 49 | Findings: 181 (11 errors, 82 warnings, 88 info)

## Summary

| Severity | Count |
| :------- | ----: |
| Error    | 11 |
| Warning  | 82 |
| Info     | 88 |

## Errors

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| script-orphan-assignment | btnTabFourOne_onClick | — | Script assignment references non-existent control ID: ede21e46-85e5-9232-15c3-572e995ebf29 |
| script-orphan-assignment | btnTabFourTwo_onClick | — | Script assignment references non-existent control ID: 63d8f4ec-1ad7-e63b-78c0-862e7b86c7fb |
| script-orphan-assignment | btnClose1_onClick | — | Script assignment references non-existent control ID: a4f97f0c-71b3-74d4-4ac2-3a7e899a1bce |
| script-orphan-assignment | Amount_Received_onBlur | — | Script assignment references non-existent control ID: 42002bce-64ef-dd2e-b2fb-68ce1cad16fb |
| script-orphan-assignment | btnClose2_onClick | — | Script assignment references non-existent control ID: dcc4c208-d05e-cac1-fade-70334c13b657 |
| script-field-reference | btnContactProviderIssue_onClick | — | Script references non-existent field "Provider ID" via GetFieldValue() |
| field-multiple-groups | Con_BillingPostalZone | — | Field appears in 2 groups: Foreign Billing Postal Zone, Payer Tab |
| field-multiple-groups | Con_ForeignBillingStreet | — | Field appears in 2 groups: Foreign Billing Street, Payer Tab |
| field-multiple-groups | Con_MailingPostalZone | — | Field appears in 2 groups: Foreign Mailing Postal Zone, Payer Tab |
| field-multiple-groups | Con_ForeignMailingStreet | — | Field appears in 2 groups: Foreign Mailing Street, Payer Tab |
| field-multiple-groups | btnPrintToSendCheck | — | Field appears in 2 groups: PrintToSendCheck, Send Check Button |

## Warnings

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| title-case | ACH Return Code | Page 1 | Field name "ACH Return Code" is not in Title Case |
| title-case | isFinanceEditor | Page 1 | Field name "isFinanceEditor" is not in Title Case |
| title-case | isPayByCheck | Page 1 | Field name "isPayByCheck" is not in Title Case |
| title-case | isPrintToSendCheck | Page 1 | Field name "isPrintToSendCheck" is not in Title Case |
| title-case | isCCTPPaidByCustomer | Page 1 | Field name "isCCTPPaidByCustomer" is not in Title Case |
| title-case | DisablePayButton | Page 1 | Field name "DisablePayButton" is not in Title Case |
| title-case | CHKReturnedProviderSendNewCHK | Page 1 | Field name "CHKReturnedProviderSendNewCHK" is not in Title Case |
| title-case | CHKReturnedProviderNOTSendNewCHK | Page 1 | Field name "CHKReturnedProviderNOTSendNewCHK" is not in Title Case |
| title-case | Payment Section ReadOnly | Page 1 | Field name "Payment Section ReadOnly" is not in Title Case |
| title-case | FEIN | Page 1 | Field name "FEIN" is not in Title Case |
| default-name | Image113 | Page 1 | Default field name "Image113" — use a descriptive name |
| accessibility-label | DisablePayButton | Page 1 | Missing AccessibilityLabel |
| accessibility-label | CHKReturnedProviderSendNewCHK | Page 1 | Missing AccessibilityLabel |
| accessibility-label | CHKReturnedProviderNOTSendNewCHK | Page 1 | Missing AccessibilityLabel |
| accessibility-required | Business Structure | Page 1 | Required field AccessibilityLabel "Business Structure field" should end with "field Required" |
| accessibility-required | FEIN | Page 1 | Required field AccessibilityLabel "FEIN field" should end with "field Required" |
| script-unused-template | SetupHPPResponseHandler | — | Template helper "SetupHPPResponseHandler" is never referenced from any other script |
| script-unused-template | TabToFieldRelationships | — | Template helper "TabToFieldRelationships" is never referenced from any other script |
| script-unused-template | CalculatePaymentAuth | — | Template helper "CalculatePaymentAuth" is never referenced from any other script |
| script-unused-template | PopulatePayerInfo | — | Template helper "PopulatePayerInfo" is never referenced from any other script |
| distance-to-border | Top Form ID | Page 1 | Field is 10px from the right border (minimum: 30px) |
| distance-to-border | btnAddItemsToCart | Page 1 | Field is 28px from the right border (minimum: 30px) |
| distance-to-border | btnRemoveSelectedItems | Page 1 | Field is 28px from the right border (minimum: 30px) |
| label-overlap | Tab Control | Page 1 | Label "Label49" overlaps field by 60px |
| button-min-size | btnAddItemsRemovedHelp | Page 1 | Button is 20x20px — minimum is 24x24px (508 compliance) |
| accessibility-label-match | btnTabPayer | Page 1 | AccessibilityLabel "Payer Tab Button" does not match expected "Payer" |
| accessibility-label-match | btnTabCart | Page 1 | AccessibilityLabel "Cart Tab Button" does not match expected "Cart" |
| accessibility-label-match | Mailing Country | Page 1 | AccessibilityLabel "Mailing Country field Required" does not match expected "Country" |
| accessibility-label-match | Mailing Street | Page 1 | AccessibilityLabel "Mailing Street field Required" does not match expected "Street" |
| accessibility-label-match | Mailing Zip Code | Page 1 | AccessibilityLabel "Mailing Zip Code field Required" does not match expected "Zip Code" |
| accessibility-label-match | Mailing City | Page 1 | AccessibilityLabel "Mailing City field Required" does not match expected "City" |
| accessibility-label-match | Mailing State | Page 1 | AccessibilityLabel "Mailing State field Required" does not match expected "State" |
| accessibility-label-match | Same Address | Page 1 | AccessibilityLabel "Same Address" does not match expected "Mailing address is the same as the Billing address" |
| accessibility-label-match | Billing Country | Page 1 | AccessibilityLabel "Billing Country field Required" does not match expected "Country" |
| accessibility-label-match | Billing Street | Page 1 | AccessibilityLabel "Billing Street field Required" does not match expected "Street" |
| accessibility-label-match | Billing Zip Code | Page 1 | AccessibilityLabel "Billing Zip Code field Required" does not match expected "Zip Code" |
| accessibility-label-match | Billing City | Page 1 | AccessibilityLabel "Billing City field Required" does not match expected "City" |
| accessibility-label-match | Billing State | Page 1 | AccessibilityLabel "Billing State field Required" does not match expected "State" |
| accessibility-label-match | btnPay | Page 1 | AccessibilityLabel "Pay Button" does not match expected "Pay" |
| accessibility-label-match | btnPrintToSendCheck | Page 1 | AccessibilityLabel "Print to Send Check Button" does not match expected "Print to Send Check" |
| accessibility-label-match | btnAddItemsRemovedHelp | Page 1 | AccessibilityLabel "Add Items Removed Help Button" does not match expected "?" |
| accessibility-label-match | btnAddItemsToCart | Page 1 | AccessibilityLabel "Add Items Back to Cart Button" does not match expected "Add Items Back to Cart" |
| accessibility-label-match | btnRemoveSelectedItems | Page 1 | AccessibilityLabel "Remove Selected Items Button" does not match expected "Remove Selected Items" |
| accessibility-label-match | btnSave | Page 1 | AccessibilityLabel "Save Button" does not match expected "Save" |
| accessibility-label-match | btnAdminSave | Page 1 | AccessibilityLabel "Admin Save Button" does not match expected "Admin Save" |
| accessibility-label-match | isFinanceEditor | Page 1 | AccessibilityLabel "Is Finance Editor" does not match expected "isFinanceEditor" |
| accessibility-label-match | Payment Section ReadOnly | Page 1 | AccessibilityLabel "Payment Section ReadOnly Checkbox" does not match expected "Payment Section ReadOnly" |
| accessibility-label-match | Business Structure | Page 1 | AccessibilityLabel "Business Structure field" does not match expected "Business Structure" |
| accessibility-label-match | FEIN | Page 1 | AccessibilityLabel "FEIN field" does not match expected "SSN" |
| accessibility-label-match | btnApplyPayment | Page 1 | AccessibilityLabel "Apply Payment Button" does not match expected "Apply Payment" |
| accessibility-label-match | btnContactProviderIssue | Page 1 | AccessibilityLabel "Check Issue, Contact Provider Button" does not match expected "Check Issue, Contact Provider" |
| accessibility-label-match | btnCheckReturned | Page 1 | AccessibilityLabel "Check Returned Button" does not match expected "Check Returned" |
| tab-control-visible | TabControl | — | TabControl is in group "Hide Form Tabs" — tab visibility should be controlled via Menu tab, not groups |
| label-truncation | DataField2 | Page 1 | Label text "<b style="color:#9E0000;">*</b> Indicates required field" (~392px) may be truncated in 112px width — increase width or enable wrapping |
| label-truncation | lblPayerName | Page 1 | Label text "Payer Name:<b style="color:#9E0000;">*</b>" (~294px) may be truncated in 92px width — increase width or enable wrapping |
| label-truncation | lblMailingCountry | Page 1 | Label text "Country:<b style="color:#9E0000;">*</b>" (~273px) may be truncated in 72px width — increase width or enable wrapping |
| label-truncation | lblStreet | Page 1 | Label text "Street:<b style="color:#9E0000;">*</b>" (~266px) may be truncated in 92px width — increase width or enable wrapping |
| label-truncation | lblMailingZipCode | Page 1 | Label text "Zip Code:<b style="color:#9E0000;">*</b>" (~280px) may be truncated in 82px width — increase width or enable wrapping |
| label-truncation | lblMailingCity | Page 1 | Label text "City:<b style="color:#9E0000;">*</b>" (~252px) may be truncated in 52px width — increase width or enable wrapping |
| label-truncation | lblMailingState | Page 1 | Label text "State:<b style="color:#9E0000;">*</b>" (~259px) may be truncated in 52px width — increase width or enable wrapping |
| label-truncation | lblSameBillingAddress | Page 1 | Label text "Mailing address is the same as the Billing address:" (~357px) may be truncated in 312px width — increase width or enable wrapping |
| label-truncation | lblBillingAddressHeader | Page 1 | Label text "Billing Address of Payer" (~185px) may be truncated in 160px width — increase width or enable wrapping |
| label-truncation | lblBillingCountry | Page 1 | Label text "Country:<b style="color:#9E0000;">*</b>" (~273px) may be truncated in 72px width — increase width or enable wrapping |
| label-truncation | lblBillingStreet | Page 1 | Label text "Street:<b style="color:#9E0000;">*</b>" (~266px) may be truncated in 52px width — increase width or enable wrapping |
| label-truncation | lblBillingZipCode | Page 1 | Label text "Zip Code:<b style="color:#9E0000;">*</b>" (~280px) may be truncated in 82px width — increase width or enable wrapping |
| label-truncation | lblBillingCity | Page 1 | Label text "City:<b style="color:#9E0000;">*</b>" (~252px) may be truncated in 42px width — increase width or enable wrapping |
| label-truncation | lblBillingState | Page 1 | Label text "State:<b style="color:#9E0000;">*</b>" (~259px) may be truncated in 52px width — increase width or enable wrapping |
| label-truncation | lblPaymentType | Page 1 | Label text "Payment Type:<b style="color:#9E0000;">*</b>" (~308px) may be truncated in 102px width — increase width or enable wrapping |
| label-truncation | lblPaymentDate | Page 1 | Label text "Payment Date:<b style="color:#9E0000;">*</b>" (~308px) may be truncated in 102px width — increase width or enable wrapping |
| label-truncation | lblReceivedBy | Page 1 | Label text "Received By:<b style="color:#9E0000;">*</b>" (~301px) may be truncated in 92px width — increase width or enable wrapping |
| label-truncation | lblAmountReceived | Page 1 | Label text "Amount Received:<b style="color:#9E0000;">*</b>" (~329px) may be truncated in 132px width — increase width or enable wrapping |
| label-truncation | Label120 | Page 1 | Label text "Card Type Code Desc:" (~140px) may be truncated in 102px width — increase width or enable wrapping |
| label-truncation | Label121 | Page 1 | Label text "Payment Code Desc:" (~126px) may be truncated in 102px width — increase width or enable wrapping |
| label-truncation | Label122 | Page 1 | Label text "Authorization Medium Desc:" (~182px) may be truncated in 102px width — increase width or enable wrapping |
| label-truncation | Label123 | Page 1 | Label text "Payment Command Code Desc:" (~182px) may be truncated in 102px width — increase width or enable wrapping |
| label-truncation | Label124 | Page 1 | Label text "Confirmation Number:" (~140px) may be truncated in 102px width — increase width or enable wrapping |
| label-truncation | DataField1 | Page 1 | Label text "Transactional Fee:<b style="color:#9E0000;">*</b>" (~343px) may be truncated in 132px width — increase width or enable wrapping |
| label-truncation | lblIndividualID | Page 1 | Label text "Individual ID:" (~98px) may be truncated in 82px width — increase width or enable wrapping |
| label-truncation | lblBusinessStructure | Page 1 | Label text "Business Structure:<b style="color:#9E0000;">*</b>" (~350px) may be truncated in 132px width — increase width or enable wrapping |
| label-truncation | lblSSN | Page 1 | Label text "SSN:<b style="color:#9E0000;">*</b>" (~245px) may be truncated in 132px width — increase width or enable wrapping |
| label-truncation | lblFEIN | Page 1 | Label text "FEIN:<b style="color:#9E0000;">*</b>" (~252px) may be truncated in 62px width — increase width or enable wrapping |
| label-wrap-textbox | lblTransactionID | Page 1 | Label text "Transaction ID or Check Number:<b style="color:#9E0000;">*</b>" wraps at 132px width next to "Transaction ID or Check Number" — widen label or shorten text |

## Info

| Rule | Field | Page | Message |
| :--- | :---- | :--- | :------ |
| group-override-condition | Check Issue Button | — | Group does not reference an override field in its conditions |
| group-override-condition | Check Returned Button | — | Group does not reference an override field in its conditions |
| group-override-condition | Hide Form Tabs | — | Group does not reference an override field in its conditions |
| group-override-condition | PrintToSendCheck | — | Group does not reference an override field in its conditions |
| label-unnamed-in-group | DataField2 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | lblPayerInformationSectionHeader | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | lblPayerName | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | lblDemographicsSubHeader | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | lblMailingAddressHeader | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | lblMailingCountry | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | lblStreet | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | lblMailingZipCode | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | lblMailingCity | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | lblMailingState | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | lblSameBillingAddress | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | lblBillingAddressHeader | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | lblBillingCountry | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | lblBillingStreet | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | lblBillingZipCode | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | lblBillingCity | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | lblBillingState | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | lblTransactionInformationSectionHeader | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | lblTotalAmount | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | lblLineItemsOfCartSubHeader | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | lblItemsRemoved | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | lblPaymentSubSectionHeader | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | lblPayment | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | lblPaymentType | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | lblPaymentTypeInstructions | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | lblPaymentDate | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | lblReceivedBy | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | lblTransactionID | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | lblAmountReceived | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField1 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | DataField3 | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | lblUserGroups | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | lblPaymentID | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | lblIndividualID | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | lblBusinessTypeHeader | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | lblBusinessStructure | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| label-unnamed-in-group | lblMPINumber | Page 1 | Label has a custom name but is not referenced in any group — only rename labels used in groups/conditions |
| spelling | Mailing Street1 | Page 1 | Possible misspelling: "Street1" (suggestions: Street, Streets) |
| spelling | Mailing Street2 | Page 1 | Possible misspelling: "Street2" (suggestions: Street, Streets) |
| spelling | Billing Street1 | Page 1 | Possible misspelling: "Street1" (suggestions: Street, Streets) |
| spelling | Billing Street2 | Page 1 | Possible misspelling: "Street2" (suggestions: Street, Streets) |
| spelling | DG Payment Items | Page 1 | Possible misspelling: "DG" (suggestions: CG, DB, DH) |
| spelling | ACH Return Code | Page 1 | Possible misspelling: "ACH" (suggestions: SCH, ACHE, ACHY) |
| spelling | Card Type Code Desc | Page 1 | Possible misspelling: "Desc" (suggestions: Dec, Desk, Disc) |
| spelling | Payment Code Desc | Page 1 | Possible misspelling: "Desc" (suggestions: Dec, Desk, Disc) |
| spelling | Authorization Medium Desc | Page 1 | Possible misspelling: "Desc" (suggestions: Dec, Desk, Disc) |
| spelling | Payment Command Code Desc | Page 1 | Possible misspelling: "Desc" (suggestions: Dec, Desk, Disc) |
| spelling | isFinanceEditor | Page 1 | Possible misspelling: "isFinanceEditor" (suggestions: no suggestions) |
| spelling | isPayByCheck | Page 1 | Possible misspelling: "isPayByCheck" (suggestions: no suggestions) |
| spelling | isPrintToSendCheck | Page 1 | Possible misspelling: "isPrintToSendCheck" (suggestions: no suggestions) |
| spelling | isCCTPPaidByCustomer | Page 1 | Possible misspelling: "isCCTPPaidByCustomer" (suggestions: no suggestions) |
| spelling | DisablePayButton | Page 1 | Possible misspelling: "DisablePayButton" (suggestions: no suggestions) |
| spelling | CHKReturnedProviderSendNewCHK | Page 1 | Possible misspelling: "CHKReturnedProviderSendNewCHK" (suggestions: no suggestions) |
| spelling | CHKReturnedProviderNOTSendNewCHK | Page 1 | Possible misspelling: "CHKReturnedProviderNOTSendNewCHK" (suggestions: no suggestions) |
| spelling | Payment Section ReadOnly | Page 1 | Possible misspelling: "ReadOnly" (suggestions: ReadIly) |
| spelling | FEIN | Page 1 | Possible misspelling: "FEIN" (suggestions: REIN, VEIN, FEINT) |
| listener-disabled | Mailing Country | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Billing Country | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Billing State | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Total Amount | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Tab Control | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | User Groups | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Payment ID | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Individual ID | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| listener-disabled | Secondary Transaction ID | Page 1 | EnableQListener is enabled — verify this field requires query string fill-in/relate capability |
| font-consistency | Label71 | Page 1 | Label style differs from form pattern: fontSize=18 (expected 10), bold=true (expected false), color=#ffffffff (expected #FF000000) |
| font-consistency | DataField2 | Page 1 | Label style differs from form pattern: color=#ff000000 (expected #FF000000) |
| font-consistency | lblPayerInformationSectionHeader | Page 1 | Label style differs from form pattern: bold=true (expected false), color=#ff000000 (expected #FF000000) |
| font-consistency | Label23 | Page 1 | Label style differs from form pattern: fontSize=9 (expected 10), color=#ff000000 (expected #FF000000) |
| font-consistency | lblDemographicsSubHeader | Page 1 | Label style differs from form pattern: bold=true (expected false), color=#ff000000 (expected #FF000000) |
| font-consistency | lblPayment | Page 1 | Label style differs from form pattern: color=#ff9e0000 (expected #FF000000) |
| font-consistency | Label33 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff9e0000 (expected #FF000000) |
| font-consistency | Label34 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10) |
| font-consistency | DataField3 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10) |
| font-consistency | Label38 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff000000 (expected #FF000000) |
| font-consistency | Label43 | Page 1 | Label style differs from form pattern: fontSize=9 (expected 10), color=#ff000000 (expected #FF000000) |
| font-consistency | Label41 | Page 1 | Label style differs from form pattern: fontSize=8 (expected 10), bold=true (expected false), color=#ff000000 (expected #FF000000) |
| data-lookup-in-properties | Billing Country | — | Script "Billing_Country_onBlur" on drop-down contains API calls — prefer configuring data lookups in the properties panel |
| data-lookup-in-properties | Business Structure | — | Script "Business_Structure_onBlur" on drop-down contains API calls — prefer configuring data lookups in the properties panel |
| data-lookup-in-properties | Mailing Country | — | Script "Mailing_Country_onBlur" on drop-down contains API calls — prefer configuring data lookups in the properties panel |
| data-lookup-in-properties | Payment Type | — | Script "Payment_Type_onBlur" on drop-down contains API calls — prefer configuring data lookups in the properties panel |
| data-lookup-in-properties | Billing State | — | Script "Billing_State_onBlur" on drop-down contains API calls — prefer configuring data lookups in the properties panel |
| data-lookup-in-properties | Mailing State | — | Script "Mailing_State_onBlur" on drop-down contains API calls — prefer configuring data lookups in the properties panel |
| field-width-standard | Same Address | Page 1 | address field width is 142px — recommended minimum is 250px |
