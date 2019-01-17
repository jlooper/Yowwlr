function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var button_common_1 = require("./button-common");
var profiling_1 = require("../../profiling");
var gestures_1 = require("../gestures");
__export(require("./button-common"));
var ClickListener;
var APILEVEL;
var AndroidButton;
function initializeClickListener() {
    if (ClickListener) {
        return;
    }
    var ClickListenerImpl = (function (_super) {
        __extends(ClickListenerImpl, _super);
        function ClickListenerImpl(owner) {
            var _this = _super.call(this) || this;
            _this.owner = owner;
            return global.__native(_this);
        }
        ClickListenerImpl.prototype.onClick = function (v) {
            var owner = this.owner;
            if (owner) {
                owner._emit(button_common_1.ButtonBase.tapEvent);
            }
        };
        ClickListenerImpl = __decorate([
            Interfaces([android.view.View.OnClickListener])
        ], ClickListenerImpl);
        return ClickListenerImpl;
    }(java.lang.Object));
    ClickListener = ClickListenerImpl;
}
var Button = (function (_super) {
    __extends(Button, _super);
    function Button() {
        var _this = _super.call(this) || this;
        if (!APILEVEL) {
            APILEVEL = android.os.Build.VERSION.SDK_INT;
        }
        return _this;
    }
    Button.prototype.createNativeView = function () {
        if (!AndroidButton) {
            AndroidButton = android.widget.Button;
        }
        return new AndroidButton(this._context);
    };
    Button.prototype.initNativeView = function () {
        _super.prototype.initNativeView.call(this);
        var nativeView = this.nativeViewProtected;
        initializeClickListener();
        var clickListener = new ClickListener(this);
        nativeView.setOnClickListener(clickListener);
        nativeView.clickListener = clickListener;
    };
    Button.prototype.disposeNativeView = function () {
        if (this.nativeViewProtected) {
            this.nativeViewProtected.clickListener.owner = null;
        }
        _super.prototype.disposeNativeView.call(this);
    };
    Button.prototype.resetNativeView = function () {
        _super.prototype.resetNativeView.call(this);
        if (this._stateListAnimator && APILEVEL >= 21) {
            this.nativeViewProtected.setStateListAnimator(this._stateListAnimator);
            this._stateListAnimator = undefined;
        }
    };
    Button.prototype._updateHandler = function (subscribe) {
        var _this = this;
        if (subscribe) {
            this._highlightedHandler = this._highlightedHandler || (function (args) {
                switch (args.action) {
                    case gestures_1.TouchAction.up:
                        _this._goToVisualState("normal");
                        break;
                    case gestures_1.TouchAction.down:
                        _this._goToVisualState("highlighted");
                        break;
                }
            });
            this.on(gestures_1.GestureTypes.touch, this._highlightedHandler);
        }
        else {
            this.off(gestures_1.GestureTypes.touch, this._highlightedHandler);
        }
    };
    Button.prototype[button_common_1.paddingTopProperty.getDefault] = function () {
        return { value: this._defaultPaddingTop, unit: "px" };
    };
    Button.prototype[button_common_1.paddingTopProperty.setNative] = function (value) {
        org.nativescript.widgets.ViewHelper.setPaddingTop(this.nativeViewProtected, button_common_1.Length.toDevicePixels(value, 0) + button_common_1.Length.toDevicePixels(this.style.borderTopWidth, 0));
    };
    Button.prototype[button_common_1.paddingRightProperty.getDefault] = function () {
        return { value: this._defaultPaddingRight, unit: "px" };
    };
    Button.prototype[button_common_1.paddingRightProperty.setNative] = function (value) {
        org.nativescript.widgets.ViewHelper.setPaddingRight(this.nativeViewProtected, button_common_1.Length.toDevicePixels(value, 0) + button_common_1.Length.toDevicePixels(this.style.borderRightWidth, 0));
    };
    Button.prototype[button_common_1.paddingBottomProperty.getDefault] = function () {
        return { value: this._defaultPaddingBottom, unit: "px" };
    };
    Button.prototype[button_common_1.paddingBottomProperty.setNative] = function (value) {
        org.nativescript.widgets.ViewHelper.setPaddingBottom(this.nativeViewProtected, button_common_1.Length.toDevicePixels(value, 0) + button_common_1.Length.toDevicePixels(this.style.borderBottomWidth, 0));
    };
    Button.prototype[button_common_1.paddingLeftProperty.getDefault] = function () {
        return { value: this._defaultPaddingLeft, unit: "px" };
    };
    Button.prototype[button_common_1.paddingLeftProperty.setNative] = function (value) {
        org.nativescript.widgets.ViewHelper.setPaddingLeft(this.nativeViewProtected, button_common_1.Length.toDevicePixels(value, 0) + button_common_1.Length.toDevicePixels(this.style.borderLeftWidth, 0));
    };
    Button.prototype[button_common_1.zIndexProperty.setNative] = function (value) {
        if (APILEVEL >= 21) {
            var nativeView = this.nativeViewProtected;
            if (!this._stateListAnimator) {
                this._stateListAnimator = nativeView.getStateListAnimator();
            }
            nativeView.setStateListAnimator(null);
        }
        org.nativescript.widgets.ViewHelper.setZIndex(this.nativeViewProtected, value);
    };
    Button.prototype[button_common_1.textAlignmentProperty.setNative] = function (value) {
        var newValue = value === "initial" ? "center" : value;
        _super.prototype[button_common_1.textAlignmentProperty.setNative].call(this, newValue);
    };
    __decorate([
        profiling_1.profile
    ], Button.prototype, "createNativeView", null);
    __decorate([
        button_common_1.PseudoClassHandler("normal", "highlighted", "pressed", "active")
    ], Button.prototype, "_updateHandler", null);
    return Button;
}(button_common_1.ButtonBase));
exports.Button = Button;
//# sourceMappingURL=button.android.js.map