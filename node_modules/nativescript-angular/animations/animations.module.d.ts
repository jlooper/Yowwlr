import { NgZone, Provider } from "@angular/core";
import { AnimationDriver, ɵAnimationStyleNormalizer as AnimationStyleNormalizer, ɵWebAnimationsStyleNormalizer as WebAnimationsStyleNormalizer, ɵAnimationEngine as AnimationEngine } from "@angular/animations/browser";
import { ɵAnimationRendererFactory as AnimationRendererFactory } from "@angular/platform-browser/animations";
import { NativeScriptRendererFactory } from "../renderer";
import { NativeScriptAnimationDriver } from "./animation-driver";
export declare class InjectableAnimationEngine extends AnimationEngine {
    constructor(doc: any, driver: AnimationDriver, normalizer: AnimationStyleNormalizer);
}
export declare function instantiateSupportedAnimationDriver(): NativeScriptAnimationDriver;
export declare function instantiateRendererFactory(renderer: NativeScriptRendererFactory, engine: AnimationEngine, zone: NgZone): AnimationRendererFactory;
export declare function instantiateDefaultStyleNormalizer(): WebAnimationsStyleNormalizer;
export declare const NATIVESCRIPT_ANIMATIONS_PROVIDERS: Provider[];
export declare class NativeScriptAnimationsModule {
    constructor(parentModule: NativeScriptAnimationsModule);
}
