"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var firebase_common_1 = require("../firebase-common");
function httpsCallable(functionName) {
    var instance = com.google.firebase.functions.FirebaseFunctions.getInstance();
    return function (data) { return new Promise(function (resolve, reject) {
        var actData = firebase_common_1.firebase.toValue(data);
        return instance.getHttpsCallable(functionName)
            .call(actData)
            .continueWith(new com.google.android.gms.tasks.Continuation({
            then: function (task) {
                try {
                    var result = task.getResult();
                    var resultData = result.getData();
                    resolve(firebase_common_1.firebase.toJsObject(resultData));
                }
                catch (e) {
                    console.log('Error Caught:', e);
                    reject(e.message);
                }
            }
        }));
    }); };
}
exports.httpsCallable = httpsCallable;
