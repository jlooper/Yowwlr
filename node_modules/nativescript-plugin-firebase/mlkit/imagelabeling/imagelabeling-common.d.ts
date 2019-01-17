import { MLKitCameraView } from "../mlkit-cameraview";
export declare const confidenceThresholdProperty: any;
export declare abstract class MLKitImageLabeling extends MLKitCameraView {
    static scanResultEvent: string;
    protected confidenceThreshold: number;
}
