var animation_player_1 = require("./animation-player");
var style_property_1 = require("ui/styling/style-property");
var AnimationDriver = (function () {
    function AnimationDriver() {
    }
    return AnimationDriver;
}());
exports.AnimationDriver = AnimationDriver;
var NativeScriptAnimationDriver = (function () {
    function NativeScriptAnimationDriver() {
    }
    NativeScriptAnimationDriver.prototype.computeStyle = function (element, prop) {
        return element.style._getValue(style_property_1.getPropertyByCssName(prop));
    };
    NativeScriptAnimationDriver.prototype.animate = function (element, _startingStyles, keyframes, duration, delay, easing) {
        return new animation_player_1.NativeScriptAnimationPlayer(element, keyframes, duration, delay, easing);
    };
    return NativeScriptAnimationDriver;
}());
exports.NativeScriptAnimationDriver = NativeScriptAnimationDriver;
//# sourceMappingURL=animation-driver.js.map