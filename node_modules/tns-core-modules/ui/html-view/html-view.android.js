function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var html_view_common_1 = require("./html-view-common");
__export(require("./html-view-common"));
var HtmlView = (function (_super) {
    __extends(HtmlView, _super);
    function HtmlView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HtmlView.prototype.createNativeView = function () {
        return new android.widget.TextView(this._context);
    };
    HtmlView.prototype.initNativeView = function () {
        _super.prototype.initNativeView.call(this);
        var nativeView = this.nativeViewProtected;
        nativeView.setLinksClickable(true);
        nativeView.setMovementMethod(android.text.method.LinkMovementMethod.getInstance());
    };
    HtmlView.prototype.resetNativeView = function () {
        _super.prototype.resetNativeView.call(this);
        this.nativeViewProtected.setAutoLinkMask(0);
    };
    HtmlView.prototype[html_view_common_1.htmlProperty.getDefault] = function () {
        return "";
    };
    HtmlView.prototype[html_view_common_1.htmlProperty.setNative] = function (value) {
        var mask = 15;
        if (value.search(/<a\s/i) >= 0) {
            mask = 0;
        }
        this.nativeViewProtected.setAutoLinkMask(mask);
        this.nativeViewProtected.setText(android.text.Html.fromHtml(value));
    };
    return HtmlView;
}(html_view_common_1.HtmlViewBase));
exports.HtmlView = HtmlView;
//# sourceMappingURL=html-view.android.js.map