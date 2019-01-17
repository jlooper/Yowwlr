"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var view_base_1 = require("tns-core-modules/ui/core/view-base");
var properties_1 = require("tns-core-modules/ui/core/properties");
var mlkit_cameraview_1 = require("../mlkit-cameraview");
var BarcodeFormat;
(function (BarcodeFormat) {
    BarcodeFormat[BarcodeFormat["CODE_128"] = 1] = "CODE_128";
    BarcodeFormat[BarcodeFormat["CODE_39"] = 2] = "CODE_39";
    BarcodeFormat[BarcodeFormat["CODE_93"] = 4] = "CODE_93";
    BarcodeFormat[BarcodeFormat["CODABAR"] = 8] = "CODABAR";
    BarcodeFormat[BarcodeFormat["DATA_MATRIX"] = 16] = "DATA_MATRIX";
    BarcodeFormat[BarcodeFormat["EAN_13"] = 32] = "EAN_13";
    BarcodeFormat[BarcodeFormat["EAN_8"] = 64] = "EAN_8";
    BarcodeFormat[BarcodeFormat["ITF"] = 128] = "ITF";
    BarcodeFormat[BarcodeFormat["QR_CODE"] = 256] = "QR_CODE";
    BarcodeFormat[BarcodeFormat["UPC_A"] = 512] = "UPC_A";
    BarcodeFormat[BarcodeFormat["UPC_E"] = 1024] = "UPC_E";
    BarcodeFormat[BarcodeFormat["PDF417"] = 2048] = "PDF417";
    BarcodeFormat[BarcodeFormat["AZTEC"] = 4096] = "AZTEC";
})(BarcodeFormat = exports.BarcodeFormat || (exports.BarcodeFormat = {}));
exports.formatsProperty = new properties_1.Property({
    name: "formats",
    defaultValue: null,
});
exports.beepOnScanProperty = new properties_1.Property({
    name: "beepOnScan",
    defaultValue: true,
    valueConverter: view_base_1.booleanConverter
});
exports.reportDuplicatesProperty = new properties_1.Property({
    name: "reportDuplicates",
    defaultValue: false,
    valueConverter: view_base_1.booleanConverter
});
var MLKitBarcodeScanner = (function (_super) {
    __extends(MLKitBarcodeScanner, _super);
    function MLKitBarcodeScanner() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MLKitBarcodeScanner.prototype[exports.formatsProperty.setNative] = function (value) {
        this.formats = value;
    };
    MLKitBarcodeScanner.prototype[exports.beepOnScanProperty.setNative] = function (value) {
        this.beepOnScan = value;
    };
    MLKitBarcodeScanner.prototype[exports.reportDuplicatesProperty.setNative] = function (value) {
        this.reportDuplicates = value;
    };
    return MLKitBarcodeScanner;
}(mlkit_cameraview_1.MLKitCameraView));
exports.MLKitBarcodeScanner = MLKitBarcodeScanner;
exports.formatsProperty.register(MLKitBarcodeScanner);
exports.beepOnScanProperty.register(MLKitBarcodeScanner);
exports.reportDuplicatesProperty.register(MLKitBarcodeScanner);
