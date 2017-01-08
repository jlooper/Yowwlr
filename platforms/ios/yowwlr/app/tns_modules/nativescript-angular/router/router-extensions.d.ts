import { Router, UrlTree, NavigationExtras } from "@angular/router";
import { NSLocationStrategy, NavigationOptions } from "./ns-location-strategy";
import { Frame } from "ui/frame";
export declare type ExtendedNavigationExtras = NavigationExtras & NavigationOptions;
export declare class RouterExtensions {
    router: Router;
    locationStrategy: NSLocationStrategy;
    frame: Frame;
    constructor(router: Router, locationStrategy: NSLocationStrategy, frame: Frame);
    navigate(commands: any[], extras?: ExtendedNavigationExtras): Promise<boolean>;
    navigateByUrl(url: string | UrlTree, options?: NavigationOptions): Promise<boolean>;
    back(): void;
    canGoBack(): boolean;
    backToPreviousPage(): void;
    canGoBackToPreviousPage(): boolean;
}
