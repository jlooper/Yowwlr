Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var frame_1 = require("tns-core-modules/ui/frame");
var page_1 = require("tns-core-modules/ui/page");
var platform_1 = require("tns-core-modules/platform");
exports.APP_ROOT_VIEW = new core_1.InjectionToken("App Root View");
exports.DEVICE = new core_1.InjectionToken("platform device");
exports.PAGE_FACTORY = new core_1.InjectionToken("page factory");
var _rootPageRef;
function setRootPage(page) {
    _rootPageRef = new WeakRef(page);
}
exports.setRootPage = setRootPage;
function getRootPage() {
    return _rootPageRef && _rootPageRef.get();
}
exports.getRootPage = getRootPage;
// Use an exported function to make the AoT compiler happy.
function getDefaultPage() {
    var rootPage = getRootPage();
    if (rootPage instanceof page_1.Page) {
        return rootPage;
    }
    var frame = frame_1.topmost();
    if (frame && frame.currentPage) {
        return frame.currentPage;
    }
    return null;
}
exports.getDefaultPage = getDefaultPage;
exports.defaultPageProvider = { provide: page_1.Page, useFactory: getDefaultPage };
// Use an exported function to make the AoT compiler happy.
function getDefaultFrame() {
    return frame_1.topmost();
}
exports.getDefaultFrame = getDefaultFrame;
exports.defaultFrameProvider = { provide: frame_1.Frame, useFactory: getDefaultFrame };
// Use an exported function to make the AoT compiler happy.
function getDefaultDevice() {
    return platform_1.device;
}
exports.getDefaultDevice = getDefaultDevice;
exports.defaultDeviceProvider = { provide: exports.DEVICE, useFactory: getDefaultDevice };
exports.defaultPageFactory = function (_opts) {
    return new page_1.Page();
};
exports.defaultPageFactoryProvider = { provide: exports.PAGE_FACTORY, useValue: exports.defaultPageFactory };
var FrameService = /** @class */ (function () {
    function FrameService() {
    }
    // TODO: Add any methods that are needed to handle frame/page navigation
    FrameService.prototype.getFrame = function () {
        var topmostFrame = frame_1.topmost();
        return topmostFrame;
    };
    FrameService = __decorate([
        core_1.Injectable()
    ], FrameService);
    return FrameService;
}());
exports.FrameService = FrameService;
//# sourceMappingURL=platform-providers.js.map