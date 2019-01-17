Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var compiler_1 = require("@angular/compiler");
var file_system_1 = require("tns-core-modules/file-system");
var ns_file_system_1 = require("./file-system/ns-file-system");
var sourceExtensionsMap = {
    ".scss": ".css",
    ".sass": ".css",
    ".less": ".css"
};
var FileSystemResourceLoader = /** @class */ (function (_super) {
    __extends(FileSystemResourceLoader, _super);
    function FileSystemResourceLoader(fs) {
        var _this = _super.call(this) || this;
        _this.fs = fs;
        return _this;
    }
    FileSystemResourceLoader.prototype.get = function (url) {
        var resolvedPath = this.resolve(url);
        var templateFile = this.fs.fileFromPath(resolvedPath);
        return templateFile.readText();
    };
    FileSystemResourceLoader.prototype.resolve = function (url) {
        var normalizedSourceUrl = this.resolveRelativeUrls(url);
        var normalizedCompiledFileUrl = normalizedSourceUrl.replace(/\.\w+$/, function (ext) { return sourceExtensionsMap[ext] || ext; });
        if (normalizedCompiledFileUrl !== normalizedSourceUrl && this.fs.fileExists(normalizedCompiledFileUrl)) {
            return normalizedCompiledFileUrl;
        }
        if (this.fs.fileExists(normalizedSourceUrl)) {
            return normalizedSourceUrl;
        }
        if (normalizedCompiledFileUrl === normalizedSourceUrl) {
            throw new Error("Could not resolve " + url + ". Looked for: " + normalizedSourceUrl + ".");
        }
        else {
            throw new Error("Could not resolve " + url + "." +
                ("Looked for: " + normalizedCompiledFileUrl + ", " + normalizedSourceUrl + "."));
        }
    };
    FileSystemResourceLoader.prototype.resolveRelativeUrls = function (url) {
        // Angular assembles absolute URLs and prefixes them with //
        if (url.indexOf("/") !== 0) {
            // Resolve relative URLs based on the app root.
            return file_system_1.path.join(this.fs.currentApp().path, url);
        }
        else {
            return url;
        }
    };
    FileSystemResourceLoader = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [ns_file_system_1.NSFileSystem])
    ], FileSystemResourceLoader);
    return FileSystemResourceLoader;
}(compiler_1.ResourceLoader));
exports.FileSystemResourceLoader = FileSystemResourceLoader;
//# sourceMappingURL=resource-loader.js.map