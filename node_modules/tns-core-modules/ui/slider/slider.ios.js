function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var slider_common_1 = require("./slider-common");
__export(require("./slider-common"));
var SliderChangeHandlerImpl = (function (_super) {
    __extends(SliderChangeHandlerImpl, _super);
    function SliderChangeHandlerImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SliderChangeHandlerImpl.initWithOwner = function (owner) {
        var handler = SliderChangeHandlerImpl.new();
        handler._owner = owner;
        return handler;
    };
    SliderChangeHandlerImpl.prototype.sliderValueChanged = function (sender) {
        var owner = this._owner.get();
        if (owner) {
            slider_common_1.valueProperty.nativeValueChange(owner, sender.value);
        }
    };
    SliderChangeHandlerImpl.ObjCExposedMethods = {
        "sliderValueChanged": { returns: interop.types.void, params: [UISlider] }
    };
    return SliderChangeHandlerImpl;
}(NSObject));
var Slider = (function (_super) {
    __extends(Slider, _super);
    function Slider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Slider.prototype.createNativeView = function () {
        return UISlider.new();
    };
    Slider.prototype.initNativeView = function () {
        _super.prototype.initNativeView.call(this);
        var nativeView = this.nativeViewProtected;
        nativeView.minimumValue = 0;
        nativeView.maximumValue = this.maxValue;
        this._changeHandler = SliderChangeHandlerImpl.initWithOwner(new WeakRef(this));
        nativeView.addTargetActionForControlEvents(this._changeHandler, "sliderValueChanged", 4096);
    };
    Slider.prototype.disposeNativeView = function () {
        this._changeHandler = null;
        _super.prototype.disposeNativeView.call(this);
    };
    Object.defineProperty(Slider.prototype, "ios", {
        get: function () {
            return this.nativeViewProtected;
        },
        enumerable: true,
        configurable: true
    });
    Slider.prototype[slider_common_1.valueProperty.getDefault] = function () {
        return 0;
    };
    Slider.prototype[slider_common_1.valueProperty.setNative] = function (value) {
        this.ios.value = value;
    };
    Slider.prototype[slider_common_1.minValueProperty.getDefault] = function () {
        return 0;
    };
    Slider.prototype[slider_common_1.minValueProperty.setNative] = function (value) {
        this.ios.minimumValue = value;
    };
    Slider.prototype[slider_common_1.maxValueProperty.getDefault] = function () {
        return 100;
    };
    Slider.prototype[slider_common_1.maxValueProperty.setNative] = function (value) {
        this.ios.maximumValue = value;
    };
    Slider.prototype[slider_common_1.colorProperty.getDefault] = function () {
        return this.ios.thumbTintColor;
    };
    Slider.prototype[slider_common_1.colorProperty.setNative] = function (value) {
        var color = value instanceof slider_common_1.Color ? value.ios : value;
        this.ios.thumbTintColor = color;
    };
    Slider.prototype[slider_common_1.backgroundColorProperty.getDefault] = function () {
        return this.ios.minimumTrackTintColor;
    };
    Slider.prototype[slider_common_1.backgroundColorProperty.setNative] = function (value) {
        var color = value instanceof slider_common_1.Color ? value.ios : value;
        this.ios.minimumTrackTintColor = color;
    };
    Slider.prototype[slider_common_1.backgroundInternalProperty.getDefault] = function () {
        return null;
    };
    Slider.prototype[slider_common_1.backgroundInternalProperty.setNative] = function (value) {
    };
    return Slider;
}(slider_common_1.SliderBase));
exports.Slider = Slider;
//# sourceMappingURL=slider.ios.js.map