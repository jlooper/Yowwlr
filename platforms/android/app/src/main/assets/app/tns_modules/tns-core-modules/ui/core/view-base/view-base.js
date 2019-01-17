function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var properties_1 = require("../properties");
var debug_1 = require("../../../utils/debug");
var bindable_1 = require("../bindable");
var platform_1 = require("../../../platform");
exports.isIOS = platform_1.isIOS;
exports.isAndroid = platform_1.isAndroid;
var utils_1 = require("../../../utils/utils");
exports.layout = utils_1.layout;
var style_properties_1 = require("../../styling/style-properties");
var types = require("../../../utils/types");
var color_1 = require("../../../color");
exports.Color = color_1.Color;
var profiling_1 = require("../../../profiling");
__export(require("../bindable"));
__export(require("../properties"));
var ssm = require("../../styling/style-scope");
var domNodeModule;
function ensuredomNodeModule() {
    if (!domNodeModule) {
        domNodeModule = require("../../../debugger/dom-node");
    }
}
var styleScopeModule;
function ensureStyleScopeModule() {
    if (!styleScopeModule) {
        styleScopeModule = require("ui/styling/style-scope");
    }
}
var defaultBindingSource = {};
function getAncestor(view, criterion) {
    var matcher = null;
    if (typeof criterion === "string") {
        matcher = function (view) { return view.typeName === criterion; };
    }
    else {
        matcher = function (view) { return view instanceof criterion; };
    }
    for (var parent_1 = view.parent; parent_1 != null; parent_1 = parent_1.parent) {
        if (matcher(parent_1)) {
            return parent_1;
        }
    }
    return null;
}
exports.getAncestor = getAncestor;
function getViewById(view, id) {
    if (!view) {
        return undefined;
    }
    if (view.id === id) {
        return view;
    }
    var retVal;
    var descendantsCallback = function (child) {
        if (child.id === id) {
            retVal = child;
            return false;
        }
        return true;
    };
    eachDescendant(view, descendantsCallback);
    return retVal;
}
exports.getViewById = getViewById;
function eachDescendant(view, callback) {
    if (!callback || !view) {
        return;
    }
    var continueIteration;
    var localCallback = function (child) {
        continueIteration = callback(child);
        if (continueIteration) {
            child.eachChild(localCallback);
        }
        return continueIteration;
    };
    view.eachChild(localCallback);
}
exports.eachDescendant = eachDescendant;
var viewIdCounter = 1;
var Flags;
(function (Flags) {
    Flags["superOnLoadedCalled"] = "Loaded";
    Flags["superOnUnloadedCalled"] = "Unloaded";
})(Flags || (Flags = {}));
var SuspendType;
(function (SuspendType) {
    SuspendType[SuspendType["Incremental"] = 0] = "Incremental";
    SuspendType[SuspendType["Loaded"] = 1048576] = "Loaded";
    SuspendType[SuspendType["NativeView"] = 2097152] = "NativeView";
    SuspendType[SuspendType["UISetup"] = 4194304] = "UISetup";
    SuspendType[SuspendType["IncrementalCountMask"] = -7340033] = "IncrementalCountMask";
})(SuspendType || (SuspendType = {}));
(function (SuspendType) {
    function toString(type) {
        return (type ? "suspended" : "resumed") + "(" +
            "Incremental: " + (type & SuspendType.IncrementalCountMask) + ", " +
            "Loaded: " + !(type & SuspendType.Loaded) + ", " +
            "NativeView: " + !(type & SuspendType.NativeView) + ", " +
            "UISetup: " + !(type & SuspendType.UISetup) +
            ")";
    }
    SuspendType.toString = toString;
})(SuspendType || (SuspendType = {}));
var ViewBase = (function (_super) {
    __extends(ViewBase, _super);
    function ViewBase() {
        var _this = _super.call(this) || this;
        _this._onLoadedCalled = false;
        _this._onUnloadedCalled = false;
        _this._cssState = new ssm.CssState(_this);
        _this.pseudoClassAliases = {
            "highlighted": [
                "active",
                "pressed"
            ]
        };
        _this.cssClasses = new Set();
        _this.cssPseudoClasses = new Set();
        _this._domId = viewIdCounter++;
        _this._style = new properties_1.Style(_this);
        return _this;
    }
    Object.defineProperty(ViewBase.prototype, "parentNode", {
        get: function () {
            return this._templateParent || this.parent;
        },
        set: function (node) {
            this._templateParent = node;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewBase.prototype, "nativeView", {
        get: function () {
            return this.nativeViewProtected;
        },
        set: function (value) {
            this.setNativeView(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewBase.prototype, "typeName", {
        get: function () {
            return types.getClass(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewBase.prototype, "style", {
        get: function () {
            return this._style;
        },
        set: function (inlineStyle) {
            if (typeof inlineStyle === "string") {
                this.setInlineStyle(inlineStyle);
            }
            else {
                throw new Error("View.style property is read-only.");
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewBase.prototype, "android", {
        get: function () {
            return this._androidView;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewBase.prototype, "ios", {
        get: function () {
            return this._iosView;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewBase.prototype, "isLoaded", {
        get: function () {
            return this._isLoaded;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewBase.prototype, "class", {
        get: function () {
            return this.className;
        },
        set: function (v) {
            this.className = v;
        },
        enumerable: true,
        configurable: true
    });
    ViewBase.prototype.getViewById = function (id) {
        return getViewById(this, id);
    };
    Object.defineProperty(ViewBase.prototype, "page", {
        get: function () {
            if (this.parent) {
                return this.parent.page;
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    ViewBase.prototype.ensureDomNode = function () {
        if (!this.domNode) {
            ensuredomNodeModule();
            this.domNode = new domNodeModule.DOMNode(this);
        }
    };
    ViewBase.prototype.set = function (name, value) {
        this[name] = bindable_1.WrappedValue.unwrap(value);
    };
    ViewBase.prototype.onLoaded = function () {
        var _this = this;
        this.setFlag(Flags.superOnLoadedCalled, true);
        if (this._isLoaded) {
            return;
        }
        this._isLoaded = true;
        this._cssState.onLoaded();
        this._resumeNativeUpdates(SuspendType.Loaded);
        this.eachChild(function (child) {
            _this.loadView(child);
            return true;
        });
        this._emit("loaded");
    };
    ViewBase.prototype.onUnloaded = function () {
        var _this = this;
        this.setFlag(Flags.superOnUnloadedCalled, true);
        if (!this._isLoaded) {
            return;
        }
        this._suspendNativeUpdates(SuspendType.Loaded);
        this.eachChild(function (child) {
            _this.unloadView(child);
            return true;
        });
        this._isLoaded = false;
        this._cssState.onUnloaded();
        this._emit("unloaded");
    };
    ViewBase.prototype._suspendNativeUpdates = function (type) {
        if (type) {
            this._suspendNativeUpdatesCount = this._suspendNativeUpdatesCount | type;
        }
        else {
            this._suspendNativeUpdatesCount++;
        }
    };
    ViewBase.prototype._resumeNativeUpdates = function (type) {
        if (type) {
            this._suspendNativeUpdatesCount = this._suspendNativeUpdatesCount & ~type;
        }
        else {
            if ((this._suspendNativeUpdatesCount & SuspendType.IncrementalCountMask) === 0) {
                throw new Error("Invalid call to " + this + "._resumeNativeUpdates");
            }
            this._suspendNativeUpdatesCount--;
        }
        if (!this._suspendNativeUpdatesCount) {
            this.onResumeNativeUpdates();
        }
    };
    ViewBase.prototype._batchUpdate = function (callback) {
        try {
            this._suspendNativeUpdates(SuspendType.Incremental);
            return callback();
        }
        finally {
            this._resumeNativeUpdates(SuspendType.Incremental);
        }
    };
    ViewBase.prototype.setFlag = function (flag, value) {
        switch (flag) {
            case Flags.superOnLoadedCalled:
                this._onLoadedCalled = value;
                break;
            case Flags.superOnUnloadedCalled:
                this._onUnloadedCalled = value;
                break;
        }
    };
    ViewBase.prototype.isFlagSet = function (flag) {
        switch (flag) {
            case Flags.superOnLoadedCalled:
                return this._onLoadedCalled;
            case Flags.superOnUnloadedCalled:
                return this._onUnloadedCalled;
        }
    };
    ViewBase.prototype.callFunctionWithSuper = function (flag, func) {
        this.setFlag(flag, false);
        func();
        if (!this.isFlagSet(flag)) {
            throw new Error("super." + flag + " not called in " + this);
        }
    };
    ViewBase.prototype.callLoaded = function () {
        var _this = this;
        this.callFunctionWithSuper(Flags.superOnLoadedCalled, function () { return _this.onLoaded(); });
    };
    ViewBase.prototype.callUnloaded = function () {
        var _this = this;
        this.callFunctionWithSuper(Flags.superOnUnloadedCalled, function () { return _this.onUnloaded(); });
    };
    ViewBase.prototype.notifyPseudoClassChanged = function (pseudoClass) {
        this.notify({ eventName: ":" + pseudoClass, object: this });
    };
    ViewBase.prototype.getAllAliasedStates = function (name) {
        var allStates = [];
        allStates.push(name);
        if (name in this.pseudoClassAliases) {
            for (var i = 0; i < this.pseudoClassAliases[name].length; i++) {
                allStates.push(this.pseudoClassAliases[name][i]);
            }
        }
        return allStates;
    };
    ViewBase.prototype.addPseudoClass = function (name) {
        var allStates = this.getAllAliasedStates(name);
        for (var i = 0; i < allStates.length; i++) {
            if (!this.cssPseudoClasses.has(allStates[i])) {
                this.cssPseudoClasses.add(allStates[i]);
                this.notifyPseudoClassChanged(allStates[i]);
            }
        }
    };
    ViewBase.prototype.deletePseudoClass = function (name) {
        var allStates = this.getAllAliasedStates(name);
        for (var i = 0; i < allStates.length; i++) {
            if (this.cssPseudoClasses.has(allStates[i])) {
                this.cssPseudoClasses.delete(allStates[i]);
                this.notifyPseudoClassChanged(allStates[i]);
            }
        }
    };
    ViewBase.prototype.bindingContextChanged = function (data) {
        this.bindings.get("bindingContext").bind(data.value);
    };
    ViewBase.prototype.bind = function (options, source) {
        if (source === void 0) { source = defaultBindingSource; }
        var targetProperty = options.targetProperty;
        this.unbind(targetProperty);
        if (!this.bindings) {
            this.bindings = new Map();
        }
        var binding = new bindable_1.Binding(this, options);
        this.bindings.set(targetProperty, binding);
        var bindingSource = source;
        if (bindingSource === defaultBindingSource) {
            bindingSource = this.bindingContext;
            binding.sourceIsBindingContext = true;
            if (targetProperty === "bindingContext") {
                this.bindingContextBoundToParentBindingContextChanged = true;
                var parent_2 = this.parent;
                if (parent_2) {
                    parent_2.on("bindingContextChange", this.bindingContextChanged, this);
                }
                else {
                    this.shouldAddHandlerToParentBindingContextChanged = true;
                }
            }
        }
        binding.bind(bindingSource);
    };
    ViewBase.prototype.unbind = function (property) {
        var bindings = this.bindings;
        if (!bindings) {
            return;
        }
        var binding = bindings.get(property);
        if (binding) {
            binding.unbind();
            bindings.delete(property);
            if (binding.sourceIsBindingContext) {
                if (property === "bindingContext") {
                    this.shouldAddHandlerToParentBindingContextChanged = false;
                    this.bindingContextBoundToParentBindingContextChanged = false;
                    var parent_3 = this.parent;
                    if (parent_3) {
                        parent_3.off("bindingContextChange", this.bindingContextChanged, this);
                    }
                }
            }
        }
    };
    ViewBase.prototype.requestLayout = function () {
        var parent = this.parent;
        if (parent) {
            parent.requestLayout();
        }
    };
    ViewBase.prototype.eachChild = function (callback) {
    };
    ViewBase.prototype._addView = function (view, atIndex) {
        if (bindable_1.traceEnabled()) {
            bindable_1.traceWrite(this + "._addView(" + view + ", " + atIndex + ")", bindable_1.traceCategories.ViewHierarchy);
        }
        if (!view) {
            throw new Error("Expecting a valid View instance.");
        }
        if (!(view instanceof ViewBase)) {
            throw new Error(view + " is not a valid View instance.");
        }
        if (view.parent) {
            throw new Error("View already has a parent. View: " + view + " Parent: " + view.parent);
        }
        view.parent = this;
        this._addViewCore(view, atIndex);
        view._parentChanged(null);
        if (this.domNode) {
            this.domNode.onChildAdded(view);
        }
    };
    ViewBase.prototype._addViewCore = function (view, atIndex) {
        properties_1.propagateInheritableProperties(this, view);
        view._inheritStyleScope(this._styleScope);
        properties_1.propagateInheritableCssProperties(this.style, view.style);
        if (this._context) {
            view._setupUI(this._context, atIndex);
        }
        if (this._isLoaded) {
            this.loadView(view);
        }
    };
    ViewBase.prototype.loadView = function (view) {
        if (view && !view.isLoaded) {
            view.callLoaded();
        }
    };
    ViewBase.prototype.unloadView = function (view) {
        if (view && view.isLoaded) {
            view.callUnloaded();
        }
    };
    ViewBase.prototype._removeView = function (view) {
        if (bindable_1.traceEnabled()) {
            bindable_1.traceWrite(this + "._removeView(" + view + ")", bindable_1.traceCategories.ViewHierarchy);
        }
        if (view.parent !== this) {
            throw new Error("View not added to this instance. View: " + view + " CurrentParent: " + view.parent + " ExpectedParent: " + this);
        }
        if (this.domNode) {
            this.domNode.onChildRemoved(view);
        }
        this._removeViewCore(view);
        view.parent = undefined;
        view._parentChanged(this);
    };
    ViewBase.prototype._removeViewCore = function (view) {
        this.unloadView(view);
        if (view._context) {
            view._tearDownUI();
        }
    };
    ViewBase.prototype.createNativeView = function () {
        return undefined;
    };
    ViewBase.prototype.disposeNativeView = function () {
    };
    ViewBase.prototype.initNativeView = function () {
    };
    ViewBase.prototype.resetNativeView = function () {
    };
    ViewBase.prototype.resetNativeViewInternal = function () {
    };
    ViewBase.prototype._setupAsRootView = function (context) {
        this._setupUI(context);
    };
    ViewBase.prototype._setupUI = function (context, atIndex, parentIsLoaded) {
        if (this._context === context) {
            return;
        }
        else if (this._context) {
            this._tearDownUI(true);
        }
        this._context = context;
        var nativeView = this.nativeViewProtected;
        if (!nativeView) {
            nativeView = this.createNativeView();
        }
        if (platform_1.isAndroid) {
            this._androidView = nativeView;
            if (nativeView) {
                if (this._isPaddingRelative === undefined) {
                    this._isPaddingRelative = nativeView.isPaddingRelative();
                }
                var result = nativeView.defaultPaddings;
                if (result === undefined) {
                    result = org.nativescript.widgets.ViewHelper.getPadding(nativeView);
                    nativeView.defaultPaddings = result;
                }
                this._defaultPaddingTop = result.top;
                this._defaultPaddingRight = result.right;
                this._defaultPaddingBottom = result.bottom;
                this._defaultPaddingLeft = result.left;
                var style = this.style;
                if (!style_properties_1.paddingTopProperty.isSet(style)) {
                    this.effectivePaddingTop = this._defaultPaddingTop;
                }
                if (!style_properties_1.paddingRightProperty.isSet(style)) {
                    this.effectivePaddingRight = this._defaultPaddingRight;
                }
                if (!style_properties_1.paddingBottomProperty.isSet(style)) {
                    this.effectivePaddingBottom = this._defaultPaddingBottom;
                }
                if (!style_properties_1.paddingLeftProperty.isSet(style)) {
                    this.effectivePaddingLeft = this._defaultPaddingLeft;
                }
            }
        }
        else {
            this._iosView = nativeView;
        }
        this.setNativeView(nativeView);
        if (this.parent) {
            var nativeIndex = this.parent._childIndexToNativeChildIndex(atIndex);
            this._isAddedToNativeVisualTree = this.parent._addViewToNativeVisualTree(this, nativeIndex);
        }
        this._resumeNativeUpdates(SuspendType.UISetup);
        this.eachChild(function (child) {
            child._setupUI(context);
            return true;
        });
    };
    ViewBase.prototype.setNativeView = function (value) {
        if (this.__nativeView === value) {
            return;
        }
        if (this.__nativeView) {
            this._suspendNativeUpdates(SuspendType.NativeView);
        }
        this.__nativeView = this.nativeViewProtected = value;
        if (this.__nativeView) {
            this._suspendedUpdates = undefined;
            this.initNativeView();
            this._resumeNativeUpdates(SuspendType.NativeView);
        }
    };
    ViewBase.prototype._tearDownUI = function (force) {
        if (!this._context) {
            return;
        }
        this.resetNativeViewInternal();
        this.eachChild(function (child) {
            child._tearDownUI(force);
            return true;
        });
        if (this.parent) {
            this.parent._removeViewFromNativeVisualTree(this);
        }
        this.disposeNativeView();
        this._suspendNativeUpdates(SuspendType.UISetup);
        if (platform_1.isAndroid) {
            this.setNativeView(null);
            this._androidView = null;
        }
        this._context = null;
        if (this.domNode) {
            this.domNode.dispose();
            this.domNode = undefined;
        }
    };
    ViewBase.prototype._childIndexToNativeChildIndex = function (index) {
        return index;
    };
    ViewBase.prototype._addViewToNativeVisualTree = function (view, atIndex) {
        if (view._isAddedToNativeVisualTree) {
            throw new Error("Child already added to the native visual tree.");
        }
        return true;
    };
    ViewBase.prototype._removeViewFromNativeVisualTree = function (view) {
        view._isAddedToNativeVisualTree = false;
    };
    ViewBase.prototype._goToVisualState = function (state) {
        if (bindable_1.traceEnabled()) {
            bindable_1.traceWrite(this + " going to state: " + state, bindable_1.traceCategories.Style);
        }
        if (state === this._visualState) {
            return;
        }
        this.deletePseudoClass(this._visualState);
        this._visualState = state;
        this.addPseudoClass(state);
    };
    ViewBase.prototype._applyXmlAttribute = function (attribute, value) {
        if (attribute === "style" || attribute === "rows" || attribute === "columns" || attribute === "fontAttributes") {
            this[attribute] = value;
            return true;
        }
        return false;
    };
    ViewBase.prototype.setInlineStyle = function (style) {
        if (typeof style !== "string") {
            throw new Error("Parameter should be valid CSS string!");
        }
        ensureStyleScopeModule();
        styleScopeModule.applyInlineStyle(this, style);
    };
    ViewBase.prototype._parentChanged = function (oldParent) {
        var newParent = this.parent;
        if (oldParent) {
            properties_1.clearInheritedProperties(this);
            if (this.bindingContextBoundToParentBindingContextChanged) {
                oldParent.off("bindingContextChange", this.bindingContextChanged, this);
            }
        }
        else if (this.shouldAddHandlerToParentBindingContextChanged) {
            newParent.on("bindingContextChange", this.bindingContextChanged, this);
            this.bindings.get("bindingContext").bind(newParent.bindingContext);
        }
    };
    ViewBase.prototype.onResumeNativeUpdates = function () {
        properties_1.initNativeView(this);
    };
    ViewBase.prototype.toString = function () {
        var str = this.typeName;
        if (this.id) {
            str += "<" + this.id + ">";
        }
        else {
            str += "(" + this._domId + ")";
        }
        var source = debug_1.Source.get(this);
        if (source) {
            str += "@" + source + ";";
        }
        return str;
    };
    ViewBase.prototype._onCssStateChange = function () {
        this._cssState.onChange();
        eachDescendant(this, function (child) {
            child._cssState.onChange();
            return true;
        });
    };
    ViewBase.prototype._inheritStyleScope = function (styleScope) {
        if (this._isStyleScopeHost) {
            return;
        }
        if (this._styleScope !== styleScope) {
            this._styleScope = styleScope;
            this._onCssStateChange();
            this.eachChild(function (child) {
                child._inheritStyleScope(styleScope);
                return true;
            });
        }
    };
    ViewBase.prototype.showModal = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var parent = this.parent;
        return parent && parent.showModal.apply(parent, args);
    };
    ViewBase.prototype.closeModal = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var parent = this.parent;
        if (parent) {
            parent.closeModal.apply(parent, args);
        }
    };
    ViewBase.prototype._dialogClosed = function () {
        eachDescendant(this, function (child) {
            child._dialogClosed();
            return true;
        });
    };
    ViewBase.prototype._onRootViewReset = function () {
        eachDescendant(this, function (child) {
            child._onRootViewReset();
            return true;
        });
    };
    ViewBase.loadedEvent = "loaded";
    ViewBase.unloadedEvent = "unloaded";
    __decorate([
        profiling_1.profile
    ], ViewBase.prototype, "onLoaded", null);
    __decorate([
        profiling_1.profile
    ], ViewBase.prototype, "onUnloaded", null);
    __decorate([
        profiling_1.profile
    ], ViewBase.prototype, "addPseudoClass", null);
    __decorate([
        profiling_1.profile
    ], ViewBase.prototype, "deletePseudoClass", null);
    __decorate([
        profiling_1.profile
    ], ViewBase.prototype, "requestLayout", null);
    __decorate([
        profiling_1.profile
    ], ViewBase.prototype, "_addView", null);
    __decorate([
        profiling_1.profile
    ], ViewBase.prototype, "_setupUI", null);
    __decorate([
        profiling_1.profile
    ], ViewBase.prototype, "_tearDownUI", null);
    return ViewBase;
}(bindable_1.Observable));
exports.ViewBase = ViewBase;
ViewBase.prototype.isCollapsed = false;
ViewBase.prototype._oldLeft = 0;
ViewBase.prototype._oldTop = 0;
ViewBase.prototype._oldRight = 0;
ViewBase.prototype._oldBottom = 0;
ViewBase.prototype.effectiveMinWidth = 0;
ViewBase.prototype.effectiveMinHeight = 0;
ViewBase.prototype.effectiveWidth = 0;
ViewBase.prototype.effectiveHeight = 0;
ViewBase.prototype.effectiveMarginTop = 0;
ViewBase.prototype.effectiveMarginRight = 0;
ViewBase.prototype.effectiveMarginBottom = 0;
ViewBase.prototype.effectiveMarginLeft = 0;
ViewBase.prototype.effectivePaddingTop = 0;
ViewBase.prototype.effectivePaddingRight = 0;
ViewBase.prototype.effectivePaddingBottom = 0;
ViewBase.prototype.effectivePaddingLeft = 0;
ViewBase.prototype.effectiveBorderTopWidth = 0;
ViewBase.prototype.effectiveBorderRightWidth = 0;
ViewBase.prototype.effectiveBorderBottomWidth = 0;
ViewBase.prototype.effectiveBorderLeftWidth = 0;
ViewBase.prototype._defaultPaddingTop = 0;
ViewBase.prototype._defaultPaddingRight = 0;
ViewBase.prototype._defaultPaddingBottom = 0;
ViewBase.prototype._defaultPaddingLeft = 0;
ViewBase.prototype._isViewBase = true;
ViewBase.prototype.recycleNativeView = "never";
ViewBase.prototype._suspendNativeUpdatesCount =
    SuspendType.Loaded |
        SuspendType.NativeView |
        SuspendType.UISetup;
exports.bindingContextProperty = new properties_1.InheritedProperty({ name: "bindingContext" });
exports.bindingContextProperty.register(ViewBase);
exports.classNameProperty = new properties_1.Property({
    name: "className",
    valueChanged: function (view, oldValue, newValue) {
        var classes = view.cssClasses;
        classes.clear();
        if (typeof newValue === "string") {
            newValue.split(" ").forEach(function (c) { return classes.add(c); });
        }
        view._onCssStateChange();
    }
});
exports.classNameProperty.register(ViewBase);
exports.idProperty = new properties_1.Property({ name: "id", valueChanged: function (view, oldValue, newValue) { return view._onCssStateChange(); } });
exports.idProperty.register(ViewBase);
function booleanConverter(v) {
    var lowercase = (v + "").toLowerCase();
    if (lowercase === "true") {
        return true;
    }
    else if (lowercase === "false") {
        return false;
    }
    throw new Error("Invalid boolean: " + v);
}
exports.booleanConverter = booleanConverter;
//# sourceMappingURL=view-base.js.map