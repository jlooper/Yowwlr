function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var view_common_1 = require("../core/view/view-common");
var view_1 = require("../core/view");
var builder_1 = require("../builder");
var profiling_1 = require("../../profiling");
var frame_stack_1 = require("./frame-stack");
__export(require("../core/view"));
function buildEntryFromArgs(arg) {
    var entry;
    if (typeof arg === "string") {
        entry = {
            moduleName: arg
        };
    }
    else if (typeof arg === "function") {
        entry = {
            create: arg
        };
    }
    else {
        entry = arg;
    }
    return entry;
}
var FrameBase = (function (_super) {
    __extends(FrameBase, _super);
    function FrameBase() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._backStack = new Array();
        _this._navigationQueue = new Array();
        _this._isInFrameStack = false;
        return _this;
    }
    FrameBase_1 = FrameBase;
    FrameBase.prototype._addChildFromBuilder = function (name, value) {
        throw new Error("Frame should not have a view. Use 'defaultPage' property instead.");
    };
    FrameBase.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        this._processNextNavigationEntry();
    };
    FrameBase.prototype.canGoBack = function () {
        var _this = this;
        var backstack = this._backStack.length;
        var previousForwardNotInBackstack = false;
        this._navigationQueue.forEach(function (item) {
            var entry = item.entry;
            if (item.isBackNavigation) {
                previousForwardNotInBackstack = false;
                if (!entry) {
                    backstack--;
                }
                else {
                    var backstackIndex = _this._backStack.indexOf(entry);
                    if (backstackIndex !== -1) {
                        backstack = backstackIndex;
                    }
                    else {
                        backstack--;
                    }
                }
            }
            else if (entry.entry.clearHistory) {
                previousForwardNotInBackstack = false;
                backstack = 0;
            }
            else {
                backstack++;
                if (previousForwardNotInBackstack) {
                    backstack--;
                }
                previousForwardNotInBackstack = entry.entry.backstackVisible === false;
            }
        });
        if (this._navigationQueue.length > 0 && !this._currentEntry) {
            backstack--;
        }
        return backstack > 0;
    };
    FrameBase.prototype.goBack = function (backstackEntry) {
        if (view_1.traceEnabled()) {
            view_1.traceWrite("GO BACK", view_1.traceCategories.Navigation);
        }
        if (!this.canGoBack()) {
            return;
        }
        if (backstackEntry) {
            var index_1 = this._backStack.indexOf(backstackEntry);
            if (index_1 < 0) {
                return;
            }
        }
        var navigationContext = {
            entry: backstackEntry,
            isBackNavigation: true
        };
        this._navigationQueue.push(navigationContext);
        this._processNextNavigationEntry();
    };
    FrameBase.prototype._removeEntry = function (removed) {
        var page = removed.resolvedPage;
        var frame = page.frame;
        page._frame = null;
        if (frame) {
            frame._removeView(page);
        }
        else {
            page._tearDownUI(true);
        }
    };
    FrameBase.prototype.navigate = function (param) {
        if (view_1.traceEnabled()) {
            view_1.traceWrite("NAVIGATE", view_1.traceCategories.Navigation);
        }
        var entry = buildEntryFromArgs(param);
        var page = builder_1.createViewFromEntry(entry);
        this._pushInFrameStack();
        var backstackEntry = {
            entry: entry,
            resolvedPage: page,
            navDepth: undefined,
            fragmentTag: undefined
        };
        var navigationContext = {
            entry: backstackEntry,
            isBackNavigation: false
        };
        this._navigationQueue.push(navigationContext);
        this._processNextNavigationEntry();
    };
    FrameBase.prototype.isCurrent = function (entry) {
        return this._currentEntry === entry;
    };
    FrameBase.prototype.setCurrent = function (entry, isBack) {
        var newPage = entry.resolvedPage;
        if (!newPage.frame) {
            this._addView(newPage);
            newPage._frame = this;
        }
        this._currentEntry = entry;
        if (isBack) {
            this._pushInFrameStack();
        }
        newPage.onNavigatedTo(isBack);
        this._executingEntry = null;
    };
    FrameBase.prototype._updateBackstack = function (entry, isBack) {
        var _this = this;
        this.raiseCurrentPageNavigatedEvents(isBack);
        var current = this._currentEntry;
        if (isBack) {
            var index_2 = this._backStack.indexOf(entry);
            this._backStack.splice(index_2 + 1).forEach(function (e) { return _this._removeEntry(e); });
            this._backStack.pop();
        }
        else {
            if (entry.entry.clearHistory) {
                this._backStack.forEach(function (e) { return _this._removeEntry(e); });
                this._backStack.length = 0;
            }
            else if (FrameBase_1._isEntryBackstackVisible(current)) {
                this._backStack.push(current);
            }
        }
        if (current && this._backStack.indexOf(current) < 0) {
            this._removeEntry(current);
        }
    };
    FrameBase.prototype.isNestedWithin = function (parentFrameCandidate) {
        var frameAncestor = this;
        while (frameAncestor) {
            frameAncestor = view_common_1.getAncestor(frameAncestor, FrameBase_1);
            if (frameAncestor === parentFrameCandidate) {
                return true;
            }
        }
        return false;
    };
    FrameBase.prototype.raiseCurrentPageNavigatedEvents = function (isBack) {
        var page = this.currentPage;
        if (page) {
            if (page.isLoaded) {
                page.callUnloaded();
            }
            page.onNavigatedFrom(isBack);
        }
    };
    FrameBase.prototype._processNavigationQueue = function (page) {
        if (this._navigationQueue.length === 0) {
            return;
        }
        var entry = this._navigationQueue[0].entry;
        var currentNavigationPage = entry.resolvedPage;
        if (page !== currentNavigationPage) {
            return;
        }
        this._navigationQueue.shift();
        this._processNextNavigationEntry();
        this._updateActionBar();
    };
    FrameBase.prototype._findEntryForTag = function (fragmentTag) {
        var entry;
        if (this._currentEntry && this._currentEntry.fragmentTag === fragmentTag) {
            entry = this._currentEntry;
        }
        else {
            entry = this._backStack.find(function (value) { return value.fragmentTag === fragmentTag; });
            if (!entry) {
                var navigationItem = this._navigationQueue.find(function (value) { return value.entry.fragmentTag === fragmentTag; });
                entry = navigationItem ? navigationItem.entry : undefined;
            }
        }
        return entry;
    };
    FrameBase.prototype.navigationQueueIsEmpty = function () {
        return this._navigationQueue.length === 0;
    };
    FrameBase._isEntryBackstackVisible = function (entry) {
        if (!entry) {
            return false;
        }
        var backstackVisibleValue = entry.entry.backstackVisible;
        var backstackHidden = backstackVisibleValue !== undefined && !backstackVisibleValue;
        return !backstackHidden;
    };
    FrameBase.prototype._updateActionBar = function (page, disableNavBarAnimation) {
    };
    FrameBase.prototype._processNextNavigationEntry = function () {
        if (!this.isLoaded || this._executingEntry) {
            return;
        }
        if (this._navigationQueue.length > 0) {
            var navigationContext = this._navigationQueue[0];
            if (navigationContext.isBackNavigation) {
                this.performGoBack(navigationContext);
            }
            else {
                this.performNavigation(navigationContext);
            }
        }
    };
    FrameBase.prototype.performNavigation = function (navigationContext) {
        var navContext = navigationContext.entry;
        this._executingEntry = navContext;
        this._onNavigatingTo(navContext, navigationContext.isBackNavigation);
        this._navigateCore(navContext);
    };
    FrameBase.prototype.performGoBack = function (navigationContext) {
        var backstackEntry = navigationContext.entry;
        var backstack = this._backStack;
        if (!backstackEntry) {
            backstackEntry = backstack[backstack.length - 1];
            navigationContext.entry = backstackEntry;
        }
        this._executingEntry = backstackEntry;
        this._onNavigatingTo(backstackEntry, true);
        this._goBackCore(backstackEntry);
    };
    FrameBase.prototype._goBackCore = function (backstackEntry) {
        if (view_1.traceEnabled()) {
            view_1.traceWrite("GO BACK CORE(" + this._backstackEntryTrace(backstackEntry) + "); currentPage: " + this.currentPage, view_1.traceCategories.Navigation);
        }
    };
    FrameBase.prototype._navigateCore = function (backstackEntry) {
        if (view_1.traceEnabled()) {
            view_1.traceWrite("NAVIGATE CORE(" + this._backstackEntryTrace(backstackEntry) + "); currentPage: " + this.currentPage, view_1.traceCategories.Navigation);
        }
    };
    FrameBase.prototype._onNavigatingTo = function (backstackEntry, isBack) {
        if (this.currentPage) {
            this.currentPage.onNavigatingFrom(isBack);
        }
        backstackEntry.resolvedPage.onNavigatingTo(backstackEntry.entry.context, isBack, backstackEntry.entry.bindingContext);
    };
    Object.defineProperty(FrameBase.prototype, "animated", {
        get: function () {
            return this._animated;
        },
        set: function (value) {
            this._animated = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FrameBase.prototype, "transition", {
        get: function () {
            return this._transition;
        },
        set: function (value) {
            this._transition = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FrameBase.prototype, "backStack", {
        get: function () {
            return this._backStack.slice();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FrameBase.prototype, "currentPage", {
        get: function () {
            if (this._currentEntry) {
                return this._currentEntry.resolvedPage;
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FrameBase.prototype, "currentEntry", {
        get: function () {
            if (this._currentEntry) {
                return this._currentEntry.entry;
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    FrameBase.prototype._pushInFrameStackRecursive = function () {
        this._pushInFrameStack();
        var framesToPush = [];
        for (var _i = 0, frameStack_1 = frame_stack_1.frameStack; _i < frameStack_1.length; _i++) {
            var frame = frameStack_1[_i];
            if (frame.isNestedWithin(this)) {
                framesToPush.push(frame);
            }
        }
        for (var _a = 0, framesToPush_1 = framesToPush; _a < framesToPush_1.length; _a++) {
            var frame = framesToPush_1[_a];
            frame._pushInFrameStack();
        }
    };
    FrameBase.prototype._pushInFrameStack = function () {
        frame_stack_1._pushInFrameStack(this);
    };
    FrameBase.prototype._popFromFrameStack = function () {
        frame_stack_1._popFromFrameStack(this);
    };
    FrameBase.prototype._removeFromFrameStack = function () {
        frame_stack_1._removeFromFrameStack(this);
    };
    FrameBase.prototype._dialogClosed = function () {
        this._removeFromFrameStack();
    };
    FrameBase.prototype._onRootViewReset = function () {
        _super.prototype._onRootViewReset.call(this);
        this._removeFromFrameStack();
    };
    Object.defineProperty(FrameBase.prototype, "_childrenCount", {
        get: function () {
            if (this.currentPage) {
                return 1;
            }
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    FrameBase.prototype.eachChildView = function (callback) {
        var page = this.currentPage;
        if (page) {
            callback(page);
        }
    };
    FrameBase.prototype._getIsAnimatedNavigation = function (entry) {
        if (entry && entry.animated !== undefined) {
            return entry.animated;
        }
        if (this.animated !== undefined) {
            return this.animated;
        }
        return FrameBase_1.defaultAnimatedNavigation;
    };
    FrameBase.prototype._getNavigationTransition = function (entry) {
        if (entry) {
            if (view_1.isIOS && entry.transitioniOS !== undefined) {
                return entry.transitioniOS;
            }
            if (view_1.isAndroid && entry.transitionAndroid !== undefined) {
                return entry.transitionAndroid;
            }
            if (entry.transition !== undefined) {
                return entry.transition;
            }
        }
        if (this.transition !== undefined) {
            return this.transition;
        }
        return FrameBase_1.defaultTransition;
    };
    Object.defineProperty(FrameBase.prototype, "navigationBarHeight", {
        get: function () {
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    FrameBase.prototype._getNavBarVisible = function (page) {
        throw new Error();
    };
    FrameBase.prototype._addViewToNativeVisualTree = function (child) {
        return true;
    };
    FrameBase.prototype._removeViewFromNativeVisualTree = function (child) {
        child._isAddedToNativeVisualTree = false;
    };
    FrameBase.prototype._printFrameBackStack = function () {
        var length = this.backStack.length;
        var i = length - 1;
        console.log("Frame Back Stack: ");
        while (i >= 0) {
            var backstackEntry = this.backStack[i--];
            console.log("\t" + backstackEntry.resolvedPage);
        }
    };
    FrameBase.prototype._backstackEntryTrace = function (b) {
        var result = "" + b.resolvedPage;
        var backstackVisible = FrameBase_1._isEntryBackstackVisible(b);
        if (!backstackVisible) {
            result += " | INVISIBLE";
        }
        if (b.entry.clearHistory) {
            result += " | CLEAR HISTORY";
        }
        var animated = this._getIsAnimatedNavigation(b.entry);
        if (!animated) {
            result += " | NOT ANIMATED";
        }
        var t = this._getNavigationTransition(b.entry);
        if (t) {
            result += " | Transition[" + JSON.stringify(t) + "]";
        }
        return result;
    };
    FrameBase.prototype._onLivesync = function () {
        _super.prototype._onLivesync.call(this);
        if (!this._currentEntry || !this._currentEntry.entry) {
            return false;
        }
        var currentEntry = this._currentEntry.entry;
        var newEntry = {
            animated: false,
            clearHistory: true,
            context: currentEntry.context,
            create: currentEntry.create,
            moduleName: currentEntry.moduleName,
            backstackVisible: currentEntry.backstackVisible
        };
        if (newEntry.create) {
            var page = newEntry.create();
            if (page === this.currentPage) {
                return false;
            }
        }
        this.navigate(newEntry);
        return true;
    };
    var FrameBase_1;
    FrameBase.androidOptionSelectedEvent = "optionSelected";
    FrameBase.defaultAnimatedNavigation = true;
    __decorate([
        profiling_1.profile
    ], FrameBase.prototype, "onLoaded", null);
    __decorate([
        profiling_1.profile
    ], FrameBase.prototype, "performNavigation", null);
    __decorate([
        profiling_1.profile
    ], FrameBase.prototype, "performGoBack", null);
    FrameBase = FrameBase_1 = __decorate([
        view_1.CSSType("Frame")
    ], FrameBase);
    return FrameBase;
}(view_1.CustomLayoutView));
exports.FrameBase = FrameBase;
function getFrameById(id) {
    return frame_stack_1.frameStack.find(function (frame) { return frame.id && frame.id === id; });
}
exports.getFrameById = getFrameById;
function topmost() {
    return frame_stack_1.topmost();
}
exports.topmost = topmost;
function goBack() {
    var top = topmost();
    if (top && top.canGoBack()) {
        top.goBack();
        return true;
    }
    else if (top) {
        var parentFrameCanGoBack = false;
        var parentFrame = view_common_1.getAncestor(top, "Frame");
        while (parentFrame && !parentFrameCanGoBack) {
            if (parentFrame && parentFrame.canGoBack()) {
                parentFrameCanGoBack = true;
            }
            else {
                parentFrame = view_common_1.getAncestor(parentFrame, "Frame");
            }
        }
        if (parentFrame && parentFrameCanGoBack) {
            parentFrame.goBack();
            return true;
        }
    }
    if (frame_stack_1.frameStack.length > 1) {
        top._popFromFrameStack();
    }
    return false;
}
exports.goBack = goBack;
function stack() {
    return frame_stack_1.frameStack;
}
exports.stack = stack;
exports.defaultPage = new view_1.Property({
    name: "defaultPage", valueChanged: function (frame, oldValue, newValue) {
        frame.navigate({ moduleName: newValue });
    }
});
exports.defaultPage.register(FrameBase);
exports.actionBarVisibilityProperty = new view_1.Property({ name: "actionBarVisibility", defaultValue: "auto", affectsLayout: view_1.isIOS });
exports.actionBarVisibilityProperty.register(FrameBase);
//# sourceMappingURL=frame-common.js.map