var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var lang_facade_1 = require("../lang-facade");
var base_value_accessor_1 = require("./base-value-accessor");
var NUMBER_VALUE_ACCESSOR = { provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return NumberValueAccessor; }), multi: true };
/**
 * The accessor for setting a value and listening to changes that is used by the
 * {@link NgModel}
 *
 *  ### Example
 *  ```
 *  <Slider [(ngModel)]="model.test">
 *  ```
 */
var NumberValueAccessor = (function (_super) {
    __extends(NumberValueAccessor, _super);
    function NumberValueAccessor(elementRef) {
        _super.call(this, elementRef.nativeElement);
        this.onTouched = function () { };
    }
    NumberValueAccessor.prototype.valueChangeListener = function (event) {
        this.onChange(event.value);
    };
    NumberValueAccessor.prototype.writeValue = function (value) {
        var normalizedValue;
        if (lang_facade_1.isBlank(value)) {
            normalizedValue = 0;
        }
        else {
            if (lang_facade_1.isNumber(value)) {
                normalizedValue = value;
            }
            else {
                var parsedValue = Number(value);
                normalizedValue = isNaN(parsedValue) ? 0 : parsedValue;
            }
        }
        this.view.value = normalizedValue;
    };
    NumberValueAccessor.prototype.registerOnTouched = function (fn) { this.onTouched = fn; };
    __decorate([
        // tslint:disable-line:directive-class-suffix
        core_1.HostListener("valueChange", ["$event"]), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], NumberValueAccessor.prototype, "valueChangeListener", null);
    NumberValueAccessor = __decorate([
        core_1.Directive({
            selector: "Slider[ngModel], slider[ngModel]",
            providers: [NUMBER_VALUE_ACCESSOR]
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], NumberValueAccessor);
    return NumberValueAccessor;
}(base_value_accessor_1.BaseValueAccessor));
exports.NumberValueAccessor = NumberValueAccessor;
//# sourceMappingURL=number-value-accessor.js.map