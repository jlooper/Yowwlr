function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var font_1 = require("../styling/font");
var segmented_bar_common_1 = require("./segmented-bar-common");
__export(require("./segmented-bar-common"));
var R_ID_TABS = 0x01020013;
var R_ID_TABCONTENT = 0x01020011;
var R_ATTR_STATE_SELECTED = 0x010100a1;
var TITLE_TEXT_VIEW_ID = 16908310;
var apiLevel;
var selectedIndicatorThickness;
var TabHost;
var TabChangeListener;
var TabContentFactory;
function initializeNativeClasses() {
    if (TabChangeListener) {
        return;
    }
    apiLevel = android.os.Build.VERSION.SDK_INT;
    selectedIndicatorThickness = segmented_bar_common_1.layout.toDevicePixels(apiLevel >= 21 ? 2 : 5);
    var TabChangeListenerImpl = (function (_super) {
        __extends(TabChangeListenerImpl, _super);
        function TabChangeListenerImpl(owner) {
            var _this = _super.call(this) || this;
            _this.owner = owner;
            return global.__native(_this);
        }
        TabChangeListenerImpl.prototype.onTabChanged = function (id) {
            var owner = this.owner;
            if (owner.shouldChangeSelectedIndex()) {
                owner.selectedIndex = parseInt(id);
            }
        };
        TabChangeListenerImpl = __decorate([
            Interfaces([android.widget.TabHost.OnTabChangeListener])
        ], TabChangeListenerImpl);
        return TabChangeListenerImpl;
    }(java.lang.Object));
    var TabContentFactoryImpl = (function (_super) {
        __extends(TabContentFactoryImpl, _super);
        function TabContentFactoryImpl(owner) {
            var _this = _super.call(this) || this;
            _this.owner = owner;
            return global.__native(_this);
        }
        TabContentFactoryImpl.prototype.createTabContent = function (tag) {
            var tv = new android.widget.TextView(this.owner._context);
            tv.setVisibility(android.view.View.GONE);
            tv.setMaxLines(1);
            tv.setEllipsize(android.text.TextUtils.TruncateAt.END);
            return tv;
        };
        TabContentFactoryImpl = __decorate([
            Interfaces([android.widget.TabHost.TabContentFactory])
        ], TabContentFactoryImpl);
        return TabContentFactoryImpl;
    }(java.lang.Object));
    var TabHostImpl = (function (_super) {
        __extends(TabHostImpl, _super);
        function TabHostImpl(context, attrs) {
            var _this = _super.call(this, context, attrs) || this;
            return global.__native(_this);
        }
        TabHostImpl.prototype.onAttachedToWindow = function () {
        };
        return TabHostImpl;
    }(android.widget.TabHost));
    TabHost = TabHostImpl;
    TabChangeListener = TabChangeListenerImpl;
    TabContentFactory = TabContentFactoryImpl;
}
var SegmentedBarItem = (function (_super) {
    __extends(SegmentedBarItem, _super);
    function SegmentedBarItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SegmentedBarItem.prototype.setupNativeView = function (tabIndex) {
        var titleTextView = this.parent.nativeViewProtected.getTabWidget().getChildAt(tabIndex).findViewById(TITLE_TEXT_VIEW_ID);
        this.setNativeView(titleTextView);
        if (titleTextView) {
            if (this.titleDirty) {
                this._update();
            }
        }
    };
    SegmentedBarItem.prototype._update = function () {
        var tv = this.nativeViewProtected;
        if (tv) {
            var title = this.title;
            title = (title === null || title === undefined) ? "" : title;
            tv.setText(title);
            this.titleDirty = false;
        }
        else {
            this.titleDirty = true;
        }
    };
    SegmentedBarItem.prototype[segmented_bar_common_1.colorProperty.getDefault] = function () {
        return this.nativeViewProtected.getCurrentTextColor();
    };
    SegmentedBarItem.prototype[segmented_bar_common_1.colorProperty.setNative] = function (value) {
        var color = value instanceof segmented_bar_common_1.Color ? value.android : value;
        this.nativeViewProtected.setTextColor(color);
    };
    SegmentedBarItem.prototype[segmented_bar_common_1.fontSizeProperty.getDefault] = function () {
        return { nativeSize: this.nativeViewProtected.getTextSize() };
    };
    SegmentedBarItem.prototype[segmented_bar_common_1.fontSizeProperty.setNative] = function (value) {
        if (typeof value === "number") {
            this.nativeViewProtected.setTextSize(value);
        }
        else {
            this.nativeViewProtected.setTextSize(android.util.TypedValue.COMPLEX_UNIT_PX, value.nativeSize);
        }
    };
    SegmentedBarItem.prototype[segmented_bar_common_1.fontInternalProperty.getDefault] = function () {
        return this.nativeViewProtected.getTypeface();
    };
    SegmentedBarItem.prototype[segmented_bar_common_1.fontInternalProperty.setNative] = function (value) {
        this.nativeViewProtected.setTypeface(value instanceof font_1.Font ? value.getAndroidTypeface() : value);
    };
    SegmentedBarItem.prototype[segmented_bar_common_1.selectedBackgroundColorProperty.getDefault] = function () {
        var viewGroup = this.nativeViewProtected.getParent();
        return viewGroup.getBackground();
    };
    SegmentedBarItem.prototype[segmented_bar_common_1.selectedBackgroundColorProperty.setNative] = function (value) {
        var nativeView = this.nativeViewProtected;
        var viewGroup = nativeView.getParent();
        if (value instanceof segmented_bar_common_1.Color) {
            var color = value.android;
            var backgroundDrawable = viewGroup.getBackground();
            if (apiLevel > 21 && backgroundDrawable) {
                var newDrawable = tryCloneDrawable(backgroundDrawable, nativeView.getResources());
                newDrawable.setColorFilter(color, android.graphics.PorterDuff.Mode.SRC_IN);
                viewGroup.setBackground(newDrawable);
            }
            else {
                var stateDrawable = new android.graphics.drawable.StateListDrawable();
                var colorDrawable = new org.nativescript.widgets.SegmentedBarColorDrawable(color, selectedIndicatorThickness);
                var arr = Array.create("int", 1);
                arr[0] = R_ATTR_STATE_SELECTED;
                stateDrawable.addState(arr, colorDrawable);
                stateDrawable.setBounds(0, 15, viewGroup.getRight(), viewGroup.getBottom());
                viewGroup.setBackground(stateDrawable);
            }
        }
        else {
            var backgroundDrawable = tryCloneDrawable(value, nativeView.getResources());
            viewGroup.setBackground(backgroundDrawable);
        }
    };
    return SegmentedBarItem;
}(segmented_bar_common_1.SegmentedBarItemBase));
exports.SegmentedBarItem = SegmentedBarItem;
function tryCloneDrawable(value, resources) {
    if (value) {
        var constantState = value.getConstantState();
        if (constantState) {
            return constantState.newDrawable(resources);
        }
    }
    return value;
}
var SegmentedBar = (function (_super) {
    __extends(SegmentedBar, _super);
    function SegmentedBar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SegmentedBar.prototype.shouldChangeSelectedIndex = function () {
        return !this._addingTab;
    };
    SegmentedBar.prototype.createNativeView = function () {
        initializeNativeClasses();
        var context = this._context;
        var nativeView = new TabHost(context, null);
        var tabHostLayout = new android.widget.LinearLayout(context);
        tabHostLayout.setOrientation(android.widget.LinearLayout.VERTICAL);
        var tabWidget = new android.widget.TabWidget(context);
        tabWidget.setId(R_ID_TABS);
        tabHostLayout.addView(tabWidget);
        var frame = new android.widget.FrameLayout(context);
        frame.setId(R_ID_TABCONTENT);
        frame.setVisibility(android.view.View.GONE);
        tabHostLayout.addView(frame);
        nativeView.addView(tabHostLayout);
        return nativeView;
    };
    SegmentedBar.prototype.initNativeView = function () {
        _super.prototype.initNativeView.call(this);
        var nativeView = this.nativeViewProtected;
        var listener = new TabChangeListener(this);
        nativeView.setOnTabChangedListener(listener);
        nativeView.listener = listener;
        nativeView.setup();
        this._tabContentFactory = this._tabContentFactory || new TabContentFactory(this);
    };
    SegmentedBar.prototype.disposeNativeView = function () {
        var nativeView = this.nativeViewProtected;
        nativeView.listener.owner = null;
        _super.prototype.disposeNativeView.call(this);
    };
    SegmentedBar.prototype.insertTab = function (tabItem, index) {
        var tabHost = this.nativeViewProtected;
        var tab = tabHost.newTabSpec(index + "");
        tab.setIndicator(tabItem.title + "");
        tab.setContent(this._tabContentFactory);
        this._addingTab = true;
        tabHost.addTab(tab);
        tabItem.setupNativeView(index);
        this._addingTab = false;
    };
    SegmentedBar.prototype[segmented_bar_common_1.selectedIndexProperty.getDefault] = function () {
        return -1;
    };
    SegmentedBar.prototype[segmented_bar_common_1.selectedIndexProperty.setNative] = function (value) {
        this.nativeViewProtected.setCurrentTab(value);
    };
    SegmentedBar.prototype[segmented_bar_common_1.itemsProperty.getDefault] = function () {
        return null;
    };
    SegmentedBar.prototype[segmented_bar_common_1.itemsProperty.setNative] = function (value) {
        var _this = this;
        this.nativeViewProtected.clearAllTabs();
        var newItems = value;
        if (newItems) {
            newItems.forEach(function (item, i, arr) { return _this.insertTab(item, i); });
        }
        segmented_bar_common_1.selectedIndexProperty.coerce(this);
    };
    return SegmentedBar;
}(segmented_bar_common_1.SegmentedBarBase));
exports.SegmentedBar = SegmentedBar;
//# sourceMappingURL=segmented-bar.android.js.map