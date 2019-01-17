function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var page_common_1 = require("./page-common");
var action_bar_1 = require("../action-bar");
var grid_layout_1 = require("../layouts/grid-layout");
var platform_1 = require("../../platform");
var profiling_1 = require("../../profiling");
__export(require("./page-common"));
var SYSTEM_UI_FLAG_LIGHT_STATUS_BAR = 0x00002000;
var STATUS_BAR_LIGHT_BCKG = -657931;
var STATUS_BAR_DARK_BCKG = 1711276032;
var Page = (function (_super) {
    __extends(Page, _super);
    function Page() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Page.prototype.createNativeView = function () {
        var layout = new org.nativescript.widgets.GridLayout(this._context);
        layout.addRow(new org.nativescript.widgets.ItemSpec(1, org.nativescript.widgets.GridUnitType.auto));
        layout.addRow(new org.nativescript.widgets.ItemSpec(1, org.nativescript.widgets.GridUnitType.star));
        return layout;
    };
    Page.prototype.initNativeView = function () {
        _super.prototype.initNativeView.call(this);
        this.nativeViewProtected.setBackgroundColor(-1);
    };
    Page.prototype._addViewToNativeVisualTree = function (child, atIndex) {
        if (this.nativeViewProtected && child.nativeViewProtected) {
            if (child instanceof action_bar_1.ActionBar) {
                grid_layout_1.GridLayout.setRow(child, 0);
                child.horizontalAlignment = "stretch";
                child.verticalAlignment = "top";
            }
            else {
                grid_layout_1.GridLayout.setRow(child, 1);
            }
        }
        return _super.prototype._addViewToNativeVisualTree.call(this, child, atIndex);
    };
    Page.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        if (this.actionBarHidden !== undefined) {
            this.updateActionBar();
        }
    };
    Page.prototype.updateActionBar = function () {
        this.actionBar.update();
    };
    Page.prototype[page_common_1.actionBarHiddenProperty.setNative] = function (value) {
        this.updateActionBar();
    };
    Page.prototype[page_common_1.statusBarStyleProperty.getDefault] = function () {
        if (platform_1.device.sdkVersion >= "21") {
            var window_1 = this._context.getWindow();
            var decorView = window_1.getDecorView();
            return {
                color: window_1.getStatusBarColor(),
                systemUiVisibility: decorView.getSystemUiVisibility()
            };
        }
        return null;
    };
    Page.prototype[page_common_1.statusBarStyleProperty.setNative] = function (value) {
        if (platform_1.device.sdkVersion >= "21") {
            var window_2 = this._context.getWindow();
            var decorView = window_2.getDecorView();
            if (value === "light") {
                window_2.setStatusBarColor(STATUS_BAR_LIGHT_BCKG);
                decorView.setSystemUiVisibility(SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
            }
            else if (value === "dark") {
                window_2.setStatusBarColor(STATUS_BAR_DARK_BCKG);
                decorView.setSystemUiVisibility(0);
            }
            else {
                window_2.setStatusBarColor(value.color);
                decorView.setSystemUiVisibility(value.systemUiVisibility);
            }
        }
    };
    Page.prototype[page_common_1.androidStatusBarBackgroundProperty.getDefault] = function () {
        if (platform_1.device.sdkVersion >= "21") {
            var window_3 = this._context.getWindow();
            return window_3.getStatusBarColor();
        }
        return null;
    };
    Page.prototype[page_common_1.androidStatusBarBackgroundProperty.setNative] = function (value) {
        if (platform_1.device.sdkVersion >= "21") {
            var window_4 = this._context.getWindow();
            var color = value instanceof page_common_1.Color ? value.android : value;
            window_4.setStatusBarColor(color);
        }
    };
    __decorate([
        profiling_1.profile
    ], Page.prototype, "onLoaded", null);
    return Page;
}(page_common_1.PageBase));
exports.Page = Page;
//# sourceMappingURL=page.android.js.map