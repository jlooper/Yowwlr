"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var firebase = require("../../firebase");
var firestore;
(function (firestore) {
    var Firestore = (function () {
        function Firestore() {
        }
        Firestore.prototype.collection = function (collectionPath) {
            return firebase.firestore.collection(collectionPath);
        };
        Firestore.prototype.doc = function (path) {
            return firebase.firestore.docRef(path);
        };
        Firestore.prototype.FieldValue = function () {
            return {
                type: undefined,
                value: undefined,
                serverTimestamp: function () { return "SERVER_TIMESTAMP"; },
                delete: function () { return "DELETE_FIELD"; },
                arrayUnion: function () {
                    var elements = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        elements[_i] = arguments[_i];
                    }
                    return new firebase.firestore.FieldValue("ARRAY_UNION", elements);
                },
                arrayRemove: function () {
                    var elements = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        elements[_i] = arguments[_i];
                    }
                    return new firebase.firestore.FieldValue("ARRAY_REMOVE", elements);
                }
            };
        };
        Firestore.prototype.GeoPoint = function (latitude, longitude) {
            return firebase.firestore.GeoPoint(latitude, longitude);
        };
        Firestore.prototype.runTransaction = function (updateFunction) {
            return firebase.firestore.runTransaction(updateFunction);
        };
        Firestore.prototype.batch = function () {
            return firebase.firestore.batch();
        };
        return Firestore;
    }());
    firestore.Firestore = Firestore;
})(firestore = exports.firestore || (exports.firestore = {}));
