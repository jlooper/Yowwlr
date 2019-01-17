import { ActivatedRoute, Router, UrlTree } from "@angular/router";
import { RouterExtensions } from "./router-extensions";
import { NavigationTransition } from "tns-core-modules/ui/frame";
export declare type QueryParamsHandling = "merge" | "preserve" | "";
/**
 * The nsRouterLink directive lets you link to specific parts of your app.
 *
 * Consider the following route configuration:
 * ```
 * [{ path: "/user", component: UserCmp }]
 * ```
 *
 * When linking to this `User` route, you can write:
 *
 * ```
 * <a [nsRouterLink]="["/user"]">link to user component</a>
 * ```
 *
 * NSRouterLink expects the value to be an array of path segments, followed by the params
 * for that level of routing. For instance `["/team", {teamId: 1}, "user", {userId: 2}]`
 * means that we want to generate a link to `/team;teamId=1/user;userId=2`.
 *
 * The first segment name can be prepended with `/`, `./`, or `../`.
 * If the segment begins with `/`, the router will look up the route from the root of the app.
 * If the segment begins with `./`, or doesn"t begin with a slash, the router will
 * instead look in the current component"s children for the route.
 * And if the segment begins with `../`, the router will go up one level.
 */
export declare class NSRouterLink {
    private router;
    private navigator;
    private route;
    target: string;
    queryParams: {
        [k: string]: any;
    };
    fragment: string;
    queryParamsHandling: QueryParamsHandling;
    preserveQueryParams: boolean;
    preserveFragment: boolean;
    skipLocationChange: boolean;
    replaceUrl: boolean;
    clearHistory: boolean;
    pageTransition: boolean | string | NavigationTransition;
    pageTransitionDuration: any;
    private commands;
    constructor(router: Router, navigator: RouterExtensions, route: ActivatedRoute);
    params: any[] | string;
    onTap(): void;
    private getExtras;
    readonly urlTree: UrlTree;
    private convertClearHistory;
    private getTransition;
}
