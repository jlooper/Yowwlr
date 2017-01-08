import { ResourceLoader } from "@angular/compiler";
export declare class FileSystemResourceLoader extends ResourceLoader {
    resolve(url: string, baseUrl: string): string;
    get(url: string): Promise<string>;
}
