import { ElementRef } from "@angular/core";
import { BaseValueAccessor } from "./base-value-accessor";
import { View } from "tns-core-modules/ui/core/view";
export declare type TextView = {
    text: string;
} & View;
/**
 * The accessor for writing a text and listening to changes that is used by the
 * {@link NgModel} directives.
 *
 *  ### Example
 *  ```
 *  <TextField [(ngModel)]="model.test">
 *  ```
 */
export declare class TextValueAccessor extends BaseValueAccessor<TextView> {
    constructor(elementRef: ElementRef);
    writeValue(value: any): void;
}
