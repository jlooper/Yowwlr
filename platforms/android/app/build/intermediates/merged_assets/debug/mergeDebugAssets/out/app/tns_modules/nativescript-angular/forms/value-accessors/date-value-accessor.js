Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var base_value_accessor_1 = require("./base-value-accessor");
var DATE_VALUE_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return DateValueAccessor; }),
    multi: true,
};
/**
 * The accessor for setting a date and listening to changes that is used by the
 * {@link NgModel} directives.
 *
 *  ### Example
 *  ```
 *  <DatePicker [(ngModel)]="model.test">
 *  ```
 */
var DateValueAccessor = /** @class */ (function (_super) {
    __extends(DateValueAccessor, _super);
    function DateValueAccessor(elementRef) {
        return _super.call(this, elementRef.nativeElement) || this;
    }
    DateValueAccessor.prototype.writeValue = function (value) {
        var normalized = _super.prototype.normalizeValue.call(this, value);
        this.view.date = normalized;
    };
    DateValueAccessor = __decorate([
        core_1.Directive({
            selector: "DatePicker[ngModel],DatePicker[formControlName],DatePicker[formControl]," +
                "datepicker[ngModel],datepicker[formControlName],datepicker[formControl]," +
                "datePicker[ngModel],datePicker[formControlName],datePicker[formControl]," +
                "date-picker[ngModel],date-picker[formControlName],date-picker[formControl]",
            providers: [DATE_VALUE_ACCESSOR],
            host: {
                "(dateChange)": "onChange($event.value)",
            },
        }),
        __metadata("design:paramtypes", [core_1.ElementRef])
    ], DateValueAccessor);
    return DateValueAccessor;
}(base_value_accessor_1.BaseValueAccessor));
exports.DateValueAccessor = DateValueAccessor;
//# sourceMappingURL=date-value-accessor.js.map