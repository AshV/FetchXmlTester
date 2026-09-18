function loadFile() {
    document.getElementById('file-input').click();
}

function readSingleFile(e) {
    var file = e.target.files[0];
    if (!file) {
        return;
    }
    var reader = new FileReader();
    reader.onload = function (e) {
        var contents = e.target.result;
        displayContents(contents);
    };
    reader.readAsText(file);
}

function setEditorCodeSafely(code, callback) {
    let retries = 0;
    const trySetCode = () => {
        if (typeof editor !== 'undefined' && editor && editor.editor) {
            editor.setCode(code);

            // Immediately trigger XML validation, plural resolution, and WebAPI URL combination
            if (typeof fetchXmlOnchange === 'function') {
                fetchXmlOnchange();
            }
            if (typeof callback === 'function') {
                callback();
            }
        } else if (retries < 100) {
            retries++;
            setTimeout(trySetCode, 100);
        } else {
            console.error('Editor initialization timeout');
            if (typeof showToast === 'function') {
                showToast('Error: Editor took too long to load', 'error');
            } else {
                alert('Error: Editor took too long to load');
            }
        }
    };
    trySetCode();
}

function displayContents(contents) {
    var formatted = contents;
    if (typeof prettifyXml === 'function') {
        formatted = prettifyXml(contents);
    }
    setEditorCodeSafely(formatted, () => {
        var fileInputEl = document.getElementById('file-input');
        if (fileInputEl && fileInputEl.value) {
            var rawFilename = fileInputEl.value.substring(fileInputEl.value.lastIndexOf('\\') + 1);
            var cleanName = decodeURIComponent(rawFilename).replace(/\.[^/.]+$/, '');
            var queryNameEl = document.getElementById('queryName');
            if (queryNameEl) queryNameEl.value = cleanName;
            document.title = "fX:" + cleanName;
            fileInputEl.value = '';
        }
        if (typeof showToast === 'function') {
            showToast('File loaded successfully', 'success');
        }
    });
}

const fileInput = document.getElementById('file-input');
if (fileInput) {
    fileInput.addEventListener('change', readSingleFile, false);
}

