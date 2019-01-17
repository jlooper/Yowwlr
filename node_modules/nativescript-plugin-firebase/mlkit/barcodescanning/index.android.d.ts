import { MLKitScanBarcodesOnDeviceOptions, MLKitScanBarcodesOnDeviceResult } from "./";
import { BarcodeFormat, MLKitBarcodeScanner as MLKitBarcodeScannerBase } from "./barcodescanning-common";
export { BarcodeFormat };
export declare class MLKitBarcodeScanner extends MLKitBarcodeScannerBase {
    protected createDetector(): any;
    protected createSuccessListener(): any;
}
export declare function scanBarcodesOnDevice(options: MLKitScanBarcodesOnDeviceOptions): Promise<MLKitScanBarcodesOnDeviceResult>;
