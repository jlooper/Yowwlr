Object.defineProperty(exports, "__esModule", { value: true });
require("tns-core-modules/globals");
// Require application early to work around a circular import
require("tns-core-modules/application");
require("./zone-js/dist/zone-nativescript");
require("./polyfills/array");
require("./polyfills/console");
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var common_2 = require("./common");
var renderer_1 = require("./renderer");
var detached_loader_1 = require("./common/detached-loader");
var utils_1 = require("./common/utils");
var platform_providers_1 = require("./platform-providers");
function errorHandlerFactory() {
    return new core_1.ErrorHandler();
}
exports.errorHandlerFactory = errorHandlerFactory;
var NativeScriptModule = /** @class */ (function () {
    function NativeScriptModule(parentModule) {
        // Prevents NativeScriptModule from getting imported multiple times
        utils_1.throwIfAlreadyLoaded(parentModule, "NativeScriptModule");
    }
    NativeScriptModule = __decorate([
        core_1.NgModule({
            declarations: [
                detached_loader_1.DetachedLoader,
            ],
            providers: [
                platform_providers_1.FrameService,
                renderer_1.NativeScriptRendererFactory,
                core_1.SystemJsNgModuleLoader,
                { provide: core_1.ɵAPP_ROOT, useValue: true },
                { provide: core_1.ErrorHandler, useFactory: errorHandlerFactory },
                { provide: core_1.RendererFactory2, useExisting: renderer_1.NativeScriptRendererFactory },
                { provide: common_1.ViewportScroller, useClass: common_1.ɵNullViewportScroller },
            ],
            entryComponents: [
                detached_loader_1.DetachedLoader,
            ],
            imports: [
                core_1.ApplicationModule,
                common_2.NativeScriptCommonModule,
            ],
            exports: [
                core_1.ApplicationModule,
                common_2.NativeScriptCommonModule,
                detached_loader_1.DetachedLoader,
            ],
            schemas: [core_1.NO_ERRORS_SCHEMA]
        }),
        __param(0, core_1.Optional()), __param(0, core_1.SkipSelf()),
        __metadata("design:paramtypes", [NativeScriptModule])
    ], NativeScriptModule);
    return NativeScriptModule;
}());
exports.NativeScriptModule = NativeScriptModule;
//# sourceMappingURL=nativescript.module.js.map