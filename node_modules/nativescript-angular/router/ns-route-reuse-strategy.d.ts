import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from "@angular/router";
import { NSLocationStrategy } from "./ns-location-strategy";
/**
 * Detaches subtrees loaded inside PageRouterOutlet in forward navigation
 * and reattaches them on back.
 * Reuses routes as long as their route config is the same.
 */
export declare class NSRouteReuseStrategy implements RouteReuseStrategy {
    private location;
    private cacheByOutlet;
    constructor(location: NSLocationStrategy);
    shouldDetach(route: ActivatedRouteSnapshot): boolean;
    shouldAttach(route: ActivatedRouteSnapshot): boolean;
    store(route: ActivatedRouteSnapshot, state: DetachedRouteHandle): void;
    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null;
    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean;
    clearCache(outletKey: string): void;
    clearModalCache(outletKey: string): void;
}
