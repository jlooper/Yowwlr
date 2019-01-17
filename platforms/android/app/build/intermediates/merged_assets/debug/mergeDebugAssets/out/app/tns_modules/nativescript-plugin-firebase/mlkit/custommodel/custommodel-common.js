"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mlkit_cameraview_1 = require("../mlkit-cameraview");
var MLKitCustomModel = (function (_super) {
    __extends(MLKitCustomModel, _super);
    function MLKitCustomModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MLKitCustomModel.scanResultEvent = "scanResult";
    return MLKitCustomModel;
}(mlkit_cameraview_1.MLKitCameraView));
exports.MLKitCustomModel = MLKitCustomModel;
