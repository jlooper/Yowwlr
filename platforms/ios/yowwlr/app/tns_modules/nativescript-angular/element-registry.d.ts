import { View } from "ui/core/view";
export declare type ViewResolver = () => ViewClass;
export declare type NgView = View & ViewExtensions;
export declare const TEMPLATE: string;
export interface ViewClassMeta {
    skipAddToDom?: boolean;
    insertChild?: (parent: NgView, child: NgView, atIndex: number) => void;
    removeChild?: (parent: NgView, child: NgView) => void;
    isTemplateAnchor?: boolean;
}
export interface ViewExtensions {
    nodeName: string;
    templateParent: NgView;
    ngCssClasses: Map<string, boolean>;
    meta: ViewClassMeta;
}
export interface ViewClass {
    new (): View;
}
export declare function registerElement(elementName: string, resolver: ViewResolver, meta?: ViewClassMeta): void;
export declare function getViewClass(elementName: string): ViewClass;
export declare function getViewMeta(nodeName: string): ViewClassMeta;
export declare function isKnownView(elementName: string): boolean;
export declare class TemplateView extends View {
}
