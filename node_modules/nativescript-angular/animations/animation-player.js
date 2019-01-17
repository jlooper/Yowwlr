Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var trace_1 = require("../trace");
var NativeScriptAnimationPlayer = /** @class */ (function () {
    function NativeScriptAnimationPlayer(target, keyframes, duration, delay, easing) {
        this.target = target;
        this.duration = duration;
        this.delay = delay;
        this.parentPlayer = null;
        this._startSubscriptions = [];
        this._doneSubscriptions = [];
        this._finished = false;
        this._started = false;
        this.initKeyframeAnimation(keyframes, duration, delay, easing);
    }
    Object.defineProperty(NativeScriptAnimationPlayer.prototype, "totalTime", {
        get: function () {
            return this.delay + this.duration;
        },
        enumerable: true,
        configurable: true
    });
    NativeScriptAnimationPlayer.prototype.init = function () {
    };
    NativeScriptAnimationPlayer.prototype.hasStarted = function () {
        return this._started;
    };
    NativeScriptAnimationPlayer.prototype.onStart = function (fn) { this._startSubscriptions.push(fn); };
    NativeScriptAnimationPlayer.prototype.onDone = function (fn) { this._doneSubscriptions.push(fn); };
    NativeScriptAnimationPlayer.prototype.onDestroy = function (fn) { this._doneSubscriptions.push(fn); };
    NativeScriptAnimationPlayer.prototype.play = function () {
        var _this = this;
        if (trace_1.isLogEnabled()) {
            trace_1.animationsLog("NativeScriptAnimationPlayer.play");
        }
        if (!this.animation) {
            return;
        }
        if (!this._started) {
            this._started = true;
            this._startSubscriptions.forEach(function (fn) { return fn(); });
            this._startSubscriptions = [];
        }
        this.animation.play(this.target)
            .then(function () { return _this.onFinish(); })
            .catch(function (_e) { });
    };
    NativeScriptAnimationPlayer.prototype.pause = function () {
    };
    NativeScriptAnimationPlayer.prototype.finish = function () {
        this.onFinish();
    };
    NativeScriptAnimationPlayer.prototype.reset = function () {
        if (trace_1.isLogEnabled()) {
            trace_1.animationsLog("NativeScriptAnimationPlayer.reset");
        }
        if (this.animation && this.animation.isPlaying) {
            this.animation.cancel();
        }
    };
    NativeScriptAnimationPlayer.prototype.restart = function () {
        if (trace_1.isLogEnabled()) {
            trace_1.animationsLog("NativeScriptAnimationPlayer.restart");
        }
        this.reset();
        this.play();
    };
    NativeScriptAnimationPlayer.prototype.destroy = function () {
        if (trace_1.isLogEnabled()) {
            trace_1.animationsLog("NativeScriptAnimationPlayer.destroy");
        }
        this.onFinish();
    };
    NativeScriptAnimationPlayer.prototype.setPosition = function (_p) {
        throw new Error("AnimationPlayer.setPosition method is not supported!");
    };
    NativeScriptAnimationPlayer.prototype.getPosition = function () {
        return 0;
    };
    NativeScriptAnimationPlayer.prototype.initKeyframeAnimation = function (keyframes, duration, delay, easing) {
        if (trace_1.isLogEnabled()) {
            trace_1.animationsLog("NativeScriptAnimationPlayer.initKeyframeAnimation");
        }
        this.animation = utils_1.createKeyframeAnimation(keyframes, duration, delay, easing);
    };
    NativeScriptAnimationPlayer.prototype.onFinish = function () {
        if (trace_1.isLogEnabled()) {
            trace_1.animationsLog("NativeScriptAnimationPlayer.onFinish");
        }
        if (this._finished) {
            return;
        }
        this._finished = true;
        this._started = false;
        this._doneSubscriptions.forEach(function (fn) { return fn(); });
        this._doneSubscriptions = [];
    };
    return NativeScriptAnimationPlayer;
}());
exports.NativeScriptAnimationPlayer = NativeScriptAnimationPlayer;
//# sourceMappingURL=animation-player.js.map