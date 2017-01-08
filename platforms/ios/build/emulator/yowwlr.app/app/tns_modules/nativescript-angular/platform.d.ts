import { AppOptions } from "./platform-common";
import { ElementSchemaRegistry, ResourceLoader } from "@angular/compiler";
import { PlatformRef, OpaqueToken } from "@angular/core";
import { NativeScriptElementSchemaRegistry } from "./dom-adapter";
import { FileSystemResourceLoader } from "./resource-loader";
export { NativeScriptModule } from "./nativescript.module";
export declare const NS_COMPILER_PROVIDERS: (any[] | {
    provide: OpaqueToken;
    useValue: {
        providers: ({
            provide: typeof ResourceLoader;
            useClass: typeof FileSystemResourceLoader;
        } | {
            provide: typeof ElementSchemaRegistry;
            useClass: typeof NativeScriptElementSchemaRegistry;
        })[];
    };
    multi: boolean;
})[];
export declare function platformNativeScriptDynamic(options?: AppOptions, extraProviders?: any[]): PlatformRef;
