function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var control_state_change_1 = require("../core/control-state-change");
var button_common_1 = require("./button-common");
__export(require("./button-common"));
var Button = (function (_super) {
    __extends(Button, _super);
    function Button() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Button.prototype.createNativeView = function () {
        return UIButton.buttonWithType(1);
    };
    Button.prototype.initNativeView = function () {
        _super.prototype.initNativeView.call(this);
        var nativeView = this.nativeViewProtected;
        this._tapHandler = TapHandlerImpl.initWithOwner(new WeakRef(this));
        nativeView.addTargetActionForControlEvents(this._tapHandler, "tap", 64);
    };
    Button.prototype.disposeNativeView = function () {
        this._tapHandler = null;
        _super.prototype.disposeNativeView.call(this);
    };
    Object.defineProperty(Button.prototype, "ios", {
        get: function () {
            return this.nativeViewProtected;
        },
        enumerable: true,
        configurable: true
    });
    Button.prototype.onUnloaded = function () {
        _super.prototype.onUnloaded.call(this);
        if (this._stateChangedHandler) {
            this._stateChangedHandler.stop();
        }
    };
    Button.prototype._updateHandler = function (subscribe) {
        var _this = this;
        if (subscribe) {
            if (!this._stateChangedHandler) {
                this._stateChangedHandler = new control_state_change_1.ControlStateChangeListener(this.nativeViewProtected, function (s) {
                    _this._goToVisualState(s);
                });
            }
            this._stateChangedHandler.start();
        }
        else {
            this._stateChangedHandler.stop();
        }
    };
    Button.prototype[button_common_1.borderTopWidthProperty.getDefault] = function () {
        return {
            value: this.nativeViewProtected.contentEdgeInsets.top,
            unit: "px"
        };
    };
    Button.prototype[button_common_1.borderTopWidthProperty.setNative] = function (value) {
        var inset = this.nativeViewProtected.contentEdgeInsets;
        var top = button_common_1.layout.toDeviceIndependentPixels(this.effectivePaddingTop + this.effectiveBorderTopWidth);
        this.nativeViewProtected.contentEdgeInsets = { top: top, left: inset.left, bottom: inset.bottom, right: inset.right };
    };
    Button.prototype[button_common_1.borderRightWidthProperty.getDefault] = function () {
        return {
            value: this.nativeViewProtected.contentEdgeInsets.right,
            unit: "px"
        };
    };
    Button.prototype[button_common_1.borderRightWidthProperty.setNative] = function (value) {
        var inset = this.nativeViewProtected.contentEdgeInsets;
        var right = button_common_1.layout.toDeviceIndependentPixels(this.effectivePaddingRight + this.effectiveBorderRightWidth);
        this.nativeViewProtected.contentEdgeInsets = { top: inset.top, left: inset.left, bottom: inset.bottom, right: right };
    };
    Button.prototype[button_common_1.borderBottomWidthProperty.getDefault] = function () {
        return {
            value: this.nativeViewProtected.contentEdgeInsets.bottom,
            unit: "px"
        };
    };
    Button.prototype[button_common_1.borderBottomWidthProperty.setNative] = function (value) {
        var inset = this.nativeViewProtected.contentEdgeInsets;
        var bottom = button_common_1.layout.toDeviceIndependentPixels(this.effectivePaddingBottom + this.effectiveBorderBottomWidth);
        this.nativeViewProtected.contentEdgeInsets = { top: inset.top, left: inset.left, bottom: bottom, right: inset.right };
    };
    Button.prototype[button_common_1.borderLeftWidthProperty.getDefault] = function () {
        return {
            value: this.nativeViewProtected.contentEdgeInsets.left,
            unit: "px"
        };
    };
    Button.prototype[button_common_1.borderLeftWidthProperty.setNative] = function (value) {
        var inset = this.nativeViewProtected.contentEdgeInsets;
        var left = button_common_1.layout.toDeviceIndependentPixels(this.effectivePaddingLeft + this.effectiveBorderLeftWidth);
        this.nativeViewProtected.contentEdgeInsets = { top: inset.top, left: left, bottom: inset.bottom, right: inset.right };
    };
    Button.prototype[button_common_1.paddingTopProperty.getDefault] = function () {
        return {
            value: this.nativeViewProtected.contentEdgeInsets.top,
            unit: "px"
        };
    };
    Button.prototype[button_common_1.paddingTopProperty.setNative] = function (value) {
        var inset = this.nativeViewProtected.contentEdgeInsets;
        var top = button_common_1.layout.toDeviceIndependentPixels(this.effectivePaddingTop + this.effectiveBorderTopWidth);
        this.nativeViewProtected.contentEdgeInsets = { top: top, left: inset.left, bottom: inset.bottom, right: inset.right };
    };
    Button.prototype[button_common_1.paddingRightProperty.getDefault] = function () {
        return {
            value: this.nativeViewProtected.contentEdgeInsets.right,
            unit: "px"
        };
    };
    Button.prototype[button_common_1.paddingRightProperty.setNative] = function (value) {
        var inset = this.nativeViewProtected.contentEdgeInsets;
        var right = button_common_1.layout.toDeviceIndependentPixels(this.effectivePaddingRight + this.effectiveBorderRightWidth);
        this.nativeViewProtected.contentEdgeInsets = { top: inset.top, left: inset.left, bottom: inset.bottom, right: right };
    };
    Button.prototype[button_common_1.paddingBottomProperty.getDefault] = function () {
        return {
            value: this.nativeViewProtected.contentEdgeInsets.bottom,
            unit: "px"
        };
    };
    Button.prototype[button_common_1.paddingBottomProperty.setNative] = function (value) {
        var inset = this.nativeViewProtected.contentEdgeInsets;
        var bottom = button_common_1.layout.toDeviceIndependentPixels(this.effectivePaddingBottom + this.effectiveBorderBottomWidth);
        this.nativeViewProtected.contentEdgeInsets = { top: inset.top, left: inset.left, bottom: bottom, right: inset.right };
    };
    Button.prototype[button_common_1.paddingLeftProperty.getDefault] = function () {
        return {
            value: this.nativeViewProtected.contentEdgeInsets.left,
            unit: "px"
        };
    };
    Button.prototype[button_common_1.paddingLeftProperty.setNative] = function (value) {
        var inset = this.nativeViewProtected.contentEdgeInsets;
        var left = button_common_1.layout.toDeviceIndependentPixels(this.effectivePaddingLeft + this.effectiveBorderLeftWidth);
        this.nativeViewProtected.contentEdgeInsets = { top: inset.top, left: left, bottom: inset.bottom, right: inset.right };
    };
    Button.prototype[button_common_1.textAlignmentProperty.setNative] = function (value) {
        switch (value) {
            case "left":
                this.nativeViewProtected.titleLabel.textAlignment = 0;
                this.nativeViewProtected.contentHorizontalAlignment = 1;
                break;
            case "initial":
            case "center":
                this.nativeViewProtected.titleLabel.textAlignment = 1;
                this.nativeViewProtected.contentHorizontalAlignment = 0;
                break;
            case "right":
                this.nativeViewProtected.titleLabel.textAlignment = 2;
                this.nativeViewProtected.contentHorizontalAlignment = 2;
                break;
        }
    };
    Button.prototype[button_common_1.whiteSpaceProperty.setNative] = function (value) {
        var nativeView = this.nativeViewProtected.titleLabel;
        switch (value) {
            case "normal":
                nativeView.lineBreakMode = 0;
                nativeView.numberOfLines = 0;
                break;
            case "nowrap":
            case "initial":
                nativeView.lineBreakMode = 5;
                nativeView.numberOfLines = 1;
                break;
        }
    };
    Button.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        if (!this.textWrap) {
            return _super.prototype.onMeasure.call(this, widthMeasureSpec, heightMeasureSpec);
        }
        var nativeView = this.nativeViewProtected;
        if (nativeView) {
            var width = button_common_1.layout.getMeasureSpecSize(widthMeasureSpec);
            var widthMode = button_common_1.layout.getMeasureSpecMode(widthMeasureSpec);
            var height = button_common_1.layout.getMeasureSpecSize(heightMeasureSpec);
            var heightMode = button_common_1.layout.getMeasureSpecMode(heightMeasureSpec);
            var horizontalPadding = this.effectivePaddingLeft + this.effectiveBorderLeftWidth + this.effectivePaddingRight + this.effectiveBorderRightWidth;
            var verticalPadding = this.effectivePaddingTop + this.effectiveBorderTopWidth + this.effectivePaddingBottom + this.effectiveBorderBottomWidth;
            if (verticalPadding === 0) {
                verticalPadding = button_common_1.layout.toDevicePixels(12);
            }
            var desiredSize = button_common_1.layout.measureNativeView(nativeView.titleLabel, width - horizontalPadding, widthMode, height - verticalPadding, heightMode);
            desiredSize.width = desiredSize.width + horizontalPadding;
            desiredSize.height = desiredSize.height + verticalPadding;
            var measureWidth = Math.max(desiredSize.width, this.effectiveMinWidth);
            var measureHeight = Math.max(desiredSize.height, this.effectiveMinHeight);
            var widthAndState = button_common_1.View.resolveSizeAndState(measureWidth, width, widthMode, 0);
            var heightAndState = button_common_1.View.resolveSizeAndState(measureHeight, height, heightMode, 0);
            this.setMeasuredDimension(widthAndState, heightAndState);
        }
    };
    __decorate([
        button_common_1.PseudoClassHandler("normal", "highlighted", "pressed", "active")
    ], Button.prototype, "_updateHandler", null);
    return Button;
}(button_common_1.ButtonBase));
exports.Button = Button;
var TapHandlerImpl = (function (_super) {
    __extends(TapHandlerImpl, _super);
    function TapHandlerImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TapHandlerImpl.initWithOwner = function (owner) {
        var handler = TapHandlerImpl.new();
        handler._owner = owner;
        return handler;
    };
    TapHandlerImpl.prototype.tap = function (args) {
        var owner = this._owner.get();
        if (owner) {
            owner._emit(button_common_1.ButtonBase.tapEvent);
        }
    };
    TapHandlerImpl.ObjCExposedMethods = {
        "tap": { returns: interop.types.void, params: [interop.types.id] }
    };
    return TapHandlerImpl;
}(NSObject));
//# sourceMappingURL=button.ios.js.map