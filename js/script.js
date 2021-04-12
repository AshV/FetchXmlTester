var fetchXml = document.querySelector("#fetchXml");
var orgURL = document.querySelector("#orgURL");
var queryName = document.querySelector("#queryName");
var plural = document.querySelector("#plural");
var testButton = document.querySelector("#testButton");
var requestURI = document.querySelector("#requestURI");
var copyLinkButton = document.querySelector('#copyLink');
var apiVersion = "/api/data/v9.2/";
var finalLink = "";
var pluralName = "";
var plurals = {};
var isValidXml = true;
var isNameModified = false;

if (localStorage.getItem("orgURL") !== null)
    orgURL.value = localStorage.getItem("orgURL");

testButton.onclick = function () {
    fetchXmlOnchange();
    var message = "";
    if (!isValidURL(orgURL.value) || orgURL.value === null)
        message += "Please enter a valid URL. ";
    if (!isValidXml)
        message += "Please enter valid fetchXml. "

    if (message.length == 0) {
        document.querySelector("#finalURI").href = finalLink;
        requestURI.value = finalLink;
        document.querySelector("#finalURI").click();
    } else {
        alert(message);
    }
}

orgURL.onchange = function () {
    if (orgURL.value.length === 0)
        return;
    if (isValidURL(orgURL.value)) {
        var url = new URL(orgURL.value);
        orgURL.value = url.origin;
        localStorage.setItem("orgURL", orgURL.value);
        combine();
    } else {
        alert("Please enter a valid URL.");
    }
};

fetchXmlOnchange = function () {
    if (editor.getCode().length === 0) {
        isNameModified = false;
        return;
    }
    var xml = parseXml(editor.getCode());
    if (!isNameModified) {
        setPluralFromXml(xml);
    }
    combine();
};

plural.onchange = function () {
    pluralName = plural.value;
    isNameModified = true;
    combine();
};

queryName.onkeyup = function () {
    document.title = "fX:" + queryName.value;
}

function combine() {
    finalLink = orgURL.value + apiVersion + pluralName + "?fetchXml=" + editor.getCode();
    document.querySelector("#finalURI").href = finalLink;
}

function setPluralFromXml(xml) {
    try {
        var entityTag = xml.getElementsByTagName("entity");
        var entityName = entityTag[0].getAttribute("name").toLowerCase();
        pluralName = plurals[entityName];
        if (pluralName != undefined) {
            plural.value = pluralName;
        }
        else {
            if (entityName.endsWith("s")) {
                plural.value = entityName + "es";
                pluralName = entityName + "es";
            } else if (entityName.endsWith("y")) {
                entityName = entityName.slice(0, -1);
                plural.value = entityName + "ies";
                pluralName = entityName + "ies";
            } else {
                plural.value = entityName + "s";
                pluralName = entityName + "s";
            }
        }
    } catch (err) {
        isValidXml = false;
    }
}

function parseXml(fetchXml) {
    debugger;
    var parser = new DOMParser();
    var parsedXml = parser.parseFromString(fetchXml, "text/xml");
    if (parsedXml.documentElement.innerHTML.includes('parsererror')) {
        isValidXml = false;
        console.log("fetchXml is Invalid : " + parsedXml.documentElement.textContent);
    } else {
        isValidXml = true;
        return parsedXml;
    }
}

function isValidURL(str) {
    regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    if (regexp.test(str)) {
        return true;
    }
    else {
        return false;
    }
}

function copied() {
    debugger;
    if (isValidXml)
        this.parentElement.dataset.balloon = "Copied to Clipboard!";
};

function restoreCopied() {
    this.parentElement.dataset.balloon = "Generated Requested URI, Click to Copy.";
};

function restoreCopiedButton() {
    this.parentElement.dataset.balloon = "Copy Query Tool Link To Share.";
};

requestURI.onclick = copied;
requestURI.onmouseout = restoreCopied;

copyLinkButton.onclick = copied;
copyLinkButton.onmouseout = restoreCopiedButton;

const downloadToFile = (content, filename, contentType) => {
    const a = document.createElement('a');
    const file = new Blob([content], { type: contentType });

    a.href = URL.createObjectURL(file);
    a.download = filename;
    a.click();

    URL.revokeObjectURL(a.href);
};

document.querySelector('#save').addEventListener('click', () => {
    var fileName = "fetchXml-AshV.xml";
    if (queryName.value !== null && queryName.value.length > 0) {

        if (queryName.value.endsWith(".xml") || queryName.value.endsWith(".txt"))
            fileName = queryName.value;
        else
            fileName = "fetchXml-" + queryName.value + ".xml"
    }
    downloadToFile(editor.getCode(), fileName, 'text/plain');
});

var prettifyXml = function (sourceXml) {
    debugger;
    parseXml(sourceXml);
    if (!isValidXml) {
        alert('Invalid fetchXml!');
        return sourceXml;
    }

    var xmlDoc = new DOMParser().parseFromString(sourceXml, 'application/xml');
    var xsltDoc = new DOMParser().parseFromString([
        // describes how we want to modify the XML - indent everything
        '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">',
        '  <xsl:strip-space elements="*"/>',
        '  <xsl:template match="para[content-style][not(text())]">', // change to just text() to strip space in text nodes
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
};

document.querySelector('#beautify').addEventListener('click', () => {
    var ugly = editor.getCode();
    var prettyXml = prettifyXml(ugly);
    editor.setCode(prettyXml);
});

copyLinkButton.addEventListener('click', () => {
    parseXml(editor.getCode());
    if (!isValidXml) {
        alert('Invalid fetchXml!');
        return;
    }
    var shareHome = 'https://www.ashishvishwakarma.com/FetchXmlTester/';
    var shareUrl = orgURL.value;
    var sharePlural = plural.value;
    var shareQueryName = queryName.value;
    var shareXml = encodeURIComponent(editor.getCode());
    var shareLink = shareHome.concat('#', shareUrl, '#', sharePlural, '#', shareXml, '#', shareQueryName);

    requestURI.value = shareLink;
    requestURI.select();
    requestURI.setSelectionRange(0, 99999); /* For mobile devices */

    document.execCommand("copy");
});

function decodeUrlHash() {
    var hash = location.hash.split('#');
    if (hash.length == 5) {
        editor.setCode(decodeURIComponent(hash[3]));
        orgURL.value = hash[1];
        plural.value = hash[2];
        queryName.value = hash[4];
        location.hash = '';
        parseXml(hash[3]);
    }
}

window.onload = decodeUrlHash;