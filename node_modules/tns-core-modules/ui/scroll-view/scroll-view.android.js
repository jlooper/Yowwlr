function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var scroll_view_common_1 = require("./scroll-view-common");
__export(require("./scroll-view-common"));
var ScrollView = (function (_super) {
    __extends(ScrollView, _super);
    function ScrollView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._androidViewId = -1;
        _this._lastScrollX = -1;
        _this._lastScrollY = -1;
        return _this;
    }
    Object.defineProperty(ScrollView.prototype, "horizontalOffset", {
        get: function () {
            var nativeView = this.nativeViewProtected;
            if (!nativeView) {
                return 0;
            }
            return nativeView.getScrollX() / scroll_view_common_1.layout.getDisplayDensity();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollView.prototype, "verticalOffset", {
        get: function () {
            var nativeView = this.nativeViewProtected;
            if (!nativeView) {
                return 0;
            }
            return nativeView.getScrollY() / scroll_view_common_1.layout.getDisplayDensity();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollView.prototype, "scrollableWidth", {
        get: function () {
            var nativeView = this.nativeViewProtected;
            if (!nativeView || this.orientation !== "horizontal") {
                return 0;
            }
            return nativeView.getScrollableLength() / scroll_view_common_1.layout.getDisplayDensity();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollView.prototype, "scrollableHeight", {
        get: function () {
            var nativeView = this.nativeViewProtected;
            if (!nativeView || this.orientation !== "vertical") {
                return 0;
            }
            return nativeView.getScrollableLength() / scroll_view_common_1.layout.getDisplayDensity();
        },
        enumerable: true,
        configurable: true
    });
    ScrollView.prototype[scroll_view_common_1.isUserInteractionEnabledProperty.setNative] = function (value) {
        this.nativeViewProtected.setClickable(value);
        this.nativeViewProtected.setFocusable(value);
        this.nativeViewProtected.setScrollEnabled(value);
    };
    ScrollView.prototype[scroll_view_common_1.isScrollEnabledProperty.getDefault] = function () {
        return this.nativeViewProtected.getScrollEnabled();
    };
    ScrollView.prototype[scroll_view_common_1.isScrollEnabledProperty.setNative] = function (value) {
        this.nativeViewProtected.setScrollEnabled(value);
    };
    ScrollView.prototype[scroll_view_common_1.scrollBarIndicatorVisibleProperty.getDefault] = function () {
        return true;
    };
    ScrollView.prototype[scroll_view_common_1.scrollBarIndicatorVisibleProperty.setNative] = function (value) {
        if (this.orientation === "horizontal") {
            this.nativeViewProtected.setHorizontalScrollBarEnabled(value);
        }
        else {
            this.nativeViewProtected.setVerticalScrollBarEnabled(value);
        }
    };
    ScrollView.prototype.scrollToVerticalOffset = function (value, animated) {
        var nativeView = this.nativeViewProtected;
        if (nativeView && this.orientation === "vertical" && this.isScrollEnabled) {
            value *= scroll_view_common_1.layout.getDisplayDensity();
            if (animated) {
                nativeView.smoothScrollTo(0, value);
            }
            else {
                nativeView.scrollTo(0, value);
            }
        }
    };
    ScrollView.prototype.scrollToHorizontalOffset = function (value, animated) {
        var nativeView = this.nativeViewProtected;
        if (nativeView && this.orientation === "horizontal" && this.isScrollEnabled) {
            value *= scroll_view_common_1.layout.getDisplayDensity();
            if (animated) {
                nativeView.smoothScrollTo(value, 0);
            }
            else {
                nativeView.scrollTo(value, 0);
            }
        }
    };
    ScrollView.prototype.createNativeView = function () {
        return this.orientation === "horizontal" ? new org.nativescript.widgets.HorizontalScrollView(this._context) : new org.nativescript.widgets.VerticalScrollView(this._context);
    };
    ScrollView.prototype.initNativeView = function () {
        _super.prototype.initNativeView.call(this);
        if (this._androidViewId < 0) {
            this._androidViewId = android.view.View.generateViewId();
        }
        this.nativeViewProtected.setId(this._androidViewId);
    };
    ScrollView.prototype._onOrientationChanged = function () {
        if (this.nativeViewProtected) {
            var parent_1 = this.parent;
            if (parent_1) {
                parent_1._removeView(this);
                parent_1._addView(this);
            }
        }
    };
    ScrollView.prototype.attachNative = function () {
        var that = new WeakRef(this);
        this.handler = new android.view.ViewTreeObserver.OnScrollChangedListener({
            onScrollChanged: function () {
                var owner = that.get();
                if (owner) {
                    owner._onScrollChanged();
                }
            }
        });
        this.nativeViewProtected.getViewTreeObserver().addOnScrollChangedListener(this.handler);
    };
    ScrollView.prototype._onScrollChanged = function () {
        var nativeView = this.nativeViewProtected;
        if (nativeView) {
            var newScrollX = nativeView.getScrollX();
            var newScrollY = nativeView.getScrollY();
            if (newScrollX !== this._lastScrollX || newScrollY !== this._lastScrollY) {
                this.notify({
                    object: this,
                    eventName: ScrollView.scrollEvent,
                    scrollX: newScrollX / scroll_view_common_1.layout.getDisplayDensity(),
                    scrollY: newScrollY / scroll_view_common_1.layout.getDisplayDensity()
                });
                this._lastScrollX = newScrollX;
                this._lastScrollY = newScrollY;
            }
        }
    };
    ScrollView.prototype.dettachNative = function () {
        this.nativeViewProtected.getViewTreeObserver().removeOnScrollChangedListener(this.handler);
        this.handler = null;
    };
    return ScrollView;
}(scroll_view_common_1.ScrollViewBase));
exports.ScrollView = ScrollView;
ScrollView.prototype.recycleNativeView = "never";
//# sourceMappingURL=scroll-view.android.js.map