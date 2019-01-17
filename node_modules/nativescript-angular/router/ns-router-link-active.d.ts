import { AfterContentInit, ElementRef, OnChanges, OnDestroy, QueryList, Renderer } from "@angular/core";
import { Router } from "@angular/router";
import { NSRouterLink } from "./ns-router-link";
/**
 * The NSRouterLinkActive directive lets you add a CSS class to an element when the link"s route
 * becomes active.
 *
 * Consider the following example:
 *
 * ```
 * <a [nsRouterLink]="/user/bob" [nsRouterLinkActive]="active-link">Bob</a>
 * ```
 *
 * When the url is either "/user" or "/user/bob", the active-link class will
 * be added to the component. If the url changes, the class will be removed.
 *
 * You can set more than one class, as follows:
 *
 * ```
 * <a [nsRouterLink]="/user/bob" [nsRouterLinkActive]="class1 class2">Bob</a>
 * <a [nsRouterLink]="/user/bob" [nsRouterLinkActive]="["class1", "class2"]">Bob</a>
 * ```
 *
 * You can configure NSRouterLinkActive by passing `exact: true`. This will add the
 * classes only when the url matches the link exactly.
 *
 * ```
 * <a [nsRouterLink]="/user/bob" [nsRouterLinkActive]="active-link"
 * [nsRouterLinkActiveOptions]="{exact: true}">Bob</a>
 * ```
 *
 * Finally, you can apply the NSRouterLinkActive directive to an ancestor of a RouterLink.
 *
 * ```
 * <div [nsRouterLinkActive]="active-link" [nsRouterLinkActiveOptions]="{exact: true}">
 *   <a [nsRouterLink]="/user/jim">Jim</a>
 *   <a [nsRouterLink]="/user/bob">Bob</a>
 * </div>
 * ```
 *
 * This will set the active-link class on the div tag if the url is either "/user/jim" or
 * "/user/bob".
 *
 * @stable
 */
export declare class NSRouterLinkActive implements OnChanges, OnDestroy, AfterContentInit {
    private router;
    private element;
    private renderer;
    links: QueryList<NSRouterLink>;
    private classes;
    private subscription;
    private active;
    nsRouterLinkActiveOptions: {
        exact: boolean;
    };
    constructor(router: Router, element: ElementRef, renderer: Renderer);
    readonly isActive: boolean;
    ngAfterContentInit(): void;
    nsRouterLinkActive: string[] | string;
    ngOnChanges(_: {}): any;
    ngOnDestroy(): any;
    private update;
    private reduceList;
    private isLinkActive;
    private hasActiveLinks;
}
