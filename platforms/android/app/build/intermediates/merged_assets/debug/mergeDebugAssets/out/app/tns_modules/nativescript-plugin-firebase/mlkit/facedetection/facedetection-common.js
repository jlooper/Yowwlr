"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var view_base_1 = require("tns-core-modules/ui/core/view-base");
var properties_1 = require("tns-core-modules/ui/core/properties");
var mlkit_cameraview_1 = require("../mlkit-cameraview");
exports.minimumFaceSizeProperty = new properties_1.Property({
    name: "minimumFaceSize",
    defaultValue: 0.1
});
exports.enableFaceTrackingProperty = new properties_1.Property({
    name: "enableFaceTracking",
    defaultValue: false,
    valueConverter: view_base_1.booleanConverter
});
var detectionModeConverter = view_base_1.makeParser(view_base_1.makeValidator("accurate", "fast"));
exports.detectionModeProperty = new properties_1.Property({
    name: "detectionMode",
    defaultValue: "fast",
    valueConverter: detectionModeConverter
});
var MLKitFaceDetection = (function (_super) {
    __extends(MLKitFaceDetection, _super);
    function MLKitFaceDetection() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MLKitFaceDetection.prototype[exports.minimumFaceSizeProperty.setNative] = function (value) {
        this.minimumFaceSize = value;
    };
    MLKitFaceDetection.prototype[exports.enableFaceTrackingProperty.setNative] = function (value) {
        this.enableFaceTracking = value;
    };
    MLKitFaceDetection.prototype[exports.detectionModeProperty.setNative] = function (value) {
        this.detectionMode = value;
    };
    MLKitFaceDetection.scanResultEvent = "scanResult";
    return MLKitFaceDetection;
}(mlkit_cameraview_1.MLKitCameraView));
exports.MLKitFaceDetection = MLKitFaceDetection;
exports.minimumFaceSizeProperty.register(MLKitFaceDetection);
exports.enableFaceTrackingProperty.register(MLKitFaceDetection);
exports.detectionModeProperty.register(MLKitFaceDetection);
