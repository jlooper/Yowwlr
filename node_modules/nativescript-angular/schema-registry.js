Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("@angular/compiler");
var SecurityContext;
(function (SecurityContext) {
    SecurityContext[SecurityContext["NONE"] = 0] = "NONE";
    SecurityContext[SecurityContext["HTML"] = 1] = "HTML";
    SecurityContext[SecurityContext["STYLE"] = 2] = "STYLE";
    SecurityContext[SecurityContext["SCRIPT"] = 3] = "SCRIPT";
    SecurityContext[SecurityContext["URL"] = 4] = "URL";
    SecurityContext[SecurityContext["RESOURCE_URL"] = 5] = "RESOURCE_URL";
})(SecurityContext = exports.SecurityContext || (exports.SecurityContext = {}));
var NativeScriptElementSchemaRegistry = /** @class */ (function (_super) {
    __extends(NativeScriptElementSchemaRegistry, _super);
    function NativeScriptElementSchemaRegistry() {
        return _super !== null && _super.apply(this, arguments) || this;
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
//# sourceMappingURL=schema-registry.js.map