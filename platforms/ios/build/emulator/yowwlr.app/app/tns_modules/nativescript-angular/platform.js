// Always import platform-common first - because polyfills 
var platform_common_1 = require("./platform-common");
var compiler_1 = require("@angular/compiler");
var core_1 = require("@angular/core");
// Work around a TS bug requiring an import of OpaqueToken without using it
if (global.___TS_UNUSED) {
    (function () {
        return core_1.OpaqueToken;
    })();
}
var dom_adapter_1 = require("./dom-adapter");
var resource_loader_1 = require("./resource-loader");
var nativescript_module_1 = require("./nativescript.module");
exports.NativeScriptModule = nativescript_module_1.NativeScriptModule;
exports.NS_COMPILER_PROVIDERS = [
    compiler_1.COMPILER_PROVIDERS,
    {
        provide: core_1.COMPILER_OPTIONS,
        useValue: {
            providers: [
                { provide: compiler_1.ResourceLoader, useClass: resource_loader_1.FileSystemResourceLoader },
                { provide: compiler_1.ElementSchemaRegistry, useClass: dom_adapter_1.NativeScriptElementSchemaRegistry },
            ]
        },
        multi: true
    },
];
// Dynamic platform 
var _platformNativeScriptDynamic = core_1.createPlatformFactory(compiler_1.platformCoreDynamic, "nativeScriptDynamic", platform_common_1.COMMON_PROVIDERS.concat(exports.NS_COMPILER_PROVIDERS));
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