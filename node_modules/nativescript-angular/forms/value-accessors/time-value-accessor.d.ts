import { ElementRef } from "@angular/core";
import { BaseValueAccessor } from "./base-value-accessor";
import { TimePicker } from "tns-core-modules/ui/time-picker";
/**
 * The accessor for setting a time and listening to changes that is used by the
 * {@link NgModel} directives.
 *
 *  ### Example
 *  ```
 *  <TimePicker [(ngModel)]="model.test">
 *  ```
 */
export declare class TimeValueAccessor extends BaseValueAccessor<TimePicker> {
    constructor(elementRef: ElementRef);
    writeValue(value: any): void;
}
