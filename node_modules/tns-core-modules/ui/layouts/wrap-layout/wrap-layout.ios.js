function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var wrap_layout_common_1 = require("./wrap-layout-common");
__export(require("./wrap-layout-common"));
var WrapLayout = (function (_super) {
    __extends(WrapLayout, _super);
    function WrapLayout() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._lengths = new Array();
        return _this;
    }
    WrapLayout.getChildMeasureSpec = function (parentMode, parentLength, itemLength) {
        if (itemLength > 0) {
            return wrap_layout_common_1.layout.makeMeasureSpec(itemLength, wrap_layout_common_1.layout.EXACTLY);
        }
        else if (parentMode === wrap_layout_common_1.layout.UNSPECIFIED) {
            return wrap_layout_common_1.layout.makeMeasureSpec(0, wrap_layout_common_1.layout.UNSPECIFIED);
        }
        else {
            return wrap_layout_common_1.layout.makeMeasureSpec(parentLength, wrap_layout_common_1.layout.AT_MOST);
        }
    };
    WrapLayout.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        var _this = this;
        _super.prototype.onMeasure.call(this, widthMeasureSpec, heightMeasureSpec);
        var measureWidth = 0;
        var measureHeight = 0;
        var width = wrap_layout_common_1.layout.getMeasureSpecSize(widthMeasureSpec);
        var widthMode = wrap_layout_common_1.layout.getMeasureSpecMode(widthMeasureSpec);
        var height = wrap_layout_common_1.layout.getMeasureSpecSize(heightMeasureSpec);
        var heightMode = wrap_layout_common_1.layout.getMeasureSpecMode(heightMeasureSpec);
        var horizontalPaddingsAndMargins = this.effectivePaddingLeft + this.effectivePaddingRight + this.effectiveBorderLeftWidth + this.effectiveBorderRightWidth;
        var verticalPaddingsAndMargins = this.effectivePaddingTop + this.effectivePaddingBottom + this.effectiveBorderTopWidth + this.effectiveBorderBottomWidth;
        var availableWidth = widthMode === wrap_layout_common_1.layout.UNSPECIFIED ? Number.MAX_VALUE : width - horizontalPaddingsAndMargins;
        var availableHeight = heightMode === wrap_layout_common_1.layout.UNSPECIFIED ? Number.MAX_VALUE : height - verticalPaddingsAndMargins;
        var childWidthMeasureSpec = WrapLayout.getChildMeasureSpec(widthMode, availableWidth, this.effectiveItemWidth);
        var childHeightMeasureSpec = WrapLayout.getChildMeasureSpec(heightMode, availableHeight, this.effectiveItemHeight);
        var remainingWidth = availableWidth;
        var remainingHeight = availableHeight;
        this._lengths.length = 0;
        var rowOrColumn = 0;
        var maxLength = 0;
        var isVertical = this.orientation === "vertical";
        var useItemWidth = this.effectiveItemWidth > 0;
        var useItemHeight = this.effectiveItemHeight > 0;
        var itemWidth = this.effectiveItemWidth;
        var itemHeight = this.effectiveItemHeight;
        this.eachLayoutChild(function (child, last) {
            var desiredSize = wrap_layout_common_1.View.measureChild(_this, child, childWidthMeasureSpec, childHeightMeasureSpec);
            var childMeasuredWidth = useItemWidth ? itemWidth : desiredSize.measuredWidth;
            var childMeasuredHeight = useItemHeight ? itemHeight : desiredSize.measuredHeight;
            var isFirst = _this._lengths.length <= rowOrColumn;
            if (isVertical) {
                if (childMeasuredHeight > remainingHeight) {
                    rowOrColumn++;
                    maxLength = Math.max(maxLength, measureHeight);
                    measureHeight = childMeasuredHeight;
                    remainingHeight = availableHeight - childMeasuredHeight;
                    _this._lengths[isFirst ? rowOrColumn - 1 : rowOrColumn] = childMeasuredWidth;
                }
                else {
                    remainingHeight -= childMeasuredHeight;
                    measureHeight += childMeasuredHeight;
                }
            }
            else {
                if (childMeasuredWidth > remainingWidth) {
                    rowOrColumn++;
                    maxLength = Math.max(maxLength, measureWidth);
                    measureWidth = childMeasuredWidth;
                    remainingWidth = availableWidth - childMeasuredWidth;
                    _this._lengths[isFirst ? rowOrColumn - 1 : rowOrColumn] = childMeasuredHeight;
                }
                else {
                    remainingWidth -= childMeasuredWidth;
                    measureWidth += childMeasuredWidth;
                }
            }
            if (isFirst) {
                _this._lengths[rowOrColumn] = isVertical ? childMeasuredWidth : childMeasuredHeight;
            }
            else {
                _this._lengths[rowOrColumn] = Math.max(_this._lengths[rowOrColumn], isVertical ? childMeasuredWidth : childMeasuredHeight);
            }
        });
        if (isVertical) {
            measureHeight = Math.max(maxLength, measureHeight);
            this._lengths.forEach(function (value, index, array) {
                measureWidth += value;
            });
        }
        else {
            measureWidth = Math.max(maxLength, measureWidth);
            this._lengths.forEach(function (value, index, array) {
                measureHeight += value;
            });
        }
        measureWidth += horizontalPaddingsAndMargins;
        measureHeight += verticalPaddingsAndMargins;
        measureWidth = Math.max(measureWidth, this.effectiveMinWidth);
        measureHeight = Math.max(measureHeight, this.effectiveMinHeight);
        var widthAndState = wrap_layout_common_1.View.resolveSizeAndState(measureWidth, width, widthMode, 0);
        var heightAndState = wrap_layout_common_1.View.resolveSizeAndState(measureHeight, height, heightMode, 0);
        this.setMeasuredDimension(widthAndState, heightAndState);
    };
    WrapLayout.prototype.onLayout = function (left, top, right, bottom) {
        var _this = this;
        _super.prototype.onLayout.call(this, left, top, right, bottom);
        var insets = this.getSafeAreaInsets();
        var isVertical = this.orientation === "vertical";
        var paddingLeft = this.effectiveBorderLeftWidth + this.effectivePaddingLeft + insets.left;
        var paddingTop = this.effectiveBorderTopWidth + this.effectivePaddingTop + insets.top;
        var paddingRight = this.effectiveBorderRightWidth + this.effectivePaddingRight + insets.right;
        var paddingBottom = this.effectiveBorderBottomWidth + this.effectivePaddingBottom + insets.bottom;
        var childLeft = paddingLeft;
        var childTop = paddingTop;
        var childrenHeight = bottom - top - paddingBottom;
        var childrenWidth = right - left - paddingRight;
        var rowOrColumn = 0;
        this.eachLayoutChild(function (child, last) {
            var childHeight = child.getMeasuredHeight() + child.effectiveMarginTop + child.effectiveMarginBottom;
            var childWidth = child.getMeasuredWidth() + child.effectiveMarginLeft + child.effectiveMarginRight;
            var length = _this._lengths[rowOrColumn];
            if (isVertical) {
                childWidth = length;
                childHeight = _this.effectiveItemHeight > 0 ? _this.effectiveItemHeight : childHeight;
                var isFirst = childTop === paddingTop;
                if (childTop + childHeight > childrenHeight && childLeft + childWidth <= childrenWidth) {
                    childTop = paddingTop;
                    if (!isFirst) {
                        childLeft += length;
                    }
                    rowOrColumn++;
                    childWidth = _this._lengths[isFirst ? rowOrColumn - 1 : rowOrColumn];
                }
                if (childLeft < childrenWidth && childTop < childrenHeight) {
                    wrap_layout_common_1.View.layoutChild(_this, child, childLeft, childTop, childLeft + childWidth, childTop + childHeight);
                }
                childTop += childHeight;
            }
            else {
                childWidth = _this.effectiveItemWidth > 0 ? _this.effectiveItemWidth : childWidth;
                childHeight = length;
                var isFirst = childLeft === paddingLeft;
                if (childLeft + childWidth > childrenWidth && childTop + childHeight <= childrenHeight) {
                    childLeft = paddingLeft;
                    if (!isFirst) {
                        childTop += length;
                    }
                    rowOrColumn++;
                    childHeight = _this._lengths[isFirst ? rowOrColumn - 1 : rowOrColumn];
                }
                if (childLeft < childrenWidth && childTop < childrenHeight) {
                    wrap_layout_common_1.View.layoutChild(_this, child, childLeft, childTop, childLeft + childWidth, childTop + childHeight);
                }
                childLeft += childWidth;
            }
        });
    };
    return WrapLayout;
}(wrap_layout_common_1.WrapLayoutBase));
exports.WrapLayout = WrapLayout;
//# sourceMappingURL=wrap-layout.ios.js.map