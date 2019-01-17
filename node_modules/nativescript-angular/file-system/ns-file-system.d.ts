import { Folder, File } from "tns-core-modules/file-system";
export declare class NSFileSystem {
    currentApp(): Folder;
    fileFromPath(path: string): File;
    fileExists(path: string): boolean;
}
