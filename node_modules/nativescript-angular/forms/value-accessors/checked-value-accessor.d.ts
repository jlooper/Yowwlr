import { ElementRef } from "@angular/core";
import { BaseValueAccessor } from "./base-value-accessor";
import { Switch } from "tns-core-modules/ui/switch";
/**
 * The accessor for setting a checked property and listening to changes that is used by the
 * {@link NgModel} directives.
 *
 *  ### Example
 *  ```
 *  <Switch [(ngModel)]="model.test">
 *  ```
 */
export declare class CheckedValueAccessor extends BaseValueAccessor<Switch> {
    constructor(elementRef: ElementRef);
    writeValue(value: any): void;
}
