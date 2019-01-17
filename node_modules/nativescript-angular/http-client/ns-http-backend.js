Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var ns_file_system_1 = require("../file-system/ns-file-system");
var http_utils_1 = require("./http-utils");
var NsHttpBackEnd = /** @class */ (function (_super) {
    __extends(NsHttpBackEnd, _super);
    function NsHttpBackEnd(xhrFactory, nsFileSystem) {
        var _this = _super.call(this, xhrFactory) || this;
        _this.nsFileSystem = nsFileSystem;
        return _this;
    }
    NsHttpBackEnd.prototype.handle = function (req) {
        var result;
        if (http_utils_1.isLocalRequest(req.url)) {
            result = this.handleLocalFileRequest(req.url);
        }
        else {
            result = _super.prototype.handle.call(this, req);
        }
        return result;
    };
    NsHttpBackEnd.prototype.handleLocalFileRequest = function (url) {
        return http_utils_1.processLocalFileRequest(url, this.nsFileSystem, createSuccessResponse, createErrorResponse);
    };
    NsHttpBackEnd = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.XhrFactory, ns_file_system_1.NSFileSystem])
    ], NsHttpBackEnd);
    return NsHttpBackEnd;
}(http_1.HttpXhrBackend));
exports.NsHttpBackEnd = NsHttpBackEnd;
function createSuccessResponse(url, body, status) {
    return new http_1.HttpResponse({
        url: url,
        body: body,
        status: status,
        statusText: "OK"
    });
}
function createErrorResponse(url, body, status) {
    return new http_1.HttpErrorResponse({
        url: url,
        error: body,
        status: status,
        statusText: "ERROR"
    });
}
//# sourceMappingURL=ns-http-backend.js.map