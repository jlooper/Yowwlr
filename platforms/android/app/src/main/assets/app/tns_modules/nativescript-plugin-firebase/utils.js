"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var firebase_common_1 = require("./firebase-common");
var types_1 = require("tns-core-modules/utils/types");
var Utils = (function () {
    function Utils() {
        this.invokeOnRunLoop = (function () {
            var runloop = CFRunLoopGetMain();
            return function (func) {
                CFRunLoopPerformBlock(runloop, kCFRunLoopDefaultMode, func);
                CFRunLoopWakeUp(runloop);
            };
        })();
    }
    Utils.prototype.toJsObject = function (objCObj) {
        if (objCObj === null || typeof objCObj !== "object") {
            return objCObj;
        }
        var node, key, i, l, oKeyArr = objCObj.allKeys;
        if (oKeyArr === undefined && objCObj.count !== undefined) {
            node = [];
            for (i = 0, l = objCObj.count; i < l; i++) {
                key = objCObj.objectAtIndex(i);
                node.push(this.toJsObject(key));
            }
        }
        else if (oKeyArr !== undefined) {
            node = {};
            for (i = 0, l = oKeyArr.count; i < l; i++) {
                key = oKeyArr.objectAtIndex(i);
                var val = objCObj.valueForKey(key);
                if (val === null) {
                    node[key] = null;
                    continue;
                }
                node[key] = this.getValueForClass(val);
            }
        }
        else {
            node = this.getValueForClass(objCObj);
        }
        return node;
    };
    Utils.prototype.getValueForClass = function (val) {
        switch (types_1.getClass(val)) {
            case 'NSArray':
            case 'NSMutableArray':
                return this.toJsObject(val);
            case 'NSDictionary':
            case 'NSMutableDictionary':
                return this.toJsObject(val);
            case 'String':
                return String(val);
            case 'Boolean':
                return val;
            case 'Number':
            case 'NSDecimalNumber':
                return Number(String(val));
            case 'Date':
                return new Date(val);
            case 'FIRTimestamp':
                return val.dateValue();
            case 'FIRDocumentReference':
                var path = val.path;
                var lastSlashIndex = path.lastIndexOf("/");
                return firebase_common_1.firebase.firestore._getDocumentReference(val, path.substring(0, lastSlashIndex), path.substring(lastSlashIndex + 1));
            case 'FIRGeoPoint':
                return firebase_common_1.firebase.firestore.GeoPoint(val.latitude, val.longitude);
            default:
                console.log("Please report this at https://github.com/EddyVerbruggen/nativescript-plugin-firebase/issues: iOS toJsObject is missing a converter for class '" + types_1.getClass(val) + "'. Casting to String as a fallback.");
                return String(val);
        }
    };
    return Utils;
}());
exports.Utils = Utils;
exports.firebaseUtils = new Utils();
