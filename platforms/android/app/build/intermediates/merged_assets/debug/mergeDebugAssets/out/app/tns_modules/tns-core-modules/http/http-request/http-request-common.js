Object.defineProperty(exports, "__esModule", { value: true });
function getFilenameFromUrl(url) {
    var fs = require("file-system");
    var slashPos = url.lastIndexOf("/") + 1;
    var questionMarkPos = url.lastIndexOf("?");
    var actualFileName;
    if (questionMarkPos !== -1) {
        actualFileName = url.substring(slashPos, questionMarkPos);
    }
    else {
        actualFileName = url.substring(slashPos);
    }
    var result = fs.path.join(fs.knownFolders.documents().path, actualFileName);
    return result;
}
exports.getFilenameFromUrl = getFilenameFromUrl;
//# sourceMappingURL=http-request-common.js.map