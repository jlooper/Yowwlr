Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var file_system_1 = require("tns-core-modules/file-system");
// Allows greater flexibility with `file-system` and Angular
// Also provides a way for `file-system` to be mocked for testing
var NSFileSystem = /** @class */ (function () {
    function NSFileSystem() {
    }
    NSFileSystem.prototype.currentApp = function () {
        return file_system_1.knownFolders.currentApp();
    };
    NSFileSystem.prototype.fileFromPath = function (path) {
        return file_system_1.File.fromPath(path);
    };
    NSFileSystem.prototype.fileExists = function (path) {
        return file_system_1.File.exists(path);
    };
    NSFileSystem = __decorate([
        core_1.Injectable()
    ], NSFileSystem);
    return NSFileSystem;
}());
exports.NSFileSystem = NSFileSystem;
//# sourceMappingURL=ns-file-system.js.map