Object.defineProperty(exports, "__esModule", { value: true });
var view_1 = require("tns-core-modules/ui/core/view");
var layout_base_1 = require("tns-core-modules/ui/layouts/layout-base");
var page_1 = require("tns-core-modules/ui/page");
var InvisibleNode = /** @class */ (function (_super) {
    __extends(InvisibleNode, _super);
    function InvisibleNode() {
        var _this = _super.call(this) || this;
        _this.nodeType = 1;
        _this.nodeName = getClassName(_this);
        return _this;
    }
    InvisibleNode.prototype.toString = function () {
        return this.nodeName + "(" + this.id + ")";
    };
    return InvisibleNode;
}(view_1.View));
exports.InvisibleNode = InvisibleNode;
var CommentNode = /** @class */ (function (_super) {
    __extends(CommentNode, _super);
    function CommentNode() {
        var _this = _super.call(this) || this;
        _this.meta = {
            skipAddToDom: true,
        };
        _this.id = CommentNode.id.toString();
        CommentNode.id += 1;
        return _this;
    }
    CommentNode.id = 0;
    return CommentNode;
}(InvisibleNode));
exports.CommentNode = CommentNode;
var TextNode = /** @class */ (function (_super) {
    __extends(TextNode, _super);
    function TextNode() {
        var _this = _super.call(this) || this;
        _this.meta = {
            skipAddToDom: true,
        };
        _this.id = TextNode.id.toString();
        TextNode.id += 1;
        return _this;
    }
    TextNode.id = 0;
    return TextNode;
}(InvisibleNode));
exports.TextNode = TextNode;
var getClassName = function (instance) { return instance.constructor.name; };
var ɵ0 = getClassName;
exports.ɵ0 = ɵ0;
function isDetachedElement(element) {
    return (element && element.meta && element.meta.skipAddToDom);
}
exports.isDetachedElement = isDetachedElement;
function isView(view) {
    return view instanceof view_1.View;
}
exports.isView = isView;
function isInvisibleNode(view) {
    return view instanceof InvisibleNode;
}
exports.isInvisibleNode = isInvisibleNode;
var elementMap = new Map();
var camelCaseSplit = /([a-z0-9])([A-Z])/g;
var defaultViewMeta = { skipAddToDom: false };
function registerElement(elementName, resolver, meta) {
    if (elementMap.has(elementName)) {
        throw new Error("Element for " + elementName + " already registered.");
    }
    else {
        var entry = { resolver: resolver, meta: meta };
        elementMap.set(elementName, entry);
        elementMap.set(elementName.toLowerCase(), entry);
        elementMap.set(elementName.replace(camelCaseSplit, "$1-$2").toLowerCase(), entry);
    }
}
exports.registerElement = registerElement;
function getViewClass(elementName) {
    var entry = elementMap.get(elementName) ||
        elementMap.get(elementName.toLowerCase());
    if (!entry) {
        throw new TypeError("No known component for element " + elementName + ".");
    }
    try {
        return entry.resolver();
    }
    catch (e) {
        throw new TypeError("Could not load view for: " + elementName + "." + e);
    }
}
exports.getViewClass = getViewClass;
function getViewMeta(nodeName) {
    var entry = elementMap.get(nodeName) || elementMap.get(nodeName.toLowerCase());
    return (entry && entry.meta) || defaultViewMeta;
}
exports.getViewMeta = getViewMeta;
function isKnownView(elementName) {
    return elementMap.has(elementName) ||
        elementMap.has(elementName.toLowerCase());
}
exports.isKnownView = isKnownView;
function getSingleViewRecursive(nodes, nestLevel) {
    var actualNodes = nodes.filter(function (node) { return !(node instanceof InvisibleNode); });
    if (actualNodes.length === 0) {
        throw new Error("No suitable views found in list template! " +
            ("Nesting level: " + nestLevel));
    }
    else if (actualNodes.length > 1) {
        throw new Error("More than one view found in list template!" +
            ("Nesting level: " + nestLevel));
    }
    var rootLayout = actualNodes[0];
    if (!rootLayout) {
        return getSingleViewRecursive(rootLayout.children, nestLevel + 1);
    }
    var parentLayout = rootLayout.parent;
    if (parentLayout instanceof layout_base_1.LayoutBase) {
        var node = rootLayout.parentNode;
        parentLayout.removeChild(rootLayout);
        rootLayout.parentNode = node;
    }
    return rootLayout;
}
exports.getSingleViewRecursive = getSingleViewRecursive;
var ɵ1 = function (parent, child, next) {
    // Page cannot be added to Frame with _addChildFromBuilder (trows "use defaultPage" error)
    if (isInvisibleNode(child)) {
        return;
    }
    else if (child instanceof page_1.Page) {
        parent.navigate({ create: function () { return child; } });
    }
    else {
        throw new Error("Only a Page can be a child of Frame");
    }
};
exports.ɵ1 = ɵ1;
var frameMeta = {
    insertChild: ɵ1
};
// Register default NativeScript components
// Note: ActionBar related components are registerd together with action-bar directives.
registerElement("AbsoluteLayout", function () { return require("tns-core-modules/ui/layouts/absolute-layout").AbsoluteLayout; });
registerElement("ActivityIndicator", function () { return require("tns-core-modules/ui/activity-indicator").ActivityIndicator; });
registerElement("Border", function () { return require("tns-core-modules/ui/border").Border; });
registerElement("Button", function () { return require("tns-core-modules/ui/button").Button; });
registerElement("ContentView", function () { return require("tns-core-modules/ui/content-view").ContentView; });
registerElement("DatePicker", function () { return require("tns-core-modules/ui/date-picker").DatePicker; });
registerElement("DockLayout", function () { return require("tns-core-modules/ui/layouts/dock-layout").DockLayout; });
registerElement("Frame", function () { return require("tns-core-modules/ui/frame").Frame; }, frameMeta);
registerElement("GridLayout", function () { return require("tns-core-modules/ui/layouts/grid-layout").GridLayout; });
registerElement("HtmlView", function () { return require("tns-core-modules/ui/html-view").HtmlView; });
registerElement("Image", function () { return require("tns-core-modules/ui/image").Image; });
// Parse5 changes <Image> tags to <img>. WTF!
registerElement("img", function () { return require("tns-core-modules/ui/image").Image; });
registerElement("Label", function () { return require("tns-core-modules/ui/label").Label; });
registerElement("ListPicker", function () { return require("tns-core-modules/ui/list-picker").ListPicker; });
registerElement("ListView", function () { return require("tns-core-modules/ui/list-view").ListView; });
registerElement("Page", function () { return require("tns-core-modules/ui/page").Page; });
registerElement("Placeholder", function () { return require("tns-core-modules/ui/placeholder").Placeholder; });
registerElement("Progress", function () { return require("tns-core-modules/ui/progress").Progress; });
registerElement("ProxyViewContainer", function () { return require("tns-core-modules/ui/proxy-view-container").ProxyViewContainer; });
registerElement("Repeater", function () { return require("tns-core-modules/ui/repeater").Repeater; });
registerElement("ScrollView", function () { return require("tns-core-modules/ui/scroll-view").ScrollView; });
registerElement("SearchBar", function () { return require("tns-core-modules/ui/search-bar").SearchBar; });
registerElement("SegmentedBar", function () { return require("tns-core-modules/ui/segmented-bar").SegmentedBar; });
registerElement("SegmentedBarItem", function () { return require("tns-core-modules/ui/segmented-bar").SegmentedBarItem; });
registerElement("Slider", function () { return require("tns-core-modules/ui/slider").Slider; });
registerElement("StackLayout", function () { return require("tns-core-modules/ui/layouts/stack-layout").StackLayout; });
registerElement("FlexboxLayout", function () { return require("tns-core-modules/ui/layouts/flexbox-layout").FlexboxLayout; });
registerElement("Switch", function () { return require("tns-core-modules/ui/switch").Switch; });
registerElement("TabView", function () { return require("tns-core-modules/ui/tab-view").TabView; });
registerElement("TextField", function () { return require("tns-core-modules/ui/text-field").TextField; });
registerElement("TextView", function () { return require("tns-core-modules/ui/text-view").TextView; });
registerElement("TimePicker", function () { return require("tns-core-modules/ui/time-picker").TimePicker; });
registerElement("WebView", function () { return require("tns-core-modules/ui/web-view").WebView; });
registerElement("WrapLayout", function () { return require("tns-core-modules/ui/layouts/wrap-layout").WrapLayout; });
registerElement("FormattedString", function () { return require("tns-core-modules/text/formatted-string").FormattedString; });
registerElement("Span", function () { return require("tns-core-modules/text/span").Span; });
registerElement("DetachedContainer", function () { return require("tns-core-modules/ui/proxy-view-container").ProxyViewContainer; }, { skipAddToDom: true });
registerElement("page-router-outlet", function () { return require("tns-core-modules/ui/frame").Frame; });
//# sourceMappingURL=element-registry.js.map