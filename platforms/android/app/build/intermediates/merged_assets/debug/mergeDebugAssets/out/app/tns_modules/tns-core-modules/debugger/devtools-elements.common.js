Object.defineProperty(exports, "__esModule", { value: true });
var dom_node_1 = require("./dom-node");
var frameTopmost = function () { return require("../ui/frame").topmost(); };
var unsetValue;
function unsetViewValue(view, name) {
    if (!unsetValue) {
        unsetValue = require("../ui/core/properties").unsetValue;
    }
    view[name] = unsetValue;
}
function getViewById(nodeId) {
    var node = dom_node_1.getNodeById(nodeId);
    var view;
    if (node) {
        view = node.viewRef.get();
    }
    return view;
}
function getDocument() {
    var topMostFrame = frameTopmost();
    if (!topMostFrame) {
        return undefined;
    }
    try {
        topMostFrame.ensureDomNode();
    }
    catch (e) {
        console.log("ERROR in getDocument(): " + e);
    }
    return topMostFrame.domNode.toObject();
}
exports.getDocument = getDocument;
function getComputedStylesForNode(nodeId) {
    var view = getViewById(nodeId);
    if (view) {
        return view.domNode.getComputedProperties();
    }
    return [];
}
exports.getComputedStylesForNode = getComputedStylesForNode;
function removeNode(nodeId) {
    var view = getViewById(nodeId);
    if (view) {
        var parent_1 = view.parent;
        if (parent_1.removeChild) {
            parent_1.removeChild(view);
        }
        else if (parent_1.content === view) {
            parent_1.content = null;
        }
        else {
            console.log("Can't remove child from " + parent_1);
        }
    }
}
exports.removeNode = removeNode;
function setAttributeAsText(nodeId, text, name) {
    var view = getViewById(nodeId);
    if (view) {
        var hasOriginalAttribute = !!name.trim();
        if (text) {
            var textParts = text.split("=");
            if (textParts.length === 2) {
                var attrName = textParts[0];
                var attrValue = textParts[1].replace(/['"]+/g, "");
                if (name !== attrName && hasOriginalAttribute) {
                    unsetViewValue(view, name);
                    view[attrName] = attrValue;
                }
                else {
                    view[hasOriginalAttribute ? name : attrName] = attrValue;
                }
            }
        }
        else {
            unsetViewValue(view, name);
        }
        view.domNode.loadAttributes();
    }
}
exports.setAttributeAsText = setAttributeAsText;
//# sourceMappingURL=devtools-elements.common.js.map