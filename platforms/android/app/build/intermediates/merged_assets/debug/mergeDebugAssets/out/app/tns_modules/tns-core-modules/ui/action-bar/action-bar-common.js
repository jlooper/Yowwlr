function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var profiling_1 = require("../../profiling");
__export(require("../core/view"));
var view_1 = require("../core/view");
var knownCollections;
(function (knownCollections) {
    knownCollections.actionItems = "actionItems";
})(knownCollections = exports.knownCollections || (exports.knownCollections = {}));
var ActionBarBase = (function (_super) {
    __extends(ActionBarBase, _super);
    function ActionBarBase() {
        var _this = _super.call(this) || this;
        _this._actionItems = new ActionItems(_this);
        return _this;
    }
    Object.defineProperty(ActionBarBase.prototype, "navigationButton", {
        get: function () {
            return this._navigationButton;
        },
        set: function (value) {
            if (this._navigationButton !== value) {
                if (this._navigationButton) {
                    this._removeView(this._navigationButton);
                    this._navigationButton.actionBar = undefined;
                }
                this._navigationButton = value;
                if (this._navigationButton) {
                    this._navigationButton.actionBar = this;
                    this._addView(this._navigationButton);
                }
                this.update();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionBarBase.prototype, "actionItems", {
        get: function () {
            return this._actionItems;
        },
        set: function (value) {
            throw new Error("actionItems property is read-only");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionBarBase.prototype, "titleView", {
        get: function () {
            return this._titleView;
        },
        set: function (value) {
            if (this._titleView !== value) {
                if (this._titleView) {
                    this._removeView(this._titleView);
                    this._titleView.style[view_1.horizontalAlignmentProperty.cssName] = view_1.unsetValue;
                    this._titleView.style[view_1.verticalAlignmentProperty.cssName] = view_1.unsetValue;
                }
                this._titleView = value;
                if (value) {
                    this._addView(value);
                    var style = value.style;
                    if (!view_1.horizontalAlignmentProperty.isSet(style)) {
                        style[view_1.horizontalAlignmentProperty.cssName] = "center";
                    }
                    if (!view_1.verticalAlignmentProperty.isSet(style)) {
                        style[view_1.verticalAlignmentProperty.cssName] = "middle";
                    }
                }
                this.update();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionBarBase.prototype, "android", {
        get: function () {
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionBarBase.prototype, "_childrenCount", {
        get: function () {
            var actionViewsCount = 0;
            this._actionItems.getItems().forEach(function (actionItem) {
                if (actionItem.actionView) {
                    actionViewsCount++;
                }
            });
            return actionViewsCount + (this.titleView ? 1 : 0);
        },
        enumerable: true,
        configurable: true
    });
    ActionBarBase.prototype.update = function () {
    };
    ActionBarBase.prototype._onTitlePropertyChanged = function () {
    };
    ActionBarBase.prototype._addArrayFromBuilder = function (name, value) {
        if (name === "actionItems") {
            this.actionItems.setItems(value);
        }
    };
    ActionBarBase.prototype.eachChildView = function (callback) {
        var titleView = this.titleView;
        if (titleView) {
            callback(titleView);
        }
    };
    ActionBarBase.prototype.eachChild = function (callback) {
        var titleView = this.titleView;
        if (titleView) {
            callback(titleView);
        }
        var navigationButton = this._navigationButton;
        if (navigationButton) {
            callback(navigationButton);
        }
        this.actionItems.getItems().forEach(function (actionItem) {
            callback(actionItem);
        });
    };
    ActionBarBase.prototype._isEmpty = function () {
        if (this.title ||
            this.titleView ||
            (this.android && this.android.icon) ||
            this.navigationButton ||
            this.actionItems.getItems().length > 0) {
            return false;
        }
        return true;
    };
    ActionBarBase = __decorate([
        view_1.CSSType("ActionBar")
    ], ActionBarBase);
    return ActionBarBase;
}(view_1.View));
exports.ActionBarBase = ActionBarBase;
var ActionItems = (function () {
    function ActionItems(actionBar) {
        this._items = new Array();
        this._actionBar = actionBar;
    }
    ActionItems.prototype.addItem = function (item) {
        if (!item) {
            throw new Error("Cannot add empty item");
        }
        this._items.push(item);
        item.actionBar = this._actionBar;
        this._actionBar._addView(item);
        this.invalidate();
    };
    ActionItems.prototype.removeItem = function (item) {
        if (!item) {
            throw new Error("Cannot remove empty item");
        }
        var itemIndex = this._items.indexOf(item);
        if (itemIndex < 0) {
            throw new Error("Cannot find item to remove");
        }
        this._items.splice(itemIndex, 1);
        this._actionBar._removeView(item);
        item.actionBar = undefined;
        this.invalidate();
    };
    ActionItems.prototype.getItems = function () {
        return this._items.slice();
    };
    ActionItems.prototype.getVisibleItems = function () {
        var visibleItems = [];
        this._items.forEach(function (item) {
            if (isVisible(item)) {
                visibleItems.push(item);
            }
        });
        return visibleItems;
    };
    ActionItems.prototype.getItemAt = function (index) {
        if (index < 0 || index >= this._items.length) {
            return undefined;
        }
        return this._items[index];
    };
    ActionItems.prototype.setItems = function (items) {
        while (this._items.length > 0) {
            this.removeItem(this._items[this._items.length - 1]);
        }
        for (var i = 0; i < items.length; i++) {
            this.addItem(items[i]);
        }
        this.invalidate();
    };
    ActionItems.prototype.invalidate = function () {
        if (this._actionBar) {
            this._actionBar.update();
        }
    };
    return ActionItems;
}());
exports.ActionItems = ActionItems;
var ActionItemBase = (function (_super) {
    __extends(ActionItemBase, _super);
    function ActionItemBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ActionItemBase.prototype, "actionView", {
        get: function () {
            return this._actionView;
        },
        set: function (value) {
            if (this._actionView !== value) {
                if (this._actionView) {
                    this._actionView.style[view_1.horizontalAlignmentProperty.cssName] = view_1.unsetValue;
                    this._actionView.style[view_1.verticalAlignmentProperty.cssName] = view_1.unsetValue;
                    this._removeView(this._actionView);
                }
                this._actionView = value;
                if (this._actionView) {
                    this._addView(this._actionView);
                }
                if (this._actionBar) {
                    this._actionBar.update();
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionItemBase.prototype, "actionBar", {
        get: function () {
            return this._actionBar;
        },
        set: function (value) {
            if (value !== this._actionBar) {
                this._actionBar = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    ActionItemBase.prototype.onLoaded = function () {
        if (this._actionView) {
            this._actionView.style[view_1.horizontalAlignmentProperty.cssName] = "center";
            this._actionView.style[view_1.verticalAlignmentProperty.cssName] = "middle";
        }
        _super.prototype.onLoaded.call(this);
    };
    ActionItemBase.prototype._raiseTap = function () {
        this._emit(ActionItemBase.tapEvent);
    };
    ActionItemBase.prototype._addChildFromBuilder = function (name, value) {
        this.actionView = value;
    };
    ActionItemBase.prototype._onVisibilityChanged = function (visibility) {
        if (this.actionBar) {
            this.actionBar.update();
        }
    };
    ActionItemBase.prototype.eachChild = function (callback) {
        if (this._actionView) {
            callback(this._actionView);
        }
    };
    ActionItemBase.tapEvent = "tap";
    __decorate([
        profiling_1.profile
    ], ActionItemBase.prototype, "onLoaded", null);
    return ActionItemBase;
}(view_1.ViewBase));
exports.ActionItemBase = ActionItemBase;
function isVisible(item) {
    return item.visibility === "visible";
}
exports.isVisible = isVisible;
function onTitlePropertyChanged(actionBar, oldValue, newValue) {
    actionBar._onTitlePropertyChanged();
}
exports.titleProperty = new view_1.Property({ name: "title", valueChanged: onTitlePropertyChanged });
exports.titleProperty.register(ActionBarBase);
function onItemChanged(item, oldValue, newValue) {
    if (item.actionBar) {
        item.actionBar.update();
    }
}
function onVisibilityChanged(item, oldValue, newValue) {
    item._onVisibilityChanged(newValue);
}
function traceMissingIcon(icon) {
    view_1.traceWrite("Could not load action bar icon: " + icon, view_1.traceCategories.Error, view_1.traceMessageType.error);
}
exports.traceMissingIcon = traceMissingIcon;
exports.textProperty = new view_1.Property({ name: "text", defaultValue: "", valueChanged: onItemChanged });
exports.textProperty.register(ActionItemBase);
exports.iconProperty = new view_1.Property({ name: "icon", valueChanged: onItemChanged });
exports.iconProperty.register(ActionItemBase);
exports.visibilityProperty = new view_1.Property({ name: "visibility", defaultValue: "visible", valueChanged: onVisibilityChanged });
exports.visibilityProperty.register(ActionItemBase);
exports.flatProperty = new view_1.Property({ name: "flat", defaultValue: false, valueConverter: view_1.booleanConverter });
exports.flatProperty.register(ActionBarBase);
//# sourceMappingURL=action-bar-common.js.map