import { Property } from "tns-core-modules/ui/core/properties";
import { MLKitCameraView } from "../mlkit-cameraview";
import { MLKitFaceDetectionMode } from "./";
export declare const minimumFaceSizeProperty: any;
export declare const enableFaceTrackingProperty: Property<MLKitFaceDetection, boolean>;
export declare const detectionModeProperty: Property<MLKitFaceDetection, MLKitFaceDetectionMode>;
export declare abstract class MLKitFaceDetection extends MLKitCameraView {
    static scanResultEvent: string;
    protected enableFaceTracking: boolean;
    protected detectionMode: MLKitFaceDetectionMode;
    protected minimumFaceSize: number;
}
