Object.defineProperty(exports, "__esModule", { value: true });
var devtools_elements_common_1 = require("./devtools-elements.common");
var dom_node_1 = require("./dom-node");
function attachDOMInspectorEventCallbacks(DOMDomainFrontend) {
    dom_node_1.registerInspectorEvents(DOMDomainFrontend);
    var originalChildNodeInserted = DOMDomainFrontend.childNodeInserted;
    DOMDomainFrontend.childNodeInserted = function (parentId, lastId, node) {
        originalChildNodeInserted(parentId, lastId, node.toObject());
    };
}
exports.attachDOMInspectorEventCallbacks = attachDOMInspectorEventCallbacks;
function attachDOMInspectorCommandCallbacks(DOMDomainBackend) {
    DOMDomainBackend.getDocument = devtools_elements_common_1.getDocument;
    DOMDomainBackend.removeNode = devtools_elements_common_1.removeNode;
    DOMDomainBackend.setAttributeAsText = devtools_elements_common_1.setAttributeAsText;
}
exports.attachDOMInspectorCommandCallbacks = attachDOMInspectorCommandCallbacks;
function attachCSSInspectorCommandCallbacks(CSSDomainBackend) {
    CSSDomainBackend.getComputedStylesForNode = devtools_elements_common_1.getComputedStylesForNode;
}
exports.attachCSSInspectorCommandCallbacks = attachCSSInspectorCommandCallbacks;
//# sourceMappingURL=devtools-elements.ios.js.map