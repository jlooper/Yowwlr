function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var segmented_bar_common_1 = require("./segmented-bar-common");
var utils_1 = require("../../utils/utils");
__export(require("./segmented-bar-common"));
var SegmentedBarItem = (function (_super) {
    __extends(SegmentedBarItem, _super);
    function SegmentedBarItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SegmentedBarItem.prototype._update = function () {
        var parent = this.parent;
        if (parent) {
            var tabIndex = parent.items.indexOf(this);
            var title = this.title;
            title = (title === null || title === undefined) ? "" : title;
            parent.ios.setTitleForSegmentAtIndex(title, tabIndex);
        }
    };
    return SegmentedBarItem;
}(segmented_bar_common_1.SegmentedBarItemBase));
exports.SegmentedBarItem = SegmentedBarItem;
var SegmentedBar = (function (_super) {
    __extends(SegmentedBar, _super);
    function SegmentedBar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SegmentedBar.prototype.createNativeView = function () {
        return UISegmentedControl.new();
    };
    SegmentedBar.prototype.initNativeView = function () {
        _super.prototype.initNativeView.call(this);
        this._selectionHandler = SelectionHandlerImpl.initWithOwner(new WeakRef(this));
        this.nativeViewProtected.addTargetActionForControlEvents(this._selectionHandler, "selected", 4096);
    };
    SegmentedBar.prototype.disposeNativeView = function () {
        this._selectionHandler = null;
        _super.prototype.disposeNativeView.call(this);
    };
    Object.defineProperty(SegmentedBar.prototype, "ios", {
        get: function () {
            return this.nativeViewProtected;
        },
        enumerable: true,
        configurable: true
    });
    SegmentedBar.prototype[segmented_bar_common_1.selectedIndexProperty.getDefault] = function () {
        return -1;
    };
    SegmentedBar.prototype[segmented_bar_common_1.selectedIndexProperty.setNative] = function (value) {
        this.ios.selectedSegmentIndex = value;
    };
    SegmentedBar.prototype[segmented_bar_common_1.itemsProperty.getDefault] = function () {
        return null;
    };
    SegmentedBar.prototype[segmented_bar_common_1.itemsProperty.setNative] = function (value) {
        var segmentedControl = this.ios;
        segmentedControl.removeAllSegments();
        var newItems = value;
        if (newItems && newItems.length) {
            newItems.forEach(function (item, index, arr) {
                var title = item.title;
                title = (title === null || title === undefined) ? "" : title;
                segmentedControl.insertSegmentWithTitleAtIndexAnimated(title, index, false);
            });
        }
        segmented_bar_common_1.selectedIndexProperty.coerce(this);
    };
    SegmentedBar.prototype[segmented_bar_common_1.selectedBackgroundColorProperty.getDefault] = function () {
        return this.ios.tintColor;
    };
    SegmentedBar.prototype[segmented_bar_common_1.selectedBackgroundColorProperty.setNative] = function (value) {
        var color = value instanceof segmented_bar_common_1.Color ? value.ios : value;
        this.ios.tintColor = color;
    };
    SegmentedBar.prototype[segmented_bar_common_1.colorProperty.getDefault] = function () {
        return null;
    };
    SegmentedBar.prototype[segmented_bar_common_1.colorProperty.setNative] = function (value) {
        var color = value instanceof segmented_bar_common_1.Color ? value.ios : value;
        var bar = this.ios;
        var currentAttrs = bar.titleTextAttributesForState(0);
        var attrs = currentAttrs ? currentAttrs.mutableCopy() : NSMutableDictionary.new();
        attrs.setValueForKey(color, NSForegroundColorAttributeName);
        bar.setTitleTextAttributesForState(attrs, 0);
    };
    SegmentedBar.prototype[segmented_bar_common_1.fontInternalProperty.getDefault] = function () {
        return null;
    };
    SegmentedBar.prototype[segmented_bar_common_1.fontInternalProperty.setNative] = function (value) {
        var font = value ? value.getUIFont(UIFont.systemFontOfSize(utils_1.ios.getter(UIFont, UIFont.labelFontSize))) : null;
        var bar = this.ios;
        var currentAttrs = bar.titleTextAttributesForState(0);
        var attrs = currentAttrs ? currentAttrs.mutableCopy() : NSMutableDictionary.new();
        attrs.setValueForKey(font, NSFontAttributeName);
        bar.setTitleTextAttributesForState(attrs, 0);
    };
    return SegmentedBar;
}(segmented_bar_common_1.SegmentedBarBase));
exports.SegmentedBar = SegmentedBar;
var SelectionHandlerImpl = (function (_super) {
    __extends(SelectionHandlerImpl, _super);
    function SelectionHandlerImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SelectionHandlerImpl.initWithOwner = function (owner) {
        var handler = SelectionHandlerImpl.new();
        handler._owner = owner;
        return handler;
    };
    SelectionHandlerImpl.prototype.selected = function (sender) {
        var owner = this._owner.get();
        if (owner) {
            owner.selectedIndex = sender.selectedSegmentIndex;
        }
    };
    SelectionHandlerImpl.ObjCExposedMethods = {
        "selected": { returns: interop.types.void, params: [UISegmentedControl] }
    };
    return SelectionHandlerImpl;
}(NSObject));
//# sourceMappingURL=segmented-bar.ios.js.map