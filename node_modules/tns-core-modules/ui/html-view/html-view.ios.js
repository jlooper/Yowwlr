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
        var view = UITextView.new();
        view.scrollEnabled = false;
        view.editable = false;
        view.selectable = true;
        view.userInteractionEnabled = true;
        view.dataDetectorTypes = 18446744073709552000;
        return view;
    };
    Object.defineProperty(HtmlView.prototype, "ios", {
        get: function () {
            return this.nativeViewProtected;
        },
        enumerable: true,
        configurable: true
    });
    HtmlView.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        var nativeView = this.nativeViewProtected;
        if (nativeView) {
            var width = html_view_common_1.layout.getMeasureSpecSize(widthMeasureSpec);
            var widthMode = html_view_common_1.layout.getMeasureSpecMode(widthMeasureSpec);
            var height = html_view_common_1.layout.getMeasureSpecSize(heightMeasureSpec);
            var heightMode = html_view_common_1.layout.getMeasureSpecMode(heightMeasureSpec);
            var desiredSize = html_view_common_1.layout.measureNativeView(nativeView, width, widthMode, height, heightMode);
            var labelWidth = widthMode === html_view_common_1.layout.AT_MOST ? Math.min(desiredSize.width, width) : desiredSize.width;
            var measureWidth = Math.max(labelWidth, this.effectiveMinWidth);
            var measureHeight = Math.max(desiredSize.height, this.effectiveMinHeight);
            var widthAndState = html_view_common_1.View.resolveSizeAndState(measureWidth, width, widthMode, 0);
            var heightAndState = html_view_common_1.View.resolveSizeAndState(measureHeight, height, heightMode, 0);
            this.setMeasuredDimension(widthAndState, heightAndState);
        }
    };
    HtmlView.prototype[html_view_common_1.htmlProperty.getDefault] = function () {
        return "";
    };
    HtmlView.prototype[html_view_common_1.htmlProperty.setNative] = function (value) {
        var _a;
        var htmlString = NSString.stringWithString(value + "");
        var nsData = htmlString.dataUsingEncoding(NSUnicodeStringEncoding);
        this.nativeViewProtected.attributedText = NSAttributedString.alloc().initWithDataOptionsDocumentAttributesError(nsData, (_a = {}, _a[NSDocumentTypeDocumentAttribute] = NSHTMLTextDocumentType, _a), null);
    };
    return HtmlView;
}(html_view_common_1.HtmlViewBase));
exports.HtmlView = HtmlView;
//# sourceMappingURL=html-view.ios.js.map