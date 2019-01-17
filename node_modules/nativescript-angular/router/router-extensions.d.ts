import { Router, UrlTree, NavigationExtras, ActivatedRoute } from "@angular/router";
import { NSLocationStrategy, NavigationOptions } from "./ns-location-strategy";
import { FrameService } from "../platform-providers";
export declare type ExtendedNavigationExtras = NavigationExtras & NavigationOptions;
export interface BackNavigationOptions {
    outlets?: Array<string>;
    relativeTo?: ActivatedRoute | null;
}
export declare class RouterExtensions {
    router: Router;
    locationStrategy: NSLocationStrategy;
    frameService: FrameService;
    constructor(router: Router, locationStrategy: NSLocationStrategy, frameService: FrameService);
    navigate(commands: any[], extras?: ExtendedNavigationExtras): Promise<boolean>;
    navigateByUrl(url: string | UrlTree, options?: NavigationOptions): Promise<boolean>;
    back(backNavigationOptions?: BackNavigationOptions): void;
    canGoBack(backNavigationOptions?: BackNavigationOptions): boolean;
    backToPreviousPage(): void;
    canGoBackToPreviousPage(): boolean;
    private backOutlets;
    private findOutletsToBack;
    private findOutletByRoute;
}
