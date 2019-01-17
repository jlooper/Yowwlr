"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var image_source_1 = require("tns-core-modules/image-source");
var facedetection_common_1 = require("./facedetection-common");
var MLKitFaceDetection = (function (_super) {
    __extends(MLKitFaceDetection, _super);
    function MLKitFaceDetection() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MLKitFaceDetection.prototype.createDetector = function () {
        return getFaceDetector({
            detectionMode: this.detectionMode,
            enableFaceTracking: this.enableFaceTracking,
            minimumFaceSize: this.minimumFaceSize
        });
    };
    MLKitFaceDetection.prototype.createSuccessListener = function () {
        var _this = this;
        return new com.google.android.gms.tasks.OnSuccessListener({
            onSuccess: function (faces) {
                if (!faces || faces.size() === 0)
                    return;
                var result = {
                    faces: []
                };
                for (var i = 0; i < faces.size(); i++) {
                    var face = faces.get(i);
                    result.faces.push({
                        smilingProbability: face.getSmilingProbability() !== com.google.firebase.ml.vision.face.FirebaseVisionFace.UNCOMPUTED_PROBABILITY ? face.getSmilingProbability() : undefined,
                        leftEyeOpenProbability: face.getLeftEyeOpenProbability() !== com.google.firebase.ml.vision.face.FirebaseVisionFace.UNCOMPUTED_PROBABILITY ? face.getLeftEyeOpenProbability() : undefined,
                        rightEyeOpenProbability: face.getRightEyeOpenProbability() !== com.google.firebase.ml.vision.face.FirebaseVisionFace.UNCOMPUTED_PROBABILITY ? face.getRightEyeOpenProbability() : undefined,
                        trackingId: face.getTrackingId() !== com.google.firebase.ml.vision.face.FirebaseVisionFace.INVALID_ID ? face.getTrackingId() : undefined
                    });
                }
                _this.notify({
                    eventName: MLKitFaceDetection.scanResultEvent,
                    object: _this,
                    value: result
                });
            }
        });
    };
    return MLKitFaceDetection;
}(facedetection_common_1.MLKitFaceDetection));
exports.MLKitFaceDetection = MLKitFaceDetection;
function getFaceDetector(options) {
    var builder = new com.google.firebase.ml.vision.face.FirebaseVisionFaceDetectorOptions.Builder()
        .setPerformanceMode(options.detectionMode === "accurate" ? com.google.firebase.ml.vision.face.FirebaseVisionFaceDetectorOptions.ACCURATE : com.google.firebase.ml.vision.face.FirebaseVisionFaceDetectorOptions.FAST)
        .setLandmarkMode(com.google.firebase.ml.vision.face.FirebaseVisionFaceDetectorOptions.ALL_LANDMARKS)
        .setClassificationMode(com.google.firebase.ml.vision.face.FirebaseVisionFaceDetectorOptions.ALL_CLASSIFICATIONS)
        .setMinFaceSize(options.minimumFaceSize);
    if (options.enableFaceTracking === true) {
        builder.enableTracking = true;
    }
    return com.google.firebase.ml.vision.FirebaseVision.getInstance().getVisionFaceDetector(builder.build());
}
function detectFacesOnDevice(options) {
    return new Promise(function (resolve, reject) {
        try {
            var firebaseVisionFaceDetector_1 = getFaceDetector(options);
            var onSuccessListener = new com.google.android.gms.tasks.OnSuccessListener({
                onSuccess: function (faces) {
                    var result = {
                        faces: []
                    };
                    if (faces) {
                        for (var i = 0; i < faces.size(); i++) {
                            var face = faces.get(i);
                            result.faces.push({
                                smilingProbability: face.getSmilingProbability() !== com.google.firebase.ml.vision.face.FirebaseVisionFace.UNCOMPUTED_PROBABILITY ? face.getSmilingProbability() : undefined,
                                leftEyeOpenProbability: face.getLeftEyeOpenProbability() !== com.google.firebase.ml.vision.face.FirebaseVisionFace.UNCOMPUTED_PROBABILITY ? face.getLeftEyeOpenProbability() : undefined,
                                rightEyeOpenProbability: face.getRightEyeOpenProbability() !== com.google.firebase.ml.vision.face.FirebaseVisionFace.UNCOMPUTED_PROBABILITY ? face.getRightEyeOpenProbability() : undefined,
                                trackingId: face.getTrackingId() !== com.google.firebase.ml.vision.face.FirebaseVisionFace.INVALID_ID ? face.getTrackingId() : undefined
                            });
                        }
                    }
                    resolve(result);
                    firebaseVisionFaceDetector_1.close();
                }
            });
            var onFailureListener = new com.google.android.gms.tasks.OnFailureListener({
                onFailure: function (exception) { return reject(exception.getMessage()); }
            });
            firebaseVisionFaceDetector_1
                .detectInImage(getImage(options))
                .addOnSuccessListener(onSuccessListener)
                .addOnFailureListener(onFailureListener);
        }
        catch (ex) {
            console.log("Error in firebase.mlkit.detectFacesOnDevice: " + ex);
            reject(ex);
        }
    });
}
exports.detectFacesOnDevice = detectFacesOnDevice;
function getImage(options) {
    var image = options.image instanceof image_source_1.ImageSource ? options.image.android : options.image.imageSource.android;
    return com.google.firebase.ml.vision.common.FirebaseVisionImage.fromBitmap(image);
}
