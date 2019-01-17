function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var trace_1 = require("../trace");
var utils_common_1 = require("./utils-common");
__export(require("./utils-common"));
var mainScreenScale;
function isOrientationLandscape(orientation) {
    return orientation === 3 || orientation === 4;
}
var layout;
(function (layout) {
    var MODE_SHIFT = 30;
    var MODE_MASK = 0x3 << MODE_SHIFT;
    function makeMeasureSpec(size, mode) {
        return (Math.round(Math.max(0, size)) & ~MODE_MASK) | (mode & MODE_MASK);
    }
    layout.makeMeasureSpec = makeMeasureSpec;
    function getDisplayDensity() {
        return mainScreenScale;
    }
    layout.getDisplayDensity = getDisplayDensity;
    function toDevicePixels(value) {
        return value * mainScreenScale;
    }
    layout.toDevicePixels = toDevicePixels;
    function toDeviceIndependentPixels(value) {
        return value / mainScreenScale;
    }
    layout.toDeviceIndependentPixels = toDeviceIndependentPixels;
    function measureNativeView(nativeView, width, widthMode, height, heightMode) {
        var view = nativeView;
        var nativeSize = view.sizeThatFits({
            width: widthMode === 0 ? Number.POSITIVE_INFINITY : toDeviceIndependentPixels(width),
            height: heightMode === 0 ? Number.POSITIVE_INFINITY : toDeviceIndependentPixels(height)
        });
        nativeSize.width = utils_common_1.layout.round(toDevicePixels(nativeSize.width));
        nativeSize.height = utils_common_1.layout.round(toDevicePixels(nativeSize.height));
        return nativeSize;
    }
    layout.measureNativeView = measureNativeView;
})(layout = exports.layout || (exports.layout = {}));
var ios;
(function (ios) {
    function getter(_this, property) {
        if (typeof property === "function") {
            return property.call(_this);
        }
        else {
            return property;
        }
    }
    ios.getter = getter;
    var collections;
    (function (collections) {
        function jsArrayToNSArray(str) {
            return NSArray.arrayWithArray(str);
        }
        collections.jsArrayToNSArray = jsArrayToNSArray;
        function nsArrayToJSArray(a) {
            var arr = [];
            if (a !== undefined) {
                var count = a.count;
                for (var i = 0; i < count; i++) {
                    arr.push(a.objectAtIndex(i));
                }
            }
            return arr;
        }
        collections.nsArrayToJSArray = nsArrayToJSArray;
    })(collections = ios.collections || (ios.collections = {}));
    function isLandscape() {
        var device = getter(UIDevice, UIDevice.currentDevice);
        var statusBarOrientation = getter(UIApplication, UIApplication.sharedApplication).statusBarOrientation;
        var isStatusBarOrientationLandscape = isOrientationLandscape(statusBarOrientation);
        return isOrientationLandscape(device.orientation) || isStatusBarOrientationLandscape;
    }
    ios.isLandscape = isLandscape;
    ios.MajorVersion = NSString.stringWithString(getter(UIDevice, UIDevice.currentDevice).systemVersion).intValue;
    function openFile(filePath) {
        try {
            var appPath = getCurrentAppPath();
            var path = filePath.replace("~", appPath);
            var controller = UIDocumentInteractionController.interactionControllerWithURL(NSURL.fileURLWithPath(path));
            controller.delegate = new UIDocumentInteractionControllerDelegateImpl();
            return controller.presentPreviewAnimated(true);
        }
        catch (e) {
            trace_1.write("Error in openFile", trace_1.categories.Error, trace_1.messageType.error);
        }
        return false;
    }
    ios.openFile = openFile;
    function getCurrentAppPath() {
        var currentDir = __dirname;
        var tnsModulesIndex = currentDir.indexOf("/tns_modules");
        var appPath = currentDir;
        if (tnsModulesIndex !== -1) {
            appPath = currentDir.substring(0, tnsModulesIndex);
        }
        return appPath;
    }
    ios.getCurrentAppPath = getCurrentAppPath;
    function joinPaths() {
        var paths = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            paths[_i] = arguments[_i];
        }
        if (!paths || paths.length === 0) {
            return "";
        }
        return NSString.stringWithString(NSString.pathWithComponents(paths)).stringByStandardizingPath;
    }
    ios.joinPaths = joinPaths;
    function getVisibleViewController(rootViewController) {
        if (rootViewController.presentedViewController) {
            return getVisibleViewController(rootViewController.presentedViewController);
        }
        if (rootViewController.isKindOfClass(UINavigationController.class())) {
            return getVisibleViewController(rootViewController.visibleViewController);
        }
        if (rootViewController.isKindOfClass(UITabBarController.class())) {
            var selectedTab = rootViewController.selectedViewController;
            return getVisibleViewController(rootViewController);
        }
        return rootViewController;
    }
    ios.getVisibleViewController = getVisibleViewController;
})(ios = exports.ios || (exports.ios = {}));
function GC() {
    __collect();
}
exports.GC = GC;
function openUrl(location) {
    try {
        var url = NSURL.URLWithString(location.trim());
        if (ios.getter(UIApplication, UIApplication.sharedApplication).canOpenURL(url)) {
            return ios.getter(UIApplication, UIApplication.sharedApplication).openURL(url);
        }
    }
    catch (e) {
        trace_1.write("Error in OpenURL", trace_1.categories.Error, trace_1.messageType.error);
    }
    return false;
}
exports.openUrl = openUrl;
var UIDocumentInteractionControllerDelegateImpl = (function (_super) {
    __extends(UIDocumentInteractionControllerDelegateImpl, _super);
    function UIDocumentInteractionControllerDelegateImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UIDocumentInteractionControllerDelegateImpl.prototype.getViewController = function () {
        var app = ios.getter(UIApplication, UIApplication.sharedApplication);
        return app.keyWindow.rootViewController;
    };
    UIDocumentInteractionControllerDelegateImpl.prototype.documentInteractionControllerViewControllerForPreview = function (controller) {
        return this.getViewController();
    };
    UIDocumentInteractionControllerDelegateImpl.prototype.documentInteractionControllerViewForPreview = function (controller) {
        return this.getViewController().view;
    };
    UIDocumentInteractionControllerDelegateImpl.prototype.documentInteractionControllerRectForPreview = function (controller) {
        return this.getViewController().view.frame;
    };
    UIDocumentInteractionControllerDelegateImpl.ObjCProtocols = [UIDocumentInteractionControllerDelegate];
    return UIDocumentInteractionControllerDelegateImpl;
}(NSObject));
mainScreenScale = ios.getter(UIScreen, UIScreen.mainScreen).scale;
//# sourceMappingURL=utils.ios.js.map