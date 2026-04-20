#!/usr/bin/env node
/**
 * Central Admin — ConfigureCustomerDetails explorer.
 *
 * Navigates /ca/ConfigureCustomerDetails?customerid=<guid> and captures every
 * tab's visible settings (labels, current values, dropdown options) plus any
 * nested sub-sections. Read-only: walks tabs via __doPostBack, never clicks
 * Save/Submit/Apply buttons.
 *
 * Usage:
 *   node tools/explore/probe-central-admin.js --project <customerKey> --customerid <guid>
 *   node tools/explore/probe-central-admin.js --project EmanuelJofre-vv5dev \
 *     --customerid 2e8486fc-d03c-f111-8312-f68855a47462 \
 *     --output projects/emanueljofre-vv5dev/analysis/central-admin
 *
 * Outputs (under --output, default projects/{project}/analysis/central-admin/):
 *   index.json           — tab list + summary
 *   tabs/{tab}.json      — structured settings per tab
 *   tabs/{tab}.html      — raw rendered HTML of each tab panel
 *   screenshots/{tab}.png (optional, --screenshots)
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('@playwright/test');
const { findCustomer, loadEnvConfig, login } = require('../helpers/vv-admin');

const args = process.argv.slice(2);
function arg(name, def = null) {
    const i = args.indexOf(`--${name}`);
    return i >= 0 ? args[i + 1] : def;
}
const project = arg('project');
const customerId = arg('customerid');
const takeScreenshots = args.includes('--screenshots');

if (!project || !customerId) {
    console.error(
        'Usage: node tools/explore/probe-central-admin.js --project <customerKey> --customerid <guid> [--output <dir>] [--screenshots]'
    );
    process.exit(1);
}

const found = findCustomer(project);
if (!found) {
    console.error(`Customer "${project}" not found in .env.json`);
    process.exit(1);
}
const config = loadEnvConfig(found.server, found.customer);

const defaultOut = path.resolve(__dirname, '..', '..', 'projects', project.toLowerCase(), 'analysis', 'central-admin');
const outDir = path.resolve(arg('output', defaultOut));
const tabsDir = path.join(outDir, 'tabs');
const shotsDir = path.join(outDir, 'screenshots');
fs.mkdirSync(tabsDir, { recursive: true });
if (takeScreenshots) fs.mkdirSync(shotsDir, { recursive: true });

const slugify = (s) =>
    (s || 'unknown')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 60);

/**
 * Capture the current page's visible form settings.
 * Returns a structured snapshot: title, section headers, inputs, dropdowns, checkboxes, radios.
 */
async function captureSettings(page) {
    return page.evaluate(() => {
        const visible = (el) => {
            const r = el.getBoundingClientRect();
            const style = window.getComputedStyle(el);
            return r.width > 0 && r.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
        };
        const nearestLabel = (el) => {
            // Prefer <label for=id>
            if (el.id) {
                const l = document.querySelector(`label[for="${el.id}"]`);
                if (l && l.textContent.trim()) return l.textContent.trim();
            }
            // Walk ancestors for a sibling label
            let node = el;
            for (let depth = 0; depth < 5 && node; depth++) {
                const prev = node.previousElementSibling;
                if (prev) {
                    if (prev.tagName === 'LABEL' || /label|Lbl/.test(prev.className)) {
                        const t = prev.textContent.trim();
                        if (t) return t;
                    }
                    // Check inside the previous sibling
                    const inner = prev.querySelector('label, span.label, .lbl');
                    if (inner && inner.textContent.trim()) return inner.textContent.trim();
                }
                node = node.parentElement;
            }
            // Fallback: placeholder, aria-label, name
            return (
                el.getAttribute('aria-label') ||
                el.getAttribute('placeholder') ||
                el.getAttribute('name') ||
                el.id ||
                null
            );
        };
        const isButton = (el) => el.type === 'button' || el.type === 'submit' || el.type === 'reset';

        const result = {
            title: (
                document.querySelector('h1, h2, .pageTitle, .RadPageView_Default h2')?.textContent ||
                document.title ||
                ''
            ).trim(),
            sections: [],
            inputs: [],
            dropdowns: [],
            checkboxes: [],
            radios: [],
            buttons: [],
        };

        // Section headers within the tab panel
        document.querySelectorAll('h2, h3, h4, legend, .sectionTitle, .groupTitle').forEach((h) => {
            if (visible(h) && h.textContent.trim()) result.sections.push(h.textContent.trim());
        });

        // Text / number / email / password inputs
        document.querySelectorAll('input').forEach((el) => {
            if (!visible(el)) return;
            const t = (el.type || 'text').toLowerCase();
            const label = nearestLabel(el);
            if (t === 'checkbox') {
                result.checkboxes.push({ id: el.id, name: el.name, label, checked: el.checked, disabled: el.disabled });
            } else if (t === 'radio') {
                result.radios.push({
                    id: el.id,
                    name: el.name,
                    label,
                    value: el.value,
                    checked: el.checked,
                    disabled: el.disabled,
                });
            } else if (isButton(el)) {
                result.buttons.push({ id: el.id, name: el.name, value: el.value, disabled: el.disabled });
            } else {
                result.inputs.push({
                    id: el.id,
                    name: el.name,
                    type: t,
                    label,
                    value: el.value,
                    readOnly: el.readOnly,
                    disabled: el.disabled,
                    maxLength: el.maxLength > 0 ? el.maxLength : null,
                });
            }
        });

        // Textareas
        document.querySelectorAll('textarea').forEach((el) => {
            if (!visible(el)) return;
            result.inputs.push({
                id: el.id,
                name: el.name,
                type: 'textarea',
                label: nearestLabel(el),
                value: el.value,
                readOnly: el.readOnly,
                disabled: el.disabled,
            });
        });

        // Native selects
        document.querySelectorAll('select').forEach((el) => {
            if (!visible(el)) return;
            const options = Array.from(el.options).map((o) => ({ value: o.value, text: o.text, selected: o.selected }));
            result.dropdowns.push({
                id: el.id,
                name: el.name,
                label: nearestLabel(el),
                disabled: el.disabled,
                options,
                selected: options.find((o) => o.selected)?.value || null,
            });
        });

        // Telerik RadComboBox — find ClientState hidden fields
        document.querySelectorAll('input[id$="_ClientState"]').forEach((el) => {
            if (!el.id.includes('Combo') && !el.id.includes('DropDown')) return;
            try {
                const state = JSON.parse(el.value);
                result.dropdowns.push({ id: el.id, name: el.name, label: nearestLabel(el), telerik: true, state });
            } catch {}
        });

        // Client-side buttons (a.rbButton, input[type=button], etc.)
        document
            .querySelectorAll('a.RadButton, a.rbButton, input[type=button], input[type=submit], button')
            .forEach((el) => {
                if (!visible(el)) return;
                const text = (el.textContent || el.value || '').trim();
                if (!text) return;
                result.buttons.push({
                    id: el.id,
                    name: el.name,
                    text,
                    disabled: el.disabled || el.classList.contains('rbDisabled'),
                });
            });

        return result;
    });
}

