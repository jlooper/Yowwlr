var compiler_1 = require("@angular/compiler");
var parse5_adapter_1 = require("./parse5_adapter");
var private_import_platform_browser_1 = require("./private_import_platform-browser");
var trace_1 = require("./trace");
var lang_facade_1 = require("./lang-facade");
(function (SecurityContext) {
    SecurityContext[SecurityContext["NONE"] = 0] = "NONE";
    SecurityContext[SecurityContext["HTML"] = 1] = "HTML";
    SecurityContext[SecurityContext["STYLE"] = 2] = "STYLE";
    SecurityContext[SecurityContext["SCRIPT"] = 3] = "SCRIPT";
    SecurityContext[SecurityContext["URL"] = 4] = "URL";
    SecurityContext[SecurityContext["RESOURCE_URL"] = 5] = "RESOURCE_URL";
})(exports.SecurityContext || (exports.SecurityContext = {}));
var SecurityContext = exports.SecurityContext;
var NativeScriptElementSchemaRegistry = (function (_super) {
    __extends(NativeScriptElementSchemaRegistry, _super);
    function NativeScriptElementSchemaRegistry() {
        _super.apply(this, arguments);
    }
    NativeScriptElementSchemaRegistry.prototype.hasProperty = function (_tagName, _propName) {
        return true;
    };
    NativeScriptElementSchemaRegistry.prototype.hasElement = function (_tagName, _schemaMetas) {
        return true;
    };
    NativeScriptElementSchemaRegistry.prototype.getMappedPropName = function (propName) {
        return propName;
    };
    NativeScriptElementSchemaRegistry.prototype.getDefaultComponentElementName = function () {
        return "ng-component";
    };
    NativeScriptElementSchemaRegistry.prototype.securityContext = function (_tagName, _propName) {
        return SecurityContext.NONE;
    };
    NativeScriptElementSchemaRegistry.prototype.validateProperty = function (_name) {
        return { error: false };
    };
    NativeScriptElementSchemaRegistry.prototype.validateAttribute = function (_name) {
        return { error: false };
    };
    NativeScriptElementSchemaRegistry.prototype.allKnownElementNames = function () {
        return [];
    };
    NativeScriptElementSchemaRegistry.prototype.normalizeAnimationStyleProperty = function (propName) {
        return propName;
    };
    NativeScriptElementSchemaRegistry.prototype.normalizeAnimationStyleValue = function (_camelCaseProp, _userProvidedProp, val) {
        return { error: null, value: val.toString() };
    };
    return NativeScriptElementSchemaRegistry;
}(compiler_1.ElementSchemaRegistry));
exports.NativeScriptElementSchemaRegistry = NativeScriptElementSchemaRegistry;
var NativeScriptDomAdapter = (function (_super) {
    __extends(NativeScriptDomAdapter, _super);
    function NativeScriptDomAdapter() {
        _super.apply(this, arguments);
    }
    NativeScriptDomAdapter.makeCurrent = function () {
        trace_1.rendererLog("Setting DOM");
        private_import_platform_browser_1.setRootDomAdapter(new NativeScriptDomAdapter());
    };
    NativeScriptDomAdapter.prototype.hasProperty = function (_element, _name) {
        // TODO: actually check if the property exists.
        return true;
    };
    NativeScriptDomAdapter.prototype.log = function (arg) {
        lang_facade_1.print(arg);
    };
    NativeScriptDomAdapter.prototype.logError = function (arg) {
        lang_facade_1.print(arg);
    };
    NativeScriptDomAdapter.prototype.logGroup = function (arg) {
        lang_facade_1.print(arg);
    };
    NativeScriptDomAdapter.prototype.logGroupEnd = function () {
    };
    return NativeScriptDomAdapter;
}(parse5_adapter_1.Parse5DomAdapter));
exports.NativeScriptDomAdapter = NativeScriptDomAdapter;
//# sourceMappingURL=dom-adapter.js.map