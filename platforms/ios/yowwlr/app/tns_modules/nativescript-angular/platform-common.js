// Initial imports and polyfills
require("globals");
require("./zone.js/dist/zone-nativescript");
require("reflect-metadata");
require("./polyfills/array");
require("./polyfills/console");
var core_1 = require("@angular/core");
// Work around a TS bug requiring an import of OpaqueToken without using it
if (global.___TS_UNUSED) {
    (function () {
        return core_1.OpaqueToken;
    })();
}
var trace_1 = require("./trace");
var platform_providers_1 = require("./platform-providers");
var application = require("application");
var frame_1 = require("ui/frame");
var text_view_1 = require("ui/text-view");
require("nativescript-intl");
exports.onBeforeLivesync = new core_1.EventEmitter();
exports.onAfterLivesync = new core_1.EventEmitter();
var lastBootstrappedModule;
var NativeScriptSanitizer = (function (_super) {
    __extends(NativeScriptSanitizer, _super);
    function NativeScriptSanitizer() {
        _super.apply(this, arguments);
    }
    NativeScriptSanitizer.prototype.sanitize = function (_context, value) {
        return value;
    };
    return NativeScriptSanitizer;
}(core_1.Sanitizer));
exports.NativeScriptSanitizer = NativeScriptSanitizer;
exports.COMMON_PROVIDERS = [
    platform_providers_1.defaultPageFactoryProvider,
    { provide: core_1.Sanitizer, useClass: NativeScriptSanitizer },
];
var NativeScriptPlatformRef = (function (_super) {
    __extends(NativeScriptPlatformRef, _super);
    function NativeScriptPlatformRef(platform, appOptions) {
        _super.call(this);
        this.platform = platform;
        this.appOptions = appOptions;
    }
    NativeScriptPlatformRef.prototype.bootstrapModuleFactory = function (moduleFactory) {
        var _this = this;
        this._bootstrapper = function () { return _this.platform.bootstrapModuleFactory(moduleFactory); };
        this.bootstrapApp();
        return null; // Make the compiler happy
    };
    NativeScriptPlatformRef.prototype.bootstrapModule = function (moduleType, compilerOptions) {
        var _this = this;
        if (compilerOptions === void 0) { compilerOptions = []; }
        this._bootstrapper = function () { return _this.platform.bootstrapModule(moduleType, compilerOptions); };
        this.bootstrapApp();
        return null; // Make the compiler happy
    };
    NativeScriptPlatformRef.prototype.bootstrapApp = function () {
        var _this = this;
        global.__onLiveSyncCore = function () { return _this.livesyncModule(); };
        var mainPageEntry = this.createNavigationEntry(this._bootstrapper);
        if (this.appOptions && typeof this.appOptions.cssFile === "string") {
            // TODO: All exported filed in ES6 modules should be read-only
            // Change the case when tns-core-modules become ES6 compatible and there is a legal way to set cssFile
            application.cssFile = this.appOptions.cssFile;
        }
        application.start(mainPageEntry);
    };
    NativeScriptPlatformRef.prototype.livesyncModule = function () {
        trace_1.rendererLog("ANGULAR LiveSync Started");
        exports.onBeforeLivesync.next(lastBootstrappedModule ? lastBootstrappedModule.get() : null);
        var mainPageEntry = this.createNavigationEntry(this._bootstrapper, function (compRef) { return exports.onAfterLivesync.next(compRef); }, function (error) { return exports.onAfterLivesync.error(error); }, true);
        mainPageEntry.animated = false;
        mainPageEntry.clearHistory = true;
        var frame = frame_1.topmost();
        if (frame) {
            if (frame.currentPage && frame.currentPage.modal) {
                frame.currentPage.modal.closeModal();
            }
            frame.navigate(mainPageEntry);
        }
    };
    NativeScriptPlatformRef.prototype.onDestroy = function (callback) {
        this.platform.onDestroy(callback);
    };
    Object.defineProperty(NativeScriptPlatformRef.prototype, "injector", {
        get: function () {
            return this.platform.injector;
        },
        enumerable: true,
        configurable: true
    });
    ;
    NativeScriptPlatformRef.prototype.destroy = function () {
        this.platform.destroy();
    };
    Object.defineProperty(NativeScriptPlatformRef.prototype, "destroyed", {
        get: function () {
            return this.platform.destroyed;
        },
        enumerable: true,
        configurable: true
    });
    NativeScriptPlatformRef.prototype.createNavigationEntry = function (bootstrapAction, resolve, reject, isLivesync, isReboot) {
        var _this = this;
        if (isLivesync === void 0) { isLivesync = false; }
        if (isReboot === void 0) { isReboot = false; }
        var pageFactory = this.platform.injector.get(platform_providers_1.PAGE_FACTORY);
        var navEntry = {
            create: function () {
                var page = pageFactory({ isBootstrap: true, isLivesync: isLivesync });
                if (_this.appOptions) {
                    page.actionBarHidden = _this.appOptions.startPageActionBarHidden;
                }
                var onLoadedHandler = function () {
                    page.off("loaded", onLoadedHandler);
                    // profiling.stop("application-start");
                    trace_1.rendererLog("Page loaded");
                    // profiling.start("ng-bootstrap");
                    trace_1.rendererLog("BOOTSTRAPPING...");
                    bootstrapAction().then(function (moduleRef) {
                        // profiling.stop("ng-bootstrap");
                        trace_1.rendererLog("ANGULAR BOOTSTRAP DONE.");
                        lastBootstrappedModule = new WeakRef(moduleRef);
                        if (resolve) {
                            resolve(moduleRef);
                        }
                        return moduleRef;
                    }, function (err) {
                        trace_1.rendererError("ERROR BOOTSTRAPPING ANGULAR");
                        var errorMessage = err.message + "\n\n" + err.stack;
                        trace_1.rendererError(errorMessage);
                        var view = new text_view_1.TextView();
                        view.text = errorMessage;
                        page.content = view;
                        if (reject) {
                            reject(err);
                        }
                    });
                };
                page.on("loaded", onLoadedHandler);
                return page;
            }
        };
        if (isReboot) {
            navEntry.animated = false;
            navEntry.clearHistory = true;
        }
        return navEntry;
    };
    NativeScriptPlatformRef.prototype.liveSyncApp = function () {
    };
    return NativeScriptPlatformRef;
}(core_1.PlatformRef));
exports.NativeScriptPlatformRef = NativeScriptPlatformRef;
//# sourceMappingURL=platform-common.js.map