"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var firebase_common_1 = require("../firebase-common");
var appModule = require("tns-core-modules/application");
var application = require("tns-core-modules/application/application");
var _launchNotification = null;
var _senderId = null;
function getSenderId() {
    return new Promise(function (resolve, reject) {
        if (_senderId !== null) {
            resolve(_senderId);
        }
        var setSenderIdAndResolve = function () {
            var senderIdResourceId = application.android.context.getResources().getIdentifier("gcm_defaultSenderId", "string", application.android.context.getPackageName());
            if (senderIdResourceId === 0) {
                throw new Error("####################### Seems like you did not include 'google-services.json' in your project! Firebase Messaging will not work properly. #######################");
            }
            _senderId = application.android.context.getString(senderIdResourceId);
            resolve(_senderId);
        };
        if (!application.android.context) {
            appModule.on(appModule.launchEvent, function () { return setSenderIdAndResolve(); });
        }
        else {
            setSenderIdAndResolve();
        }
    });
}
function initFirebaseMessaging(options) {
    if (!options) {
        return;
    }
    if (options.onMessageReceivedCallback !== undefined) {
        addOnMessageReceivedCallback(options.onMessageReceivedCallback);
    }
    if (options.onPushTokenReceivedCallback !== undefined) {
        addOnPushTokenReceivedCallback(options.onPushTokenReceivedCallback);
    }
}
exports.initFirebaseMessaging = initFirebaseMessaging;
function onAppModuleLaunchEvent(args) {
    org.nativescript.plugins.firebase.FirebasePluginLifecycleCallbacks.registerCallbacks(appModule.android.nativeApp);
}
exports.onAppModuleLaunchEvent = onAppModuleLaunchEvent;
function onAppModuleResumeEvent(args) {
    var intent = args.android.getIntent();
    var extras = intent.getExtras();
    if (extras !== null && extras.keySet().contains("from")) {
        var result_1 = {
            foreground: false,
            data: {}
        };
        var iterator = extras.keySet().iterator();
        while (iterator.hasNext()) {
            var key = iterator.next();
            if (key !== "from" && key !== "collapse_key") {
                result_1[key] = extras.get(key);
                result_1.data[key] = extras.get(key);
            }
        }
        intent.removeExtra("from");
        if (firebase_common_1.firebase._receivedNotificationCallback === null) {
            _launchNotification = result_1;
        }
        else {
            setTimeout(function () {
                firebase_common_1.firebase._receivedNotificationCallback(result_1);
            });
        }
    }
}
exports.onAppModuleResumeEvent = onAppModuleResumeEvent;
function registerForInteractivePush(model) {
    console.log("'registerForInteractivePush' is not currently implemented on Android");
}
exports.registerForInteractivePush = registerForInteractivePush;
function getCurrentPushToken() {
    return new Promise(function (resolve, reject) {
        try {
            if (typeof (com.google.firebase.messaging || com.google.firebase.iid) === "undefined") {
                reject("Uncomment firebase-messaging in the plugin's include.gradle first");
                return;
            }
            getSenderId().then(function (senderId) {
                org.nativescript.plugins.firebase.FirebasePlugin.getCurrentPushToken(senderId, new org.nativescript.plugins.firebase.FirebasePluginListener({
                    success: function (token) { return resolve(token); },
                    error: function (err) { return reject(err); }
                }));
            });
        }
        catch (ex) {
            console.log("Error in messaging.getCurrentPushToken: " + ex);
            reject(ex);
        }
    });
}
exports.getCurrentPushToken = getCurrentPushToken;
function addOnMessageReceivedCallback(callback) {
    return new Promise(function (resolve, reject) {
        try {
            firebase_common_1.firebase._receivedNotificationCallback = callback;
            org.nativescript.plugins.firebase.FirebasePlugin.setOnNotificationReceivedCallback(new org.nativescript.plugins.firebase.FirebasePluginListener({
                success: function (notification) { return callback(JSON.parse(notification)); }
            }));
            if (_launchNotification !== null) {
                callback(_launchNotification);
                _launchNotification = null;
            }
            resolve();
        }
        catch (ex) {
            console.log("Error in messaging.addOnMessageReceivedCallback: " + ex);
            reject(ex);
        }
    });
}
exports.addOnMessageReceivedCallback = addOnMessageReceivedCallback;
function addOnPushTokenReceivedCallback(callback) {
    return new Promise(function (resolve, reject) {
        try {
            org.nativescript.plugins.firebase.FirebasePlugin.setOnPushTokenReceivedCallback(new org.nativescript.plugins.firebase.FirebasePluginListener({
                success: function (token) { return callback(token); },
                error: function (err) { return console.log("addOnPushTokenReceivedCallback error: " + err); }
            }));
            resolve();
        }
        catch (ex) {
            console.log("Error in messaging.addOnPushTokenReceivedCallback: " + ex);
            reject(ex);
        }
    });
}
exports.addOnPushTokenReceivedCallback = addOnPushTokenReceivedCallback;
function registerForPushNotifications(options) {
    return new Promise(function (resolve, reject) {
        try {
            if (typeof (com.google.firebase.messaging) === "undefined") {
                reject("Uncomment firebase-messaging in the plugin's include.gradle first");
                return;
            }
            initFirebaseMessaging(options);
            getSenderId().then(function (senderId) { return org.nativescript.plugins.firebase.FirebasePlugin.registerForPushNotifications(senderId); });
        }
        catch (ex) {
            console.log("Error in messaging.registerForPushNotifications: " + ex);
            reject(ex);
        }
    });
}
exports.registerForPushNotifications = registerForPushNotifications;
function unregisterForPushNotifications() {
    return new Promise(function (resolve, reject) {
        try {
            if (typeof (com.google.firebase.messaging) === "undefined") {
                reject("Uncomment firebase-messaging in the plugin's include.gradle first");
                return;
            }
            getSenderId().then(function (senderId) { return org.nativescript.plugins.firebase.FirebasePlugin.unregisterForPushNotifications(senderId); });
            resolve();
        }
        catch (ex) {
            console.log("Error in messaging.unregisterForPushNotifications: " + ex);
            reject(ex);
        }
    });
}
exports.unregisterForPushNotifications = unregisterForPushNotifications;
function subscribeToTopic(topicName) {
    return new Promise(function (resolve, reject) {
        try {
            if (typeof (com.google.firebase.messaging) === "undefined") {
                reject("Uncomment firebase-messaging in the plugin's include.gradle first");
                return;
            }
            var onCompleteListener = new com.google.android.gms.tasks.OnCompleteListener({
                onComplete: function (task) { return task.isSuccessful() ? resolve() : reject(task.getException() && task.getException().getReason ? task.getException().getReason() : task.getException()); }
            });
            com.google.firebase.messaging.FirebaseMessaging.getInstance()
                .subscribeToTopic(topicName)
                .addOnCompleteListener(onCompleteListener);
        }
        catch (ex) {
            console.log("Error in messaging.subscribeToTopic: " + ex);
            reject(ex);
        }
    });
}
exports.subscribeToTopic = subscribeToTopic;
function unsubscribeFromTopic(topicName) {
    return new Promise(function (resolve, reject) {
        try {
            if (typeof (com.google.firebase.messaging) === "undefined") {
                reject("Uncomment firebase-messaging in the plugin's include.gradle first");
                return;
            }
            var onCompleteListener = new com.google.android.gms.tasks.OnCompleteListener({
                onComplete: function (task) { return task.isSuccessful() ? resolve() : reject(task.getException() && task.getException().getReason ? task.getException().getReason() : task.getException()); }
            });
            com.google.firebase.messaging.FirebaseMessaging.getInstance()
                .unsubscribeFromTopic(topicName)
                .addOnCompleteListener(onCompleteListener);
        }
        catch (ex) {
            console.log("Error in messaging.unsubscribeFromTopic: " + ex);
            reject(ex);
        }
    });
}
exports.unsubscribeFromTopic = unsubscribeFromTopic;
function areNotificationsEnabled() {
    var androidSdkVersion = android.os.Build.VERSION.SDK_INT;
    if (androidSdkVersion >= 24) {
        return android.support.v4.app.NotificationManagerCompat.from(application.android.context).areNotificationsEnabled();
    }
    else {
        console.log("NotificationManagerCompat.areNotificationsEnabled() is not supported in Android SDK VERSION " + androidSdkVersion);
        return true;
    }
}
exports.areNotificationsEnabled = areNotificationsEnabled;
