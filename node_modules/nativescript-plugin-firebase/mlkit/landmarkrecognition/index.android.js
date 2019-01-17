"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var image_source_1 = require("tns-core-modules/image-source");
function getDetector(modelType, confidenceThreshold) {
    var landmarkDetectorOptions = new com.google.firebase.ml.vision.cloud.FirebaseVisionCloudDetectorOptions.Builder()
        .setModelType(modelType === "latest" ? com.google.firebase.ml.vision.cloud.FirebaseVisionCloudDetectorOptions.LATEST_MODEL : com.google.firebase.ml.vision.cloud.FirebaseVisionCloudDetectorOptions.STABLE_MODEL)
        .setMaxResults(confidenceThreshold || 10)
        .build();
    return com.google.firebase.ml.vision.FirebaseVision.getInstance().getVisionCloudLandmarkDetector(landmarkDetectorOptions);
}
function recognizeLandmarksCloud(options) {
    return new Promise(function (resolve, reject) {
        try {
            var firebaseVisionLandmarkDetector_1 = getDetector(options.modelType, options.maxResults);
            var onSuccessListener = new com.google.android.gms.tasks.OnSuccessListener({
                onSuccess: function (landmarks) {
                    var result = {
                        landmarks: []
                    };
                    if (landmarks) {
                        for (var i = 0; i < landmarks.size(); i++) {
                            var landmark = landmarks.get(i);
                            result.landmarks.push({
                                name: landmark.getLandmark(),
                                confidence: landmark.getConfidence()
                            });
                        }
                    }
                    resolve(result);
                    firebaseVisionLandmarkDetector_1.close();
                }
            });
            var onFailureListener = new com.google.android.gms.tasks.OnFailureListener({
                onFailure: function (exception) { return reject(exception.getMessage()); }
            });
            firebaseVisionLandmarkDetector_1
                .detectInImage(getImage(options))
                .addOnSuccessListener(onSuccessListener)
                .addOnFailureListener(onFailureListener);
        }
        catch (ex) {
            console.log("Error in firebase.mlkit.recognizeLandmarksCloud: " + ex);
            reject(ex);
        }
    });
}
exports.recognizeLandmarksCloud = recognizeLandmarksCloud;
function getImage(options) {
    var image = options.image instanceof image_source_1.ImageSource ? options.image.android : options.image.imageSource.android;
    return com.google.firebase.ml.vision.common.FirebaseVisionImage.fromBitmap(image);
}
