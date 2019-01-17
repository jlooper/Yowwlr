function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var flexbox_layout_common_1 = require("./flexbox-layout-common");
__export(require("./flexbox-layout-common"));
var EXACTLY = flexbox_layout_common_1.layout.EXACTLY;
var AT_MOST = flexbox_layout_common_1.layout.AT_MOST;
var UNSPECIFIED = flexbox_layout_common_1.layout.UNSPECIFIED;
var MEASURED_SIZE_MASK = flexbox_layout_common_1.layout.MEASURED_SIZE_MASK;
var MEASURED_STATE_TOO_SMALL = flexbox_layout_common_1.layout.MEASURED_STATE_TOO_SMALL;
function requestFlexboxLayout(value) {
    var flexbox = this.parent;
    if (flexbox instanceof flexbox_layout_common_1.FlexboxLayoutBase) {
        flexbox.requestLayout();
    }
}
flexbox_layout_common_1.View.prototype[flexbox_layout_common_1.orderProperty.setNative] = requestFlexboxLayout;
flexbox_layout_common_1.View.prototype[flexbox_layout_common_1.flexGrowProperty.setNative] = requestFlexboxLayout;
flexbox_layout_common_1.View.prototype[flexbox_layout_common_1.flexShrinkProperty.setNative] = requestFlexboxLayout;
flexbox_layout_common_1.View.prototype[flexbox_layout_common_1.flexWrapBeforeProperty.setNative] = requestFlexboxLayout;
flexbox_layout_common_1.View.prototype[flexbox_layout_common_1.alignSelfProperty.setNative] = requestFlexboxLayout;
var MATCH_PARENT = -1;
var WRAP_CONTENT = -2;
var View_sUseZeroUnspecifiedMeasureSpec = true;
var MAX_SIZE = 0x00FFFFFF & MEASURED_SIZE_MASK;
var makeMeasureSpec = flexbox_layout_common_1.layout.makeMeasureSpec;
var getMeasureSpecMode = flexbox_layout_common_1.layout.getMeasureSpecMode;
var getMeasureSpecSize = flexbox_layout_common_1.layout.getMeasureSpecSize;
var MeasureContext = (function () {
    function MeasureContext(owner) {
        var _this = this;
        this.owner = owner;
        this.children = [];
        this.owner.eachLayoutChild(function (child) {
            _this.children.push(child);
        });
    }
    Object.defineProperty(MeasureContext.prototype, "childrenCount", {
        get: function () {
            return this.children.length;
        },
        enumerable: true,
        configurable: true
    });
    MeasureContext.prototype.childAt = function (index) {
        return this.children[index];
    };
    return MeasureContext;
}());
var FlexLine = (function () {
    function FlexLine() {
        this._left = Number.MAX_VALUE;
        this._top = Number.MAX_VALUE;
        this._right = Number.MAX_VALUE;
        this._bottom = Number.MAX_VALUE;
        this._mainSize = 0;
        this._dividerLengthInMainSize = 0;
        this._crossSize = 0;
        this._itemCount = 0;
        this._totalFlexGrow = 0;
        this._totalFlexShrink = 0;
        this._maxBaseline = 0;
        this._indicesAlignSelfStretch = [];
    }
    Object.defineProperty(FlexLine.prototype, "left", {
        get: function () { return this._left; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlexLine.prototype, "top", {
        get: function () { return this._top; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlexLine.prototype, "right", {
        get: function () { return this._right; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlexLine.prototype, "bottom", {
        get: function () { return this._bottom; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlexLine.prototype, "mainSize", {
        get: function () { return this._mainSize; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlexLine.prototype, "crossSize", {
        get: function () { return this._crossSize; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlexLine.prototype, "itemCount", {
        get: function () { return this._itemCount; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlexLine.prototype, "totalFlexGrow", {
        get: function () { return this._totalFlexGrow; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlexLine.prototype, "totalFlexShrink", {
        get: function () { return this._totalFlexShrink; },
        enumerable: true,
        configurable: true
    });
    return FlexLine;
}());
var Order = (function () {
    function Order() {
    }
    Order.prototype.compareTo = function (another) {
        if (this.order !== another.order) {
            return this.order - another.order;
        }
        return this.index - another.index;
    };
    return Order;
}());
var FlexboxLayout = (function (_super) {
    __extends(FlexboxLayout, _super);
    function FlexboxLayout() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._flexLines = [];
        return _this;
    }
    FlexboxLayout.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        this.measureContext = new MeasureContext(this);
        if (this._isOrderChangedFromLastMeasurement) {
            this._reorderedIndices = this._createReorderedIndices();
        }
        if (!this._childrenFrozen || this._childrenFrozen.length < this.measureContext.childrenCount) {
            this._childrenFrozen = new Array(this.measureContext.childrenCount);
        }
        switch (this.flexDirection) {
            case flexbox_layout_common_1.FlexDirection.ROW:
            case flexbox_layout_common_1.FlexDirection.ROW_REVERSE:
                this._measureHorizontal(widthMeasureSpec, heightMeasureSpec);
                break;
            case flexbox_layout_common_1.FlexDirection.COLUMN:
            case flexbox_layout_common_1.FlexDirection.COLUMN_REVERSE:
                this._measureVertical(widthMeasureSpec, heightMeasureSpec);
                break;
            default:
                throw new Error("Invalid value for the flex direction is set: " + this.flexDirection);
        }
        this._childrenFrozen.length = 0;
    };
    FlexboxLayout.prototype._getReorderedChildAt = function (index) {
        var child;
        if (index < 0 || index >= this._reorderedIndices.length) {
            child = null;
        }
        else {
            var reorderedIndex = this._reorderedIndices[index];
            child = this.measureContext.childAt(reorderedIndex);
        }
        return child;
    };
    FlexboxLayout.prototype._createReorderedIndices = function () {
        var childCount = this.measureContext.childrenCount;
        var orders = this._createOrders(childCount);
        return this._sortOrdersIntoReorderedIndices(childCount, orders);
    };
    FlexboxLayout.prototype._sortOrdersIntoReorderedIndices = function (childCount, orders) {
        var _this = this;
        orders.sort(function (a, b) { return a.compareTo(b); });
        if (!this._orderCache) {
            this._orderCache = [];
        }
        this._orderCache.length = 0;
        var reorderedIndices = [];
        orders.forEach(function (order, i) {
            reorderedIndices[i] = order.index;
            _this._orderCache[i] = order.order;
        });
        return reorderedIndices;
    };
    FlexboxLayout.prototype._createOrders = function (childCount) {
        var orders = [];
        for (var i = 0; i < childCount; i++) {
            var child = this.measureContext.childAt(i);
            var order = new Order();
            order.order = FlexboxLayout.getOrder(child);
            order.index = i;
            orders.push(order);
        }
        return orders;
    };
    Object.defineProperty(FlexboxLayout.prototype, "_isOrderChangedFromLastMeasurement", {
        get: function () {
            var childCount = this.measureContext.childrenCount;
            if (!this._orderCache) {
                this._orderCache = [];
            }
            if (this._orderCache.length !== childCount) {
                return true;
            }
            for (var i = 0; i < childCount; i++) {
                var view = this.measureContext.childAt(i);
                if (view === null) {
                    continue;
                }
                if (FlexboxLayout.getOrder(view) !== this._orderCache[i]) {
                    return true;
                }
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    FlexboxLayout.prototype._measureHorizontal = function (widthMeasureSpec, heightMeasureSpec) {
        var _this = this;
        var widthSize = getMeasureSpecSize(widthMeasureSpec);
        var widthMode = getMeasureSpecMode(widthMeasureSpec);
        var heightSize = getMeasureSpecSize(heightMeasureSpec);
        var heightMode = getMeasureSpecMode(heightMeasureSpec);
        var childState = 0;
        this._flexLines.length = 0;
        (function () {
            var childCount = _this.measureContext.childrenCount;
            var paddingStart = FlexboxLayout.getPaddingStart(_this);
            var paddingEnd = FlexboxLayout.getPaddingEnd(_this);
            var largestHeightInRow = Number.MIN_VALUE;
            var flexLine = new FlexLine();
            var indexInFlexLine = 0;
            flexLine._mainSize = paddingStart + paddingEnd;
            for (var i = 0; i < childCount; i++) {
                var child = _this._getReorderedChildAt(i);
                if (child === null) {
                    _this._addFlexLineIfLastFlexItem(i, childCount, flexLine);
                    continue;
                }
                else if (child.isCollapsed) {
                    flexLine._itemCount++;
                    _this._addFlexLineIfLastFlexItem(i, childCount, flexLine);
                    continue;
                }
                child._updateEffectiveLayoutValues(widthSize, widthMode, heightSize, heightMode);
                var lp = child;
                if (FlexboxLayout.getAlignSelf(child) === "stretch") {
                    flexLine._indicesAlignSelfStretch.push(i);
                }
                var childWidth = lp.effectiveWidth;
                if (flexbox_layout_common_1.FlexBasisPercent.DEFAULT !== flexbox_layout_common_1.FlexBasisPercent.DEFAULT && widthMode === EXACTLY) {
                    childWidth = Math.round(widthSize * flexbox_layout_common_1.FlexBasisPercent.DEFAULT);
                }
                var childWidthMeasureSpec = FlexboxLayout.getChildMeasureSpec(widthMeasureSpec, lp.effectivePaddingLeft + lp.effectivePaddingRight + lp.effectiveMarginLeft
                    + lp.effectiveMarginRight, childWidth < 0 ? WRAP_CONTENT : childWidth);
                var childHeightMeasureSpec = FlexboxLayout.getChildMeasureSpec(heightMeasureSpec, lp.effectivePaddingTop + lp.effectivePaddingBottom + lp.effectiveMarginTop
                    + lp.effectiveMarginBottom, lp.effectiveHeight < 0 ? WRAP_CONTENT : lp.effectiveHeight);
                child.measure(childWidthMeasureSpec, childHeightMeasureSpec);
                _this._checkSizeConstraints(child);
                childState = flexbox_layout_common_1.View.combineMeasuredStates(childState, child.getMeasuredState());
                largestHeightInRow = Math.max(largestHeightInRow, child.getMeasuredHeight() + lp.effectiveMarginTop + lp.effectiveMarginBottom);
                if (_this._isWrapRequired(child, widthMode, widthSize, flexLine._mainSize, child.getMeasuredWidth() + lp.effectiveMarginLeft + lp.effectiveMarginRight, i, indexInFlexLine)) {
                    if (flexLine.itemCount > 0) {
                        _this._addFlexLine(flexLine);
                    }
                    flexLine = new FlexLine();
                    flexLine._itemCount = 1;
                    flexLine._mainSize = paddingStart + paddingEnd;
                    largestHeightInRow = child.getMeasuredHeight() + lp.effectiveMarginTop + lp.effectiveMarginBottom;
                    indexInFlexLine = 0;
                }
                else {
                    flexLine._itemCount++;
                    indexInFlexLine++;
                }
                flexLine._mainSize += child.getMeasuredWidth() + lp.effectiveMarginLeft + lp.effectiveMarginRight;
                flexLine._totalFlexGrow += FlexboxLayout.getFlexGrow(child);
                flexLine._totalFlexShrink += FlexboxLayout.getFlexShrink(child);
                flexLine._crossSize = Math.max(flexLine._crossSize, largestHeightInRow);
                if (_this.flexWrap !== flexbox_layout_common_1.FlexWrap.WRAP_REVERSE) {
                    flexLine._maxBaseline = Math.max(flexLine._maxBaseline, FlexboxLayout.getBaseline(child) + lp.effectiveMarginTop);
                }
                else {
                    flexLine._maxBaseline = Math.max(flexLine._maxBaseline, child.getMeasuredHeight() - FlexboxLayout.getBaseline(child) + lp.effectiveMarginBottom);
                }
                _this._addFlexLineIfLastFlexItem(i, childCount, flexLine);
            }
        })();
        this._determineMainSize(this.flexDirection, widthMeasureSpec, heightMeasureSpec);
        if (this.alignItems === flexbox_layout_common_1.AlignItems.BASELINE) {
            var viewIndex_1 = 0;
            this._flexLines.forEach(function (flexLine) {
                var largestHeightInLine = Number.MIN_VALUE;
                for (var i = viewIndex_1; i < viewIndex_1 + flexLine._itemCount; i++) {
                    var child = _this._getReorderedChildAt(i);
                    var lp = child;
                    if (_this.flexWrap !== flexbox_layout_common_1.FlexWrap.WRAP_REVERSE) {
                        var marginTop = flexLine._maxBaseline - FlexboxLayout.getBaseline(child);
                        marginTop = Math.max(marginTop, lp.effectiveMarginTop);
                        largestHeightInLine = Math.max(largestHeightInLine, child.getActualSize().height + marginTop + lp.effectiveMarginBottom);
                    }
                    else {
                        var marginBottom = flexLine._maxBaseline - child.getMeasuredHeight() + FlexboxLayout.getBaseline(child);
                        marginBottom = Math.max(marginBottom, lp.effectiveMarginBottom);
                        largestHeightInLine = Math.max(largestHeightInLine, child.getActualSize().height + lp.effectiveMarginTop + marginBottom);
                    }
                }
                flexLine._crossSize = largestHeightInLine;
                viewIndex_1 += flexLine.itemCount;
            });
        }
        this._determineCrossSize(this.flexDirection, widthMeasureSpec, heightMeasureSpec, this.effectivePaddingTop + this.effectivePaddingBottom);
        this._stretchViews(this.flexDirection, this.alignItems);
        this._setMeasuredDimensionForFlex(this.flexDirection, widthMeasureSpec, heightMeasureSpec, childState);
    };
    FlexboxLayout.prototype._measureVertical = function (widthMeasureSpec, heightMeasureSpec) {
        var widthSize = getMeasureSpecSize(widthMeasureSpec);
        var widthMode = getMeasureSpecMode(widthMeasureSpec);
        var heightSize = getMeasureSpecSize(heightMeasureSpec);
        var heightMode = getMeasureSpecMode(heightMeasureSpec);
        var childState = 0;
        this._flexLines.length = 0;
        var childCount = this.measureContext.childrenCount;
        var paddingTop = this.effectivePaddingTop;
        var paddingBottom = this.effectivePaddingBottom;
        var largestWidthInColumn = Number.MIN_VALUE;
        var flexLine = new FlexLine();
        flexLine._mainSize = paddingTop + paddingBottom;
        var indexInFlexLine = 0;
        for (var i = 0; i < childCount; i++) {
            var child = this._getReorderedChildAt(i);
            if (child === null) {
                this._addFlexLineIfLastFlexItem(i, childCount, flexLine);
                continue;
            }
            else if (child.isCollapsed) {
                flexLine._itemCount++;
                this._addFlexLineIfLastFlexItem(i, childCount, flexLine);
                continue;
            }
            child._updateEffectiveLayoutValues(widthSize, widthMode, heightSize, heightMode);
            var lp = child;
            if (FlexboxLayout.getAlignSelf(child) === "stretch") {
                flexLine._indicesAlignSelfStretch.push(i);
            }
            var childHeight = lp.effectiveHeight;
            if (flexbox_layout_common_1.FlexBasisPercent.DEFAULT !== flexbox_layout_common_1.FlexBasisPercent.DEFAULT && heightMode === EXACTLY) {
                childHeight = Math.round(heightSize * flexbox_layout_common_1.FlexBasisPercent.DEFAULT);
            }
            var childWidthMeasureSpec = FlexboxLayout.getChildMeasureSpec(widthMeasureSpec, this.effectivePaddingLeft + this.effectivePaddingRight + lp.effectiveMarginLeft
                + lp.effectiveMarginRight, lp.effectiveWidth < 0 ? WRAP_CONTENT : lp.effectiveWidth);
            var childHeightMeasureSpec = FlexboxLayout.getChildMeasureSpec(heightMeasureSpec, this.effectivePaddingTop + this.effectivePaddingBottom + lp.effectiveMarginTop
                + lp.effectiveMarginBottom, childHeight < 0 ? WRAP_CONTENT : childHeight);
            child.measure(childWidthMeasureSpec, childHeightMeasureSpec);
            this._checkSizeConstraints(child);
            childState = flexbox_layout_common_1.View.combineMeasuredStates(childState, child.getMeasuredState());
            largestWidthInColumn = Math.max(largestWidthInColumn, child.getMeasuredWidth() + lp.effectiveMarginLeft + lp.effectiveMarginRight);
            if (this._isWrapRequired(child, heightMode, heightSize, flexLine.mainSize, child.getMeasuredHeight() + lp.effectiveMarginTop + lp.effectiveMarginBottom, i, indexInFlexLine)) {
                if (flexLine._itemCount > 0) {
                    this._addFlexLine(flexLine);
                }
                flexLine = new FlexLine();
                flexLine._itemCount = 1;
                flexLine._mainSize = paddingTop + paddingBottom;
                largestWidthInColumn = child.getMeasuredWidth() + lp.effectiveMarginLeft + lp.effectiveMarginRight;
                indexInFlexLine = 0;
            }
            else {
                flexLine._itemCount++;
                indexInFlexLine++;
            }
            flexLine._mainSize += child.getMeasuredHeight() + lp.effectiveMarginTop + lp.effectiveMarginBottom;
            flexLine._totalFlexGrow += FlexboxLayout.getFlexGrow(child);
            flexLine._totalFlexShrink += FlexboxLayout.getFlexShrink(child);
            flexLine._crossSize = Math.max(flexLine._crossSize, largestWidthInColumn);
            this._addFlexLineIfLastFlexItem(i, childCount, flexLine);
        }
        this._determineMainSize(this.flexDirection, widthMeasureSpec, heightMeasureSpec);
        this._determineCrossSize(this.flexDirection, widthMeasureSpec, heightMeasureSpec, this.effectivePaddingLeft + this.effectivePaddingRight);
        this._stretchViews(this.flexDirection, this.alignItems);
        this._setMeasuredDimensionForFlex(this.flexDirection, widthMeasureSpec, heightMeasureSpec, childState);
    };
    FlexboxLayout.prototype._checkSizeConstraints = function (view) {
        var needsMeasure = false;
        var childWidth = view.getMeasuredWidth();
        var childHeight = view.getMeasuredHeight();
        var minWidth = view.effectiveMinWidth;
        view.effectiveMinWidth = 0;
        if (view.getMeasuredWidth() < minWidth) {
            needsMeasure = true;
            childWidth = minWidth;
        }
        else if (view.getMeasuredWidth() > MAX_SIZE) {
            needsMeasure = true;
            childWidth = MAX_SIZE;
        }
        var minHeight = view.effectiveMinHeight;
        view.effectiveMinHeight = 0;
        if (childHeight < minHeight) {
            needsMeasure = true;
            childHeight = minHeight;
        }
        else if (childHeight > MAX_SIZE) {
            needsMeasure = true;
            childHeight = MAX_SIZE;
        }
        if (needsMeasure) {
            view.measure(makeMeasureSpec(childWidth, EXACTLY), makeMeasureSpec(childHeight, EXACTLY));
        }
        view.effectiveMinWidth = minWidth;
        view.effectiveMinHeight = minHeight;
    };
    FlexboxLayout.prototype._addFlexLineIfLastFlexItem = function (childIndex, childCount, flexLine) {
        if (childIndex === childCount - 1 && flexLine.itemCount !== 0) {
            this._addFlexLine(flexLine);
        }
    };
    FlexboxLayout.prototype._addFlexLine = function (flexLine) {
        this._flexLines.push(flexLine);
    };
    FlexboxLayout.prototype._determineMainSize = function (flexDirection, widthMeasureSpec, heightMeasureSpec) {
        var _this = this;
        var mainSize;
        var paddingAlongMainAxis;
        switch (flexDirection) {
            case flexbox_layout_common_1.FlexDirection.ROW:
            case flexbox_layout_common_1.FlexDirection.ROW_REVERSE:
                var widthMode = getMeasureSpecMode(widthMeasureSpec);
                var widthSize = getMeasureSpecSize(widthMeasureSpec);
                if (widthMode === EXACTLY) {
                    mainSize = widthSize;
                }
                else {
                    mainSize = this._getLargestMainSize();
                }
                paddingAlongMainAxis = this.effectivePaddingLeft + this.effectivePaddingRight;
                break;
            case flexbox_layout_common_1.FlexDirection.COLUMN:
            case flexbox_layout_common_1.FlexDirection.COLUMN_REVERSE:
                var heightMode = getMeasureSpecMode(heightMeasureSpec);
                var heightSize = getMeasureSpecSize(heightMeasureSpec);
                if (heightMode === EXACTLY) {
                    mainSize = heightSize;
                }
                else {
                    mainSize = this._getLargestMainSize();
                }
                paddingAlongMainAxis = this.effectivePaddingTop + this.effectivePaddingBottom;
                break;
            default:
                throw new Error("Invalid flex direction: " + flexDirection);
        }
        var childIndex = 0;
        this._flexLines.forEach(function (flexLine) {
            if (flexLine.mainSize < mainSize) {
                childIndex = _this._expandFlexItems(flexLine, flexDirection, mainSize, paddingAlongMainAxis, childIndex);
            }
            else {
                childIndex = _this._shrinkFlexItems(flexLine, flexDirection, mainSize, paddingAlongMainAxis, childIndex);
            }
        });
    };
    FlexboxLayout.prototype._expandFlexItems = function (flexLine, flexDirection, maxMainSize, paddingAlongMainAxis, startIndex) {
        var childIndex = startIndex;
        if (flexLine._totalFlexGrow <= 0 || maxMainSize < flexLine._mainSize) {
            childIndex += flexLine._itemCount;
            return childIndex;
        }
        var sizeBeforeExpand = flexLine._mainSize;
        var needsReexpand = false;
        var pendingSpace = maxMainSize - flexLine._mainSize;
        var unitSpace = pendingSpace / flexLine._totalFlexGrow;
        flexLine._mainSize = paddingAlongMainAxis + flexLine._dividerLengthInMainSize;
        var accumulatedRoundError = 0;
        for (var i = 0; i < flexLine.itemCount; i++) {
            var child = this._getReorderedChildAt(childIndex);
            if (child === null) {
                continue;
            }
            else if (child.isCollapsed) {
                childIndex++;
                continue;
            }
            var lp = child;
            if (this._isMainAxisDirectionHorizontal(flexDirection)) {
                if (!this._childrenFrozen[childIndex]) {
                    var flexGrow = FlexboxLayout.getFlexGrow(child);
                    var rawCalculatedWidth = child.getMeasuredWidth() + unitSpace * flexGrow + accumulatedRoundError;
                    var roundedCalculatedWidth = Math.round(rawCalculatedWidth);
                    if (roundedCalculatedWidth > MAX_SIZE) {
                        needsReexpand = true;
                        roundedCalculatedWidth = MAX_SIZE;
                        this._childrenFrozen[childIndex] = true;
                        flexLine._totalFlexGrow -= flexGrow;
                    }
                    else {
                        accumulatedRoundError = rawCalculatedWidth - roundedCalculatedWidth;
                    }
                    child.measure(makeMeasureSpec(roundedCalculatedWidth, EXACTLY), makeMeasureSpec(child.getMeasuredHeight(), EXACTLY));
                }
                flexLine._mainSize += child.getMeasuredWidth() + lp.effectiveMarginLeft + lp.effectiveMarginRight;
            }
            else {
                if (!this._childrenFrozen[childIndex]) {
                    var flexGrow = FlexboxLayout.getFlexGrow(child);
                    var rawCalculatedHeight = child.getMeasuredHeight() + unitSpace * flexGrow + accumulatedRoundError;
                    var roundedCalculatedHeight = Math.round(rawCalculatedHeight);
                    if (roundedCalculatedHeight > MAX_SIZE) {
                        needsReexpand = true;
                        roundedCalculatedHeight = MAX_SIZE;
                        this._childrenFrozen[childIndex] = true;
                        flexLine._totalFlexGrow -= flexGrow;
                    }
                    else {
                        accumulatedRoundError = rawCalculatedHeight - roundedCalculatedHeight;
                    }
                    child.measure(makeMeasureSpec(child.getMeasuredWidth(), EXACTLY), makeMeasureSpec(roundedCalculatedHeight, EXACTLY));
                }
                flexLine._mainSize += child.getMeasuredHeight() + lp.effectiveMarginTop + lp.effectiveMarginBottom;
            }
            childIndex++;
        }
        if (needsReexpand && sizeBeforeExpand !== flexLine._mainSize) {
            this._expandFlexItems(flexLine, flexDirection, maxMainSize, paddingAlongMainAxis, startIndex);
        }
        return childIndex;
    };
    FlexboxLayout.prototype._shrinkFlexItems = function (flexLine, flexDirection, maxMainSize, paddingAlongMainAxis, startIndex) {
        var childIndex = startIndex;
        var sizeBeforeShrink = flexLine._mainSize;
        if (flexLine._totalFlexShrink <= 0 || maxMainSize > flexLine._mainSize) {
            childIndex += flexLine.itemCount;
            return childIndex;
        }
        var needsReshrink = false;
        var unitShrink = (flexLine._mainSize - maxMainSize) / flexLine._totalFlexShrink;
        var accumulatedRoundError = 0;
        flexLine._mainSize = paddingAlongMainAxis + flexLine._dividerLengthInMainSize;
        for (var i = 0; i < flexLine.itemCount; i++) {
            var child = this._getReorderedChildAt(childIndex);
            if (child === null) {
                continue;
            }
            else if (child.isCollapsed) {
                childIndex++;
                continue;
            }
            var lp = child;
            if (this._isMainAxisDirectionHorizontal(flexDirection)) {
                if (!this._childrenFrozen[childIndex]) {
                    var flexShrink = FlexboxLayout.getFlexShrink(child);
                    var rawCalculatedWidth = child.getMeasuredWidth() - unitShrink * flexShrink + accumulatedRoundError;
                    var roundedCalculatedWidth = Math.round(rawCalculatedWidth);
                    var minWidth = child.effectiveMinWidth;
                    child.effectiveMinWidth = 0;
                    if (roundedCalculatedWidth < minWidth) {
                        needsReshrink = true;
                        roundedCalculatedWidth = minWidth;
                        this._childrenFrozen[childIndex] = true;
                        flexLine._totalFlexShrink -= flexShrink;
                    }
                    else {
                        accumulatedRoundError = rawCalculatedWidth - roundedCalculatedWidth;
                    }
                    var childWidthMeasureSpec = makeMeasureSpec(roundedCalculatedWidth, EXACTLY);
                    var childHeightMeasureSpec = FlexboxLayout.getChildMeasureSpec(this._currentHeightMeasureSpec, lp.effectivePaddingTop + lp.effectivePaddingBottom + lp.effectiveMarginTop
                        + lp.effectiveMarginBottom, lp.effectiveHeight < 0 ? WRAP_CONTENT : lp.effectiveHeight);
                    child.measure(childWidthMeasureSpec, childHeightMeasureSpec);
                    child.effectiveMinWidth = minWidth;
                    flexLine._crossSize = Math.max(flexLine._crossSize, child.getMeasuredHeight() + lp.effectiveMarginTop + lp.effectiveMarginBottom);
                }
                flexLine._mainSize += child.getMeasuredWidth() + lp.effectiveMarginLeft + lp.effectiveMarginRight;
            }
            else {
                if (!this._childrenFrozen[childIndex]) {
                    var flexShrink = FlexboxLayout.getFlexShrink(child);
                    var rawCalculatedHeight = child.getMeasuredHeight() - unitShrink * flexShrink + accumulatedRoundError;
                    var roundedCalculatedHeight = Math.round(rawCalculatedHeight);
                    var minHeight = child.effectiveMinHeight;
                    child.effectiveMinHeight = 0;
                    if (roundedCalculatedHeight < minHeight) {
                        needsReshrink = true;
                        roundedCalculatedHeight = minHeight;
                        this._childrenFrozen[childIndex] = true;
                        flexLine._totalFlexShrink -= flexShrink;
                    }
                    else {
                        accumulatedRoundError = rawCalculatedHeight - roundedCalculatedHeight;
                    }
                    child.measure(makeMeasureSpec(child.getMeasuredWidth(), EXACTLY), makeMeasureSpec(roundedCalculatedHeight, EXACTLY));
                    child.effectiveMinHeight = minHeight;
                }
                flexLine._mainSize += child.getMeasuredHeight() + lp.effectiveMarginTop + lp.effectiveMarginBottom;
            }
            childIndex++;
        }
        if (needsReshrink && sizeBeforeShrink !== flexLine._mainSize) {
            this._shrinkFlexItems(flexLine, flexDirection, maxMainSize, paddingAlongMainAxis, startIndex);
        }
        return childIndex;
    };
    FlexboxLayout.prototype._determineCrossSize = function (flexDirection, widthMeasureSpec, heightMeasureSpec, paddingAlongCrossAxis) {
        var _this = this;
        var mode;
        var size;
        switch (flexDirection) {
            case flexbox_layout_common_1.FlexDirection.ROW:
            case flexbox_layout_common_1.FlexDirection.ROW_REVERSE:
                mode = getMeasureSpecMode(heightMeasureSpec);
                size = getMeasureSpecSize(heightMeasureSpec);
                break;
            case flexbox_layout_common_1.FlexDirection.COLUMN:
            case flexbox_layout_common_1.FlexDirection.COLUMN_REVERSE:
                mode = getMeasureSpecMode(widthMeasureSpec);
                size = getMeasureSpecSize(widthMeasureSpec);
                break;
            default:
                throw new Error("Invalid flex direction: " + flexDirection);
        }
        if (mode === EXACTLY) {
            var totalCrossSize_1 = this._getSumOfCrossSize() + paddingAlongCrossAxis;
            if (this._flexLines.length === 1) {
                this._flexLines[0]._crossSize = size - paddingAlongCrossAxis;
            }
            else if (this._flexLines.length >= 2 && totalCrossSize_1 < size) {
                switch (this.alignContent) {
                    case flexbox_layout_common_1.AlignContent.STRETCH:
                        (function () {
                            var freeSpaceUnit = (size - totalCrossSize_1) / _this._flexLines.length;
                            var accumulatedError = 0;
                            for (var i = 0, flexLinesSize = _this._flexLines.length; i < flexLinesSize; i++) {
                                var flexLine = _this._flexLines[i];
                                var newCrossSizeAsFloat = flexLine._crossSize + freeSpaceUnit;
                                if (i === _this._flexLines.length - 1) {
                                    newCrossSizeAsFloat += accumulatedError;
                                    accumulatedError = 0;
                                }
                                var newCrossSize = Math.round(newCrossSizeAsFloat);
                                accumulatedError += (newCrossSizeAsFloat - newCrossSize);
                                if (accumulatedError > 1) {
                                    newCrossSize += 1;
                                    accumulatedError -= 1;
                                }
                                else if (accumulatedError < -1) {
                                    newCrossSize -= 1;
                                    accumulatedError += 1;
                                }
                                flexLine._crossSize = newCrossSize;
                            }
                        })();
                        break;
                    case flexbox_layout_common_1.AlignContent.SPACE_AROUND:
                        (function () {
                            var spaceTopAndBottom = size - totalCrossSize_1;
                            var numberOfSpaces = _this._flexLines.length * 2;
                            spaceTopAndBottom = spaceTopAndBottom / numberOfSpaces;
                            var newFlexLines = [];
                            var dummySpaceFlexLine = new FlexLine();
                            dummySpaceFlexLine._crossSize = spaceTopAndBottom;
                            _this._flexLines.forEach(function (flexLine) {
                                newFlexLines.push(dummySpaceFlexLine);
                                newFlexLines.push(flexLine);
                                newFlexLines.push(dummySpaceFlexLine);
                            });
                            _this._flexLines = newFlexLines;
                        })();
                        break;
                    case flexbox_layout_common_1.AlignContent.SPACE_BETWEEN:
                        (function () {
                            var spaceBetweenFlexLine = size - totalCrossSize_1;
                            var numberOfSpaces = _this._flexLines.length - 1;
                            spaceBetweenFlexLine = spaceBetweenFlexLine / numberOfSpaces;
                            var accumulatedError = 0;
                            var newFlexLines = [];
                            for (var i = 0, flexLineSize = _this._flexLines.length; i < flexLineSize; i++) {
                                var flexLine = _this._flexLines[i];
                                newFlexLines.push(flexLine);
                                if (i !== _this._flexLines.length - 1) {
                                    var dummySpaceFlexLine = new FlexLine();
                                    if (i === _this._flexLines.length - 2) {
                                        dummySpaceFlexLine._crossSize = Math.round(spaceBetweenFlexLine + accumulatedError);
                                        accumulatedError = 0;
                                    }
                                    else {
                                        dummySpaceFlexLine._crossSize = Math.round(spaceBetweenFlexLine);
                                    }
                                    accumulatedError += (spaceBetweenFlexLine - dummySpaceFlexLine._crossSize);
                                    if (accumulatedError > 1) {
                                        dummySpaceFlexLine._crossSize += 1;
                                        accumulatedError -= 1;
                                    }
                                    else if (accumulatedError < -1) {
                                        dummySpaceFlexLine._crossSize -= 1;
                                        accumulatedError += 1;
                                    }
                                    newFlexLines.push(dummySpaceFlexLine);
                                }
                            }
                            _this._flexLines = newFlexLines;
                        })();
                        break;
                    case flexbox_layout_common_1.AlignContent.CENTER: {
                        var spaceAboveAndBottom = size - totalCrossSize_1;
                        spaceAboveAndBottom = spaceAboveAndBottom / 2;
                        var newFlexLines = [];
                        var dummySpaceFlexLine = new FlexLine();
                        dummySpaceFlexLine._crossSize = spaceAboveAndBottom;
                        for (var i = 0, flexLineSize = this._flexLines.length; i < flexLineSize; i++) {
                            if (i === 0) {
                                newFlexLines.push(dummySpaceFlexLine);
                            }
                            var flexLine = this._flexLines[i];
                            newFlexLines.push(flexLine);
                            if (i === this._flexLines.length - 1) {
                                newFlexLines.push(dummySpaceFlexLine);
                            }
                        }
                        this._flexLines = newFlexLines;
                        break;
                    }
                    case flexbox_layout_common_1.AlignContent.FLEX_END: {
                        var spaceTop = size - totalCrossSize_1;
                        var dummySpaceFlexLine = new FlexLine();
                        dummySpaceFlexLine._crossSize = spaceTop;
                        this._flexLines.unshift(dummySpaceFlexLine);
                        break;
                    }
                }
            }
        }
    };
    FlexboxLayout.prototype._stretchViews = function (flexDirection, alignItems) {
        var _this = this;
        if (alignItems === flexbox_layout_common_1.AlignItems.STRETCH) {
            var viewIndex_2 = 0;
            this._flexLines.forEach(function (flexLine) {
                for (var i = 0; i < flexLine.itemCount; i++, viewIndex_2++) {
                    var view = _this._getReorderedChildAt(viewIndex_2);
                    var alignSelf = FlexboxLayout.getAlignSelf(view);
                    if (alignSelf !== "auto" && alignSelf !== "stretch") {
                        continue;
                    }
                    switch (flexDirection) {
                        case flexbox_layout_common_1.FlexDirection.ROW:
                        case flexbox_layout_common_1.FlexDirection.ROW_REVERSE:
                            _this._stretchViewVertically(view, flexLine._crossSize);
                            break;
                        case flexbox_layout_common_1.FlexDirection.COLUMN:
                        case flexbox_layout_common_1.FlexDirection.COLUMN_REVERSE:
                            _this._stretchViewHorizontally(view, flexLine._crossSize);
                            break;
                        default:
                            throw new Error("Invalid flex direction: " + flexDirection);
                    }
                }
            });
        }
        else {
            this._flexLines.forEach(function (flexLine) {
                flexLine._indicesAlignSelfStretch.forEach(function (index) {
                    var view = _this._getReorderedChildAt(index);
                    switch (flexDirection) {
                        case flexbox_layout_common_1.FlexDirection.ROW:
                        case flexbox_layout_common_1.FlexDirection.ROW_REVERSE:
                            _this._stretchViewVertically(view, flexLine._crossSize);
                            break;
                        case flexbox_layout_common_1.FlexDirection.COLUMN:
                        case flexbox_layout_common_1.FlexDirection.COLUMN_REVERSE:
                            _this._stretchViewHorizontally(view, flexLine._crossSize);
                            break;
                        default:
                            throw new Error("Invalid flex direction: " + flexDirection);
                    }
                });
            });
        }
    };
    FlexboxLayout.prototype._stretchViewVertically = function (view, crossSize) {
        var newHeight = crossSize - view.effectiveMarginTop - view.effectiveMarginBottom;
        newHeight = Math.max(newHeight, 0);
        var originalMeasuredWidth = view.getMeasuredWidth();
        var childWidthMeasureSpec = FlexboxLayout.getChildMeasureSpec(this._currentWidthMeasureSpec, view.effectivePaddingLeft + view.effectivePaddingRight + view.effectiveMarginLeft
            + view.effectiveMarginRight, view.effectiveWidth < 0 ? WRAP_CONTENT : Math.min(view.effectiveWidth, originalMeasuredWidth));
        view.measure(childWidthMeasureSpec, makeMeasureSpec(newHeight, EXACTLY));
        if (originalMeasuredWidth > view.getMeasuredWidth()) {
            childWidthMeasureSpec = makeMeasureSpec(originalMeasuredWidth, EXACTLY);
            view.measure(childWidthMeasureSpec, makeMeasureSpec(newHeight, EXACTLY));
        }
    };
    FlexboxLayout.prototype._stretchViewHorizontally = function (view, crossSize) {
        var newWidth = crossSize - view.effectiveMarginLeft - view.effectiveMarginRight;
        newWidth = Math.max(newWidth, 0);
        view.measure(makeMeasureSpec(newWidth, EXACTLY), makeMeasureSpec(view.getMeasuredHeight(), EXACTLY));
    };
    FlexboxLayout.prototype._setMeasuredDimensionForFlex = function (flexDirection, widthMeasureSpec, heightMeasureSpec, childState) {
        var widthMode = getMeasureSpecMode(widthMeasureSpec);
        var widthSize = getMeasureSpecSize(widthMeasureSpec);
        var heightMode = getMeasureSpecMode(heightMeasureSpec);
        var heightSize = getMeasureSpecSize(heightMeasureSpec);
        var calculatedMaxHeight;
        var calculatedMaxWidth;
        switch (flexDirection) {
            case flexbox_layout_common_1.FlexDirection.ROW:
            case flexbox_layout_common_1.FlexDirection.ROW_REVERSE:
                calculatedMaxHeight = this._getSumOfCrossSize() + this.effectivePaddingTop + this.effectivePaddingBottom;
                calculatedMaxWidth = this._getLargestMainSize();
                break;
            case flexbox_layout_common_1.FlexDirection.COLUMN:
            case flexbox_layout_common_1.FlexDirection.COLUMN_REVERSE:
                calculatedMaxHeight = this._getLargestMainSize();
                calculatedMaxWidth = this._getSumOfCrossSize() + this.effectivePaddingLeft + this.effectivePaddingRight;
                break;
            default:
                throw new Error("Invalid flex direction: " + flexDirection);
        }
        var widthSizeAndState;
        switch (widthMode) {
            case EXACTLY:
                if (widthSize < calculatedMaxWidth) {
                    childState = flexbox_layout_common_1.View.combineMeasuredStates(childState, MEASURED_STATE_TOO_SMALL);
                }
                widthSizeAndState = flexbox_layout_common_1.View.resolveSizeAndState(widthSize, widthSize, widthMode, childState);
                break;
            case AT_MOST: {
                if (widthSize < calculatedMaxWidth) {
                    childState = flexbox_layout_common_1.View.combineMeasuredStates(childState, MEASURED_STATE_TOO_SMALL);
                }
                else {
                    widthSize = calculatedMaxWidth;
                }
                widthSizeAndState = flexbox_layout_common_1.View.resolveSizeAndState(widthSize, widthSize, widthMode, childState);
                break;
            }
            case UNSPECIFIED: {
                widthSizeAndState = flexbox_layout_common_1.View.resolveSizeAndState(calculatedMaxWidth, widthSize, widthMode, childState);
                break;
            }
            default:
                throw new Error("Unknown width mode is set: " + widthMode);
        }
        var heightSizeAndState;
        switch (heightMode) {
            case EXACTLY:
                if (heightSize < calculatedMaxHeight) {
                    childState = flexbox_layout_common_1.View.combineMeasuredStates(childState, MEASURED_STATE_TOO_SMALL >> flexbox_layout_common_1.layout.MEASURED_HEIGHT_STATE_SHIFT);
                }
                heightSizeAndState = flexbox_layout_common_1.View.resolveSizeAndState(heightSize, heightSize, heightMode, childState);
                break;
            case AT_MOST: {
                if (heightSize < calculatedMaxHeight) {
                    childState = flexbox_layout_common_1.View.combineMeasuredStates(childState, MEASURED_STATE_TOO_SMALL >> flexbox_layout_common_1.layout.MEASURED_HEIGHT_STATE_SHIFT);
                }
                else {
                    heightSize = calculatedMaxHeight;
                }
                heightSizeAndState = flexbox_layout_common_1.View.resolveSizeAndState(heightSize, heightSize, heightMode, childState);
                break;
            }
            case UNSPECIFIED: {
                heightSizeAndState = flexbox_layout_common_1.View.resolveSizeAndState(calculatedMaxHeight, heightSize, heightMode, childState);
                break;
            }
            default:
                throw new Error("Unknown height mode is set: " + heightMode);
        }
        this.setMeasuredDimension(widthSizeAndState, heightSizeAndState);
    };
    FlexboxLayout.prototype._isWrapRequired = function (child, mode, maxSize, currentLength, childLength, childAbsoluteIndex, childRelativeIndexInFlexLine) {
        if (this.flexWrap === flexbox_layout_common_1.FlexWrap.NOWRAP) {
            return false;
        }
        if (FlexboxLayout.getFlexWrapBefore(child)) {
            return true;
        }
        if (mode === UNSPECIFIED) {
            return false;
        }
        return maxSize < currentLength + childLength;
    };
    FlexboxLayout.prototype._getLargestMainSize = function () {
        return this._flexLines.reduce(function (max, flexLine) { return Math.max(max, flexLine.mainSize); }, Number.MIN_VALUE);
    };
    FlexboxLayout.prototype._getSumOfCrossSize = function () {
        return this._flexLines.reduce(function (sum, flexLine) { return sum + flexLine._crossSize; }, 0);
    };
    FlexboxLayout.prototype._isMainAxisDirectionHorizontal = function (flexDirection) {
        return flexDirection === flexbox_layout_common_1.FlexDirection.ROW || flexDirection === flexbox_layout_common_1.FlexDirection.ROW_REVERSE;
    };
    FlexboxLayout.prototype.onLayout = function (left, top, right, bottom) {
        var insets = this.getSafeAreaInsets();
        var isRtl;
        switch (this.flexDirection) {
            case flexbox_layout_common_1.FlexDirection.ROW:
                isRtl = false;
                this._layoutHorizontal(isRtl, left, top, right, bottom, insets);
                break;
            case flexbox_layout_common_1.FlexDirection.ROW_REVERSE:
                isRtl = true;
                this._layoutHorizontal(isRtl, left, top, right, bottom, insets);
                break;
            case flexbox_layout_common_1.FlexDirection.COLUMN:
                isRtl = false;
                if (this.flexWrap === flexbox_layout_common_1.FlexWrap.WRAP_REVERSE) {
                    isRtl = !isRtl;
                }
                this._layoutVertical(isRtl, false, left, top, right, bottom, insets);
                break;
            case flexbox_layout_common_1.FlexDirection.COLUMN_REVERSE:
                isRtl = false;
                if (this.flexWrap === flexbox_layout_common_1.FlexWrap.WRAP_REVERSE) {
                    isRtl = !isRtl;
                }
                this._layoutVertical(isRtl, true, left, top, right, bottom, insets);
                break;
            default:
                throw new Error("Invalid flex direction is set: " + this.flexDirection);
        }
    };
    FlexboxLayout.prototype._layoutHorizontal = function (isRtl, left, top, right, bottom, insets) {
        var _this = this;
        var paddingLeft = this.effectivePaddingLeft + insets.left;
        var paddingTop = this.effectivePaddingTop + insets.top;
        var paddingRight = this.effectivePaddingRight + insets.right;
        var paddingBottom = this.effectivePaddingBottom + insets.bottom;
        var childLeft;
        var currentViewIndex = 0;
        var height = bottom - top;
        var width = right - left;
        var childBottom = height - paddingBottom;
        var childTop = paddingTop;
        var childRight;
        this._flexLines.forEach(function (flexLine, i) {
            var spaceBetweenItem = 0.0;
            switch (_this.justifyContent) {
                case flexbox_layout_common_1.JustifyContent.FLEX_START:
                    childLeft = paddingLeft;
                    childRight = width - paddingRight;
                    break;
                case flexbox_layout_common_1.JustifyContent.FLEX_END:
                    childLeft = width - flexLine._mainSize + paddingRight;
                    childRight = flexLine._mainSize - paddingLeft;
                    break;
                case flexbox_layout_common_1.JustifyContent.CENTER:
                    childLeft = paddingLeft + (width - insets.left - insets.right - flexLine._mainSize) / 2.0;
                    childRight = width - paddingRight - (width - insets.left - insets.right - flexLine._mainSize) / 2.0;
                    break;
                case flexbox_layout_common_1.JustifyContent.SPACE_AROUND:
                    if (flexLine._itemCount !== 0) {
                        spaceBetweenItem = (width - insets.left - insets.right - flexLine.mainSize) / flexLine._itemCount;
                    }
                    childLeft = paddingLeft + spaceBetweenItem / 2.0;
                    childRight = width - paddingRight - spaceBetweenItem / 2.0;
                    break;
                case flexbox_layout_common_1.JustifyContent.SPACE_BETWEEN:
                    childLeft = paddingLeft;
                    var denominator = flexLine.itemCount !== 1 ? flexLine.itemCount - 1 : 1.0;
                    spaceBetweenItem = (width - insets.left - insets.right - flexLine.mainSize) / denominator;
                    childRight = width - paddingRight;
                    break;
                default:
                    throw new Error("Invalid justifyContent is set: " + _this.justifyContent);
            }
            spaceBetweenItem = Math.max(spaceBetweenItem, 0);
            for (var j = 0; j < flexLine.itemCount; j++) {
                var child = _this._getReorderedChildAt(currentViewIndex);
                if (child === null) {
                    continue;
                }
                else if (child.isCollapsed) {
                    currentViewIndex++;
                    continue;
                }
                var lp = child;
                childLeft += lp.effectiveMarginLeft;
                childRight -= lp.effectiveMarginRight;
                if (_this.flexWrap === flexbox_layout_common_1.FlexWrap.WRAP_REVERSE) {
                    if (isRtl) {
                        _this._layoutSingleChildHorizontal(child, flexLine, _this.flexWrap, _this.alignItems, Math.round(childRight) - child.getMeasuredWidth(), childBottom - child.getMeasuredHeight(), Math.round(childRight), childBottom);
                    }
                    else {
                        _this._layoutSingleChildHorizontal(child, flexLine, _this.flexWrap, _this.alignItems, Math.round(childLeft), childBottom - child.getMeasuredHeight(), Math.round(childLeft) + child.getMeasuredWidth(), childBottom);
                    }
                }
                else {
                    if (isRtl) {
                        _this._layoutSingleChildHorizontal(child, flexLine, _this.flexWrap, _this.alignItems, Math.round(childRight) - child.getMeasuredWidth(), childTop, Math.round(childRight), childTop + child.getMeasuredHeight());
                    }
                    else {
                        _this._layoutSingleChildHorizontal(child, flexLine, _this.flexWrap, _this.alignItems, Math.round(childLeft), childTop, Math.round(childLeft) + child.getMeasuredWidth(), childTop + child.getMeasuredHeight());
                    }
                }
                childLeft += child.getMeasuredWidth() + spaceBetweenItem + lp.effectiveMarginRight;
                childRight -= child.getMeasuredWidth() + spaceBetweenItem + lp.effectiveMarginLeft;
                currentViewIndex++;
                var bounds = child._getCurrentLayoutBounds();
                flexLine._left = Math.min(flexLine._left, bounds.left - lp.effectiveMarginLeft);
                flexLine._top = Math.min(flexLine._top, bounds.top - lp.effectiveMarginTop);
                flexLine._right = Math.max(flexLine._right, bounds.right + lp.effectiveMarginRight);
                flexLine._bottom = Math.max(flexLine._bottom, bounds.bottom + lp.effectiveMarginBottom);
            }
            childTop += flexLine._crossSize;
            childBottom -= flexLine._crossSize;
        });
    };
    FlexboxLayout.prototype._layoutSingleChildHorizontal = function (view, flexLine, flexWrap, alignItems, left, top, right, bottom) {
        var lp = view;
        var alignSelf = FlexboxLayout.getAlignSelf(view);
        if (alignSelf !== "auto") {
            alignItems = alignSelf;
        }
        var crossSize = flexLine._crossSize;
        switch (alignItems) {
            case flexbox_layout_common_1.AlignItems.FLEX_START:
            case flexbox_layout_common_1.AlignItems.STRETCH:
                if (flexWrap !== flexbox_layout_common_1.FlexWrap.WRAP_REVERSE) {
                    view.layout(left, top + lp.effectiveMarginTop, right, bottom + lp.effectiveMarginTop);
                }
                else {
                    view.layout(left, top - lp.effectiveMarginBottom, right, bottom - lp.effectiveMarginBottom);
                }
                break;
            case flexbox_layout_common_1.AlignItems.BASELINE:
                if (flexWrap !== flexbox_layout_common_1.FlexWrap.WRAP_REVERSE) {
                    var marginTop = flexLine._maxBaseline - FlexboxLayout.getBaseline(view);
                    marginTop = Math.max(marginTop, lp.effectiveMarginTop);
                    view.layout(left, top + marginTop, right, bottom + marginTop);
                }
                else {
                    var marginBottom = flexLine._maxBaseline - view.getMeasuredHeight() + FlexboxLayout.getBaseline(view);
                    marginBottom = Math.max(marginBottom, lp.effectiveMarginBottom);
                    view.layout(left, top - marginBottom, right, bottom - marginBottom);
                }
                break;
            case flexbox_layout_common_1.AlignItems.FLEX_END:
                if (flexWrap !== flexbox_layout_common_1.FlexWrap.WRAP_REVERSE) {
                    view.layout(left, top + crossSize - view.getMeasuredHeight() - lp.effectiveMarginBottom, right, top + crossSize - lp.effectiveMarginBottom);
                }
                else {
                    view.layout(left, top - crossSize + view.getMeasuredHeight() + lp.effectiveMarginTop, right, bottom - crossSize + view.getMeasuredHeight() + lp.effectiveMarginTop);
                }
                break;
            case flexbox_layout_common_1.AlignItems.CENTER:
                var topFromCrossAxis = (crossSize - view.getMeasuredHeight()) / 2;
                if (flexWrap !== flexbox_layout_common_1.FlexWrap.WRAP_REVERSE) {
                    view.layout(left, top + topFromCrossAxis + lp.effectiveMarginTop - lp.effectiveMarginBottom, right, top + topFromCrossAxis + view.getMeasuredHeight() + lp.effectiveMarginTop
                        - lp.effectiveMarginBottom);
                }
                else {
                    view.layout(left, top - topFromCrossAxis + lp.effectiveMarginTop - lp.effectiveMarginBottom, right, top - topFromCrossAxis + view.getMeasuredHeight() + lp.effectiveMarginTop
                        - lp.effectiveMarginBottom);
                }
                break;
        }
    };
    FlexboxLayout.prototype._layoutVertical = function (isRtl, fromBottomToTop, left, top, right, bottom, insets) {
        var _this = this;
        var paddingLeft = this.effectivePaddingLeft + insets.left;
        var paddingTop = this.effectivePaddingTop + insets.top;
        var paddingRight = this.effectivePaddingRight + insets.right;
        var paddingBottom = this.effectivePaddingBottom + insets.bottom;
        var childLeft = paddingLeft;
        var currentViewIndex = 0;
        var width = right - left;
        var height = bottom - top;
        var childRight = width - paddingRight;
        var childTop;
        var childBottom;
        this._flexLines.forEach(function (flexLine) {
            var spaceBetweenItem = 0.0;
            switch (_this.justifyContent) {
                case flexbox_layout_common_1.JustifyContent.FLEX_START:
                    childTop = paddingTop;
                    childBottom = height - paddingBottom;
                    break;
                case flexbox_layout_common_1.JustifyContent.FLEX_END:
                    childTop = height - flexLine._mainSize + paddingBottom;
                    childBottom = flexLine._mainSize - paddingTop;
                    break;
                case flexbox_layout_common_1.JustifyContent.CENTER:
                    childTop = paddingTop + (height - insets.top - insets.bottom - flexLine._mainSize) / 2.0;
                    childBottom = height - paddingBottom - (height - insets.top - insets.bottom - flexLine._mainSize) / 2.0;
                    break;
                case flexbox_layout_common_1.JustifyContent.SPACE_AROUND:
                    if (flexLine._itemCount !== 0) {
                        spaceBetweenItem = (height - insets.top - insets.bottom - flexLine._mainSize) / flexLine.itemCount;
                    }
                    childTop = paddingTop + spaceBetweenItem / 2.0;
                    childBottom = height - paddingBottom - spaceBetweenItem / 2.0;
                    break;
                case flexbox_layout_common_1.JustifyContent.SPACE_BETWEEN:
                    childTop = paddingTop;
                    var denominator = flexLine.itemCount !== 1 ? flexLine.itemCount - 1 : 1.0;
                    spaceBetweenItem = (height - insets.top - insets.bottom - flexLine.mainSize) / denominator;
                    childBottom = height - paddingBottom;
                    break;
                default:
                    throw new Error("Invalid justifyContent is set: " + _this.justifyContent);
            }
            spaceBetweenItem = Math.max(spaceBetweenItem, 0);
            for (var j = 0; j < flexLine.itemCount; j++) {
                var child = _this._getReorderedChildAt(currentViewIndex);
                if (child === null) {
                    continue;
                }
                else if (child.isCollapsed) {
                    currentViewIndex++;
                    continue;
                }
                var lp = child;
                childTop += lp.effectiveMarginTop;
                childBottom -= lp.effectiveMarginBottom;
                if (isRtl) {
                    if (fromBottomToTop) {
                        _this._layoutSingleChildVertical(child, flexLine, true, _this.alignItems, childRight - child.getMeasuredWidth(), Math.round(childBottom) - child.getMeasuredHeight(), childRight, Math.round(childBottom));
                    }
                    else {
                        _this._layoutSingleChildVertical(child, flexLine, true, _this.alignItems, childRight - child.getMeasuredWidth(), Math.round(childTop), childRight, Math.round(childTop) + child.getMeasuredHeight());
                    }
                }
                else {
                    if (fromBottomToTop) {
                        _this._layoutSingleChildVertical(child, flexLine, false, _this.alignItems, childLeft, Math.round(childBottom) - child.getMeasuredHeight(), childLeft + child.getMeasuredWidth(), Math.round(childBottom));
                    }
                    else {
                        _this._layoutSingleChildVertical(child, flexLine, false, _this.alignItems, childLeft, Math.round(childTop), childLeft + child.getMeasuredWidth(), Math.round(childTop) + child.getMeasuredHeight());
                    }
                }
                childTop += child.getMeasuredHeight() + spaceBetweenItem + lp.effectiveMarginBottom;
                childBottom -= child.getMeasuredHeight() + spaceBetweenItem + lp.effectiveMarginTop;
                currentViewIndex++;
                var bounds = child._getCurrentLayoutBounds();
                flexLine._left = Math.min(flexLine._left, bounds.left - lp.effectiveMarginLeft);
                flexLine._top = Math.min(flexLine._top, bounds.top - lp.effectiveMarginTop);
                flexLine._right = Math.max(flexLine._right, bounds.right + lp.effectiveMarginRight);
                flexLine._bottom = Math.max(flexLine._bottom, bounds.bottom + lp.effectiveMarginBottom);
            }
            childLeft += flexLine.crossSize;
            childRight -= flexLine.crossSize;
        });
    };
    FlexboxLayout.prototype._layoutSingleChildVertical = function (view, flexLine, isRtl, alignItems, left, top, right, bottom) {
        var lp = view;
        var alignSelf = FlexboxLayout.getAlignSelf(view);
        if (alignSelf !== "auto") {
            alignItems = alignSelf;
        }
        var crossSize = flexLine.crossSize;
        switch (alignItems) {
            case flexbox_layout_common_1.AlignItems.FLEX_START:
            case flexbox_layout_common_1.AlignItems.STRETCH:
            case flexbox_layout_common_1.AlignItems.BASELINE:
                if (!isRtl) {
                    view.layout(left + lp.effectiveMarginLeft, top, right + lp.effectiveMarginLeft, bottom);
                }
                else {
                    view.layout(left - lp.effectiveMarginRight, top, right - lp.effectiveMarginRight, bottom);
                }
                break;
            case flexbox_layout_common_1.AlignItems.FLEX_END:
                if (!isRtl) {
                    view.layout(left + crossSize - view.getMeasuredWidth() - lp.effectiveMarginRight, top, right + crossSize - view.getMeasuredWidth() - lp.effectiveMarginRight, bottom);
                }
                else {
                    view.layout(left - crossSize + view.getMeasuredWidth() + lp.effectiveMarginLeft, top, right - crossSize + view.getMeasuredWidth() + lp.effectiveMarginLeft, bottom);
                }
                break;
            case flexbox_layout_common_1.AlignItems.CENTER:
                var leftFromCrossAxis = (crossSize - view.getMeasuredWidth()) / 2;
                if (!isRtl) {
                    view.layout(left + leftFromCrossAxis + lp.effectiveMarginLeft - lp.effectiveMarginRight, top, right + leftFromCrossAxis + lp.effectiveMarginLeft - lp.effectiveMarginRight, bottom);
                }
                else {
                    view.layout(left - leftFromCrossAxis + lp.effectiveMarginLeft - lp.effectiveMarginRight, top, right - leftFromCrossAxis + lp.effectiveMarginLeft - lp.effectiveMarginRight, bottom);
                }
                break;
        }
    };
    FlexboxLayout.getChildMeasureSpec = function (spec, padding, childDimension) {
        var specMode = flexbox_layout_common_1.layout.getMeasureSpecMode(spec);
        var specSize = flexbox_layout_common_1.layout.getMeasureSpecSize(spec);
        var size = Math.max(0, specSize - padding);
        var resultSize = 0;
        var resultMode = 0;
        switch (specMode) {
            case EXACTLY:
                if (childDimension >= 0) {
                    resultSize = childDimension;
                    resultMode = EXACTLY;
                }
                else if (childDimension === MATCH_PARENT) {
                    resultSize = size;
                    resultMode = EXACTLY;
                }
                else if (childDimension === WRAP_CONTENT) {
                    resultSize = size;
                    resultMode = AT_MOST;
                }
                break;
            case AT_MOST:
                if (childDimension >= 0) {
                    resultSize = childDimension;
                    resultMode = EXACTLY;
                }
                else if (childDimension === MATCH_PARENT) {
                    resultSize = size;
                    resultMode = AT_MOST;
                }
                else if (childDimension === WRAP_CONTENT) {
                    resultSize = size;
                    resultMode = AT_MOST;
                }
                break;
            case UNSPECIFIED:
                if (childDimension >= 0) {
                    resultSize = childDimension;
                    resultMode = EXACTLY;
                }
                else if (childDimension === MATCH_PARENT) {
                    resultSize = View_sUseZeroUnspecifiedMeasureSpec ? 0 : size;
                    resultMode = UNSPECIFIED;
                }
                else if (childDimension === WRAP_CONTENT) {
                    resultSize = View_sUseZeroUnspecifiedMeasureSpec ? 0 : size;
                    resultMode = UNSPECIFIED;
                }
                break;
        }
        return flexbox_layout_common_1.layout.makeMeasureSpec(resultSize, resultMode);
    };
    return FlexboxLayout;
}(flexbox_layout_common_1.FlexboxLayoutBase));
exports.FlexboxLayout = FlexboxLayout;
(function (FlexboxLayout) {
    function getBaseline(child) {
        return 0;
    }
    FlexboxLayout.getBaseline = getBaseline;
    function getPaddingStart(child) {
        return child.effectivePaddingLeft;
    }
    FlexboxLayout.getPaddingStart = getPaddingStart;
    function getPaddingEnd(child) {
        return child.effectivePaddingRight;
    }
    FlexboxLayout.getPaddingEnd = getPaddingEnd;
})(FlexboxLayout = exports.FlexboxLayout || (exports.FlexboxLayout = {}));
exports.FlexboxLayout = FlexboxLayout;
//# sourceMappingURL=flexbox-layout.ios.js.map