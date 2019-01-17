import { ControlValueAccessor } from "@angular/forms";
import { View } from "tns-core-modules/ui/core/view";
export declare class BaseValueAccessor<TView extends View> implements ControlValueAccessor {
    view: TView;
    private pendingChangeNotification;
    onChange: (_: any) => void;
    onTouched: () => void;
    constructor(view: TView);
    registerOnChange(fn: (_: any) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(isDisabled: boolean): void;
    writeValue(_: any): void;
    protected normalizeValue(value: any): any;
}
