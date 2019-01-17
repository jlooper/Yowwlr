function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var progress_common_1 = require("./progress-common");
__export(require("./progress-common"));
var Progress = (function (_super) {
    __extends(Progress, _super);
    function Progress() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Progress.prototype.createNativeView = function () {
        return UIProgressView.new();
    };
    Object.defineProperty(Progress.prototype, "ios", {
        get: function () {
            return this.nativeViewProtected;
        },
        enumerable: true,
        configurable: true
    });
    Progress.prototype[progress_common_1.valueProperty.getDefault] = function () {
        return 0;
    };
    Progress.prototype[progress_common_1.valueProperty.setNative] = function (value) {
        this.ios.progress = value / this.maxValue;
    };
    Progress.prototype[progress_common_1.maxValueProperty.getDefault] = function () {
        return 100;
    };
    Progress.prototype[progress_common_1.maxValueProperty.setNative] = function (value) {
        this.ios.progress = this.value / value;
    };
    Progress.prototype[progress_common_1.colorProperty.getDefault] = function () {
        return this.ios.progressTintColor;
    };
    Progress.prototype[progress_common_1.colorProperty.setNative] = function (value) {
        this.ios.progressTintColor = value instanceof progress_common_1.Color ? value.ios : value;
    };
    Progress.prototype[progress_common_1.backgroundColorProperty.getDefault] = function () {
        return this.ios.trackTintColor;
    };
    Progress.prototype[progress_common_1.backgroundColorProperty.setNative] = function (value) {
        var color = value instanceof progress_common_1.Color ? value.ios : value;
        this.ios.trackTintColor = color;
    };
    Progress.prototype[progress_common_1.backgroundInternalProperty.getDefault] = function () {
        return null;
    };
    Progress.prototype[progress_common_1.backgroundInternalProperty.setNative] = function (value) {
    };
    return Progress;
}(progress_common_1.ProgressBase));
exports.Progress = Progress;
//# sourceMappingURL=progress.ios.js.map