Object.defineProperty(exports, "__esModule", { value: true });
var content_view_1 = require("tns-core-modules/ui/content-view");
var grid_layout_1 = require("tns-core-modules/ui/layouts/grid-layout");
var proxy_view_container_1 = require("tns-core-modules/ui/proxy-view-container");
var AppHostView = /** @class */ (function (_super) {
    __extends(AppHostView, _super);
    function AppHostView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(AppHostView.prototype, "ngAppRoot", {
        get: function () {
            return this._ngAppRoot;
        },
        set: function (value) {
            this._ngAppRoot = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppHostView.prototype, "content", {
        get: function () {
            return this._content;
        },
        set: function (value) {
            if (this._content) {
                this._content.parentNode = undefined;
            }
            this._content = value;
            if (value) {
                this._content.parentNode = this;
            }
            this.ngAppRoot = value;
            if (this._content instanceof proxy_view_container_1.ProxyViewContainer) {
                var grid = new grid_layout_1.GridLayout();
                grid.addChild(this._content);
                this.ngAppRoot = grid;
            }
        },
        enumerable: true,
        configurable: true
    });
    return AppHostView;
}(content_view_1.ContentView));
exports.AppHostView = AppHostView;
//# sourceMappingURL=app-host-view.js.map