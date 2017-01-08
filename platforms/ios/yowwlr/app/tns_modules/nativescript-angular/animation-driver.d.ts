import { AnimationPlayer } from "@angular/core";
import { AnimationStyles, AnimationKeyframe } from "./private_import_core";
export declare abstract class AnimationDriver {
    abstract animate(element: any, startingStyles: AnimationStyles, keyframes: AnimationKeyframe[], duration: number, delay: number, easing: string): AnimationPlayer;
}
export declare class NativeScriptAnimationDriver implements AnimationDriver {
    computeStyle(element: any, prop: string): string;
    animate(element: any, _startingStyles: AnimationStyles, keyframes: AnimationKeyframe[], duration: number, delay: number, easing: string): AnimationPlayer;
}