/**
 * Enumerate RadTabStrip / RadMultiPage tabs.
 * Returns [{name, index, postbackTarget}].
 */
async function enumerateTabs(page) {
    return page.evaluate(() => {
        const out = [];
        // Telerik RadTabStrip
        document.querySelectorAll('.rtsLI > .rtsLink, .rtsLI > .rtsLink span.rtsTxt').forEach((el, i) => {
            const link = el.closest('.rtsLink') || el;
            const li = link.closest('.rtsLI');
            const text = (link.textContent || '').trim();
            if (!text) return;
            const onclick = link.getAttribute('onclick') || link.getAttribute('href') || '';
            const match = onclick.match(/__doPostBack\('([^']+)'/);
            out.push({
                name: text,
                index: i,
                postbackTarget: match ? match[1] : null,
                clientId: link.id || (li ? li.id : null),
                selected: li && li.classList.contains('rtsSelected'),
            });
        });
        // Dedup by name
        const seen = new Set();
        return out.filter((t) => (seen.has(t.name) ? false : (seen.add(t.name), true)));
    });
}

/**
 * Extract the list of side-menu links typical of ASP.NET admin pages (not tab, but left nav).
 */
async function enumerateSideMenu(page) {
    return page.evaluate(() => {
        const items = [];
        document.querySelectorAll('ul.menu a, .sideMenu a, #ctl00_SideMenu a, nav.secondary a').forEach((a) => {
            const text = (a.textContent || '').trim();
            const href = a.getAttribute('href') || '';
            if (text && href && !items.some((x) => x.href === href)) items.push({ text, href });
        });
        return items;
    });
}

async function triggerTabPostback(page, target) {
    const respPromise = page
        .waitForResponse((r) => r.request().method() === 'POST' && r.url().includes('ConfigureCustomerDetails'), {
            timeout: 15000,
        })
        .catch(() => null);
    await page.addScriptTag({ content: `__doPostBack('${target.replace(/'/g, "\\'")}', '');` });
    await respPromise;
    await page.waitForTimeout(400);
}

