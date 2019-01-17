function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var slider_common_1 = require("./slider-common");
__export(require("./slider-common"));
var SeekBar;
var SeekBarChangeListener;
function initializeListenerClass() {
    if (!SeekBarChangeListener) {
        var SeekBarChangeListenerImpl = (function (_super) {
            __extends(SeekBarChangeListenerImpl, _super);
            function SeekBarChangeListenerImpl() {
                var _this = _super.call(this) || this;
                return global.__native(_this);
            }
            SeekBarChangeListenerImpl.prototype.onProgressChanged = function (seekBar, progress, fromUser) {
                var owner = seekBar.owner;
                if (owner && !owner._supressNativeValue) {
                    var newValue = progress + owner.minValue;
                    slider_common_1.valueProperty.nativeValueChange(owner, newValue);
                }
            };
            SeekBarChangeListenerImpl.prototype.onStartTrackingTouch = function (seekBar) {
            };
            SeekBarChangeListenerImpl.prototype.onStopTrackingTouch = function (seekBar) {
            };
            SeekBarChangeListenerImpl = __decorate([
                Interfaces([android.widget.SeekBar.OnSeekBarChangeListener])
            ], SeekBarChangeListenerImpl);
            return SeekBarChangeListenerImpl;
        }(java.lang.Object));
        SeekBarChangeListener = new SeekBarChangeListenerImpl();
    }
}
function getListener() {
    return SeekBarChangeListener;
}
var Slider = (function (_super) {
    __extends(Slider, _super);
    function Slider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Slider.prototype.createNativeView = function () {
        if (!SeekBar) {
            SeekBar = android.widget.SeekBar;
        }
        return new SeekBar(this._context);
    };
    Slider.prototype.initNativeView = function () {
        _super.prototype.initNativeView.call(this);
        var nativeView = this.nativeViewProtected;
        nativeView.owner = this;
        initializeListenerClass();
        var listener = getListener();
        nativeView.setOnSeekBarChangeListener(listener);
    };
    Slider.prototype.disposeNativeView = function () {
        this.nativeViewProtected.owner = null;
        _super.prototype.disposeNativeView.call(this);
    };
    Slider.prototype.resetNativeView = function () {
        _super.prototype.resetNativeView.call(this);
        var nativeView = this.nativeViewProtected;
        nativeView.setMax(100);
        nativeView.setProgress(0);
        nativeView.setKeyProgressIncrement(1);
    };
    Slider.prototype.setNativeValuesSilently = function () {
        this._supressNativeValue = true;
        var nativeView = this.nativeViewProtected;
        try {
            nativeView.setMax(this.maxValue - this.minValue);
            nativeView.setProgress(this.value - this.minValue);
        }
        finally {
            this._supressNativeValue = false;
        }
    };
    Slider.prototype[slider_common_1.valueProperty.setNative] = function (value) {
        this.setNativeValuesSilently();
    };
    Slider.prototype[slider_common_1.minValueProperty.setNative] = function (value) {
        this.setNativeValuesSilently();
    };
    Slider.prototype[slider_common_1.maxValueProperty.getDefault] = function () {
        return 100;
    };
    Slider.prototype[slider_common_1.maxValueProperty.setNative] = function (value) {
        this.setNativeValuesSilently();
    };
    Slider.prototype[slider_common_1.colorProperty.getDefault] = function () {
        return -1;
    };
    Slider.prototype[slider_common_1.colorProperty.setNative] = function (value) {
        if (value instanceof slider_common_1.Color) {
            this.nativeViewProtected.getThumb().setColorFilter(value.android, android.graphics.PorterDuff.Mode.SRC_IN);
        }
        else {
            this.nativeViewProtected.getThumb().clearColorFilter();
        }
    };
    Slider.prototype[slider_common_1.backgroundColorProperty.getDefault] = function () {
        return -1;
    };
    Slider.prototype[slider_common_1.backgroundColorProperty.setNative] = function (value) {
        if (value instanceof slider_common_1.Color) {
            this.nativeViewProtected.getProgressDrawable().setColorFilter(value.android, android.graphics.PorterDuff.Mode.SRC_IN);
        }
        else {
            this.nativeViewProtected.getProgressDrawable().clearColorFilter();
        }
    };
    Slider.prototype[slider_common_1.backgroundInternalProperty.getDefault] = function () {
        return null;
    };
    Slider.prototype[slider_common_1.backgroundInternalProperty.setNative] = function (value) {
    };
    return Slider;
}(slider_common_1.SliderBase));
exports.Slider = Slider;
//# sourceMappingURL=slider.android.js.map