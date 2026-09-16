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

function displayContents(contents) {
    editor.setCode(contents);
    var queryName = document.getElementById('file-input').value;
    queryName = queryName.substring(queryName.lastIndexOf('\\') + 1);
    var queryNameEl = document.getElementById('queryName');
    if (queryNameEl) queryNameEl.value = queryName;
    document.title = queryName ? "fX:" + queryName : "FetchXML Tester Online";
    if (typeof fetchXmlOnchange === 'function') {
        fetchXmlOnchange();
    }
}

const fileInput = document.getElementById('file-input');
if (fileInput) {
    fileInput.addEventListener('change', readSingleFile, false);
}

function loadFromQueryParam() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    // Support both ?load= and ?url= parameters
    const load = urlParams.get('load') || urlParams.get('url');
    if (load !== null && load !== "") {
        fetch(load)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.text();
            })
            .then(data => {
                let retries = 0;
                const trySetCode = () => {
                    if (typeof editor !== 'undefined' && editor && editor.editor) {
                        editor.setCode(data);

                        // Extract query name from URL if possible
                        try {
                            const urlObj = new URL(load, window.location.href);
                            const pathParts = urlObj.pathname.split('/');
                            const filename = pathParts[pathParts.length - 1];
                            if (filename && filename.length > 0) {
                                const queryNameEl = document.getElementById('queryName');
                                if (queryNameEl && !queryNameEl.value) {
                                    queryNameEl.value = decodeURIComponent(filename);
                                    document.title = "fX:" + decodeURIComponent(filename);
                                }
                            }
                        } catch (e) { }

                        // Immediately trigger XML validation, plural resolution, and WebAPI URL combination
                        if (typeof fetchXmlOnchange === 'function') {
                            fetchXmlOnchange();
                        }
                        if (typeof showToast === 'function') {
                            showToast('FetchXML loaded successfully from URL', 'success');
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
            })
            .catch(error => {
                console.error('Error during fetch operation:', error);
                if (typeof showToast === 'function') {
                    showToast('Failed to load FetchXML from URL (check URL and CORS)', 'error');
                } else {
                    alert('Error during loading URL');
                }
            });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", loadFromQueryParam);
} else {
    loadFromQueryParam();
}
