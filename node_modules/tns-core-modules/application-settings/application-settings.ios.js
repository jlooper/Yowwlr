Object.defineProperty(exports, "__esModule", { value: true });
var Common = require("./application-settings-common");
var utils = require("../utils/utils");
var userDefaults = utils.ios.getter(NSUserDefaults, NSUserDefaults.standardUserDefaults);
exports.hasKey = function (key) {
    Common.checkKey(key);
    return userDefaults.objectForKey(key) !== null;
};
exports.getBoolean = function (key, defaultValue) {
    Common.checkKey(key);
    if (exports.hasKey(key)) {
        return userDefaults.boolForKey(key);
    }
    return defaultValue;
};
exports.getString = function (key, defaultValue) {
    Common.checkKey(key);
    if (exports.hasKey(key)) {
        return userDefaults.stringForKey(key);
    }
    return defaultValue;
};
exports.getNumber = function (key, defaultValue) {
    Common.checkKey(key);
    if (exports.hasKey(key)) {
        return userDefaults.doubleForKey(key);
    }
    return defaultValue;
};
exports.setBoolean = function (key, value) {
    Common.checkKey(key);
    Common.ensureValidValue(value, "boolean");
    userDefaults.setBoolForKey(value, key);
};
exports.setString = function (key, value) {
    Common.checkKey(key);
    Common.ensureValidValue(value, "string");
    userDefaults.setObjectForKey(value, key);
};
exports.setNumber = function (key, value) {
    Common.checkKey(key);
    Common.ensureValidValue(value, "number");
    userDefaults.setDoubleForKey(value, key);
};
exports.remove = function (key) {
    Common.checkKey(key);
    userDefaults.removeObjectForKey(key);
};
exports.clear = function () {
    userDefaults.removePersistentDomainForName(utils.ios.getter(NSBundle, NSBundle.mainBundle).bundleIdentifier);
};
exports.flush = function () {
    return userDefaults.synchronize();
};
function getAllKeys() {
    return utils.ios.collections.nsArrayToJSArray(userDefaults.dictionaryRepresentation().allKeys);
}
exports.getAllKeys = getAllKeys;
//# sourceMappingURL=application-settings.ios.js.map