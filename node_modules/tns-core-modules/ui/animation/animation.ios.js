function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var animation_common_1 = require("./animation-common");
var style_properties_1 = require("../styling/style-properties");
var utils_1 = require("../../utils/utils");
__export(require("./animation-common"));
var getter = utils_1.ios.getter;
var _transform = "_transform";
var _skip = "_skip";
var FLT_MAX = 340282346638528859811704183484516925440.000000;
var AnimationInfo = (function () {
    function AnimationInfo() {
    }
    return AnimationInfo;
}());
var AnimationDelegateImpl = (function (_super) {
    __extends(AnimationDelegateImpl, _super);
    function AnimationDelegateImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AnimationDelegateImpl.initWithFinishedCallback = function (finishedCallback, propertyAnimation, valueSource) {
        var delegate = AnimationDelegateImpl.new();
        delegate._finishedCallback = finishedCallback;
        delegate._propertyAnimation = propertyAnimation;
        delegate._valueSource = valueSource;
        return delegate;
    };
    AnimationDelegateImpl.prototype.animationDidStart = function (anim) {
        var value = this._propertyAnimation.value;
        var setLocal = this._valueSource === "animation";
        var targetStyle = this._propertyAnimation.target.style;
        this._propertyAnimation.target._suspendPresentationLayerUpdates();
        switch (this._propertyAnimation.property) {
            case animation_common_1.Properties.backgroundColor:
                targetStyle[setLocal ? style_properties_1.backgroundColorProperty.name : style_properties_1.backgroundColorProperty.keyframe] = value;
                break;
            case animation_common_1.Properties.opacity:
                targetStyle[setLocal ? style_properties_1.opacityProperty.name : style_properties_1.opacityProperty.keyframe] = value;
                break;
            case animation_common_1.Properties.rotate:
                targetStyle[setLocal ? style_properties_1.rotateProperty.name : style_properties_1.rotateProperty.keyframe] = value;
                break;
            case animation_common_1.Properties.translate:
                targetStyle[setLocal ? style_properties_1.translateXProperty.name : style_properties_1.translateXProperty.keyframe] = value.x;
                targetStyle[setLocal ? style_properties_1.translateYProperty.name : style_properties_1.translateYProperty.keyframe] = value.y;
                break;
            case animation_common_1.Properties.scale:
                targetStyle[setLocal ? style_properties_1.scaleXProperty.name : style_properties_1.scaleXProperty.keyframe] = value.x === 0 ? 0.001 : value.x;
                targetStyle[setLocal ? style_properties_1.scaleYProperty.name : style_properties_1.scaleYProperty.keyframe] = value.y === 0 ? 0.001 : value.y;
                break;
            case _transform:
                if (value[animation_common_1.Properties.translate] !== undefined) {
                    targetStyle[setLocal ? style_properties_1.translateXProperty.name : style_properties_1.translateXProperty.keyframe] = value[animation_common_1.Properties.translate].x;
                    targetStyle[setLocal ? style_properties_1.translateYProperty.name : style_properties_1.translateYProperty.keyframe] = value[animation_common_1.Properties.translate].y;
                }
                if (value[animation_common_1.Properties.scale] !== undefined) {
                    var x = value[animation_common_1.Properties.scale].x;
                    var y = value[animation_common_1.Properties.scale].y;
                    targetStyle[setLocal ? style_properties_1.scaleXProperty.name : style_properties_1.scaleXProperty.keyframe] = x === 0 ? 0.001 : x;
                    targetStyle[setLocal ? style_properties_1.scaleYProperty.name : style_properties_1.scaleYProperty.keyframe] = y === 0 ? 0.001 : y;
                }
                break;
        }
        this._propertyAnimation.target._resumePresentationLayerUpdates();
    };
    AnimationDelegateImpl.prototype.animationDidStopFinished = function (anim, finished) {
        if (this._finishedCallback) {
            this._finishedCallback(!finished);
        }
        if (finished && this.nextAnimation) {
            this.nextAnimation();
        }
    };
    AnimationDelegateImpl.ObjCProtocols = global.CAAnimationDelegate ? [global.CAAnimationDelegate] : [];
    return AnimationDelegateImpl;
}(NSObject));
function _resolveAnimationCurve(curve) {
    switch (curve) {
        case "easeIn":
            return CAMediaTimingFunction.functionWithName(kCAMediaTimingFunctionEaseIn);
        case "easeOut":
            return CAMediaTimingFunction.functionWithName(kCAMediaTimingFunctionEaseOut);
        case "easeInOut":
            return CAMediaTimingFunction.functionWithName(kCAMediaTimingFunctionEaseInEaseOut);
        case "linear":
            return CAMediaTimingFunction.functionWithName(kCAMediaTimingFunctionLinear);
        case "spring":
            return curve;
        case "ease":
            return CAMediaTimingFunction.functionWithControlPoints(0.25, 0.1, 0.25, 1.0);
        default:
            if (curve instanceof CAMediaTimingFunction) {
                return curve;
            }
            else if (curve instanceof animation_common_1.CubicBezierAnimationCurve) {
                var animationCurve = curve;
                return CAMediaTimingFunction.functionWithControlPoints(animationCurve.x1, animationCurve.y1, animationCurve.x2, animationCurve.y2);
            }
            else {
                throw new Error("Invalid animation curve: " + curve);
            }
    }
}
exports._resolveAnimationCurve = _resolveAnimationCurve;
var Animation = (function (_super) {
    __extends(Animation, _super);
    function Animation(animationDefinitions, playSequentially) {
        var _this = _super.call(this, animationDefinitions, playSequentially) || this;
        _this._valueSource = "animation";
        if (animationDefinitions.length > 0 && animationDefinitions[0].valueSource !== undefined) {
            _this._valueSource = animationDefinitions[0].valueSource;
        }
        if (!playSequentially) {
            if (animation_common_1.traceEnabled()) {
                animation_common_1.traceWrite("Non-merged Property Animations: " + _this._propertyAnimations.length, animation_common_1.traceCategories.Animation);
            }
            _this._mergedPropertyAnimations = Animation._mergeAffineTransformAnimations(_this._propertyAnimations);
            if (animation_common_1.traceEnabled()) {
                animation_common_1.traceWrite("Merged Property Animations: " + _this._mergedPropertyAnimations.length, animation_common_1.traceCategories.Animation);
            }
        }
        else {
            _this._mergedPropertyAnimations = _this._propertyAnimations;
        }
        var that = _this;
        var animationFinishedCallback = function (cancelled) {
            if (that._playSequentially) {
                if (cancelled) {
                    that._rejectAnimationFinishedPromise();
                }
                else {
                    that._resolveAnimationFinishedPromise();
                }
            }
            else {
                if (cancelled) {
                    that._cancelledAnimations++;
                }
                else {
                    that._finishedAnimations++;
                }
                if (that._cancelledAnimations > 0 && (that._cancelledAnimations + that._finishedAnimations) === that._mergedPropertyAnimations.length) {
                    if (animation_common_1.traceEnabled()) {
                        animation_common_1.traceWrite(that._cancelledAnimations + " animations cancelled.", animation_common_1.traceCategories.Animation);
                    }
                    that._rejectAnimationFinishedPromise();
                }
                else if (that._finishedAnimations === that._mergedPropertyAnimations.length) {
                    if (animation_common_1.traceEnabled()) {
                        animation_common_1.traceWrite(that._finishedAnimations + " animations finished.", animation_common_1.traceCategories.Animation);
                    }
                    that._resolveAnimationFinishedPromise();
                }
            }
        };
        _this._iOSAnimationFunction = Animation._createiOSAnimationFunction(_this._mergedPropertyAnimations, 0, _this._playSequentially, _this._valueSource, animationFinishedCallback);
        return _this;
    }
    Animation.prototype.play = function () {
        if (this.isPlaying) {
            return this._rejectAlreadyPlaying();
        }
        var animationFinishedPromise = _super.prototype.play.call(this);
        this._finishedAnimations = 0;
        this._cancelledAnimations = 0;
        this._iOSAnimationFunction();
        return animationFinishedPromise;
    };
    Animation.prototype.cancel = function () {
        if (!this.isPlaying) {
            animation_common_1.traceWrite("Animation is not currently playing.", animation_common_1.traceCategories.Animation, animation_common_1.traceType.warn);
            return;
        }
        var i = 0;
        var length = this._mergedPropertyAnimations.length;
        for (; i < length; i++) {
            var propertyAnimation = this._mergedPropertyAnimations[i];
            propertyAnimation.target.nativeViewProtected.layer.removeAllAnimations();
            if (propertyAnimation._propertyResetCallback) {
                propertyAnimation._propertyResetCallback(propertyAnimation._originalValue, this._valueSource);
            }
        }
    };
    Animation.prototype._resolveAnimationCurve = function (curve) {
        return _resolveAnimationCurve(curve);
    };
    Animation._createiOSAnimationFunction = function (propertyAnimations, index, playSequentially, valueSource, finishedCallback) {
        return function (cancelled) {
            if (cancelled && finishedCallback) {
                if (animation_common_1.traceEnabled()) {
                    animation_common_1.traceWrite("Animation " + (index - 1).toString() + " was cancelled. Will skip the rest of animations and call finishedCallback(true).", animation_common_1.traceCategories.Animation);
                }
                finishedCallback(cancelled);
                return;
            }
            var animation = propertyAnimations[index];
            var args = Animation._getNativeAnimationArguments(animation, valueSource);
            if (animation.curve === "spring") {
                Animation._createNativeSpringAnimation(propertyAnimations, index, playSequentially, args, animation, valueSource, finishedCallback);
            }
            else {
                Animation._createNativeAnimation(propertyAnimations, index, playSequentially, args, animation, valueSource, finishedCallback);
            }
        };
    };
    Animation._getNativeAnimationArguments = function (animation, valueSource) {
        var nativeView = animation.target.nativeViewProtected;
        var propertyNameToAnimate = animation.property;
        var value = animation.value;
        var originalValue;
        var tempRotate = (animation.target.rotate || 0) * Math.PI / 180;
        var abs;
        var setLocal = valueSource === "animation";
        switch (animation.property) {
            case animation_common_1.Properties.backgroundColor:
                animation._originalValue = animation.target.backgroundColor;
                animation._propertyResetCallback = function (value, valueSource) {
                    animation.target.style[setLocal ? style_properties_1.backgroundColorProperty.name : style_properties_1.backgroundColorProperty.keyframe] = value;
                };
                originalValue = nativeView.layer.backgroundColor;
                if (nativeView instanceof UILabel) {
                    nativeView.setValueForKey(getter(UIColor, UIColor.clearColor), "backgroundColor");
                }
                value = value.CGColor;
                break;
            case animation_common_1.Properties.opacity:
                animation._originalValue = animation.target.opacity;
                animation._propertyResetCallback = function (value, valueSource) {
                    animation.target.style[setLocal ? style_properties_1.opacityProperty.name : style_properties_1.opacityProperty.keyframe] = value;
                };
                originalValue = nativeView.layer.opacity;
                break;
            case animation_common_1.Properties.rotate:
                animation._originalValue = animation.target.rotate !== undefined ? animation.target.rotate : 0;
                animation._propertyResetCallback = function (value, valueSource) {
                    animation.target.style[setLocal ? style_properties_1.rotateProperty.name : style_properties_1.rotateProperty.keyframe] = value;
                };
                propertyNameToAnimate = "transform.rotation";
                originalValue = nativeView.layer.valueForKeyPath("transform.rotation");
                if (animation.target.rotate !== undefined && animation.target.rotate !== 0 && Math.floor(value / 360) - value / 360 === 0) {
                    originalValue = animation.target.rotate * Math.PI / 180;
                }
                value = value * Math.PI / 180;
                abs = fabs(originalValue - value);
                if (abs < 0.001 && originalValue !== tempRotate) {
                    originalValue = tempRotate;
                }
                break;
            case animation_common_1.Properties.translate:
                animation._originalValue = { x: animation.target.translateX, y: animation.target.translateY };
                animation._propertyResetCallback = function (value, valueSource) {
                    animation.target.style[setLocal ? style_properties_1.translateXProperty.name : style_properties_1.translateXProperty.keyframe] = value.x;
                    animation.target.style[setLocal ? style_properties_1.translateYProperty.name : style_properties_1.translateYProperty.keyframe] = value.y;
                };
                propertyNameToAnimate = "transform";
                originalValue = NSValue.valueWithCATransform3D(nativeView.layer.transform);
                value = NSValue.valueWithCATransform3D(CATransform3DTranslate(nativeView.layer.transform, value.x, value.y, 0));
                break;
            case animation_common_1.Properties.scale:
                if (value.x === 0) {
                    value.x = 0.001;
                }
                if (value.y === 0) {
                    value.y = 0.001;
                }
                animation._originalValue = { x: animation.target.scaleX, y: animation.target.scaleY };
                animation._propertyResetCallback = function (value, valueSource) {
                    animation.target.style[setLocal ? style_properties_1.scaleXProperty.name : style_properties_1.scaleXProperty.keyframe] = value.x;
                    animation.target.style[setLocal ? style_properties_1.scaleYProperty.name : style_properties_1.scaleYProperty.keyframe] = value.y;
                };
                propertyNameToAnimate = "transform";
                originalValue = NSValue.valueWithCATransform3D(nativeView.layer.transform);
                value = NSValue.valueWithCATransform3D(CATransform3DScale(nativeView.layer.transform, value.x, value.y, 1));
                break;
            case _transform:
                originalValue = NSValue.valueWithCATransform3D(nativeView.layer.transform);
                animation._originalValue = {
                    xs: animation.target.scaleX, ys: animation.target.scaleY,
                    xt: animation.target.translateX, yt: animation.target.translateY
                };
                animation._propertyResetCallback = function (value, valueSource) {
                    animation.target.style[setLocal ? style_properties_1.translateXProperty.name : style_properties_1.translateXProperty.keyframe] = value.xt;
                    animation.target.style[setLocal ? style_properties_1.translateYProperty.name : style_properties_1.translateYProperty.keyframe] = value.yt;
                    animation.target.style[setLocal ? style_properties_1.scaleXProperty.name : style_properties_1.scaleXProperty.keyframe] = value.xs;
                    animation.target.style[setLocal ? style_properties_1.scaleYProperty.name : style_properties_1.scaleYProperty.keyframe] = value.ys;
                };
                propertyNameToAnimate = "transform";
                value = NSValue.valueWithCATransform3D(Animation._createNativeAffineTransform(animation));
                break;
            default:
                throw new Error("Cannot animate " + animation.property);
        }
        var duration = 0.3;
        if (animation.duration !== undefined) {
            duration = animation.duration / 1000.0;
        }
        var delay = undefined;
        if (animation.delay) {
            delay = animation.delay / 1000.0;
        }
        var repeatCount = undefined;
        if (animation.iterations !== undefined) {
            if (animation.iterations === Number.POSITIVE_INFINITY) {
                repeatCount = FLT_MAX;
            }
            else {
                repeatCount = animation.iterations;
            }
        }
        return {
            propertyNameToAnimate: propertyNameToAnimate,
            fromValue: originalValue,
            toValue: value,
            duration: duration,
            repeatCount: repeatCount,
            delay: delay
        };
    };
    Animation._createNativeAnimation = function (propertyAnimations, index, playSequentially, args, animation, valueSource, finishedCallback) {
        var nativeView = animation.target.nativeViewProtected;
        var nativeAnimation = CABasicAnimation.animationWithKeyPath(args.propertyNameToAnimate);
        nativeAnimation.fromValue = args.fromValue;
        nativeAnimation.toValue = args.toValue;
        nativeAnimation.duration = args.duration;
        if (args.repeatCount !== undefined) {
            nativeAnimation.repeatCount = args.repeatCount;
        }
        if (args.delay !== undefined) {
            nativeAnimation.beginTime = CACurrentMediaTime() + args.delay;
        }
        if (animation.curve !== undefined) {
            nativeAnimation.timingFunction = animation.curve;
        }
        var animationDelegate = AnimationDelegateImpl.initWithFinishedCallback(finishedCallback, animation, valueSource);
        nativeAnimation.setValueForKey(animationDelegate, "delegate");
        nativeView.layer.addAnimationForKey(nativeAnimation, args.propertyNameToAnimate);
        var callback = undefined;
        if (index + 1 < propertyAnimations.length) {
            callback = Animation._createiOSAnimationFunction(propertyAnimations, index + 1, playSequentially, valueSource, finishedCallback);
            if (!playSequentially) {
                callback();
            }
            else {
                animationDelegate.nextAnimation = callback;
            }
        }
    };
    Animation._createNativeSpringAnimation = function (propertyAnimations, index, playSequentially, args, animation, valueSource, finishedCallback) {
        var nativeView = animation.target.nativeViewProtected;
        var callback = undefined;
        var nextAnimation;
        if (index + 1 < propertyAnimations.length) {
            callback = Animation._createiOSAnimationFunction(propertyAnimations, index + 1, playSequentially, valueSource, finishedCallback);
            if (!playSequentially) {
                callback();
            }
            else {
                nextAnimation = callback;
            }
        }
        var delay = 0;
        if (args.delay) {
            delay = args.delay;
        }
        UIView.animateWithDurationDelayUsingSpringWithDampingInitialSpringVelocityOptionsAnimationsCompletion(args.duration, delay, 0.2, 0, 196608, function () {
            if (args.repeatCount !== undefined) {
                UIView.setAnimationRepeatCount(args.repeatCount);
            }
            switch (animation.property) {
                case animation_common_1.Properties.backgroundColor:
                    animation.target.backgroundColor = args.toValue;
                    break;
                case animation_common_1.Properties.opacity:
                    animation.target.opacity = args.toValue;
                    break;
                case animation_common_1.Properties.rotate:
                    nativeView.layer.setValueForKey(args.toValue, args.propertyNameToAnimate);
                    break;
                case _transform:
                    animation._originalValue = nativeView.layer.transform;
                    nativeView.layer.setValueForKey(args.toValue, args.propertyNameToAnimate);
                    animation._propertyResetCallback = function (value) {
                        nativeView.layer.transform = value;
                    };
                    break;
            }
        }, function (finished) {
            if (finished) {
                if (animation.property === _transform) {
                    if (animation.value[animation_common_1.Properties.translate] !== undefined) {
                        animation.target.translateX = animation.value[animation_common_1.Properties.translate].x;
                        animation.target.translateY = animation.value[animation_common_1.Properties.translate].y;
                    }
                    if (animation.value[animation_common_1.Properties.scale] !== undefined) {
                        animation.target.scaleX = animation.value[animation_common_1.Properties.scale].x;
                        animation.target.scaleY = animation.value[animation_common_1.Properties.scale].y;
                    }
                }
            }
            else {
                if (animation._propertyResetCallback) {
                    animation._propertyResetCallback(animation._originalValue);
                }
            }
            if (finishedCallback) {
                var cancelled = !finished;
                finishedCallback(cancelled);
            }
            if (finished && nextAnimation) {
                nextAnimation();
            }
        });
    };
    Animation._createNativeAffineTransform = function (animation) {
        var value = animation.value;
        var result = CATransform3DIdentity;
        if (value[animation_common_1.Properties.translate] !== undefined) {
            var x = value[animation_common_1.Properties.translate].x;
            var y = value[animation_common_1.Properties.translate].y;
            result = CATransform3DTranslate(result, x, y, 0);
        }
        if (value[animation_common_1.Properties.scale] !== undefined) {
            var x = value[animation_common_1.Properties.scale].x;
            var y = value[animation_common_1.Properties.scale].y;
            result = CATransform3DScale(result, x === 0 ? 0.001 : x, y === 0 ? 0.001 : y, 1);
        }
        return result;
    };
    Animation._isAffineTransform = function (property) {
        return property === _transform
            || property === animation_common_1.Properties.translate
            || property === animation_common_1.Properties.scale;
    };
    Animation._canBeMerged = function (animation1, animation2) {
        var result = Animation._isAffineTransform(animation1.property) &&
            Animation._isAffineTransform(animation2.property) &&
            animation1.target === animation2.target &&
            animation1.duration === animation2.duration &&
            animation1.delay === animation2.delay &&
            animation1.iterations === animation2.iterations &&
            animation1.curve === animation2.curve;
        return result;
    };
    Animation._mergeAffineTransformAnimations = function (propertyAnimations) {
        var result = new Array();
        var i = 0;
        var j;
        var length = propertyAnimations.length;
        for (; i < length; i++) {
            if (propertyAnimations[i][_skip]) {
                continue;
            }
            if (!Animation._isAffineTransform(propertyAnimations[i].property)) {
                result.push(propertyAnimations[i]);
            }
            else {
                var newTransformAnimation = {
                    target: propertyAnimations[i].target,
                    property: _transform,
                    value: {},
                    duration: propertyAnimations[i].duration,
                    delay: propertyAnimations[i].delay,
                    iterations: propertyAnimations[i].iterations,
                    curve: propertyAnimations[i].curve
                };
                if (animation_common_1.traceEnabled()) {
                    animation_common_1.traceWrite("Curve: " + propertyAnimations[i].curve, animation_common_1.traceCategories.Animation);
                }
                newTransformAnimation.value[propertyAnimations[i].property] = propertyAnimations[i].value;
                if (animation_common_1.traceEnabled()) {
                    animation_common_1.traceWrite("Created new transform animation: " + Animation._getAnimationInfo(newTransformAnimation), animation_common_1.traceCategories.Animation);
                }
                j = i + 1;
                if (j < length) {
                    for (; j < length; j++) {
                        if (Animation._canBeMerged(propertyAnimations[i], propertyAnimations[j])) {
                            if (animation_common_1.traceEnabled()) {
                                animation_common_1.traceWrite("Merging animations: " + Animation._getAnimationInfo(newTransformAnimation) + " + " + Animation._getAnimationInfo(propertyAnimations[j]) + ";", animation_common_1.traceCategories.Animation);
                            }
                            newTransformAnimation.value[propertyAnimations[j].property] = propertyAnimations[j].value;
                            propertyAnimations[j][_skip] = true;
                        }
                    }
                }
                result.push(newTransformAnimation);
            }
        }
        return result;
    };
    return Animation;
}(animation_common_1.AnimationBase));
exports.Animation = Animation;
function _getTransformMismatchErrorMessage(view) {
    var result = CGAffineTransformIdentity;
    var tx = view.translateX;
    var ty = view.translateY;
    result = CGAffineTransformTranslate(result, tx, ty);
    result = CGAffineTransformRotate(result, (view.rotate || 0) * Math.PI / 180);
    result = CGAffineTransformScale(result, view.scaleX || 1, view.scaleY || 1);
    var viewTransform = NSStringFromCGAffineTransform(result);
    var nativeTransform = NSStringFromCGAffineTransform(view.nativeViewProtected.transform);
    if (viewTransform !== nativeTransform) {
        return "View and Native transforms do not match. View: " + viewTransform + "; Native: " + nativeTransform;
    }
    return undefined;
}
exports._getTransformMismatchErrorMessage = _getTransformMismatchErrorMessage;
//# sourceMappingURL=animation.ios.js.map