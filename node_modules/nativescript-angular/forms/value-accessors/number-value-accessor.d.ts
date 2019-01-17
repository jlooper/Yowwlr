import { ElementRef } from "@angular/core";
import { BaseValueAccessor } from "./base-value-accessor";
import { Slider } from "tns-core-modules/ui/slider";
/**
 * The accessor for setting a value and listening to changes that is used by the
 * {@link NgModel}
 *
 *  ### Example
 *  ```
 *  <Slider [(ngModel)]="model.test">
 *  ```
 */
export declare class NumberValueAccessor extends BaseValueAccessor<Slider> {
    constructor(elementRef: ElementRef);
    writeValue(value: any): void;
}
