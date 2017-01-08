var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var lang_facade_1 = require("../lang-facade");
var base_value_accessor_1 = require("./base-value-accessor");
var TIME_VALUE_ACCESSOR = { provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return TimeValueAccessor; }), multi: true };
/**
 * The accessor for setting a time and listening to changes that is used by the
 * {@link NgModel} directives.
 *
 *  ### Example
 *  ```
 *  <TimePicker [(ngModel)]="model.test">
 *  ```
 */
var TimeValueAccessor = (function (_super) {
    __extends(TimeValueAccessor, _super);
    function TimeValueAccessor(elementRef) {
        _super.call(this, elementRef.nativeElement);
        this.onTouched = function () { };
    }
    TimeValueAccessor.prototype.timeChangeListener = function (event) {
        this.onChange(event.value);
    };
    TimeValueAccessor.prototype.writeValue = function (value) {
        var normalizedValue = lang_facade_1.isBlank(value) ? new Date() : value;
        if (!lang_facade_1.isDate(normalizedValue)) {
            if (typeof normalizedValue === "string") {
                normalizedValue = new Date(normalizedValue);
            }
            else if (typeof normalizedValue === "number") {
                normalizedValue = new Date(normalizedValue);
            }
            if (!lang_facade_1.isDate(normalizedValue)) {
                normalizedValue = new Date();
            }
        }
        this.view.time = normalizedValue;
    };
    TimeValueAccessor.prototype.registerOnTouched = function (fn) { this.onTouched = fn; };
    __decorate([
        // tslint:disable-line:directive-class-suffix
        core_1.HostListener("timeChange", ["$event"]), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], TimeValueAccessor.prototype, "timeChangeListener", null);
    TimeValueAccessor = __decorate([
        core_1.Directive({
            selector: "TimePicker[ngModel], timePicker[ngModel], time-picker[ngModel]",
            providers: [TIME_VALUE_ACCESSOR]
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], TimeValueAccessor);
    return TimeValueAccessor;
}(base_value_accessor_1.BaseValueAccessor));
exports.TimeValueAccessor = TimeValueAccessor;
//# sourceMappingURL=time-value-accessor.js.map