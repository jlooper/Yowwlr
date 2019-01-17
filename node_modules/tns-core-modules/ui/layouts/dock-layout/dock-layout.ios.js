function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var dock_layout_common_1 = require("./dock-layout-common");
__export(require("./dock-layout-common"));
var DockLayout = (function (_super) {
    __extends(DockLayout, _super);
    function DockLayout() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DockLayout.prototype.onDockChanged = function (view, oldValue, newValue) {
        this.requestLayout();
    };
    DockLayout.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        var _this = this;
        _super.prototype.onMeasure.call(this, widthMeasureSpec, heightMeasureSpec);
        var measureWidth = 0;
        var measureHeight = 0;
        var width = dock_layout_common_1.layout.getMeasureSpecSize(widthMeasureSpec);
        var widthMode = dock_layout_common_1.layout.getMeasureSpecMode(widthMeasureSpec);
        var height = dock_layout_common_1.layout.getMeasureSpecSize(heightMeasureSpec);
        var heightMode = dock_layout_common_1.layout.getMeasureSpecMode(heightMeasureSpec);
        var horizontalPaddingsAndMargins = this.effectivePaddingLeft + this.effectivePaddingRight + this.effectiveBorderLeftWidth + this.effectiveBorderRightWidth;
        var verticalPaddingsAndMargins = this.effectivePaddingTop + this.effectivePaddingBottom + this.effectiveBorderTopWidth + this.effectiveBorderBottomWidth;
        var remainingWidth = widthMode === dock_layout_common_1.layout.UNSPECIFIED ? Number.MAX_VALUE : width - horizontalPaddingsAndMargins;
        var remainingHeight = heightMode === dock_layout_common_1.layout.UNSPECIFIED ? Number.MAX_VALUE : height - verticalPaddingsAndMargins;
        var tempHeight = 0;
        var tempWidth = 0;
        var childWidthMeasureSpec;
        var childHeightMeasureSpec;
        this.eachLayoutChild(function (child, last) {
            if (_this.stretchLastChild && last) {
                childWidthMeasureSpec = dock_layout_common_1.layout.makeMeasureSpec(remainingWidth, widthMode);
                childHeightMeasureSpec = dock_layout_common_1.layout.makeMeasureSpec(remainingHeight, heightMode);
            }
            else {
                childWidthMeasureSpec = dock_layout_common_1.layout.makeMeasureSpec(remainingWidth, widthMode === dock_layout_common_1.layout.EXACTLY ? dock_layout_common_1.layout.AT_MOST : widthMode);
                childHeightMeasureSpec = dock_layout_common_1.layout.makeMeasureSpec(remainingHeight, heightMode === dock_layout_common_1.layout.EXACTLY ? dock_layout_common_1.layout.AT_MOST : heightMode);
            }
            var childSize = dock_layout_common_1.View.measureChild(_this, child, childWidthMeasureSpec, childHeightMeasureSpec);
            switch (child.dock) {
                case "top":
                case "bottom":
                    remainingHeight = Math.max(0, remainingHeight - childSize.measuredHeight);
                    tempHeight += childSize.measuredHeight;
                    measureWidth = Math.max(measureWidth, tempWidth + childSize.measuredWidth);
                    measureHeight = Math.max(measureHeight, tempHeight);
                    break;
                case "left":
                case "right":
                default:
                    remainingWidth = Math.max(0, remainingWidth - childSize.measuredWidth);
                    tempWidth += childSize.measuredWidth;
                    measureWidth = Math.max(measureWidth, tempWidth);
                    measureHeight = Math.max(measureHeight, tempHeight + childSize.measuredHeight);
                    break;
            }
        });
        measureWidth += horizontalPaddingsAndMargins;
        measureHeight += verticalPaddingsAndMargins;
        measureWidth = Math.max(measureWidth, this.effectiveMinWidth);
        measureHeight = Math.max(measureHeight, this.effectiveMinHeight);
        var widthAndState = dock_layout_common_1.View.resolveSizeAndState(measureWidth, width, widthMode, 0);
        var heightAndState = dock_layout_common_1.View.resolveSizeAndState(measureHeight, height, heightMode, 0);
        this.setMeasuredDimension(widthAndState, heightAndState);
    };
    DockLayout.prototype.onLayout = function (left, top, right, bottom) {
        var _this = this;
        _super.prototype.onLayout.call(this, left, top, right, bottom);
        var insets = this.getSafeAreaInsets();
        var horizontalPaddingsAndMargins = this.effectivePaddingLeft + this.effectivePaddingRight + this.effectiveBorderLeftWidth + this.effectiveBorderRightWidth + insets.left + insets.right;
        var verticalPaddingsAndMargins = this.effectivePaddingTop + this.effectivePaddingBottom + this.effectiveBorderTopWidth + this.effectiveBorderBottomWidth + insets.top + insets.bottom;
        var childLeft = this.effectiveBorderLeftWidth + this.effectivePaddingLeft + insets.left;
        var childTop = this.effectiveBorderTopWidth + this.effectivePaddingTop + insets.top;
        var x = childLeft;
        var y = childTop;
        var remainingWidth = Math.max(0, right - left - horizontalPaddingsAndMargins);
        var remainingHeight = Math.max(0, bottom - top - verticalPaddingsAndMargins);
        this.eachLayoutChild(function (child, last) {
            var childWidth = child.getMeasuredWidth() + child.effectiveMarginLeft + child.effectiveMarginRight;
            var childHeight = child.getMeasuredHeight() + child.effectiveMarginTop + child.effectiveMarginBottom;
            if (last && _this.stretchLastChild) {
                dock_layout_common_1.View.layoutChild(_this, child, x, y, x + remainingWidth, y + remainingHeight);
                return;
            }
            var dock = DockLayout.getDock(child);
            switch (dock) {
                case "top":
                    childLeft = x;
                    childTop = y;
                    childWidth = remainingWidth;
                    y += childHeight;
                    remainingHeight = Math.max(0, remainingHeight - childHeight);
                    break;
                case "bottom":
                    childLeft = x;
                    childTop = y + remainingHeight - childHeight;
                    childWidth = remainingWidth;
                    remainingHeight = Math.max(0, remainingHeight - childHeight);
                    break;
                case "right":
                    childLeft = x + remainingWidth - childWidth;
                    childTop = y;
                    childHeight = remainingHeight;
                    remainingWidth = Math.max(0, remainingWidth - childWidth);
                    break;
                case "left":
                default:
                    childLeft = x;
                    childTop = y;
                    childHeight = remainingHeight;
                    x += childWidth;
                    remainingWidth = Math.max(0, remainingWidth - childWidth);
                    break;
            }
            dock_layout_common_1.View.layoutChild(_this, child, childLeft, childTop, childLeft + childWidth, childTop + childHeight);
        });
    };
    return DockLayout;
}(dock_layout_common_1.DockLayoutBase));
exports.DockLayout = DockLayout;
//# sourceMappingURL=dock-layout.ios.js.map