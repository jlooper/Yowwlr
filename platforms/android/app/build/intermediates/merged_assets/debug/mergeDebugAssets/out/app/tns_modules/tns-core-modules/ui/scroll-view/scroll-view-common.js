function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var content_view_1 = require("../content-view");
var profiling_1 = require("../../profiling");
__export(require("../content-view"));
var ScrollViewBase = (function (_super) {
    __extends(ScrollViewBase, _super);
    function ScrollViewBase() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._scrollChangeCount = 0;
        return _this;
    }
    ScrollViewBase_1 = ScrollViewBase;
    ScrollViewBase.prototype.addEventListener = function (arg, callback, thisArg) {
        _super.prototype.addEventListener.call(this, arg, callback, thisArg);
        if (arg === ScrollViewBase_1.scrollEvent) {
            this._scrollChangeCount++;
            this.attach();
        }
    };
    ScrollViewBase.prototype.removeEventListener = function (arg, callback, thisArg) {
        _super.prototype.removeEventListener.call(this, arg, callback, thisArg);
        if (arg === ScrollViewBase_1.scrollEvent) {
            this._scrollChangeCount--;
            this.dettach();
        }
    };
    ScrollViewBase.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        this.attach();
    };
    ScrollViewBase.prototype.onUnloaded = function () {
        _super.prototype.onUnloaded.call(this);
        this.dettach();
    };
    ScrollViewBase.prototype.attach = function () {
        if (this._scrollChangeCount > 0 && this.isLoaded) {
            this.attachNative();
        }
    };
    ScrollViewBase.prototype.dettach = function () {
        if (this._scrollChangeCount === 0 && this.isLoaded) {
            this.dettachNative();
        }
    };
    ScrollViewBase.prototype.attachNative = function () {
    };
    ScrollViewBase.prototype.dettachNative = function () {
    };
    Object.defineProperty(ScrollViewBase.prototype, "horizontalOffset", {
        get: function () {
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollViewBase.prototype, "verticalOffset", {
        get: function () {
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollViewBase.prototype, "scrollableWidth", {
        get: function () {
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollViewBase.prototype, "scrollableHeight", {
        get: function () {
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    var ScrollViewBase_1;
    ScrollViewBase.scrollEvent = "scroll";
    __decorate([
        profiling_1.profile
    ], ScrollViewBase.prototype, "onLoaded", null);
    ScrollViewBase = ScrollViewBase_1 = __decorate([
        content_view_1.CSSType("ScrollView")
    ], ScrollViewBase);
    return ScrollViewBase;
}(content_view_1.ContentView));
exports.ScrollViewBase = ScrollViewBase;
var converter = content_view_1.makeParser(content_view_1.makeValidator("horizontal", "vertical"));
exports.orientationProperty = new content_view_1.Property({
    name: "orientation", defaultValue: "vertical", affectsLayout: true,
    valueChanged: function (target, oldValue, newValue) {
        target._onOrientationChanged();
    },
    valueConverter: converter
});
exports.orientationProperty.register(ScrollViewBase);
exports.scrollBarIndicatorVisibleProperty = new content_view_1.Property({
    name: "scrollBarIndicatorVisible", defaultValue: true,
    valueConverter: content_view_1.booleanConverter
});
exports.scrollBarIndicatorVisibleProperty.register(ScrollViewBase);
exports.isScrollEnabledProperty = new content_view_1.Property({
    name: "isScrollEnabled", defaultValue: true,
    valueConverter: content_view_1.booleanConverter
});
exports.isScrollEnabledProperty.register(ScrollViewBase);
//# sourceMappingURL=scroll-view-common.js.map