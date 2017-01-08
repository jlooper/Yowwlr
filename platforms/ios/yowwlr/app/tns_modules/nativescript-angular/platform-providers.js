var frame_1 = require("ui/frame");
var page_1 = require("ui/page");
var core_1 = require("@angular/core");
var platform_1 = require("platform");
var platform = require("platform");
exports.APP_ROOT_VIEW = new core_1.OpaqueToken("App Root View");
exports.DEVICE = new core_1.OpaqueToken("platfrom device");
exports.PAGE_FACTORY = new core_1.OpaqueToken("page factory");
// Work around a TS bug requiring an import of platform.Device without using it
if (global.___TS_UNUSED) {
    (function () {
        return platform;
    })();
}
function getDefaultPage() {
    var frame = frame_1.topmost();
    if (frame) {
        return frame.currentPage;
    }
    else {
        return null;
    }
}
exports.getDefaultPage = getDefaultPage;
exports.defaultPageProvider = { provide: page_1.Page, useFactory: getDefaultPage };
exports.defaultFrameProvider = { provide: frame_1.Frame, useFactory: frame_1.topmost };
exports.defaultDeviceProvider = { provide: exports.DEVICE, useValue: platform_1.device };
exports.defaultPageFactory = function (_opts) {
    return new page_1.Page();
};
exports.defaultPageFactoryProvider = { provide: exports.PAGE_FACTORY, useValue: exports.defaultPageFactory };
//# sourceMappingURL=platform-providers.js.map