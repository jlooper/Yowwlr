
var path = require("path");
var fs = require("fs");

module.exports = function() {

    console.log("Configure firebase");
    var buildGradlePath = path.join(__dirname, "..", "..", "platforms", "android", "build.gradle"); 
    if (fs.existsSync(buildGradlePath)) {
        var buildGradleContent = fs.readFileSync(buildGradlePath).toString();

        if (buildGradleContent.indexOf('classpath "com.google.gms:google-services:3.0.0"') != -1) {
            return;
        }

        var search = -1;

        search = buildGradleContent.indexOf("repositories", 0);
        if (search == -1) {
            return;
        }

        search = buildGradleContent.indexOf("dependencies", search);
        if (search == -1) {
            return;
        }

        search = buildGradleContent.indexOf("}", search);
        if (search == -1) {
            return;
        }

        buildGradleContent = buildGradleContent.substr(0, search - 1) + '    classpath "com.google.gms:google-services:3.0.0"\n    ' + buildGradleContent.substr(search - 1);

        fs.writeFileSync(buildGradlePath, buildGradleContent);
    }
};
