"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var view_base_1 = require("tns-core-modules/ui/core/view-base");
var properties_1 = require("tns-core-modules/ui/core/properties");
var mlkit_cameraview_1 = require("../mlkit-cameraview");
exports.reportDuplicatesProperty = new properties_1.Property({
    name: "reportDuplicates",
    defaultValue: false,
    valueConverter: view_base_1.booleanConverter
});
var MLKitTextRecognition = (function (_super) {
    __extends(MLKitTextRecognition, _super);
    function MLKitTextRecognition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MLKitTextRecognition.prototype[exports.reportDuplicatesProperty.setNative] = function (value) {
        this.reportDuplicates = value;
    };
    MLKitTextRecognition.scanResultEvent = "scanResult";
    return MLKitTextRecognition;
}(mlkit_cameraview_1.MLKitCameraView));
exports.MLKitTextRecognition = MLKitTextRecognition;
exports.reportDuplicatesProperty.register(MLKitTextRecognition);
