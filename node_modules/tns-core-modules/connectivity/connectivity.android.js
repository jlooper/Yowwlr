Object.defineProperty(exports, "__esModule", { value: true });
var application_1 = require("../application");
var connectionType;
(function (connectionType) {
    connectionType[connectionType["none"] = 0] = "none";
    connectionType[connectionType["wifi"] = 1] = "wifi";
    connectionType[connectionType["mobile"] = 2] = "mobile";
    connectionType[connectionType["ethernet"] = 3] = "ethernet";
    connectionType[connectionType["bluetooth"] = 4] = "bluetooth";
})(connectionType = exports.connectionType || (exports.connectionType = {}));
var wifi = "wifi";
var mobile = "mobile";
var ethernet = "ethernet";
var bluetooth = "bluetooth";
function getConnectivityManager() {
    return application_1.getNativeApplication().getApplicationContext().getSystemService(android.content.Context.CONNECTIVITY_SERVICE);
}
function getActiveNetworkInfo() {
    var connectivityManager = getConnectivityManager();
    if (!connectivityManager) {
        return null;
    }
    return connectivityManager.getActiveNetworkInfo();
}
function getConnectionType() {
    var activeNetworkInfo = getActiveNetworkInfo();
    if (!activeNetworkInfo || !activeNetworkInfo.isConnected()) {
        return connectionType.none;
    }
    var type = activeNetworkInfo.getTypeName().toLowerCase();
    if (type.indexOf(wifi) !== -1) {
        return connectionType.wifi;
    }
    if (type.indexOf(mobile) !== -1) {
        return connectionType.mobile;
    }
    if (type.indexOf(ethernet) !== -1) {
        return connectionType.ethernet;
    }
    if (type.indexOf(bluetooth) !== -1) {
        return connectionType.bluetooth;
    }
    return connectionType.none;
}
exports.getConnectionType = getConnectionType;
function startMonitoring(connectionTypeChangedCallback) {
    var onReceiveCallback = function onReceiveCallback(context, intent) {
        var newConnectionType = getConnectionType();
        connectionTypeChangedCallback(newConnectionType);
    };
    var zoneCallback = zonedCallback(onReceiveCallback);
    application_1.android.registerBroadcastReceiver(android.net.ConnectivityManager.CONNECTIVITY_ACTION, zoneCallback);
}
exports.startMonitoring = startMonitoring;
function stopMonitoring() {
    application_1.android.unregisterBroadcastReceiver(android.net.ConnectivityManager.CONNECTIVITY_ACTION);
}
exports.stopMonitoring = stopMonitoring;
//# sourceMappingURL=connectivity.android.js.map