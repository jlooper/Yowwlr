Object.defineProperty(exports, "__esModule", { value: true });
var trace_1 = require("./trace");
var NativeScriptDomAdapter = /** @class */ (function () {
    function NativeScriptDomAdapter() {
        this.resourceLoaderType = null;
    }
    NativeScriptDomAdapter.makeCurrent = function () {
        // Don't register when bundling (likely AoT setup).
        if (!global.TNS_WEBPACK) {
            try {
                var privateAPI = global.require("@angular/platform-browser");
                var setRootDomAdapter = privateAPI.ɵsetRootDomAdapter;
                if (trace_1.isLogEnabled()) {
                    trace_1.rendererLog("Setting root DOM adapter...");
                }
                setRootDomAdapter(new NativeScriptDomAdapter());
            }
            catch (e) {
                if (trace_1.isLogEnabled()) {
                    trace_1.rendererLog("@angular/platform-browser package not present. NOT setting root DOM adapter...");
                }
            }
        }
    };
    NativeScriptDomAdapter.prototype.hasProperty = function (_element, _name) {
        // TODO: actually check if the property exists.
        return true;
    };
    NativeScriptDomAdapter.prototype.log = function (arg) {
        console.log(arg);
    };
    NativeScriptDomAdapter.prototype.logError = function (arg) {
        console.log(arg);
    };
    NativeScriptDomAdapter.prototype.logGroup = function (arg) {
        console.log(arg);
    };
    NativeScriptDomAdapter.prototype.logGroupEnd = function () {
    };
    Object.defineProperty(NativeScriptDomAdapter.prototype, "attrToPropMap", {
        get: function () { throw new Error("Not implemented!"); },
        set: function (_value) { throw new Error("Not implemented!"); },
        enumerable: true,
        configurable: true
    });
    ;
    ;
    NativeScriptDomAdapter.prototype.setProperty = function (_el, _name, _value) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.getProperty = function (_el, _name) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.invoke = function (_el, _methodName, _args) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.contains = function (_nodeA, _nodeB) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.parse = function (_templateHtml) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.query = function (_selector) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.querySelector = function (_el /** TODO #9100 */, _selector) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.querySelectorAll = function (_el /** TODO #9100 */, _selector) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.on = function (_el /** TODO #9100 */, _evt /** TODO #9100 */, _listener /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.onAndCancel = function (_el /** TODO #9100 */, _evt /** TODO #9100 */, _listener /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.dispatchEvent = function (_el /** TODO #9100 */, _evt /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.createMouseEvent = function (_eventType /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.createEvent = function (_eventType) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.preventDefault = function (_evt /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.isPrevented = function (_evt /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.getInnerHTML = function (_el /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.getTemplateContent = function (_el /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.getOuterHTML = function (_el /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.nodeName = function (_node /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.nodeValue = function (_node /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.type = function (_node /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.content = function (_node /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.firstChild = function (_el /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.nextSibling = function (_el /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.parentElement = function (_el /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.childNodes = function (_el /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.childNodesAsList = function (_el /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.clearNodes = function (_el /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.appendChild = function (_el /** TODO #9100 */, _node /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.removeChild = function (_el /** TODO #9100 */, _node /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.replaceChild = function (_el /** TODO #9100 */, _newNode /** TODO #9100 */, _oldNode /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.remove = function (_el /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.insertBefore = function (_el /** TODO #9100 */, _node /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.insertAllBefore = function (_el /** TODO #9100 */, _nodes /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.insertAfter = function (_el /** TODO #9100 */, _node /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.setInnerHTML = function (_el /** TODO #9100 */, _value /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.getText = function (_el /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.setText = function (_el /** TODO #9100 */, _value) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.getValue = function (_el /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.setValue = function (_el /** TODO #9100 */, _value) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.getChecked = function (_el /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.setChecked = function (_el /** TODO #9100 */, _value) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.createComment = function (_text) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.createTemplate = function (_html /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.createElement = function (_tagName /** TODO #9100 */, _doc /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.createElementNS = function (_ns, _tagName, _doc /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.createTextNode = function (_text, _doc /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.createScriptTag = function (_attrName, _attrValue, _doc /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.createStyleElement = function (_css, _doc /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.createShadowRoot = function (_el /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.getShadowRoot = function (_el /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.getHost = function (_el /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.getDistributedNodes = function (_el /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.clone /*<T extends Node>*/ = function (_node /*T*/) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.getElementsByClassName = function (_element /** TODO #9100 */, _name) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.getElementsByTagName = function (_element /** TODO #9100 */, _name) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.classList = function (_element /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.addClass = function (_element /** TODO #9100 */, _className) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.removeClass = function (_element /** TODO #9100 */, _className) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.hasClass = function (_element /** TODO #9100 */, _className) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.setStyle = function (_element /** TODO #9100 */, _styleName, _styleValue) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.removeStyle = function (_element /** TODO #9100 */, _styleName) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.getStyle = function (_element /** TODO #9100 */, _styleName) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.hasStyle = function (_element /** TODO #9100 */, _styleName, _styleValue) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.tagName = function (_element /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.attributeMap = function (_element /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.hasAttribute = function (_element /** TODO #9100 */, _attribute) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.hasAttributeNS = function (_element /** TODO #9100 */, _ns, _attribute) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.getAttribute = function (_element /** TODO #9100 */, _attribute) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.getAttributeNS = function (_element /** TODO #9100 */, _ns, _attribute) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.setAttribute = function (_element /** TODO #9100 */, _name, _value) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.setAttributeNS = function (_element /** TODO #9100 */, _ns, _name, _value) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.removeAttribute = function (_element /** TODO #9100 */, _attribute) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.removeAttributeNS = function (_element /** TODO #9100 */, _ns, _attribute) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.templateAwareRoot = function (_el /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.createHtmlDocument = function () { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.defaultDoc = function () { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.getDefaultDocument = function () { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.getBoundingClientRect = function (_el /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.getTitle = function () { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.setTitle = function (_doc, _newTitle) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.elementMatches = function (_n /** TODO #9100 */, _selector) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.isTemplateElement = function (_el) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.isTextNode = function (_node /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.isCommentNode = function (_node /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.isElementNode = function (_node /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.hasShadowRoot = function (_node /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.isShadowRoot = function (_node /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.importIntoDoc /*<T extends Node>*/ = function (_node /*T*/) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.adoptNode /*<T extends Node>*/ = function (_node /*T*/) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.getHref = function (_element /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.getEventKey = function (_event /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.resolveAndSetHref = function (_element /** TODO #9100 */, _baseUrl, _href) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.supportsDOMEvents = function () { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.supportsNativeShadowDOM = function () { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.getGlobalEventTarget = function (_doc, _target) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.getHistory = function () { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.getLocation = function () { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.getBaseHref = function () { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.resetBaseElement = function () { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.getUserAgent = function () { return "Fake user agent"; };
    NativeScriptDomAdapter.prototype.setData = function (_element /** TODO #9100 */, _name, _value) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.getComputedStyle = function (_element /** TODO #9100 */) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.getData = function (_element /** TODO #9100 */, _name) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.setGlobalVar = function (_name, _value) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.supportsWebAnimation = function () { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.performanceNow = function () { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.getAnimationPrefix = function () { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.getTransitionEnd = function () { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.supportsAnimation = function () { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.supportsCookies = function () { return false; };
    NativeScriptDomAdapter.prototype.getCookie = function (_name) { throw new Error("Not implemented!"); };
    NativeScriptDomAdapter.prototype.setCookie = function (_name, _value) { throw new Error("Not implemented!"); };
    return NativeScriptDomAdapter;
}());
exports.NativeScriptDomAdapter = NativeScriptDomAdapter;
NativeScriptDomAdapter.makeCurrent();
//# sourceMappingURL=dom-adapter.js.map