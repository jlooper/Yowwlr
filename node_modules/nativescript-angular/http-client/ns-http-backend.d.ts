import { HttpRequest, HttpEvent, XhrFactory, HttpXhrBackend } from "@angular/common/http";
import { Observable } from "rxjs";
import { NSFileSystem } from "../file-system/ns-file-system";
export declare class NsHttpBackEnd extends HttpXhrBackend {
    private nsFileSystem;
    constructor(xhrFactory: XhrFactory, nsFileSystem: NSFileSystem);
    handle(req: HttpRequest<any>): Observable<HttpEvent<any>>;
    private handleLocalFileRequest;
}
