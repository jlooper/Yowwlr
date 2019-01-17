Object.defineProperty(exports, "__esModule", { value: true });
var devtools_elements_common_1 = require("./devtools-elements.common");
var dom_node_1 = require("./dom-node");
function attachDOMInspectorEventCallbacks(DOMDomainFrontend) {
    dom_node_1.registerInspectorEvents(DOMDomainFrontend);
    var originalChildNodeInserted = DOMDomainFrontend.childNodeInserted;
    DOMDomainFrontend.childNodeInserted = function (parentId, lastId, node) {
        originalChildNodeInserted(parentId, lastId, JSON.stringify(node.toObject()));
    };
}
exports.attachDOMInspectorEventCallbacks = attachDOMInspectorEventCallbacks;
function attachDOMInspectorCommandCallbacks(DOMDomainBackend) {
    DOMDomainBackend.getDocument = function () {
        return JSON.stringify(devtools_elements_common_1.getDocument());
    };
    DOMDomainBackend.getComputedStylesForNode = function (nodeId) {
        return JSON.stringify(devtools_elements_common_1.getComputedStylesForNode(nodeId));
    };
    DOMDomainBackend.removeNode = devtools_elements_common_1.removeNode;
    DOMDomainBackend.setAttributeAsText = devtools_elements_common_1.setAttributeAsText;
}
exports.attachDOMInspectorCommandCallbacks = attachDOMInspectorCommandCallbacks;
function attachCSSInspectorCommandCallbacks(CSSDomainFrontend) {
}
exports.attachCSSInspectorCommandCallbacks = attachCSSInspectorCommandCallbacks;
//# sourceMappingURL=devtools-elements.android.js.map