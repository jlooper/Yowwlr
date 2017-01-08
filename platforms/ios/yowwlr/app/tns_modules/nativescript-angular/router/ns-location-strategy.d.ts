import { LocationStrategy } from "@angular/common";
import { Frame, NavigationTransition } from "ui/frame";
export interface NavigationOptions {
    clearHistory?: boolean;
    animated?: boolean;
    transition?: NavigationTransition;
}
export interface LocationState {
    state: any;
    title: string;
    url: string;
    queryParams: string;
    isPageNavigation: boolean;
}
export declare class NSLocationStrategy extends LocationStrategy {
    private frame;
    private states;
    private popStateCallbacks;
    private _isPageNavigationgBack;
    private _currentNavigationOptions;
    constructor(frame: Frame);
    path(): string;
    prepareExternalUrl(internal: string): string;
    pushState(state: any, title: string, url: string, queryParams: string): void;
    pushStateInternal(state: any, title: string, url: string, queryParams: string): void;
    replaceState(state: any, title: string, url: string, queryParams: string): void;
    forward(): void;
    back(): void;
    canGoBack(): boolean;
    onPopState(fn: (_: any) => any): void;
    getBaseHref(): string;
    private callPopState(state, pop?);
    private peekState();
    toString(): string;
    _beginBackPageNavigation(): void;
    _finishBackPageNavigation(): void;
    _isPageNavigatingBack(): boolean;
    _beginPageNavigation(): NavigationOptions;
    _setNavigationOptions(options: NavigationOptions): void;
    _getSatates(): Array<LocationState>;
}
