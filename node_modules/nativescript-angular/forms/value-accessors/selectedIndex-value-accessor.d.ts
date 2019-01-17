import { ElementRef, AfterViewInit } from "@angular/core";
import { BaseValueAccessor } from "./base-value-accessor";
import { View } from "tns-core-modules/ui/core/view";
export declare type SelectableView = {
    selectedIndex: number;
} & View;
/**
 * The accessor for setting a selectedIndex and listening to changes that is used by the
 * {@link NgModel} directives.
 *
 *  ### Example
 *  ```
 *  <SegmentedBar [(ngModel)]="model.test">
 *  ```
 */
export declare class SelectedIndexValueAccessor extends BaseValueAccessor<SelectableView> implements AfterViewInit {
    constructor(elementRef: ElementRef);
    private value;
    private viewInitialized;
    writeValue(value: any): void;
    ngAfterViewInit(): void;
}
