import "tns-core-modules/globals";
import "tns-core-modules/application";
import "./zone-js/dist/zone-nativescript";
import "./polyfills/array";
import "./polyfills/console";
import { ErrorHandler } from "@angular/core";
export declare function errorHandlerFactory(): ErrorHandler;
export declare class NativeScriptModule {
    constructor(parentModule: NativeScriptModule);
}
