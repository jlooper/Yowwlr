import { AnimationPlayer } from "@angular/animations";
import { AnimationDriver } from "@angular/animations/browser";
import { Keyframe } from "./utils";
import { NgView } from "../element-registry";
export declare class NativeScriptAnimationDriver implements AnimationDriver {
    private static validProperties;
    validateStyleProperty(property: string): boolean;
    matchesElement(element: NgView, rawSelector: string): boolean;
    containsElement(elm1: NgView, elm2: NgView): boolean;
    query(element: NgView, rawSelector: string, multi: boolean): NgView[];
    computeStyle(element: NgView, prop: string): string;
    animate(element: NgView, keyframes: Keyframe[], duration: number, delay: number, easing: string): AnimationPlayer;
    private makeSelector;
    private visitDescendants;
}
