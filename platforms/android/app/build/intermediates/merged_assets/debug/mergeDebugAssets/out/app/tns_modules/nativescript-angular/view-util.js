Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("tns-core-modules/utils/types");
var view_1 = require("tns-core-modules/ui/core/view");
var content_view_1 = require("tns-core-modules/ui/content-view");
var layout_base_1 = require("tns-core-modules/ui/layouts/layout-base");
var element_registry_1 = require("./element-registry");
var platform_1 = require("tns-core-modules/platform");
var trace_1 = require("./trace");
var ELEMENT_NODE_TYPE = 1;
var XML_ATTRIBUTES = Object.freeze(["style", "rows", "columns", "fontAttributes"]);
var whiteSpaceSplitter = /\s+/;
function isLayout(view) {
    return view instanceof layout_base_1.LayoutBase;
}
exports.isLayout = isLayout;
function isContentView(view) {
    return view instanceof content_view_1.ContentView;
}
exports.isContentView = isContentView;
var propertyMaps = new Map();
var ViewUtil = /** @class */ (function () {
    function ViewUtil(device) {
        this.isIos = device.os === platform_1.platformNames.ios;
        this.isAndroid = device.os === platform_1.platformNames.android;
    }
    ViewUtil.prototype.insertChild = function (parent, child, previous, next) {
        if (!parent) {
            return;
        }
        var extendedParent = this.ensureNgViewExtensions(parent);
        var extendedChild = this.ensureNgViewExtensions(child);
        if (!previous) {
            previous = extendedParent.lastChild;
        }
        this.addToQueue(extendedParent, extendedChild, previous, next);
        if (element_registry_1.isInvisibleNode(child)) {
            extendedChild.parentNode = extendedParent;
        }
        if (!element_registry_1.isDetachedElement(child)) {
            var nextVisual = this.findNextVisual(next);
            this.addToVisualTree(extendedParent, extendedChild, nextVisual);
        }
    };
    ViewUtil.prototype.addToQueue = function (parent, child, previous, next) {
        if (trace_1.isLogEnabled()) {
            trace_1.viewUtilLog("ViewUtil.addToQueue parent: " + parent + ", view: " + child + ", " +
                ("previous: " + previous + ", next: " + next));
        }
        if (previous) {
            previous.nextSibling = child;
        }
        else {
            parent.firstChild = child;
        }
        if (next) {
            child.nextSibling = next;
        }
        else {
            this.appendToQueue(parent, child);
        }
    };
    ViewUtil.prototype.appendToQueue = function (parent, view) {
        if (trace_1.isLogEnabled()) {
            trace_1.viewUtilLog("ViewUtil.appendToQueue parent: " + parent + " view: " + view);
        }
        if (parent.lastChild) {
            parent.lastChild.nextSibling = view;
        }
        parent.lastChild = view;
    };
    ViewUtil.prototype.addToVisualTree = function (parent, child, next) {
        if (trace_1.isLogEnabled()) {
            trace_1.viewUtilLog("ViewUtil.addToVisualTree parent: " + parent + ", view: " + child + ", next: " + next);
        }
        if (parent.meta && parent.meta.insertChild) {
            parent.meta.insertChild(parent, child, next);
        }
        else if (isLayout(parent)) {
            this.insertToLayout(parent, child, next);
        }
        else if (isContentView(parent)) {
            parent.content = child;
        }
        else if (parent && parent._addChildFromBuilder) {
            parent._addChildFromBuilder(child.nodeName, child);
        }
    };
    ViewUtil.prototype.insertToLayout = function (parent, child, next) {
        if (child.parent === parent) {
            this.removeLayoutChild(parent, child);
        }
        var nextVisual = this.findNextVisual(next);
        if (nextVisual) {
            var index = parent.getChildIndex(nextVisual);
            parent.insertChild(child, index);
        }
        else {
            parent.addChild(child);
        }
    };
    ViewUtil.prototype.findNextVisual = function (view) {
        var next = view;
        while (next && element_registry_1.isDetachedElement(next)) {
            next = next.nextSibling;
        }
        return next;
    };
    ViewUtil.prototype.removeChild = function (parent, child) {
        if (trace_1.isLogEnabled()) {
            trace_1.viewUtilLog("ViewUtil.removeChild parent: " + parent + " child: " + child);
        }
        if (!parent) {
            return;
        }
        var extendedParent = this.ensureNgViewExtensions(parent);
        var extendedChild = this.ensureNgViewExtensions(child);
        this.removeFromQueue(extendedParent, extendedChild);
        this.removeFromVisualTree(extendedParent, extendedChild);
    };
    ViewUtil.prototype.removeFromQueue = function (parent, child) {
        if (trace_1.isLogEnabled()) {
            trace_1.viewUtilLog("ViewUtil.removeFromQueue parent: " + parent + " child: " + child);
        }
        if (parent.firstChild === child && parent.lastChild === child) {
            parent.firstChild = null;
            parent.lastChild = null;
            return;
        }
        if (parent.firstChild === child) {
            parent.firstChild = child.nextSibling;
        }
        var previous = this.findPreviousElement(parent, child);
        if (parent.lastChild === child) {
            parent.lastChild = previous;
        }
        if (previous) {
            previous.nextSibling = child.nextSibling;
        }
    };
    // NOTE: This one is O(n) - use carefully
    ViewUtil.prototype.findPreviousElement = function (parent, child) {
        if (trace_1.isLogEnabled()) {
            trace_1.viewUtilLog("ViewUtil.findPreviousElement parent: " + parent + " child: " + child);
        }
        var previousVisual;
        if (isLayout(parent)) {
            previousVisual = this.getPreviousVisualElement(parent, child);
        }
        var previous = previousVisual || parent.firstChild;
        // since detached elements are not added to the visual tree,
        // we need to find the actual previous sibling of the view,
        // which may as well be an invisible node
        while (previous && previous !== child && previous.nextSibling !== child) {
            previous = previous.nextSibling;
        }
        return previous;
    };
    ViewUtil.prototype.getPreviousVisualElement = function (parent, child) {
        var elementIndex = parent.getChildIndex(child);
        if (elementIndex > 0) {
            return parent.getChildAt(elementIndex - 1);
        }
    };
    // NOTE: This one is O(n) - use carefully
    ViewUtil.prototype.getChildIndex = function (parent, child) {
        if (isLayout(parent)) {
            return parent.getChildIndex(child);
        }
        else if (isContentView(parent)) {
            return child === parent.content ? 0 : -1;
        }
    };
    ViewUtil.prototype.removeFromVisualTree = function (parent, child) {
        if (trace_1.isLogEnabled()) {
            trace_1.viewUtilLog("ViewUtil.findPreviousElement parent: " + parent + " child: " + child);
        }
        if (parent.meta && parent.meta.removeChild) {
            parent.meta.removeChild(parent, child);
        }
        else if (isLayout(parent)) {
            this.removeLayoutChild(parent, child);
        }
        else if (isContentView(parent) && parent.content === child) {
            parent.content = null;
            parent.lastChild = null;
            parent.firstChild = null;
        }
        else if (element_registry_1.isView(parent)) {
            parent._removeView(child);
        }
    };
    ViewUtil.prototype.removeLayoutChild = function (parent, child) {
        var index = parent.getChildIndex(child);
        if (index !== -1) {
            parent.removeChild(child);
        }
    };
    ViewUtil.prototype.createComment = function () {
        return new element_registry_1.CommentNode();
    };
    ViewUtil.prototype.createText = function () {
        return new element_registry_1.TextNode();
    };
    ViewUtil.prototype.createView = function (name) {
        if (trace_1.isLogEnabled()) {
            trace_1.viewUtilLog("Creating view: " + name);
        }
        if (!element_registry_1.isKnownView(name)) {
            name = "ProxyViewContainer";
        }
        var viewClass = element_registry_1.getViewClass(name);
        var view = new viewClass();
        var ngView = this.setNgViewExtensions(view, name);
        return ngView;
    };
    ViewUtil.prototype.ensureNgViewExtensions = function (view) {
        if (view.hasOwnProperty("meta")) {
            return view;
        }
        else {
            var name_1 = view.cssType;
            var ngView = this.setNgViewExtensions(view, name_1);
            return ngView;
        }
    };
    ViewUtil.prototype.setNgViewExtensions = function (view, name) {
        var ngView = view;
        ngView.nodeName = name;
        ngView.meta = element_registry_1.getViewMeta(name);
        // we're setting the node type of the view
        // to 'element' because of checks done in the
        // dom animation engine
        ngView.nodeType = ELEMENT_NODE_TYPE;
        return ngView;
    };
    ViewUtil.prototype.setProperty = function (view, attributeName, value, namespace) {
        if (!view || (namespace && !this.runsIn(namespace))) {
            return;
        }
        if (attributeName.indexOf(".") !== -1) {
            // Handle nested properties
            var properties = attributeName.split(".");
            attributeName = properties[properties.length - 1];
            var propMap = this.getProperties(view);
            var i = 0;
            while (i < properties.length - 1 && types_1.isDefined(view)) {
                var prop = properties[i];
                if (propMap.has(prop)) {
                    prop = propMap.get(prop);
                }
                view = view[prop];
                propMap = this.getProperties(view);
                i++;
            }
        }
        if (types_1.isDefined(view)) {
            this.setPropertyInternal(view, attributeName, value);
        }
    };
    ViewUtil.prototype.runsIn = function (platform) {
        return (platform === "ios" && this.isIos) ||
            (platform === "android" && this.isAndroid);
    };
    ViewUtil.prototype.setPropertyInternal = function (view, attributeName, value) {
        if (trace_1.isLogEnabled()) {
            trace_1.viewUtilLog("Setting attribute: " + attributeName + "=" + value + " to " + view);
        }
        if (attributeName === "class") {
            this.setClasses(view, value);
            return;
        }
        if (XML_ATTRIBUTES.indexOf(attributeName) !== -1) {
            view._applyXmlAttribute(attributeName, value);
            return;
        }
        var propMap = this.getProperties(view);
        var propertyName = propMap.get(attributeName);
        if (propertyName) {
            // We have a lower-upper case mapped property.
            view[propertyName] = value;
            return;
        }
        // Unknown attribute value -- just set it to our object as is.
        view[attributeName] = value;
    };
    ViewUtil.prototype.getProperties = function (instance) {
        var type = instance && instance.constructor;
        if (!type) {
            return new Map();
        }
        if (!propertyMaps.has(type)) {
            var propMap = new Map();
            for (var propName in instance) { // tslint:disable:forin
                propMap.set(propName.toLowerCase(), propName);
            }
            propertyMaps.set(type, propMap);
        }
        return propertyMaps.get(type);
    };
    ViewUtil.prototype.cssClasses = function (view) {
        if (!view.ngCssClasses) {
            view.ngCssClasses = new Map();
        }
        return view.ngCssClasses;
    };
    ViewUtil.prototype.addClass = function (view, className) {
        this.cssClasses(view).set(className, true);
        this.syncClasses(view);
    };
    ViewUtil.prototype.removeClass = function (view, className) {
        this.cssClasses(view).delete(className);
        this.syncClasses(view);
    };
    ViewUtil.prototype.setClasses = function (view, classesValue) {
        var _this = this;
        var classes = classesValue.split(whiteSpaceSplitter);
        this.cssClasses(view).clear();
        classes.forEach(function (className) { return _this.cssClasses(view).set(className, true); });
        this.syncClasses(view);
    };
    ViewUtil.prototype.syncClasses = function (view) {
        var classValue = Array.from(this.cssClasses(view).keys()).join(" ");
        view.className = classValue;
    };
    ViewUtil.prototype.setStyle = function (view, styleName, value) {
        view.style[styleName] = value;
    };
    ViewUtil.prototype.removeStyle = function (view, styleName) {
        view.style[styleName] = view_1.unsetValue;
    };
    return ViewUtil;
}());
exports.ViewUtil = ViewUtil;
//# sourceMappingURL=view-util.js.map