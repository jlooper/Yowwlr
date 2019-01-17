Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
// IMPORTant: Importing "@angular/common/http" for the first time overwrites the
// global.__extends function.
var cachedExtends = global.__extends;
var http_1 = require("@angular/common/http");
global.__extends = cachedExtends;
var ns_file_system_1 = require("../file-system/ns-file-system");
var ns_http_backend_1 = require("./ns-http-backend");
var NativeScriptHttpClientModule = /** @class */ (function () {
    function NativeScriptHttpClientModule() {
    }
    NativeScriptHttpClientModule = __decorate([
        core_1.NgModule({
            providers: [
                ns_file_system_1.NSFileSystem,
                ns_http_backend_1.NsHttpBackEnd,
                { provide: http_1.HttpBackend, useExisting: ns_http_backend_1.NsHttpBackEnd },
            ],
            imports: [
                http_1.HttpClientModule,
            ],
            exports: [
                http_1.HttpClientModule,
            ]
        })
    ], NativeScriptHttpClientModule);
    return NativeScriptHttpClientModule;
}());
exports.NativeScriptHttpClientModule = NativeScriptHttpClientModule;
//# sourceMappingURL=http-client.module.js.map