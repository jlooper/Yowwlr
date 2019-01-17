Object.defineProperty(exports, "__esModule", { value: true });
var number_utils_1 = require("../utils/number-utils");
exports.getTransformMatrix = function (_a) {
    var property = _a.property, value = _a.value;
    return TRANSFORM_MATRIXES[property](value);
};
var TRANSFORM_MATRIXES = {
    "scale": function (_a) {
        var x = _a.x, y = _a.y;
        return [
            x, 0, 0,
            0, y, 0,
            0, 0, 1,
        ];
    },
    "translate": function (_a) {
        var x = _a.x, y = _a.y;
        return [
            1, 0, x,
            0, 1, y,
            0, 0, 1,
        ];
    },
    "rotate": function (angleInDeg) {
        var angleInRad = number_utils_1.degreesToRadians(angleInDeg);
        return [
            Math.cos(angleInRad), -Math.sin(angleInRad), 0,
            Math.sin(angleInRad), Math.cos(angleInRad), 0,
            0, 0, 1,
        ];
    },
};
exports.matrixArrayToCssMatrix = function (m) { return [
    m[0], m[3], m[1],
    m[4], m[2], m[5],
]; };
function multiplyAffine2d(m1, m2) {
    return [
        m1[0] * m2[0] + m1[1] * m2[3],
        m1[0] * m2[1] + m1[1] * m2[4],
        m1[0] * m2[2] + m1[1] * m2[5] + m1[2],
        m1[3] * m2[0] + m1[4] * m2[3],
        m1[3] * m2[1] + m1[4] * m2[4],
        m1[3] * m2[2] + m1[4] * m2[5] + m1[5]
    ];
}
exports.multiplyAffine2d = multiplyAffine2d;
function decompose2DTransformMatrix(matrix) {
    verifyTransformMatrix(matrix);
    var _a = matrix.slice(), A = _a[0], B = _a[1], C = _a[2], D = _a[3], E = _a[4], F = _a[5];
    var determinant = A * D - B * C;
    var translate = { x: E || 0, y: F || 0 };
    var rotate = 0;
    var scale = { x: 1, y: 1 };
    if (A || B) {
        var R = Math.sqrt(A * A + B * B);
        rotate = B > 0 ? Math.acos(A / R) : -Math.acos(A / R);
        scale = { x: R, y: determinant / R };
    }
    else if (C || D) {
        var R = Math.sqrt(C * C + D * D);
        rotate = Math.PI / 2 - (D > 0 ? Math.acos(-C / R) : -Math.acos(C / R));
        scale = { x: determinant / R, y: R };
    }
    rotate = number_utils_1.radiansToDegrees(rotate);
    return { translate: translate, rotate: rotate, scale: scale };
}
exports.decompose2DTransformMatrix = decompose2DTransformMatrix;
function verifyTransformMatrix(matrix) {
    if (matrix.length < 6) {
        throw new Error("Transform matrix should be 2x3.");
    }
}
//# sourceMappingURL=matrix.js.map