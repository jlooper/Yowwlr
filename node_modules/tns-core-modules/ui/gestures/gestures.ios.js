function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var gestures_common_1 = require("./gestures-common");
var utils_1 = require("../../utils/utils");
var getter = utils_1.ios.getter;
__export(require("./gestures-common"));
function observe(target, type, callback, context) {
    var observer = new GesturesObserver(target, callback, context);
    observer.observe(type);
    return observer;
}
exports.observe = observe;
var UIGestureRecognizerDelegateImpl = (function (_super) {
    __extends(UIGestureRecognizerDelegateImpl, _super);
    function UIGestureRecognizerDelegateImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UIGestureRecognizerDelegateImpl.prototype.gestureRecognizerShouldRecognizeSimultaneouslyWithGestureRecognizer = function (gestureRecognizer, otherGestureRecognizer) {
        return true;
    };
    UIGestureRecognizerDelegateImpl.ObjCProtocols = [UIGestureRecognizerDelegate];
    return UIGestureRecognizerDelegateImpl;
}(NSObject));
var recognizerDelegateInstance = UIGestureRecognizerDelegateImpl.new();
var UIGestureRecognizerImpl = (function (_super) {
    __extends(UIGestureRecognizerImpl, _super);
    function UIGestureRecognizerImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UIGestureRecognizerImpl.initWithOwnerTypeCallback = function (owner, type, callback, thisArg) {
        var handler = UIGestureRecognizerImpl.new();
        handler._owner = owner;
        handler._type = type;
        if (callback) {
            handler._callback = callback;
        }
        if (thisArg) {
            handler._context = thisArg;
        }
        return handler;
    };
    UIGestureRecognizerImpl.prototype.recognize = function (recognizer) {
        var owner = this._owner.get();
        var callback = this._callback ? this._callback : (owner ? owner.callback : null);
        var typeParam = this._type;
        var target = owner ? owner.target : undefined;
        var args = {
            type: typeParam,
            view: target,
            ios: recognizer,
            android: undefined,
            object: target,
            eventName: gestures_common_1.toString(typeParam),
        };
        if (callback) {
            callback.call(this._context, args);
        }
    };
    UIGestureRecognizerImpl.ObjCExposedMethods = {
        "recognize": { returns: interop.types.void, params: [UIGestureRecognizer] }
    };
    return UIGestureRecognizerImpl;
}(NSObject));
var GesturesObserver = (function (_super) {
    __extends(GesturesObserver, _super);
    function GesturesObserver(target, callback, context) {
        var _this = _super.call(this, target, callback, context) || this;
        _this._recognizers = {};
        return _this;
    }
    GesturesObserver.prototype.androidOnTouchEvent = function (motionEvent) {
    };
    GesturesObserver.prototype.observe = function (type) {
        var _this = this;
        if (this.target) {
            this.type = type;
            this._onTargetLoaded = function (args) {
                _this._attach(_this.target, type);
            };
            this._onTargetUnloaded = function (args) {
                _this._detach();
            };
            this.target.on("loaded", this._onTargetLoaded);
            this.target.on("unloaded", this._onTargetUnloaded);
            if (this.target.isLoaded) {
                this._attach(this.target, type);
            }
        }
    };
    GesturesObserver.prototype._attach = function (target, type) {
        var _this = this;
        this._detach();
        if (target && target.nativeViewProtected && target.nativeViewProtected.addGestureRecognizer) {
            var nativeView = target.nativeViewProtected;
            if (type & gestures_common_1.GestureTypes.tap) {
                nativeView.addGestureRecognizer(this._createRecognizer(gestures_common_1.GestureTypes.tap));
            }
            if (type & gestures_common_1.GestureTypes.doubleTap) {
                var r = this._createRecognizer(gestures_common_1.GestureTypes.doubleTap);
                r.numberOfTapsRequired = 2;
                nativeView.addGestureRecognizer(r);
            }
            if (type & gestures_common_1.GestureTypes.pinch) {
                nativeView.addGestureRecognizer(this._createRecognizer(gestures_common_1.GestureTypes.pinch, function (args) {
                    _this._executeCallback(_getPinchData(args));
                }));
            }
            if (type & gestures_common_1.GestureTypes.pan) {
                nativeView.addGestureRecognizer(this._createRecognizer(gestures_common_1.GestureTypes.pan, function (args) {
                    _this._executeCallback(_getPanData(args, target.nativeViewProtected));
                }));
            }
            if (type & gestures_common_1.GestureTypes.swipe) {
                nativeView.addGestureRecognizer(this._createRecognizer(gestures_common_1.GestureTypes.swipe, function (args) {
                    _this._executeCallback(_getSwipeData(args));
                }, 8));
                nativeView.addGestureRecognizer(this._createRecognizer(gestures_common_1.GestureTypes.swipe, function (args) {
                    _this._executeCallback(_getSwipeData(args));
                }, 2));
                nativeView.addGestureRecognizer(this._createRecognizer(gestures_common_1.GestureTypes.swipe, function (args) {
                    _this._executeCallback(_getSwipeData(args));
                }, 1));
                nativeView.addGestureRecognizer(this._createRecognizer(gestures_common_1.GestureTypes.swipe, function (args) {
                    _this._executeCallback(_getSwipeData(args));
                }, 4));
            }
            if (type & gestures_common_1.GestureTypes.rotation) {
                nativeView.addGestureRecognizer(this._createRecognizer(gestures_common_1.GestureTypes.rotation, function (args) {
                    _this._executeCallback(_getRotationData(args));
                }));
            }
            if (type & gestures_common_1.GestureTypes.longPress) {
                nativeView.addGestureRecognizer(this._createRecognizer(gestures_common_1.GestureTypes.longPress));
            }
            if (type & gestures_common_1.GestureTypes.touch) {
                nativeView.addGestureRecognizer(this._createRecognizer(gestures_common_1.GestureTypes.touch));
            }
        }
    };
    GesturesObserver.prototype._detach = function () {
        if (this.target && this.target.nativeViewProtected) {
            for (var name_1 in this._recognizers) {
                if (this._recognizers.hasOwnProperty(name_1)) {
                    var item = this._recognizers[name_1];
                    this.target.nativeViewProtected.removeGestureRecognizer(item.recognizer);
                    item.recognizer = null;
                    item.target = null;
                }
            }
            this._recognizers = {};
        }
    };
    GesturesObserver.prototype.disconnect = function () {
        this._detach();
        if (this.target) {
            this.target.off("loaded", this._onTargetLoaded);
            this.target.off("unloaded", this._onTargetUnloaded);
            this._onTargetLoaded = null;
            this._onTargetUnloaded = null;
        }
        _super.prototype.disconnect.call(this);
    };
    GesturesObserver.prototype._executeCallback = function (args) {
        if (this.callback) {
            this.callback.call(this.context, args);
        }
    };
    GesturesObserver.prototype._createRecognizer = function (type, callback, swipeDirection) {
        var recognizer;
        var name = gestures_common_1.toString(type);
        var target = _createUIGestureRecognizerTarget(this, type, callback, this.context);
        var recognizerType = _getUIGestureRecognizerType(type);
        if (recognizerType) {
            recognizer = recognizerType.alloc().initWithTargetAction(target, "recognize");
            if (type === gestures_common_1.GestureTypes.swipe && swipeDirection) {
                name = name + swipeDirection.toString();
                recognizer.direction = swipeDirection;
            }
            else if (type === gestures_common_1.GestureTypes.touch) {
                recognizer.observer = this;
            }
            if (recognizer) {
                recognizer.delegate = recognizerDelegateInstance;
                this._recognizers[name] = { recognizer: recognizer, target: target };
            }
        }
        return recognizer;
    };
    return GesturesObserver;
}(gestures_common_1.GesturesObserverBase));
exports.GesturesObserver = GesturesObserver;
function _createUIGestureRecognizerTarget(owner, type, callback, context) {
    return UIGestureRecognizerImpl.initWithOwnerTypeCallback(new WeakRef(owner), type, callback, context);
}
function _getUIGestureRecognizerType(type) {
    var nativeType = null;
    if (type === gestures_common_1.GestureTypes.tap) {
        nativeType = UITapGestureRecognizer;
    }
    else if (type === gestures_common_1.GestureTypes.doubleTap) {
        nativeType = UITapGestureRecognizer;
    }
    else if (type === gestures_common_1.GestureTypes.pinch) {
        nativeType = UIPinchGestureRecognizer;
    }
    else if (type === gestures_common_1.GestureTypes.pan) {
        nativeType = UIPanGestureRecognizer;
    }
    else if (type === gestures_common_1.GestureTypes.swipe) {
        nativeType = UISwipeGestureRecognizer;
    }
    else if (type === gestures_common_1.GestureTypes.rotation) {
        nativeType = UIRotationGestureRecognizer;
    }
    else if (type === gestures_common_1.GestureTypes.longPress) {
        nativeType = UILongPressGestureRecognizer;
    }
    else if (type === gestures_common_1.GestureTypes.touch) {
        nativeType = TouchGestureRecognizer;
    }
    return nativeType;
}
function getState(recognizer) {
    if (recognizer.state === 1) {
        return gestures_common_1.GestureStateTypes.began;
    }
    else if (recognizer.state === 4) {
        return gestures_common_1.GestureStateTypes.cancelled;
    }
    else if (recognizer.state === 2) {
        return gestures_common_1.GestureStateTypes.changed;
    }
    else if (recognizer.state === 3) {
        return gestures_common_1.GestureStateTypes.ended;
    }
}
function _getSwipeDirection(direction) {
    if (direction === 8) {
        return gestures_common_1.SwipeDirection.down;
    }
    else if (direction === 2) {
        return gestures_common_1.SwipeDirection.left;
    }
    else if (direction === 1) {
        return gestures_common_1.SwipeDirection.right;
    }
    else if (direction === 4) {
        return gestures_common_1.SwipeDirection.up;
    }
}
function _getPinchData(args) {
    var recognizer = args.ios;
    var center = recognizer.locationInView(args.view.nativeViewProtected);
    return {
        type: args.type,
        view: args.view,
        ios: args.ios,
        android: undefined,
        scale: recognizer.scale,
        getFocusX: function () { return center.x; },
        getFocusY: function () { return center.y; },
        object: args.view,
        eventName: gestures_common_1.toString(args.type),
        state: getState(recognizer)
    };
}
function _getSwipeData(args) {
    var recognizer = args.ios;
    return {
        type: args.type,
        view: args.view,
        ios: args.ios,
        android: undefined,
        direction: _getSwipeDirection(recognizer.direction),
        object: args.view,
        eventName: gestures_common_1.toString(args.type),
    };
}
function _getPanData(args, view) {
    var recognizer = args.ios;
    return {
        type: args.type,
        view: args.view,
        ios: args.ios,
        android: undefined,
        deltaX: recognizer.translationInView(view).x,
        deltaY: recognizer.translationInView(view).y,
        object: args.view,
        eventName: gestures_common_1.toString(args.type),
        state: getState(recognizer)
    };
}
function _getRotationData(args) {
    var recognizer = args.ios;
    return {
        type: args.type,
        view: args.view,
        ios: args.ios,
        android: undefined,
        rotation: recognizer.rotation * (180.0 / Math.PI),
        object: args.view,
        eventName: gestures_common_1.toString(args.type),
        state: getState(recognizer)
    };
}
var TouchGestureRecognizer = (function (_super) {
    __extends(TouchGestureRecognizer, _super);
    function TouchGestureRecognizer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TouchGestureRecognizer.prototype.touchesBeganWithEvent = function (touches, event) {
        this.executeCallback(gestures_common_1.TouchAction.down, touches, event);
        this.view.touchesBeganWithEvent(touches, event);
    };
    TouchGestureRecognizer.prototype.touchesMovedWithEvent = function (touches, event) {
        this.executeCallback(gestures_common_1.TouchAction.move, touches, event);
        this.view.touchesMovedWithEvent(touches, event);
    };
    TouchGestureRecognizer.prototype.touchesEndedWithEvent = function (touches, event) {
        this.executeCallback(gestures_common_1.TouchAction.up, touches, event);
        this.view.touchesEndedWithEvent(touches, event);
    };
    TouchGestureRecognizer.prototype.touchesCancelledWithEvent = function (touches, event) {
        this.executeCallback(gestures_common_1.TouchAction.cancel, touches, event);
        this.view.touchesCancelledWithEvent(touches, event);
    };
    TouchGestureRecognizer.prototype.executeCallback = function (action, touches, event) {
        if (!this._eventData) {
            this._eventData = new TouchGestureEventData();
        }
        this._eventData.prepare(this.observer.target, action, touches, event);
        this.observer._executeCallback(this._eventData);
    };
    return TouchGestureRecognizer;
}(UIGestureRecognizer));
var Pointer = (function () {
    function Pointer(touch, targetView) {
        this.android = undefined;
        this.ios = undefined;
        this.ios = touch;
        this._view = targetView;
    }
    Object.defineProperty(Pointer.prototype, "location", {
        get: function () {
            if (!this._location) {
                this._location = this.ios.locationInView(this._view.nativeViewProtected);
            }
            return this._location;
        },
        enumerable: true,
        configurable: true
    });
    Pointer.prototype.getX = function () {
        return this.location.x;
    };
    Pointer.prototype.getY = function () {
        return this.location.y;
    };
    return Pointer;
}());
var TouchGestureEventData = (function () {
    function TouchGestureEventData() {
        this.eventName = gestures_common_1.toString(gestures_common_1.GestureTypes.touch);
        this.type = gestures_common_1.GestureTypes.touch;
        this.android = undefined;
    }
    TouchGestureEventData.prototype.prepare = function (view, action, touches, event) {
        this.action = action;
        this.view = view;
        this.object = view;
        this.ios = {
            touches: touches,
            event: event
        };
        this._mainPointer = undefined;
        this._activePointers = undefined;
        this._allPointers = undefined;
    };
    TouchGestureEventData.prototype.getPointerCount = function () {
        return getter(this.ios.event, this.ios.event.allTouches).count;
    };
    TouchGestureEventData.prototype.getMainPointer = function () {
        if (this._mainPointer === undefined) {
            this._mainPointer = this.ios.touches.anyObject();
        }
        return this._mainPointer;
    };
    TouchGestureEventData.prototype.getActivePointers = function () {
        if (!this._activePointers) {
            this._activePointers = [];
            for (var i = 0, nsArr = this.ios.touches.allObjects; i < nsArr.count; i++) {
                this._activePointers.push(new Pointer(nsArr.objectAtIndex(i), this.view));
            }
        }
        return this._activePointers;
    };
    TouchGestureEventData.prototype.getAllPointers = function () {
        if (!this._allPointers) {
            this._allPointers = [];
            var nsArr = getter(this.ios.event, this.ios.event.allTouches).allObjects;
            for (var i = 0; i < nsArr.count; i++) {
                this._allPointers.push(new Pointer(nsArr.objectAtIndex(i), this.view));
            }
        }
        return this._allPointers;
    };
    TouchGestureEventData.prototype.getX = function () {
        return this.getMainPointer().locationInView(this.view.nativeViewProtected).x;
    };
    TouchGestureEventData.prototype.getY = function () {
        return this.getMainPointer().locationInView(this.view.nativeViewProtected).y;
    };
    return TouchGestureEventData;
}());
//# sourceMappingURL=gestures.ios.js.map