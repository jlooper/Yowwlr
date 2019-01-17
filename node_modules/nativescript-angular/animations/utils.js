Object.defineProperty(exports, "__esModule", { value: true });
var keyframe_animation_1 = require("tns-core-modules/ui/animation/keyframe-animation");
var css_animation_parser_1 = require("tns-core-modules/ui/styling/css-animation-parser");
var converters_1 = require("tns-core-modules/ui/styling/converters");
var DASH_CASE_REGEXP = /-+([a-z0-9])/g;
function dashCaseToCamelCase(input) {
    return input.replace(DASH_CASE_REGEXP, function () {
        var m = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            m[_i] = arguments[_i];
        }
        return m[1].toUpperCase();
    });
}
exports.dashCaseToCamelCase = dashCaseToCamelCase;
function createKeyframeAnimation(styles, duration, delay, easing) {
    var info = createKeyframeAnimationInfo(styles, duration, delay, easing);
    return keyframe_animation_1.KeyframeAnimation.keyframeAnimationFromInfo(info);
}
exports.createKeyframeAnimation = createKeyframeAnimation;
var createKeyframeAnimationInfo = function (styles, duration, delay, easing) { return ({
    isForwards: true,
    duration: duration || 0.01,
    delay: delay,
    curve: getCurve(easing),
    keyframes: styles.map(parseAnimationKeyframe),
}); };
var ɵ0 = createKeyframeAnimationInfo;
exports.ɵ0 = ɵ0;
var getCurve = function (value) { return converters_1.animationTimingFunctionConverter(value); };
var ɵ1 = getCurve;
exports.ɵ1 = ɵ1;
var parseAnimationKeyframe = function (styles) { return ({
    duration: getKeyframeDuration(styles),
    declarations: getDeclarations(styles),
}); };
var ɵ2 = parseAnimationKeyframe;
exports.ɵ2 = ɵ2;
var getKeyframeDuration = function (styles) { return styles.offset; };
var ɵ3 = getKeyframeDuration;
exports.ɵ3 = ɵ3;
function getDeclarations(styles) {
    var unparsedDeclarations = Object.keys(styles).map(function (property) { return ({ property: property, value: styles[property] }); });
    return css_animation_parser_1.parseKeyframeDeclarations(unparsedDeclarations);
}
//# sourceMappingURL=utils.js.map