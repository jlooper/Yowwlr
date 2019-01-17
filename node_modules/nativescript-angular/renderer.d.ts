import { NgZone, Renderer2, RendererFactory2, RendererType2, RendererStyleFlags2 } from "@angular/core";
import { Device } from "tns-core-modules/platform";
import { View } from "tns-core-modules/ui/core/view";
import { ViewUtil } from "./view-util";
import { NgView, InvisibleNode } from "./element-registry";
export declare const COMPONENT_VARIABLE = "%COMP%";
export declare const HOST_ATTR: string;
export declare const CONTENT_ATTR: string;
export interface ElementReference {
    previous: NgView;
    next: NgView;
}
export declare class NativeScriptRendererFactory implements RendererFactory2 {
    private zone;
    private componentRenderers;
    private viewUtil;
    private defaultRenderer;
    private rootNgView;
    constructor(rootView: View, device: Device, zone: NgZone);
    private setRootNgView;
    createRenderer(element: any, type: RendererType2): NativeScriptRenderer;
}
export declare class NativeScriptRenderer extends Renderer2 {
    private rootView;
    private zone;
    private viewUtil;
    data: {
        [key: string]: any;
    };
    constructor(rootView: NgView, zone: NgZone, viewUtil: ViewUtil);
    appendChild(parent: NgView, newChild: NgView): void;
    insertBefore(parent: NgView, newChild: NgView, { previous, next }: ElementReference): void;
    removeChild(parent: any, oldChild: NgView): void;
    selectRootElement(selector: string): NgView;
    parentNode(node: NgView): any;
    nextSibling(node: NgView): ElementReference;
    createComment(_value: any): InvisibleNode;
    createElement(name: any, _namespace: string): NgView;
    createText(_value: string): InvisibleNode;
    createViewRoot(hostElement: NgView): NgView;
    projectNodes(parentElement: NgView, nodes: NgView[]): void;
    destroy(): void;
    setAttribute(view: NgView, name: string, value: string, namespace?: string): void;
    removeAttribute(_el: NgView, _name: string): void;
    setProperty(view: any, name: string, value: any): void;
    addClass(view: NgView, name: string): void;
    removeClass(view: NgView, name: string): void;
    setStyle(view: NgView, styleName: string, value: any, _flags?: RendererStyleFlags2): void;
    removeStyle(view: NgView, styleName: string, _flags?: RendererStyleFlags2): void;
    setBindingDebugInfo(renderElement: NgView, propertyName: string, propertyValue: string): void;
    setElementDebugInfo(renderElement: any, _info: any): void;
    invokeElementMethod(_renderElement: NgView, methodName: string, args: Array<any>): void;
    setValue(_renderNode: any, _value: string): void;
    listen(renderElement: any, eventName: string, callback: (event: any) => boolean): () => void;
}
