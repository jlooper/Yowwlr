import { File } from "tns-core-modules/file-system";
export declare module storage {
    interface UploadTaskSnapshot {
        downloadURL: string | null;
        totalBytes: number;
    }
    class Reference {
        private path;
        parent: Reference | null;
        root: Reference;
        fullPath: string;
        constructor(path?: string);
        child(path: string): storage.Reference;
        delete(): Promise<void>;
        getDownloadURL(): Promise<string>;
        put(data: File | string, metadata?: any): Promise<UploadTaskSnapshot>;
        download(downloadToPath: string): Promise<any>;
    }
    class Storage {
        ref(): Reference;
    }
}
