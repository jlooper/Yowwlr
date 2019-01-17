function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
require("tns-core-modules/application");
__export(require("./platform-common"));
__export(require("./platform"));
__export(require("./platform-static"));
__export(require("./router"));
__export(require("./forms"));
__export(require("./http"));
__export(require("./directives"));
__export(require("./common/detached-loader"));
__export(require("./trace"));
__export(require("./platform-providers"));
__export(require("./file-system/ns-file-system"));
__export(require("./modal-dialog"));
__export(require("./renderer"));
__export(require("./view-util"));
__export(require("./resource-loader"));
var element_registry_1 = require("./element-registry");
exports.getViewClass = element_registry_1.getViewClass;
exports.getViewMeta = element_registry_1.getViewMeta;
exports.isKnownView = element_registry_1.isKnownView;
exports.registerElement = element_registry_1.registerElement;
__export(require("./forms/value-accessors/base-value-accessor"));
//# sourceMappingURL=index.js.map