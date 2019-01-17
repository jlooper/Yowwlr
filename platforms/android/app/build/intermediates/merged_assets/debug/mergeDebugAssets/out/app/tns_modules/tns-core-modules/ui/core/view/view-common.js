function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var view_base_1 = require("../view-base");
var style_properties_1 = require("../../styling/style-properties");
var gestures_1 = require("../../gestures");
var builder_1 = require("../../builder");
var style_scope_1 = require("../../styling/style-scope");
var linear_gradient_1 = require("../../styling/linear-gradient");
exports.LinearGradient = linear_gradient_1.LinearGradient;
__export(require("../../styling/style-properties"));
__export(require("../view-base"));
var animationModule;
function ensureAnimationModule() {
    if (!animationModule) {
        animationModule = require("ui/animation");
    }
}
function CSSType(type) {
    return function (cls) {
        cls.prototype.cssType = type;
    };
}
exports.CSSType = CSSType;
function PseudoClassHandler() {
    var pseudoClasses = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        pseudoClasses[_i] = arguments[_i];
    }
    var stateEventNames = pseudoClasses.map(function (s) { return ":" + s; });
    var listeners = Symbol("listeners");
    return function (target, propertyKey, descriptor) {
        function update(change) {
            var prev = this[listeners] || 0;
            var next = prev + change;
            if (prev <= 0 && next > 0) {
                this[propertyKey](true);
            }
            else if (prev > 0 && next <= 0) {
                this[propertyKey](false);
            }
        }
        stateEventNames.forEach(function (s) { return target[s] = update; });
    };
}
exports.PseudoClassHandler = PseudoClassHandler;
exports._rootModalViews = new Array();
var ViewCommon = (function (_super) {
    __extends(ViewCommon, _super);
    function ViewCommon() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._gestureObservers = {};
        return _this;
    }
    Object.defineProperty(ViewCommon.prototype, "css", {
        get: function () {
            var scope = this._styleScope;
            return scope && scope.css;
        },
        set: function (value) {
            this._updateStyleScope(undefined, undefined, value);
        },
        enumerable: true,
        configurable: true
    });
    ViewCommon.prototype.addCss = function (cssString) {
        this._updateStyleScope(undefined, cssString);
    };
    ViewCommon.prototype.addCssFile = function (cssFileName) {
        this._updateStyleScope(cssFileName);
    };
    ViewCommon.prototype._updateStyleScope = function (cssFileName, cssString, css) {
        var scope = this._styleScope;
        if (!scope) {
            scope = new style_scope_1.StyleScope();
            this.setScopeProperty(scope, cssFileName, cssString, css);
            this._inheritStyleScope(scope);
            this._isStyleScopeHost = true;
        }
        else {
            this.setScopeProperty(scope, cssFileName, cssString, css);
            this._onCssStateChange();
        }
    };
    ViewCommon.prototype.setScopeProperty = function (scope, cssFileName, cssString, css) {
        if (cssFileName !== undefined) {
            scope.addCssFile(cssFileName);
        }
        else if (cssString !== undefined) {
            scope.addCss(cssString);
        }
        else if (css !== undefined) {
            scope.css = css;
        }
    };
    ViewCommon.prototype._setupAsRootView = function (context) {
        _super.prototype._setupAsRootView.call(this, context);
        if (!this._styleScope) {
            this._updateStyleScope();
        }
    };
    ViewCommon.prototype.observe = function (type, callback, thisArg) {
        if (!this._gestureObservers[type]) {
            this._gestureObservers[type] = [];
        }
        this._gestureObservers[type].push(gestures_1.observe(this, type, callback, thisArg));
    };
    ViewCommon.prototype.getGestureObservers = function (type) {
        return this._gestureObservers[type];
    };
    ViewCommon.prototype.addEventListener = function (arg, callback, thisArg) {
        if (typeof arg === "string") {
            arg = view_base_1.getEventOrGestureName(arg);
            var gesture = gestures_1.fromString(arg);
            if (gesture && !this._isEvent(arg)) {
                this.observe(gesture, callback, thisArg);
            }
            else {
                var events = (arg).split(",");
                if (events.length > 0) {
                    for (var i = 0; i < events.length; i++) {
                        var evt = events[i].trim();
                        var gst = gestures_1.fromString(evt);
                        if (gst && !this._isEvent(arg)) {
                            this.observe(gst, callback, thisArg);
                        }
                        else {
                            _super.prototype.addEventListener.call(this, evt, callback, thisArg);
                        }
                    }
                }
                else {
                    _super.prototype.addEventListener.call(this, arg, callback, thisArg);
                }
            }
        }
        else if (typeof arg === "number") {
            this.observe(arg, callback, thisArg);
        }
    };
    ViewCommon.prototype.removeEventListener = function (arg, callback, thisArg) {
        if (typeof arg === "string") {
            var gesture = gestures_1.fromString(arg);
            if (gesture && !this._isEvent(arg)) {
                this._disconnectGestureObservers(gesture);
            }
            else {
                var events = arg.split(",");
                if (events.length > 0) {
                    for (var i = 0; i < events.length; i++) {
                        var evt = events[i].trim();
                        var gst = gestures_1.fromString(evt);
                        if (gst && !this._isEvent(arg)) {
                            this._disconnectGestureObservers(gst);
                        }
                        else {
                            _super.prototype.removeEventListener.call(this, evt, callback, thisArg);
                        }
                    }
                }
                else {
                    _super.prototype.removeEventListener.call(this, arg, callback, thisArg);
                }
            }
        }
        else if (typeof arg === "number") {
            this._disconnectGestureObservers(arg);
        }
    };
    ViewCommon.prototype._onLivesync = function () {
        exports._rootModalViews.forEach(function (v) { return v.closeModal(); });
        exports._rootModalViews.length = 0;
        return false;
    };
    ViewCommon.prototype.onBackPressed = function () {
        return false;
    };
    ViewCommon.prototype._getFragmentManager = function () {
        return undefined;
    };
    ViewCommon.prototype.getModalOptions = function (args) {
        if (args.length === 0) {
            throw new Error("showModal without parameters is deprecated. Please call showModal on a view instance instead.");
        }
        else {
            var options = null;
            if (args.length === 2) {
                options = args[1];
            }
            else {
                options = {
                    context: args[1],
                    closeCallback: args[2],
                    fullscreen: args[3],
                    animated: args[4],
                    stretched: args[5]
                };
            }
            var firstArgument = args[0];
            var view = firstArgument instanceof ViewCommon
                ? firstArgument : builder_1.createViewFromEntry({ moduleName: firstArgument });
            return { view: view, options: options };
        }
    };
    ViewCommon.prototype.showModal = function () {
        var _a = this.getModalOptions(arguments), view = _a.view, options = _a.options;
        view._showNativeModalView(this, options);
        return view;
    };
    ViewCommon.prototype.closeModal = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var closeCallback = this._closeModalCallback;
        if (closeCallback) {
            closeCallback.apply(undefined, arguments);
        }
        else {
            var parent_1 = this.parent;
            if (parent_1) {
                parent_1.closeModal.apply(parent_1, args);
            }
        }
    };
    Object.defineProperty(ViewCommon.prototype, "modal", {
        get: function () {
            return this._modal;
        },
        enumerable: true,
        configurable: true
    });
    ViewCommon.prototype._showNativeModalView = function (parent, options) {
        exports._rootModalViews.push(this);
        parent._modal = this;
        this._modalParent = parent;
        this._modalContext = options.context;
        var that = this;
        this._closeModalCallback = function () {
            var originalArgs = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                originalArgs[_i] = arguments[_i];
            }
            if (that._closeModalCallback) {
                var modalIndex = exports._rootModalViews.indexOf(that);
                exports._rootModalViews.splice(modalIndex);
                that._modalParent = null;
                that._modalContext = null;
                that._closeModalCallback = null;
                that._dialogClosed();
                parent._modal = null;
                var whenClosedCallback = function () {
                    if (typeof options.closeCallback === "function") {
                        options.closeCallback.apply(undefined, originalArgs);
                    }
                };
                that._hideNativeModalView(parent, whenClosedCallback);
            }
        };
    };
    ViewCommon.prototype._raiseLayoutChangedEvent = function () {
        var args = {
            eventName: ViewCommon.layoutChangedEvent,
            object: this
        };
        this.notify(args);
    };
    ViewCommon.prototype._raiseShownModallyEvent = function () {
        var args = {
            eventName: ViewCommon.shownModallyEvent,
            object: this,
            context: this._modalContext,
            closeCallback: this._closeModalCallback
        };
        this.notify(args);
    };
    ViewCommon.prototype._raiseShowingModallyEvent = function () {
        var args = {
            eventName: ViewCommon.showingModallyEvent,
            object: this,
            context: this._modalContext,
            closeCallback: this._closeModalCallback
        };
        this.notify(args);
    };
    ViewCommon.prototype._isEvent = function (name) {
        return this.constructor && name + "Event" in this.constructor;
    };
    ViewCommon.prototype._disconnectGestureObservers = function (type) {
        var observers = this.getGestureObservers(type);
        if (observers) {
            for (var i = 0; i < observers.length; i++) {
                observers[i].disconnect();
            }
        }
    };
    Object.defineProperty(ViewCommon.prototype, "borderColor", {
        get: function () {
            return this.style.borderColor;
        },
        set: function (value) {
            this.style.borderColor = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "borderTopColor", {
        get: function () {
            return this.style.borderTopColor;
        },
        set: function (value) {
            this.style.borderTopColor = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "borderRightColor", {
        get: function () {
            return this.style.borderRightColor;
        },
        set: function (value) {
            this.style.borderRightColor = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "borderBottomColor", {
        get: function () {
            return this.style.borderBottomColor;
        },
        set: function (value) {
            this.style.borderBottomColor = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "borderLeftColor", {
        get: function () {
            return this.style.borderLeftColor;
        },
        set: function (value) {
            this.style.borderLeftColor = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "borderWidth", {
        get: function () {
            return this.style.borderWidth;
        },
        set: function (value) {
            this.style.borderWidth = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "borderTopWidth", {
        get: function () {
            return this.style.borderTopWidth;
        },
        set: function (value) {
            this.style.borderTopWidth = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "borderRightWidth", {
        get: function () {
            return this.style.borderRightWidth;
        },
        set: function (value) {
            this.style.borderRightWidth = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "borderBottomWidth", {
        get: function () {
            return this.style.borderBottomWidth;
        },
        set: function (value) {
            this.style.borderBottomWidth = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "borderLeftWidth", {
        get: function () {
            return this.style.borderLeftWidth;
        },
        set: function (value) {
            this.style.borderLeftWidth = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "borderRadius", {
        get: function () {
            return this.style.borderRadius;
        },
        set: function (value) {
            this.style.borderRadius = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "borderTopLeftRadius", {
        get: function () {
            return this.style.borderTopLeftRadius;
        },
        set: function (value) {
            this.style.borderTopLeftRadius = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "borderTopRightRadius", {
        get: function () {
            return this.style.borderTopRightRadius;
        },
        set: function (value) {
            this.style.borderTopRightRadius = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "borderBottomRightRadius", {
        get: function () {
            return this.style.borderBottomRightRadius;
        },
        set: function (value) {
            this.style.borderBottomRightRadius = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "borderBottomLeftRadius", {
        get: function () {
            return this.style.borderBottomLeftRadius;
        },
        set: function (value) {
            this.style.borderBottomLeftRadius = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "color", {
        get: function () {
            return this.style.color;
        },
        set: function (value) {
            this.style.color = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "background", {
        get: function () {
            return this.style.background;
        },
        set: function (value) {
            this.style.background = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "backgroundColor", {
        get: function () {
            return this.style.backgroundColor;
        },
        set: function (value) {
            this.style.backgroundColor = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "backgroundImage", {
        get: function () {
            return this.style.backgroundImage;
        },
        set: function (value) {
            this.style.backgroundImage = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "minWidth", {
        get: function () {
            return this.style.minWidth;
        },
        set: function (value) {
            this.style.minWidth = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "minHeight", {
        get: function () {
            return this.style.minHeight;
        },
        set: function (value) {
            this.style.minHeight = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "width", {
        get: function () {
            return this.style.width;
        },
        set: function (value) {
            this.style.width = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "height", {
        get: function () {
            return this.style.height;
        },
        set: function (value) {
            this.style.height = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "margin", {
        get: function () {
            return this.style.margin;
        },
        set: function (value) {
            this.style.margin = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "marginLeft", {
        get: function () {
            return this.style.marginLeft;
        },
        set: function (value) {
            this.style.marginLeft = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "marginTop", {
        get: function () {
            return this.style.marginTop;
        },
        set: function (value) {
            this.style.marginTop = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "marginRight", {
        get: function () {
            return this.style.marginRight;
        },
        set: function (value) {
            this.style.marginRight = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "marginBottom", {
        get: function () {
            return this.style.marginBottom;
        },
        set: function (value) {
            this.style.marginBottom = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "horizontalAlignment", {
        get: function () {
            return this.style.horizontalAlignment;
        },
        set: function (value) {
            this.style.horizontalAlignment = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "verticalAlignment", {
        get: function () {
            return this.style.verticalAlignment;
        },
        set: function (value) {
            this.style.verticalAlignment = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "visibility", {
        get: function () {
            return this.style.visibility;
        },
        set: function (value) {
            this.style.visibility = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "opacity", {
        get: function () {
            return this.style.opacity;
        },
        set: function (value) {
            this.style.opacity = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "rotate", {
        get: function () {
            return this.style.rotate;
        },
        set: function (value) {
            this.style.rotate = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "translateX", {
        get: function () {
            return this.style.translateX;
        },
        set: function (value) {
            this.style.translateX = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "translateY", {
        get: function () {
            return this.style.translateY;
        },
        set: function (value) {
            this.style.translateY = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "scaleX", {
        get: function () {
            return this.style.scaleX;
        },
        set: function (value) {
            this.style.scaleX = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "scaleY", {
        get: function () {
            return this.style.scaleY;
        },
        set: function (value) {
            this.style.scaleY = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "isLayoutValid", {
        get: function () {
            return this._isLayoutValid;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "cssType", {
        get: function () {
            if (!this._cssType) {
                this._cssType = this.typeName.toLowerCase();
            }
            return this._cssType;
        },
        set: function (type) {
            this._cssType = type.toLowerCase();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "isLayoutRequired", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    ViewCommon.prototype.measure = function (widthMeasureSpec, heightMeasureSpec) {
        this._setCurrentMeasureSpecs(widthMeasureSpec, heightMeasureSpec);
    };
    ViewCommon.prototype.layout = function (left, top, right, bottom) {
        this._setCurrentLayoutBounds(left, top, right, bottom);
    };
    ViewCommon.prototype.getMeasuredWidth = function () {
        return this._measuredWidth & view_base_1.layout.MEASURED_SIZE_MASK || 0;
    };
    ViewCommon.prototype.getMeasuredHeight = function () {
        return this._measuredHeight & view_base_1.layout.MEASURED_SIZE_MASK || 0;
    };
    ViewCommon.prototype.getMeasuredState = function () {
        return (this._measuredWidth & view_base_1.layout.MEASURED_STATE_MASK)
            | ((this._measuredHeight >> view_base_1.layout.MEASURED_HEIGHT_STATE_SHIFT)
                & (view_base_1.layout.MEASURED_STATE_MASK >> view_base_1.layout.MEASURED_HEIGHT_STATE_SHIFT));
    };
    ViewCommon.prototype.setMeasuredDimension = function (measuredWidth, measuredHeight) {
        this._measuredWidth = measuredWidth;
        this._measuredHeight = measuredHeight;
        if (view_base_1.traceEnabled()) {
            view_base_1.traceWrite(this + " :setMeasuredDimension: " + measuredWidth + ", " + measuredHeight, view_base_1.traceCategories.Layout);
        }
    };
    ViewCommon.prototype.requestLayout = function () {
        this._isLayoutValid = false;
        _super.prototype.requestLayout.call(this);
    };
    ViewCommon.resolveSizeAndState = function (size, specSize, specMode, childMeasuredState) {
        var result = size;
        switch (specMode) {
            case view_base_1.layout.UNSPECIFIED:
                result = Math.ceil(size);
                break;
            case view_base_1.layout.AT_MOST:
                if (specSize < size) {
                    result = Math.ceil(specSize) | view_base_1.layout.MEASURED_STATE_TOO_SMALL;
                }
                break;
            case view_base_1.layout.EXACTLY:
                result = Math.ceil(specSize);
                break;
        }
        return result | (childMeasuredState & view_base_1.layout.MEASURED_STATE_MASK);
    };
    ViewCommon.combineMeasuredStates = function (curState, newState) {
        return curState | newState;
    };
    ViewCommon.layoutChild = function (parent, child, left, top, right, bottom, setFrame) {
        if (setFrame === void 0) { setFrame = true; }
        if (!child || child.isCollapsed) {
            return;
        }
        var childStyle = child.style;
        var childTop;
        var childLeft;
        var childWidth = child.getMeasuredWidth();
        var childHeight = child.getMeasuredHeight();
        var effectiveMarginTop = child.effectiveMarginTop;
        var effectiveMarginBottom = child.effectiveMarginBottom;
        var vAlignment;
        if (child.effectiveHeight >= 0 && childStyle.verticalAlignment === "stretch") {
            vAlignment = "middle";
        }
        else {
            vAlignment = childStyle.verticalAlignment;
        }
        switch (vAlignment) {
            case "top":
                childTop = top + effectiveMarginTop;
                break;
            case "middle":
                childTop = top + (bottom - top - childHeight + (effectiveMarginTop - effectiveMarginBottom)) / 2;
                break;
            case "bottom":
                childTop = bottom - childHeight - effectiveMarginBottom;
                break;
            case "stretch":
            default:
                childTop = top + effectiveMarginTop;
                childHeight = bottom - top - (effectiveMarginTop + effectiveMarginBottom);
                break;
        }
        var effectiveMarginLeft = child.effectiveMarginLeft;
        var effectiveMarginRight = child.effectiveMarginRight;
        var hAlignment;
        if (child.effectiveWidth >= 0 && childStyle.horizontalAlignment === "stretch") {
            hAlignment = "center";
        }
        else {
            hAlignment = childStyle.horizontalAlignment;
        }
        switch (hAlignment) {
            case "left":
                childLeft = left + effectiveMarginLeft;
                break;
            case "center":
                childLeft = left + (right - left - childWidth + (effectiveMarginLeft - effectiveMarginRight)) / 2;
                break;
            case "right":
                childLeft = right - childWidth - effectiveMarginRight;
                break;
            case "stretch":
            default:
                childLeft = left + effectiveMarginLeft;
                childWidth = right - left - (effectiveMarginLeft + effectiveMarginRight);
                break;
        }
        var childRight = Math.round(childLeft + childWidth);
        var childBottom = Math.round(childTop + childHeight);
        childLeft = Math.round(childLeft);
        childTop = Math.round(childTop);
        if (view_base_1.traceEnabled()) {
            view_base_1.traceWrite(child.parent + " :layoutChild: " + child + " " + childLeft + ", " + childTop + ", " + childRight + ", " + childBottom, view_base_1.traceCategories.Layout);
        }
        child.layout(childLeft, childTop, childRight, childBottom, setFrame);
    };
    ViewCommon.measureChild = function (parent, child, widthMeasureSpec, heightMeasureSpec) {
        var measureWidth = 0;
        var measureHeight = 0;
        if (child && !child.isCollapsed) {
            var widthSpec = parent ? parent._currentWidthMeasureSpec : widthMeasureSpec;
            var heightSpec = parent ? parent._currentHeightMeasureSpec : heightMeasureSpec;
            var width = view_base_1.layout.getMeasureSpecSize(widthSpec);
            var widthMode = view_base_1.layout.getMeasureSpecMode(widthSpec);
            var height = view_base_1.layout.getMeasureSpecSize(heightSpec);
            var heightMode = view_base_1.layout.getMeasureSpecMode(heightSpec);
            child._updateEffectiveLayoutValues(width, widthMode, height, heightMode);
            var style = child.style;
            var horizontalMargins = child.effectiveMarginLeft + child.effectiveMarginRight;
            var verticalMargins = child.effectiveMarginTop + child.effectiveMarginBottom;
            var childWidthMeasureSpec = ViewCommon.getMeasureSpec(widthMeasureSpec, horizontalMargins, child.effectiveWidth, style.horizontalAlignment === "stretch");
            var childHeightMeasureSpec = ViewCommon.getMeasureSpec(heightMeasureSpec, verticalMargins, child.effectiveHeight, style.verticalAlignment === "stretch");
            if (view_base_1.traceEnabled()) {
                view_base_1.traceWrite(child.parent + " :measureChild: " + child + " " + view_base_1.layout.measureSpecToString(childWidthMeasureSpec) + ", " + view_base_1.layout.measureSpecToString(childHeightMeasureSpec) + "}", view_base_1.traceCategories.Layout);
            }
            child.measure(childWidthMeasureSpec, childHeightMeasureSpec);
            measureWidth = Math.round(child.getMeasuredWidth() + horizontalMargins);
            measureHeight = Math.round(child.getMeasuredHeight() + verticalMargins);
        }
        return { measuredWidth: measureWidth, measuredHeight: measureHeight };
    };
    ViewCommon.getMeasureSpec = function (parentSpec, margins, childLength, stretched) {
        var parentLength = view_base_1.layout.getMeasureSpecSize(parentSpec);
        var parentSpecMode = view_base_1.layout.getMeasureSpecMode(parentSpec);
        var resultSize;
        var resultMode;
        if (childLength >= 0) {
            resultSize = parentSpecMode === view_base_1.layout.UNSPECIFIED ? childLength : Math.min(parentLength, childLength);
            resultMode = view_base_1.layout.EXACTLY;
        }
        else {
            switch (parentSpecMode) {
                case view_base_1.layout.EXACTLY:
                    resultSize = Math.max(0, parentLength - margins);
                    resultMode = stretched ? view_base_1.layout.EXACTLY : view_base_1.layout.AT_MOST;
                    break;
                case view_base_1.layout.AT_MOST:
                    resultSize = Math.max(0, parentLength - margins);
                    resultMode = view_base_1.layout.AT_MOST;
                    break;
                case view_base_1.layout.UNSPECIFIED:
                    resultSize = 0;
                    resultMode = view_base_1.layout.UNSPECIFIED;
                    break;
            }
        }
        return view_base_1.layout.makeMeasureSpec(resultSize, resultMode);
    };
    ViewCommon.prototype._setCurrentMeasureSpecs = function (widthMeasureSpec, heightMeasureSpec) {
        var changed = this._currentWidthMeasureSpec !== widthMeasureSpec || this._currentHeightMeasureSpec !== heightMeasureSpec;
        this._currentWidthMeasureSpec = widthMeasureSpec;
        this._currentHeightMeasureSpec = heightMeasureSpec;
        return changed;
    };
    ViewCommon.prototype._getCurrentLayoutBounds = function () {
        return { left: 0, top: 0, right: 0, bottom: 0 };
    };
    ViewCommon.prototype._setCurrentLayoutBounds = function (left, top, right, bottom) {
        this._isLayoutValid = true;
        var boundsChanged = this._oldLeft !== left || this._oldTop !== top || this._oldRight !== right || this._oldBottom !== bottom;
        var sizeChanged = (this._oldRight - this._oldLeft !== right - left) || (this._oldBottom - this._oldTop !== bottom - top);
        this._oldLeft = left;
        this._oldTop = top;
        this._oldRight = right;
        this._oldBottom = bottom;
        return { boundsChanged: boundsChanged, sizeChanged: sizeChanged };
    };
    ViewCommon.prototype.eachChild = function (callback) {
        this.eachChildView(callback);
    };
    ViewCommon.prototype.eachChildView = function (callback) {
    };
    ViewCommon.prototype._getNativeViewsCount = function () {
        return this._isAddedToNativeVisualTree ? 1 : 0;
    };
    ViewCommon.prototype._eachLayoutView = function (callback) {
        return callback(this);
    };
    ViewCommon.prototype.focus = function () {
        return undefined;
    };
    ViewCommon.prototype.getSafeAreaInsets = function () {
        return { left: 0, top: 0, right: 0, bottom: 0 };
    };
    ViewCommon.prototype.getLocationInWindow = function () {
        return undefined;
    };
    ViewCommon.prototype.getLocationOnScreen = function () {
        return undefined;
    };
    ViewCommon.prototype.getLocationRelativeTo = function (otherView) {
        return undefined;
    };
    ViewCommon.prototype.getActualSize = function () {
        var currentBounds = this._getCurrentLayoutBounds();
        if (!currentBounds) {
            return undefined;
        }
        return {
            width: view_base_1.layout.toDeviceIndependentPixels(currentBounds.right - currentBounds.left),
            height: view_base_1.layout.toDeviceIndependentPixels(currentBounds.bottom - currentBounds.top),
        };
    };
    ViewCommon.prototype.animate = function (animation) {
        return this.createAnimation(animation).play();
    };
    ViewCommon.prototype.createAnimation = function (animation) {
        ensureAnimationModule();
        if (!this._localAnimations) {
            this._localAnimations = new Set();
        }
        animation.target = this;
        var anim = new animationModule.Animation([animation]);
        this._localAnimations.add(anim);
        return anim;
    };
    ViewCommon.prototype._removeAnimation = function (animation) {
        var localAnimations = this._localAnimations;
        if (localAnimations && localAnimations.has(animation)) {
            localAnimations.delete(animation);
            if (animation.isPlaying) {
                animation.cancel();
            }
            return true;
        }
        return false;
    };
    ViewCommon.prototype.resetNativeView = function () {
        var _this = this;
        if (this._localAnimations) {
            this._localAnimations.forEach(function (a) { return _this._removeAnimation(a); });
        }
        _super.prototype.resetNativeView.call(this);
    };
    ViewCommon.prototype._setNativeViewFrame = function (nativeView, frame) {
    };
    ViewCommon.prototype._getValue = function () {
        throw new Error("The View._getValue is obsolete. There is a new property system.");
    };
    ViewCommon.prototype._setValue = function () {
        throw new Error("The View._setValue is obsolete. There is a new property system.");
    };
    ViewCommon.prototype._updateEffectiveLayoutValues = function (parentWidthMeasureSize, parentWidthMeasureMode, parentHeightMeasureSize, parentHeightMeasureMode) {
        var style = this.style;
        var availableWidth = parentWidthMeasureMode === view_base_1.layout.UNSPECIFIED ? -1 : parentWidthMeasureSize;
        this.effectiveWidth = style_properties_1.PercentLength.toDevicePixels(style.width, -2, availableWidth);
        this.effectiveMarginLeft = style_properties_1.PercentLength.toDevicePixels(style.marginLeft, 0, availableWidth);
        this.effectiveMarginRight = style_properties_1.PercentLength.toDevicePixels(style.marginRight, 0, availableWidth);
        var availableHeight = parentHeightMeasureMode === view_base_1.layout.UNSPECIFIED ? -1 : parentHeightMeasureSize;
        this.effectiveHeight = style_properties_1.PercentLength.toDevicePixels(style.height, -2, availableHeight);
        this.effectiveMarginTop = style_properties_1.PercentLength.toDevicePixels(style.marginTop, 0, availableHeight);
        this.effectiveMarginBottom = style_properties_1.PercentLength.toDevicePixels(style.marginBottom, 0, availableHeight);
    };
    ViewCommon.prototype._setNativeClipToBounds = function () {
    };
    ViewCommon.prototype._redrawNativeBackground = function (value) {
    };
    ViewCommon.prototype._onAttachedToWindow = function () {
    };
    ViewCommon.prototype._onDetachedFromWindow = function () {
    };
    ViewCommon.prototype._hasAncestorView = function (ancestorView) {
        var matcher = function (view) { return view === ancestorView; };
        for (var parent_2 = this.parent; parent_2 != null; parent_2 = parent_2.parent) {
            if (matcher(parent_2)) {
                return true;
            }
        }
        return false;
    };
    ViewCommon.layoutChangedEvent = "layoutChanged";
    ViewCommon.shownModallyEvent = "shownModally";
    ViewCommon.showingModallyEvent = "showingModally";
    return ViewCommon;
}(view_base_1.ViewBase));
exports.ViewCommon = ViewCommon;
exports.automationTextProperty = new view_base_1.Property({ name: "automationText" });
exports.automationTextProperty.register(ViewCommon);
exports.originXProperty = new view_base_1.Property({ name: "originX", defaultValue: 0.5, valueConverter: function (v) { return parseFloat(v); } });
exports.originXProperty.register(ViewCommon);
exports.originYProperty = new view_base_1.Property({ name: "originY", defaultValue: 0.5, valueConverter: function (v) { return parseFloat(v); } });
exports.originYProperty.register(ViewCommon);
exports.isEnabledProperty = new view_base_1.Property({
    name: "isEnabled",
    defaultValue: true,
    valueConverter: view_base_1.booleanConverter,
    valueChanged: function (target, oldValue, newValue) {
        target._goToVisualState(newValue ? "normal" : "disabled");
    }
});
exports.isEnabledProperty.register(ViewCommon);
exports.isUserInteractionEnabledProperty = new view_base_1.Property({ name: "isUserInteractionEnabled", defaultValue: true, valueConverter: view_base_1.booleanConverter });
exports.isUserInteractionEnabledProperty.register(ViewCommon);
exports.iosOverflowSafeAreaProperty = new view_base_1.Property({ name: "iosOverflowSafeArea", defaultValue: false, valueConverter: view_base_1.booleanConverter });
exports.iosOverflowSafeAreaProperty.register(ViewCommon);
exports.iosOverflowSafeAreaEnabledProperty = new view_base_1.InheritedProperty({ name: "iosOverflowSafeAreaEnabled", defaultValue: true, valueConverter: view_base_1.booleanConverter });
exports.iosOverflowSafeAreaEnabledProperty.register(ViewCommon);
//# sourceMappingURL=view-common.js.map