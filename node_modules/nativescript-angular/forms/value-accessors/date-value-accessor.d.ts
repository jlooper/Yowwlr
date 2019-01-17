import { ElementRef } from "@angular/core";
import { BaseValueAccessor } from "./base-value-accessor";
import { DatePicker } from "tns-core-modules/ui/date-picker";
/**
 * The accessor for setting a date and listening to changes that is used by the
 * {@link NgModel} directives.
 *
 *  ### Example
 *  ```
 *  <DatePicker [(ngModel)]="model.test">
 *  ```
 */
export declare class DateValueAccessor extends BaseValueAccessor<DatePicker> {
    constructor(elementRef: ElementRef);
    writeValue(value: any): void;
}
