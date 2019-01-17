import { DeleteFileOptions, DownloadFileOptions, GetDownloadUrlOptions, UploadFileOptions, UploadFileResult } from "./storage";
export declare function uploadFile(arg: UploadFileOptions): Promise<UploadFileResult>;
export declare function downloadFile(arg: DownloadFileOptions): Promise<string>;
export declare function getDownloadUrl(arg: GetDownloadUrlOptions): Promise<string>;
export declare function deleteFile(arg: DeleteFileOptions): Promise<void>;
