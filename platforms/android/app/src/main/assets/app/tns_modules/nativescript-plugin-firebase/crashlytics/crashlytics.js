"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sendCrashLog(exception) {
    if (isCrashlyticsAvailable()) {
        com.crashlytics.android.Crashlytics.logException(exception);
    }
}
exports.sendCrashLog = sendCrashLog;
function log(priority, tag, msg) {
    if (isCrashlyticsAvailable()) {
        com.crashlytics.android.Crashlytics.log(priority, tag, msg);
    }
}
exports.log = log;
function setString(key, value) {
    if (isCrashlyticsAvailable()) {
        com.crashlytics.android.Crashlytics.setString(key, value);
    }
}
exports.setString = setString;
function setBool(key, value) {
    if (isCrashlyticsAvailable()) {
        com.crashlytics.android.Crashlytics.setBool(key, value);
    }
}
exports.setBool = setBool;
function setFloat(key, value) {
    if (isCrashlyticsAvailable()) {
        com.crashlytics.android.Crashlytics.setFloat(key, value);
    }
}
exports.setFloat = setFloat;
function setInt(key, value) {
    if (isCrashlyticsAvailable()) {
        com.crashlytics.android.Crashlytics.setInt(key, value);
    }
}
exports.setInt = setInt;
function setDouble(key, value) {
    if (isCrashlyticsAvailable()) {
        com.crashlytics.android.Crashlytics.setDouble(key, value);
    }
}
exports.setDouble = setDouble;
function setUserId(id) {
    if (isCrashlyticsAvailable()) {
        com.crashlytics.android.Crashlytics.setUserIdentifier(id);
    }
}
exports.setUserId = setUserId;
function isCrashlyticsAvailable() {
    if (typeof (com.crashlytics) === "undefined" || typeof (com.crashlytics.android.Crashlytics) === "undefined") {
        console.log("Add 'crashlytics: true' to firebase.nativescript.json and remove the platforms folder");
        return false;
    }
    return true;
}
