import { NSLocationStrategy } from "./ns-location-strategy";
import { PlatformLocation, LocationChangeListener } from "@angular/common";
export declare class NativescriptPlatformLocation extends PlatformLocation {
    private locationStartegy;
    constructor(locationStartegy: NSLocationStrategy);
    getBaseHrefFromDOM(): string;
    onPopState(fn: LocationChangeListener): void;
    onHashChange(_fn: LocationChangeListener): void;
    readonly search: string;
    readonly hash: string;
    pathname: string;
    pushState(state: any, title: string, url: string): void;
    replaceState(state: any, title: string, url: string): void;
    forward(): void;
    back(): void;
}
