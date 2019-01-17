"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var content_view_1 = require("tns-core-modules/ui/content-view");
var properties_1 = require("tns-core-modules/ui/core/properties");
var view_base_1 = require("tns-core-modules/ui/core/view-base");
exports.processEveryNthFrameProperty = new properties_1.Property({
    name: "processEveryNthFrame",
    defaultValue: 10,
});
exports.preferFrontCameraProperty = new properties_1.Property({
    name: "preferFrontCamera",
    defaultValue: false,
    valueConverter: view_base_1.booleanConverter
});
exports.torchOnProperty = new properties_1.Property({
    name: "torchOn",
    defaultValue: false,
    valueConverter: view_base_1.booleanConverter
});
exports.pauseProperty = new properties_1.Property({
    name: "pause",
    defaultValue: false,
    valueConverter: view_base_1.booleanConverter
});
var MLKitCameraView = (function (_super) {
    __extends(MLKitCameraView, _super);
    function MLKitCameraView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MLKitCameraView.prototype[exports.processEveryNthFrameProperty.setNative] = function (value) {
        this.processEveryNthFrame = value;
    };
    MLKitCameraView.prototype[exports.preferFrontCameraProperty.setNative] = function (value) {
        this.preferFrontCamera = value;
    };
    MLKitCameraView.prototype[exports.torchOnProperty.setNative] = function (value) {
        this.torchOn = value;
        this.updateTorch();
    };
    MLKitCameraView.prototype[exports.pauseProperty.setNative] = function (value) {
        this.pause = value;
        this.pause ? this.pauseScanning() : this.resumeScanning();
    };
    MLKitCameraView.prototype.updateTorch = function () {
    };
    ;
    MLKitCameraView.prototype.pauseScanning = function () {
    };
    ;
    MLKitCameraView.prototype.resumeScanning = function () {
    };
    MLKitCameraView.scanResultEvent = "scanResult";
    return MLKitCameraView;
}(content_view_1.ContentView));
exports.MLKitCameraView = MLKitCameraView;
exports.processEveryNthFrameProperty.register(MLKitCameraView);
exports.preferFrontCameraProperty.register(MLKitCameraView);
exports.torchOnProperty.register(MLKitCameraView);
exports.pauseProperty.register(MLKitCameraView);
