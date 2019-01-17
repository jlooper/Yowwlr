function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var view_1 = require("../core/view");
__export(require("../core/view"));
exports.traceCategory = "TabView";
var TabViewItemBase = (function (_super) {
    __extends(TabViewItemBase, _super);
    function TabViewItemBase() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._title = "";
        return _this;
    }
    Object.defineProperty(TabViewItemBase.prototype, "textTransform", {
        get: function () {
            return this.style.textTransform;
        },
        set: function (value) {
            this.style.textTransform = value;
        },
        enumerable: true,
        configurable: true
    });
    TabViewItemBase.prototype._addChildFromBuilder = function (name, value) {
        if (value instanceof view_1.View) {
            this.view = value;
        }
    };
    Object.defineProperty(TabViewItemBase.prototype, "title", {
        get: function () {
            return this._title;
        },
        set: function (value) {
            if (this._title !== value) {
                this._title = value;
                this._update();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabViewItemBase.prototype, "view", {
        get: function () {
            return this._view;
        },
        set: function (value) {
            if (this._view !== value) {
                if (this._view) {
                    throw new Error("Changing the view of an already loaded TabViewItem is not currently supported.");
                }
                this._view = value;
                this._addView(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabViewItemBase.prototype, "iconSource", {
        get: function () {
            return this._iconSource;
        },
        set: function (value) {
            if (this._iconSource !== value) {
                this._iconSource = value;
                this._update();
            }
        },
        enumerable: true,
        configurable: true
    });
    TabViewItemBase.prototype.eachChild = function (callback) {
        var view = this._view;
        if (view) {
            callback(view);
        }
    };
    TabViewItemBase.prototype.loadView = function (view) {
        var tabView = this.parent;
        if (tabView && tabView.items) {
            if (this.canBeLoaded) {
                _super.prototype.loadView.call(this, view);
            }
        }
    };
    TabViewItemBase = __decorate([
        view_1.CSSType("TabViewItem")
    ], TabViewItemBase);
    return TabViewItemBase;
}(view_1.ViewBase));
exports.TabViewItemBase = TabViewItemBase;
var knownCollections;
(function (knownCollections) {
    knownCollections.items = "items";
})(knownCollections = exports.knownCollections || (exports.knownCollections = {}));
var TabViewBase = (function (_super) {
    __extends(TabViewBase, _super);
    function TabViewBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TabViewBase_1 = TabViewBase;
    Object.defineProperty(TabViewBase.prototype, "androidSelectedTabHighlightColor", {
        get: function () {
            return this.style.androidSelectedTabHighlightColor;
        },
        set: function (value) {
            this.style.androidSelectedTabHighlightColor = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabViewBase.prototype, "tabTextFontSize", {
        get: function () {
            return this.style.tabTextFontSize;
        },
        set: function (value) {
            this.style.tabTextFontSize = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabViewBase.prototype, "tabTextColor", {
        get: function () {
            return this.style.tabTextColor;
        },
        set: function (value) {
            this.style.tabTextColor = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabViewBase.prototype, "tabBackgroundColor", {
        get: function () {
            return this.style.tabBackgroundColor;
        },
        set: function (value) {
            this.style.tabBackgroundColor = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabViewBase.prototype, "selectedTabTextColor", {
        get: function () {
            return this.style.selectedTabTextColor;
        },
        set: function (value) {
            this.style.selectedTabTextColor = value;
        },
        enumerable: true,
        configurable: true
    });
    TabViewBase.prototype._addArrayFromBuilder = function (name, value) {
        if (name === "items") {
            this.items = value;
        }
    };
    TabViewBase.prototype._addChildFromBuilder = function (name, value) {
        if (name === "TabViewItem") {
            if (!this.items) {
                this.items = new Array();
            }
            this.items.push(value);
            this._addView(value);
            exports.selectedIndexProperty.coerce(this);
        }
    };
    Object.defineProperty(TabViewBase.prototype, "_selectedView", {
        get: function () {
            var selectedIndex = this.selectedIndex;
            return selectedIndex > -1 ? this.items[selectedIndex].view : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabViewBase.prototype, "_childrenCount", {
        get: function () {
            var items = this.items;
            return items ? items.length : 0;
        },
        enumerable: true,
        configurable: true
    });
    TabViewBase.prototype.eachChild = function (callback) {
        var items = this.items;
        if (items) {
            items.forEach(function (item, i) {
                callback(item);
            });
        }
    };
    TabViewBase.prototype.eachChildView = function (callback) {
        var items = this.items;
        if (items) {
            items.forEach(function (item, i) {
                callback(item.view);
            });
        }
    };
    TabViewBase.prototype.onItemsChanged = function (oldItems, newItems) {
        var _this = this;
        if (oldItems) {
            oldItems.forEach(function (item) { return _this._removeView(item); });
        }
        if (newItems) {
            newItems.forEach(function (item) {
                if (!item.view) {
                    throw new Error("TabViewItem must have a view.");
                }
                _this._addView(item);
            });
        }
    };
    TabViewBase.prototype.onSelectedIndexChanged = function (oldIndex, newIndex) {
        this.notify({ eventName: TabViewBase_1.selectedIndexChangedEvent, object: this, oldIndex: oldIndex, newIndex: newIndex });
    };
    var TabViewBase_1;
    TabViewBase.selectedIndexChangedEvent = "selectedIndexChanged";
    TabViewBase = TabViewBase_1 = __decorate([
        view_1.CSSType("TabView")
    ], TabViewBase);
    return TabViewBase;
}(view_1.View));
exports.TabViewBase = TabViewBase;
function traceMissingIcon(icon) {
    view_1.traceWrite("Could not load tab bar icon: " + icon, view_1.traceCategories.Error, view_1.traceMessageType.error);
}
exports.traceMissingIcon = traceMissingIcon;
exports.selectedIndexProperty = new view_1.CoercibleProperty({
    name: "selectedIndex", defaultValue: -1, affectsLayout: view_1.isIOS,
    valueChanged: function (target, oldValue, newValue) {
        target.onSelectedIndexChanged(oldValue, newValue);
    },
    coerceValue: function (target, value) {
        var items = target.items;
        if (items) {
            var max = items.length - 1;
            if (value < 0) {
                value = 0;
            }
            if (value > max) {
                value = max;
            }
        }
        else {
            value = -1;
        }
        return value;
    },
    valueConverter: function (v) { return parseInt(v); }
});
exports.selectedIndexProperty.register(TabViewBase);
exports.itemsProperty = new view_1.Property({
    name: "items", valueChanged: function (target, oldValue, newValue) {
        target.onItemsChanged(oldValue, newValue);
    }
});
exports.itemsProperty.register(TabViewBase);
exports.iosIconRenderingModeProperty = new view_1.Property({ name: "iosIconRenderingMode", defaultValue: "automatic" });
exports.iosIconRenderingModeProperty.register(TabViewBase);
exports.androidOffscreenTabLimitProperty = new view_1.Property({
    name: "androidOffscreenTabLimit", defaultValue: 1, affectsLayout: view_1.isIOS,
    valueConverter: function (v) { return parseInt(v); }
});
exports.androidOffscreenTabLimitProperty.register(TabViewBase);
exports.androidTabsPositionProperty = new view_1.Property({ name: "androidTabsPosition", defaultValue: "top" });
exports.androidTabsPositionProperty.register(TabViewBase);
exports.androidSwipeEnabledProperty = new view_1.Property({ name: "androidSwipeEnabled", defaultValue: true, valueConverter: view_1.booleanConverter });
exports.androidSwipeEnabledProperty.register(TabViewBase);
exports.tabTextFontSizeProperty = new view_1.CssProperty({ name: "tabTextFontSize", cssName: "tab-text-font-size", valueConverter: function (v) { return parseFloat(v); } });
exports.tabTextFontSizeProperty.register(view_1.Style);
exports.tabTextColorProperty = new view_1.CssProperty({ name: "tabTextColor", cssName: "tab-text-color", equalityComparer: view_1.Color.equals, valueConverter: function (v) { return new view_1.Color(v); } });
exports.tabTextColorProperty.register(view_1.Style);
exports.tabBackgroundColorProperty = new view_1.CssProperty({ name: "tabBackgroundColor", cssName: "tab-background-color", equalityComparer: view_1.Color.equals, valueConverter: function (v) { return new view_1.Color(v); } });
exports.tabBackgroundColorProperty.register(view_1.Style);
exports.selectedTabTextColorProperty = new view_1.CssProperty({ name: "selectedTabTextColor", cssName: "selected-tab-text-color", equalityComparer: view_1.Color.equals, valueConverter: function (v) { return new view_1.Color(v); } });
exports.selectedTabTextColorProperty.register(view_1.Style);
exports.androidSelectedTabHighlightColorProperty = new view_1.CssProperty({ name: "androidSelectedTabHighlightColor", cssName: "android-selected-tab-highlight-color", equalityComparer: view_1.Color.equals, valueConverter: function (v) { return new view_1.Color(v); } });
exports.androidSelectedTabHighlightColorProperty.register(view_1.Style);
//# sourceMappingURL=tab-view-common.js.map