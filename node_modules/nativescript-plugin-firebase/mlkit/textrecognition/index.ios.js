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
        var firVision = FIRVision.vision();
        return firVision.onDeviceTextRecognizer();
    };
    MLKitTextRecognition.prototype.createSuccessListener = function () {
        var _this = this;
        return function (visionText, error) {
            if (error !== null) {
                console.log(error.localizedDescription);
            }
            else if (visionText !== null) {
                _this.notify({
                    eventName: MLKitTextRecognition.scanResultEvent,
                    object: _this,
                    value: getResult(visionText)
                });
            }
        };
    };
    MLKitTextRecognition.prototype.rotateRecording = function () {
        return true;
    };
    return MLKitTextRecognition;
}(textrecognition_common_1.MLKitTextRecognition));
exports.MLKitTextRecognition = MLKitTextRecognition;
function getResult(visionText) {
    if (visionText === null) {
        return {};
    }
    var result = {
        text: visionText.text,
        blocks: [],
        ios: visionText
    };
    var _loop_1 = function (i, l) {
        var feature = visionText.blocks.objectAtIndex(i);
        var resultFeature = {
            text: feature.text,
            confidence: feature.confidence,
            bounds: feature.frame,
            lines: []
        };
        var addLineToResult = function (line) {
            var resultLine = {
                text: feature.text,
                confidence: line.confidence,
                bounds: line.frame,
                elements: []
            };
            for (var a = 0, m = line.elements.count; a < m; a++) {
                var element = line.elements.objectAtIndex(a);
                resultLine.elements.push({
                    text: element.text,
                    bounds: element.frame,
                });
            }
            resultFeature.lines.push(resultLine);
        };
        if (feature instanceof FIRVisionTextBlock) {
            var textBlock = feature;
            for (var j = 0, k = textBlock.lines.count; j < k; j++) {
                addLineToResult(textBlock.lines.objectAtIndex(j));
            }
        }
        if (feature instanceof FIRVisionTextLine) {
            addLineToResult(feature);
        }
        result.blocks.push(resultFeature);
    };
    for (var i = 0, l = visionText.blocks.count; i < l; i++) {
        _loop_1(i, l);
    }
    return result;
}
function recognizeTextOnDevice(options) {
    return new Promise(function (resolve, reject) {
        try {
            var firVision = FIRVision.vision();
            var textDetector = firVision.onDeviceTextRecognizer();
            textDetector.processImageCompletion(getImage(options), function (visionText, error) {
                if (error !== null) {
                    reject(error.localizedDescription);
                }
                else {
                    resolve(getResult(visionText));
                }
            });
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
            var fIRVisionCloudDetectorOptions = FIRVisionCloudTextRecognizerOptions.new();
            fIRVisionCloudDetectorOptions.modelType = 0;
            var firVision = FIRVision.vision();
            var textDetector = firVision.cloudTextRecognizerWithOptions(fIRVisionCloudDetectorOptions);
            textDetector.processImageCompletion(getImage(options), function (visionText, error) {
                console.log(">>> recognizeTextCloud error? " + error + ", visionText? " + visionText);
                if (error !== null) {
                    reject(error.localizedDescription);
                }
                else if (visionText !== null) {
                    resolve(getResult(visionText));
                }
                else {
                    reject("Unknown error :'(");
                }
            });
        }
        catch (ex) {
            console.log("Error in firebase.mlkit.recognizeTextCloud: " + ex);
            reject(ex);
        }
    });
}
exports.recognizeTextCloud = recognizeTextCloud;
function getImage(options) {
    var image = options.image instanceof image_source_1.ImageSource ? options.image.ios : options.image.imageSource.ios;
    return FIRVisionImage.alloc().initWithImage(image);
}
