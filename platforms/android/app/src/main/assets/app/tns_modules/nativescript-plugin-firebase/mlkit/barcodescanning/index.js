"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var image_source_1 = require("tns-core-modules/image-source");
var barcodescanning_common_1 = require("./barcodescanning-common");
exports.BarcodeFormat = barcodescanning_common_1.BarcodeFormat;
var MLKitBarcodeScanner = (function (_super) {
    __extends(MLKitBarcodeScanner, _super);
    function MLKitBarcodeScanner() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MLKitBarcodeScanner.prototype.createDetector = function () {
        var formats;
        if (this.formats) {
            formats = [];
            var requestedFormats = this.formats.split(",");
            requestedFormats.forEach(function (format) { return formats.push(barcodescanning_common_1.BarcodeFormat[format.trim().toUpperCase()]); });
        }
        return getBarcodeDetector(formats);
    };
    MLKitBarcodeScanner.prototype.createSuccessListener = function () {
        var _this = this;
        return new com.google.android.gms.tasks.OnSuccessListener({
            onSuccess: function (barcodes) {
                var result = {
                    barcodes: []
                };
                if (barcodes) {
                    for (var i = 0; i < barcodes.size(); i++) {
                        var barcode = barcodes.get(i);
                        result.barcodes.push({
                            value: barcode.getRawValue(),
                            format: barcodescanning_common_1.BarcodeFormat[barcode.getFormat()],
                            android: barcode
                        });
                    }
                }
                _this.notify({
                    eventName: MLKitBarcodeScanner.scanResultEvent,
                    object: _this,
                    value: result
                });
            }
        });
    };
    return MLKitBarcodeScanner;
}(barcodescanning_common_1.MLKitBarcodeScanner));
exports.MLKitBarcodeScanner = MLKitBarcodeScanner;
function getBarcodeDetector(formats) {
    if (formats && formats.length > 0) {
        var firebaseVisionBarcodeDetectorOptions = new com.google.firebase.ml.vision.barcode.FirebaseVisionBarcodeDetectorOptions.Builder()
            .setBarcodeFormats(formats[0], formats)
            .build();
        return com.google.firebase.ml.vision.FirebaseVision.getInstance().getVisionBarcodeDetector(firebaseVisionBarcodeDetectorOptions);
    }
    else {
        return com.google.firebase.ml.vision.FirebaseVision.getInstance().getVisionBarcodeDetector();
    }
}
function scanBarcodesOnDevice(options) {
    return new Promise(function (resolve, reject) {
        try {
            var firebaseVisionBarcodeDetector_1 = getBarcodeDetector(options.formats);
            var onSuccessListener = new com.google.android.gms.tasks.OnSuccessListener({
                onSuccess: function (barcodes) {
                    var result = {
                        barcodes: []
                    };
                    if (barcodes) {
                        for (var i = 0; i < barcodes.size(); i++) {
                            var barcode = barcodes.get(i);
                            result.barcodes.push({
                                value: barcode.getRawValue(),
                                format: barcodescanning_common_1.BarcodeFormat[barcode.getFormat()],
                                android: barcode
                            });
                        }
                    }
                    resolve(result);
                    firebaseVisionBarcodeDetector_1.close();
                }
            });
            var onFailureListener = new com.google.android.gms.tasks.OnFailureListener({
                onFailure: function (exception) { return reject(exception.getMessage()); }
            });
            firebaseVisionBarcodeDetector_1
                .detectInImage(getImage(options))
                .addOnSuccessListener(onSuccessListener)
                .addOnFailureListener(onFailureListener);
        }
        catch (ex) {
            console.log("Error in firebase.mlkit.scanBarcodesOnDevice: " + ex);
            reject(ex);
        }
    });
}
exports.scanBarcodesOnDevice = scanBarcodesOnDevice;
function getImage(options) {
    var image = options.image instanceof image_source_1.ImageSource ? options.image.android : options.image.imageSource.android;
    return com.google.firebase.ml.vision.common.FirebaseVisionImage.fromBitmap(image);
}
