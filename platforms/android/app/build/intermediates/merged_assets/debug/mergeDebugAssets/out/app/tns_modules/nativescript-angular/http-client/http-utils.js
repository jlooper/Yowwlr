Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var file_system_1 = require("tns-core-modules/file-system/file-system");
function isLocalRequest(url) {
    return url.indexOf("~") === 0 || url.indexOf("/") === 0;
}
exports.isLocalRequest = isLocalRequest;
function getAbsolutePath(url, nsFileSystem) {
    url = url.replace("~", "").replace("/", "");
    url = file_system_1.path.join(nsFileSystem.currentApp().path, url);
    return url;
}
exports.getAbsolutePath = getAbsolutePath;
function processLocalFileRequest(url, nsFileSystem, successResponse, errorResponse) {
    url = getAbsolutePath(url, nsFileSystem);
    // request from local app resources
    return new rxjs_1.Observable(function (observer) {
        if (nsFileSystem.fileExists(url)) {
            var localFile = nsFileSystem.fileFromPath(url);
            localFile.readText()
                .then(function (data) {
                try {
                    var json = JSON.parse(data);
                    observer.next(successResponse(url, json, 200));
                    observer.complete();
                }
                catch (error) {
                    // Even though the response status was 2xx, this is still an error.
                    // The parse error contains the text of the body that failed to parse.
                    var errorResult = { error: error, text: data };
                    observer.error(errorResponse(url, errorResult, 200));
                }
            }, function (err) {
                observer.error(errorResponse(url, err, 400));
            });
        }
        else {
            observer.error(errorResponse(url, "Not Found", 404));
        }
    });
}
exports.processLocalFileRequest = processLocalFileRequest;
//# sourceMappingURL=http-utils.js.map