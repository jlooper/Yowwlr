"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function startTrace(name) {
    var trace = com.google.firebase.perf.FirebasePerformance.getInstance().newTrace(name);
    trace.start();
    return new FirebaseTrace(trace);
}
exports.startTrace = startTrace;
var FirebaseTrace = (function () {
    function FirebaseTrace(nativeTrace) {
        this.nativeTrace = nativeTrace;
    }
    FirebaseTrace.prototype.setValue = function (attribute, value) {
        this.nativeTrace.putAttribute(attribute, value);
    };
    FirebaseTrace.prototype.getValue = function (attribute) {
        return this.nativeTrace.getAttribute(attribute);
    };
    FirebaseTrace.prototype.getAttributes = function () {
        var attributes = this.nativeTrace.getAttributes();
        var node = {};
        var iterator = attributes.entrySet().iterator();
        while (iterator.hasNext()) {
            var item = iterator.next();
            node[item.getKey()] = item.getValue();
        }
        return node;
    };
    FirebaseTrace.prototype.removeAttribute = function (attribute) {
        this.nativeTrace.removeAttribute(attribute);
    };
    FirebaseTrace.prototype.incrementMetric = function (metric, by) {
        this.nativeTrace.incrementMetric(metric, by);
    };
    FirebaseTrace.prototype.stop = function () {
        this.nativeTrace.stop();
    };
    return FirebaseTrace;
}());
exports.FirebaseTrace = FirebaseTrace;
