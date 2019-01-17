function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var profiling_1 = require("../../profiling");
var frame_common_1 = require("./frame-common");
var fragment_transitions_1 = require("./fragment.transitions");
var utils = require("../../utils/utils");
__export(require("./frame-common"));
var majorVersion = utils.ios.MajorVersion;
var ENTRY = "_entry";
var NAV_DEPTH = "_navDepth";
var TRANSITION = "_transition";
var DELEGATE = "_delegate";
var navDepth = -1;
var Frame = (function (_super) {
    __extends(Frame, _super);
    function Frame() {
        var _this = _super.call(this) || this;
        _this._animatedDelegate = UINavigationControllerAnimatedDelegate.new();
        _this._ios = new iOSFrame(_this);
        _this.viewController = _this._ios.controller;
        return _this;
    }
    Frame.prototype.createNativeView = function () {
        return this.viewController.view;
    };
    Frame.prototype.disposeNativeView = function () {
        this._removeFromFrameStack();
        _super.prototype.disposeNativeView.call(this);
    };
    Object.defineProperty(Frame.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    Frame.prototype.setCurrent = function (entry, isBack) {
        var current = this._currentEntry;
        var currentEntryChanged = current !== entry;
        if (currentEntryChanged) {
            this._updateBackstack(entry, isBack);
            _super.prototype.setCurrent.call(this, entry, isBack);
        }
    };
    Frame.prototype._navigateCore = function (backstackEntry) {
        _super.prototype._navigateCore.call(this, backstackEntry);
        var viewController = backstackEntry.resolvedPage.ios;
        if (!viewController) {
            throw new Error("Required page does not have a viewController created.");
        }
        var clearHistory = backstackEntry.entry.clearHistory;
        if (clearHistory) {
            navDepth = -1;
        }
        navDepth++;
        var navigationTransition;
        var animated = this.currentPage ? this._getIsAnimatedNavigation(backstackEntry.entry) : false;
        if (animated) {
            navigationTransition = this._getNavigationTransition(backstackEntry.entry);
            if (navigationTransition) {
                viewController[TRANSITION] = navigationTransition;
            }
        }
        else {
            viewController[TRANSITION] = { name: "non-animated" };
        }
        var nativeTransition = _getNativeTransition(navigationTransition, true);
        if (!nativeTransition && navigationTransition) {
            this._ios.controller.delegate = this._animatedDelegate;
            viewController[DELEGATE] = this._animatedDelegate;
        }
        else {
            viewController[DELEGATE] = null;
            this._ios.controller.delegate = null;
        }
        backstackEntry[NAV_DEPTH] = navDepth;
        viewController[ENTRY] = backstackEntry;
        if (!animated && majorVersion > 10) {
            var barButtonItem = UIBarButtonItem.alloc().initWithTitleStyleTargetAction("", 0, null, null);
            viewController.navigationItem.backBarButtonItem = barButtonItem;
        }
        if (!this._currentEntry) {
            this._updateActionBar(backstackEntry.resolvedPage, true);
            this._ios.controller.pushViewControllerAnimated(viewController, animated);
            if (frame_common_1.traceEnabled()) {
                frame_common_1.traceWrite(this + ".pushViewControllerAnimated(" + viewController + ", " + animated + "); depth = " + navDepth, frame_common_1.traceCategories.Navigation);
            }
            return;
        }
        if (clearHistory) {
            viewController.navigationItem.hidesBackButton = true;
            var newControllers = NSMutableArray.alloc().initWithCapacity(1);
            newControllers.addObject(viewController);
            var oldControllers = this._ios.controller.viewControllers;
            for (var i = 0; i < oldControllers.count; i++) {
                oldControllers.objectAtIndex(i).isBackstackCleared = true;
            }
            this._ios.controller.setViewControllersAnimated(newControllers, animated);
            if (frame_common_1.traceEnabled()) {
                frame_common_1.traceWrite(this + ".setViewControllersAnimated([" + viewController + "], " + animated + "); depth = " + navDepth, frame_common_1.traceCategories.Navigation);
            }
            return;
        }
        if (!Frame._isEntryBackstackVisible(this._currentEntry)) {
            var newControllers = NSMutableArray.alloc().initWithArray(this._ios.controller.viewControllers);
            if (newControllers.count === 0) {
                throw new Error("Wrong controllers count.");
            }
            viewController.navigationItem.hidesBackButton = this.backStack.length === 0;
            var skippedNavController = newControllers.lastObject;
            skippedNavController.isBackstackSkipped = true;
            newControllers.removeLastObject();
            newControllers.addObject(viewController);
            this._ios.controller.setViewControllersAnimated(newControllers, animated);
            if (frame_common_1.traceEnabled()) {
                frame_common_1.traceWrite(this + ".setViewControllersAnimated([originalControllers - lastController + " + viewController + "], " + animated + "); depth = " + navDepth, frame_common_1.traceCategories.Navigation);
            }
            return;
        }
        this._ios.controller.pushViewControllerAnimated(viewController, animated);
        if (frame_common_1.traceEnabled()) {
            frame_common_1.traceWrite(this + ".pushViewControllerAnimated(" + viewController + ", " + animated + "); depth = " + navDepth, frame_common_1.traceCategories.Navigation);
        }
    };
    Frame.prototype._goBackCore = function (backstackEntry) {
        _super.prototype._goBackCore.call(this, backstackEntry);
        navDepth = backstackEntry[NAV_DEPTH];
        var controller = backstackEntry.resolvedPage.ios;
        var animated = this._currentEntry ? this._getIsAnimatedNavigation(this._currentEntry.entry) : false;
        this._updateActionBar(backstackEntry.resolvedPage);
        if (frame_common_1.traceEnabled()) {
            frame_common_1.traceWrite(this + ".popToViewControllerAnimated(" + controller + ", " + animated + "); depth = " + navDepth, frame_common_1.traceCategories.Navigation);
        }
        this._ios.controller.popToViewControllerAnimated(controller, animated);
    };
    Frame.prototype._updateActionBar = function (page, disableNavBarAnimation) {
        if (disableNavBarAnimation === void 0) { disableNavBarAnimation = false; }
        _super.prototype._updateActionBar.call(this, page);
        if (page && this.currentPage && this.currentPage.modal === page) {
            return;
        }
        page = page || this.currentPage;
        var newValue = this._getNavBarVisible(page);
        var disableNavBarAnimationCache = this._ios._disableNavBarAnimation;
        if (disableNavBarAnimation) {
            this._ios._disableNavBarAnimation = true;
        }
        this._ios.showNavigationBar = newValue;
        if (disableNavBarAnimation) {
            this._ios._disableNavBarAnimation = disableNavBarAnimationCache;
        }
        if (this._ios.controller.navigationBar) {
            this._ios.controller.navigationBar.userInteractionEnabled = this.navigationQueueIsEmpty();
        }
    };
    Frame.prototype._getNavBarVisible = function (page) {
        switch (this.actionBarVisibility) {
            case "always":
                return true;
            case "never":
                return false;
            case "auto":
                switch (this._ios.navBarVisibility) {
                    case "always":
                        return true;
                    case "never":
                        return false;
                    case "auto":
                        var newValue = void 0;
                        if (page && page.actionBarHidden !== undefined) {
                            newValue = !page.actionBarHidden;
                        }
                        else {
                            newValue = this.ios.controller.viewControllers.count > 1 || (page && page.actionBar && !page.actionBar._isEmpty());
                        }
                        newValue = !!newValue;
                        return newValue;
                }
        }
    };
    Object.defineProperty(Frame, "defaultAnimatedNavigation", {
        get: function () {
            return frame_common_1.FrameBase.defaultAnimatedNavigation;
        },
        set: function (value) {
            frame_common_1.FrameBase.defaultAnimatedNavigation = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Frame, "defaultTransition", {
        get: function () {
            return frame_common_1.FrameBase.defaultTransition;
        },
        set: function (value) {
            frame_common_1.FrameBase.defaultTransition = value;
        },
        enumerable: true,
        configurable: true
    });
    Frame.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        var width = frame_common_1.layout.getMeasureSpecSize(widthMeasureSpec);
        var widthMode = frame_common_1.layout.getMeasureSpecMode(widthMeasureSpec);
        var height = frame_common_1.layout.getMeasureSpecSize(heightMeasureSpec);
        var heightMode = frame_common_1.layout.getMeasureSpecMode(heightMeasureSpec);
        var widthAndState = frame_common_1.View.resolveSizeAndState(width, width, widthMode, 0);
        var heightAndState = frame_common_1.View.resolveSizeAndState(height, height, heightMode, 0);
        this.setMeasuredDimension(widthAndState, heightAndState);
    };
    Frame.prototype.layoutNativeView = function (left, top, right, bottom) {
    };
    Frame.prototype._setNativeViewFrame = function (nativeView, frame) {
    };
    Frame.prototype._onNavigatingTo = function (backstackEntry, isBack) {
    };
    __decorate([
        profiling_1.profile
    ], Frame.prototype, "_navigateCore", null);
    return Frame;
}(frame_common_1.FrameBase));
exports.Frame = Frame;
var transitionDelegates = new Array();
var TransitionDelegate = (function (_super) {
    __extends(TransitionDelegate, _super);
    function TransitionDelegate() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TransitionDelegate.initWithOwnerId = function (id) {
        var delegate = TransitionDelegate.new();
        delegate._id = id;
        transitionDelegates.push(delegate);
        return delegate;
    };
    TransitionDelegate.prototype.animationWillStart = function (animationID, context) {
        if (frame_common_1.traceEnabled()) {
            frame_common_1.traceWrite("START " + this._id, frame_common_1.traceCategories.Transition);
        }
    };
    TransitionDelegate.prototype.animationDidStop = function (animationID, finished, context) {
        if (finished) {
            if (frame_common_1.traceEnabled()) {
                frame_common_1.traceWrite("END " + this._id, frame_common_1.traceCategories.Transition);
            }
        }
        else {
            if (frame_common_1.traceEnabled()) {
                frame_common_1.traceWrite("CANCEL " + this._id, frame_common_1.traceCategories.Transition);
            }
        }
        var index = transitionDelegates.indexOf(this);
        if (index > -1) {
            transitionDelegates.splice(index, 1);
        }
    };
    TransitionDelegate.ObjCExposedMethods = {
        "animationWillStart": { returns: interop.types.void, params: [NSString, NSObject] },
        "animationDidStop": { returns: interop.types.void, params: [NSString, NSNumber, NSObject] }
    };
    return TransitionDelegate;
}(NSObject));
var _defaultTransitionDuration = 0.35;
var UINavigationControllerAnimatedDelegate = (function (_super) {
    __extends(UINavigationControllerAnimatedDelegate, _super);
    function UINavigationControllerAnimatedDelegate() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UINavigationControllerAnimatedDelegate.prototype.navigationControllerAnimationControllerForOperationFromViewControllerToViewController = function (navigationController, operation, fromVC, toVC) {
        var viewController;
        switch (operation) {
            case 1:
                viewController = toVC;
                break;
            case 2:
                viewController = fromVC;
                break;
        }
        if (!viewController) {
            return null;
        }
        var navigationTransition = viewController[TRANSITION];
        if (!navigationTransition) {
            return null;
        }
        if (frame_common_1.traceEnabled()) {
            frame_common_1.traceWrite("UINavigationControllerImpl.navigationControllerAnimationControllerForOperationFromViewControllerToViewController(" + operation + ", " + fromVC + ", " + toVC + "), transition: " + JSON.stringify(navigationTransition), frame_common_1.traceCategories.NativeLifecycle);
        }
        var curve = _getNativeCurve(navigationTransition);
        var animationController = fragment_transitions_1._createIOSAnimatedTransitioning(navigationTransition, curve, operation, fromVC, toVC);
        return animationController;
    };
    UINavigationControllerAnimatedDelegate.ObjCProtocols = [UINavigationControllerDelegate];
    return UINavigationControllerAnimatedDelegate;
}(NSObject));
var UINavigationControllerImpl = (function (_super) {
    __extends(UINavigationControllerImpl, _super);
    function UINavigationControllerImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UINavigationControllerImpl.initWithOwner = function (owner) {
        var controller = UINavigationControllerImpl.new();
        controller._owner = owner;
        return controller;
    };
    Object.defineProperty(UINavigationControllerImpl.prototype, "owner", {
        get: function () {
            return this._owner.get();
        },
        enumerable: true,
        configurable: true
    });
    UINavigationControllerImpl.prototype.viewWillAppear = function (animated) {
        _super.prototype.viewWillAppear.call(this, animated);
        var owner = this._owner.get();
        if (owner && !owner.isLoaded && !owner.parent) {
            owner.callLoaded();
        }
    };
    UINavigationControllerImpl.prototype.viewDidDisappear = function (animated) {
        _super.prototype.viewDidDisappear.call(this, animated);
        var owner = this._owner.get();
        if (owner && owner.isLoaded && !owner.parent && !this.presentedViewController) {
            owner.callUnloaded();
        }
    };
    UINavigationControllerImpl.prototype.animateWithDuration = function (navigationTransition, nativeTransition, transitionType, baseCallback) {
        var _this = this;
        var duration = navigationTransition.duration ? navigationTransition.duration / 1000 : _defaultTransitionDuration;
        var curve = _getNativeCurve(navigationTransition);
        var transitionTraced = frame_common_1.isCategorySet(frame_common_1.traceCategories.Transition);
        var transitionDelegate;
        if (transitionTraced) {
            var id = _getTransitionId(nativeTransition, transitionType);
            transitionDelegate = TransitionDelegate.initWithOwnerId(id);
        }
        UIView.animateWithDurationAnimations(duration, function () {
            if (transitionTraced) {
                UIView.setAnimationDelegate(transitionDelegate);
            }
            UIView.setAnimationWillStartSelector("animationWillStart");
            UIView.setAnimationDidStopSelector("animationDidStop");
            UIView.setAnimationCurve(curve);
            baseCallback();
            UIView.setAnimationTransitionForViewCache(nativeTransition, _this.view, true);
        });
    };
    UINavigationControllerImpl.prototype.pushViewControllerAnimated = function (viewController, animated) {
        var _this = this;
        var navigationTransition = viewController[TRANSITION];
        if (frame_common_1.traceEnabled()) {
            frame_common_1.traceWrite("UINavigationControllerImpl.pushViewControllerAnimated(" + viewController + ", " + animated + "); transition: " + JSON.stringify(navigationTransition), frame_common_1.traceCategories.NativeLifecycle);
        }
        var nativeTransition = _getNativeTransition(navigationTransition, true);
        if (!animated || !navigationTransition || !nativeTransition) {
            _super.prototype.pushViewControllerAnimated.call(this, viewController, animated);
            return;
        }
        this.animateWithDuration(navigationTransition, nativeTransition, "push", function () {
            _super.prototype.pushViewControllerAnimated.call(_this, viewController, false);
        });
    };
    UINavigationControllerImpl.prototype.setViewControllersAnimated = function (viewControllers, animated) {
        var _this = this;
        var viewController = viewControllers.lastObject;
        var navigationTransition = viewController[TRANSITION];
        if (frame_common_1.traceEnabled()) {
            frame_common_1.traceWrite("UINavigationControllerImpl.setViewControllersAnimated(" + viewControllers + ", " + animated + "); transition: " + JSON.stringify(navigationTransition), frame_common_1.traceCategories.NativeLifecycle);
        }
        var nativeTransition = _getNativeTransition(navigationTransition, true);
        if (!animated || !navigationTransition || !nativeTransition) {
            _super.prototype.setViewControllersAnimated.call(this, viewControllers, animated);
            return;
        }
        this.animateWithDuration(navigationTransition, nativeTransition, "set", function () {
            _super.prototype.setViewControllersAnimated.call(_this, viewControllers, false);
        });
    };
    UINavigationControllerImpl.prototype.popViewControllerAnimated = function (animated) {
        var _this = this;
        var lastViewController = this.viewControllers.lastObject;
        var navigationTransition = lastViewController[TRANSITION];
        if (frame_common_1.traceEnabled()) {
            frame_common_1.traceWrite("UINavigationControllerImpl.popViewControllerAnimated(" + animated + "); transition: " + JSON.stringify(navigationTransition), frame_common_1.traceCategories.NativeLifecycle);
        }
        if (navigationTransition && navigationTransition.name === "non-animated") {
            return _super.prototype.popViewControllerAnimated.call(this, false);
        }
        var nativeTransition = _getNativeTransition(navigationTransition, false);
        if (!animated || !navigationTransition || !nativeTransition) {
            return _super.prototype.popViewControllerAnimated.call(this, animated);
        }
        this.animateWithDuration(navigationTransition, nativeTransition, "pop", function () {
            _super.prototype.popViewControllerAnimated.call(_this, false);
        });
        return null;
    };
    UINavigationControllerImpl.prototype.popToViewControllerAnimated = function (viewController, animated) {
        var _this = this;
        var lastViewController = this.viewControllers.lastObject;
        var navigationTransition = lastViewController[TRANSITION];
        if (frame_common_1.traceEnabled()) {
            frame_common_1.traceWrite("UINavigationControllerImpl.popToViewControllerAnimated(" + viewController + ", " + animated + "); transition: " + JSON.stringify(navigationTransition), frame_common_1.traceCategories.NativeLifecycle);
        }
        if (navigationTransition && navigationTransition.name === "non-animated") {
            return _super.prototype.popToViewControllerAnimated.call(this, viewController, false);
        }
        var nativeTransition = _getNativeTransition(navigationTransition, false);
        if (!animated || !navigationTransition || !nativeTransition) {
            return _super.prototype.popToViewControllerAnimated.call(this, viewController, animated);
        }
        this.animateWithDuration(navigationTransition, nativeTransition, "popTo", function () {
            _super.prototype.popToViewControllerAnimated.call(_this, viewController, false);
        });
        return null;
    };
    __decorate([
        profiling_1.profile
    ], UINavigationControllerImpl.prototype, "viewWillAppear", null);
    __decorate([
        profiling_1.profile
    ], UINavigationControllerImpl.prototype, "viewDidDisappear", null);
    __decorate([
        profiling_1.profile
    ], UINavigationControllerImpl.prototype, "pushViewControllerAnimated", null);
    __decorate([
        profiling_1.profile
    ], UINavigationControllerImpl.prototype, "setViewControllersAnimated", null);
    return UINavigationControllerImpl;
}(UINavigationController));
function _getTransitionId(nativeTransition, transitionType) {
    var name;
    switch (nativeTransition) {
        case 4:
            name = "CurlDown";
            break;
        case 3:
            name = "CurlUp";
            break;
        case 1:
            name = "FlipFromLeft";
            break;
        case 2:
            name = "FlipFromRight";
            break;
        case 0:
            name = "None";
            break;
    }
    return name + " " + transitionType;
}
function _getNativeTransition(navigationTransition, push) {
    if (navigationTransition && navigationTransition.name) {
        switch (navigationTransition.name.toLowerCase()) {
            case "flip":
            case "flipright":
                return push ? 2 : 1;
            case "flipleft":
                return push ? 1 : 2;
            case "curl":
            case "curlup":
                return push ? 3 : 4;
            case "curldown":
                return push ? 4 : 3;
        }
    }
    return null;
}
function _getNativeCurve(transition) {
    if (transition.curve) {
        switch (transition.curve) {
            case "easeIn":
                if (frame_common_1.traceEnabled()) {
                    frame_common_1.traceWrite("Transition curve resolved to UIViewAnimationCurve.EaseIn.", frame_common_1.traceCategories.Transition);
                }
                return 1;
            case "easeOut":
                if (frame_common_1.traceEnabled()) {
                    frame_common_1.traceWrite("Transition curve resolved to UIViewAnimationCurve.EaseOut.", frame_common_1.traceCategories.Transition);
                }
                return 2;
            case "easeInOut":
                if (frame_common_1.traceEnabled()) {
                    frame_common_1.traceWrite("Transition curve resolved to UIViewAnimationCurve.EaseInOut.", frame_common_1.traceCategories.Transition);
                }
                return 0;
            case "linear":
                if (frame_common_1.traceEnabled()) {
                    frame_common_1.traceWrite("Transition curve resolved to UIViewAnimationCurve.Linear.", frame_common_1.traceCategories.Transition);
                }
                return 3;
            default:
                if (frame_common_1.traceEnabled()) {
                    frame_common_1.traceWrite("Transition curve resolved to original: " + transition.curve, frame_common_1.traceCategories.Transition);
                }
                return transition.curve;
        }
    }
    return 0;
}
exports._getNativeCurve = _getNativeCurve;
var iOSFrame = (function () {
    function iOSFrame(frame) {
        this._navBarVisibility = "auto";
        this._controller = UINavigationControllerImpl.initWithOwner(new WeakRef(frame));
    }
    Object.defineProperty(iOSFrame.prototype, "controller", {
        get: function () {
            return this._controller;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(iOSFrame.prototype, "showNavigationBar", {
        get: function () {
            return this._showNavigationBar;
        },
        set: function (value) {
            this._showNavigationBar = value;
            this._controller.setNavigationBarHiddenAnimated(!value, !this._disableNavBarAnimation);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(iOSFrame.prototype, "navBarVisibility", {
        get: function () {
            return this._navBarVisibility;
        },
        set: function (value) {
            this._navBarVisibility = value;
        },
        enumerable: true,
        configurable: true
    });
    return iOSFrame;
}());
//# sourceMappingURL=frame.ios.js.map