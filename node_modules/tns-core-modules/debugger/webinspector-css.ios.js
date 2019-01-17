Object.defineProperty(exports, "__esModule", { value: true });
var inspectorCommands = require("./InspectorBackendCommands");
var debuggerDomains = require("./debugger");
var devtools_elements_1 = require("./devtools-elements");
var CSSDomainDebugger = (function () {
    function CSSDomainDebugger() {
        this.events = new inspectorCommands.CSSDomain.CSSFrontend();
        this.commands = {};
        devtools_elements_1.attachCSSInspectorCommandCallbacks(this.commands);
    }
    Object.defineProperty(CSSDomainDebugger.prototype, "enabled", {
        get: function () {
            return this._enabled;
        },
        enumerable: true,
        configurable: true
    });
    CSSDomainDebugger.prototype.enable = function () {
        if (debuggerDomains.getCSS()) {
            throw new Error("One CSSDomainDebugger may be enabled at a time.");
        }
        else {
            debuggerDomains.setCSS(this);
        }
        this._enabled = true;
    };
    CSSDomainDebugger.prototype.disable = function () {
        if (debuggerDomains.getCSS() === this) {
            debuggerDomains.setCSS(null);
        }
        this._enabled = false;
    };
    CSSDomainDebugger.prototype.getMatchedStylesForNode = function (params) {
        return {};
    };
    CSSDomainDebugger.prototype.getInlineStylesForNode = function (params) {
        return {};
    };
    CSSDomainDebugger.prototype.getComputedStyleForNode = function (params) {
        return { computedStyle: this.commands.getComputedStylesForNode(params.nodeId) };
    };
    CSSDomainDebugger.prototype.getPlatformFontsForNode = function (params) {
        return {
            fonts: [
                {
                    familyName: "Standard Font",
                    isCustomFont: false,
                    glyphCount: 0
                }
            ]
        };
    };
    CSSDomainDebugger.prototype.getStyleSheetText = function (params) {
        return null;
    };
    CSSDomainDebugger = __decorate([
        inspectorCommands.DomainDispatcher("CSS")
    ], CSSDomainDebugger);
    return CSSDomainDebugger;
}());
exports.CSSDomainDebugger = CSSDomainDebugger;
//# sourceMappingURL=webinspector-css.ios.js.map