import { MLKitRecognizeTextOnDeviceOptions, MLKitRecognizeTextResult } from "./";
import { MLKitTextRecognition as MLKitTextRecognitionBase } from "./textrecognition-common";
import { MLKitRecognizeTextCloudOptions } from "./index";
export declare class MLKitTextRecognition extends MLKitTextRecognitionBase {
    protected createDetector(): any;
    protected createSuccessListener(): any;
}
export declare function recognizeTextOnDevice(options: MLKitRecognizeTextOnDeviceOptions): Promise<MLKitRecognizeTextResult>;
export declare function recognizeTextCloud(options: MLKitRecognizeTextCloudOptions): Promise<MLKitRecognizeTextResult>;
