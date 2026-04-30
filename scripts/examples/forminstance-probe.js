'use strict';

/**
 * Script Name:    FormsAPI / forminstance/ Availability Probe
 * Purpose:        Read-only diagnostic. Reports whether the FormsAPI SDK wrapper
 *                 (vvClient.formsApi) is initialized for the current session,
 *                 surfaces its underlying configuration, and resolves a target
 *                 template's revision GUID — the prerequisite for using
 *                 vvClient.formsApi.formInstances.{postForm, postFormRevision}.
 *
 *                 Companion to research/forminstance-pattern/. Designed to run
 *                 unchanged either as a deployed VV web service (called by the
 *                 microservices server with ffCollection/vvClient/response) or
 *                 directly via tools/runners/run-forminstance-probe.js.
 *
 * Parameters (ffCollection):
 *                 TemplateName: Optional. Form template to probe. Default: "DateTest".
 *
 * Returns:
 *                 status:   'Success' | 'Warning' | 'Error'
 *                 data:
 *                   formsApi:
 *                     publicGetterIsNull: boolean   // true == SDK refused to expose formsApi
 *                     hasUnderlyingInstance: boolean
 *                     isEnabled: boolean | null     // customer-level toggle
 *                     baseUrl: string | null        // preformsapi target
 *                     hasFormInstancesManager: boolean
 *                     methods: { postForm: boolean, postFormRevision: boolean }
 *                   template:
 *                     name: string
 *                     templateIdGuid: string | null
 *                     templateRevisionIdGuid: string | null  // ← required for forminstance/ calls
 *                     resolved: boolean
 *                 errors: string[]
 *                 nextSteps: string[]               // human-readable guidance based on findings
 */

module.exports.getCredentials = function () {
    var env = global.VV_ENV || {};
    return {
        customerAlias: env.customerAlias || 'CUSTOMER ALIAS',
        databaseAlias: env.databaseAlias || 'DATABASE ALIAS',
        clientId: env.clientId || 'CLIENT ID',
        clientSecret: env.clientSecret || 'CLIENT SECRET',
        userId: env.clientId || 'CLIENT ID',
        password: env.clientSecret || 'CLIENT SECRET',
        audience: env.audience || '',
    };
};

module.exports.main = async function (ffCollection, vvClient, response) {
    const output = {
        data: null,
        errors: [],
        status: 'Success',
        nextSteps: [],
    };

    function readField(name, fallback) {
        try {
            const f = ffCollection && ffCollection.getFormFieldByName && ffCollection.getFormFieldByName(name);
            return f && f.value ? f.value : fallback;
        } catch (e) {
            return fallback;
        }
    }

    const templateName = readField('TemplateName', 'DateTest');

    // ---------- 1. Inspect the FormsAPI SDK surface ----------

    const publicGetter = vvClient.formsApi; // SDK getter — null when isEnabled || baseUrl missing
    const underlying = vvClient._formsApi; // raw instance, set during vvClient init

    const formsApiInfo = {
        publicGetterIsNull: publicGetter == null,
        hasUnderlyingInstance: underlying != null,
        isEnabled: underlying ? !!underlying.isEnabled : null,
        baseUrl: underlying ? underlying.baseUrl || null : null,
        hasFormInstancesManager: !!(underlying && underlying.formInstances),
        methods: {
            postForm: !!(
                underlying &&
                underlying.formInstances &&
                typeof underlying.formInstances.postForm === 'function'
            ),
            postFormRevision: !!(
                underlying &&
                underlying.formInstances &&
                typeof underlying.formInstances.postFormRevision === 'function'
            ),
        },
    };

    // ---------- 2. Resolve the target template's revision GUID ----------

    const templateInfo = {
        name: templateName,
        templateIdGuid: null,
        templateRevisionIdGuid: null,
        resolved: false,
    };

    try {
        const tplResp = await vvClient.forms.getFormTemplateIdByName(templateName);
        templateInfo.templateIdGuid = (tplResp && tplResp.templateIdGuid) || null;
        templateInfo.templateRevisionIdGuid = (tplResp && tplResp.templateRevisionIdGuid) || null;
        templateInfo.resolved = !!templateInfo.templateRevisionIdGuid;
    } catch (err) {
        output.errors.push(`getFormTemplateIdByName threw: ${err && err.message ? err.message : String(err)}`);
    }

    // ---------- 3. Synthesize verdict + next steps ----------

    if (!formsApiInfo.hasUnderlyingInstance) {
        output.status = 'Error';
        output.errors.push('vvClient._formsApi is null — FormsAPI SDK was not initialized for this session.');
        output.nextSteps.push(
            'FormsAPI is likely disabled for this customer/database. Verify in Central Admin > Customer Configuration > FormsAPI, or check the /configuration/formsapi endpoint response.'
        );
    } else if (!formsApiInfo.isEnabled) {
        output.status = 'Error';
        output.errors.push('FormsAPI SDK initialized but isEnabled=false.');
        output.nextSteps.push('Enable FormsAPI for this customer in Central Admin.');
    } else if (!formsApiInfo.baseUrl) {
        output.status = 'Error';
        output.errors.push('FormsAPI SDK enabled but baseUrl is missing.');
        output.nextSteps.push(
            'Check /configuration/formsapi response: data.formsApiUrl should be set (typically https://preformsapi.visualvault.com).'
        );
    } else if (formsApiInfo.publicGetterIsNull) {
        output.status = 'Warning';
        output.errors.push(
            'Underlying FormsAPI present but vvClient.formsApi getter returned null. Confirm session token type is JWT (not OAuth).'
        );
        output.nextSteps.push(
            'Inspect vvClient._httpHelper._sessionToken.tokenType — must be "jwt" for the public getter to expose formsApi.'
        );
    }

    if (!templateInfo.resolved) {
        output.status = output.status === 'Error' ? 'Error' : 'Warning';
        output.errors.push(
            `Template "${templateName}" did not resolve to a revisionId. The SDK silently swallows errors here; common causes: template does not exist on this environment, name mismatch (case/whitespace), or the user lacks read access.`
        );
        output.nextSteps.push(
            `Verify template name on this environment: vvClient.forms.getForms({q: "name eq '${templateName}'"}, "FormTemplate") via the local runner, or open the Form Designer.`
        );
    }

    if (output.status === 'Success') {
        output.nextSteps.push(
            'forminstance/ prerequisites satisfied. Proceed to exercise vvClient.formsApi.formInstances.postForm and postFormRevision against this template.'
        );
    }

    output.data = {
        formsApi: formsApiInfo,
        template: templateInfo,
        environment: {
            customerAlias:
                vvClient._httpHelper &&
                vvClient._httpHelper._sessionToken &&
                vvClient._httpHelper._sessionToken.customerAlias,
            databaseAlias:
                vvClient._httpHelper &&
                vvClient._httpHelper._sessionToken &&
                vvClient._httpHelper._sessionToken.databaseAlias,
            tokenType:
                vvClient._httpHelper &&
                vvClient._httpHelper._sessionToken &&
                vvClient._httpHelper._sessionToken.tokenType,
        },
        probedAt: new Date().toISOString(),
    };

    response.json(200, output);
};
