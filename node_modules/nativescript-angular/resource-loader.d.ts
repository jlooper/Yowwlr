import { ResourceLoader } from "@angular/compiler";
import { NSFileSystem } from "./file-system/ns-file-system";
export declare class FileSystemResourceLoader extends ResourceLoader {
    private fs;
    constructor(fs: NSFileSystem);
    get(url: string): Promise<string>;
    resolve(url: string): string;
    private resolveRelativeUrls;
}
