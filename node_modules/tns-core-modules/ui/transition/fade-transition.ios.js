Object.defineProperty(exports, "__esModule", { value: true });
var transition_1 = require("./transition");
var FadeTransition = (function (_super) {
    __extends(FadeTransition, _super);
    function FadeTransition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FadeTransition.prototype.animateIOSTransition = function (containerView, fromView, toView, operation, completion) {
        var originalToViewAlpha = toView.alpha;
        var originalFromViewAlpha = fromView.alpha;
        toView.alpha = 0.0;
        fromView.alpha = 1.0;
        switch (operation) {
            case 1:
                containerView.insertSubviewAboveSubview(toView, fromView);
                break;
            case 2:
                containerView.insertSubviewBelowSubview(toView, fromView);
                break;
        }
        var duration = this.getDuration();
        var curve = this.getCurve();
        UIView.animateWithDurationAnimationsCompletion(duration, function () {
            UIView.setAnimationCurve(curve);
            toView.alpha = 1.0;
            fromView.alpha = 0.0;
        }, function (finished) {
            toView.alpha = originalToViewAlpha;
            fromView.alpha = originalFromViewAlpha;
            completion(finished);
        });
    };
    return FadeTransition;
}(transition_1.Transition));
exports.FadeTransition = FadeTransition;
//# sourceMappingURL=fade-transition.ios.js.map