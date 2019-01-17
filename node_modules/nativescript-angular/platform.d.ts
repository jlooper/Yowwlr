import "reflect-metadata";
import { AppOptions } from "./platform-common";
import { PlatformRef, StaticProvider } from "@angular/core";
import "./dom-adapter";
export declare const NS_COMPILER_PROVIDERS: StaticProvider[];
export declare function platformNativeScriptDynamic(options?: AppOptions, extraProviders?: any[]): PlatformRef;
