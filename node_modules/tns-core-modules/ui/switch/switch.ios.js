function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var switch_common_1 = require("./switch-common");
__export(require("./switch-common"));
var SwitchChangeHandlerImpl = (function (_super) {
    __extends(SwitchChangeHandlerImpl, _super);
    function SwitchChangeHandlerImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SwitchChangeHandlerImpl.initWithOwner = function (owner) {
        var handler = SwitchChangeHandlerImpl.new();
        handler._owner = owner;
        return handler;
    };
    SwitchChangeHandlerImpl.prototype.valueChanged = function (sender) {
        var owner = this._owner.get();
        if (owner) {
            switch_common_1.checkedProperty.nativeValueChange(owner, sender.on);
        }
    };
    SwitchChangeHandlerImpl.ObjCExposedMethods = {
        "valueChanged": { returns: interop.types.void, params: [UISwitch] }
    };
    return SwitchChangeHandlerImpl;
}(NSObject));
var zeroSize = { width: 0, height: 0 };
var Switch = (function (_super) {
    __extends(Switch, _super);
    function Switch() {
        var _this = _super.call(this) || this;
        _this.width = 51;
        _this.height = 31;
        return _this;
    }
    Switch.prototype.createNativeView = function () {
        return UISwitch.new();
    };
    Switch.prototype.initNativeView = function () {
        _super.prototype.initNativeView.call(this);
        var nativeView = this.nativeViewProtected;
        this._handler = SwitchChangeHandlerImpl.initWithOwner(new WeakRef(this));
        nativeView.addTargetActionForControlEvents(this._handler, "valueChanged", 4096);
    };
    Switch.prototype.disposeNativeView = function () {
        this._handler = null;
        _super.prototype.disposeNativeView.call(this);
    };
    Object.defineProperty(Switch.prototype, "ios", {
        get: function () {
            return this.nativeViewProtected;
        },
        enumerable: true,
        configurable: true
    });
    Switch.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        var nativeSize = this.nativeViewProtected.sizeThatFits(zeroSize);
        this.width = nativeSize.width;
        this.height = nativeSize.height;
        var widthAndState = Switch.resolveSizeAndState(switch_common_1.layout.toDevicePixels(nativeSize.width), switch_common_1.layout.toDevicePixels(51), switch_common_1.layout.EXACTLY, 0);
        var heightAndState = Switch.resolveSizeAndState(switch_common_1.layout.toDevicePixels(nativeSize.height), switch_common_1.layout.toDevicePixels(31), switch_common_1.layout.EXACTLY, 0);
        this.setMeasuredDimension(widthAndState, heightAndState);
    };
    Switch.prototype[switch_common_1.checkedProperty.getDefault] = function () {
        return false;
    };
    Switch.prototype[switch_common_1.checkedProperty.setNative] = function (value) {
        this.nativeViewProtected.on = value;
    };
    Switch.prototype[switch_common_1.colorProperty.getDefault] = function () {
        return this.nativeViewProtected.thumbTintColor;
    };
    Switch.prototype[switch_common_1.colorProperty.setNative] = function (value) {
        this.nativeViewProtected.thumbTintColor = value instanceof switch_common_1.Color ? value.ios : value;
    };
    Switch.prototype[switch_common_1.backgroundColorProperty.getDefault] = function () {
        return this.nativeViewProtected.onTintColor;
    };
    Switch.prototype[switch_common_1.backgroundColorProperty.setNative] = function (value) {
        this.nativeViewProtected.onTintColor = value instanceof switch_common_1.Color ? value.ios : value;
    };
    Switch.prototype[switch_common_1.backgroundInternalProperty.getDefault] = function () {
        return null;
    };
    Switch.prototype[switch_common_1.backgroundInternalProperty.setNative] = function (value) {
    };
    return Switch;
}(switch_common_1.SwitchBase));
exports.Switch = Switch;
//# sourceMappingURL=switch.ios.js.map