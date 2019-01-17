import { ModuleWithProviders } from "@angular/core";
import { Routes, ExtraOptions } from "@angular/router";
import { NSLocationStrategy, LocationState } from "./ns-location-strategy";
import { FrameService } from "../platform-providers";
export { PageRoute } from "./page-router-outlet";
export { RouterExtensions } from "./router-extensions";
export { NSModuleFactoryLoader } from "./ns-module-factory-loader";
export { NSEmptyOutletComponent } from "./ns-empty-outlet.component";
export declare type LocationState = LocationState;
export declare class NativeScriptRouterModule {
    static forRoot(routes: Routes, config?: ExtraOptions): ModuleWithProviders;
    static forChild(routes: Routes): ModuleWithProviders;
}
export declare function provideLocationStrategy(locationStrategy: NSLocationStrategy, frameService: FrameService): NSLocationStrategy;
