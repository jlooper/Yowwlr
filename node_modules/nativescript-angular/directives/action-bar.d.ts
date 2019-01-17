import { ElementRef, OnDestroy } from "@angular/core";
import { ActionItem, NavigationButton } from "tns-core-modules/ui/action-bar";
import { Page } from "tns-core-modules/ui/page";
export declare function isActionItem(view: any): view is ActionItem;
export declare function isNavigationButton(view: any): view is NavigationButton;
export declare class ActionBarComponent {
    element: ElementRef;
    private page;
    constructor(element: ElementRef, page: Page);
}
export declare class ActionBarScope {
    private page;
    constructor(page: Page);
    onNavButtonInit(navBtn: NavigationButtonDirective): void;
    onNavButtonDestroy(navBtn: NavigationButtonDirective): void;
    onActionInit(item: ActionItemDirective): void;
    onActionDestroy(item: ActionItemDirective): void;
}
export declare class ActionItemDirective implements OnDestroy {
    element: ElementRef;
    private ownerScope;
    constructor(element: ElementRef, ownerScope: ActionBarScope);
    ngOnDestroy(): void;
}
export declare class NavigationButtonDirective implements OnDestroy {
    element: ElementRef;
    private ownerScope;
    constructor(element: ElementRef, ownerScope: ActionBarScope);
    ngOnDestroy(): void;
}
