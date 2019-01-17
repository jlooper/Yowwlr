function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var application = require("../../application");
var frame_common_1 = require("./frame-common");
var fragment_transitions_1 = require("./fragment.transitions");
var profiling_1 = require("../../profiling");
var builder_1 = require("../builder");
__export(require("./frame-common"));
var INTENT_EXTRA = "com.tns.activity";
var ROOT_VIEW_ID_EXTRA = "com.tns.activity.rootViewId";
var FRAMEID = "_frameId";
var CALLBACKS = "_callbacks";
var ownerSymbol = Symbol("_owner");
var activityRootViewsMap = new Map();
var navDepth = -1;
var fragmentId = -1;
if (global && global.__inspector) {
    var devtools = require("tns-core-modules/debugger/devtools-elements.js");
    devtools.attachDOMInspectorEventCallbacks(global.__inspector);
    devtools.attachDOMInspectorCommandCallbacks(global.__inspector);
}
function getAttachListener() {
    if (!exports.attachStateChangeListener) {
        var AttachListener = (function (_super) {
            __extends(AttachListener, _super);
            function AttachListener() {
                var _this = _super.call(this) || this;
                return global.__native(_this);
            }
            AttachListener.prototype.onViewAttachedToWindow = function (view) {
                var owner = view[ownerSymbol];
                if (owner) {
                    owner._onAttachedToWindow();
                }
            };
            AttachListener.prototype.onViewDetachedFromWindow = function (view) {
                var owner = view[ownerSymbol];
                if (owner) {
                    owner._onDetachedFromWindow();
                }
            };
            AttachListener = __decorate([
                Interfaces([android.view.View.OnAttachStateChangeListener])
            ], AttachListener);
            return AttachListener;
        }(java.lang.Object));
        exports.attachStateChangeListener = new AttachListener();
    }
    return exports.attachStateChangeListener;
}
function reloadPage() {
    var activity = application.android.foregroundActivity;
    var callbacks = activity[CALLBACKS];
    var rootView = callbacks.getRootView();
    if (!rootView || !rootView._onLivesync()) {
        callbacks.resetActivityContent(activity);
    }
}
exports.reloadPage = reloadPage;
global.__onLiveSyncCore = reloadPage;
var Frame = (function (_super) {
    __extends(Frame, _super);
    function Frame() {
        var _this = _super.call(this) || this;
        _this._containerViewId = -1;
        _this._tearDownPending = false;
        _this._attachedToWindow = false;
        _this._isBack = true;
        _this._android = new AndroidFrame(_this);
        return _this;
    }
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
    Object.defineProperty(Frame.prototype, "containerViewId", {
        get: function () {
            return this._containerViewId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Frame.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Frame.prototype, "_hasFragments", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Frame.prototype._onAttachedToWindow = function () {
        _super.prototype._onAttachedToWindow.call(this);
        this._attachedToWindow = true;
        this._processNextNavigationEntry();
    };
    Frame.prototype._onDetachedFromWindow = function () {
        _super.prototype._onDetachedFromWindow.call(this);
        this._attachedToWindow = false;
    };
    Frame.prototype._processNextNavigationEntry = function () {
        if (!this.isLoaded || this._executingEntry || !this._attachedToWindow) {
            return;
        }
        var animatedEntries = fragment_transitions_1._getAnimatedEntries(this._android.frameId);
        if (animatedEntries) {
            if (animatedEntries.size > 0) {
                return;
            }
        }
        var manager = this._getFragmentManager();
        var entry = this._currentEntry;
        if (entry && manager && !manager.findFragmentByTag(entry.fragmentTag)) {
            this._cachedAnimatorState = getAnimatorState(this._currentEntry);
            this._currentEntry = null;
            this._navigateCore(entry);
            this._currentEntry = entry;
        }
        else {
            _super.prototype._processNextNavigationEntry.call(this);
        }
    };
    Frame.prototype._getChildFragmentManager = function () {
        var backstackEntry = this._executingEntry || this._currentEntry;
        if (backstackEntry && backstackEntry.fragment && backstackEntry.fragment.isAdded()) {
            return backstackEntry.fragment.getChildFragmentManager();
        }
        return null;
    };
    Frame.prototype._onRootViewReset = function () {
        _super.prototype._onRootViewReset.call(this);
        this.disposeCurrentFragment();
    };
    Frame.prototype.onUnloaded = function () {
        _super.prototype.onUnloaded.call(this);
        this.disposeCurrentFragment();
    };
    Frame.prototype.disposeCurrentFragment = function () {
        if (!this._currentEntry ||
            !this._currentEntry.fragment ||
            !this._currentEntry.fragment.isAdded()) {
            return;
        }
        var manager = this._getFragmentManager();
        var transaction = manager.beginTransaction();
        transaction.remove(this._currentEntry.fragment);
        transaction.commitNowAllowingStateLoss();
    };
    Frame.prototype.createFragment = function (backstackEntry, fragmentTag) {
        ensureFragmentClass();
        var newFragment = new fragmentClass();
        var args = new android.os.Bundle();
        args.putInt(FRAMEID, this._android.frameId);
        newFragment.setArguments(args);
        setFragmentCallbacks(newFragment);
        var callbacks = newFragment[CALLBACKS];
        callbacks.frame = this;
        callbacks.entry = backstackEntry;
        backstackEntry.fragment = newFragment;
        backstackEntry.fragmentTag = fragmentTag;
        backstackEntry.navDepth = navDepth;
        return newFragment;
    };
    Frame.prototype.setCurrent = function (entry, isBack) {
        var current = this._currentEntry;
        var currentEntryChanged = current !== entry;
        if (currentEntryChanged) {
            this._updateBackstack(entry, isBack);
            if (this._tearDownPending) {
                this._tearDownPending = false;
                if (!entry.recreated) {
                    clearEntry(entry);
                }
                if (current && !current.recreated) {
                    clearEntry(current);
                }
                var context_1 = this._context;
                if (context_1 && !entry.recreated) {
                    entry.fragment = this.createFragment(entry, entry.fragmentTag);
                    entry.resolvedPage._setupUI(context_1);
                }
                entry.recreated = false;
                if (current) {
                    current.recreated = false;
                }
            }
            _super.prototype.setCurrent.call(this, entry, isBack);
            this._processNavigationQueue(entry.resolvedPage);
        }
        else {
            this._processNextNavigationEntry();
        }
        if (this._cachedAnimatorState) {
            restoreAnimatorState(this._currentEntry, this._cachedAnimatorState);
            this._cachedAnimatorState = null;
        }
    };
    Frame.prototype.onBackPressed = function () {
        if (this.canGoBack()) {
            this.goBack();
            return true;
        }
        if (!this.navigationQueueIsEmpty()) {
            var manager = this._getFragmentManager();
            if (manager) {
                manager.executePendingTransactions();
                return true;
            }
        }
        return false;
    };
    Frame.prototype._navigateCore = function (newEntry) {
        _super.prototype._navigateCore.call(this, newEntry);
        this._isBack = false;
        newEntry.frameId = this._android.frameId;
        var activity = this._android.activity;
        if (!activity) {
            var currentActivity = this._android.currentActivity;
            if (currentActivity) {
                startActivity(currentActivity, this._android.frameId);
            }
            return;
        }
        var manager = this._getFragmentManager();
        var clearHistory = newEntry.entry.clearHistory;
        var currentEntry = this._currentEntry;
        if (clearHistory) {
            navDepth = -1;
        }
        navDepth++;
        fragmentId++;
        var newFragmentTag = "fragment" + fragmentId + "[" + navDepth + "]";
        var newFragment = this.createFragment(newEntry, newFragmentTag);
        var transaction = manager.beginTransaction();
        var animated = currentEntry ? this._getIsAnimatedNavigation(newEntry.entry) : false;
        var navigationTransition = this._currentEntry ? this._getNavigationTransition(newEntry.entry) : null;
        fragment_transitions_1._setAndroidFragmentTransitions(animated, navigationTransition, currentEntry, newEntry, transaction, this._android.frameId);
        if (currentEntry && animated && !navigationTransition) {
            transaction.setTransition(android.support.v4.app.FragmentTransaction.TRANSIT_FRAGMENT_OPEN);
        }
        transaction.replace(this.containerViewId, newFragment, newFragmentTag);
        transaction.commitAllowingStateLoss();
    };
    Frame.prototype._goBackCore = function (backstackEntry) {
        this._isBack = true;
        _super.prototype._goBackCore.call(this, backstackEntry);
        navDepth = backstackEntry.navDepth;
        var manager = this._getFragmentManager();
        var transaction = manager.beginTransaction();
        if (!backstackEntry.fragment) {
            backstackEntry.fragment = this.createFragment(backstackEntry, backstackEntry.fragmentTag);
            fragment_transitions_1._updateTransitions(backstackEntry);
        }
        var transitionReversed = fragment_transitions_1._reverseTransitions(backstackEntry, this._currentEntry);
        if (!transitionReversed) {
            transaction.setCustomAnimations(-30, -40);
        }
        transaction.replace(this.containerViewId, backstackEntry.fragment, backstackEntry.fragmentTag);
        transaction.commitAllowingStateLoss();
    };
    Frame.prototype._removeEntry = function (removed) {
        _super.prototype._removeEntry.call(this, removed);
        if (removed.fragment) {
            fragment_transitions_1._clearEntry(removed);
        }
        removed.fragment = null;
        removed.viewSavedState = null;
    };
    Frame.prototype.createNativeView = function () {
        return new org.nativescript.widgets.ContentLayout(this._context);
    };
    Frame.prototype.initNativeView = function () {
        _super.prototype.initNativeView.call(this);
        var listener = getAttachListener();
        this.nativeViewProtected.addOnAttachStateChangeListener(listener);
        this.nativeViewProtected[ownerSymbol] = this;
        this._android.rootViewGroup = this.nativeViewProtected;
        if (this._containerViewId < 0) {
            this._containerViewId = android.view.View.generateViewId();
        }
        this._android.rootViewGroup.setId(this._containerViewId);
    };
    Frame.prototype.disposeNativeView = function () {
        var _this = this;
        var listener = getAttachListener();
        this.nativeViewProtected.removeOnAttachStateChangeListener(listener);
        this.nativeViewProtected[ownerSymbol] = null;
        this._tearDownPending = !!this._executingEntry;
        var current = this._currentEntry;
        this.backStack.forEach(function (entry) {
            if (entry !== _this._executingEntry) {
                clearEntry(entry);
            }
        });
        if (current && !this._executingEntry) {
            clearEntry(current);
        }
        this._android.rootViewGroup = null;
        this._removeFromFrameStack();
        _super.prototype.disposeNativeView.call(this);
    };
    Frame.prototype._popFromFrameStack = function () {
        if (!this._isInFrameStack) {
            return;
        }
        _super.prototype._popFromFrameStack.call(this);
    };
    Frame.prototype._getNavBarVisible = function (page) {
        switch (this.actionBarVisibility) {
            case "never":
                return false;
            case "always":
                return true;
            default:
                if (page.actionBarHidden !== undefined) {
                    return !page.actionBarHidden;
                }
                if (this._android && this._android.showActionBar !== undefined) {
                    return this._android.showActionBar;
                }
                return true;
        }
    };
    Frame.prototype._saveFragmentsState = function () {
        this.backStack.forEach(function (entry) {
            var view = entry.resolvedPage.nativeViewProtected;
            if (!entry.viewSavedState && view) {
                var viewState = new android.util.SparseArray();
                view.saveHierarchyState(viewState);
                entry.viewSavedState = viewState;
            }
        });
    };
    __decorate([
        profiling_1.profile
    ], Frame.prototype, "_navigateCore", null);
    return Frame;
}(frame_common_1.FrameBase));
exports.Frame = Frame;
function cloneExpandedAnimator(expandedAnimator) {
    if (!expandedAnimator) {
        return null;
    }
    var clone = expandedAnimator.clone();
    clone.entry = expandedAnimator.entry;
    clone.transitionType = expandedAnimator.transitionType;
    return clone;
}
function getAnimatorState(entry) {
    var expandedEntry = entry;
    var animatorState = {};
    animatorState.enterAnimator = cloneExpandedAnimator(expandedEntry.enterAnimator);
    animatorState.exitAnimator = cloneExpandedAnimator(expandedEntry.exitAnimator);
    animatorState.popEnterAnimator = cloneExpandedAnimator(expandedEntry.popEnterAnimator);
    animatorState.popExitAnimator = cloneExpandedAnimator(expandedEntry.popExitAnimator);
    animatorState.transitionName = expandedEntry.transitionName;
    return animatorState;
}
function restoreAnimatorState(entry, snapshot) {
    var expandedEntry = entry;
    if (snapshot.enterAnimator) {
        expandedEntry.enterAnimator = snapshot.enterAnimator;
    }
    if (snapshot.exitAnimator) {
        expandedEntry.exitAnimator = snapshot.exitAnimator;
    }
    if (snapshot.popEnterAnimator) {
        expandedEntry.popEnterAnimator = snapshot.popEnterAnimator;
    }
    if (snapshot.popExitAnimator) {
        expandedEntry.popExitAnimator = snapshot.popExitAnimator;
    }
    expandedEntry.transitionName = snapshot.transitionName;
}
function clearEntry(entry) {
    if (entry.fragment) {
        fragment_transitions_1._clearFragment(entry);
    }
    entry.recreated = false;
    entry.fragment = null;
    var page = entry.resolvedPage;
    if (page._context) {
        entry.resolvedPage._tearDownUI(true);
    }
}
var framesCounter = 0;
var framesCache = new Array();
var AndroidFrame = (function (_super) {
    __extends(AndroidFrame, _super);
    function AndroidFrame(owner) {
        var _this = _super.call(this) || this;
        _this._showActionBar = true;
        _this.cachePagesOnNavigate = true;
        _this._owner = owner;
        _this.frameId = framesCounter++;
        framesCache.push(new WeakRef(_this));
        return _this;
    }
    Object.defineProperty(AndroidFrame.prototype, "showActionBar", {
        get: function () {
            return this._showActionBar;
        },
        set: function (value) {
            if (this._showActionBar !== value) {
                this._showActionBar = value;
                if (this.owner.currentPage) {
                    this.owner.currentPage.actionBar.update();
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AndroidFrame.prototype, "activity", {
        get: function () {
            var activity = this.owner._context;
            if (activity) {
                return activity;
            }
            var currView = this._owner.parent;
            while (currView) {
                if (currView instanceof Frame) {
                    return currView.android.activity;
                }
                currView = currView.parent;
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AndroidFrame.prototype, "actionBar", {
        get: function () {
            var activity = this.currentActivity;
            if (!activity) {
                return undefined;
            }
            var bar = activity.getActionBar();
            if (!bar) {
                return undefined;
            }
            return bar;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AndroidFrame.prototype, "currentActivity", {
        get: function () {
            var activity = this.activity;
            if (activity) {
                return activity;
            }
            var frames = frame_common_1.stack();
            for (var length_1 = frames.length, i = length_1 - 1; i >= 0; i--) {
                activity = frames[i].android.activity;
                if (activity) {
                    return activity;
                }
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AndroidFrame.prototype, "owner", {
        get: function () {
            return this._owner;
        },
        enumerable: true,
        configurable: true
    });
    AndroidFrame.prototype.canGoBack = function () {
        if (!this.activity) {
            return false;
        }
        return this.activity.getIntent().getAction() !== android.content.Intent.ACTION_MAIN;
    };
    AndroidFrame.prototype.fragmentForPage = function (entry) {
        var tag = entry && entry.fragmentTag;
        if (tag) {
            return this.owner._getFragmentManager().findFragmentByTag(tag);
        }
        return undefined;
    };
    return AndroidFrame;
}(frame_common_1.Observable));
function findPageForFragment(fragment, frame) {
    var fragmentTag = fragment.getTag();
    if (frame_common_1.traceEnabled()) {
        frame_common_1.traceWrite("Finding page for " + fragmentTag + ".", frame_common_1.traceCategories.NativeLifecycle);
    }
    var entry;
    var current = frame._currentEntry;
    var navigating = frame._executingEntry;
    if (current && current.fragmentTag === fragmentTag) {
        entry = current;
    }
    else if (navigating && navigating.fragmentTag === fragmentTag) {
        entry = navigating;
    }
    var page;
    if (entry) {
        entry.recreated = true;
        page = entry.resolvedPage;
    }
    if (page) {
        var callbacks = fragment[CALLBACKS];
        callbacks.frame = frame;
        callbacks.entry = entry;
        entry.fragment = fragment;
        fragment_transitions_1._updateTransitions(entry);
    }
    else {
        throw new Error("Could not find a page for " + fragmentTag + ".");
    }
}
function startActivity(activity, frameId) {
    var intent = new android.content.Intent(activity, activity.getClass());
    intent.setAction(android.content.Intent.ACTION_DEFAULT);
    intent.putExtra(INTENT_EXTRA, frameId);
    activity.startActivity(intent);
}
function getFrameByNumberId(frameId) {
    for (var i = 0; i < framesCache.length; i++) {
        var aliveFrame = framesCache[i].get();
        if (aliveFrame && aliveFrame.frameId === frameId) {
            return aliveFrame.owner;
        }
    }
    return null;
}
function ensureFragmentClass() {
    if (fragmentClass) {
        return;
    }
    require("ui/frame/fragment");
    if (!fragmentClass) {
        throw new Error("Failed to initialize the extended android.support.v4.app.Fragment class");
    }
}
var fragmentClass;
function setFragmentClass(clazz) {
    if (fragmentClass) {
        throw new Error("Fragment class already initialized");
    }
    fragmentClass = clazz;
}
exports.setFragmentClass = setFragmentClass;
var FragmentCallbacksImplementation = (function () {
    function FragmentCallbacksImplementation() {
    }
    FragmentCallbacksImplementation.prototype.onHiddenChanged = function (fragment, hidden, superFunc) {
        if (frame_common_1.traceEnabled()) {
            frame_common_1.traceWrite(fragment + ".onHiddenChanged(" + hidden + ")", frame_common_1.traceCategories.NativeLifecycle);
        }
        superFunc.call(fragment, hidden);
    };
    FragmentCallbacksImplementation.prototype.onCreateAnimator = function (fragment, transit, enter, nextAnim, superFunc) {
        if (!enter && fragment.getRemovingParentFragment()) {
            return superFunc.call(fragment, transit, enter, nextAnim);
        }
        var nextAnimString;
        switch (nextAnim) {
            case -10:
                nextAnimString = "enter";
                break;
            case -20:
                nextAnimString = "exit";
                break;
            case -30:
                nextAnimString = "popEnter";
                break;
            case -40:
                nextAnimString = "popExit";
                break;
        }
        var animator = fragment_transitions_1._onFragmentCreateAnimator(this.entry, fragment, nextAnim, enter);
        if (!animator) {
            animator = superFunc.call(fragment, transit, enter, nextAnim);
        }
        if (frame_common_1.traceEnabled()) {
            frame_common_1.traceWrite(fragment + ".onCreateAnimator(" + transit + ", " + (enter ? "enter" : "exit") + ", " + nextAnimString + "): " + (animator ? "animator" : "no animator"), frame_common_1.traceCategories.NativeLifecycle);
        }
        return animator;
    };
    FragmentCallbacksImplementation.prototype.onCreate = function (fragment, savedInstanceState, superFunc) {
        if (frame_common_1.traceEnabled()) {
            frame_common_1.traceWrite(fragment + ".onCreate(" + savedInstanceState + ")", frame_common_1.traceCategories.NativeLifecycle);
        }
        superFunc.call(fragment, savedInstanceState);
        if (!this.entry) {
            var args = fragment.getArguments();
            var frameId = args.getInt(FRAMEID);
            var frame = getFrameByNumberId(frameId);
            if (!frame) {
                throw new Error("Cannot find Frame for " + fragment);
            }
            findPageForFragment(fragment, frame);
        }
    };
    FragmentCallbacksImplementation.prototype.onCreateView = function (fragment, inflater, container, savedInstanceState, superFunc) {
        if (frame_common_1.traceEnabled()) {
            frame_common_1.traceWrite(fragment + ".onCreateView(inflater, container, " + savedInstanceState + ")", frame_common_1.traceCategories.NativeLifecycle);
        }
        var entry = this.entry;
        if (!entry) {
            frame_common_1.traceError(fragment + ".onCreateView: entry is null or undefined");
            return null;
        }
        var page = entry.resolvedPage;
        if (!page) {
            frame_common_1.traceError(fragment + ".onCreateView: entry has no resolvedPage");
            return null;
        }
        var frame = this.frame;
        if (!frame) {
            frame_common_1.traceError(fragment + ".onCreateView: this.frame is null or undefined");
            return null;
        }
        if (page.parent === frame) {
            if (!page._context) {
                var context_2 = container && container.getContext() || inflater && inflater.getContext();
                page._setupUI(context_2);
            }
        }
        else {
            if (!frame._styleScope) {
                page._updateStyleScope();
            }
            frame._addView(page);
        }
        if (frame.isLoaded && !page.isLoaded) {
            page.callLoaded();
        }
        var savedState = entry.viewSavedState;
        if (savedState) {
            page.nativeViewProtected.restoreHierarchyState(savedState);
            entry.viewSavedState = null;
        }
        var nativeView = page.nativeViewProtected;
        if (nativeView != null) {
            var parentView = nativeView.getParent();
            if (parentView instanceof android.view.ViewGroup) {
                if (parentView.getChildCount() === 0) {
                    parentView.addViewInLayout(nativeView, -1, new org.nativescript.widgets.CommonLayoutParams());
                }
                parentView.removeView(nativeView);
            }
        }
        return page.nativeViewProtected;
    };
    FragmentCallbacksImplementation.prototype.onSaveInstanceState = function (fragment, outState, superFunc) {
        if (frame_common_1.traceEnabled()) {
            frame_common_1.traceWrite(fragment + ".onSaveInstanceState(" + outState + ")", frame_common_1.traceCategories.NativeLifecycle);
        }
        superFunc.call(fragment, outState);
    };
    FragmentCallbacksImplementation.prototype.onDestroyView = function (fragment, superFunc) {
        if (frame_common_1.traceEnabled()) {
            frame_common_1.traceWrite(fragment + ".onDestroyView()", frame_common_1.traceCategories.NativeLifecycle);
        }
        superFunc.call(fragment);
    };
    FragmentCallbacksImplementation.prototype.onDestroy = function (fragment, superFunc) {
        if (frame_common_1.traceEnabled()) {
            frame_common_1.traceWrite(fragment + ".onDestroy()", frame_common_1.traceCategories.NativeLifecycle);
        }
        superFunc.call(fragment);
        var entry = this.entry;
        if (!entry) {
            frame_common_1.traceError(fragment + ".onDestroy: entry is null or undefined");
            return null;
        }
        entry.fragment = null;
        var page = entry.resolvedPage;
        if (!page) {
            frame_common_1.traceError(fragment + ".onDestroy: entry has no resolvedPage");
            return null;
        }
    };
    FragmentCallbacksImplementation.prototype.onStop = function (fragment, superFunc) {
        superFunc.call(fragment);
    };
    FragmentCallbacksImplementation.prototype.toStringOverride = function (fragment, superFunc) {
        var entry = this.entry;
        if (entry) {
            return entry.fragmentTag + "<" + entry.resolvedPage + ">";
        }
        else {
            return "NO ENTRY, " + superFunc.call(fragment);
        }
    };
    __decorate([
        profiling_1.profile
    ], FragmentCallbacksImplementation.prototype, "onHiddenChanged", null);
    __decorate([
        profiling_1.profile
    ], FragmentCallbacksImplementation.prototype, "onCreateAnimator", null);
    __decorate([
        profiling_1.profile
    ], FragmentCallbacksImplementation.prototype, "onCreate", null);
    __decorate([
        profiling_1.profile
    ], FragmentCallbacksImplementation.prototype, "onCreateView", null);
    __decorate([
        profiling_1.profile
    ], FragmentCallbacksImplementation.prototype, "onSaveInstanceState", null);
    __decorate([
        profiling_1.profile
    ], FragmentCallbacksImplementation.prototype, "onDestroyView", null);
    __decorate([
        profiling_1.profile
    ], FragmentCallbacksImplementation.prototype, "onDestroy", null);
    __decorate([
        profiling_1.profile
    ], FragmentCallbacksImplementation.prototype, "onStop", null);
    __decorate([
        profiling_1.profile
    ], FragmentCallbacksImplementation.prototype, "toStringOverride", null);
    return FragmentCallbacksImplementation;
}());
var ActivityCallbacksImplementation = (function () {
    function ActivityCallbacksImplementation() {
    }
    ActivityCallbacksImplementation.prototype.getRootView = function () {
        return this._rootView;
    };
    ActivityCallbacksImplementation.prototype.onCreate = function (activity, savedInstanceState, superFunc) {
        if (frame_common_1.traceEnabled()) {
            frame_common_1.traceWrite("Activity.onCreate(" + savedInstanceState + ")", frame_common_1.traceCategories.NativeLifecycle);
        }
        var isRestart = !!savedInstanceState && exports.moduleLoaded;
        superFunc.call(activity, isRestart ? savedInstanceState : null);
        if (savedInstanceState) {
            var rootViewId = savedInstanceState.getInt(ROOT_VIEW_ID_EXTRA, -1);
            if (rootViewId !== -1 && activityRootViewsMap.has(rootViewId)) {
                this._rootView = activityRootViewsMap.get(rootViewId).get();
            }
        }
        this.setActivityContent(activity, savedInstanceState, true);
        exports.moduleLoaded = true;
    };
    ActivityCallbacksImplementation.prototype.onSaveInstanceState = function (activity, outState, superFunc) {
        superFunc.call(activity, outState);
        var rootView = this._rootView;
        if (rootView instanceof Frame) {
            outState.putInt(INTENT_EXTRA, rootView.android.frameId);
            rootView._saveFragmentsState();
        }
        outState.putInt(ROOT_VIEW_ID_EXTRA, rootView._domId);
    };
    ActivityCallbacksImplementation.prototype.onStart = function (activity, superFunc) {
        superFunc.call(activity);
        if (frame_common_1.traceEnabled()) {
            frame_common_1.traceWrite("NativeScriptActivity.onStart();", frame_common_1.traceCategories.NativeLifecycle);
        }
        var rootView = this._rootView;
        if (rootView && !rootView.isLoaded) {
            rootView.callLoaded();
        }
    };
    ActivityCallbacksImplementation.prototype.onStop = function (activity, superFunc) {
        superFunc.call(activity);
        if (frame_common_1.traceEnabled()) {
            frame_common_1.traceWrite("NativeScriptActivity.onStop();", frame_common_1.traceCategories.NativeLifecycle);
        }
        var rootView = this._rootView;
        if (rootView && rootView.isLoaded) {
            rootView.callUnloaded();
        }
    };
    ActivityCallbacksImplementation.prototype.onDestroy = function (activity, superFunc) {
        if (frame_common_1.traceEnabled()) {
            frame_common_1.traceWrite("NativeScriptActivity.onDestroy();", frame_common_1.traceCategories.NativeLifecycle);
        }
        var rootView = this._rootView;
        if (rootView) {
            rootView._tearDownUI(true);
        }
        var exitArgs = { eventName: application.exitEvent, object: application.android, android: activity };
        application.notify(exitArgs);
        superFunc.call(activity);
    };
    ActivityCallbacksImplementation.prototype.onBackPressed = function (activity, superFunc) {
        if (frame_common_1.traceEnabled()) {
            frame_common_1.traceWrite("NativeScriptActivity.onBackPressed;", frame_common_1.traceCategories.NativeLifecycle);
        }
        var args = {
            eventName: "activityBackPressed",
            object: application.android,
            activity: activity,
            cancel: false,
        };
        application.android.notify(args);
        if (args.cancel) {
            return;
        }
        var view = this._rootView;
        var callSuper = false;
        if (view instanceof Frame) {
            callSuper = !frame_common_1.goBack();
        }
        else {
            var viewArgs = {
                eventName: "activityBackPressed",
                object: view,
                activity: activity,
                cancel: false,
            };
            view.notify(viewArgs);
            if (!viewArgs.cancel && !view.onBackPressed()) {
                callSuper = true;
            }
        }
        if (callSuper) {
            superFunc.call(activity);
        }
    };
    ActivityCallbacksImplementation.prototype.onRequestPermissionsResult = function (activity, requestCode, permissions, grantResults, superFunc) {
        if (frame_common_1.traceEnabled()) {
            frame_common_1.traceWrite("NativeScriptActivity.onRequestPermissionsResult;", frame_common_1.traceCategories.NativeLifecycle);
        }
        application.android.notify({
            eventName: "activityRequestPermissions",
            object: application.android,
            activity: activity,
            requestCode: requestCode,
            permissions: permissions,
            grantResults: grantResults
        });
    };
    ActivityCallbacksImplementation.prototype.onActivityResult = function (activity, requestCode, resultCode, data, superFunc) {
        superFunc.call(activity, requestCode, resultCode, data);
        if (frame_common_1.traceEnabled()) {
            frame_common_1.traceWrite("NativeScriptActivity.onActivityResult(" + requestCode + ", " + resultCode + ", " + data + ")", frame_common_1.traceCategories.NativeLifecycle);
        }
        application.android.notify({
            eventName: "activityResult",
            object: application.android,
            activity: activity,
            requestCode: requestCode,
            resultCode: resultCode,
            intent: data
        });
    };
    ActivityCallbacksImplementation.prototype.resetActivityContent = function (activity) {
        if (this._rootView) {
            var manager = this._rootView._getFragmentManager();
            manager.executePendingTransactions();
            this._rootView._onRootViewReset();
        }
        this._rootView = null;
        this.setActivityContent(activity, null, false);
        this._rootView.callLoaded();
    };
    ActivityCallbacksImplementation.prototype.setActivityContent = function (activity, savedInstanceState, fireLaunchEvent) {
        var shouldCreateRootFrame = application.shouldCreateRootFrame();
        var rootView = this._rootView;
        if (frame_common_1.traceEnabled()) {
            frame_common_1.traceWrite("Frame.setActivityContent rootView: " + rootView + " shouldCreateRootFrame: " + shouldCreateRootFrame + " fireLaunchEvent: " + fireLaunchEvent, frame_common_1.traceCategories.NativeLifecycle);
        }
        if (!rootView) {
            var mainEntry = application.getMainEntry();
            var intent = activity.getIntent();
            if (fireLaunchEvent) {
                rootView = notifyLaunch(intent, savedInstanceState);
            }
            if (shouldCreateRootFrame) {
                var extras = intent.getExtras();
                var frameId = -1;
                if (extras) {
                    frameId = extras.getInt(INTENT_EXTRA, -1);
                }
                if (savedInstanceState && frameId < 0) {
                    frameId = savedInstanceState.getInt(INTENT_EXTRA, -1);
                }
                if (!rootView) {
                    rootView = getFrameByNumberId(frameId) || new Frame();
                }
                if (rootView instanceof Frame) {
                    rootView.navigate(mainEntry);
                }
                else {
                    throw new Error("A Frame must be used to navigate to a Page.");
                }
            }
            else {
                rootView = rootView || builder_1.createViewFromEntry(mainEntry);
            }
            this._rootView = rootView;
            activityRootViewsMap.set(rootView._domId, new WeakRef(rootView));
        }
        if (shouldCreateRootFrame) {
            rootView._setupUI(activity);
        }
        else {
            rootView._setupAsRootView(activity);
        }
        activity.setContentView(rootView.nativeViewProtected, new org.nativescript.widgets.CommonLayoutParams());
    };
    __decorate([
        profiling_1.profile
    ], ActivityCallbacksImplementation.prototype, "onCreate", null);
    __decorate([
        profiling_1.profile
    ], ActivityCallbacksImplementation.prototype, "onSaveInstanceState", null);
    __decorate([
        profiling_1.profile
    ], ActivityCallbacksImplementation.prototype, "onStart", null);
    __decorate([
        profiling_1.profile
    ], ActivityCallbacksImplementation.prototype, "onStop", null);
    __decorate([
        profiling_1.profile
    ], ActivityCallbacksImplementation.prototype, "onDestroy", null);
    __decorate([
        profiling_1.profile
    ], ActivityCallbacksImplementation.prototype, "onBackPressed", null);
    __decorate([
        profiling_1.profile
    ], ActivityCallbacksImplementation.prototype, "onRequestPermissionsResult", null);
    __decorate([
        profiling_1.profile
    ], ActivityCallbacksImplementation.prototype, "onActivityResult", null);
    return ActivityCallbacksImplementation;
}());
var notifyLaunch = profiling_1.profile("notifyLaunch", function notifyLaunch(intent, savedInstanceState) {
    var launchArgs = {
        eventName: application.launchEvent,
        object: application.android,
        android: intent, savedInstanceState: savedInstanceState
    };
    application.notify(launchArgs);
    application.notify({ eventName: "loadAppCss", object: this, cssFile: application.getCssFileName() });
    return launchArgs.root;
});
function setActivityCallbacks(activity) {
    activity[CALLBACKS] = new ActivityCallbacksImplementation();
}
exports.setActivityCallbacks = setActivityCallbacks;
function setFragmentCallbacks(fragment) {
    fragment[CALLBACKS] = new FragmentCallbacksImplementation();
}
exports.setFragmentCallbacks = setFragmentCallbacks;
//# sourceMappingURL=frame.js.map