import { NgModuleRef, Type, ViewContainerRef } from "@angular/core";
import { NSLocationStrategy } from "../router/ns-location-strategy";
export interface ModalDialogOptions {
    context?: any;
    fullscreen?: boolean;
    animated?: boolean;
    stretched?: boolean;
    viewContainerRef?: ViewContainerRef;
    moduleRef?: NgModuleRef<any>;
}
export declare class ModalDialogParams {
    context: any;
    closeCallback: (...args: any[]) => any;
    constructor(context: any, closeCallback: (...args: any[]) => any);
}
export declare class ModalDialogService {
    private location;
    constructor(location: NSLocationStrategy);
    showModal(type: Type<any>, { viewContainerRef, moduleRef, context, fullscreen, animated, stretched }: ModalDialogOptions): Promise<any>;
    private _showDialog;
}
export declare class ModalDialogHost {
    constructor();
}
