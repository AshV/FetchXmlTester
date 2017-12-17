var X = "";

var orgURL = document.querySelector("#orgURL");
var fetchXml = document.querySelector("#fetchXml");
var finalLink = document.getElementById("FORM");
var link = document.querySelector("#link");
orgURL.onchange = function () {
    link.href = orgURL.value + "/api/data/v8.2/" + X + "?fetchXml=" + fetchXml.value;
};
fetchXml.onchange = function () {
    var parser = new DOMParser();
    var xml = parser.parseFromString(fetchXml.value, "text/xml");
    var entityTag = xml.getElementsByTagName("entity");
    X = entityTag[0].getAttribute("name") + "s";
    link.href = orgURL.value + "/api/data/v8.2/" + X + "?fetchXml=" + fetchXml.value;

};
finalLink.onsubmit = function () {
    link.click();
}