// Auto-convert GitHub blob links and Gists to direct CORS-friendly raw URLs
function transformGitHubUrl(url) {
    if (!url || typeof url !== 'string') return url;
    let clean = url.trim();

    // Standard GitHub blob link: https://github.com/:user/:repo/blob/:branch/:path...
    const ghBlobMatch = clean.match(/^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)$/i);
    if (ghBlobMatch) {
        return `https://raw.githubusercontent.com/${ghBlobMatch[1]}/${ghBlobMatch[2]}/${ghBlobMatch[3]}/${ghBlobMatch[4]}`;
    }

    // GitHub raw link: https://github.com/:user/:repo/raw/:branch/:path...
    const ghRawMatch = clean.match(/^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/raw\/([^/]+)\/(.+)$/i);
    if (ghRawMatch) {
        return `https://raw.githubusercontent.com/${ghRawMatch[1]}/${ghRawMatch[2]}/${ghRawMatch[3]}/${ghRawMatch[4]}`;
    }

    // GitHub Gist link: https://gist.github.com/:user/:gistId
    const gistMatch = clean.match(/^https?:\/\/gist\.github\.com\/([^/]+)\/([a-f0-9]+)(?:#.+)?$/i);
    if (gistMatch) {
        return `https://gist.githubusercontent.com/${gistMatch[1]}/${gistMatch[2]}/raw`;
    }

    return clean;
}

// Parse WebAPI Request URL containing ?fetchXml= to extract org, entity plural, and XML
function parseWebApiUrl(input) {
    if (!input || typeof input !== 'string') return null;
    const trimmed = input.trim();

    if (!trimmed.includes('fetchXml=') && !trimmed.includes('fetchxml=')) {
        return null;
    }

    try {
        let urlObj;
        const isAbsolute = /^https?:\/\//i.test(trimmed);
        if (isAbsolute) {
            urlObj = new URL(trimmed);
        } else {
            urlObj = new URL(trimmed.startsWith('/') ? `https://dummy.local${trimmed}` : `https://dummy.local/${trimmed}`);
        }

        const fetchXmlParam = urlObj.searchParams.get('fetchXml') || urlObj.searchParams.get('fetchxml');
        if (!fetchXmlParam) return null;

        let orgUrl = isAbsolute ? urlObj.origin : null;
        let entityPlural = null;

        const pathParts = urlObj.pathname.split('/').filter(Boolean);
        if (pathParts.length > 0) {
            const candidate = pathParts[pathParts.length - 1];
            if (!/^v\d+\.\d+$/i.test(candidate) && candidate.toLowerCase() !== 'data' && candidate.toLowerCase() !== 'api') {
                entityPlural = candidate;
            }
        }

        return {
            isWebApiUrl: true,
            orgUrl: orgUrl,
            entityPlural: entityPlural,
            fetchXml: fetchXmlParam
        };
    } catch (e) {
        const match = trimmed.match(/[?&]fetch[Xx]ml=([^&]+)/);
        if (match) {
            return {
                isWebApiUrl: true,
                orgUrl: null,
                entityPlural: null,
                fetchXml: decodeURIComponent(match[1])
            };
        }
        return null;
    }
}

// =========================================================================
// URL Query Parameters Loader (WebAPI Tester Parity: ?load=, ?url=, ?file=, ?query=, ?env=)
// =========================================================================
function loadFromUrlParams() {
    const queryString = window.location.search;
    if (!queryString) return;
    const urlParams = new URLSearchParams(queryString);

    // 1. Environment parameter (?env= or ?org=)
    const envParam = urlParams.get('env') || urlParams.get('org');
    if (envParam && typeof Env !== 'undefined' && Env.isValidURL(envParam)) {
        Env.add(envParam);
    }

    // 2. Query name parameter (?name= or ?title=)
    const nameParam = urlParams.get('name') || urlParams.get('title');
    if (nameParam) {
        const cleanName = decodeURIComponent(nameParam);
        const queryNameEl = document.getElementById('queryName');
        if (queryNameEl) queryNameEl.value = cleanName;
        document.title = `fX: ${cleanName}`;
    }

    // 3. Entity plural parameter (?plural= or ?entity=)
    const pluralParam = urlParams.get('plural') || urlParams.get('entity');
    if (pluralParam) {
        const cleanPlural = decodeURIComponent(pluralParam);
        const pluralInput = document.getElementById('plural');
        if (pluralInput) {
            pluralInput.value = cleanPlural;
            if (typeof pluralName !== 'undefined') pluralName = cleanPlural;
            if (typeof isNameModified !== 'undefined') isNameModified = true;
        }
    }

    // 4. Remote file URL parameter (?load= or ?url= or ?file= or ?src=)
    let remoteUrl = urlParams.get('load') || urlParams.get('url') || urlParams.get('file') || urlParams.get('src');
    if (remoteUrl && remoteUrl.trim()) {
        remoteUrl = transformGitHubUrl(remoteUrl.trim());

        if (typeof showToast === 'function') {
            showToast('Loading query file from URL...', 'info');
        }

        fetch(remoteUrl)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
                return response.text();
            })
            .then(content => {
                if (!content || !content.trim()) {
                    if (typeof showToast === 'function') {
                        showToast('Remote query file is empty', 'warning');
                    }
                    return;
                }

                // Extract query name from URL if not already set
                try {
                    const urlObj = new URL(remoteUrl, window.location.href);
                    const pathParts = urlObj.pathname.split('/');
                    const filename = pathParts[pathParts.length - 1];
                    const queryNameEl = document.getElementById('queryName');
                    if (filename && queryNameEl && !queryNameEl.value) {
                        const cleanName = decodeURIComponent(filename).replace(/\.[^/.]+$/, '');
                        queryNameEl.value = cleanName;
                        document.title = `fX: ${cleanName}`;
                    }
                } catch (e) { }

                let formatted = content.trim();
                if (typeof prettifyXml === 'function') {
                    formatted = prettifyXml(formatted);
                }

                setEditorCodeSafely(formatted, () => {
                    if (typeof showToast === 'function') {
                        showToast('FetchXML loaded successfully from URL', 'success');
                    }
                });
            })
            .catch(error => {
                console.error('Failed to load FetchXML file from URL:', error);
                if (typeof showToast === 'function') {
                    showToast(`Failed to load URL (check CORS / link): ${error.message}`, 'error');
                } else {
                    alert('Failed to load FetchXML from URL');
                }
            });
        return;
    }

    // 5. Inline query parameter (?query= or ?q= or ?fetchxml= or ?xml=)
    const inlineQuery = urlParams.get('query') || urlParams.get('q') || urlParams.get('fetchxml') || urlParams.get('xml');
    if (inlineQuery && inlineQuery.trim()) {
        const raw = inlineQuery.trim();
        const webApiParsed = parseWebApiUrl(raw);

        if (webApiParsed) {
            // Environment from WebAPI URL if not already specified by ?env=
            if (webApiParsed.orgUrl && !envParam && typeof Env !== 'undefined' && Env.isValidURL(webApiParsed.orgUrl)) {
                Env.add(webApiParsed.orgUrl);
            }

            // Entity plural from WebAPI URL if not already specified by ?plural=
            if (webApiParsed.entityPlural && !pluralParam) {
                const pluralInput = document.getElementById('plural');
                if (pluralInput) {
                    pluralInput.value = webApiParsed.entityPlural;
                    if (typeof pluralName !== 'undefined') pluralName = webApiParsed.entityPlural;
                    if (typeof isNameModified !== 'undefined') isNameModified = true;
                }
            }

            let formatted = webApiParsed.fetchXml;
            if (typeof prettifyXml === 'function') {
                formatted = prettifyXml(formatted);
            }

            setEditorCodeSafely(formatted, () => {
                if (typeof showToast === 'function') {
                    showToast('Query and environment loaded from Web API URL', 'success');
                }
            });
        } else {
            // Direct FetchXML string
            let formatted = raw;
            if (typeof prettifyXml === 'function') {
                formatted = prettifyXml(formatted);
            }

            setEditorCodeSafely(formatted, () => {
                if (typeof showToast === 'function') {
                    showToast('Query loaded from URL parameter', 'success');
                }
            });
        }
    }
}

// Alias for backwards compatibility
window.loadFromQueryParam = loadFromUrlParams;

if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", loadFromUrlParams);
} else {
    loadFromUrlParams();
}

