import { MLKitCustomModelOptions, MLKitCustomModelResult } from "./";
import { MLKitCustomModel as MLKitCustomModelBase } from "./custommodel-common";
export declare class MLKitCustomModel extends MLKitCustomModelBase {
    protected createDetector(): any;
    protected createSuccessListener(): any;
}
export declare function useCustomModel(options: MLKitCustomModelOptions): Promise<MLKitCustomModelResult>;
