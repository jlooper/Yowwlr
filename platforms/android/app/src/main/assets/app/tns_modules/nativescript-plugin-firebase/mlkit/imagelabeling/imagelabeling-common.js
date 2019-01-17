"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var properties_1 = require("tns-core-modules/ui/core/properties");
var mlkit_cameraview_1 = require("../mlkit-cameraview");
exports.confidenceThresholdProperty = new properties_1.Property({
    name: "confidenceThreshold",
    defaultValue: 0.5,
});
var MLKitImageLabeling = (function (_super) {
    __extends(MLKitImageLabeling, _super);
    function MLKitImageLabeling() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MLKitImageLabeling.prototype[exports.confidenceThresholdProperty.setNative] = function (value) {
        this.confidenceThreshold = parseFloat(value);
    };
    MLKitImageLabeling.scanResultEvent = "scanResult";
    return MLKitImageLabeling;
}(mlkit_cameraview_1.MLKitCameraView));
exports.MLKitImageLabeling = MLKitImageLabeling;
exports.confidenceThresholdProperty.register(MLKitImageLabeling);
