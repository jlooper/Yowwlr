Object.defineProperty(exports, "__esModule", { value: true });
var transitionId = 0;
var Transition = (function () {
    function Transition(duration, curve) {
        if (curve === void 0) { curve = 0; }
        this._duration = duration ? (duration / 1000) : 0.35;
        this._curve = curve;
        this._id = transitionId++;
    }
    Transition.prototype.getDuration = function () {
        return this._duration;
    };
    Transition.prototype.getCurve = function () {
        return this._curve;
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
//# sourceMappingURL=transition.ios.js.map