Object.defineProperty(exports, "__esModule", { value: true });
if (!global.__extends) {
    global.__extends = function (d, b) {
        for (var p in b) {
            if (b.hasOwnProperty(p)) {
                d[p] = b[p];
            }
        }
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}
var tslib = require("tslib");
for (var _i = 0, _a = Object.keys(tslib); _i < _a.length; _i++) {
    var fnName = _a[_i];
    if (typeof tslib[fnName] !== "function") {
        continue;
    }
    if (fnName in global) {
        continue;
    }
    global[fnName] = tslib[fnName];
}
//# sourceMappingURL=ts-helpers.js.map