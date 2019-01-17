"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dialogs_1 = require("tns-core-modules/ui/dialogs");
var application_settings_1 = require("tns-core-modules/application-settings");
var admob = require("./admob/admob");
var analytics = require("./analytics/analytics");
var crashlytics = require("./crashlytics/crashlytics");
var performance = require("./performance/performance");
var storage = require("./storage/storage");
var mlkit = require("./mlkit");
var FieldValue = (function () {
    function FieldValue(type, value) {
        this.type = type;
        this.value = value;
    }
    FieldValue.serverTimestamp = function () { return "SERVER_TIMESTAMP"; };
    FieldValue.delete = function () { return "DELETE_FIELD"; };
    FieldValue.arrayUnion = function () {
        var elements = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            elements[_i] = arguments[_i];
        }
        return new FieldValue("ARRAY_UNION", elements);
    };
    FieldValue.arrayRemove = function () {
        var elements = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            elements[_i] = arguments[_i];
        }
        return new FieldValue("ARRAY_REMOVE", elements);
    };
    return FieldValue;
}());
exports.FieldValue = FieldValue;
var GeoPoint = (function () {
    function GeoPoint(latitude, longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }
    return GeoPoint;
}());
exports.GeoPoint = GeoPoint;
exports.firebase = {
    initialized: false,
    instance: null,
    firebaseRemoteConfig: null,
    currentAdditionalUserInfo: null,
    authStateListeners: [],
    _receivedNotificationCallback: null,
    _dynamicLinkCallback: null,
    admob: admob,
    analytics: analytics,
    crashlytics: crashlytics,
    performance: performance,
    storage: storage,
    mlkit: mlkit,
    firestore: {
        FieldValue: FieldValue,
        GeoPoint: function (latitude, longitude) { return new GeoPoint(latitude, longitude); }
    },
    invites: {
        MATCH_TYPE: {
            WEAK: 0,
            STRONG: 1
        }
    },
    dynamicLinks: {
        MATCH_CONFIDENCE: {
            WEAK: 0,
            STRONG: 1
        }
    },
    LoginType: {
        ANONYMOUS: "anonymous",
        PASSWORD: "password",
        PHONE: "phone",
        CUSTOM: "custom",
        FACEBOOK: "facebook",
        GOOGLE: "google",
        EMAIL_LINK: "emailLink"
    },
    LogComplexEventTypeParameter: {
        STRING: "string",
        INT: "int",
        FLOAT: "float",
        DOUBLE: "double",
        LONG: "long",
        ARRAY: "array",
        BOOLEAN: "boolean"
    },
    QueryOrderByType: {
        KEY: "key",
        VALUE: "value",
        CHILD: "child",
        PRIORITY: "priority"
    },
    QueryLimitType: {
        FIRST: "first",
        LAST: "last"
    },
    QueryRangeType: {
        START_AT: "startAt",
        END_AT: "endAt",
        EQUAL_TO: "equalTo"
    },
    addAuthStateListener: function (listener) {
        if (exports.firebase.authStateListeners.indexOf(listener) === -1) {
            exports.firebase.authStateListeners.push(listener);
        }
        return true;
    },
    removeAuthStateListener: function (listener) {
        var index = exports.firebase.authStateListeners.indexOf(listener);
        if (index >= 0) {
            exports.firebase.authStateListeners.splice(index, 1);
            return true;
        }
        else {
            return false;
        }
    },
    hasAuthStateListener: function (listener) {
        return exports.firebase.authStateListeners.indexOf(listener) >= 0;
    },
    notifyAuthStateListeners: function (data) {
        exports.firebase.authStateListeners.forEach(function (listener) {
            try {
                if (listener.thisArg) {
                    listener.onAuthStateChanged.call(listener.thisArg, data);
                }
                else if (listener.onAuthStateChanged) {
                    listener.onAuthStateChanged(data);
                }
                else {
                    listener(data);
                }
            }
            catch (ex) {
                console.error("Firebase AuthStateListener failed to trigger", listener, ex);
            }
        });
    },
    rememberEmailForEmailLinkLogin: function (email) {
        application_settings_1.setString("FirebasePlugin.EmailLinkLogin", email);
    },
    getRememberedEmailForEmailLinkLogin: function () {
        return application_settings_1.getString("FirebasePlugin.EmailLinkLogin");
    },
    strongTypeify: function (value) {
        if (value === "true") {
            value = true;
        }
        else if (value === "false") {
            value = false;
        }
        else if (parseFloat(value) === value) {
            value = parseFloat(value);
        }
        else if (parseInt(value) === value) {
            value = parseInt(value);
        }
        return value;
    },
    requestPhoneAuthVerificationCode: function (onUserResponse, verificationPrompt) {
        dialogs_1.prompt(verificationPrompt || "Verification code").then(function (promptResult) {
            if (!promptResult.result) {
                onUserResponse(undefined);
            }
            else {
                onUserResponse(promptResult.text);
            }
        });
    },
    moveLoginOptionsToObjects: function (loginOptions) {
        if (loginOptions.email) {
            console.log("Please update your code: the 'email' property is deprecated and now expected at 'passwordOptions.email'");
            if (!loginOptions.passwordOptions) {
                loginOptions.passwordOptions = {};
            }
            if (!loginOptions.passwordOptions.email) {
                loginOptions.passwordOptions.email = loginOptions.email;
            }
        }
        if (loginOptions.password) {
            console.log("Please update your code: the 'password' property is deprecated and now expected at 'passwordOptions.password'");
            if (!loginOptions.passwordOptions) {
                loginOptions.passwordOptions = {};
            }
            if (!loginOptions.passwordOptions.password) {
                loginOptions.passwordOptions.password = loginOptions.password;
            }
        }
        if (loginOptions.token) {
            console.log("Please update your code: the 'token' property is deprecated and now expected at 'customOptions.token'");
            if (!loginOptions.customOptions) {
                loginOptions.customOptions = {};
            }
            if (!loginOptions.customOptions.token) {
                loginOptions.customOptions.token = loginOptions.token;
            }
        }
        if (loginOptions.tokenProviderFn) {
            console.log("Please update your code: the 'tokenProviderFn' property is deprecated and now expected at 'customOptions.tokenProviderFn'");
            if (!loginOptions.customOptions) {
                loginOptions.customOptions = {};
            }
            if (!loginOptions.customOptions.tokenProviderFn) {
                loginOptions.customOptions.tokenProviderFn = loginOptions.tokenProviderFn;
            }
        }
        if (loginOptions.scope) {
            console.log("Please update your code: the 'scope' property is deprecated and now expected at 'facebookOptions.scope'");
            if (!loginOptions.facebookOptions) {
                loginOptions.facebookOptions = {};
            }
            if (!loginOptions.facebookOptions.scope) {
                loginOptions.facebookOptions.scope = loginOptions.scope;
            }
        }
    },
    merge: function (obj1, obj2) {
        var result = {};
        for (var i in obj1) {
            if ((i in obj2) && (typeof obj1[i] === "object") && (i !== null)) {
                result[i] = exports.firebase.merge(obj1[i], obj2[i]);
            }
            else {
                result[i] = obj1[i];
            }
        }
        for (var i in obj2) {
            if (i in result) {
                continue;
            }
            result[i] = obj2[i];
        }
        return result;
    }
};
var DocumentSnapshot = (function () {
    function DocumentSnapshot(id, exists, documentData, ref) {
        this.id = id;
        this.exists = exists;
        this.ref = ref;
        this.data = function () { return exists ? documentData : undefined; };
    }
    return DocumentSnapshot;
}());
exports.DocumentSnapshot = DocumentSnapshot;
function isDocumentReference(object) {
    return object && object.discriminator === "docRef";
}
exports.isDocumentReference = isDocumentReference;
