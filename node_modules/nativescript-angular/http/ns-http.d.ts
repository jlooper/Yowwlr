import { Http, ConnectionBackend, Request, RequestOptions, RequestOptionsArgs, Response } from "@angular/http";
import { Observable } from "rxjs";
import { NSFileSystem } from "../file-system/ns-file-system";
export declare class NSXSRFStrategy {
    configureRequest(_req: any): void;
}
export declare class NSHttp extends Http {
    private nsFileSystem;
    constructor(backend: ConnectionBackend, defaultOptions: RequestOptions, nsFileSystem: NSFileSystem);
    /**
     * Performs a request with `request` http method.
     */
    request(req: string | Request, options?: RequestOptionsArgs): Observable<Response>;
    /**
     * Performs a request with `get` http method.
     */
    get(url: string, options?: RequestOptionsArgs): Observable<Response>;
    private requestLocalFile;
}
