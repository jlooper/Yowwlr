"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var image_source_1 = require("tns-core-modules/image-source");
var custommodel_common_1 = require("./custommodel-common");
var MLKitCustomModel = (function (_super) {
    __extends(MLKitCustomModel, _super);
    function MLKitCustomModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MLKitCustomModel.prototype.createDetector = function () {
        return getInterpreter();
    };
    MLKitCustomModel.prototype.createSuccessListener = function () {
        var _this = this;
        return new com.google.android.gms.tasks.OnSuccessListener({
            onSuccess: function (labels) {
                if (labels.size() === 0)
                    return;
                var result = {
                    result: []
                };
                for (var i = 0; i < labels.size(); i++) {
                    var label = labels.get(i);
                    result.result.push({
                        text: label.getLabel(),
                        confidence: label.getConfidence()
                    });
                }
                _this.notify({
                    eventName: MLKitCustomModel.scanResultEvent,
                    object: _this,
                    value: result
                });
            }
        });
    };
    return MLKitCustomModel;
}(custommodel_common_1.MLKitCustomModel));
exports.MLKitCustomModel = MLKitCustomModel;
function getInterpreter() {
    var localSource = new com.google.firebase.ml.custom.model.FirebaseLocalModelSource.Builder("my_local_model")
        .setAssetFilePath("mobilenet_quant_v1_224.tflite")
        .build();
    com.google.firebase.ml.custom.FirebaseModelManager.getInstance().registerLocalModelSource(localSource);
    var options = new com.google.firebase.ml.custom.FirebaseModelOptions.Builder()
        .setLocalModelName("my_local_model")
        .build();
    return com.google.firebase.ml.custom.FirebaseModelInterpreter.getInstance(options);
}
function useCustomModel(options) {
    return new Promise(function (resolve, reject) {
        try {
            var interpreter_1 = getInterpreter();
            var onSuccessListener = new com.google.android.gms.tasks.OnSuccessListener({
                onSuccess: function (labels) {
                    var result = {
                        result: []
                    };
                    resolve(result);
                    interpreter_1.close();
                }
            });
            var onFailureListener = new com.google.android.gms.tasks.OnFailureListener({
                onFailure: function (exception) { return reject(exception.getMessage()); }
            });
            var intArrayIn = Array.create('int', 4);
            intArrayIn[0] = 1;
            intArrayIn[1] = 640;
            intArrayIn[2] = 480;
            intArrayIn[3] = 3;
            var intArrayOut = Array.create('int', 2);
            intArrayOut[0] = 1;
            intArrayOut[1] = 1000;
            var inputOutputOptions = new com.google.firebase.ml.custom.FirebaseModelInputOutputOptions.Builder()
                .setInputFormat(0, com.google.firebase.ml.custom.FirebaseModelDataType.BYTE, intArrayIn)
                .setOutputFormat(0, com.google.firebase.ml.custom.FirebaseModelDataType.FLOAT32, intArrayOut)
                .build();
            var input = null;
            var inputs = new com.google.firebase.ml.custom.FirebaseModelInputs.Builder()
                .add(input)
                .build();
            interpreter_1
                .run(inputs, inputOutputOptions)
                .addOnSuccessListener(onSuccessListener)
                .addOnFailureListener(onFailureListener);
        }
        catch (ex) {
            console.log("Error in firebase.mlkit.useCustomModel: " + ex);
            reject(ex);
        }
    });
}
exports.useCustomModel = useCustomModel;
function getImage(options) {
    var image = options.image instanceof image_source_1.ImageSource ? options.image.android : options.image.imageSource.android;
    return com.google.firebase.ml.vision.common.FirebaseVisionImage.fromBitmap(image);
}
