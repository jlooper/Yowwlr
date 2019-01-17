Object.defineProperty(exports, "__esModule", { value: true });
var animation_1 = require("../animation");
var lazy_1 = require("../../utils/lazy");
var _defaultInterpolator = lazy_1.default(function () { return new android.view.animation.AccelerateDecelerateInterpolator(); });
var AndroidTransitionType;
(function (AndroidTransitionType) {
    AndroidTransitionType.enter = "enter";
    AndroidTransitionType.exit = "exit";
    AndroidTransitionType.popEnter = "popEnter";
    AndroidTransitionType.popExit = "popExit";
})(AndroidTransitionType = exports.AndroidTransitionType || (exports.AndroidTransitionType = {}));
var transitionId = 0;
var Transition = (function () {
    function Transition(duration, curve) {
        this._duration = duration;
        this._interpolator = curve ? animation_1._resolveAnimationCurve(curve) : _defaultInterpolator();
        this._id = transitionId++;
    }
    Transition.prototype.getDuration = function () {
        return this._duration;
    };
    Transition.prototype.getCurve = function () {
        return this._interpolator;
    };
    Transition.prototype.animateIOSTransition = function (containerView, fromView, toView, operation, completion) {
        throw new Error("Abstract method call");
    };
    Transition.prototype.createAndroidAnimator = function (transitionType) {
        throw new Error("Abstract method call");
    };
    Transition.prototype.toString = function () {
        return "Transition@" + this._id;
    };
    return Transition;
}());
exports.Transition = Transition;
//# sourceMappingURL=transition.js.map