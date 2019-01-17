import { MLKitImageLabelingOnDeviceOptions, MLKitImageLabelingOnDeviceResult } from "./";
import { MLKitImageLabeling as MLKitImageLabelingBase } from "./imagelabeling-common";
import { MLKitImageLabelingCloudOptions, MLKitImageLabelingCloudResult } from "./index";
export declare class MLKitImageLabeling extends MLKitImageLabelingBase {
    protected createDetector(): any;
    protected createSuccessListener(): any;
}
export declare function labelImageOnDevice(options: MLKitImageLabelingOnDeviceOptions): Promise<MLKitImageLabelingOnDeviceResult>;
export declare function labelImageCloud(options: MLKitImageLabelingCloudOptions): Promise<MLKitImageLabelingCloudResult>;
