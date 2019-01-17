function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var activity_indicator_common_1 = require("./activity-indicator-common");
__export(require("./activity-indicator-common"));
var ActivityIndicator = (function (_super) {
    __extends(ActivityIndicator, _super);
    function ActivityIndicator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ActivityIndicator.prototype.createNativeView = function () {
        var view = UIActivityIndicatorView.alloc().initWithActivityIndicatorStyle(2);
        view.hidesWhenStopped = true;
        return view;
    };
    Object.defineProperty(ActivityIndicator.prototype, "ios", {
        get: function () {
            return this.nativeViewProtected;
        },
        enumerable: true,
        configurable: true
    });
    ActivityIndicator.prototype[activity_indicator_common_1.busyProperty.getDefault] = function () {
        if (this.nativeViewProtected.isAnimating) {
            return this.nativeViewProtected.isAnimating();
        }
        else {
            return this.nativeViewProtected.animating;
        }
    };
    ActivityIndicator.prototype[activity_indicator_common_1.busyProperty.setNative] = function (value) {
        var nativeView = this.nativeViewProtected;
        if (value) {
            nativeView.startAnimating();
        }
        else {
            nativeView.stopAnimating();
        }
        if (nativeView.hidesWhenStopped) {
            this.requestLayout();
        }
    };
    ActivityIndicator.prototype[activity_indicator_common_1.colorProperty.getDefault] = function () {
        return this.nativeViewProtected.color;
    };
    ActivityIndicator.prototype[activity_indicator_common_1.colorProperty.setNative] = function (value) {
        this.nativeViewProtected.color = value instanceof activity_indicator_common_1.Color ? value.ios : value;
    };
    return ActivityIndicator;
}(activity_indicator_common_1.ActivityIndicatorBase));
exports.ActivityIndicator = ActivityIndicator;
//# sourceMappingURL=activity-indicator.ios.js.map