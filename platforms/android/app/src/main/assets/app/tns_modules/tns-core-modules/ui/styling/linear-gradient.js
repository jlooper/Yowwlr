Object.defineProperty(exports, "__esModule", { value: true });
var color_1 = require("../../color");
var LinearGradient = (function () {
    function LinearGradient() {
    }
    LinearGradient.parse = function (value) {
        var result = new LinearGradient();
        result.angle = value.angle;
        result.colorStops = value.colors.map(function (color) {
            var offset = color.offset || null;
            var offsetUnit;
            if (offset && offset.unit === "%") {
                offsetUnit = {
                    unit: "%",
                    value: offset.value
                };
            }
            return {
                color: new color_1.Color(color.argb),
                offset: offsetUnit
            };
        });
        return result;
    };
    LinearGradient.equals = function (first, second) {
        if (!first && !second) {
            return true;
        }
        else if (!first || !second) {
            return false;
        }
        if (first.angle !== second.angle) {
            return false;
        }
        if (first.colorStops.length !== second.colorStops.length) {
            return false;
        }
        for (var i = 0; i < first.colorStops.length; i++) {
            var firstStop = first.colorStops[i];
            var secondStop = second.colorStops[i];
            if (firstStop.offset !== secondStop.offset) {
                return false;
            }
            if (!color_1.Color.equals(firstStop.color, secondStop.color)) {
                return false;
            }
        }
        return true;
    };
    return LinearGradient;
}());
exports.LinearGradient = LinearGradient;
//# sourceMappingURL=linear-gradient.js.map