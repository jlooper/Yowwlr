Object.defineProperty(exports, "__esModule", { value: true });
var properties_1 = require("../core/properties");
var keyframe_animation_1 = require("../animation/keyframe-animation");
var converters_1 = require("../styling/converters");
var style_properties_1 = require("../styling/style-properties");
var ANIMATION_PROPERTY_HANDLERS = Object.freeze({
    "animation-name": function (info, value) { return info.name = value; },
    "animation-duration": function (info, value) { return info.duration = converters_1.timeConverter(value); },
    "animation-delay": function (info, value) { return info.delay = converters_1.timeConverter(value); },
    "animation-timing-function": function (info, value) { return info.curve = converters_1.animationTimingFunctionConverter(value); },
    "animation-iteration-count": function (info, value) { return info.iterations = value === "infinite" ? Number.MAX_VALUE : parseFloat(value); },
    "animation-direction": function (info, value) { return info.isReverse = value === "reverse"; },
    "animation-fill-mode": function (info, value) { return info.isForwards = value === "forwards"; }
});
var CssAnimationParser = (function () {
    function CssAnimationParser() {
    }
    CssAnimationParser.keyframeAnimationsFromCSSDeclarations = function (declarations) {
        if (declarations === null || declarations === undefined) {
            return undefined;
        }
        var animations = new Array();
        var animationInfo = undefined;
        declarations.forEach(function (_a) {
            var property = _a.property, value = _a.value;
            if (property === "animation") {
                keyframeAnimationsFromCSSProperty(value, animations);
            }
            else {
                var propertyHandler = ANIMATION_PROPERTY_HANDLERS[property];
                if (propertyHandler) {
                    if (animationInfo === undefined) {
                        animationInfo = new keyframe_animation_1.KeyframeAnimationInfo();
                        animations.push(animationInfo);
                    }
                    propertyHandler(animationInfo, value);
                }
            }
        });
        return animations.length === 0 ? undefined : animations;
    };
    CssAnimationParser.keyframesArrayFromCSS = function (keyframes) {
        var parsedKeyframes = new Array();
        for (var _i = 0, keyframes_1 = keyframes; _i < keyframes_1.length; _i++) {
            var keyframe = keyframes_1[_i];
            var declarations = parseKeyframeDeclarations(keyframe.declarations);
            for (var _a = 0, _b = keyframe.values; _a < _b.length; _a++) {
                var time_1 = _b[_a];
                if (time_1 === "from") {
                    time_1 = 0;
                }
                else if (time_1 === "to") {
                    time_1 = 1;
                }
                else {
                    time_1 = parseFloat(time_1) / 100;
                    if (time_1 < 0) {
                        time_1 = 0;
                    }
                    if (time_1 > 100) {
                        time_1 = 100;
                    }
                }
                var current = parsedKeyframes[time_1];
                if (current === undefined) {
                    current = {};
                    current.duration = time_1;
                    parsedKeyframes[time_1] = current;
                }
                for (var _c = 0, _d = keyframe.declarations; _c < _d.length; _c++) {
                    var declaration = _d[_c];
                    if (declaration.property === "animation-timing-function") {
                        current.curve = converters_1.animationTimingFunctionConverter(declaration.value);
                    }
                }
                current.declarations = declarations;
            }
        }
        var array = new Array();
        for (var parsedKeyframe in parsedKeyframes) {
            array.push(parsedKeyframes[parsedKeyframe]);
        }
        array.sort(function (a, b) { return a.duration - b.duration; });
        return array;
    };
    return CssAnimationParser;
}());
exports.CssAnimationParser = CssAnimationParser;
function keyframeAnimationsFromCSSProperty(value, animations) {
    if (typeof value === "string") {
        var values = value.split(/[,]+/);
        for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
            var parsedValue = values_1[_i];
            var animationInfo = new keyframe_animation_1.KeyframeAnimationInfo();
            var arr = parsedValue.trim().split(/[ ]+/);
            if (arr.length > 0) {
                animationInfo.name = arr[0];
            }
            if (arr.length > 1) {
                animationInfo.duration = converters_1.timeConverter(arr[1]);
            }
            if (arr.length > 2) {
                animationInfo.curve = converters_1.animationTimingFunctionConverter(arr[2]);
            }
            if (arr.length > 3) {
                animationInfo.delay = converters_1.timeConverter(arr[3]);
            }
            if (arr.length > 4) {
                animationInfo.iterations = parseInt(arr[4]);
            }
            if (arr.length > 5) {
                animationInfo.isReverse = arr[4] === "reverse";
            }
            if (arr.length > 6) {
                animationInfo.isForwards = arr[5] === "forwards";
            }
            if (arr.length > 7) {
                throw new Error("Invalid value for animation: " + value);
            }
            animations.push(animationInfo);
        }
    }
}
function parseKeyframeDeclarations(unparsedKeyframeDeclarations) {
    var declarations = unparsedKeyframeDeclarations
        .reduce(function (declarations, _a) {
        var unparsedProperty = _a.property, unparsedValue = _a.value;
        var property = properties_1.CssAnimationProperty._getByCssName(unparsedProperty);
        if (typeof unparsedProperty === "string" && property && property._valueConverter) {
            declarations[property.name] = property._valueConverter(unparsedValue);
        }
        else if (typeof unparsedValue === "string" && unparsedProperty === "transform") {
            var transformations = style_properties_1.transformConverter(unparsedValue);
            Object.assign(declarations, transformations);
        }
        return declarations;
    }, {});
    return Object.keys(declarations).map(function (property) { return ({ property: property, value: declarations[property] }); });
}
exports.parseKeyframeDeclarations = parseKeyframeDeclarations;
//# sourceMappingURL=css-animation-parser.js.map