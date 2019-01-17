"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var firebase = require("../../firebase");
var functions;
(function (functions) {
    var Functions = (function () {
        function Functions() {
        }
        Functions.prototype.httpsCallable = function (functionName) {
            return firebase.functions.httpsCallable(functionName);
        };
        return Functions;
    }());
    functions.Functions = Functions;
})(functions = exports.functions || (exports.functions = {}));
