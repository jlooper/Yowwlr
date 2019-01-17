Object.defineProperty(exports, "__esModule", { value: true });
var registeredDomNodes = {};
var ELEMENT_NODE_TYPE = 1;
var ROOT_NODE_TYPE = 9;
var propertyBlacklist = [
    "effectivePaddingLeft",
    "effectivePaddingBottom",
    "effectivePaddingRight",
    "effectivePaddingTop",
    "effectiveBorderTopWidth",
    "effectiveBorderRightWidth",
    "effectiveBorderBottomWidth",
    "effectiveBorderLeftWidth",
    "effectiveMinWidth",
    "effectiveMinHeight",
    "effectiveWidth",
    "effectiveHeight",
    "effectiveMarginLeft",
    "effectiveMarginTop",
    "effectiveMarginRight",
    "effectiveMarginBottom",
    "nodeName",
    "nodeType",
    "decodeWidth",
    "decodeHeight",
    "ng-reflect-items",
    "domNode",
    "touchListenerIsSet",
    "bindingContext",
    "nativeView"
];
function lazy(action) {
    var _value;
    return function () { return _value || (_value = action()); };
}
var percentLengthToStringLazy = lazy(function () { return require("../ui/styling/style-properties").PercentLength.convertToString; });
var getSetPropertiesLazy = lazy(function () { return require("../ui/core/properties").getSetProperties; });
var getComputedCssValuesLazy = lazy(function () { return require("../ui/core/properties").getComputedCssValues; });
function registerInspectorEvents(inspector) {
    inspectorFrontendInstance = inspector;
}
exports.registerInspectorEvents = registerInspectorEvents;
var inspectorFrontendInstance;
function notifyInspector(callback) {
    if (inspectorFrontendInstance) {
        callback(inspectorFrontendInstance);
    }
}
function valueToString(value) {
    if (typeof value === "undefined" || value === null) {
        return "";
    }
    else if (typeof value === "object" && value.unit) {
        return percentLengthToStringLazy()(value);
    }
    else {
        return value + "";
    }
}
function propertyFilter(_a) {
    var name = _a[0], value = _a[1];
    if (name[0] === "_") {
        return false;
    }
    if (value !== null && typeof value === "object") {
        return false;
    }
    if (propertyBlacklist.indexOf(name) >= 0) {
        return false;
    }
    return true;
}
function registerNode(domNode) {
    registeredDomNodes[domNode.nodeId] = domNode;
}
function unregisterNode(domNode) {
    delete registeredDomNodes[domNode.nodeId];
}
function getNodeById(id) {
    return registeredDomNodes[id];
}
exports.getNodeById = getNodeById;
var DOMNode = (function () {
    function DOMNode(view) {
        this.nodeValue = "";
        this.attributes = [];
        this.viewRef = new WeakRef(view);
        this.nodeType = view.typeName === "Frame" ? ROOT_NODE_TYPE : ELEMENT_NODE_TYPE;
        this.nodeId = view._domId;
        this.nodeName = view.typeName;
        this.localName = this.nodeName;
        this.loadAttributes();
        registerNode(this);
    }
    DOMNode.prototype.loadAttributes = function () {
        var _this = this;
        this.attributes = [];
        getSetPropertiesLazy()(this.viewRef.get())
            .filter(propertyFilter)
            .forEach(function (pair) { return _this.attributes.push(pair[0], pair[1] + ""); });
    };
    Object.defineProperty(DOMNode.prototype, "children", {
        get: function () {
            var view = this.viewRef.get();
            if (!view) {
                return [];
            }
            var res = [];
            view.eachChild(function (child) {
                child.ensureDomNode();
                res.push(child.domNode);
                return true;
            });
            return res;
        },
        enumerable: true,
        configurable: true
    });
    DOMNode.prototype.onChildAdded = function (childView) {
        var _this = this;
        notifyInspector(function (ins) {
            var view = _this.viewRef.get();
            var previousChild;
            view.eachChild(function (child) {
                if (child === childView) {
                    return false;
                }
                previousChild = child;
                return true;
            });
            var index = !!previousChild ? previousChild._domId : 0;
            childView.ensureDomNode();
            ins.childNodeInserted(_this.nodeId, index, childView.domNode);
        });
    };
    DOMNode.prototype.onChildRemoved = function (view) {
        var _this = this;
        notifyInspector(function (ins) {
            ins.childNodeRemoved(_this.nodeId, view._domId);
        });
    };
    DOMNode.prototype.attributeModified = function (name, value) {
        var _this = this;
        notifyInspector(function (ins) {
            if (propertyBlacklist.indexOf(name) < 0) {
                ins.attributeModified(_this.nodeId, name, valueToString(value));
            }
        });
    };
    DOMNode.prototype.attributeRemoved = function (name) {
        var _this = this;
        notifyInspector(function (ins) {
            ins.attributeRemoved(_this.nodeId, name);
        });
    };
    DOMNode.prototype.getComputedProperties = function () {
        var view = this.viewRef.get();
        if (!view) {
            return [];
        }
        var result = getComputedCssValuesLazy()(view)
            .filter(function (pair) { return pair[0][0] !== "_"; })
            .map(function (pair) {
            return {
                name: pair[0],
                value: valueToString(pair[1])
            };
        });
        return result;
    };
    DOMNode.prototype.dispose = function () {
        unregisterNode(this);
        this.viewRef.clear();
    };
    DOMNode.prototype.toObject = function () {
        return {
            nodeId: this.nodeId,
            nodeType: this.nodeType,
            nodeName: this.nodeName,
            localName: this.localName,
            nodeValue: this.nodeValue,
            children: this.children.map(function (c) { return c.toObject(); }),
            attributes: this.attributes,
            backendNodeId: 0
        };
    };
    return DOMNode;
}());
exports.DOMNode = DOMNode;
//# sourceMappingURL=dom-node.js.map