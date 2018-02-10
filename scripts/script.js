var X = "";
var fetchXml = document.querySelector("#fetchXml");
var orgURL = document.querySelector("#orgURL");
var plural = document.querySelector("#plural");
var apiVersion = "/api/data/v8.2/";
var finalLink = "";
orgURL.onchange = function () {
    if (isValidURL(orgURL.value)) {
        
    } else {
        alert("Please enter a valid URL.");
    }
//    link.href = orgURL.value + "/api/data/v8.2/" + X + "?fetchXml=" + fetchXml.value;
};
fetchXml.onchange = function () {
    var parser = new DOMParser();
    var xml = parser.parseFromString(fetchXml.value, "text/xml");
    var entityTag = xml.getElementsByTagName("entity");
    X = entityTag[0].getAttribute("name") + "s";
    link.href = orgURL.value + "/api/data/v8.2/" + X + "?fetchXml=" + fetchXml.value;

};


function isValidURL(str) {
    var pattern = new RegExp('^(https?:\/\/)?' + // protocol
        '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|' + // domain name
        '((\d{1,3}\.){3}\d{1,3}))' + // OR ip (v4) address
        '(\:\d+)?(\/[-a-z\d%_.~+]*)*' + // port and path
        '(\?[;&a-z\d%_.~+=-]*)?' + // query string
        '(\#[-a-z\d_]*)?$', 'i'); // fragment locater
    if (!pattern.test(str)) {
        return false;
    } else {
        return true;
    }
}