var smileyContent = document.getElementById("smiley").content;
var smileys = document.getElementsByClassName("smiley");

for (var i = 0, len = smileys.length; i < len; i++) {
    smileys[i].appendChild(
        document.importNode(smileyContent, true)
    );
}
