function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var application_common_1 = require("./application-common");
var profiling_1 = require("../profiling");
__export(require("./application-common"));
var ActivityCreated = "activityCreated";
var ActivityDestroyed = "activityDestroyed";
var ActivityStarted = "activityStarted";
var ActivityPaused = "activityPaused";
var ActivityResumed = "activityResumed";
var ActivityStopped = "activityStopped";
var SaveActivityState = "saveActivityState";
var ActivityResult = "activityResult";
var ActivityBackPressed = "activityBackPressed";
var ActivityRequestPermissions = "activityRequestPermissions";
var AndroidApplication = (function (_super) {
    __extends(AndroidApplication, _super);
    function AndroidApplication() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.callbacks = {};
        _this._registeredReceivers = {};
        _this._pendingReceiverRegistrations = new Array();
        return _this;
    }
    Object.defineProperty(AndroidApplication.prototype, "currentContext", {
        get: function () {
            return this.foregroundActivity;
        },
        enumerable: true,
        configurable: true
    });
    AndroidApplication.prototype.init = function (nativeApp) {
        if (this.nativeApp === nativeApp) {
            return;
        }
        if (this.nativeApp) {
            throw new Error("application.android already initialized.");
        }
        this.nativeApp = nativeApp;
        this.packageName = nativeApp.getPackageName();
        this.context = nativeApp.getApplicationContext();
        this.callbacks.lifecycleCallbacks = initLifecycleCallbacks();
        this.callbacks.componentCallbacks = initComponentCallbacks();
        this.nativeApp.registerActivityLifecycleCallbacks(this.callbacks.lifecycleCallbacks);
        this.nativeApp.registerComponentCallbacks(this.callbacks.componentCallbacks);
        this._registerPendingReceivers();
    };
    AndroidApplication.prototype._registerPendingReceivers = function () {
        var _this = this;
        this._pendingReceiverRegistrations.forEach(function (func) { return func(_this.context); });
        this._pendingReceiverRegistrations.length = 0;
    };
    AndroidApplication.prototype.registerBroadcastReceiver = function (intentFilter, onReceiveCallback) {
        ensureBroadCastReceiverClass();
        var that = this;
        var registerFunc = function (context) {
            var receiver = new BroadcastReceiverClass(onReceiveCallback);
            context.registerReceiver(receiver, new android.content.IntentFilter(intentFilter));
            that._registeredReceivers[intentFilter] = receiver;
        };
        if (this.context) {
            registerFunc(this.context);
        }
        else {
            this._pendingReceiverRegistrations.push(registerFunc);
        }
    };
    AndroidApplication.prototype.unregisterBroadcastReceiver = function (intentFilter) {
        var receiver = this._registeredReceivers[intentFilter];
        if (receiver) {
            this.context.unregisterReceiver(receiver);
            this._registeredReceivers[intentFilter] = undefined;
            delete this._registeredReceivers[intentFilter];
        }
    };
    AndroidApplication.activityCreatedEvent = ActivityCreated;
    AndroidApplication.activityDestroyedEvent = ActivityDestroyed;
    AndroidApplication.activityStartedEvent = ActivityStarted;
    AndroidApplication.activityPausedEvent = ActivityPaused;
    AndroidApplication.activityResumedEvent = ActivityResumed;
    AndroidApplication.activityStoppedEvent = ActivityStopped;
    AndroidApplication.saveActivityStateEvent = SaveActivityState;
    AndroidApplication.activityResultEvent = ActivityResult;
    AndroidApplication.activityBackPressedEvent = ActivityBackPressed;
    AndroidApplication.activityRequestPermissionsEvent = ActivityRequestPermissions;
    return AndroidApplication;
}(application_common_1.Observable));
exports.AndroidApplication = AndroidApplication;
var androidApp = new AndroidApplication();
exports.android = androidApp;
application_common_1.setApplication(androidApp);
var mainEntry;
var started = false;
var createRootFrame = { value: true };
function start(entry) {
    if (started) {
        throw new Error("Application is already started.");
    }
    started = true;
    mainEntry = typeof entry === "string" ? { moduleName: entry } : entry;
    if (!androidApp.nativeApp) {
        var nativeApp = getNativeApplication();
        androidApp.init(nativeApp);
    }
}
exports.start = start;
function shouldCreateRootFrame() {
    return createRootFrame.value;
}
exports.shouldCreateRootFrame = shouldCreateRootFrame;
function run(entry) {
    createRootFrame.value = false;
    start(entry);
}
exports.run = run;
var CALLBACKS = "_callbacks";
function _resetRootView(entry) {
    var activity = androidApp.foregroundActivity;
    if (!activity) {
        throw new Error("Cannot find android activity.");
    }
    createRootFrame.value = false;
    mainEntry = typeof entry === "string" ? { moduleName: entry } : entry;
    var callbacks = activity[CALLBACKS];
    callbacks.resetActivityContent(activity);
}
exports._resetRootView = _resetRootView;
function getMainEntry() {
    return mainEntry;
}
exports.getMainEntry = getMainEntry;
function getRootView() {
    var activity = androidApp.foregroundActivity || androidApp.startActivity;
    if (!activity) {
        return undefined;
    }
    var callbacks = activity[CALLBACKS];
    return callbacks ? callbacks.getRootView() : undefined;
}
exports.getRootView = getRootView;
function getNativeApplication() {
    var nativeApp = androidApp.nativeApp;
    if (!nativeApp) {
        if (!nativeApp && com.tns.NativeScriptApplication) {
            nativeApp = com.tns.NativeScriptApplication.getInstance();
        }
        if (!nativeApp) {
            var clazz = java.lang.Class.forName("android.app.ActivityThread");
            if (clazz) {
                var method = clazz.getMethod("currentApplication", null);
                if (method) {
                    nativeApp = method.invoke(null, null);
                }
            }
        }
        if (!nativeApp) {
            throw new Error("Failed to retrieve native Android Application object. If you have a custom android.app.Application type implemented make sure that you've called the '<application-module>.android.init' method.");
        }
    }
    return nativeApp;
}
exports.getNativeApplication = getNativeApplication;
global.__onLiveSync = function () {
    if (androidApp && androidApp.paused) {
        return;
    }
    application_common_1.livesync();
};
function initLifecycleCallbacks() {
    var setThemeOnLaunch = profiling_1.profile("setThemeOnLaunch", function (activity) {
        var activityInfo = activity.getPackageManager().getActivityInfo(activity.getComponentName(), android.content.pm.PackageManager.GET_META_DATA);
        if (activityInfo.metaData) {
            var setThemeOnLaunch_1 = activityInfo.metaData.getInt("SET_THEME_ON_LAUNCH", -1);
            if (setThemeOnLaunch_1 !== -1) {
                activity.setTheme(setThemeOnLaunch_1);
            }
        }
    });
    var notifyActivityCreated = profiling_1.profile("notifyActivityCreated", function (activity, savedInstanceState) {
        androidApp.notify({ eventName: ActivityCreated, object: androidApp, activity: activity, bundle: savedInstanceState });
    });
    var subscribeForGlobalLayout = profiling_1.profile("subscribeForGlobalLayout", function (activity) {
        var rootView = activity.getWindow().getDecorView().getRootView();
        this.onGlobalLayoutListener = new android.view.ViewTreeObserver.OnGlobalLayoutListener({
            onGlobalLayout: function () {
                application_common_1.notify({ eventName: application_common_1.displayedEvent, object: androidApp, activity: activity });
                var viewTreeObserver = rootView.getViewTreeObserver();
                viewTreeObserver.removeOnGlobalLayoutListener(this.onGlobalLayoutListener);
            }
        });
        rootView.getViewTreeObserver().addOnGlobalLayoutListener(this.onGlobalLayoutListener);
    });
    var lifecycleCallbacks = new android.app.Application.ActivityLifecycleCallbacks({
        onActivityCreated: profiling_1.profile("onActivityCreated", function (activity, savedInstanceState) {
            setThemeOnLaunch(activity);
            if (!androidApp.startActivity) {
                androidApp.startActivity = activity;
            }
            notifyActivityCreated(activity, savedInstanceState);
            if (application_common_1.hasListeners(application_common_1.displayedEvent)) {
                subscribeForGlobalLayout(activity);
            }
        }),
        onActivityDestroyed: profiling_1.profile("onActivityDestroyed", function (activity) {
            if (activity === androidApp.foregroundActivity) {
                androidApp.foregroundActivity = undefined;
            }
            if (activity === androidApp.startActivity) {
                androidApp.startActivity = undefined;
            }
            androidApp.notify({ eventName: ActivityDestroyed, object: androidApp, activity: activity });
            gc();
        }),
        onActivityPaused: profiling_1.profile("onActivityPaused", function (activity) {
            if (activity.isNativeScriptActivity) {
                androidApp.paused = true;
                application_common_1.notify({ eventName: application_common_1.suspendEvent, object: androidApp, android: activity });
            }
            androidApp.notify({ eventName: ActivityPaused, object: androidApp, activity: activity });
        }),
        onActivityResumed: profiling_1.profile("onActivityResumed", function (activity) {
            androidApp.foregroundActivity = activity;
            if (activity.isNativeScriptActivity) {
                application_common_1.notify({ eventName: application_common_1.resumeEvent, object: androidApp, android: activity });
                androidApp.paused = false;
            }
            androidApp.notify({ eventName: ActivityResumed, object: androidApp, activity: activity });
        }),
        onActivitySaveInstanceState: profiling_1.profile("onActivityResumed", function (activity, outState) {
            androidApp.notify({ eventName: SaveActivityState, object: androidApp, activity: activity, bundle: outState });
        }),
        onActivityStarted: profiling_1.profile("onActivityStarted", function (activity) {
            androidApp.notify({ eventName: ActivityStarted, object: androidApp, activity: activity });
        }),
        onActivityStopped: profiling_1.profile("onActivityStopped", function (activity) {
            androidApp.notify({ eventName: ActivityStopped, object: androidApp, activity: activity });
        })
    });
    return lifecycleCallbacks;
}
var currentOrientation;
function initComponentCallbacks() {
    var componentCallbacks = new android.content.ComponentCallbacks2({
        onLowMemory: profiling_1.profile("onLowMemory", function () {
            gc();
            java.lang.System.gc();
            application_common_1.notify({ eventName: application_common_1.lowMemoryEvent, object: this, android: this });
        }),
        onTrimMemory: profiling_1.profile("onTrimMemory", function (level) {
        }),
        onConfigurationChanged: profiling_1.profile("onConfigurationChanged", function (newConfig) {
            var newOrientation = newConfig.orientation;
            if (newOrientation === currentOrientation) {
                return;
            }
            currentOrientation = newOrientation;
            var newValue;
            switch (newOrientation) {
                case android.content.res.Configuration.ORIENTATION_LANDSCAPE:
                    newValue = "landscape";
                    break;
                case android.content.res.Configuration.ORIENTATION_PORTRAIT:
                    newValue = "portrait";
                    break;
                default:
                    newValue = "unknown";
                    break;
            }
            application_common_1.notify({
                eventName: application_common_1.orientationChangedEvent,
                android: androidApp.nativeApp,
                newValue: newValue,
                object: androidApp
            });
        })
    });
    return componentCallbacks;
}
var BroadcastReceiverClass;
function ensureBroadCastReceiverClass() {
    if (BroadcastReceiverClass) {
        return;
    }
    var BroadcastReceiver = (function (_super) {
        __extends(BroadcastReceiver, _super);
        function BroadcastReceiver(onReceiveCallback) {
            var _this = _super.call(this) || this;
            _this._onReceiveCallback = onReceiveCallback;
            return global.__native(_this);
        }
        BroadcastReceiver.prototype.onReceive = function (context, intent) {
            if (this._onReceiveCallback) {
                this._onReceiveCallback(context, intent);
            }
        };
        return BroadcastReceiver;
    }(android.content.BroadcastReceiver));
    BroadcastReceiverClass = BroadcastReceiver;
}
//# sourceMappingURL=application.android.js.map