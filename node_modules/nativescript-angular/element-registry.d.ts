import { View } from "tns-core-modules/ui/core/view";
export declare type NgView = (View & ViewExtensions);
export interface ViewExtensions {
    meta: ViewClassMeta;
    nodeType: number;
    nodeName: string;
    parentNode: NgView;
    nextSibling: NgView;
    firstChild: NgView;
    lastChild: NgView;
    ngCssClasses: Map<string, boolean>;
}
export interface ViewClass {
    new (): View;
}
export declare abstract class InvisibleNode extends View implements NgView {
    meta: {
        skipAddToDom: boolean;
    };
    nodeType: number;
    nodeName: string;
    parentNode: NgView;
    nextSibling: NgView;
    firstChild: NgView;
    lastChild: NgView;
    ngCssClasses: Map<string, boolean>;
    constructor();
    toString(): string;
}
export declare class CommentNode extends InvisibleNode {
    protected static id: number;
    constructor();
}
export declare class TextNode extends InvisibleNode {
    protected static id: number;
    constructor();
}
export interface ViewClassMeta {
    skipAddToDom?: boolean;
    insertChild?: (parent: any, child: any, next?: any) => void;
    removeChild?: (parent: any, child: any) => void;
}
export declare function isDetachedElement(element: any): boolean;
export declare function isView(view: any): view is NgView;
export declare function isInvisibleNode(view: any): view is InvisibleNode;
export declare type ViewResolver = () => ViewClass;
export declare function registerElement(elementName: string, resolver: ViewResolver, meta?: ViewClassMeta): void;
export declare function getViewClass(elementName: string): ViewClass;
export declare function getViewMeta(nodeName: string): ViewClassMeta;
export declare function isKnownView(elementName: string): boolean;
export declare function getSingleViewRecursive(nodes: Array<any>, nestLevel: number): View;
