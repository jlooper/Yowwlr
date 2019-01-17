Object.defineProperty(exports, "__esModule", { value: true });
// Always import platform-common first - because polyfills
var platform_common_1 = require("./platform-common");
var core_1 = require("@angular/core");
// "Static" platform
var _platformNativeScript = core_1.createPlatformFactory(core_1.platformCore, "nativeScript", platform_common_1.COMMON_PROVIDERS.slice());
function platformNativeScript(options, extraProviders) {
    // Return raw platform to advanced users only if explicitly requested
    if (options && options.bootInExistingPage === true) {
        return _platformNativeScript(extraProviders);
    }
    else {
        return new platform_common_1.NativeScriptPlatformRef(_platformNativeScript(extraProviders), options);
    }
}
exports.platformNativeScript = platformNativeScript;
//# sourceMappingURL=platform-static.js.map