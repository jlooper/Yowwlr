Object.defineProperty(exports, "__esModule", { value: true });
var inspectorCommands = require("./InspectorBackendCommands");
var debuggerDomains = require("./debugger");
var devtools_elements_1 = require("./devtools-elements");
var DOMDomainDebugger = (function () {
    function DOMDomainDebugger() {
        this.events = new inspectorCommands.DOMDomain.DOMFrontend();
        this.commands = {};
        devtools_elements_1.attachDOMInspectorEventCallbacks(this.events);
        devtools_elements_1.attachDOMInspectorCommandCallbacks(this.commands);
    }
    Object.defineProperty(DOMDomainDebugger.prototype, "enabled", {
        get: function () {
            return this._enabled;
        },
        enumerable: true,
        configurable: true
    });
    DOMDomainDebugger.prototype.enable = function () {
        if (debuggerDomains.getDOM()) {
            throw new Error("One DOMDomainDebugger may be enabled at a time.");
        }
        else {
            debuggerDomains.setDOM(this);
        }
        this._enabled = true;
    };
    DOMDomainDebugger.prototype.disable = function () {
        if (debuggerDomains.getDOM() === this) {
            debuggerDomains.setDOM(null);
        }
        this._enabled = false;
    };
    DOMDomainDebugger.prototype.getDocument = function () {
        var domNode = this.commands.getDocument();
        return { root: domNode };
    };
    DOMDomainDebugger.prototype.removeNode = function (params) {
        this.commands.removeNode(params.nodeId);
    };
    DOMDomainDebugger.prototype.setAttributeValue = function (params) {
        throw new Error("Method not implemented.");
    };
    DOMDomainDebugger.prototype.setAttributesAsText = function (params) {
        this.commands.setAttributeAsText(params.nodeId, params.text, params.name);
    };
    DOMDomainDebugger.prototype.removeAttribute = function (params) {
        throw new Error("Method not implemented.");
    };
    DOMDomainDebugger.prototype.performSearch = function (params) {
        return null;
    };
    DOMDomainDebugger.prototype.getSearchResults = function (params) {
        return null;
    };
    DOMDomainDebugger.prototype.discardSearchResults = function (params) {
        return;
    };
    DOMDomainDebugger.prototype.highlightNode = function (params) {
        return;
    };
    DOMDomainDebugger.prototype.hideHighlight = function () {
        return;
    };
    DOMDomainDebugger.prototype.resolveNode = function (params) {
        return null;
    };
    DOMDomainDebugger = __decorate([
        inspectorCommands.DomainDispatcher("DOM")
    ], DOMDomainDebugger);
    return DOMDomainDebugger;
}());
exports.DOMDomainDebugger = DOMDomainDebugger;
//# sourceMappingURL=webinspector-dom.ios.js.map