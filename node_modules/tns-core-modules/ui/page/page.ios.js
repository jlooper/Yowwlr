function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var view_1 = require("../core/view");
var page_common_1 = require("./page-common");
var profiling_1 = require("../../profiling");
var utils_1 = require("../../utils/utils");
__export(require("./page-common"));
var ENTRY = "_entry";
var DELEGATE = "_delegate";
var majorVersion = utils_1.ios.MajorVersion;
function isBackNavigationTo(page, entry) {
    var frame = page.frame;
    if (!frame) {
        return false;
    }
    if (frame.navigationQueueIsEmpty()) {
        return true;
    }
    else {
        var navigationQueue = frame._navigationQueue;
        for (var i = 0; i < navigationQueue.length; i++) {
            if (navigationQueue[i].entry === entry) {
                return navigationQueue[i].isBackNavigation;
            }
        }
    }
    return false;
}
function isBackNavigationFrom(controller, page) {
    if (!page.frame) {
        return false;
    }
    if (controller.isBackstackCleared || controller.isBackstackSkipped) {
        return false;
    }
    if (controller.navigationController && controller.navigationController.viewControllers.containsObject(controller)) {
        return false;
    }
    return true;
}
var UIViewControllerImpl = (function (_super) {
    __extends(UIViewControllerImpl, _super);
    function UIViewControllerImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UIViewControllerImpl.initWithOwner = function (owner) {
        var controller = UIViewControllerImpl.new();
        controller._owner = owner;
        return controller;
    };
    UIViewControllerImpl.prototype.viewWillAppear = function (animated) {
        _super.prototype.viewWillAppear.call(this, animated);
        var owner = this._owner.get();
        if (!owner) {
            return;
        }
        var frame = this.navigationController ? this.navigationController.owner : null;
        var newEntry = this[ENTRY];
        if (!owner._presentedViewController && newEntry && (!frame || frame.currentPage !== owner)) {
            var isBack = isBackNavigationTo(owner, newEntry);
            owner.onNavigatingTo(newEntry.entry.context, isBack, newEntry.entry.bindingContext);
        }
        if (frame) {
            if (!owner.parent) {
                owner._frame = frame;
                if (!frame._styleScope) {
                    owner._updateStyleScope();
                }
                frame._addView(owner);
            }
            else if (owner.parent !== frame) {
                throw new Error("Page is already shown on another frame.");
            }
            frame._updateActionBar(owner);
        }
        view_1.ios.updateAutoAdjustScrollInsets(this, owner);
        if (!owner.isLoaded) {
            owner.callLoaded();
        }
    };
    UIViewControllerImpl.prototype.viewDidAppear = function (animated) {
        _super.prototype.viewDidAppear.call(this, animated);
        var owner = this._owner.get();
        if (!owner) {
            return;
        }
        var navigationController = this.navigationController;
        var frame = navigationController ? navigationController.owner : null;
        if (!owner._presentedViewController && frame) {
            var newEntry = this[ENTRY];
            var isBack = void 0;
            if (frame.currentPage === owner && frame._navigationQueue.length === 0) {
                isBack = false;
            }
            else {
                isBack = isBackNavigationTo(owner, newEntry);
            }
            frame.setCurrent(newEntry, isBack);
            frame.ios.controller.delegate = this[DELEGATE];
            frame._processNavigationQueue(owner);
            if (frame.canGoBack()) {
                navigationController.interactivePopGestureRecognizer.delegate = navigationController;
                navigationController.interactivePopGestureRecognizer.enabled = owner.enableSwipeBackNavigation;
            }
            else {
                navigationController.interactivePopGestureRecognizer.enabled = false;
            }
        }
        if (!this.presentedViewController) {
            owner._presentedViewController = null;
        }
    };
    UIViewControllerImpl.prototype.viewWillDisappear = function (animated) {
        _super.prototype.viewWillDisappear.call(this, animated);
        var owner = this._owner.get();
        if (!owner) {
            return;
        }
        if (!owner._presentedViewController) {
            owner._presentedViewController = this.presentedViewController;
        }
        var frame = owner.frame;
        var tab = this.tabBarController;
        if (!owner._presentedViewController && !this.presentingViewController && frame && frame.currentPage === owner) {
            var willSelectViewController = tab && tab._willSelectViewController;
            if (!willSelectViewController
                || willSelectViewController === tab.selectedViewController) {
                var isBack = isBackNavigationFrom(this, owner);
                owner.onNavigatingFrom(isBack);
            }
        }
    };
    UIViewControllerImpl.prototype.viewDidDisappear = function (animated) {
        _super.prototype.viewDidDisappear.call(this, animated);
        var page = this._owner.get();
        if (!page || page.modal || page._presentedViewController) {
            return;
        }
        if (page.isLoaded) {
            page.callUnloaded();
        }
    };
    UIViewControllerImpl.prototype.viewWillLayoutSubviews = function () {
        _super.prototype.viewWillLayoutSubviews.call(this);
        var owner = this._owner.get();
        if (owner) {
            view_1.ios.updateConstraints(this, owner);
        }
    };
    UIViewControllerImpl.prototype.viewDidLayoutSubviews = function () {
        _super.prototype.viewDidLayoutSubviews.call(this);
        var owner = this._owner.get();
        if (owner) {
            if (majorVersion >= 11) {
                var frame = owner.parent;
                var frameParent = frame && frame.parent;
                while (frameParent && !frameParent.nativeViewProtected) {
                    frameParent = frameParent.parent;
                }
                if (frameParent) {
                    var parentPageInsetsTop = frameParent.nativeViewProtected.safeAreaInsets.top;
                    var currentInsetsTop = this.view.safeAreaInsets.top;
                    var additionalInsetsTop = Math.max(parentPageInsetsTop - currentInsetsTop, 0);
                    var parentPageInsetsBottom = frameParent.nativeViewProtected.safeAreaInsets.bottom;
                    var currentInsetsBottom = this.view.safeAreaInsets.bottom;
                    var additionalInsetsBottom = Math.max(parentPageInsetsBottom - currentInsetsBottom, 0);
                    if (additionalInsetsTop > 0 || additionalInsetsBottom > 0) {
                        var additionalInsets = new UIEdgeInsets({ top: additionalInsetsTop, left: 0, bottom: additionalInsetsBottom, right: 0 });
                        this.additionalSafeAreaInsets = additionalInsets;
                    }
                }
            }
            view_1.ios.layoutView(this, owner);
        }
    };
    __decorate([
        profiling_1.profile
    ], UIViewControllerImpl.prototype, "viewDidAppear", null);
    __decorate([
        profiling_1.profile
    ], UIViewControllerImpl.prototype, "viewWillDisappear", null);
    __decorate([
        profiling_1.profile
    ], UIViewControllerImpl.prototype, "viewDidDisappear", null);
    return UIViewControllerImpl;
}(UIViewController));
var whiteColor = new page_common_1.Color("white").ios;
var Page = (function (_super) {
    __extends(Page, _super);
    function Page() {
        var _this = _super.call(this) || this;
        var controller = UIViewControllerImpl.initWithOwner(new WeakRef(_this));
        _this.viewController = _this._ios = controller;
        controller.view.backgroundColor = whiteColor;
        return _this;
    }
    Page.prototype.createNativeView = function () {
        return this.viewController.view;
    };
    Object.defineProperty(Page.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Page.prototype, "frame", {
        get: function () {
            return this._frame;
        },
        enumerable: true,
        configurable: true
    });
    Page.prototype.layoutNativeView = function (left, top, right, bottom) {
    };
    Page.prototype._setNativeViewFrame = function (nativeView, frame) {
    };
    Page.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        if (this.hasActionBar) {
            this.actionBar.update();
        }
    };
    Page.prototype.updateStatusBar = function () {
        this._updateStatusBarStyle(this.statusBarStyle);
    };
    Page.prototype._updateStatusBarStyle = function (value) {
        var frame = this.frame;
        if (this.frame && value) {
            var navigationController = frame.ios.controller;
            var navigationBar = navigationController.navigationBar;
            navigationBar.barStyle = value === "dark" ? 1 : 0;
        }
    };
    Page.prototype._updateEnableSwipeBackNavigation = function (enabled) {
        var navController = this._ios.navigationController;
        if (this.frame && navController && navController.interactivePopGestureRecognizer) {
            enabled = enabled && this.frame.canGoBack();
            navController.interactivePopGestureRecognizer.enabled = enabled;
        }
    };
    Page.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        var width = page_common_1.layout.getMeasureSpecSize(widthMeasureSpec);
        var widthMode = page_common_1.layout.getMeasureSpecMode(widthMeasureSpec);
        var height = page_common_1.layout.getMeasureSpecSize(heightMeasureSpec);
        var heightMode = page_common_1.layout.getMeasureSpecMode(heightMeasureSpec);
        if (this.frame && this.frame._getNavBarVisible(this)) {
            var _a = this.actionBar._getActualSize, width_1 = _a.width, height_1 = _a.height;
            var widthSpec = page_common_1.layout.makeMeasureSpec(width_1, page_common_1.layout.EXACTLY);
            var heightSpec = page_common_1.layout.makeMeasureSpec(height_1, page_common_1.layout.EXACTLY);
            page_common_1.View.measureChild(this, this.actionBar, widthSpec, heightSpec);
        }
        var result = page_common_1.View.measureChild(this, this.layoutView, widthMeasureSpec, heightMeasureSpec);
        var measureWidth = Math.max(result.measuredWidth, this.effectiveMinWidth);
        var measureHeight = Math.max(result.measuredHeight, this.effectiveMinHeight);
        var widthAndState = page_common_1.View.resolveSizeAndState(measureWidth, width, widthMode, 0);
        var heightAndState = page_common_1.View.resolveSizeAndState(measureHeight, height, heightMode, 0);
        this.setMeasuredDimension(widthAndState, heightAndState);
    };
    Page.prototype.onLayout = function (left, top, right, bottom) {
        var _a = this.actionBar._getActualSize, actionBarWidth = _a.width, actionBarHeight = _a.height;
        page_common_1.View.layoutChild(this, this.actionBar, 0, 0, actionBarWidth, actionBarHeight);
        var insets = this.getSafeAreaInsets();
        if (majorVersion <= 10) {
            insets.top = page_common_1.layout.round(page_common_1.layout.toDevicePixels(this.viewController.view.safeAreaLayoutGuide.layoutFrame.origin.y));
        }
        var childLeft = 0 + insets.left;
        var childTop = 0 + insets.top;
        var childRight = right - insets.right;
        var childBottom = bottom - insets.bottom;
        if (majorVersion >= 11 && this.actionBar.flat) {
            childBottom -= top;
        }
        page_common_1.View.layoutChild(this, this.layoutView, childLeft, childTop, childRight, childBottom);
    };
    Page.prototype._addViewToNativeVisualTree = function (child, atIndex) {
        if (child === this.actionBar) {
            return true;
        }
        var nativeParent = this.nativeViewProtected;
        var nativeChild = child.nativeViewProtected;
        var viewController = child.ios instanceof UIViewController ? child.ios : child.viewController;
        if (viewController) {
            if (this.viewController.presentedViewController === viewController) {
                return true;
            }
            this.viewController.addChildViewController(viewController);
        }
        if (nativeParent && nativeChild) {
            if (typeof atIndex !== "number" || atIndex >= nativeParent.subviews.count) {
                nativeParent.addSubview(nativeChild);
            }
            else {
                nativeParent.insertSubviewAtIndex(nativeChild, atIndex);
            }
            return true;
        }
        return false;
    };
    Page.prototype._removeViewFromNativeVisualTree = function (child) {
        if (child === this.actionBar) {
            return;
        }
        var viewController = child.ios instanceof UIViewController ? child.ios : child.viewController;
        if (viewController) {
            viewController.removeFromParentViewController();
        }
        _super.prototype._removeViewFromNativeVisualTree.call(this, child);
    };
    Page.prototype[page_common_1.actionBarHiddenProperty.setNative] = function (value) {
        this._updateEnableSwipeBackNavigation(value);
        invalidateTopmostController(this.viewController);
        var frame = this.frame;
        if (frame) {
            frame._updateActionBar(this, true);
        }
    };
    Page.prototype[page_common_1.statusBarStyleProperty.getDefault] = function () {
        return 0;
    };
    Page.prototype[page_common_1.statusBarStyleProperty.setNative] = function (value) {
        var frame = this.frame;
        if (frame) {
            var navigationBar = frame.ios.controller.navigationBar;
            if (typeof value === "string") {
                navigationBar.barStyle = value === "dark" ? 1 : 0;
            }
            else {
                navigationBar.barStyle = value;
            }
        }
    };
    return Page;
}(page_common_1.PageBase));
exports.Page = Page;
function invalidateTopmostController(controller) {
    if (!controller) {
        return;
    }
    controller.view.setNeedsLayout();
    var presentedViewController = controller.presentedViewController;
    if (presentedViewController) {
        return invalidateTopmostController(presentedViewController);
    }
    var childControllers = controller.childViewControllers;
    var size = controller.childViewControllers.count;
    while (size > 0) {
        var childController = childControllers[--size];
        if (childController instanceof UITabBarController) {
            invalidateTopmostController(childController.selectedViewController);
        }
        else if (childController instanceof UINavigationController) {
            invalidateTopmostController(childController.topViewController);
        }
        else if (childController instanceof UISplitViewController) {
            invalidateTopmostController(childController.viewControllers.lastObject);
        }
        else {
            invalidateTopmostController(childController);
        }
    }
}
//# sourceMappingURL=page.ios.js.map