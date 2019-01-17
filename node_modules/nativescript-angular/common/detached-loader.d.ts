import { ComponentRef, ComponentFactory, ViewContainerRef, Type, ComponentFactoryResolver, ChangeDetectorRef } from "@angular/core";
export declare const CATEGORY = "detached-loader";
/**
 * Wrapper component used for loading components when navigating
 * It uses DetachedContainer as selector so that it is containerRef is not attached to
 * the visual tree.
 */
export declare class DetachedLoader {
    private resolver;
    private changeDetector;
    private containerRef;
    constructor(resolver: ComponentFactoryResolver, changeDetector: ChangeDetectorRef, containerRef: ViewContainerRef);
    private loadInLocation;
    detectChanges(): void;
    loadComponent(componentType: Type<any>): Promise<ComponentRef<any>>;
    loadWithFactory<T>(factory: ComponentFactory<T>): ComponentRef<T>;
}
