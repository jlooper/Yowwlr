"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var image_source_1 = require("tns-core-modules/image-source");
var textrecognition_common_1 = require("./textrecognition-common");
var MLKitTextRecognition = (function (_super) {
    __extends(MLKitTextRecognition, _super);
    function MLKitTextRecognition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MLKitTextRecognition.prototype.createDetector = function () {
        return com.google.firebase.ml.vision.FirebaseVision.getInstance().getOnDeviceTextRecognizer();
    };
    MLKitTextRecognition.prototype.createSuccessListener = function () {
        var _this = this;
        return new com.google.android.gms.tasks.OnSuccessListener({
            onSuccess: function (firebaseVisionText) {
                if (firebaseVisionText.getTextBlocks().size() > 0) {
                    _this.notify({
                        eventName: MLKitTextRecognition.scanResultEvent,
                        object: _this,
                        value: getResult(firebaseVisionText)
                    });
                }
            }
        });
    };
    return MLKitTextRecognition;
}(textrecognition_common_1.MLKitTextRecognition));
exports.MLKitTextRecognition = MLKitTextRecognition;
function boundingBoxToBounds(rect) {
    return {
        origin: {
            x: rect.left,
            y: rect.top
        },
        size: {
            width: rect.width(),
            height: rect.height()
        }
    };
}
function getResult(firebaseVisionText) {
    if (firebaseVisionText === null) {
        return {};
    }
    var result = {
        text: firebaseVisionText.getText(),
        blocks: [],
        android: firebaseVisionText
    };
    for (var i = 0; i < firebaseVisionText.getTextBlocks().size(); i++) {
        var textBlock = firebaseVisionText.getTextBlocks().get(i);
        var lines = textBlock.getLines();
        var lns = [];
        for (var j = 0; j < lines.size(); j++) {
            var line = lines.get(j);
            var elements = line.getElements();
            var elms = [];
            for (var k = 0; k < elements.size(); k++) {
                var element = elements.get(k);
                elms.push({
                    text: element.getText(),
                    bounds: boundingBoxToBounds(element.getBoundingBox())
                });
            }
            lns.push({
                text: line.getText(),
                confidence: line.getConfidence(),
                bounds: boundingBoxToBounds(line.getBoundingBox()),
                elements: elms
            });
        }
        result.blocks.push({
            text: textBlock.getText(),
            confidence: textBlock.getConfidence(),
            bounds: boundingBoxToBounds(textBlock.getBoundingBox()),
            lines: lns
        });
    }
    return result;
}
function recognizeTextOnDevice(options) {
    return new Promise(function (resolve, reject) {
        try {
            var firebaseVisionTextRecognizer_1 = com.google.firebase.ml.vision.FirebaseVision.getInstance().getOnDeviceTextRecognizer();
            var onSuccessListener = new com.google.android.gms.tasks.OnSuccessListener({
                onSuccess: function (firebaseVisionText) {
                    resolve(getResult(firebaseVisionText));
                    firebaseVisionTextRecognizer_1.close();
                }
            });
            var onFailureListener = new com.google.android.gms.tasks.OnFailureListener({
                onFailure: function (exception) { return reject(exception.getMessage()); }
            });
            firebaseVisionTextRecognizer_1
                .processImage(getImage(options))
                .addOnSuccessListener(onSuccessListener)
                .addOnFailureListener(onFailureListener);
        }
        catch (ex) {
            console.log("Error in firebase.mlkit.recognizeTextOnDevice: " + ex);
            reject(ex);
        }
    });
}
exports.recognizeTextOnDevice = recognizeTextOnDevice;
function recognizeTextCloud(options) {
    return new Promise(function (resolve, reject) {
        try {
            var firebaseVisionCloudTextRecognizer_1 = com.google.firebase.ml.vision.FirebaseVision.getInstance().getCloudTextRecognizer();
            var onSuccessListener = new com.google.android.gms.tasks.OnSuccessListener({
                onSuccess: function (firebaseVisionText) {
                    resolve(getResult(firebaseVisionText));
                    firebaseVisionCloudTextRecognizer_1.close();
                }
            });
            var onFailureListener = new com.google.android.gms.tasks.OnFailureListener({
                onFailure: function (exception) { return reject(exception.getMessage()); }
            });
            firebaseVisionCloudTextRecognizer_1
                .processImage(getImage(options))
                .addOnSuccessListener(onSuccessListener)
                .addOnFailureListener(onFailureListener);
        }
        catch (ex) {
            console.log("Error in firebase.mlkit.recognizeTextCloud: " + ex);
            reject(ex);
        }
    });
}
exports.recognizeTextCloud = recognizeTextCloud;
function getImage(options) {
    var image = options.image instanceof image_source_1.ImageSource ? options.image.android : options.image.imageSource.android;
    return com.google.firebase.ml.vision.common.FirebaseVisionImage.fromBitmap(image);
}
