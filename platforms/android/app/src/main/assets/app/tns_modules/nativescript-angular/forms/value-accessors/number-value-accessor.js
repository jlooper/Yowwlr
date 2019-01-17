Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var base_value_accessor_1 = require("./base-value-accessor");
var NUMBER_VALUE_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return NumberValueAccessor; }),
    multi: true,
};
/**
 * The accessor for setting a value and listening to changes that is used by the
 * {@link NgModel}
 *
 *  ### Example
 *  ```
 *  <Slider [(ngModel)]="model.test">
 *  ```
 */
var NumberValueAccessor = /** @class */ (function (_super) {
    __extends(NumberValueAccessor, _super);
    function NumberValueAccessor(elementRef) {
        return _super.call(this, elementRef.nativeElement) || this;
    }
    NumberValueAccessor.prototype.writeValue = function (value) {
        var normalized = _super.prototype.normalizeValue.call(this, value);
        this.view.value = normalized;
    };
    NumberValueAccessor = __decorate([
        core_1.Directive({
            selector: "Slider[ngModel],Slider[formControlName],Slider[formControl]," +
                "slider[ngModel],slider[formControlName],slider[formControl]",
            providers: [NUMBER_VALUE_ACCESSOR],
            host: {
                "(valueChange)": "onChange($event.value)",
            },
        }),
        __metadata("design:paramtypes", [core_1.ElementRef])
    ], NumberValueAccessor);
    return NumberValueAccessor;
}(base_value_accessor_1.BaseValueAccessor));
exports.NumberValueAccessor = NumberValueAccessor;
//# sourceMappingURL=number-value-accessor.js.map