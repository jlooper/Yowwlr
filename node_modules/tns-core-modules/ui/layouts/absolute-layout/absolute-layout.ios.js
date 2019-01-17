function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var absolute_layout_common_1 = require("./absolute-layout-common");
__export(require("./absolute-layout-common"));
var AbsoluteLayout = (function (_super) {
    __extends(AbsoluteLayout, _super);
    function AbsoluteLayout() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AbsoluteLayout.prototype.onLeftChanged = function (view, oldValue, newValue) {
        this.requestLayout();
    };
    AbsoluteLayout.prototype.onTopChanged = function (view, oldValue, newValue) {
        this.requestLayout();
    };
    AbsoluteLayout.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        var _this = this;
        _super.prototype.onMeasure.call(this, widthMeasureSpec, heightMeasureSpec);
        var measureWidth = 0;
        var measureHeight = 0;
        var width = absolute_layout_common_1.layout.getMeasureSpecSize(widthMeasureSpec);
        var widthMode = absolute_layout_common_1.layout.getMeasureSpecMode(widthMeasureSpec);
        var height = absolute_layout_common_1.layout.getMeasureSpecSize(heightMeasureSpec);
        var heightMode = absolute_layout_common_1.layout.getMeasureSpecMode(heightMeasureSpec);
        var childMeasureSpec = absolute_layout_common_1.layout.makeMeasureSpec(0, absolute_layout_common_1.layout.UNSPECIFIED);
        this.eachLayoutChild(function (child, last) {
            var childSize = absolute_layout_common_1.View.measureChild(_this, child, childMeasureSpec, childMeasureSpec);
            measureWidth = Math.max(measureWidth, child.effectiveLeft + childSize.measuredWidth);
            measureHeight = Math.max(measureHeight, child.effectiveTop + childSize.measuredHeight);
        });
        measureWidth += this.effectiveBorderLeftWidth + this.effectivePaddingLeft + this.effectivePaddingRight + this.effectiveBorderRightWidth;
        measureHeight += this.effectiveBorderTopWidth + this.effectivePaddingTop + this.effectivePaddingBottom + this.effectiveBorderBottomWidth;
        measureWidth = Math.max(measureWidth, this.effectiveMinWidth);
        measureHeight = Math.max(measureHeight, this.effectiveMinHeight);
        var widthAndState = absolute_layout_common_1.View.resolveSizeAndState(measureWidth, width, widthMode, 0);
        var heightAndState = absolute_layout_common_1.View.resolveSizeAndState(measureHeight, height, heightMode, 0);
        this.setMeasuredDimension(widthAndState, heightAndState);
    };
    AbsoluteLayout.prototype.onLayout = function (left, top, right, bottom) {
        var _this = this;
        _super.prototype.onLayout.call(this, left, top, right, bottom);
        var insets = this.getSafeAreaInsets();
        this.eachLayoutChild(function (child, last) {
            var childWidth = child.getMeasuredWidth();
            var childHeight = child.getMeasuredHeight();
            var childLeft = _this.effectiveBorderLeftWidth + _this.effectivePaddingLeft + child.effectiveLeft + insets.left;
            var childTop = _this.effectiveBorderTopWidth + _this.effectivePaddingTop + child.effectiveTop + insets.top;
            var childRight = childLeft + childWidth + child.effectiveMarginLeft + child.effectiveMarginRight;
            var childBottom = childTop + childHeight + child.effectiveMarginTop + child.effectiveMarginBottom;
            absolute_layout_common_1.View.layoutChild(_this, child, childLeft, childTop, childRight, childBottom);
        });
    };
    return AbsoluteLayout;
}(absolute_layout_common_1.AbsoluteLayoutBase));
exports.AbsoluteLayout = AbsoluteLayout;
//# sourceMappingURL=absolute-layout.ios.js.map