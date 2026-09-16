/**
 * FetchXml Tester - Core Application Logic
 * Modern, robust client-side module for FetchXML testing, WebAPI GET execution,
 * environment context management (QDV-compatible), saved queries library, and theme control.
 */

// Global DOM Elements
var fetchXml = document.querySelector("#fetchXml");
var orgURL = document.querySelector("#orgURL");
var queryName = document.querySelector("#queryName");
var plural = document.querySelector("#plural");
var testButton = document.querySelector("#testButton");
var requestURI = document.querySelector("#requestURI");
var apiVersion = "/api/data/v9.2/";
var finalLink = "";
var pluralName = "";
var isValidXml = true;
var isNameModified = false;

// Application State
var App = {
    theme: 'light',
    orgURLs: {},
    activeOrg: null,
    savedQueries: []
};

// =========================================================================
// Toast Notification System
// =========================================================================
function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let iconSvg = '';
    if (type === 'success') {
        iconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === 'error') {
        iconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    } else {
        iconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9b4dca" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `${iconSvg} <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px) scale(0.95)';
        toast.style.transition = 'all 0.2s ease-out';
        setTimeout(() => {
            if (toast.parentElement) toast.parentElement.removeChild(toast);
        }, 200);
    }, 3200);
}

// =========================================================================
// Theme Management (Default Light, Toggle to Dark)
// =========================================================================
function initTheme() {
    const savedTheme = localStorage.getItem('fx_theme') || localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
}

function applyTheme(theme) {
    App.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('fx_theme', theme);

    const btn = document.getElementById('themeToggleBtn');
    if (btn) {
        if (theme === 'dark') {
            btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
            btn.title = 'Switch to Light Theme';
        } else {
            btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
            btn.title = 'Switch to Dark Theme';
        }
    }

    syncEditorTheme(theme);
}

function toggleTheme() {
    const next = App.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    showToast(`Switched to ${next} theme`, 'info');
}

function syncEditorTheme(theme) {
    if (typeof editor !== 'undefined' && editor.win && editor.win.document && editor.win.document.documentElement) {
        editor.win.document.documentElement.setAttribute('data-theme', theme);
    }
}

