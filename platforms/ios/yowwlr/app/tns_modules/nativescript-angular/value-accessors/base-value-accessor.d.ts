import { ControlValueAccessor } from "@angular/forms";
export declare class BaseValueAccessor<TView> implements ControlValueAccessor {
    view: TView;
    constructor(view: TView);
    onChange: (_: any) => void;
    private pendingChangeNotification;
    registerOnChange(fn: (_: any) => void): void;
    writeValue(_: any): void;
    registerOnTouched(_: () => void): void;
}
