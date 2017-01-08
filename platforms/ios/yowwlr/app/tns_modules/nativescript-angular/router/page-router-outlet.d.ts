import { ResolvedReflectiveProvider, ViewContainerRef, ComponentFactoryResolver, Injector } from "@angular/core";
import { RouterOutletMap, ActivatedRoute } from "@angular/router";
import { NSLocationStrategy } from "./ns-location-strategy";
import { PageFactory } from "../platform-providers";
import { Device } from "platform";
import { Frame } from "ui/frame";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
export declare class PageRoute {
    activatedRoute: BehaviorSubject<ActivatedRoute>;
    constructor(startRoute: ActivatedRoute);
}
export declare class PageRouterOutlet {
    private containerRef;
    private locationStrategy;
    private componentFactoryResolver;
    private resolver;
    private frame;
    private pageFactory;
    private viewUtil;
    private refCache;
    private isInitialPage;
    private detachedLoaderFactory;
    private currentActivatedComp;
    private currentActivatedRoute;
    outletMap: RouterOutletMap;
    readonly locationInjector: Injector;
    readonly locationFactoryResolver: ComponentFactoryResolver;
    readonly isActivated: boolean;
    readonly component: Object;
    readonly activatedRoute: ActivatedRoute;
    constructor(parentOutletMap: RouterOutletMap, containerRef: ViewContainerRef, name: string, locationStrategy: NSLocationStrategy, componentFactoryResolver: ComponentFactoryResolver, resolver: ComponentFactoryResolver, frame: Frame, device: Device, pageFactory: PageFactory);
    deactivate(): void;
    private clearRefCache();
    private destroyCacheItem(poppedItem);
    /**
     * Called by the Router to instantiate a new component during the commit phase of a navigation.
     * This method in turn is responsible for calling the `routerOnActivate` hook of its child.
     */
    activate(activatedRoute: ActivatedRoute, resolver: ComponentFactoryResolver, injector: Injector, providers: ResolvedReflectiveProvider[], outletMap: RouterOutletMap): void;
    private activateOnGoForward(activatedRoute, providers, outletMap, loadedResolver, injector);
    private activateOnGoBack(activatedRoute, outletMap);
    private loadComponentInPage(page, componentRef);
    private getComponentFactory(activatedRoute, loadedResolver);
}
