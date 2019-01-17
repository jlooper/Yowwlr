Object.defineProperty(exports, "__esModule", { value: true });
var trace_1 = require("tns-core-modules/trace");
var trace_2 = require("tns-core-modules/trace");
exports.isLogEnabled = trace_2.isEnabled;
exports.animationsTraceCategory = "ns-animations";
exports.rendererTraceCategory = "ns-renderer";
exports.viewUtilCategory = "ns-view-util";
exports.routerTraceCategory = "ns-router";
exports.routeReuseStrategyTraceCategory = "ns-route-reuse-strategy";
exports.listViewTraceCategory = "ns-list-view";
exports.bootstrapCategory = "bootstrap";
function animationsLog(message) {
    trace_1.write(message, exports.animationsTraceCategory);
}
exports.animationsLog = animationsLog;
function rendererLog(msg) {
    trace_1.write(msg, exports.rendererTraceCategory);
}
exports.rendererLog = rendererLog;
function rendererError(message) {
    trace_1.write(message, exports.rendererTraceCategory, trace_1.messageType.error);
}
exports.rendererError = rendererError;
function viewUtilLog(msg) {
    trace_1.write(msg, exports.viewUtilCategory);
}
exports.viewUtilLog = viewUtilLog;
function routerLog(message) {
    trace_1.write(message, exports.routerTraceCategory);
}
exports.routerLog = routerLog;
function routerError(message) {
    trace_1.write(message, exports.routerTraceCategory, trace_1.messageType.error);
}
exports.routerError = routerError;
function routeReuseStrategyLog(message) {
    trace_1.write(message, exports.routeReuseStrategyTraceCategory);
}
exports.routeReuseStrategyLog = routeReuseStrategyLog;
function styleError(message) {
    trace_1.write(message, trace_1.categories.Style, trace_1.messageType.error);
}
exports.styleError = styleError;
function listViewLog(message) {
    trace_1.write(message, exports.listViewTraceCategory);
}
exports.listViewLog = listViewLog;
function listViewError(message) {
    trace_1.write(message, exports.listViewTraceCategory, trace_1.messageType.error);
}
exports.listViewError = listViewError;
function bootstrapLog(message) {
    trace_1.write(message, exports.bootstrapCategory);
}
exports.bootstrapLog = bootstrapLog;
function bootstrapLogError(message) {
    trace_1.write(message, exports.bootstrapCategory, trace_1.messageType.error);
}
exports.bootstrapLogError = bootstrapLogError;
//# sourceMappingURL=trace.js.map