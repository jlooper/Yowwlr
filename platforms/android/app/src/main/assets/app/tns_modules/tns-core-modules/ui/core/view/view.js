function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var view_common_1 = require("./view-common");
var style_properties_1 = require("../../styling/style-properties");
var background_1 = require("../../styling/background");
var profiling_1 = require("../../../profiling");
var frame_stack_1 = require("../../frame/frame-stack");
var application_1 = require("../../../application");
__export(require("./view-common"));
var DOMID = "_domId";
var androidBackPressedEvent = "androidBackPressed";
var modalMap = new Map();
var TouchListener;
var DialogFragment;
function initializeTouchListener() {
    if (TouchListener) {
        return;
    }
    var TouchListenerImpl = (function (_super) {
        __extends(TouchListenerImpl, _super);
        function TouchListenerImpl(owner) {
            var _this = _super.call(this) || this;
            _this.owner = owner;
            return global.__native(_this);
        }
        TouchListenerImpl.prototype.onTouch = function (view, event) {
            var owner = this.owner;
            owner.handleGestureTouch(event);
            var nativeView = owner.nativeViewProtected;
            if (!nativeView || !nativeView.onTouchEvent) {
                return false;
            }
            return nativeView.onTouchEvent(event);
        };
        TouchListenerImpl = __decorate([
            Interfaces([android.view.View.OnTouchListener])
        ], TouchListenerImpl);
        return TouchListenerImpl;
    }(java.lang.Object));
    TouchListener = TouchListenerImpl;
}
function initializeDialogFragment() {
    if (DialogFragment) {
        return;
    }
    var DialogImpl = (function (_super) {
        __extends(DialogImpl, _super);
        function DialogImpl(fragment, context, themeResId) {
            var _this = _super.call(this, context, themeResId) || this;
            _this.fragment = fragment;
            return global.__native(_this);
        }
        DialogImpl.prototype.onBackPressed = function () {
            var view = this.fragment.owner;
            var args = {
                eventName: "activityBackPressed",
                object: view,
                activity: view._context,
                cancel: false,
            };
            application_1.android.notify(args);
            if (args.cancel) {
                return;
            }
            view.notify(args);
            if (!args.cancel && !view.onBackPressed()) {
                _super.prototype.onBackPressed.call(this);
            }
        };
        return DialogImpl;
    }(android.app.Dialog));
    var DialogFragmentImpl = (function (_super) {
        __extends(DialogFragmentImpl, _super);
        function DialogFragmentImpl() {
            var _this = _super.call(this) || this;
            return global.__native(_this);
        }
        DialogFragmentImpl.prototype.onCreateDialog = function (savedInstanceState) {
            var ownerId = this.getArguments().getInt(DOMID);
            var options = getModalOptions(ownerId);
            this.owner = options.owner;
            this._fullscreen = options.fullscreen;
            this._stretched = options.stretched;
            this._dismissCallback = options.dismissCallback;
            this._shownCallback = options.shownCallback;
            this.owner._dialogFragment = this;
            this.setStyle(android.support.v4.app.DialogFragment.STYLE_NO_TITLE, 0);
            var dialog = new DialogImpl(this, this.getActivity(), this.getTheme());
            if (!this._fullscreen && !this._stretched) {
                this.owner.horizontalAlignment = "center";
                this.owner.verticalAlignment = "middle";
            }
            else {
                this.owner.horizontalAlignment = "stretch";
                this.owner.verticalAlignment = "stretch";
            }
            return dialog;
        };
        DialogFragmentImpl.prototype.onCreateView = function (inflater, container, savedInstanceState) {
            var owner = this.owner;
            owner._setupAsRootView(this.getActivity());
            owner._isAddedToNativeVisualTree = true;
            return owner.nativeViewProtected;
        };
        DialogFragmentImpl.prototype.onStart = function () {
            _super.prototype.onStart.call(this);
            if (this._fullscreen) {
                var window_1 = this.getDialog().getWindow();
                var length_1 = android.view.ViewGroup.LayoutParams.MATCH_PARENT;
                window_1.setLayout(length_1, length_1);
                window_1.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(android.graphics.Color.WHITE));
            }
            var owner = this.owner;
            if (owner && !owner.isLoaded) {
                owner.callLoaded();
            }
            this._shownCallback();
        };
        DialogFragmentImpl.prototype.onDismiss = function (dialog) {
            _super.prototype.onDismiss.call(this, dialog);
            var manager = this.getFragmentManager();
            if (manager) {
                removeModal(this.owner._domId);
                this._dismissCallback();
            }
            var owner = this.owner;
            if (owner && owner.isLoaded) {
                owner.callUnloaded();
            }
        };
        DialogFragmentImpl.prototype.onDestroy = function () {
            _super.prototype.onDestroy.call(this);
            var owner = this.owner;
            owner._isAddedToNativeVisualTree = false;
            owner._tearDownUI(true);
        };
        return DialogFragmentImpl;
    }(android.support.v4.app.DialogFragment));
    DialogFragment = DialogFragmentImpl;
}
function saveModal(options) {
    modalMap.set(options.owner._domId, options);
}
function removeModal(domId) {
    modalMap.delete(domId);
}
function getModalOptions(domId) {
    return modalMap.get(domId);
}
var View = (function (_super) {
    __extends(View, _super);
    function View() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    View.prototype.observe = function (type, callback, thisArg) {
        _super.prototype.observe.call(this, type, callback, thisArg);
        if (this.isLoaded && !this.touchListenerIsSet) {
            this.setOnTouchListener();
        }
    };
    View.prototype.on = function (eventNames, callback, thisArg) {
        _super.prototype.on.call(this, eventNames, callback, thisArg);
        var isLayoutEvent = typeof eventNames === "string" ? eventNames.indexOf(view_common_1.ViewCommon.layoutChangedEvent) !== -1 : false;
        if (this.isLoaded && !this.layoutChangeListenerIsSet && isLayoutEvent) {
            this.setOnLayoutChangeListener();
        }
    };
    View.prototype.off = function (eventNames, callback, thisArg) {
        _super.prototype.off.call(this, eventNames, callback, thisArg);
        var isLayoutEvent = typeof eventNames === "string" ? eventNames.indexOf(view_common_1.ViewCommon.layoutChangedEvent) !== -1 : false;
        if (this.isLoaded && this.layoutChangeListenerIsSet && isLayoutEvent && !this.hasListeners(view_common_1.ViewCommon.layoutChangedEvent)) {
            this.nativeViewProtected.removeOnLayoutChangeListener(this.layoutChangeListener);
            this.layoutChangeListenerIsSet = false;
        }
    };
    View.prototype._getChildFragmentManager = function () {
        return null;
    };
    View.prototype._getRootFragmentManager = function () {
        if (!this._rootManager && this._context) {
            this._rootManager = this._context.getSupportFragmentManager();
        }
        return this._rootManager;
    };
    View.prototype._getFragmentManager = function () {
        var manager = this._manager;
        if (!manager) {
            var view = this;
            var frameOrTabViewItemFound = false;
            while (view) {
                var dialogFragment = view._dialogFragment;
                if (dialogFragment) {
                    manager = dialogFragment.getChildFragmentManager();
                    break;
                }
                if (view._hasFragments) {
                    if (frameOrTabViewItemFound) {
                        manager = view._getChildFragmentManager();
                        break;
                    }
                    frameOrTabViewItemFound = true;
                }
                view = view.parent;
            }
            if (!manager) {
                manager = this._getRootFragmentManager();
            }
            this._manager = manager;
        }
        return manager;
    };
    View.prototype.onLoaded = function () {
        this._manager = null;
        this._rootManager = null;
        _super.prototype.onLoaded.call(this);
        this.setOnTouchListener();
    };
    View.prototype.onUnloaded = function () {
        if (this.touchListenerIsSet) {
            this.nativeViewProtected.setOnTouchListener(null);
            this.touchListenerIsSet = false;
            this.nativeViewProtected.setClickable(this._isClickable);
        }
        this._manager = null;
        this._rootManager = null;
        _super.prototype.onUnloaded.call(this);
    };
    View.prototype.onBackPressed = function () {
        var topmostFrame = frame_stack_1.topmost();
        if (topmostFrame && topmostFrame._hasAncestorView(this)) {
            return topmostFrame.onBackPressed();
        }
        return false;
    };
    View.prototype.handleGestureTouch = function (event) {
        for (var type in this._gestureObservers) {
            var list = this._gestureObservers[type];
            list.forEach(function (element) {
                element.androidOnTouchEvent(event);
            });
        }
        if (this.parent instanceof View) {
            this.parent.handleGestureTouch(event);
        }
    };
    View.prototype.hasGestureObservers = function () {
        return this._gestureObservers && Object.keys(this._gestureObservers).length > 0;
    };
    View.prototype.initNativeView = function () {
        _super.prototype.initNativeView.call(this);
        this._isClickable = this.nativeViewProtected.isClickable();
        if (this.hasListeners(view_common_1.ViewCommon.layoutChangedEvent)) {
            this.setOnLayoutChangeListener();
        }
    };
    View.prototype.disposeNativeView = function () {
        _super.prototype.disposeNativeView.call(this);
        if (this.layoutChangeListenerIsSet) {
            this.layoutChangeListenerIsSet = false;
            this.nativeViewProtected.removeOnLayoutChangeListener(this.layoutChangeListener);
        }
    };
    View.prototype.setOnTouchListener = function () {
        if (!this.nativeViewProtected || !this.hasGestureObservers()) {
            return;
        }
        initializeTouchListener();
        this.touchListener = this.touchListener || new TouchListener(this);
        this.nativeViewProtected.setOnTouchListener(this.touchListener);
        this.touchListenerIsSet = true;
        if (this.nativeViewProtected.setClickable) {
            this.nativeViewProtected.setClickable(this.isUserInteractionEnabled);
        }
    };
    View.prototype.setOnLayoutChangeListener = function () {
        if (this.nativeViewProtected) {
            var owner_1 = this;
            this.layoutChangeListenerIsSet = true;
            this.layoutChangeListener = this.layoutChangeListener || new android.view.View.OnLayoutChangeListener({
                onLayoutChange: function (v, left, top, right, bottom, oldLeft, oldTop, oldRight, oldBottom) {
                    if (left !== oldLeft || top !== oldTop || right !== oldRight || bottom !== oldBottom) {
                        owner_1._raiseLayoutChangedEvent();
                    }
                }
            });
            this.nativeViewProtected.addOnLayoutChangeListener(this.layoutChangeListener);
        }
    };
    Object.defineProperty(View.prototype, "isLayoutRequired", {
        get: function () {
            return !this.isLayoutValid;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, "isLayoutValid", {
        get: function () {
            if (this.nativeViewProtected) {
                return !this.nativeViewProtected.isLayoutRequested();
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, "_hasFragments", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    View.prototype.layoutNativeView = function (left, top, right, bottom) {
        if (this.nativeViewProtected) {
            this.nativeViewProtected.layout(left, top, right, bottom);
        }
    };
    View.prototype.requestLayout = function () {
        _super.prototype.requestLayout.call(this);
        if (this.nativeViewProtected) {
            this.nativeViewProtected.requestLayout();
        }
    };
    View.prototype.measure = function (widthMeasureSpec, heightMeasureSpec) {
        _super.prototype.measure.call(this, widthMeasureSpec, heightMeasureSpec);
        this.onMeasure(widthMeasureSpec, heightMeasureSpec);
    };
    View.prototype.layout = function (left, top, right, bottom) {
        _super.prototype.layout.call(this, left, top, right, bottom);
        this.onLayout(left, top, right, bottom);
    };
    View.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        var view = this.nativeViewProtected;
        if (view) {
            view.measure(widthMeasureSpec, heightMeasureSpec);
            this.setMeasuredDimension(view.getMeasuredWidth(), view.getMeasuredHeight());
        }
    };
    View.prototype.onLayout = function (left, top, right, bottom) {
        var view = this.nativeViewProtected;
        if (view) {
            this.layoutNativeView(left, top, right, bottom);
        }
    };
    View.prototype._getCurrentLayoutBounds = function () {
        if (this.nativeViewProtected && !this.isCollapsed) {
            return {
                left: this.nativeViewProtected.getLeft(),
                top: this.nativeViewProtected.getTop(),
                right: this.nativeViewProtected.getRight(),
                bottom: this.nativeViewProtected.getBottom()
            };
        }
        else {
            return { left: 0, top: 0, right: 0, bottom: 0 };
        }
    };
    View.prototype.getMeasuredWidth = function () {
        if (this.nativeViewProtected) {
            return this.nativeViewProtected.getMeasuredWidth();
        }
        return _super.prototype.getMeasuredWidth.call(this);
    };
    View.prototype.getMeasuredHeight = function () {
        if (this.nativeViewProtected) {
            return this.nativeViewProtected.getMeasuredHeight();
        }
        return _super.prototype.getMeasuredHeight.call(this);
    };
    View.prototype.focus = function () {
        if (this.nativeViewProtected) {
            return this.nativeViewProtected.requestFocus();
        }
        return false;
    };
    View.prototype.getLocationInWindow = function () {
        if (!this.nativeViewProtected || !this.nativeViewProtected.getWindowToken()) {
            return undefined;
        }
        var nativeArray = Array.create("int", 2);
        this.nativeViewProtected.getLocationInWindow(nativeArray);
        return {
            x: view_common_1.layout.toDeviceIndependentPixels(nativeArray[0]),
            y: view_common_1.layout.toDeviceIndependentPixels(nativeArray[1]),
        };
    };
    View.prototype.getLocationOnScreen = function () {
        if (!this.nativeViewProtected || !this.nativeViewProtected.getWindowToken()) {
            return undefined;
        }
        var nativeArray = Array.create("int", 2);
        this.nativeViewProtected.getLocationOnScreen(nativeArray);
        return {
            x: view_common_1.layout.toDeviceIndependentPixels(nativeArray[0]),
            y: view_common_1.layout.toDeviceIndependentPixels(nativeArray[1]),
        };
    };
    View.prototype.getLocationRelativeTo = function (otherView) {
        if (!this.nativeViewProtected || !this.nativeViewProtected.getWindowToken() ||
            !otherView || !otherView.nativeViewProtected || !otherView.nativeViewProtected.getWindowToken() ||
            this.nativeViewProtected.getWindowToken() !== otherView.nativeViewProtected.getWindowToken()) {
            return undefined;
        }
        var myArray = Array.create("int", 2);
        this.nativeViewProtected.getLocationOnScreen(myArray);
        var otherArray = Array.create("int", 2);
        otherView.nativeViewProtected.getLocationOnScreen(otherArray);
        return {
            x: view_common_1.layout.toDeviceIndependentPixels(myArray[0] - otherArray[0]),
            y: view_common_1.layout.toDeviceIndependentPixels(myArray[1] - otherArray[1]),
        };
    };
    View.resolveSizeAndState = function (size, specSize, specMode, childMeasuredState) {
        var result = size;
        switch (specMode) {
            case view_common_1.layout.UNSPECIFIED:
                result = size;
                break;
            case view_common_1.layout.AT_MOST:
                if (specSize < size) {
                    result = specSize | view_common_1.layout.MEASURED_STATE_TOO_SMALL;
                }
                break;
            case view_common_1.layout.EXACTLY:
                result = specSize;
                break;
        }
        return result | (childMeasuredState & view_common_1.layout.MEASURED_STATE_MASK);
    };
    View.prototype._showNativeModalView = function (parent, options) {
        var _this = this;
        _super.prototype._showNativeModalView.call(this, parent, options);
        if (!this.backgroundColor) {
            this.backgroundColor = new view_common_1.Color("White");
        }
        initializeDialogFragment();
        var df = new DialogFragment();
        var args = new android.os.Bundle();
        args.putInt(DOMID, this._domId);
        df.setArguments(args);
        var dialogOptions = {
            owner: this,
            fullscreen: !!options.fullscreen,
            stretched: !!options.stretched,
            shownCallback: function () { return _this._raiseShownModallyEvent(); },
            dismissCallback: function () { return _this.closeModal(); }
        };
        saveModal(dialogOptions);
        this._dialogFragment = df;
        this._raiseShowingModallyEvent();
        this._dialogFragment.show(parent._getRootFragmentManager(), this._domId.toString());
    };
    View.prototype._hideNativeModalView = function (parent, whenClosedCallback) {
        var manager = this._dialogFragment.getFragmentManager();
        if (manager) {
            this._dialogFragment.dismissAllowingStateLoss();
        }
        this._dialogFragment = null;
        whenClosedCallback();
    };
    View.prototype[view_common_1.isEnabledProperty.setNative] = function (value) {
        this.nativeViewProtected.setEnabled(value);
    };
    View.prototype[view_common_1.originXProperty.getDefault] = function () {
        return this.nativeViewProtected.getPivotX();
    };
    View.prototype[view_common_1.originXProperty.setNative] = function (value) {
        org.nativescript.widgets.OriginPoint.setX(this.nativeViewProtected, value);
    };
    View.prototype[view_common_1.originYProperty.getDefault] = function () {
        return this.nativeViewProtected.getPivotY();
    };
    View.prototype[view_common_1.originYProperty.setNative] = function (value) {
        org.nativescript.widgets.OriginPoint.setY(this.nativeViewProtected, value);
    };
    View.prototype[view_common_1.automationTextProperty.getDefault] = function () {
        return this.nativeViewProtected.getContentDescription();
    };
    View.prototype[view_common_1.automationTextProperty.setNative] = function (value) {
        this.nativeViewProtected.setContentDescription(value);
    };
    View.prototype[view_common_1.isUserInteractionEnabledProperty.setNative] = function (value) {
        this.nativeViewProtected.setClickable(value);
        this.nativeViewProtected.setFocusable(value);
    };
    View.prototype[style_properties_1.visibilityProperty.getDefault] = function () {
        var nativeVisibility = this.nativeViewProtected.getVisibility();
        switch (nativeVisibility) {
            case android.view.View.VISIBLE:
                return "visible";
            case android.view.View.INVISIBLE:
                return "hidden";
            case android.view.View.GONE:
                return "collapse";
            default:
                throw new Error("Unsupported android.view.View visibility: " + nativeVisibility + ". Currently supported values are android.view.View.VISIBLE, android.view.View.INVISIBLE, android.view.View.GONE.");
        }
    };
    View.prototype[style_properties_1.visibilityProperty.setNative] = function (value) {
        switch (value) {
            case "visible":
                this.nativeViewProtected.setVisibility(android.view.View.VISIBLE);
                break;
            case "hidden":
                this.nativeViewProtected.setVisibility(android.view.View.INVISIBLE);
                break;
            case "collapse":
                this.nativeViewProtected.setVisibility(android.view.View.GONE);
                break;
            default:
                throw new Error("Invalid visibility value: " + value + ". Valid values are: visible, hidden, collapse.");
        }
    };
    View.prototype[style_properties_1.opacityProperty.getDefault] = function () {
        return this.nativeViewProtected.getAlpha();
    };
    View.prototype[style_properties_1.opacityProperty.setNative] = function (value) {
        this.nativeViewProtected.setAlpha(float(value));
    };
    View.prototype[style_properties_1.horizontalAlignmentProperty.getDefault] = function () {
        return org.nativescript.widgets.ViewHelper.getHorizontalAlignment(this.nativeViewProtected);
    };
    View.prototype[style_properties_1.horizontalAlignmentProperty.setNative] = function (value) {
        var nativeView = this.nativeViewProtected;
        var lp = nativeView.getLayoutParams() || new org.nativescript.widgets.CommonLayoutParams();
        if (lp.gravity !== undefined) {
            switch (value) {
                case "left":
                    lp.gravity = android.view.Gravity.LEFT | (lp.gravity & android.view.Gravity.VERTICAL_GRAVITY_MASK);
                    if (lp.weight < 0) {
                        lp.weight = -2;
                    }
                    break;
                case "center":
                    lp.gravity = android.view.Gravity.CENTER_HORIZONTAL | (lp.gravity & android.view.Gravity.VERTICAL_GRAVITY_MASK);
                    if (lp.weight < 0) {
                        lp.weight = -2;
                    }
                    break;
                case "right":
                    lp.gravity = android.view.Gravity.RIGHT | (lp.gravity & android.view.Gravity.VERTICAL_GRAVITY_MASK);
                    if (lp.weight < 0) {
                        lp.weight = -2;
                    }
                    break;
                case "stretch":
                    lp.gravity = android.view.Gravity.FILL_HORIZONTAL | (lp.gravity & android.view.Gravity.VERTICAL_GRAVITY_MASK);
                    if (lp.weight < 0) {
                        lp.weight = -1;
                    }
                    break;
            }
            nativeView.setLayoutParams(lp);
        }
    };
    View.prototype[style_properties_1.verticalAlignmentProperty.getDefault] = function () {
        return org.nativescript.widgets.ViewHelper.getVerticalAlignment(this.nativeViewProtected);
    };
    View.prototype[style_properties_1.verticalAlignmentProperty.setNative] = function (value) {
        var nativeView = this.nativeViewProtected;
        var lp = nativeView.getLayoutParams() || new org.nativescript.widgets.CommonLayoutParams();
        if (lp.gravity !== undefined) {
            switch (value) {
                case "top":
                    lp.gravity = android.view.Gravity.TOP | (lp.gravity & android.view.Gravity.HORIZONTAL_GRAVITY_MASK);
                    if (lp.height < 0) {
                        lp.height = -2;
                    }
                    break;
                case "middle":
                    lp.gravity = android.view.Gravity.CENTER_VERTICAL | (lp.gravity & android.view.Gravity.HORIZONTAL_GRAVITY_MASK);
                    if (lp.height < 0) {
                        lp.height = -2;
                    }
                    break;
                case "bottom":
                    lp.gravity = android.view.Gravity.BOTTOM | (lp.gravity & android.view.Gravity.HORIZONTAL_GRAVITY_MASK);
                    if (lp.height < 0) {
                        lp.height = -2;
                    }
                    break;
                case "stretch":
                    lp.gravity = android.view.Gravity.FILL_VERTICAL | (lp.gravity & android.view.Gravity.HORIZONTAL_GRAVITY_MASK);
                    if (lp.height < 0) {
                        lp.height = -1;
                    }
                    break;
            }
            nativeView.setLayoutParams(lp);
        }
    };
    View.prototype[style_properties_1.rotateProperty.setNative] = function (value) {
        org.nativescript.widgets.ViewHelper.setRotate(this.nativeViewProtected, float(value));
    };
    View.prototype[style_properties_1.scaleXProperty.setNative] = function (value) {
        org.nativescript.widgets.ViewHelper.setScaleX(this.nativeViewProtected, float(value));
    };
    View.prototype[style_properties_1.scaleYProperty.setNative] = function (value) {
        org.nativescript.widgets.ViewHelper.setScaleY(this.nativeViewProtected, float(value));
    };
    View.prototype[style_properties_1.translateXProperty.setNative] = function (value) {
        org.nativescript.widgets.ViewHelper.setTranslateX(this.nativeViewProtected, view_common_1.layout.toDevicePixels(value));
    };
    View.prototype[style_properties_1.translateYProperty.setNative] = function (value) {
        org.nativescript.widgets.ViewHelper.setTranslateY(this.nativeViewProtected, view_common_1.layout.toDevicePixels(value));
    };
    View.prototype[style_properties_1.zIndexProperty.getDefault] = function () {
        return 0;
    };
    View.prototype[style_properties_1.zIndexProperty.setNative] = function (value) {
        org.nativescript.widgets.ViewHelper.setZIndex(this.nativeViewProtected, value);
    };
    View.prototype[style_properties_1.backgroundInternalProperty.getDefault] = function () {
        var nativeView = this.nativeViewProtected;
        var drawable = nativeView.getBackground();
        if (drawable) {
            var constantState = drawable.getConstantState();
            if (constantState) {
                try {
                    return constantState.newDrawable(nativeView.getResources());
                }
                catch (e) {
                    return drawable;
                }
            }
            else {
                return drawable;
            }
        }
        return null;
    };
    View.prototype[style_properties_1.backgroundInternalProperty.setNative] = function (value) {
        this._redrawNativeBackground(value);
    };
    View.prototype[style_properties_1.minWidthProperty.setNative] = function (value) {
        if (this.parent instanceof CustomLayoutView && this.parent.nativeViewProtected) {
            this.parent._setChildMinWidthNative(this);
        }
        else {
            this._setMinWidthNative(this.minWidth);
        }
    };
    View.prototype[style_properties_1.minHeightProperty.setNative] = function (value) {
        if (this.parent instanceof CustomLayoutView && this.parent.nativeViewProtected) {
            this.parent._setChildMinHeightNative(this);
        }
        else {
            this._setMinHeightNative(this.minHeight);
        }
    };
    View.prototype._redrawNativeBackground = function (value) {
        if (value instanceof background_1.Background) {
            background_1.ad.onBackgroundOrBorderPropertyChanged(this);
        }
        else {
            var nativeView = this.nativeViewProtected;
            nativeView.setBackground(value);
            var style = this.style;
            var paddingTop = view_common_1.paddingTopProperty.isSet(style) ? this.effectivePaddingTop : this._defaultPaddingTop;
            var paddingRight = view_common_1.paddingRightProperty.isSet(style) ? this.effectivePaddingRight : this._defaultPaddingRight;
            var paddingBottom = view_common_1.paddingBottomProperty.isSet(style) ? this.effectivePaddingBottom : this._defaultPaddingBottom;
            var paddingLeft = view_common_1.paddingLeftProperty.isSet(style) ? this.effectivePaddingLeft : this._defaultPaddingLeft;
            if (this._isPaddingRelative) {
                nativeView.setPaddingRelative(paddingLeft, paddingTop, paddingRight, paddingBottom);
            }
            else {
                nativeView.setPadding(paddingLeft, paddingTop, paddingRight, paddingBottom);
            }
            nativeView.background = undefined;
        }
    };
    View.androidBackPressedEvent = androidBackPressedEvent;
    __decorate([
        profiling_1.profile
    ], View.prototype, "onLoaded", null);
    __decorate([
        profiling_1.profile
    ], View.prototype, "onUnloaded", null);
    __decorate([
        profiling_1.profile
    ], View.prototype, "requestLayout", null);
    return View;
}(view_common_1.ViewCommon));
exports.View = View;
var ContainerView = (function (_super) {
    __extends(ContainerView, _super);
    function ContainerView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ContainerView;
}(View));
exports.ContainerView = ContainerView;
var CustomLayoutView = (function (_super) {
    __extends(CustomLayoutView, _super);
    function CustomLayoutView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CustomLayoutView.prototype.createNativeView = function () {
        return new org.nativescript.widgets.ContentLayout(this._context);
    };
    CustomLayoutView.prototype._addViewToNativeVisualTree = function (child, atIndex) {
        if (atIndex === void 0) { atIndex = Number.MAX_SAFE_INTEGER; }
        _super.prototype._addViewToNativeVisualTree.call(this, child);
        if (this.nativeViewProtected && child.nativeViewProtected) {
            if (view_common_1.traceEnabled()) {
                view_common_1.traceWrite(this + ".nativeView.addView(" + child + ".nativeView, " + atIndex + ")", view_common_1.traceCategories.VisualTreeEvents);
            }
            this.nativeViewProtected.addView(child.nativeViewProtected, atIndex);
            if (child instanceof View) {
                this._updateNativeLayoutParams(child);
            }
            return true;
        }
        return false;
    };
    CustomLayoutView.prototype._updateNativeLayoutParams = function (child) {
        this._setChildMinWidthNative(child);
        this._setChildMinHeightNative(child);
    };
    CustomLayoutView.prototype._setChildMinWidthNative = function (child) {
        child._setMinWidthNative(child.minWidth);
    };
    CustomLayoutView.prototype._setChildMinHeightNative = function (child) {
        child._setMinHeightNative(child.minHeight);
    };
    CustomLayoutView.prototype._removeViewFromNativeVisualTree = function (child) {
        _super.prototype._removeViewFromNativeVisualTree.call(this, child);
        var nativeView = this.nativeViewProtected;
        var childView = child.nativeViewProtected;
        if (nativeView && childView) {
            nativeView.removeView(childView);
            if (view_common_1.traceEnabled()) {
                view_common_1.traceWrite(nativeView + ".removeView(" + childView + ")", view_common_1.traceCategories.VisualTreeEvents);
                view_common_1.traceNotifyEvent(child, "childInLayoutRemovedFromNativeVisualTree");
            }
        }
    };
    return CustomLayoutView;
}(ContainerView));
exports.CustomLayoutView = CustomLayoutView;
var percentNotSupported = function (view, value) { throw new Error("PercentLength is not supported."); };
function createNativePercentLengthProperty(options) {
    var getter = options.getter, setter = options.setter, _a = options.auto, auto = _a === void 0 ? 0 : _a;
    var setPixels, getPixels, setPercent;
    if (getter) {
        View.prototype[getter] = function () {
            if (options) {
                setPixels = options.setPixels;
                getPixels = options.getPixels;
                setPercent = options.setPercent || percentNotSupported;
                options = null;
            }
            var value = getPixels(this.nativeViewProtected);
            if (value == auto) {
                return "auto";
            }
            else {
                return { value: value, unit: "px" };
            }
        };
    }
    if (setter) {
        View.prototype[setter] = function (length) {
            if (options) {
                setPixels = options.setPixels;
                getPixels = options.getPixels;
                setPercent = options.setPercent || percentNotSupported;
                options = null;
            }
            if (length == "auto") {
                setPixels(this.nativeViewProtected, auto);
            }
            else if (typeof length === "number") {
                setPixels(this.nativeViewProtected, view_common_1.layout.round(view_common_1.layout.toDevicePixels(length)));
            }
            else if (length.unit == "dip") {
                setPixels(this.nativeViewProtected, view_common_1.layout.round(view_common_1.layout.toDevicePixels(length.value)));
            }
            else if (length.unit == "px") {
                setPixels(this.nativeViewProtected, view_common_1.layout.round(length.value));
            }
            else if (length.unit == "%") {
                setPercent(this.nativeViewProtected, length.value);
            }
            else {
                throw new Error("Unsupported PercentLength " + length);
            }
        };
    }
}
createNativePercentLengthProperty({
    setter: style_properties_1.marginTopProperty.setNative,
    get setPixels() { return org.nativescript.widgets.ViewHelper.setMarginTop; },
    get setPercent() { return org.nativescript.widgets.ViewHelper.setMarginTopPercent; }
});
createNativePercentLengthProperty({
    setter: style_properties_1.marginRightProperty.setNative,
    get setPixels() { return org.nativescript.widgets.ViewHelper.setMarginRight; },
    get setPercent() { return org.nativescript.widgets.ViewHelper.setMarginRightPercent; }
});
createNativePercentLengthProperty({
    setter: style_properties_1.marginBottomProperty.setNative,
    get setPixels() { return org.nativescript.widgets.ViewHelper.setMarginBottom; },
    get setPercent() { return org.nativescript.widgets.ViewHelper.setMarginBottomPercent; }
});
createNativePercentLengthProperty({
    setter: style_properties_1.marginLeftProperty.setNative,
    get setPixels() { return org.nativescript.widgets.ViewHelper.setMarginLeft; },
    get setPercent() { return org.nativescript.widgets.ViewHelper.setMarginLeftPercent; }
});
createNativePercentLengthProperty({
    setter: style_properties_1.widthProperty.setNative,
    auto: -1,
    get setPixels() { return org.nativescript.widgets.ViewHelper.setWidth; },
    get setPercent() { return org.nativescript.widgets.ViewHelper.setWidthPercent; }
});
createNativePercentLengthProperty({
    setter: style_properties_1.heightProperty.setNative,
    auto: -1,
    get setPixels() { return org.nativescript.widgets.ViewHelper.setHeight; },
    get setPercent() { return org.nativescript.widgets.ViewHelper.setHeightPercent; }
});
createNativePercentLengthProperty({
    setter: "_setMinWidthNative",
    get setPixels() { return org.nativescript.widgets.ViewHelper.setMinWidth; }
});
createNativePercentLengthProperty({
    setter: "_setMinHeightNative",
    get setPixels() { return org.nativescript.widgets.ViewHelper.setMinHeight; }
});
//# sourceMappingURL=view.js.map