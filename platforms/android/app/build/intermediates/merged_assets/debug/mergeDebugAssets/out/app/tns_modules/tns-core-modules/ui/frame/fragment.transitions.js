Object.defineProperty(exports, "__esModule", { value: true });
var transition_1 = require("../transition/transition");
var slide_transition_1 = require("../transition/slide-transition");
var fade_transition_1 = require("../transition/fade-transition");
var flip_transition_1 = require("../transition/flip-transition");
var animation_1 = require("../animation");
var platform_1 = require("../../platform");
var lazy_1 = require("../../utils/lazy");
var trace_1 = require("../../trace");
var sdkVersion = lazy_1.default(function () { return parseInt(platform_1.device.sdkVersion); });
var intEvaluator = lazy_1.default(function () { return new android.animation.IntEvaluator(); });
var defaultInterpolator = lazy_1.default(function () { return new android.view.animation.AccelerateDecelerateInterpolator(); });
exports.waitingQueue = new Map();
exports.completedEntries = new Map();
var TransitionListener;
var AnimationListener;
function _setAndroidFragmentTransitions(animated, navigationTransition, currentEntry, newEntry, fragmentTransaction, frameId) {
    var currentFragment = currentEntry ? currentEntry.fragment : null;
    var newFragment = newEntry.fragment;
    var entries = exports.waitingQueue.get(frameId);
    if (entries && entries.size > 0) {
        throw new Error("Calling navigation before previous navigation finish.");
    }
    if (sdkVersion() >= 21) {
        allowTransitionOverlap(currentFragment);
        allowTransitionOverlap(newFragment);
    }
    var name = "";
    var transition;
    if (navigationTransition) {
        transition = navigationTransition.instance;
        name = navigationTransition.name ? navigationTransition.name.toLowerCase() : "";
    }
    var useLollipopTransition = !!(name && (name.indexOf("slide") === 0 || name === "fade" || name === "explode") && sdkVersion() >= 21);
    if (currentFragment &&
        currentFragment.getChildFragmentManager() &&
        currentFragment.getChildFragmentManager().getFragments().toArray().length > 0) {
        useLollipopTransition = false;
    }
    if (!animated) {
        name = "none";
    }
    else if (transition) {
        name = "custom";
        useLollipopTransition = false;
    }
    else if (!useLollipopTransition && name.indexOf("slide") !== 0 && name !== "fade" && name.indexOf("flip") !== 0) {
        name = "default";
    }
    var currentFragmentNeedsDifferentAnimation = false;
    if (currentEntry) {
        _updateTransitions(currentEntry);
        if (currentEntry.transitionName !== name
            || currentEntry.transition !== transition) {
            clearExitAndReenterTransitions(currentEntry, true);
            currentFragmentNeedsDifferentAnimation = true;
        }
    }
    if (name === "none") {
        transition = new NoTransition(0, null);
    }
    else if (name === "default") {
        transition = new fade_transition_1.FadeTransition(150, null);
    }
    else if (useLollipopTransition) {
        if (name.indexOf("slide") === 0) {
            setupNewFragmentSlideTransition(navigationTransition, newEntry, name);
            if (currentFragmentNeedsDifferentAnimation) {
                setupCurrentFragmentSlideTransition(navigationTransition, currentEntry, name);
            }
        }
        else if (name === "fade") {
            setupNewFragmentFadeTransition(navigationTransition, newEntry);
            if (currentFragmentNeedsDifferentAnimation) {
                setupCurrentFragmentFadeTransition(navigationTransition, currentEntry);
            }
        }
        else if (name === "explode") {
            setupNewFragmentExplodeTransition(navigationTransition, newEntry);
            if (currentFragmentNeedsDifferentAnimation) {
                setupCurrentFragmentExplodeTransition(navigationTransition, currentEntry);
            }
        }
    }
    else if (name.indexOf("slide") === 0) {
        var direction = name.substr("slide".length) || "left";
        transition = new slide_transition_1.SlideTransition(direction, navigationTransition.duration, navigationTransition.curve);
    }
    else if (name === "fade") {
        transition = new fade_transition_1.FadeTransition(navigationTransition.duration, navigationTransition.curve);
    }
    else if (name.indexOf("flip") === 0) {
        var direction = name.substr("flip".length) || "right";
        transition = new flip_transition_1.FlipTransition(direction, navigationTransition.duration, navigationTransition.curve);
    }
    newEntry.transitionName = name;
    if (name === "custom") {
        newEntry.transition = transition;
    }
    if (transition) {
        fragmentTransaction.setCustomAnimations(-10, -20);
        setupAllAnimation(newEntry, transition);
        if (currentFragmentNeedsDifferentAnimation) {
            setupExitAndPopEnterAnimation(currentEntry, transition);
        }
    }
    if (currentEntry) {
        currentEntry.transitionName = name;
        if (name === "custom") {
            currentEntry.transition = transition;
        }
    }
    setupDefaultAnimations(newEntry, new fade_transition_1.FadeTransition(150, null));
    printTransitions(currentEntry);
    printTransitions(newEntry);
}
exports._setAndroidFragmentTransitions = _setAndroidFragmentTransitions;
function _onFragmentCreateAnimator(entry, fragment, nextAnim, enter) {
    var animator;
    switch (nextAnim) {
        case -10:
            animator = entry.enterAnimator;
            break;
        case -20:
            animator = entry.exitAnimator;
            break;
        case -30:
            animator = entry.popEnterAnimator;
            break;
        case -40:
            animator = entry.popExitAnimator;
            break;
    }
    if (!animator && sdkVersion() >= 21) {
        var view = fragment.getView();
        var jsParent = entry.resolvedPage.parent;
        var parent_1 = view.getParent() || (jsParent && jsParent.nativeViewProtected);
        var animatedEntries = _getAnimatedEntries(entry.frameId);
        if (!animatedEntries || !animatedEntries.has(entry)) {
            if (parent_1 && !parent_1.isLaidOut()) {
                animator = enter ? entry.defaultEnterAnimator : entry.defaultExitAnimator;
            }
        }
    }
    return animator;
}
exports._onFragmentCreateAnimator = _onFragmentCreateAnimator;
function _getAnimatedEntries(frameId) {
    return exports.waitingQueue.get(frameId);
}
exports._getAnimatedEntries = _getAnimatedEntries;
function _updateTransitions(entry) {
    var fragment = entry.fragment;
    var enterTransitionListener = entry.enterTransitionListener;
    if (enterTransitionListener) {
        fragment.setEnterTransition(enterTransitionListener.transition);
    }
    var exitTransitionListener = entry.exitTransitionListener;
    if (exitTransitionListener) {
        fragment.setExitTransition(exitTransitionListener.transition);
    }
    var reenterTransitionListener = entry.reenterTransitionListener;
    if (reenterTransitionListener) {
        fragment.setReenterTransition(reenterTransitionListener.transition);
    }
    var returnTransitionListener = entry.returnTransitionListener;
    if (returnTransitionListener) {
        fragment.setReturnTransition(returnTransitionListener.transition);
    }
}
exports._updateTransitions = _updateTransitions;
function _reverseTransitions(previousEntry, currentEntry) {
    var previousFragment = previousEntry.fragment;
    var currentFragment = currentEntry.fragment;
    var transitionUsed = false;
    if (sdkVersion() >= 21) {
        var returnTransitionListener = currentEntry.returnTransitionListener;
        if (returnTransitionListener) {
            transitionUsed = true;
            currentFragment.setExitTransition(returnTransitionListener.transition);
        }
        else {
            currentFragment.setExitTransition(null);
        }
        var reenterTransitionListener = previousEntry.reenterTransitionListener;
        if (reenterTransitionListener) {
            transitionUsed = true;
            previousFragment.setEnterTransition(reenterTransitionListener.transition);
        }
        else {
            previousFragment.setEnterTransition(null);
        }
    }
    return transitionUsed;
}
exports._reverseTransitions = _reverseTransitions;
function getTransitionListener(entry, transition) {
    if (!TransitionListener) {
        var TransitionListenerImpl = (function (_super) {
            __extends(TransitionListenerImpl, _super);
            function TransitionListenerImpl(entry, transition) {
                var _this = _super.call(this) || this;
                _this.entry = entry;
                _this.transition = transition;
                return global.__native(_this);
            }
            TransitionListenerImpl.prototype.onTransitionStart = function (transition) {
                var entry = this.entry;
                addToWaitingQueue(entry);
                if (trace_1.isEnabled()) {
                    trace_1.write("START " + toShortString(transition) + " transition for " + entry.fragmentTag, trace_1.categories.Transition);
                }
            };
            TransitionListenerImpl.prototype.onTransitionEnd = function (transition) {
                var entry = this.entry;
                if (trace_1.isEnabled()) {
                    trace_1.write("END " + toShortString(transition) + " transition for " + entry.fragmentTag, trace_1.categories.Transition);
                }
                transitionOrAnimationCompleted(entry);
            };
            TransitionListenerImpl.prototype.onTransitionResume = function (transition) {
                if (trace_1.isEnabled()) {
                    var fragment = this.entry.fragmentTag;
                    trace_1.write("RESUME " + toShortString(transition) + " transition for " + fragment, trace_1.categories.Transition);
                }
            };
            TransitionListenerImpl.prototype.onTransitionPause = function (transition) {
                if (trace_1.isEnabled()) {
                    trace_1.write("PAUSE " + toShortString(transition) + " transition for " + this.entry.fragmentTag, trace_1.categories.Transition);
                }
            };
            TransitionListenerImpl.prototype.onTransitionCancel = function (transition) {
                if (trace_1.isEnabled()) {
                    trace_1.write("CANCEL " + toShortString(transition) + " transition for " + this.entry.fragmentTag, trace_1.categories.Transition);
                }
            };
            TransitionListenerImpl = __decorate([
                Interfaces([android.transition.Transition.TransitionListener])
            ], TransitionListenerImpl);
            return TransitionListenerImpl;
        }(java.lang.Object));
        TransitionListener = TransitionListenerImpl;
    }
    return new TransitionListener(entry, transition);
}
function getAnimationListener() {
    if (!AnimationListener) {
        var AnimationListenerImpl = (function (_super) {
            __extends(AnimationListenerImpl, _super);
            function AnimationListenerImpl() {
                var _this = _super.call(this) || this;
                return global.__native(_this);
            }
            AnimationListenerImpl.prototype.onAnimationStart = function (animator) {
                var entry = animator.entry;
                addToWaitingQueue(entry);
                if (trace_1.isEnabled()) {
                    trace_1.write("START " + animator.transitionType + " for " + entry.fragmentTag, trace_1.categories.Transition);
                }
            };
            AnimationListenerImpl.prototype.onAnimationRepeat = function (animator) {
                if (trace_1.isEnabled()) {
                    trace_1.write("REPEAT " + animator.transitionType + " for " + animator.entry.fragmentTag, trace_1.categories.Transition);
                }
            };
            AnimationListenerImpl.prototype.onAnimationEnd = function (animator) {
                if (trace_1.isEnabled()) {
                    trace_1.write("END " + animator.transitionType + " for " + animator.entry.fragmentTag, trace_1.categories.Transition);
                }
                transitionOrAnimationCompleted(animator.entry);
            };
            AnimationListenerImpl.prototype.onAnimationCancel = function (animator) {
                if (trace_1.isEnabled()) {
                    trace_1.write("CANCEL " + animator.transitionType + " for " + animator.entry.fragmentTag, trace_1.categories.Transition);
                }
            };
            AnimationListenerImpl = __decorate([
                Interfaces([android.animation.Animator.AnimatorListener])
            ], AnimationListenerImpl);
            return AnimationListenerImpl;
        }(java.lang.Object));
        AnimationListener = new AnimationListenerImpl();
    }
    return AnimationListener;
}
function addToWaitingQueue(entry) {
    var frameId = entry.frameId;
    var entries = exports.waitingQueue.get(frameId);
    if (!entries) {
        entries = new Set();
        exports.waitingQueue.set(frameId, entries);
    }
    entries.add(entry);
}
function clearAnimationListener(animator, listener) {
    if (!animator) {
        return;
    }
    animator.removeListener(listener);
    if (animator.entry && trace_1.isEnabled()) {
        var entry = animator.entry;
        trace_1.write("Clear " + animator.transitionType + " - " + entry.transition + " for " + entry.fragmentTag, trace_1.categories.Transition);
    }
    animator.entry = null;
}
function clearExitAndReenterTransitions(entry, removeListener) {
    if (sdkVersion() >= 21) {
        var fragment = entry.fragment;
        var exitListener = entry.exitTransitionListener;
        if (exitListener) {
            var exitTransition = fragment.getExitTransition();
            if (exitTransition) {
                if (removeListener) {
                    exitTransition.removeListener(exitListener);
                }
                fragment.setExitTransition(null);
                if (trace_1.isEnabled()) {
                    trace_1.write("Cleared Exit " + exitTransition.getClass().getSimpleName() + " transition for " + fragment, trace_1.categories.Transition);
                }
            }
            if (removeListener) {
                entry.exitTransitionListener = null;
            }
        }
        var reenterListener = entry.reenterTransitionListener;
        if (reenterListener) {
            var reenterTransition = fragment.getReenterTransition();
            if (reenterTransition) {
                if (removeListener) {
                    reenterTransition.removeListener(reenterListener);
                }
                fragment.setReenterTransition(null);
                if (trace_1.isEnabled()) {
                    trace_1.write("Cleared Reenter " + reenterTransition.getClass().getSimpleName() + " transition for " + fragment, trace_1.categories.Transition);
                }
            }
            if (removeListener) {
                entry.reenterTransitionListener = null;
            }
        }
    }
}
function _clearFragment(entry) {
    clearEntry(entry, false);
}
exports._clearFragment = _clearFragment;
function _clearEntry(entry) {
    clearEntry(entry, true);
}
exports._clearEntry = _clearEntry;
function clearEntry(entry, removeListener) {
    clearExitAndReenterTransitions(entry, removeListener);
    if (sdkVersion() >= 21) {
        var fragment = entry.fragment;
        var enterListener = entry.enterTransitionListener;
        if (enterListener) {
            var enterTransition = fragment.getEnterTransition();
            if (enterTransition) {
                if (removeListener) {
                    enterTransition.removeListener(enterListener);
                }
                fragment.setEnterTransition(null);
                if (trace_1.isEnabled()) {
                    trace_1.write("Cleared Enter " + enterTransition.getClass().getSimpleName() + " transition for " + fragment, trace_1.categories.Transition);
                }
            }
            if (removeListener) {
                entry.enterTransitionListener = null;
            }
        }
        var returnListener = entry.returnTransitionListener;
        if (returnListener) {
            var returnTransition = fragment.getReturnTransition();
            if (returnTransition) {
                if (removeListener) {
                    returnTransition.removeListener(returnListener);
                }
                fragment.setReturnTransition(null);
                if (trace_1.isEnabled()) {
                    trace_1.write("Cleared Return " + returnTransition.getClass().getSimpleName() + " transition for " + fragment, trace_1.categories.Transition);
                }
            }
            if (removeListener) {
                entry.returnTransitionListener = null;
            }
        }
    }
    if (removeListener) {
        var listener = getAnimationListener();
        clearAnimationListener(entry.enterAnimator, listener);
        clearAnimationListener(entry.exitAnimator, listener);
        clearAnimationListener(entry.popEnterAnimator, listener);
        clearAnimationListener(entry.popExitAnimator, listener);
    }
}
function allowTransitionOverlap(fragment) {
    if (fragment) {
        fragment.setAllowEnterTransitionOverlap(true);
        fragment.setAllowReturnTransitionOverlap(true);
    }
}
function setEnterTransition(navigationTransition, entry, transition) {
    setUpNativeTransition(navigationTransition, transition);
    var listener = addNativeTransitionListener(entry, transition);
    entry.enterTransitionListener = listener;
    var fragment = entry.fragment;
    fragment.setEnterTransition(transition);
}
function setExitTransition(navigationTransition, entry, transition) {
    setUpNativeTransition(navigationTransition, transition);
    var listener = addNativeTransitionListener(entry, transition);
    entry.exitTransitionListener = listener;
    var fragment = entry.fragment;
    fragment.setExitTransition(transition);
}
function setReenterTransition(navigationTransition, entry, transition) {
    setUpNativeTransition(navigationTransition, transition);
    var listener = addNativeTransitionListener(entry, transition);
    entry.reenterTransitionListener = listener;
    var fragment = entry.fragment;
    fragment.setReenterTransition(transition);
}
function setReturnTransition(navigationTransition, entry, transition) {
    setUpNativeTransition(navigationTransition, transition);
    var listener = addNativeTransitionListener(entry, transition);
    entry.returnTransitionListener = listener;
    var fragment = entry.fragment;
    fragment.setReturnTransition(transition);
}
function setupNewFragmentSlideTransition(navTransition, entry, name) {
    setupCurrentFragmentSlideTransition(navTransition, entry, name);
    var direction = name.substr("slide".length) || "left";
    switch (direction) {
        case "left":
            setEnterTransition(navTransition, entry, new android.transition.Slide(android.view.Gravity.RIGHT));
            setReturnTransition(navTransition, entry, new android.transition.Slide(android.view.Gravity.RIGHT));
            break;
        case "right":
            setEnterTransition(navTransition, entry, new android.transition.Slide(android.view.Gravity.LEFT));
            setReturnTransition(navTransition, entry, new android.transition.Slide(android.view.Gravity.LEFT));
            break;
        case "top":
            setEnterTransition(navTransition, entry, new android.transition.Slide(android.view.Gravity.BOTTOM));
            setReturnTransition(navTransition, entry, new android.transition.Slide(android.view.Gravity.BOTTOM));
            break;
        case "bottom":
            setEnterTransition(navTransition, entry, new android.transition.Slide(android.view.Gravity.TOP));
            setReturnTransition(navTransition, entry, new android.transition.Slide(android.view.Gravity.TOP));
            break;
    }
}
function setupCurrentFragmentSlideTransition(navTransition, entry, name) {
    var direction = name.substr("slide".length) || "left";
    switch (direction) {
        case "left":
            setExitTransition(navTransition, entry, new android.transition.Slide(android.view.Gravity.LEFT));
            setReenterTransition(navTransition, entry, new android.transition.Slide(android.view.Gravity.LEFT));
            break;
        case "right":
            setExitTransition(navTransition, entry, new android.transition.Slide(android.view.Gravity.RIGHT));
            setReenterTransition(navTransition, entry, new android.transition.Slide(android.view.Gravity.RIGHT));
            break;
        case "top":
            setExitTransition(navTransition, entry, new android.transition.Slide(android.view.Gravity.TOP));
            setReenterTransition(navTransition, entry, new android.transition.Slide(android.view.Gravity.TOP));
            break;
        case "bottom":
            setExitTransition(navTransition, entry, new android.transition.Slide(android.view.Gravity.BOTTOM));
            setReenterTransition(navTransition, entry, new android.transition.Slide(android.view.Gravity.BOTTOM));
            break;
    }
}
function setupNewFragmentFadeTransition(navTransition, entry) {
    setupCurrentFragmentFadeTransition(navTransition, entry);
    var fadeInEnter = new android.transition.Fade(android.transition.Fade.IN);
    setEnterTransition(navTransition, entry, fadeInEnter);
    var fadeOutReturn = new android.transition.Fade(android.transition.Fade.OUT);
    setReturnTransition(navTransition, entry, fadeOutReturn);
}
function setupCurrentFragmentFadeTransition(navTransition, entry) {
    var fadeOutExit = new android.transition.Fade(android.transition.Fade.OUT);
    setExitTransition(navTransition, entry, fadeOutExit);
    var fadeInReenter = new android.transition.Fade(android.transition.Fade.IN);
    setReenterTransition(navTransition, entry, fadeInReenter);
}
function setupCurrentFragmentExplodeTransition(navTransition, entry) {
    setExitTransition(navTransition, entry, new android.transition.Explode());
    setReenterTransition(navTransition, entry, new android.transition.Explode());
}
function setupNewFragmentExplodeTransition(navTransition, entry) {
    setupCurrentFragmentExplodeTransition(navTransition, entry);
    setEnterTransition(navTransition, entry, new android.transition.Explode());
    setReturnTransition(navTransition, entry, new android.transition.Explode());
}
function setupExitAndPopEnterAnimation(entry, transition) {
    var listener = getAnimationListener();
    clearAnimationListener(entry.exitAnimator, listener);
    clearAnimationListener(entry.popEnterAnimator, listener);
    var exitAnimator = transition.createAndroidAnimator(transition_1.AndroidTransitionType.exit);
    exitAnimator.transitionType = transition_1.AndroidTransitionType.exit;
    exitAnimator.entry = entry;
    exitAnimator.addListener(listener);
    entry.exitAnimator = exitAnimator;
    var popEnterAnimator = transition.createAndroidAnimator(transition_1.AndroidTransitionType.popEnter);
    popEnterAnimator.transitionType = transition_1.AndroidTransitionType.popEnter;
    popEnterAnimator.entry = entry;
    popEnterAnimator.addListener(listener);
    entry.popEnterAnimator = popEnterAnimator;
}
function setupAllAnimation(entry, transition) {
    setupExitAndPopEnterAnimation(entry, transition);
    var listener = getAnimationListener();
    var enterAnimator = transition.createAndroidAnimator(transition_1.AndroidTransitionType.enter);
    enterAnimator.transitionType = transition_1.AndroidTransitionType.enter;
    enterAnimator.entry = entry;
    enterAnimator.addListener(listener);
    entry.enterAnimator = enterAnimator;
    var popExitAnimator = transition.createAndroidAnimator(transition_1.AndroidTransitionType.popExit);
    popExitAnimator.transitionType = transition_1.AndroidTransitionType.popExit;
    popExitAnimator.entry = entry;
    popExitAnimator.addListener(listener);
    entry.popExitAnimator = popExitAnimator;
}
function setupDefaultAnimations(entry, transition) {
    var listener = getAnimationListener();
    var enterAnimator = transition.createAndroidAnimator(transition_1.AndroidTransitionType.enter);
    enterAnimator.transitionType = transition_1.AndroidTransitionType.enter;
    enterAnimator.entry = entry;
    enterAnimator.addListener(listener);
    entry.defaultEnterAnimator = enterAnimator;
    var exitAnimator = transition.createAndroidAnimator(transition_1.AndroidTransitionType.exit);
    exitAnimator.transitionType = transition_1.AndroidTransitionType.exit;
    exitAnimator.entry = entry;
    exitAnimator.addListener(listener);
    entry.defaultExitAnimator = exitAnimator;
}
function setUpNativeTransition(navigationTransition, nativeTransition) {
    if (navigationTransition.duration) {
        nativeTransition.setDuration(navigationTransition.duration);
    }
    var interpolator = navigationTransition.curve ? animation_1._resolveAnimationCurve(navigationTransition.curve) : defaultInterpolator();
    nativeTransition.setInterpolator(interpolator);
}
function addNativeTransitionListener(entry, nativeTransition) {
    var listener = getTransitionListener(entry, nativeTransition);
    nativeTransition.addListener(listener);
    return listener;
}
function transitionOrAnimationCompleted(entry) {
    var frameId = entry.frameId;
    var entries = exports.waitingQueue.get(frameId);
    if (!entries) {
        return;
    }
    entries.delete(entry);
    if (entries.size === 0) {
        var frame_1 = entry.resolvedPage.frame;
        var previousCompletedAnimationEntry = exports.completedEntries.get(frameId);
        exports.completedEntries.delete(frameId);
        exports.waitingQueue.delete(frameId);
        var current_1 = frame_1.isCurrent(entry) ? previousCompletedAnimationEntry : entry;
        current_1 = current_1 || entry;
        if (current_1) {
            var isBack_1 = frame_1._isBack;
            setTimeout(function () { return frame_1.setCurrent(current_1, isBack_1); });
        }
    }
    else {
        exports.completedEntries.set(frameId, entry);
    }
}
function toShortString(nativeTransition) {
    return nativeTransition.getClass().getSimpleName() + "@" + nativeTransition.hashCode().toString(16);
}
function printTransitions(entry) {
    if (entry && trace_1.isEnabled()) {
        var result = entry.fragmentTag + " Transitions:";
        if (entry.transitionName) {
            result += "transitionName=" + entry.transitionName + ", ";
        }
        if (entry.transition) {
            result += "enterAnimator=" + entry.enterAnimator + ", ";
            result += "exitAnimator=" + entry.exitAnimator + ", ";
            result += "popEnterAnimator=" + entry.popEnterAnimator + ", ";
            result += "popExitAnimator=" + entry.popExitAnimator + ", ";
        }
        if (sdkVersion() >= 21) {
            var fragment = entry.fragment;
            result += "" + (fragment.getEnterTransition() ? " enter=" + toShortString(fragment.getEnterTransition()) : "");
            result += "" + (fragment.getExitTransition() ? " exit=" + toShortString(fragment.getExitTransition()) : "");
            result += "" + (fragment.getReenterTransition() ? " popEnter=" + toShortString(fragment.getReenterTransition()) : "");
            result += "" + (fragment.getReturnTransition() ? " popExit=" + toShortString(fragment.getReturnTransition()) : "");
        }
        trace_1.write(result, trace_1.categories.Transition);
    }
}
function javaObjectArray() {
    var params = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        params[_i] = arguments[_i];
    }
    var nativeArray = Array.create(java.lang.Object, params.length);
    params.forEach(function (value, i) { return nativeArray[i] = value; });
    return nativeArray;
}
function createDummyZeroDurationAnimator() {
    var animator = android.animation.ValueAnimator.ofObject(intEvaluator(), javaObjectArray(java.lang.Integer.valueOf(0), java.lang.Integer.valueOf(1)));
    animator.setDuration(0);
    return animator;
}
var NoTransition = (function (_super) {
    __extends(NoTransition, _super);
    function NoTransition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoTransition.prototype.createAndroidAnimator = function (transitionType) {
        return createDummyZeroDurationAnimator();
    };
    return NoTransition;
}(transition_1.Transition));
//# sourceMappingURL=fragment.transitions.js.map