// =========================================================================
// Environment Context Management (QDV-Compatible)
// =========================================================================
var Env = {
    cleanUrl: function (raw) {
        if (!raw || typeof raw !== 'string') return '';
        let val = raw.trim().replace(/^["'<(\[]+|[>"')\]]+$/g, '').trim();
        if (!val) return '';

        const hasProtocol = /^https?:\/\//i.test(val);
        const hasDomainPattern = /[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/i.test(val) || /^localhost(:\d+)?/i.test(val);

        if (!hasProtocol && !hasDomainPattern) {
            return val;
        }

        if (!hasProtocol) {
            val = 'https://' + val;
        }

        try {
            const url = new URL(val);
            if (url.hostname && (url.hostname.includes('.') || url.hostname === 'localhost')) {
                return url.origin;
            }
        } catch (e) {
            const match = val.match(/^(https?:\/\/[^\/?#]+)/i);
            if (match) return match[1];
        }

        return val.replace(/[?#].*$/, '').replace(/\/+$/, '');
    },

    isValidURL: function (str) {
        if (!str || typeof str !== 'string') return false;
        const cleaned = this.cleanUrl(str);
        try {
            const url = new URL(cleaned);
            return url.hostname.length > 3 && (url.hostname.includes('.') || url.hostname === 'localhost');
        } catch (e) {
            return false;
        }
    },

    bindPasteCleaner: function (input) {
        if (!input) return;

        input.addEventListener('paste', (e) => {
            const clipboardData = e.clipboardData || window.clipboardData;
            const pastedText = clipboardData ? clipboardData.getData('text') : '';
            if (pastedText) {
                const cleaned = Env.cleanUrl(pastedText);
                if (cleaned) {
                    e.preventDefault();
                    input.value = cleaned;
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                    showToast('URL sanitized (path and query stripped)', 'info');
                }
            }
        });

        input.addEventListener('input', () => {
            const cur = input.value;
            if (cur && (cur.includes('?') || cur.includes('#') || cur.includes('/main.aspx') || cur.includes('/api/'))) {
                const cleaned = Env.cleanUrl(cur);
                if (cleaned && cleaned !== cur) {
                    input.value = cleaned;
                }
            }
        });
    },

    init: function () {
        try {
            // Load environments from lsOrgURLs (shared with QDV) or fallback to orgURL
            const stored = localStorage.getItem('lsOrgURLs');
            if (stored) {
                App.orgURLs = JSON.parse(stored);
            }

            const legacyOrg = localStorage.getItem('orgURL');
            if (legacyOrg && (!App.orgURLs || Object.keys(App.orgURLs).length === 0)) {
                const cleaned = this.cleanUrl(legacyOrg);
                if (cleaned) {
                    try {
                        const u = new URL(cleaned);
                        const name = u.hostname.split('.')[0] || 'default';
                        App.orgURLs[name] = cleaned;
                    } catch (e) { }
                }
            }

            const storedActive = localStorage.getItem('qdv_active_env') || localStorage.getItem('fx_active_env');
            if (storedActive && App.orgURLs[storedActive]) {
                App.activeOrg = storedActive;
            } else {
                const keys = Object.keys(App.orgURLs);
                if (keys.length > 0) {
                    App.activeOrg = keys[0];
                }
            }
        } catch (e) {
            console.error('Error loading environments', e);
        }

        this.bindPasteCleaner(orgURL);
        const modalInput = document.getElementById('txtModalEnv');
        if (modalInput) this.bindPasteCleaner(modalInput);

        this.render();

        if (App.activeOrg && App.orgURLs[App.activeOrg]) {
            orgURL.value = App.orgURLs[App.activeOrg];
        } else if (localStorage.getItem('orgURL')) {
            orgURL.value = localStorage.getItem('orgURL');
        }
    },

    save: function () {
        localStorage.setItem('lsOrgURLs', JSON.stringify(App.orgURLs));
        if (App.activeOrg) {
            localStorage.setItem('qdv_active_env', App.activeOrg);
            localStorage.setItem('fx_active_env', App.activeOrg);
            if (App.orgURLs[App.activeOrg]) {
                localStorage.setItem('orgURL', App.orgURLs[App.activeOrg]);
            }
        }
    },

    select: function (key) {
        if (App.orgURLs[key]) {
            App.activeOrg = key;
            orgURL.value = App.orgURLs[key];
            this.save();
            this.render();
            combine();
            showToast(`Active environment: "${key}"`, 'info');
        }
    },

    add: function (rawUrl) {
        const cleaned = this.cleanUrl(rawUrl);
        if (!this.isValidURL(cleaned)) {
            showToast('Please enter a valid URL (e.g. https://org.crm.dynamics.com)', 'error');
            return false;
        }

        try {
            const url = new URL(cleaned);
            let orgName = url.hostname.split('.')[0];
            if (orgName.toLowerCase() === 'www' || orgName.length <= 1) {
                orgName = url.hostname;
            }

            App.orgURLs[orgName] = cleaned;
            App.activeOrg = orgName;
            orgURL.value = cleaned;

            this.save();
            this.render();
            combine();
            showToast(`Environment "${orgName}" added!`, 'success');
            return true;
        } catch (e) {
            showToast('Invalid URL format', 'error');
            return false;
        }
    },

    remove: function (key, event) {
        if (event) event.stopPropagation();
        if (!App.orgURLs[key]) return;

        delete App.orgURLs[key];
        if (App.activeOrg === key) {
            const keys = Object.keys(App.orgURLs);
            App.activeOrg = keys.length > 0 ? keys[0] : null;
            orgURL.value = App.activeOrg ? App.orgURLs[App.activeOrg] : '';
        }

        this.save();
        this.render();
        combine();
        showToast(`Removed environment "${key}"`, 'info');
    },

    copyUrl: function (key, event) {
        if (event) event.stopPropagation();
        const url = App.orgURLs[key];
        if (!url) return;

        navigator.clipboard.writeText(url).then(() => {
            showToast(`Copied URL for ${key}`, 'success');
        });
    },

    render: function () {
        const keys = Object.keys(App.orgURLs);
        const pillsContainer = document.getElementById('envPillsRow');
        const modalList = document.getElementById('modalEnvList');
        const activeLabel = document.getElementById('envActiveLabel');
        const statusDot = document.getElementById('envStatusDot');
        const countLabel = document.getElementById('modalEnvCount');

        if (countLabel) {
            countLabel.textContent = `${keys.length} saved`;
        }

        if (App.activeOrg && App.orgURLs[App.activeOrg]) {
            if (activeLabel) activeLabel.textContent = App.activeOrg;
            if (statusDot) {
                statusDot.className = 'status-dot';
            }
        } else {
            if (activeLabel) activeLabel.textContent = 'No environment selected';
            if (statusDot) {
                statusDot.className = 'status-dot offline';
            }
        }

        // Render Pills in Context Strip
        if (pillsContainer) {
            if (keys.length === 0) {
                pillsContainer.innerHTML = `<span style="color: var(--text-subtle); font-size: 0.82rem;">No saved environments</span>`;
            } else {
                let pillsHtml = '';
                keys.forEach(key => {
                    const isSelected = key === App.activeOrg;
                    const url = App.orgURLs[key];
                    pillsHtml += `
                        <div class="env-pill ${isSelected ? 'selected' : ''}" 
                             onclick="Env.select('${key}')" 
                             title="${url}">
                            <span class="env-pill-status"></span>
                            <span>${key}</span>
                        </div>
                    `;
                });
                pillsContainer.innerHTML = pillsHtml;
            }
        }

        // Render Modal List with Actions
        if (modalList) {
            if (keys.length === 0) {
                modalList.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 1.5rem 0; font-size: 0.85rem;">No environments added yet. Enter your Dynamics 365 URL above to add one.</div>`;
            } else {
                let listHtml = '';
                keys.forEach(key => {
                    const isSelected = key === App.activeOrg;
                    const url = App.orgURLs[key];
                    listHtml += `
                        <div class="env-item-row ${isSelected ? 'active' : ''}">
                            <div class="env-item-info" onclick="Env.select('${key}'); closeEnvModal();">
                                <span class="env-item-name">${key} ${isSelected ? '· Active' : ''}</span>
                                <span class="env-item-url">${url}</span>
                            </div>
                            <div class="item-actions">
                                <button class="btn-action-icon" onclick="Env.copyUrl('${key}', event)" title="Copy URL">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                </button>
                                <button class="btn-action-icon delete" onclick="Env.remove('${key}', event)" title="Remove environment">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>
                            </div>
                        </div>
                    `;
                });
                modalList.innerHTML = listHtml;
            }
        }
    }
};

// Modal Control Functions
function openEnvModal() {
    const modal = document.getElementById('envModal');
    if (modal) {
        modal.classList.add('open');
        Env.render();
        const input = document.getElementById('txtModalEnv');
        if (input) setTimeout(() => input.focus(), 60);
    }
}

function closeEnvModal() {
    const modal = document.getElementById('envModal');
    if (modal) modal.classList.remove('open');
}

function handleModalAddEnv() {
    const input = document.getElementById('txtModalEnv');
    if (!input) return;
    const success = Env.add(input.value);
    if (success) {
        input.value = '';
        closeEnvModal();
    }
}

// Keyboard Escape Closes Modals
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeEnvModal();
        closeSavedQueriesModal();
    }
});

// =========================================================================
// Saved Queries Library (Local Storage Persistence)
// =========================================================================
var SavedQueries = {
    init: function () {
        try {
            const raw = localStorage.getItem('fx_saved_queries');
            if (raw) {
                App.savedQueries = JSON.parse(raw);
            } else {
                App.savedQueries = [];
            }
        } catch (e) {
            console.error('Error loading saved queries', e);
            App.savedQueries = [];
        }
        this.updateBadge();
    },

    save: function () {
        localStorage.setItem('fx_saved_queries', JSON.stringify(App.savedQueries));
        this.updateBadge();
    },

    updateBadge: function () {
        const badge = document.getElementById('savedQueriesBadge');
        if (badge) {
            badge.textContent = App.savedQueries.length;
        }
    },

    addCurrent: function () {
        let name = queryName.value ? queryName.value.trim() : '';
        if (!name) {
            name = prompt('Enter a name for this query:', 'Query ' + new Date().toLocaleDateString());
            if (!name) return;
            queryName.value = name;
        }

        const code = (typeof editor !== 'undefined') ? editor.getCode() : fetchXml.value;
        const currentPlural = plural.value ? plural.value.trim() : 'accounts';

        // Check if query with same name exists
        const existingIdx = App.savedQueries.findIndex(q => q.name.toLowerCase() === name.toLowerCase());
        const entry = {
            id: 'q_' + Date.now(),
            name: name,
            xml: code,
            plural: currentPlural,
            updatedAt: new Date().toLocaleDateString()
        };

        if (existingIdx >= 0) {
            App.savedQueries[existingIdx] = entry;
            showToast(`Updated "${name}" in library!`, 'success');
        } else {
            App.savedQueries.unshift(entry);
            showToast(`Saved "${name}" to library!`, 'success');
        }

        this.save();
    },

    load: function (id) {
        const item = App.savedQueries.find(q => q.id === id);
        if (!item) return;

        if (typeof editor !== 'undefined') {
            editor.setCode(item.xml);
        } else {
            fetchXml.value = item.xml;
        }

        queryName.value = item.name;
        document.title = "fX:" + item.name;

        if (item.plural) {
            plural.value = item.plural;
            pluralName = item.plural;
            isNameModified = true;
        }

        fetchXmlOnchange();
        closeSavedQueriesModal();
        showToast(`Loaded query "${item.name}"`, 'success');
    },

    delete: function (id, event) {
        if (event) event.stopPropagation();
        App.savedQueries = App.savedQueries.filter(q => q.id !== id);
        this.save();
        this.renderList();
        showToast('Query removed from library', 'info');
    },

    renderList: function () {
        const list = document.getElementById('savedQueriesList');
        const countLabel = document.getElementById('savedQueriesCountLabel');
        if (countLabel) {
            countLabel.textContent = `${App.savedQueries.length} queries saved`;
        }

        if (!list) return;

        if (App.savedQueries.length === 0) {
            list.innerHTML = `
                <div style="text-align: center; color: var(--text-muted); padding: 2rem 0; font-size: 0.88rem;">
                    No saved queries yet. Click <strong>"Save to Library"</strong> in the toolbar to save your favorite FetchXML queries!
                </div>
            `;
            return;
        }

        let html = '';
        App.savedQueries.forEach(q => {
            html += `
                <div class="saved-query-row">
                    <div class="saved-query-info" onclick="SavedQueries.load('${q.id}')">
                        <span class="saved-query-name">${q.name}</span>
                        <span class="saved-query-meta">Entity: ${q.plural || 'custom'} · Saved: ${q.updatedAt}</span>
                    </div>
                    <div class="item-actions">
                        <button class="btn-secondary" style="padding: 0.25rem 0.55rem; font-size: 0.78rem;" onclick="SavedQueries.load('${q.id}')">
                            Load
                        </button>
                        <button class="btn-action-icon delete" onclick="SavedQueries.delete('${q.id}', event)" title="Delete Query">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
                </div>
            `;
        });
        list.innerHTML = html;
    }
};

function saveQueryToLibrary() {
    SavedQueries.addCurrent();
}

function openSavedQueriesModal() {
    const modal = document.getElementById('savedQueriesModal');
    if (modal) {
        modal.classList.add('open');
        SavedQueries.renderList();
    }
}

function closeSavedQueriesModal() {
    const modal = document.getElementById('savedQueriesModal');
    if (modal) modal.classList.remove('open');
}

function exportSavedQueries() {
    if (App.savedQueries.length === 0) {
        showToast('No saved queries to export', 'info');
        return;
    }
    const dataStr = JSON.stringify(App.savedQueries, null, 2);
    downloadToFile(dataStr, 'FetchXmlTester-SavedQueries.json', 'application/json');
    showToast('Exported saved queries JSON', 'success');
}

// =========================================================================
// Sample FetchXML Queries
// =========================================================================
var SampleQueries = {
    "accounts-with-contacts": {
        name: "Accounts with Contacts",
        plural: "accounts",
        xml: `<fetch mapping='logical'>
   <entity name='account'>
      <attribute name='accountid'/>
      <attribute name='name'/>
      <attribute name='telephone1'/>
      <link-entity name='contact' from='parentcustomerid' to='accountid' link-type='inner' alias='c'>
         <attribute name='fullname'/>
         <attribute name='emailaddress1'/>
      </link-entity>
   </entity>
</fetch>`
    },
    "active-users-no-roles": {
        name: "Active Users without Security Roles",
        plural: "systemusers",
        xml: `<fetch mapping='logical'>
   <entity name='systemuser'>
      <attribute name='systemuserid'/>
      <attribute name='fullname'/>
      <attribute name='domainname'/>
      <filter type='and'>
         <condition attribute='isdisabled' operator='eq' value='0'/>
      </filter>
      <link-entity name='systemuserroles' from='systemuserid' to='systemuserid' link-type='outer' alias='roles'>
         <attribute name='systemuserroleid'/>
      </link-entity>
      <filter type='and'>
         <condition entityname='roles' attribute='systemuserroleid' operator='null'/>
      </filter>
   </entity>
</fetch>`
    },
    "opportunities-aggregate": {
        name: "Opportunities by Estimated Value",
        plural: "opportunities",
        xml: `<fetch aggregate='true'>
   <entity name='opportunity'>
      <attribute name='estimatedvalue' alias='total_revenue' aggregate='sum'/>
      <attribute name='estimatedvalue' alias='avg_revenue' aggregate='avg'/>
      <attribute name='opportunityid' alias='opp_count' aggregate='count'/>
      <attribute name='statuscode' alias='stage' groupby='true'/>
   </entity>
</fetch>`
    },
    "recent-cases": {
        name: "Recent High Priority Cases",
        plural: "incidents",
        xml: `<fetch mapping='logical'>
   <entity name='incident'>
      <attribute name='incidentid'/>
      <attribute name='title'/>
      <attribute name='ticketnumber'/>
      <attribute name='prioritycode'/>
      <attribute name='createdon'/>
      <order attribute='createdon' descending='true'/>
      <filter type='and'>
         <condition attribute='prioritycode' operator='eq' value='1'/>
         <condition attribute='statecode' operator='eq' value='0'/>
      </filter>
   </entity>
</fetch>`
    }
};

function loadSampleQuery(key) {
    if (!key || !SampleQueries[key]) return;
    const sample = SampleQueries[key];

    if (typeof editor !== 'undefined') {
        editor.setCode(sample.xml);
    } else {
        fetchXml.value = sample.xml;
    }

    queryName.value = sample.name;
    document.title = "fX:" + sample.name;

    plural.value = sample.plural;
    pluralName = sample.plural;
    isNameModified = true;

    fetchXmlOnchange();
    showToast(`Loaded sample: "${sample.name}"`, 'success');

    // Reset select element to placeholder
    const select = document.getElementById('sampleQueriesSelect');
    if (select) select.value = '';
}

// =========================================================================
// XML Beautifier & Validation
// =========================================================================
var prettifyXml = function (sourceXml) {
    parseXml(sourceXml);
    if (!isValidXml) {
        showToast('Invalid FetchXML syntax. Cannot beautify.', 'error');
        return sourceXml;
    }

    try {
        var xmlDoc = new DOMParser().parseFromString(sourceXml, 'application/xml');
        var xsltDoc = new DOMParser().parseFromString([
            '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">',
            '  <xsl:strip-space elements="*"/>',
            '  <xsl:template match="para[content-style][not(text())]">',
            '    <xsl:value-of select="normalize-space(.)"/>',
            '  </xsl:template>',
            '  <xsl:template match="node()|@*">',
            '    <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>',
            '  </xsl:template>',
            '  <xsl:output indent="yes"/>',
            '</xsl:stylesheet>',
        ].join('\n'), 'application/xml');

        var xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(xsltDoc);
        var resultDoc = xsltProcessor.transformToDocument(xmlDoc);
        var resultXml = new XMLSerializer().serializeToString(resultDoc);
        return resultXml;
    } catch (e) {
        console.error('Error during beautification', e);
        return sourceXml;
    }
};

var minifyXML = function (xml) {
    return xml
        .replace(/>\s+</g, '><')
        .replace(/\s{2,}/g, ' ')
        .replace(/^\s+|\s+$/gm, '')
        .replace(/\n/g, '')
        .trim();
};

function parseXml(fetchXml) {
    var parser = new DOMParser();
    var parsedXml = parser.parseFromString(fetchXml, "text/xml");
    var statusPill = document.getElementById('xmlStatusPill');

    if (parsedXml.documentElement.innerHTML.includes('parsererror') || parsedXml.getElementsByTagName('parsererror').length > 0) {
        isValidXml = false;
        if (statusPill) {
            statusPill.className = 'xml-status-pill invalid';
            statusPill.innerHTML = `
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>Invalid XML</span>
            `;
        }
    } else {
        isValidXml = true;
        if (statusPill) {
            statusPill.className = 'xml-status-pill valid';
            statusPill.innerHTML = `
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Valid XML</span>
            `;
        }
        return parsedXml;
    }
}

function setPluralFromXml(xml) {
    try {
        var entityTag = xml.getElementsByTagName("entity");
        if (entityTag && entityTag.length > 0) {
            var entityName = entityTag[0].getAttribute("name").toLowerCase();
            
            // Check dictionary in plurals.min.js
            if (typeof plurals !== 'undefined' && plurals[entityName]) {
                pluralName = plurals[entityName];
            } else {
                // English heuristic fallback
                if (entityName.endsWith("s")) {
                    pluralName = entityName + "es";
                } else if (entityName.endsWith("y")) {
                    pluralName = entityName.slice(0, -1) + "ies";
                } else {
                    pluralName = entityName + "s";
                }
            }
            plural.value = pluralName;
        }
    } catch (err) {
        // XML parsing in progress
    }
}

function getEditorCode() {
    if (typeof editor !== 'undefined' && editor && editor.editor) {
        return editor.getCode();
    }
    return fetchXml ? fetchXml.value : '';
}

function combine() {
    var rawOrg = orgURL.value ? orgURL.value.trim() : '';
    var currentPlural = plural.value ? plural.value.trim() : pluralName;
    var code = getEditorCode();

    if (rawOrg) {
        finalLink = rawOrg + apiVersion + currentPlural + "?fetchXml=" + encodeURIComponent(minifyXML(code));
    } else {
        finalLink = apiVersion + currentPlural + "?fetchXml=" + encodeURIComponent(minifyXML(code));
    }

    if (requestURI) {
        requestURI.value = finalLink;
    }

    const finalURIAnchor = document.querySelector("#finalURI");
    if (finalURIAnchor) {
        finalURIAnchor.href = finalLink;
    }
}

function fetchXmlOnchange() {
    var code = getEditorCode();
    if (!code || code.length === 0) {
        isNameModified = false;
        return;
    }

    var xml = parseXml(code);
    if (xml && !isNameModified) {
        setPluralFromXml(xml);
    }
    combine();
}

// =========================================================================
// Event Listeners & Actions
// =========================================================================

// Primary Execution Button: "Test FetchXML"
if (testButton) {
    testButton.onclick = function () {
        fetchXmlOnchange();
        var message = "";
        if (!orgURL || !Env.isValidURL(orgURL.value)) {
            message += "Please select or add a Dataverse environment. ";
            openEnvModal();
        }
        if (!isValidXml) {
            message += "Please enter valid FetchXML. ";
        }

        if (message.length === 0) {
            combine();
            showToast('Executing query in Dynamics 365 WebAPI...', 'info');

            // Open WebAPI endpoint in new window or tab using active session SSO
            const win = window.open(finalLink, '_blank');
            if (!win) {
                const finalEl = document.querySelector("#finalURI");
                if (finalEl) finalEl.click();
            }
        } else {
            showToast(message, 'error');
        }
    };
}

// Organization URL change
if (orgURL) {
    orgURL.onchange = function () {
        if (orgURL.value.length === 0) return;
        const cleaned = Env.cleanUrl(orgURL.value);
        if (Env.isValidURL(cleaned)) {
            orgURL.value = cleaned;
            try {
                const u = new URL(cleaned);
                let name = u.hostname.split('.')[0];
                if (name.toLowerCase() === 'www' || name.length <= 1) name = u.hostname;
                App.orgURLs[name] = cleaned;
                App.activeOrg = name;
                Env.save();
                Env.render();
            } catch (e) { }
            combine();
        } else {
            showToast("Please enter a valid URL (e.g. https://org.crm.dynamics.com)", 'error');
        }
    };
}

// Plural name modified manually
if (plural) {
    plural.onchange = function () {
        pluralName = plural.value;
        isNameModified = true;
        combine();
    };
}

// Query Name sets page title
if (queryName) {
    queryName.onkeyup = function () {
        document.title = queryName.value ? "fX:" + queryName.value : "FetchXml Tester Tool Online";
    };
}

// Beautify Button
const beautifyBtn = document.querySelector('#beautify');
if (beautifyBtn) {
    beautifyBtn.addEventListener('click', () => {
        if (typeof editor === 'undefined') return;
        var ugly = editor.getCode();
        var prettyXml = prettifyXml(ugly);
        editor.setCode(prettyXml);
        showToast('FetchXML formatted and beautified!', 'success');
    });
}

// File Download Helper
const downloadToFile = (content, filename, contentType) => {
    const a = document.createElement('a');
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
};

// Save As File
const saveFileBtn = document.querySelector('#save');
if (saveFileBtn) {
    saveFileBtn.addEventListener('click', () => {
        if (typeof editor === 'undefined') return;
        var fileName = "fetchXml-AshV.xml";
        if (queryName && queryName.value !== null && queryName.value.length > 0) {
            if (queryName.value.endsWith(".xml") || queryName.value.endsWith(".txt"))
                fileName = queryName.value;
            else
                fileName = "fetchXml-" + queryName.value + ".xml";
        }
        downloadToFile(editor.getCode(), fileName, 'text/xml');
        showToast(`Downloading ${fileName}`, 'info');
    });
}

// Copy Request URI button
function copyRequestUri() {
    if (!requestURI.value) {
        combine();
    }
    navigator.clipboard.writeText(requestURI.value).then(() => {
        const label = document.getElementById('copyUriLabel');
        if (label) {
            label.textContent = 'Copied!';
            setTimeout(() => { label.textContent = 'Copy URI'; }, 2000);
        }
        showToast('WebAPI Request URI copied to clipboard!', 'success');
    }).catch(() => {
        requestURI.select();
        document.execCommand('copy');
        showToast('WebAPI Request URI copied!', 'success');
    });
}

// Decode Hash Sharing (Legacy Compatibility)
function decodeUrlHash() {
    var hash = location.hash.split('#');
    if (hash.length === 5) {
        if (typeof editor !== 'undefined') {
            editor.setCode(decodeURIComponent(hash[3]));
        }
        orgURL.value = hash[1];
        plural.value = hash[2];
        queryName.value = hash[4];
        document.title = "fX:" + hash[4];
        location.hash = '';
        parseXml(hash[3]);
        combine();
    }
}

// =========================================================================
// Initialization
// =========================================================================
window.addEventListener('DOMContentLoaded', () => {
    initTheme();
    Env.init();
    SavedQueries.init();
    combine();

    // Safely wait for CodeMirror initialization
    let retries = 0;
    const waitForEditor = () => {
        if (typeof editor !== 'undefined' && editor && editor.editor) {
            syncEditorTheme(App.theme);
            fetchXmlOnchange();
        } else if (retries < 30) {
            retries++;
            setTimeout(waitForEditor, 100);
        }
    };
    waitForEditor();

    decodeUrlHash();
});