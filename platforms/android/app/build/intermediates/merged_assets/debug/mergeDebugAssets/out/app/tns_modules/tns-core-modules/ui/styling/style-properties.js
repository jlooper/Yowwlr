Object.defineProperty(exports, "__esModule", { value: true });
var properties_1 = require("../core/properties");
var color_1 = require("../../color");
var font_1 = require("../../ui/styling/font");
var utils_1 = require("../../utils/utils");
var background_1 = require("../../ui/styling/background");
var platform_1 = require("../../platform");
var number_utils_1 = require("../../utils/number-utils");
var matrix_1 = require("../../matrix");
var parser = require("../../css/parser");
var linear_gradient_1 = require("./linear-gradient");
function equalsCommon(a, b) {
    if (a == "auto") {
        return b == "auto";
    }
    if (typeof a === "number") {
        if (b == "auto") {
            return false;
        }
        if (typeof b === "number") {
            return a == b;
        }
        return b.unit == "dip" && a == b.value;
    }
    if (b == "auto") {
        return false;
    }
    if (typeof b === "number") {
        return a.unit == "dip" && a.value == b;
    }
    return a.value == b.value && a.unit == b.unit;
}
function convertToStringCommon(length) {
    if (length == "auto") {
        return "auto";
    }
    if (typeof length === "number") {
        return length.toString();
    }
    var val = length.value;
    if (length.unit === "%") {
        val *= 100;
    }
    return val + length.unit;
}
function toDevicePixelsCommon(length, auto, parentAvailableWidth) {
    if (auto === void 0) { auto = Number.NaN; }
    if (parentAvailableWidth === void 0) { parentAvailableWidth = Number.NaN; }
    if (length == "auto") {
        return auto;
    }
    if (typeof length === "number") {
        return utils_1.layout.round(utils_1.layout.toDevicePixels(length));
    }
    switch (length.unit) {
        case "px":
            return utils_1.layout.round(length.value);
        case "%":
            return utils_1.layout.round(parentAvailableWidth * length.value);
        case "dip":
        default:
            return utils_1.layout.round(utils_1.layout.toDevicePixels(length.value));
    }
}
var PercentLength;
(function (PercentLength) {
    function parse(fromValue) {
        if (fromValue == "auto") {
            return "auto";
        }
        if (typeof fromValue === "string") {
            var stringValue = fromValue.trim();
            var percentIndex = stringValue.indexOf("%");
            if (percentIndex !== -1) {
                var value = void 0;
                if (percentIndex !== (stringValue.length - 1) || percentIndex === 0) {
                    value = Number.NaN;
                }
                else {
                    value = parseFloat(stringValue.substring(0, stringValue.length - 1).trim()) / 100;
                }
                if (isNaN(value) || !isFinite(value)) {
                    throw new Error("Invalid value: " + fromValue);
                }
                return { unit: "%", value: value };
            }
            else if (stringValue.indexOf("px") !== -1) {
                stringValue = stringValue.replace("px", "").trim();
                var value = parseFloat(stringValue);
                if (isNaN(value) || !isFinite(value)) {
                    throw new Error("Invalid value: " + fromValue);
                }
                return { unit: "px", value: value };
            }
            else {
                var value = parseFloat(stringValue);
                if (isNaN(value) || !isFinite(value)) {
                    throw new Error("Invalid value: " + fromValue);
                }
                return value;
            }
        }
        else {
            return fromValue;
        }
    }
    PercentLength.parse = parse;
    PercentLength.equals = equalsCommon;
    PercentLength.toDevicePixels = toDevicePixelsCommon;
    PercentLength.convertToString = convertToStringCommon;
})(PercentLength = exports.PercentLength || (exports.PercentLength = {}));
var Length;
(function (Length) {
    function parse(fromValue) {
        if (fromValue == "auto") {
            return "auto";
        }
        if (typeof fromValue === "string") {
            var stringValue = fromValue.trim();
            if (stringValue.indexOf("px") !== -1) {
                stringValue = stringValue.replace("px", "").trim();
                var value = parseFloat(stringValue);
                if (isNaN(value) || !isFinite(value)) {
                    throw new Error("Invalid value: " + stringValue);
                }
                return { unit: "px", value: value };
            }
            else {
                var value = parseFloat(stringValue);
                if (isNaN(value) || !isFinite(value)) {
                    throw new Error("Invalid value: " + stringValue);
                }
                return value;
            }
        }
        else {
            return fromValue;
        }
    }
    Length.parse = parse;
    Length.equals = equalsCommon;
    Length.toDevicePixels = toDevicePixelsCommon;
    Length.convertToString = convertToStringCommon;
})(Length = exports.Length || (exports.Length = {}));
exports.zeroLength = { value: 0, unit: "px" };
exports.minWidthProperty = new properties_1.CssProperty({
    name: "minWidth", cssName: "min-width", defaultValue: exports.zeroLength, affectsLayout: platform_1.isIOS, equalityComparer: Length.equals,
    valueChanged: function (target, oldValue, newValue) {
        target.view.effectiveMinWidth = Length.toDevicePixels(newValue, 0);
    }, valueConverter: Length.parse
});
exports.minWidthProperty.register(properties_1.Style);
exports.minHeightProperty = new properties_1.CssProperty({
    name: "minHeight", cssName: "min-height", defaultValue: exports.zeroLength, affectsLayout: platform_1.isIOS, equalityComparer: Length.equals,
    valueChanged: function (target, oldValue, newValue) {
        target.view.effectiveMinHeight = Length.toDevicePixels(newValue, 0);
    }, valueConverter: Length.parse
});
exports.minHeightProperty.register(properties_1.Style);
exports.widthProperty = new properties_1.CssProperty({ name: "width", cssName: "width", defaultValue: "auto", affectsLayout: platform_1.isIOS, equalityComparer: Length.equals, valueConverter: PercentLength.parse });
exports.widthProperty.register(properties_1.Style);
exports.heightProperty = new properties_1.CssProperty({ name: "height", cssName: "height", defaultValue: "auto", affectsLayout: platform_1.isIOS, equalityComparer: Length.equals, valueConverter: PercentLength.parse });
exports.heightProperty.register(properties_1.Style);
var marginProperty = new properties_1.ShorthandProperty({
    name: "margin", cssName: "margin",
    getter: function () {
        if (PercentLength.equals(this.marginTop, this.marginRight) &&
            PercentLength.equals(this.marginTop, this.marginBottom) &&
            PercentLength.equals(this.marginTop, this.marginLeft)) {
            return this.marginTop;
        }
        return PercentLength.convertToString(this.marginTop) + " " + PercentLength.convertToString(this.marginRight) + " " + PercentLength.convertToString(this.marginBottom) + " " + PercentLength.convertToString(this.marginLeft);
    },
    converter: convertToMargins
});
marginProperty.register(properties_1.Style);
exports.marginLeftProperty = new properties_1.CssProperty({ name: "marginLeft", cssName: "margin-left", defaultValue: exports.zeroLength, affectsLayout: platform_1.isIOS, equalityComparer: Length.equals, valueConverter: PercentLength.parse });
exports.marginLeftProperty.register(properties_1.Style);
exports.marginRightProperty = new properties_1.CssProperty({ name: "marginRight", cssName: "margin-right", defaultValue: exports.zeroLength, affectsLayout: platform_1.isIOS, equalityComparer: Length.equals, valueConverter: PercentLength.parse });
exports.marginRightProperty.register(properties_1.Style);
exports.marginTopProperty = new properties_1.CssProperty({ name: "marginTop", cssName: "margin-top", defaultValue: exports.zeroLength, affectsLayout: platform_1.isIOS, equalityComparer: Length.equals, valueConverter: PercentLength.parse });
exports.marginTopProperty.register(properties_1.Style);
exports.marginBottomProperty = new properties_1.CssProperty({ name: "marginBottom", cssName: "margin-bottom", defaultValue: exports.zeroLength, affectsLayout: platform_1.isIOS, equalityComparer: Length.equals, valueConverter: PercentLength.parse });
exports.marginBottomProperty.register(properties_1.Style);
var paddingProperty = new properties_1.ShorthandProperty({
    name: "padding", cssName: "padding",
    getter: function () {
        if (Length.equals(this.paddingTop, this.paddingRight) &&
            Length.equals(this.paddingTop, this.paddingBottom) &&
            Length.equals(this.paddingTop, this.paddingLeft)) {
            return this.paddingTop;
        }
        return Length.convertToString(this.paddingTop) + " " + Length.convertToString(this.paddingRight) + " " + Length.convertToString(this.paddingBottom) + " " + Length.convertToString(this.paddingLeft);
    },
    converter: convertToPaddings
});
paddingProperty.register(properties_1.Style);
exports.paddingLeftProperty = new properties_1.CssProperty({
    name: "paddingLeft", cssName: "padding-left", defaultValue: exports.zeroLength, affectsLayout: platform_1.isIOS, equalityComparer: Length.equals,
    valueChanged: function (target, oldValue, newValue) {
        target.view.effectivePaddingLeft = Length.toDevicePixels(newValue, 0);
    }, valueConverter: Length.parse
});
exports.paddingLeftProperty.register(properties_1.Style);
exports.paddingRightProperty = new properties_1.CssProperty({
    name: "paddingRight", cssName: "padding-right", defaultValue: exports.zeroLength, affectsLayout: platform_1.isIOS, equalityComparer: Length.equals,
    valueChanged: function (target, oldValue, newValue) {
        target.view.effectivePaddingRight = Length.toDevicePixels(newValue, 0);
    }, valueConverter: Length.parse
});
exports.paddingRightProperty.register(properties_1.Style);
exports.paddingTopProperty = new properties_1.CssProperty({
    name: "paddingTop", cssName: "padding-top", defaultValue: exports.zeroLength, affectsLayout: platform_1.isIOS, equalityComparer: Length.equals,
    valueChanged: function (target, oldValue, newValue) {
        target.view.effectivePaddingTop = Length.toDevicePixels(newValue, 0);
    }, valueConverter: Length.parse
});
exports.paddingTopProperty.register(properties_1.Style);
exports.paddingBottomProperty = new properties_1.CssProperty({
    name: "paddingBottom", cssName: "padding-bottom", defaultValue: exports.zeroLength, affectsLayout: platform_1.isIOS, equalityComparer: Length.equals,
    valueChanged: function (target, oldValue, newValue) {
        target.view.effectivePaddingBottom = Length.toDevicePixels(newValue, 0);
    }, valueConverter: Length.parse
});
exports.paddingBottomProperty.register(properties_1.Style);
var HorizontalAlignment;
(function (HorizontalAlignment) {
    HorizontalAlignment.LEFT = "left";
    HorizontalAlignment.CENTER = "center";
    HorizontalAlignment.RIGHT = "right";
    HorizontalAlignment.STRETCH = "stretch";
    HorizontalAlignment.isValid = properties_1.makeValidator(HorizontalAlignment.LEFT, HorizontalAlignment.CENTER, HorizontalAlignment.RIGHT, HorizontalAlignment.STRETCH);
    HorizontalAlignment.parse = properties_1.makeParser(HorizontalAlignment.isValid);
})(HorizontalAlignment = exports.HorizontalAlignment || (exports.HorizontalAlignment = {}));
exports.horizontalAlignmentProperty = new properties_1.CssProperty({ name: "horizontalAlignment", cssName: "horizontal-align", defaultValue: HorizontalAlignment.STRETCH, affectsLayout: platform_1.isIOS, valueConverter: HorizontalAlignment.parse });
exports.horizontalAlignmentProperty.register(properties_1.Style);
var VerticalAlignment;
(function (VerticalAlignment) {
    VerticalAlignment.TOP = "top";
    VerticalAlignment.MIDDLE = "middle";
    VerticalAlignment.BOTTOM = "bottom";
    VerticalAlignment.STRETCH = "stretch";
    VerticalAlignment.isValid = properties_1.makeValidator(VerticalAlignment.TOP, VerticalAlignment.MIDDLE, VerticalAlignment.BOTTOM, VerticalAlignment.STRETCH);
    VerticalAlignment.parse = function (value) { return value.toLowerCase() === "center" ? VerticalAlignment.MIDDLE : parseStrict(value); };
    var parseStrict = properties_1.makeParser(VerticalAlignment.isValid);
})(VerticalAlignment = exports.VerticalAlignment || (exports.VerticalAlignment = {}));
exports.verticalAlignmentProperty = new properties_1.CssProperty({ name: "verticalAlignment", cssName: "vertical-align", defaultValue: VerticalAlignment.STRETCH, affectsLayout: platform_1.isIOS, valueConverter: VerticalAlignment.parse });
exports.verticalAlignmentProperty.register(properties_1.Style);
function parseThickness(value) {
    if (typeof value === "string") {
        var arr = value.split(/[ ,]+/);
        var top_1;
        var right = void 0;
        var bottom = void 0;
        var left = void 0;
        if (arr.length === 1) {
            top_1 = arr[0];
            right = arr[0];
            bottom = arr[0];
            left = arr[0];
        }
        else if (arr.length === 2) {
            top_1 = arr[0];
            bottom = arr[0];
            right = arr[1];
            left = arr[1];
        }
        else if (arr.length === 3) {
            top_1 = arr[0];
            right = arr[1];
            left = arr[1];
            bottom = arr[2];
        }
        else if (arr.length === 4) {
            top_1 = arr[0];
            right = arr[1];
            bottom = arr[2];
            left = arr[3];
        }
        else {
            throw new Error("Expected 1, 2, 3 or 4 parameters. Actual: " + value);
        }
        return {
            top: top_1,
            right: right,
            bottom: bottom,
            left: left
        };
    }
    else {
        return value;
    }
}
function convertToMargins(value) {
    if (typeof value === "string" && value !== "auto") {
        var thickness = parseThickness(value);
        return [
            [exports.marginTopProperty, PercentLength.parse(thickness.top)],
            [exports.marginRightProperty, PercentLength.parse(thickness.right)],
            [exports.marginBottomProperty, PercentLength.parse(thickness.bottom)],
            [exports.marginLeftProperty, PercentLength.parse(thickness.left)]
        ];
    }
    else {
        return [
            [exports.marginTopProperty, value],
            [exports.marginRightProperty, value],
            [exports.marginBottomProperty, value],
            [exports.marginLeftProperty, value]
        ];
    }
}
function convertToPaddings(value) {
    if (typeof value === "string" && value !== "auto") {
        var thickness = parseThickness(value);
        return [
            [exports.paddingTopProperty, Length.parse(thickness.top)],
            [exports.paddingRightProperty, Length.parse(thickness.right)],
            [exports.paddingBottomProperty, Length.parse(thickness.bottom)],
            [exports.paddingLeftProperty, Length.parse(thickness.left)]
        ];
    }
    else {
        return [
            [exports.paddingTopProperty, value],
            [exports.paddingRightProperty, value],
            [exports.paddingBottomProperty, value],
            [exports.paddingLeftProperty, value]
        ];
    }
}
exports.rotateProperty = new properties_1.CssAnimationProperty({ name: "rotate", cssName: "rotate", defaultValue: 0, valueConverter: parseFloat });
exports.rotateProperty.register(properties_1.Style);
exports.scaleXProperty = new properties_1.CssAnimationProperty({ name: "scaleX", cssName: "scaleX", defaultValue: 1, valueConverter: parseFloat });
exports.scaleXProperty.register(properties_1.Style);
exports.scaleYProperty = new properties_1.CssAnimationProperty({ name: "scaleY", cssName: "scaleY", defaultValue: 1, valueConverter: parseFloat });
exports.scaleYProperty.register(properties_1.Style);
function parseDIPs(value) {
    if (value.indexOf("px") !== -1) {
        return utils_1.layout.toDeviceIndependentPixels(parseFloat(value.replace("px", "").trim()));
    }
    else {
        return parseFloat(value.replace("dip", "").trim());
    }
}
exports.translateXProperty = new properties_1.CssAnimationProperty({ name: "translateX", cssName: "translateX", defaultValue: 0, valueConverter: parseDIPs });
exports.translateXProperty.register(properties_1.Style);
exports.translateYProperty = new properties_1.CssAnimationProperty({ name: "translateY", cssName: "translateY", defaultValue: 0, valueConverter: parseDIPs });
exports.translateYProperty.register(properties_1.Style);
var transformProperty = new properties_1.ShorthandProperty({
    name: "transform", cssName: "transform",
    getter: function () {
        var scaleX = this.scaleX;
        var scaleY = this.scaleY;
        var translateX = this.translateX;
        var translateY = this.translateY;
        var rotate = this.rotate;
        var result = "";
        if (translateX !== 0 || translateY !== 0) {
            result += "translate(" + translateX + ", " + translateY + ") ";
        }
        if (scaleX !== 1 || scaleY !== 1) {
            result += "scale(" + scaleX + ", " + scaleY + ") ";
        }
        if (rotate !== 0) {
            result += "rotate (" + rotate + ")";
        }
        return result.trim();
    },
    converter: convertToTransform
});
transformProperty.register(properties_1.Style);
var IDENTITY_TRANSFORMATION = {
    translate: { x: 0, y: 0 },
    rotate: 0,
    scale: { x: 1, y: 1 },
};
var TRANSFORM_SPLITTER = new RegExp(/\s*(.+?)\((.*?)\)/g);
var TRANSFORMATIONS = Object.freeze([
    "rotate",
    "translate",
    "translate3d",
    "translateX",
    "translateY",
    "scale",
    "scale3d",
    "scaleX",
    "scaleY",
]);
var STYLE_TRANSFORMATION_MAP = Object.freeze({
    "scale": function (value) { return ({ property: "scale", value: value }); },
    "scale3d": function (value) { return ({ property: "scale", value: value }); },
    "scaleX": function (_a) {
        var x = _a.x;
        return ({ property: "scale", value: { x: x, y: IDENTITY_TRANSFORMATION.scale.y } });
    },
    "scaleY": function (_a) {
        var y = _a.y;
        return ({ property: "scale", value: { y: y, x: IDENTITY_TRANSFORMATION.scale.x } });
    },
    "translate": function (value) { return ({ property: "translate", value: value }); },
    "translate3d": function (value) { return ({ property: "translate", value: value }); },
    "translateX": function (_a) {
        var x = _a.x;
        return ({ property: "translate", value: { x: x, y: IDENTITY_TRANSFORMATION.translate.y } });
    },
    "translateY": function (_a) {
        var y = _a.y;
        return ({ property: "translate", value: { y: y, x: IDENTITY_TRANSFORMATION.translate.x } });
    },
    "rotate": function (value) { return ({ property: "rotate", value: value }); },
});
function convertToTransform(value) {
    if (value === properties_1.unsetValue) {
        value = "none";
    }
    var _a = transformConverter(value), translate = _a.translate, rotate = _a.rotate, scale = _a.scale;
    return [
        [exports.translateXProperty, translate.x],
        [exports.translateYProperty, translate.y],
        [exports.scaleXProperty, scale.x],
        [exports.scaleYProperty, scale.y],
        [exports.rotateProperty, rotate],
    ];
}
function transformConverter(text) {
    var transformations = parseTransformString(text);
    if (text === "none" || text === "" || !transformations.length) {
        return IDENTITY_TRANSFORMATION;
    }
    var usedTransforms = transformations.map(function (t) { return t.property; });
    if (!utils_1.hasDuplicates(usedTransforms)) {
        var fullTransformations_1 = __assign({}, IDENTITY_TRANSFORMATION);
        transformations.forEach(function (transform) {
            fullTransformations_1[transform.property] = transform.value;
        });
        return fullTransformations_1;
    }
    var affineMatrix = transformations
        .map(matrix_1.getTransformMatrix)
        .reduce(matrix_1.multiplyAffine2d);
    var cssMatrix = matrix_1.matrixArrayToCssMatrix(affineMatrix);
    return matrix_1.decompose2DTransformMatrix(cssMatrix);
}
exports.transformConverter = transformConverter;
function parseTransformString(text) {
    var matches = [];
    var match;
    while ((match = TRANSFORM_SPLITTER.exec(text)) !== null) {
        var property = match[1];
        var value = convertTransformValue(property, match[2]);
        if (TRANSFORMATIONS.indexOf(property) !== -1) {
            matches.push(normalizeTransformation({ property: property, value: value }));
        }
    }
    return matches;
}
function normalizeTransformation(_a) {
    var property = _a.property, value = _a.value;
    return STYLE_TRANSFORMATION_MAP[property](value);
}
function convertTransformValue(property, stringValue) {
    var _a = stringValue.split(",").map(parseFloat), x = _a[0], _b = _a[1], y = _b === void 0 ? x : _b;
    if (property === "rotate") {
        return stringValue.slice(-3) === "rad" ? number_utils_1.radiansToDegrees(x) : x;
    }
    return { x: x, y: y };
}
var backgroundProperty = new properties_1.ShorthandProperty({
    name: "background", cssName: "background",
    getter: function () {
        return this.backgroundColor + " " + this.backgroundImage + " " + this.backgroundRepeat + " " + this.backgroundPosition;
    },
    converter: convertToBackgrounds
});
backgroundProperty.register(properties_1.Style);
exports.backgroundInternalProperty = new properties_1.CssProperty({
    name: "backgroundInternal",
    cssName: "_backgroundInternal",
    defaultValue: background_1.Background.default
});
exports.backgroundInternalProperty.register(properties_1.Style);
exports.backgroundImageProperty = new properties_1.CssProperty({
    name: "backgroundImage", cssName: "background-image", valueChanged: function (target, oldValue, newValue) {
        var background = target.backgroundInternal.withImage(newValue);
        target.backgroundInternal = background;
    },
    equalityComparer: function (value1, value2) {
        if (value1 instanceof linear_gradient_1.LinearGradient && value2 instanceof linear_gradient_1.LinearGradient) {
            return linear_gradient_1.LinearGradient.equals(value1, value2);
        }
        else {
            return value1 === value2;
        }
    },
    valueConverter: function (value) {
        if (typeof value === "string") {
            var parsed = parser.parseBackground(value);
            if (parsed) {
                var background = parsed.value;
                value = (typeof background.image === "object") ? linear_gradient_1.LinearGradient.parse(background.image) : value;
            }
        }
        return value;
    }
});
exports.backgroundImageProperty.register(properties_1.Style);
exports.backgroundColorProperty = new properties_1.CssAnimationProperty({
    name: "backgroundColor", cssName: "background-color", valueChanged: function (target, oldValue, newValue) {
        var background = target.backgroundInternal.withColor(newValue);
        target.backgroundInternal = background;
    }, equalityComparer: color_1.Color.equals, valueConverter: function (value) { return new color_1.Color(value); }
});
exports.backgroundColorProperty.register(properties_1.Style);
var BackgroundRepeat;
(function (BackgroundRepeat) {
    BackgroundRepeat.REPEAT = "repeat";
    BackgroundRepeat.REPEAT_X = "repeat-x";
    BackgroundRepeat.REPEAT_Y = "repeat-y";
    BackgroundRepeat.NO_REPEAT = "no-repeat";
    BackgroundRepeat.isValid = properties_1.makeValidator(BackgroundRepeat.REPEAT, BackgroundRepeat.REPEAT_X, BackgroundRepeat.REPEAT_Y, BackgroundRepeat.NO_REPEAT);
    BackgroundRepeat.parse = properties_1.makeParser(BackgroundRepeat.isValid);
})(BackgroundRepeat = exports.BackgroundRepeat || (exports.BackgroundRepeat = {}));
exports.backgroundRepeatProperty = new properties_1.CssProperty({
    name: "backgroundRepeat", cssName: "background-repeat", valueConverter: BackgroundRepeat.parse,
    valueChanged: function (target, oldValue, newValue) {
        var background = target.backgroundInternal.withRepeat(newValue);
        target.backgroundInternal = background;
    }
});
exports.backgroundRepeatProperty.register(properties_1.Style);
exports.backgroundSizeProperty = new properties_1.CssProperty({
    name: "backgroundSize", cssName: "background-size", valueChanged: function (target, oldValue, newValue) {
        var background = target.backgroundInternal.withSize(newValue);
        target.backgroundInternal = background;
    }
});
exports.backgroundSizeProperty.register(properties_1.Style);
exports.backgroundPositionProperty = new properties_1.CssProperty({
    name: "backgroundPosition", cssName: "background-position", valueChanged: function (target, oldValue, newValue) {
        var background = target.backgroundInternal.withPosition(newValue);
        target.backgroundInternal = background;
    }
});
exports.backgroundPositionProperty.register(properties_1.Style);
function convertToBackgrounds(value) {
    if (typeof value === "string") {
        var backgrounds = parser.parseBackground(value).value;
        var backgroundColor = backgrounds.color ? new color_1.Color(backgrounds.color) : properties_1.unsetValue;
        var backgroundImage = void 0;
        if (typeof backgrounds.image === "object" && backgrounds.image) {
            backgroundImage = linear_gradient_1.LinearGradient.parse(backgrounds.image);
        }
        else {
            backgroundImage = backgrounds.image || properties_1.unsetValue;
        }
        var backgroundRepeat = backgrounds.repeat || properties_1.unsetValue;
        var backgroundPosition = backgrounds.position ? backgrounds.position.text : properties_1.unsetValue;
        return [
            [exports.backgroundColorProperty, backgroundColor],
            [exports.backgroundImageProperty, backgroundImage],
            [exports.backgroundRepeatProperty, backgroundRepeat],
            [exports.backgroundPositionProperty, backgroundPosition]
        ];
    }
    else {
        return [
            [exports.backgroundColorProperty, properties_1.unsetValue],
            [exports.backgroundImageProperty, properties_1.unsetValue],
            [exports.backgroundRepeatProperty, properties_1.unsetValue],
            [exports.backgroundPositionProperty, properties_1.unsetValue]
        ];
    }
}
function parseBorderColor(value) {
    var result = { top: undefined, right: undefined, bottom: undefined, left: undefined };
    if (value.indexOf("rgb") === 0) {
        result.top = result.right = result.bottom = result.left = new color_1.Color(value);
        return result;
    }
    var arr = value.split(/[ ,]+/);
    if (arr.length === 1) {
        var arr0 = new color_1.Color(arr[0]);
        result.top = arr0;
        result.right = arr0;
        result.bottom = arr0;
        result.left = arr0;
    }
    else if (arr.length === 2) {
        var arr0 = new color_1.Color(arr[0]);
        var arr1 = new color_1.Color(arr[1]);
        result.top = arr0;
        result.right = arr1;
        result.bottom = arr0;
        result.left = arr1;
    }
    else if (arr.length === 3) {
        var arr0 = new color_1.Color(arr[0]);
        var arr1 = new color_1.Color(arr[1]);
        var arr2 = new color_1.Color(arr[2]);
        result.top = arr0;
        result.right = arr1;
        result.bottom = arr2;
        result.left = arr1;
    }
    else if (arr.length === 4) {
        var arr0 = new color_1.Color(arr[0]);
        var arr1 = new color_1.Color(arr[1]);
        var arr2 = new color_1.Color(arr[2]);
        var arr3 = new color_1.Color(arr[3]);
        result.top = arr0;
        result.right = arr1;
        result.bottom = arr2;
        result.left = arr3;
    }
    else {
        throw new Error("Expected 1, 2, 3 or 4 parameters. Actual: " + value);
    }
    return result;
}
var borderColorProperty = new properties_1.ShorthandProperty({
    name: "borderColor", cssName: "border-color",
    getter: function () {
        if (color_1.Color.equals(this.borderTopColor, this.borderRightColor) &&
            color_1.Color.equals(this.borderTopColor, this.borderBottomColor) &&
            color_1.Color.equals(this.borderTopColor, this.borderLeftColor)) {
            return this.borderTopColor;
        }
        else {
            return this.borderTopColor + " " + this.borderRightColor + " " + this.borderBottomColor + " " + this.borderLeftColor;
        }
    },
    converter: function (value) {
        if (typeof value === "string") {
            var fourColors = parseBorderColor(value);
            return [
                [exports.borderTopColorProperty, fourColors.top],
                [exports.borderRightColorProperty, fourColors.right],
                [exports.borderBottomColorProperty, fourColors.bottom],
                [exports.borderLeftColorProperty, fourColors.left]
            ];
        }
        else {
            return [
                [exports.borderTopColorProperty, value],
                [exports.borderRightColorProperty, value],
                [exports.borderBottomColorProperty, value],
                [exports.borderLeftColorProperty, value]
            ];
        }
    }
});
borderColorProperty.register(properties_1.Style);
exports.borderTopColorProperty = new properties_1.CssProperty({
    name: "borderTopColor", cssName: "border-top-color", valueChanged: function (target, oldValue, newValue) {
        var background = target.backgroundInternal.withBorderTopColor(newValue);
        target.backgroundInternal = background;
    }, equalityComparer: color_1.Color.equals, valueConverter: function (value) { return new color_1.Color(value); }
});
exports.borderTopColorProperty.register(properties_1.Style);
exports.borderRightColorProperty = new properties_1.CssProperty({
    name: "borderRightColor", cssName: "border-right-color", valueChanged: function (target, oldValue, newValue) {
        var background = target.backgroundInternal.withBorderRightColor(newValue);
        target.backgroundInternal = background;
    }, equalityComparer: color_1.Color.equals, valueConverter: function (value) { return new color_1.Color(value); }
});
exports.borderRightColorProperty.register(properties_1.Style);
exports.borderBottomColorProperty = new properties_1.CssProperty({
    name: "borderBottomColor", cssName: "border-bottom-color", valueChanged: function (target, oldValue, newValue) {
        var background = target.backgroundInternal.withBorderBottomColor(newValue);
        target.backgroundInternal = background;
    }, equalityComparer: color_1.Color.equals, valueConverter: function (value) { return new color_1.Color(value); }
});
exports.borderBottomColorProperty.register(properties_1.Style);
exports.borderLeftColorProperty = new properties_1.CssProperty({
    name: "borderLeftColor", cssName: "border-left-color", valueChanged: function (target, oldValue, newValue) {
        var background = target.backgroundInternal.withBorderLeftColor(newValue);
        target.backgroundInternal = background;
    }, equalityComparer: color_1.Color.equals, valueConverter: function (value) { return new color_1.Color(value); }
});
exports.borderLeftColorProperty.register(properties_1.Style);
var borderWidthProperty = new properties_1.ShorthandProperty({
    name: "borderWidth", cssName: "border-width",
    getter: function () {
        if (Length.equals(this.borderTopWidth, this.borderRightWidth) &&
            Length.equals(this.borderTopWidth, this.borderBottomWidth) &&
            Length.equals(this.borderTopWidth, this.borderLeftWidth)) {
            return this.borderTopWidth;
        }
        else {
            return Length.convertToString(this.borderTopWidth) + " " + Length.convertToString(this.borderRightWidth) + " " + Length.convertToString(this.borderBottomWidth) + " " + Length.convertToString(this.borderLeftWidth);
        }
    },
    converter: function (value) {
        if (typeof value === "string" && value !== "auto") {
            var borderWidths = parseThickness(value);
            return [
                [exports.borderTopWidthProperty, borderWidths.top],
                [exports.borderRightWidthProperty, borderWidths.right],
                [exports.borderBottomWidthProperty, borderWidths.bottom],
                [exports.borderLeftWidthProperty, borderWidths.left]
            ];
        }
        else {
            return [
                [exports.borderTopWidthProperty, value],
                [exports.borderRightWidthProperty, value],
                [exports.borderBottomWidthProperty, value],
                [exports.borderLeftWidthProperty, value]
            ];
        }
    }
});
borderWidthProperty.register(properties_1.Style);
exports.borderTopWidthProperty = new properties_1.CssProperty({
    name: "borderTopWidth", cssName: "border-top-width", defaultValue: exports.zeroLength, affectsLayout: platform_1.isIOS, equalityComparer: Length.equals,
    valueChanged: function (target, oldValue, newValue) {
        var value = Length.toDevicePixels(newValue, 0);
        if (!isNonNegativeFiniteNumber(value)) {
            throw new Error("border-top-width should be Non-Negative Finite number. Value: " + value);
        }
        target.view.effectiveBorderTopWidth = value;
        var background = target.backgroundInternal.withBorderTopWidth(value);
        target.backgroundInternal = background;
    }, valueConverter: Length.parse
});
exports.borderTopWidthProperty.register(properties_1.Style);
exports.borderRightWidthProperty = new properties_1.CssProperty({
    name: "borderRightWidth", cssName: "border-right-width", defaultValue: exports.zeroLength, affectsLayout: platform_1.isIOS, equalityComparer: Length.equals,
    valueChanged: function (target, oldValue, newValue) {
        var value = Length.toDevicePixels(newValue, 0);
        if (!isNonNegativeFiniteNumber(value)) {
            throw new Error("border-right-width should be Non-Negative Finite number. Value: " + value);
        }
        target.view.effectiveBorderRightWidth = value;
        var background = target.backgroundInternal.withBorderRightWidth(value);
        target.backgroundInternal = background;
    }, valueConverter: Length.parse
});
exports.borderRightWidthProperty.register(properties_1.Style);
exports.borderBottomWidthProperty = new properties_1.CssProperty({
    name: "borderBottomWidth", cssName: "border-bottom-width", defaultValue: exports.zeroLength, affectsLayout: platform_1.isIOS, equalityComparer: Length.equals,
    valueChanged: function (target, oldValue, newValue) {
        var value = Length.toDevicePixels(newValue, 0);
        if (!isNonNegativeFiniteNumber(value)) {
            throw new Error("border-bottom-width should be Non-Negative Finite number. Value: " + value);
        }
        target.view.effectiveBorderBottomWidth = value;
        var background = target.backgroundInternal.withBorderBottomWidth(value);
        target.backgroundInternal = background;
    }, valueConverter: Length.parse
});
exports.borderBottomWidthProperty.register(properties_1.Style);
exports.borderLeftWidthProperty = new properties_1.CssProperty({
    name: "borderLeftWidth", cssName: "border-left-width", defaultValue: exports.zeroLength, affectsLayout: platform_1.isIOS, equalityComparer: Length.equals,
    valueChanged: function (target, oldValue, newValue) {
        var value = Length.toDevicePixels(newValue, 0);
        if (!isNonNegativeFiniteNumber(value)) {
            throw new Error("border-left-width should be Non-Negative Finite number. Value: " + value);
        }
        target.view.effectiveBorderLeftWidth = value;
        var background = target.backgroundInternal.withBorderLeftWidth(value);
        target.backgroundInternal = background;
    }, valueConverter: Length.parse
});
exports.borderLeftWidthProperty.register(properties_1.Style);
var borderRadiusProperty = new properties_1.ShorthandProperty({
    name: "borderRadius", cssName: "border-radius",
    getter: function () {
        if (Length.equals(this.borderTopLeftRadius, this.borderTopRightRadius) &&
            Length.equals(this.borderTopLeftRadius, this.borderBottomRightRadius) &&
            Length.equals(this.borderTopLeftRadius, this.borderBottomLeftRadius)) {
            return this.borderTopLeftRadius;
        }
        return Length.convertToString(this.borderTopLeftRadius) + " " + Length.convertToString(this.borderTopRightRadius) + " " + Length.convertToString(this.borderBottomRightRadius) + " " + Length.convertToString(this.borderBottomLeftRadius);
    },
    converter: function (value) {
        if (typeof value === "string") {
            var borderRadius = parseThickness(value);
            return [
                [exports.borderTopLeftRadiusProperty, borderRadius.top],
                [exports.borderTopRightRadiusProperty, borderRadius.right],
                [exports.borderBottomRightRadiusProperty, borderRadius.bottom],
                [exports.borderBottomLeftRadiusProperty, borderRadius.left]
            ];
        }
        else {
            return [
                [exports.borderTopLeftRadiusProperty, value],
                [exports.borderTopRightRadiusProperty, value],
                [exports.borderBottomRightRadiusProperty, value],
                [exports.borderBottomLeftRadiusProperty, value]
            ];
        }
    }
});
borderRadiusProperty.register(properties_1.Style);
exports.borderTopLeftRadiusProperty = new properties_1.CssProperty({
    name: "borderTopLeftRadius", cssName: "border-top-left-radius", defaultValue: 0, affectsLayout: platform_1.isIOS, valueChanged: function (target, oldValue, newValue) {
        var value = Length.toDevicePixels(newValue, 0);
        if (!isNonNegativeFiniteNumber(value)) {
            throw new Error("border-top-left-radius should be Non-Negative Finite number. Value: " + value);
        }
        var background = target.backgroundInternal.withBorderTopLeftRadius(value);
        target.backgroundInternal = background;
    }, valueConverter: Length.parse
});
exports.borderTopLeftRadiusProperty.register(properties_1.Style);
exports.borderTopRightRadiusProperty = new properties_1.CssProperty({
    name: "borderTopRightRadius", cssName: "border-top-right-radius", defaultValue: 0, affectsLayout: platform_1.isIOS, valueChanged: function (target, oldValue, newValue) {
        var value = Length.toDevicePixels(newValue, 0);
        if (!isNonNegativeFiniteNumber(value)) {
            throw new Error("border-top-right-radius should be Non-Negative Finite number. Value: " + value);
        }
        var background = target.backgroundInternal.withBorderTopRightRadius(value);
        target.backgroundInternal = background;
    }, valueConverter: Length.parse
});
exports.borderTopRightRadiusProperty.register(properties_1.Style);
exports.borderBottomRightRadiusProperty = new properties_1.CssProperty({
    name: "borderBottomRightRadius", cssName: "border-bottom-right-radius", defaultValue: 0, affectsLayout: platform_1.isIOS, valueChanged: function (target, oldValue, newValue) {
        var value = Length.toDevicePixels(newValue, 0);
        if (!isNonNegativeFiniteNumber(value)) {
            throw new Error("border-bottom-right-radius should be Non-Negative Finite number. Value: " + value);
        }
        var background = target.backgroundInternal.withBorderBottomRightRadius(value);
        target.backgroundInternal = background;
    }, valueConverter: Length.parse
});
exports.borderBottomRightRadiusProperty.register(properties_1.Style);
exports.borderBottomLeftRadiusProperty = new properties_1.CssProperty({
    name: "borderBottomLeftRadius", cssName: "border-bottom-left-radius", defaultValue: 0, affectsLayout: platform_1.isIOS, valueChanged: function (target, oldValue, newValue) {
        var value = Length.toDevicePixels(newValue, 0);
        if (!isNonNegativeFiniteNumber(value)) {
            throw new Error("border-bottom-left-radius should be Non-Negative Finite number. Value: " + value);
        }
        var background = target.backgroundInternal.withBorderBottomLeftRadius(value);
        target.backgroundInternal = background;
    }, valueConverter: Length.parse
});
exports.borderBottomLeftRadiusProperty.register(properties_1.Style);
function isNonNegativeFiniteNumber(value) {
    return isFinite(value) && !isNaN(value) && value >= 0;
}
var supportedPaths = ["rect", "circle", "ellipse", "polygon", "inset"];
function isClipPathValid(value) {
    if (!value) {
        return true;
    }
    var functionName = value.substring(0, value.indexOf("(")).trim();
    return supportedPaths.indexOf(functionName) !== -1;
}
exports.clipPathProperty = new properties_1.CssProperty({
    name: "clipPath", cssName: "clip-path", valueChanged: function (target, oldValue, newValue) {
        if (!isClipPathValid(newValue)) {
            throw new Error("clip-path is not valid.");
        }
        var background = target.backgroundInternal.withClipPath(newValue);
        target.backgroundInternal = background;
    }
});
exports.clipPathProperty.register(properties_1.Style);
function isFloatValueConverter(value) {
    var newValue = parseFloat(value);
    if (isNaN(newValue)) {
        throw new Error("Invalid value: " + newValue);
    }
    return newValue;
}
exports.zIndexProperty = new properties_1.CssProperty({ name: "zIndex", cssName: "z-index", valueConverter: isFloatValueConverter });
exports.zIndexProperty.register(properties_1.Style);
function opacityConverter(value) {
    var newValue = parseFloat(value);
    if (!isNaN(newValue) && 0 <= newValue && newValue <= 1) {
        return newValue;
    }
    throw new Error("Opacity should be between [0, 1]. Value: " + newValue);
}
exports.opacityProperty = new properties_1.CssAnimationProperty({ name: "opacity", cssName: "opacity", defaultValue: 1, valueConverter: opacityConverter });
exports.opacityProperty.register(properties_1.Style);
exports.colorProperty = new properties_1.InheritedCssProperty({ name: "color", cssName: "color", equalityComparer: color_1.Color.equals, valueConverter: function (v) { return new color_1.Color(v); } });
exports.colorProperty.register(properties_1.Style);
exports.fontInternalProperty = new properties_1.CssProperty({ name: "fontInternal", cssName: "_fontInternal", defaultValue: font_1.Font.default });
exports.fontInternalProperty.register(properties_1.Style);
exports.fontFamilyProperty = new properties_1.InheritedCssProperty({
    name: "fontFamily", cssName: "font-family", affectsLayout: platform_1.isIOS, valueChanged: function (target, oldValue, newValue) {
        var currentFont = target.fontInternal;
        if (currentFont.fontFamily !== newValue) {
            var newFont = currentFont.withFontFamily(newValue);
            target.fontInternal = font_1.Font.equals(font_1.Font.default, newFont) ? properties_1.unsetValue : newFont;
        }
    }
});
exports.fontFamilyProperty.register(properties_1.Style);
exports.fontSizeProperty = new properties_1.InheritedCssProperty({
    name: "fontSize", cssName: "font-size", affectsLayout: platform_1.isIOS, valueChanged: function (target, oldValue, newValue) {
        var currentFont = target.fontInternal;
        if (currentFont.fontSize !== newValue) {
            var newFont = currentFont.withFontSize(newValue);
            target.fontInternal = font_1.Font.equals(font_1.Font.default, newFont) ? properties_1.unsetValue : newFont;
        }
    },
    valueConverter: function (v) { return parseFloat(v); }
});
exports.fontSizeProperty.register(properties_1.Style);
exports.fontStyleProperty = new properties_1.InheritedCssProperty({
    name: "fontStyle", cssName: "font-style", affectsLayout: platform_1.isIOS, defaultValue: font_1.FontStyle.NORMAL, valueConverter: font_1.FontStyle.parse, valueChanged: function (target, oldValue, newValue) {
        var currentFont = target.fontInternal;
        if (currentFont.fontStyle !== newValue) {
            var newFont = currentFont.withFontStyle(newValue);
            target.fontInternal = font_1.Font.equals(font_1.Font.default, newFont) ? properties_1.unsetValue : newFont;
        }
    }
});
exports.fontStyleProperty.register(properties_1.Style);
exports.fontWeightProperty = new properties_1.InheritedCssProperty({
    name: "fontWeight", cssName: "font-weight", affectsLayout: platform_1.isIOS, defaultValue: font_1.FontWeight.NORMAL, valueConverter: font_1.FontWeight.parse, valueChanged: function (target, oldValue, newValue) {
        var currentFont = target.fontInternal;
        if (currentFont.fontWeight !== newValue) {
            var newFont = currentFont.withFontWeight(newValue);
            target.fontInternal = font_1.Font.equals(font_1.Font.default, newFont) ? properties_1.unsetValue : newFont;
        }
    }
});
exports.fontWeightProperty.register(properties_1.Style);
var fontProperty = new properties_1.ShorthandProperty({
    name: "font", cssName: "font",
    getter: function () {
        return this.fontStyle + " " + this.fontWeight + " " + this.fontSize + " " + this.fontFamily;
    },
    converter: function (value) {
        if (value === properties_1.unsetValue) {
            return [
                [exports.fontStyleProperty, properties_1.unsetValue],
                [exports.fontWeightProperty, properties_1.unsetValue],
                [exports.fontSizeProperty, properties_1.unsetValue],
                [exports.fontFamilyProperty, properties_1.unsetValue]
            ];
        }
        else {
            var font = font_1.parseFont(value);
            var fontSize = parseFloat(font.fontSize);
            return [
                [exports.fontStyleProperty, font.fontStyle],
                [exports.fontWeightProperty, font.fontWeight],
                [exports.fontSizeProperty, fontSize],
                [exports.fontFamilyProperty, font.fontFamily]
            ];
        }
    }
});
fontProperty.register(properties_1.Style);
var Visibility;
(function (Visibility) {
    Visibility.VISIBLE = "visible";
    Visibility.HIDDEN = "hidden";
    Visibility.COLLAPSE = "collapse";
    Visibility.isValid = properties_1.makeValidator(Visibility.VISIBLE, Visibility.HIDDEN, Visibility.COLLAPSE);
    Visibility.parse = function (value) { return value.toLowerCase() === "collapsed" ? Visibility.COLLAPSE : parseStrict(value); };
    var parseStrict = properties_1.makeParser(Visibility.isValid);
})(Visibility = exports.Visibility || (exports.Visibility = {}));
exports.visibilityProperty = new properties_1.CssProperty({
    name: "visibility", cssName: "visibility", defaultValue: Visibility.VISIBLE, affectsLayout: platform_1.isIOS, valueConverter: Visibility.parse, valueChanged: function (target, oldValue, newValue) {
        target.view.isCollapsed = (newValue === Visibility.COLLAPSE);
    }
});
exports.visibilityProperty.register(properties_1.Style);
//# sourceMappingURL=style-properties.js.map