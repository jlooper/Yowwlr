import { ViewContainerRef, Type } from "@angular/core";
export interface ModalDialogOptions {
    context?: any;
    fullscreen?: boolean;
    viewContainerRef?: ViewContainerRef;
}
export declare class ModalDialogParams {
    context: any;
    closeCallback: (...args) => any;
    constructor(context: any, closeCallback: (...args) => any);
}
export declare class ModalDialogService {
    showModal(type: Type<any>, options: ModalDialogOptions): Promise<any>;
    private static showDialog(type, options, doneCallback, containerRef, resolver, parentPage, pageFactory);
}
export declare class ModalDialogHost {
    constructor();
}
