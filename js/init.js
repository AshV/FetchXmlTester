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
    document.getElementById('queryName').value = queryName;
    document.title = queryName;
}

document.getElementById('file-input').addEventListener('change', readSingleFile, false);

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const load = urlParams.get('load');
        if (load !== null && load !== "") {
            fetch(load)
                .then(response => {
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    return response.text();
                })
                .then(data => {
                    editor.setCode(prettifyXml(data));
                })
                .catch(error => {
                    console.error('Error during fetch operation:', error);
                    alert('Error during loading URL');
                });
        }
    }, 1000);
});
