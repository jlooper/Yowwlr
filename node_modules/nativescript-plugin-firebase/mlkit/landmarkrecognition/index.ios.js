"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var image_source_1 = require("tns-core-modules/image-source");
function getDetector(modelType, maxResults) {
    var firVision = FIRVision.vision();
    var fIRVisionCloudDetectorOptions = FIRVisionCloudDetectorOptions.alloc();
    fIRVisionCloudDetectorOptions.modelType = modelType === "latest" ? 1 : 0;
    fIRVisionCloudDetectorOptions.maxResults = maxResults || 10;
    return firVision.cloudLandmarkDetectorWithOptions(fIRVisionCloudDetectorOptions);
}
function recognizeLandmarksCloud(options) {
    return new Promise(function (resolve, reject) {
        try {
            var landmarkDetector = getDetector(options.modelType, options.maxResults);
            landmarkDetector.detectInImageCompletion(getImage(options), function (landmarks, error) {
                if (error !== null) {
                    reject(error.localizedDescription);
                }
                else if (landmarks !== null) {
                    var result = {
                        landmarks: []
                    };
                    for (var i = 0, l = landmarks.count; i < l; i++) {
                        var landmark = landmarks.objectAtIndex(i);
                        console.log(">> detected landmark: " + landmark);
                        result.landmarks.push({
                            name: landmark.landmark,
                            confidence: landmark.confidence
                        });
                    }
                    resolve(result);
                }
            });
        }
        catch (ex) {
            console.log("Error in firebase.mlkit.recognizeLandmarksCloud: " + ex);
            reject(ex);
        }
    });
}
exports.recognizeLandmarksCloud = recognizeLandmarksCloud;
function getImage(options) {
    var image = options.image instanceof image_source_1.ImageSource ? options.image.ios : options.image.imageSource.ios;
    return FIRVisionImage.alloc().initWithImage(image);
}
