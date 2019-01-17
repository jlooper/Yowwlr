Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var http_utils_1 = require("../http-client/http-utils");
var ns_file_system_1 = require("../file-system/ns-file-system");
var NSXSRFStrategy = /** @class */ (function () {
    function NSXSRFStrategy() {
    }
    NSXSRFStrategy.prototype.configureRequest = function (_req) {
        // noop
    };
    return NSXSRFStrategy;
}());
exports.NSXSRFStrategy = NSXSRFStrategy;
var NSHttp = /** @class */ (function (_super) {
    __extends(NSHttp, _super);
    function NSHttp(backend, defaultOptions, nsFileSystem) {
        var _this = _super.call(this, backend, defaultOptions) || this;
        _this.nsFileSystem = nsFileSystem;
        return _this;
    }
    /**
     * Performs a request with `request` http method.
     */
    NSHttp.prototype.request = function (req, options) {
        var urlString = typeof req === "string" ? req : req.url;
        if (http_utils_1.isLocalRequest(urlString)) {
            return this.requestLocalFile(urlString);
        }
        else {
            return _super.prototype.request.call(this, req, options);
        }
    };
    /**
     * Performs a request with `get` http method.
     */
    NSHttp.prototype.get = function (url, options) {
        if (http_utils_1.isLocalRequest(url)) {
            return this.requestLocalFile(url);
        }
        else {
            return _super.prototype.get.call(this, url, options);
        }
    };
    NSHttp.prototype.requestLocalFile = function (url) {
        return http_utils_1.processLocalFileRequest(url, this.nsFileSystem, createResponse, createResponse);
    };
    NSHttp = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.ConnectionBackend, http_1.RequestOptions, ns_file_system_1.NSFileSystem])
    ], NSHttp);
    return NSHttp;
}(http_1.Http));
exports.NSHttp = NSHttp;
function createResponse(url, body, status) {
    return new http_1.Response(new http_1.ResponseOptions({
        body: body,
        status: status,
        statusText: "OK",
        type: status === 200 ? http_1.ResponseType.Default : http_1.ResponseType.Error,
        url: url
    }));
}
//# sourceMappingURL=ns-http.js.map