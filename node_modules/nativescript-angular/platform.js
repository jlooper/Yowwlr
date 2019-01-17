Object.defineProperty(exports, "__esModule", { value: true });
// Always import reflect-metadata before @angular/core.
// It's needed to handle __metadata calls inside @angular/core
require("reflect-metadata");
// Import platform-common immediately after reflect-metadata - because rest of the polyfills.
var platform_common_1 = require("./platform-common");
var ns_file_system_1 = require("./file-system/ns-file-system");
var compiler_1 = require("@angular/compiler");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var core_1 = require("@angular/core");
// Work around a TS bug requiring an imports of
// InjectionToken, ViewEncapsulation and MissingTranslationStrategy
// without using them
if (global.___TS_UNUSED) {
    (function () { return core_1.InjectionToken; })();
    (function () { return core_1.ViewEncapsulation; })();
    (function () { return core_1.MissingTranslationStrategy; })();
}
// Register DOM adapter, if possible. Dynamic platform only!
require("./dom-adapter");
var schema_registry_1 = require("./schema-registry");
var resource_loader_1 = require("./resource-loader");
exports.NS_COMPILER_PROVIDERS = [
    {
        provide: core_1.COMPILER_OPTIONS,
        useValue: {
            providers: [
                { provide: ns_file_system_1.NSFileSystem, deps: [] },
                { provide: compiler_1.ResourceLoader, useClass: resource_loader_1.FileSystemResourceLoader, deps: [ns_file_system_1.NSFileSystem] },
                { provide: compiler_1.ElementSchemaRegistry, useClass: schema_registry_1.NativeScriptElementSchemaRegistry, deps: [] },
            ]
        },
        multi: true
    },
];
// Dynamic platform
var _platformNativeScriptDynamic = core_1.createPlatformFactory(platform_browser_dynamic_1.ɵplatformCoreDynamic, "nativeScriptDynamic", platform_common_1.COMMON_PROVIDERS.concat(exports.NS_COMPILER_PROVIDERS));
function platformNativeScriptDynamic(options, extraProviders) {
    // Return raw platform to advanced users only if explicitly requested
    if (options && options.bootInExistingPage === true) {
        return _platformNativeScriptDynamic(extraProviders);
    }
    else {
        return new platform_common_1.NativeScriptPlatformRef(_platformNativeScriptDynamic(extraProviders), options);
    }
}
exports.platformNativeScriptDynamic = platformNativeScriptDynamic;
//# sourceMappingURL=platform.js.map