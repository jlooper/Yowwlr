Object.defineProperty(exports, "__esModule", { value: true });
var enums_1 = require("../enums");
var STYLE_CURVE_MAP = Object.freeze({
    "ease": enums_1.AnimationCurve.ease,
    "linear": enums_1.AnimationCurve.linear,
    "ease-in": enums_1.AnimationCurve.easeIn,
    "ease-out": enums_1.AnimationCurve.easeOut,
    "ease-in-out": enums_1.AnimationCurve.easeInOut,
    "spring": enums_1.AnimationCurve.spring,
});
function timeConverter(value) {
    var result = parseFloat(value);
    if (value.indexOf("ms") === -1) {
        result = result * 1000;
    }
    return Math.max(0.0, result);
}
exports.timeConverter = timeConverter;
function animationTimingFunctionConverter(value) {
    return value ?
        STYLE_CURVE_MAP[value] || parseCubicBezierCurve(value) :
        enums_1.AnimationCurve.ease;
}
exports.animationTimingFunctionConverter = animationTimingFunctionConverter;
function parseCubicBezierCurve(value) {
    var coordsString = /\((.*?)\)/.exec(value);
    var coords = coordsString && coordsString[1]
        .split(",")
        .map(stringToBezieCoords);
    if (value.startsWith("cubic-bezier") &&
        coordsString &&
        coords.length === 4) {
        var _a = coords.slice(), x1 = _a[0], x2 = _a[1], y1_1 = _a[2], y2 = _a[3];
        return enums_1.AnimationCurve.cubicBezier(x1, x2, y1_1, y2);
    }
    else {
        throw new Error("Invalid value for animation: " + value);
    }
}
function stringToBezieCoords(value) {
    var result = parseFloat(value);
    if (result < 0) {
        return 0;
    }
    else if (result > 1) {
        return 1;
    }
    return result;
}
//# sourceMappingURL=converters.js.map