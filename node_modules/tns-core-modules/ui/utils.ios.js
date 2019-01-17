Object.defineProperty(exports, "__esModule", { value: true });
var utils = require("../utils/utils");
var getter = utils.ios.getter;
var ios;
(function (ios) {
    function getActualHeight(view) {
        if (view.window && !view.hidden) {
            return utils.layout.toDevicePixels(view.frame.size.height);
        }
        return 0;
    }
    ios.getActualHeight = getActualHeight;
    function getStatusBarHeight(viewController) {
        var app = getter(UIApplication, UIApplication.sharedApplication);
        if (!app || app.statusBarHidden) {
            return 0;
        }
        if (viewController && viewController.prefersStatusBarHidden) {
            return 0;
        }
        var statusFrame = app.statusBarFrame;
        var min = Math.min(statusFrame.size.width, statusFrame.size.height);
        return utils.layout.toDevicePixels(min);
    }
    ios.getStatusBarHeight = getStatusBarHeight;
    function _layoutRootView(rootView, parentBounds) {
        if (!rootView || !parentBounds) {
            return;
        }
        var size = parentBounds.size;
        var width = utils.layout.toDevicePixels(size.width);
        var height = utils.layout.toDevicePixels(size.height);
        var widthSpec = utils.layout.makeMeasureSpec(width, utils.layout.EXACTLY);
        var heightSpec = utils.layout.makeMeasureSpec(height, utils.layout.EXACTLY);
        rootView.measure(widthSpec, heightSpec);
        var origin = parentBounds.origin;
        var left = origin.x;
        var top = origin.y;
        rootView.layout(left, top, width, height);
    }
    ios._layoutRootView = _layoutRootView;
})(ios = exports.ios || (exports.ios = {}));
//# sourceMappingURL=utils.ios.js.map