import { ModuleWithProviders } from "@angular/core";
import { Routes, ExtraOptions } from "@angular/router";
export { routerTraceCategory } from "./trace";
export { PageRoute } from "./router/page-router-outlet";
export { RouterExtensions } from "./router/router-extensions";
export declare class NativeScriptRouterModule {
    static forRoot(routes: Routes, config?: ExtraOptions): ModuleWithProviders;
    static forChild(routes: Routes): ModuleWithProviders;
}
