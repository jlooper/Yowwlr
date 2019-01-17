var path = require("path");
var fs = require("fs");

module.exports = function($logger, $projectData) {

    return new Promise(function(resolve, reject) {
        $logger.out("Configure firebase");
        let projectBuildGradlePath = path.join($projectData.platformsDir, "android", "build.gradle");
        if (fs.existsSync(projectBuildGradlePath)) {
            let buildGradleContent = fs.readFileSync(projectBuildGradlePath).toString();

            if (buildGradleContent.indexOf("fabric.io") === -1) {
                let repositoriesNode = buildGradleContent.indexOf("repositories", 0);
                if (repositoriesNode > -1) {
                    repositoriesNode = buildGradleContent.indexOf("}", repositoriesNode);
                    buildGradleContent = buildGradleContent.substr(0, repositoriesNode - 1) + '\t\tmaven { url "https://maven.fabric.io/public" }\n\t\tmaven { url "https://dl.bintray.com/android/android-tools" }\n' + buildGradleContent.substr(repositoriesNode - 1);
                }

                let dependenciesNode = buildGradleContent.indexOf("dependencies", 0);
                if (dependenciesNode > -1) {
                    dependenciesNode = buildGradleContent.indexOf("}", dependenciesNode);
                    // see https://docs.fabric.io/android/changelog.html
                    buildGradleContent = buildGradleContent.substr(0, dependenciesNode - 1) + '	    classpath "io.fabric.tools:gradle:1.26.1"\n' + buildGradleContent.substr(dependenciesNode - 1);
                }

            } else if (buildGradleContent.indexOf("https://dl.bintray.com/android/android-tools") === -1) {
                let repositoriesNode = buildGradleContent.indexOf("repositories", 0);
                if (repositoriesNode > -1) {
                    repositoriesNode = buildGradleContent.indexOf("}", repositoriesNode);
                    buildGradleContent = buildGradleContent.substr(0, repositoriesNode - 1) + '\t\tmaven { url "https://dl.bintray.com/android/android-tools" }\n' + buildGradleContent.substr(repositoriesNode - 1);
                }
            }

            let gradlePattern = /classpath ('|")com\.android\.tools\.build:gradle:\d+\.\d+\.\d+('|")/;
            let googleServicesPattern = /classpath ('|")com\.google\.gms:google-services:\d+\.\d+\.\d+('|")/;
            let latestGoogleServicesPlugin = 'classpath "com.google.gms:google-services:4.2.0"';
            if (googleServicesPattern.test(buildGradleContent)) {
                buildGradleContent = buildGradleContent.replace(googleServicesPattern, latestGoogleServicesPlugin);
            } else {
                buildGradleContent = buildGradleContent.replace(gradlePattern, function (match) {
                    return match + '\n        ' + latestGoogleServicesPlugin;
                });
            }

            buildGradleContent = buildGradleContent.replace("com.android.tools.build:gradle:3.2.0", "com.android.tools.build:gradle:3.2.1");

            fs.writeFileSync(projectBuildGradlePath, buildGradleContent);
        }

        let projectAppBuildGradlePath = path.join($projectData.platformsDir, "android", "app", "build.gradle");
        if (fs.existsSync(projectAppBuildGradlePath)) {
          let appBuildGradleContent = fs.readFileSync(projectAppBuildGradlePath).toString();
          if (appBuildGradleContent.indexOf("buildMetadata.finalizedBy(copyMetadata)") === -1) {
            appBuildGradleContent = appBuildGradleContent.replace("ensureMetadataOutDir.finalizedBy(buildMetadata)", "ensureMetadataOutDir.finalizedBy(buildMetadata)\n\t\tbuildMetadata.finalizedBy(copyMetadata)");
            appBuildGradleContent += `
task copyMetadata {
  doLast {
    copy {
        from "$projectDir/src/main/assets/metadata"
        def toDir = project.hasProperty("release") ? "release" : "debug"
        def toAssetsDir = "assets"

        if (new File("$projectDir/build/intermediates/merged_assets").listFiles() != null) {
          toAssetsDir = "merged_assets"
          toDir = new File("$projectDir/build/intermediates/merged_assets").listFiles()[0].name
          if (toDir == 'debug') {
            toDir += "/mergeDebugAssets"
          } else {
            toDir += "/mergeReleaseAssets"
          }
          toDir += "/out"
        } else if (new File("$projectDir/build/intermediates/assets").listFiles() != null) {
          toDir = new File("$projectDir/build/intermediates/assets").listFiles()[0].name
          if (toDir != 'debug' && toDir != 'release') {
            toDir += "/release"
          }
        }

        into "$projectDir/build/intermediates/" + toAssetsDir + "/" + toDir + "/metadata"
    }
  }
}`;
            fs.writeFileSync(projectAppBuildGradlePath, appBuildGradleContent);
          }
        }

        resolve();
    });
};
