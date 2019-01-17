function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var stack_layout_common_1 = require("./stack-layout-common");
__export(require("./stack-layout-common"));
var StackLayout = (function (_super) {
    __extends(StackLayout, _super);
    function StackLayout() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._totalLength = 0;
        return _this;
    }
    StackLayout.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        var _this = this;
        _super.prototype.onMeasure.call(this, widthMeasureSpec, heightMeasureSpec);
        var measureWidth = 0;
        var measureHeight = 0;
        var width = stack_layout_common_1.layout.getMeasureSpecSize(widthMeasureSpec);
        var widthMode = stack_layout_common_1.layout.getMeasureSpecMode(widthMeasureSpec);
        var height = stack_layout_common_1.layout.getMeasureSpecSize(heightMeasureSpec);
        var heightMode = stack_layout_common_1.layout.getMeasureSpecMode(heightMeasureSpec);
        var isVertical = this.orientation === "vertical";
        var horizontalPaddingsAndMargins = this.effectivePaddingLeft + this.effectivePaddingRight + this.effectiveBorderLeftWidth + this.effectiveBorderRightWidth;
        var verticalPaddingsAndMargins = this.effectivePaddingTop + this.effectivePaddingBottom + this.effectiveBorderTopWidth + this.effectiveBorderBottomWidth;
        var measureSpec;
        var mode = isVertical ? heightMode : widthMode;
        var remainingLength;
        if (mode === stack_layout_common_1.layout.UNSPECIFIED) {
            measureSpec = stack_layout_common_1.layout.UNSPECIFIED;
            remainingLength = 0;
        }
        else {
            measureSpec = stack_layout_common_1.layout.AT_MOST;
            remainingLength = isVertical ? height - verticalPaddingsAndMargins : width - horizontalPaddingsAndMargins;
        }
        var childMeasureSpec;
        if (isVertical) {
            var childWidth = (widthMode === stack_layout_common_1.layout.UNSPECIFIED) ? 0 : width - horizontalPaddingsAndMargins;
            childWidth = Math.max(0, childWidth);
            childMeasureSpec = stack_layout_common_1.layout.makeMeasureSpec(childWidth, widthMode);
        }
        else {
            var childHeight = (heightMode === stack_layout_common_1.layout.UNSPECIFIED) ? 0 : height - verticalPaddingsAndMargins;
            childHeight = Math.max(0, childHeight);
            childMeasureSpec = stack_layout_common_1.layout.makeMeasureSpec(childHeight, heightMode);
        }
        var childSize;
        this.eachLayoutChild(function (child, last) {
            if (isVertical) {
                childSize = stack_layout_common_1.View.measureChild(_this, child, childMeasureSpec, stack_layout_common_1.layout.makeMeasureSpec(remainingLength, measureSpec));
                measureWidth = Math.max(measureWidth, childSize.measuredWidth);
                var viewHeight = childSize.measuredHeight;
                measureHeight += viewHeight;
                remainingLength = Math.max(0, remainingLength - viewHeight);
            }
            else {
                childSize = stack_layout_common_1.View.measureChild(_this, child, stack_layout_common_1.layout.makeMeasureSpec(remainingLength, measureSpec), childMeasureSpec);
                measureHeight = Math.max(measureHeight, childSize.measuredHeight);
                var viewWidth = childSize.measuredWidth;
                measureWidth += viewWidth;
                remainingLength = Math.max(0, remainingLength - viewWidth);
            }
        });
        measureWidth += horizontalPaddingsAndMargins;
        measureHeight += verticalPaddingsAndMargins;
        measureWidth = Math.max(measureWidth, this.effectiveMinWidth);
        measureHeight = Math.max(measureHeight, this.effectiveMinHeight);
        this._totalLength = isVertical ? measureHeight : measureWidth;
        var widthAndState = stack_layout_common_1.View.resolveSizeAndState(measureWidth, width, widthMode, 0);
        var heightAndState = stack_layout_common_1.View.resolveSizeAndState(measureHeight, height, heightMode, 0);
        this.setMeasuredDimension(widthAndState, heightAndState);
    };
    StackLayout.prototype.onLayout = function (left, top, right, bottom) {
        _super.prototype.onLayout.call(this, left, top, right, bottom);
        var insets = this.getSafeAreaInsets();
        if (this.orientation === "vertical") {
            this.layoutVertical(left, top, right, bottom, insets);
        }
        else {
            this.layoutHorizontal(left, top, right, bottom, insets);
        }
    };
    StackLayout.prototype.layoutVertical = function (left, top, right, bottom, insets) {
        var _this = this;
        var paddingLeft = this.effectiveBorderLeftWidth + this.effectivePaddingLeft + insets.left;
        var paddingTop = this.effectiveBorderTopWidth + this.effectivePaddingTop + insets.top;
        var paddingRight = this.effectiveBorderRightWidth + this.effectivePaddingRight + insets.right;
        var paddingBottom = this.effectiveBorderBottomWidth + this.effectivePaddingBottom + insets.bottom;
        var childTop;
        var childLeft = paddingLeft;
        var childRight = right - left - paddingRight;
        switch (this.verticalAlignment) {
            case stack_layout_common_1.VerticalAlignment.MIDDLE:
                childTop = (bottom - top - this._totalLength) / 2 + paddingTop - paddingBottom;
                break;
            case stack_layout_common_1.VerticalAlignment.BOTTOM:
                childTop = bottom - top - this._totalLength + paddingTop - paddingBottom;
                break;
            case stack_layout_common_1.VerticalAlignment.TOP:
            case stack_layout_common_1.VerticalAlignment.STRETCH:
            default:
                childTop = paddingTop;
                break;
        }
        this.eachLayoutChild(function (child, last) {
            var childHeight = child.getMeasuredHeight() + child.effectiveMarginTop + child.effectiveMarginBottom;
            stack_layout_common_1.View.layoutChild(_this, child, childLeft, childTop, childRight, childTop + childHeight);
            childTop += childHeight;
        });
    };
    StackLayout.prototype.layoutHorizontal = function (left, top, right, bottom, insets) {
        var _this = this;
        var paddingLeft = this.effectiveBorderLeftWidth + this.effectivePaddingLeft + insets.left;
        var paddingTop = this.effectiveBorderTopWidth + this.effectivePaddingTop + insets.top;
        var paddingRight = this.effectiveBorderRightWidth + this.effectivePaddingRight + insets.right;
        var paddingBottom = this.effectiveBorderBottomWidth + this.effectivePaddingBottom + insets.bottom;
        var childTop = paddingTop;
        var childLeft;
        var childBottom = bottom - top - paddingBottom;
        switch (this.horizontalAlignment) {
            case stack_layout_common_1.HorizontalAlignment.CENTER:
                childLeft = (right - left - this._totalLength) / 2 + paddingLeft - paddingRight;
                break;
            case stack_layout_common_1.HorizontalAlignment.RIGHT:
                childLeft = right - left - this._totalLength + paddingLeft - paddingRight;
                break;
            case stack_layout_common_1.HorizontalAlignment.LEFT:
            case stack_layout_common_1.HorizontalAlignment.STRETCH:
            default:
                childLeft = paddingLeft;
                break;
        }
        this.eachLayoutChild(function (child, last) {
            var childWidth = child.getMeasuredWidth() + child.effectiveMarginLeft + child.effectiveMarginRight;
            stack_layout_common_1.View.layoutChild(_this, child, childLeft, childTop, childLeft + childWidth, childBottom);
            childLeft += childWidth;
        });
    };
    return StackLayout;
}(stack_layout_common_1.StackLayoutBase));
exports.StackLayout = StackLayout;
//# sourceMappingURL=stack-layout.ios.js.map