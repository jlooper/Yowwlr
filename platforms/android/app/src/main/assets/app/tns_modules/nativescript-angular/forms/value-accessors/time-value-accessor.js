Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var base_value_accessor_1 = require("./base-value-accessor");
var TIME_VALUE_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return TimeValueAccessor; }),
    multi: true,
};
/**
 * The accessor for setting a time and listening to changes that is used by the
 * {@link NgModel} directives.
 *
 *  ### Example
 *  ```
 *  <TimePicker [(ngModel)]="model.test">
 *  ```
 */
var TimeValueAccessor = /** @class */ (function (_super) {
    __extends(TimeValueAccessor, _super);
    function TimeValueAccessor(elementRef) {
        return _super.call(this, elementRef.nativeElement) || this;
    }
    TimeValueAccessor.prototype.writeValue = function (value) {
        var normalized = _super.prototype.normalizeValue.call(this, value);
        this.view.time = normalized;
    };
    TimeValueAccessor = __decorate([
        core_1.Directive({
            selector: "TimePicker[ngModel],TimePicker[formControlName],TimePicker[formControl]," +
                "timepicker[ngModel],timepicker[formControlName],timepicker[formControl]," +
                "timePicker[ngModel],timePicker[formControlName],timePicker[formControl]," +
                "time-picker[ngModel],time-picker[formControlName],time-picker[formControl]",
            providers: [TIME_VALUE_ACCESSOR],
            host: {
                "(timeChange)": "onChange($event.value)",
            },
        }),
        __metadata("design:paramtypes", [core_1.ElementRef])
    ], TimeValueAccessor);
    return TimeValueAccessor;
}(base_value_accessor_1.BaseValueAccessor));
exports.TimeValueAccessor = TimeValueAccessor;
//# sourceMappingURL=time-value-accessor.js.map