(async () => {
    console.log(`Target:     ${found.server} / ${found.customer}`);
    console.log(`Customer ID: ${customerId}`);
    console.log(`Output:     ${outDir}`);

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        await login(page, config);

        // Central Admin requires selecting a customer+database first. Visit SelectDatabase
        // to find the matching "Login" row, then follow its cid+dbid link to establish
        // the central-admin session before hitting ConfigureCustomerDetails.
        console.log(`\nStep 1: /ca/SelectDatabase (to establish central-admin session)`);
        await page.goto(`${config.baseUrl}/ca/SelectDatabase`, { waitUntil: 'networkidle', timeout: 60000 });
        await page.waitForTimeout(800);

        // Try to auto-find the Login link for this customerId
        const loginHref = await page.evaluate((cid) => {
            const a = Array.from(document.querySelectorAll('a')).find((el) => {
                const h = el.getAttribute('href') || '';
                return h.includes(`cid=${cid}`) && h.includes('dbid=') && /Login/i.test(el.textContent || '');
            });
            return a ? a.getAttribute('href') : null;
        }, customerId);

        if (!loginHref) {
            throw new Error(
                `No central-admin Login link found for customerId=${customerId} on SelectDatabase. Verify the customer exists and the account has central-admin access.`
            );
        }
        const authUrl = loginHref.startsWith('http')
            ? loginHref
            : `${config.baseUrl}${loginHref.startsWith('/') ? '' : '/'}${loginHref}`;
        console.log(`  Found login link → ${authUrl}`);
        await page.goto(authUrl, { waitUntil: 'networkidle', timeout: 60000 });
        await page.waitForTimeout(800);

        const url = `${config.baseUrl}/ca/ConfigureCustomerDetails?customerid=${customerId}`;
        console.log(`\nStep 2: ${url}`);
        const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
        console.log(`  HTTP ${resp ? resp.status() : '?'}  → ${page.url()}`);

        // Pause briefly for Telerik scripts to hydrate
        await page.waitForTimeout(1500);

        const pageTitle = (await page.title()).trim();
        const h1 = await page.evaluate(() => (document.querySelector('h1, h2, .pageTitle')?.textContent || '').trim());
        console.log(`  Title: ${pageTitle}`);
        console.log(`  Heading: ${h1}`);

        let tabs = await enumerateTabs(page);
        const sideMenu = await enumerateSideMenu(page);
        console.log(`\n  Tabs found: ${tabs.length}`);
        tabs.forEach((t) =>
            console.log(`    - ${t.name}${t.selected ? ' [selected]' : ''}${t.postbackTarget ? '' : ' (no postback)'}`)
        );

        // Capture the default tab first (whatever loaded)
        const capturedTabs = [];
        const defaultSnapshot = await captureSettings(page);
        const defaultTabName = tabs.find((t) => t.selected)?.name || 'default';
        const defaultSlug = slugify(defaultTabName);
        fs.writeFileSync(
            path.join(tabsDir, `${defaultSlug}.json`),
            JSON.stringify({ tab: defaultTabName, ...defaultSnapshot }, null, 2)
        );
        fs.writeFileSync(path.join(tabsDir, `${defaultSlug}.html`), await page.content());
        if (takeScreenshots) await page.screenshot({ path: path.join(shotsDir, `${defaultSlug}.png`), fullPage: true });
        capturedTabs.push({ name: defaultTabName, slug: defaultSlug, ...summarize(defaultSnapshot) });

        // Walk every non-selected tab
        for (const t of tabs) {
            if (t.selected) continue;
            if (!t.postbackTarget) continue;
            console.log(`\n  Switching to: ${t.name}`);
            try {
                await triggerTabPostback(page, t.postbackTarget);
                await page.waitForTimeout(600);
                const snap = await captureSettings(page);
                const slug = slugify(t.name);
                fs.writeFileSync(path.join(tabsDir, `${slug}.json`), JSON.stringify({ tab: t.name, ...snap }, null, 2));
                fs.writeFileSync(path.join(tabsDir, `${slug}.html`), await page.content());
                if (takeScreenshots)
                    await page.screenshot({ path: path.join(shotsDir, `${slug}.png`), fullPage: true });
                capturedTabs.push({ name: t.name, slug, ...summarize(snap) });
                console.log(
                    `    captured: ${snap.sections.length} sections, ${snap.inputs.length} inputs, ${snap.dropdowns.length} dropdowns, ${snap.checkboxes.length} checkboxes, ${snap.radios.length} radios`
                );
            } catch (e) {
                console.log(`    ERROR: ${e.message}`);
                capturedTabs.push({ name: t.name, slug: slugify(t.name), error: e.message });
            }
        }

        // Index file
        const index = {
            capturedAt: new Date().toISOString(),
            url,
            server: found.server,
            customer: found.customer,
            customerId,
            pageTitle,
            heading: h1,
            tabs: capturedTabs,
            sideMenu,
        };
        fs.writeFileSync(path.join(outDir, 'index.json'), JSON.stringify(index, null, 2));
        console.log(`\nDone. Summary written to ${path.relative(process.cwd(), path.join(outDir, 'index.json'))}`);
    } catch (e) {
        console.error(`\nExploration failed: ${e.message}`);
        console.error(e.stack);
        process.exitCode = 1;
    } finally {
        await browser.close();
    }
})();

function summarize(snap) {
    return {
        sections: snap.sections.length,
        inputs: snap.inputs.length,
        dropdowns: snap.dropdowns.length,
        checkboxes: snap.checkboxes.length,
        radios: snap.radios.length,
        buttons: snap.buttons.length,
    };
}
