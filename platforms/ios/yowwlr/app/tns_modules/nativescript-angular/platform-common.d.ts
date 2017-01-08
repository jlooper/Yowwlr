import "globals";
import "./zone.js/dist/zone-nativescript";
import "reflect-metadata";
import "./polyfills/array";
import "./polyfills/console";
import { Type, Injector, CompilerOptions, PlatformRef, NgModuleFactory, NgModuleRef, EventEmitter, Provider, Sanitizer, OpaqueToken } from "@angular/core";
import { PageFactory } from "./platform-providers";
import "nativescript-intl";
export declare const onBeforeLivesync: EventEmitter<NgModuleRef<any>>;
export declare const onAfterLivesync: EventEmitter<NgModuleRef<any>>;
export interface AppOptions {
    bootInExistingPage?: boolean;
    cssFile?: string;
    startPageActionBarHidden?: boolean;
}
export declare type PlatformFactory = (extraProviders?: Provider[]) => PlatformRef;
export declare class NativeScriptSanitizer extends Sanitizer {
    sanitize(_context: any, value: string): string;
}
export declare const COMMON_PROVIDERS: ({
    provide: OpaqueToken;
    useValue: PageFactory;
} | {
    provide: typeof Sanitizer;
    useClass: typeof NativeScriptSanitizer;
})[];
export declare class NativeScriptPlatformRef extends PlatformRef {
    private platform;
    private appOptions;
    private _bootstrapper;
    constructor(platform: PlatformRef, appOptions?: AppOptions);
    bootstrapModuleFactory<M>(moduleFactory: NgModuleFactory<M>): Promise<NgModuleRef<M>>;
    bootstrapModule<M>(moduleType: Type<M>, compilerOptions?: CompilerOptions | CompilerOptions[]): Promise<NgModuleRef<M>>;
    private bootstrapApp();
    livesyncModule(): void;
    onDestroy(callback: () => void): void;
    readonly injector: Injector;
    destroy(): void;
    readonly destroyed: boolean;
    private createNavigationEntry(bootstrapAction, resolve?, reject?, isLivesync?, isReboot?);
    liveSyncApp(): void;
}
