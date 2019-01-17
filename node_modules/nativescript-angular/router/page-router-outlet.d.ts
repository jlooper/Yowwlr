import { ChangeDetectorRef, ComponentFactoryResolver, ComponentRef, Injector, OnDestroy, EventEmitter, ViewContainerRef, ElementRef } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, ChildrenOutletContexts } from "@angular/router";
import { Device } from "tns-core-modules/platform";
import { BehaviorSubject } from "rxjs";
import { PageFactory } from "../platform-providers";
import { NSLocationStrategy } from "./ns-location-strategy";
import { NSRouteReuseStrategy } from "./ns-route-reuse-strategy";
export declare class PageRoute {
    activatedRoute: BehaviorSubject<ActivatedRoute>;
    constructor(startRoute: ActivatedRoute);
}
export declare const pageRouterActivatedSymbol: unique symbol;
export declare const loaderRefSymbol: unique symbol;
export declare function destroyComponentRef(componentRef: ComponentRef<any>): void;
/**
 * There are cases where multiple activatedRoute nodes should be associated/handled by the same PageRouterOutlet.
 * We can gat additional ActivatedRoutes nodes when there is:
 *  - Lazy loading - there is an additional ActivatedRoute node for the RouteConfig with the `loadChildren` setup
 *  - Componentless routes - there is an additional ActivatedRoute node for the componentless RouteConfig
 *
 * Example:
 *   R  <-- root
 *   |
 * feature (lazy module) <-- RouteConfig: { path: "lazy", loadChildren: "./feature/feature.module#FeatureModule" }
 *   |
 * module (componentless route) <-- RouteConfig: { path: "module", children: [...] } // Note: No 'component'
 *   |
 *  home <-- RouteConfig: { path: "module", component: MyComponent } - this is what we get as activatedRoute param
 *
 *  In these cases we will mark the top-most node (feature). NSRouteReuseStrategy will detach the tree there and
 *  use this ActivateRoute as a kay for caching.
 */
export declare function findTopActivatedRouteNodeForOutlet(activatedRoute: ActivatedRouteSnapshot): ActivatedRouteSnapshot;
export declare class PageRouterOutlet implements OnDestroy {
    private parentContexts;
    private location;
    private locationStrategy;
    private componentFactoryResolver;
    private resolver;
    private changeDetector;
    private pageFactory;
    private routeReuseStrategy;
    private activated;
    private _activatedRoute;
    private detachedLoaderFactory;
    private outlet;
    private name;
    private isEmptyOutlet;
    private viewUtil;
    private frame;
    activateEvents: EventEmitter<any>;
    deactivateEvents: EventEmitter<any>;
    /** @deprecated from Angular since v4 */
    readonly locationInjector: Injector;
    /** @deprecated from Angular since v4 */
    readonly locationFactoryResolver: ComponentFactoryResolver;
    readonly isActivated: boolean;
    readonly component: Object;
    readonly activatedRoute: ActivatedRoute;
    constructor(parentContexts: ChildrenOutletContexts, location: ViewContainerRef, name: string, actionBarVisibility: string, isEmptyOutlet: boolean, locationStrategy: NSLocationStrategy, componentFactoryResolver: ComponentFactoryResolver, resolver: ComponentFactoryResolver, changeDetector: ChangeDetectorRef, device: Device, pageFactory: PageFactory, routeReuseStrategy: NSRouteReuseStrategy, elRef: ElementRef);
    setActionBarVisibility(actionBarVisibility: string): void;
    ngOnDestroy(): void;
    deactivate(): void;
    /**
     * Called when the `RouteReuseStrategy` instructs to detach the subtree
     */
    detach(): ComponentRef<any>;
    /**
     * Called when the `RouteReuseStrategy` instructs to re-attach a previously detached subtree
     */
    attach(ref: ComponentRef<any>, activatedRoute: ActivatedRoute): void;
    /**
     * Called by the Router to instantiate a new component during the commit phase of a navigation.
     * This method in turn is responsible for calling the `routerOnActivate` hook of its child.
     */
    activateWith(activatedRoute: ActivatedRoute, resolver: ComponentFactoryResolver | null): void;
    private activateOnGoForward;
    private loadComponentInPage;
    private markActivatedRoute;
    private getComponentFactory;
    private getOutlet;
}
