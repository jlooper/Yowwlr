import { MLKitDetectFacesOnDeviceOptions, MLKitDetectFacesOnDeviceResult } from "./";
import { MLKitFaceDetection as MLKitFaceDetectionBase } from "./facedetection-common";
export declare class MLKitFaceDetection extends MLKitFaceDetectionBase {
    protected createDetector(): any;
    protected createSuccessListener(): any;
    protected rotateRecording(): boolean;
    getVisionOrientation(imageOrientation: UIImageOrientation): FIRVisionDetectorImageOrientation;
}
export declare function detectFacesOnDevice(options: MLKitDetectFacesOnDeviceOptions): Promise<MLKitDetectFacesOnDeviceResult>;
