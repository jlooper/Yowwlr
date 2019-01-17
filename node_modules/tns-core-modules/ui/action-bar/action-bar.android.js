function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var action_bar_common_1 = require("./action-bar-common");
var utils_1 = require("../../utils/utils");
var image_source_1 = require("../../image-source");
var application = require("../../application");
__export(require("./action-bar-common"));
var R_ID_HOME = 0x0102002c;
var ACTION_ITEM_ID_OFFSET = 10000;
var DEFAULT_ELEVATION = 4;
var AppCompatTextView;
var actionItemIdGenerator = ACTION_ITEM_ID_OFFSET;
function generateItemId() {
    actionItemIdGenerator++;
    return actionItemIdGenerator;
}
var appResources;
var MenuItemClickListener;
function initializeMenuItemClickListener() {
    if (MenuItemClickListener) {
        return;
    }
    AppCompatTextView = android.support.v7.widget.AppCompatTextView;
    var MenuItemClickListenerImpl = (function (_super) {
        __extends(MenuItemClickListenerImpl, _super);
        function MenuItemClickListenerImpl(owner) {
            var _this = _super.call(this) || this;
            _this.owner = owner;
            return global.__native(_this);
        }
        MenuItemClickListenerImpl.prototype.onMenuItemClick = function (item) {
            var itemId = item.getItemId();
            return this.owner._onAndroidItemSelected(itemId);
        };
        MenuItemClickListenerImpl = __decorate([
            Interfaces([android.support.v7.widget.Toolbar.OnMenuItemClickListener])
        ], MenuItemClickListenerImpl);
        return MenuItemClickListenerImpl;
    }(java.lang.Object));
    MenuItemClickListener = MenuItemClickListenerImpl;
    appResources = application.android.context.getResources();
}
var ActionItem = (function (_super) {
    __extends(ActionItem, _super);
    function ActionItem() {
        var _this = _super.call(this) || this;
        _this._androidPosition = {
            position: "actionBar",
            systemIcon: undefined
        };
        _this._itemId = generateItemId();
        return _this;
    }
    Object.defineProperty(ActionItem.prototype, "android", {
        get: function () {
            return this._androidPosition;
        },
        set: function (value) {
            throw new Error("ActionItem.android is read-only");
        },
        enumerable: true,
        configurable: true
    });
    ActionItem.prototype._getItemId = function () {
        return this._itemId;
    };
    return ActionItem;
}(action_bar_common_1.ActionItemBase));
exports.ActionItem = ActionItem;
var AndroidActionBarSettings = (function () {
    function AndroidActionBarSettings(actionBar) {
        this._iconVisibility = "auto";
        this._actionBar = actionBar;
    }
    Object.defineProperty(AndroidActionBarSettings.prototype, "icon", {
        get: function () {
            return this._icon;
        },
        set: function (value) {
            if (value !== this._icon) {
                this._icon = value;
                this._actionBar._onIconPropertyChanged();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AndroidActionBarSettings.prototype, "iconVisibility", {
        get: function () {
            return this._iconVisibility;
        },
        set: function (value) {
            if (value !== this._iconVisibility) {
                this._iconVisibility = value;
                this._actionBar._onIconPropertyChanged();
            }
        },
        enumerable: true,
        configurable: true
    });
    return AndroidActionBarSettings;
}());
exports.AndroidActionBarSettings = AndroidActionBarSettings;
var NavigationButton = (function (_super) {
    __extends(NavigationButton, _super);
    function NavigationButton() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return NavigationButton;
}(ActionItem));
exports.NavigationButton = NavigationButton;
var ActionBar = (function (_super) {
    __extends(ActionBar, _super);
    function ActionBar() {
        var _this = _super.call(this) || this;
        _this._android = new AndroidActionBarSettings(_this);
        return _this;
    }
    Object.defineProperty(ActionBar.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    ActionBar.prototype._addChildFromBuilder = function (name, value) {
        if (value instanceof NavigationButton) {
            this.navigationButton = value;
        }
        else if (value instanceof ActionItem) {
            this.actionItems.addItem(value);
        }
        else if (value instanceof action_bar_common_1.View) {
            this.titleView = value;
        }
    };
    ActionBar.prototype.createNativeView = function () {
        return new android.support.v7.widget.Toolbar(this._context);
    };
    ActionBar.prototype.initNativeView = function () {
        _super.prototype.initNativeView.call(this);
        var nativeView = this.nativeViewProtected;
        initializeMenuItemClickListener();
        var menuItemClickListener = new MenuItemClickListener(this);
        nativeView.setOnMenuItemClickListener(menuItemClickListener);
        nativeView.menuItemClickListener = menuItemClickListener;
    };
    ActionBar.prototype.disposeNativeView = function () {
        this.nativeViewProtected.menuItemClickListener.owner = null;
        _super.prototype.disposeNativeView.call(this);
    };
    ActionBar.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        this.update();
    };
    ActionBar.prototype.update = function () {
        if (!this.nativeViewProtected) {
            return;
        }
        var page = this.page;
        if (!page.frame || !page.frame._getNavBarVisible(page)) {
            this.nativeViewProtected.setVisibility(android.view.View.GONE);
            return;
        }
        this.nativeViewProtected.setVisibility(android.view.View.VISIBLE);
        this._addActionItems();
        this._updateTitleAndTitleView();
        this._updateIcon();
        this._updateNavigationButton();
    };
    ActionBar.prototype._onAndroidItemSelected = function (itemId) {
        if (this.navigationButton && itemId === R_ID_HOME) {
            this.navigationButton._raiseTap();
            return true;
        }
        var menuItem = undefined;
        var items = this.actionItems.getItems();
        for (var i = 0; i < items.length; i++) {
            if (items[i]._getItemId() === itemId) {
                menuItem = items[i];
                break;
            }
        }
        if (menuItem) {
            menuItem._raiseTap();
            return true;
        }
        return false;
    };
    ActionBar.prototype._updateNavigationButton = function () {
        var navButton = this.navigationButton;
        if (navButton && action_bar_common_1.isVisible(navButton)) {
            var systemIcon = navButton.android.systemIcon;
            if (systemIcon !== undefined) {
                var systemResourceId = getSystemResourceId(systemIcon);
                if (systemResourceId) {
                    this.nativeViewProtected.setNavigationIcon(systemResourceId);
                }
            }
            else if (navButton.icon) {
                var drawableOrId = getDrawableOrResourceId(navButton.icon, appResources);
                if (drawableOrId) {
                    this.nativeViewProtected.setNavigationIcon(drawableOrId);
                }
            }
            this.nativeViewProtected.setNavigationContentDescription(navButton.text || null);
            var navBtn_1 = new WeakRef(navButton);
            this.nativeViewProtected.setNavigationOnClickListener(new android.view.View.OnClickListener({
                onClick: function (v) {
                    var owner = navBtn_1.get();
                    if (owner) {
                        owner._raiseTap();
                    }
                }
            }));
        }
        else {
            this.nativeViewProtected.setNavigationIcon(null);
        }
    };
    ActionBar.prototype._updateIcon = function () {
        var visibility = getIconVisibility(this.android.iconVisibility);
        if (visibility) {
            var icon = this.android.icon;
            if (icon !== undefined) {
                var drawableOrId = getDrawableOrResourceId(icon, appResources);
                if (drawableOrId) {
                    this.nativeViewProtected.setLogo(drawableOrId);
                }
            }
            else {
                var defaultIcon = application.android.nativeApp.getApplicationInfo().icon;
                this.nativeViewProtected.setLogo(defaultIcon);
            }
        }
        else {
            this.nativeViewProtected.setLogo(null);
        }
    };
    ActionBar.prototype._updateTitleAndTitleView = function () {
        if (!this.titleView) {
            var title = this.title;
            if (title !== undefined) {
                this.nativeViewProtected.setTitle(title);
            }
            else {
                var appContext = application.android.context;
                var appInfo = appContext.getApplicationInfo();
                var appLabel = appContext.getPackageManager().getApplicationLabel(appInfo);
                if (appLabel) {
                    this.nativeViewProtected.setTitle(appLabel);
                }
            }
        }
    };
    ActionBar.prototype._addActionItems = function () {
        var menu = this.nativeViewProtected.getMenu();
        var items = this.actionItems.getVisibleItems();
        menu.clear();
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var menuItem = menu.add(android.view.Menu.NONE, item._getItemId(), android.view.Menu.NONE, item.text + "");
            if (item.actionView && item.actionView.android) {
                item.android.position = "actionBar";
                menuItem.setActionView(item.actionView.android);
                ActionBar._setOnClickListener(item);
            }
            else if (item.android.systemIcon) {
                var systemResourceId = getSystemResourceId(item.android.systemIcon);
                if (systemResourceId) {
                    menuItem.setIcon(systemResourceId);
                }
            }
            else if (item.icon) {
                var drawableOrId = getDrawableOrResourceId(item.icon, appResources);
                if (drawableOrId) {
                    menuItem.setIcon(drawableOrId);
                }
            }
            var showAsAction = getShowAsAction(item);
            menuItem.setShowAsAction(showAsAction);
        }
    };
    ActionBar._setOnClickListener = function (item) {
        var weakRef = new WeakRef(item);
        item.actionView.android.setOnClickListener(new android.view.View.OnClickListener({
            onClick: function (v) {
                var owner = weakRef.get();
                if (owner) {
                    owner._raiseTap();
                }
            }
        }));
    };
    ActionBar.prototype._onTitlePropertyChanged = function () {
        if (this.nativeViewProtected) {
            this._updateTitleAndTitleView();
        }
    };
    ActionBar.prototype._onIconPropertyChanged = function () {
        if (this.nativeViewProtected) {
            this._updateIcon();
        }
    };
    ActionBar.prototype._addViewToNativeVisualTree = function (child, atIndex) {
        if (atIndex === void 0) { atIndex = Number.MAX_VALUE; }
        _super.prototype._addViewToNativeVisualTree.call(this, child);
        if (this.nativeViewProtected && child.nativeViewProtected) {
            if (atIndex >= this.nativeViewProtected.getChildCount()) {
                this.nativeViewProtected.addView(child.nativeViewProtected);
            }
            else {
                this.nativeViewProtected.addView(child.nativeViewProtected, atIndex);
            }
            return true;
        }
        return false;
    };
    ActionBar.prototype._removeViewFromNativeVisualTree = function (child) {
        _super.prototype._removeViewFromNativeVisualTree.call(this, child);
        if (this.nativeViewProtected && child.nativeViewProtected) {
            this.nativeViewProtected.removeView(child.nativeViewProtected);
        }
    };
    ActionBar.prototype[action_bar_common_1.colorProperty.getDefault] = function () {
        var nativeView = this.nativeViewProtected;
        if (!defaultTitleTextColor) {
            var tv = getAppCompatTextView(nativeView);
            if (!tv) {
                var title = nativeView.getTitle();
                nativeView.setTitle("");
                tv = getAppCompatTextView(nativeView);
                if (title) {
                    nativeView.setTitle(title);
                }
            }
            defaultTitleTextColor = tv ? tv.getTextColors().getDefaultColor() : -570425344;
        }
        return defaultTitleTextColor;
    };
    ActionBar.prototype[action_bar_common_1.colorProperty.setNative] = function (value) {
        var color = value instanceof action_bar_common_1.Color ? value.android : value;
        this.nativeViewProtected.setTitleTextColor(color);
    };
    ActionBar.prototype[action_bar_common_1.flatProperty.setNative] = function (value) {
        var compat = android.support.v4.view.ViewCompat;
        if (compat.setElevation) {
            if (value) {
                compat.setElevation(this.nativeViewProtected, 0);
            }
            else {
                var val = DEFAULT_ELEVATION * action_bar_common_1.layout.getDisplayDensity();
                compat.setElevation(this.nativeViewProtected, val);
            }
        }
    };
    return ActionBar;
}(action_bar_common_1.ActionBarBase));
exports.ActionBar = ActionBar;
function getAppCompatTextView(toolbar) {
    for (var i = 0, count = toolbar.getChildCount(); i < count; i++) {
        var child = toolbar.getChildAt(i);
        if (child instanceof AppCompatTextView) {
            return child;
        }
    }
    return null;
}
ActionBar.prototype.recycleNativeView = "auto";
var defaultTitleTextColor;
function getDrawableOrResourceId(icon, resources) {
    if (typeof icon !== "string") {
        return undefined;
    }
    var result = undefined;
    if (icon.indexOf(utils_1.RESOURCE_PREFIX) === 0) {
        var resourceId = resources.getIdentifier(icon.substr(utils_1.RESOURCE_PREFIX.length), "drawable", application.android.packageName);
        if (resourceId > 0) {
            result = resourceId;
        }
    }
    else {
        var drawable = void 0;
        var is = image_source_1.fromFileOrResource(icon);
        if (is) {
            drawable = new android.graphics.drawable.BitmapDrawable(is.android);
        }
        result = drawable;
    }
    if (!result) {
        action_bar_common_1.traceMissingIcon(icon);
    }
    return result;
}
function getShowAsAction(menuItem) {
    switch (menuItem.android.position) {
        case "actionBarIfRoom":
            return android.view.MenuItem.SHOW_AS_ACTION_IF_ROOM;
        case "popup":
            return android.view.MenuItem.SHOW_AS_ACTION_NEVER;
        case "actionBar":
        default:
            return android.view.MenuItem.SHOW_AS_ACTION_ALWAYS;
    }
}
function getIconVisibility(iconVisibility) {
    switch (iconVisibility) {
        case "always":
            return true;
        case "auto":
        case "never":
        default:
            return false;
    }
}
function getSystemResourceId(systemIcon) {
    return android.content.res.Resources.getSystem().getIdentifier(systemIcon, "drawable", "android");
}
//# sourceMappingURL=action-bar.android.js.map