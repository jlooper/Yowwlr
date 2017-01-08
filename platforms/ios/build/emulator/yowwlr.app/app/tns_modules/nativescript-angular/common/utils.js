var lang_facade_1 = require("../lang-facade");
function convertToInt(value) {
    var normalizedValue;
    if (lang_facade_1.isBlank(value)) {
        normalizedValue = 0;
    }
    else {
        if (lang_facade_1.isNumber(value)) {
            normalizedValue = value;
        }
        else {
            var parsedValue = parseInt(value.toString(), 10);
            normalizedValue = isNaN(parsedValue) ? 0 : parsedValue;
        }
    }
    return Math.round(normalizedValue);
}
exports.convertToInt = convertToInt;
//# sourceMappingURL=utils.js.map