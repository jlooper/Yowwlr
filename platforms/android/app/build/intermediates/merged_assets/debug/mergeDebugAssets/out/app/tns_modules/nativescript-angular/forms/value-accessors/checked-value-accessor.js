Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var base_value_accessor_1 = require("./base-value-accessor");
var CHECKED_VALUE_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return CheckedValueAccessor; }),
    multi: true,
};
/**
 * The accessor for setting a checked property and listening to changes that is used by the
 * {@link NgModel} directives.
 *
 *  ### Example
 *  ```
 *  <Switch [(ngModel)]="model.test">
 *  ```
 */
var CheckedValueAccessor = /** @class */ (function (_super) {
    __extends(CheckedValueAccessor, _super);
    function CheckedValueAccessor(elementRef) {
        return _super.call(this, elementRef.nativeElement) || this;
    }
    CheckedValueAccessor.prototype.writeValue = function (value) {
        var normalized = _super.prototype.normalizeValue.call(this, value);
        this.view.checked = normalized;
    };
    CheckedValueAccessor = __decorate([
        core_1.Directive({
            selector: "Switch[ngModel],Switch[formControlName],Switch[formControl]," +
                "switch[ngModel],switch[formControlName],switch[formControl]",
            providers: [CHECKED_VALUE_ACCESSOR],
            host: {
                "(checkedChange)": "onChange($event.value)",
            },
        }),
        __metadata("design:paramtypes", [core_1.ElementRef])
    ], CheckedValueAccessor);
    return CheckedValueAccessor;
}(base_value_accessor_1.BaseValueAccessor));
exports.CheckedValueAccessor = CheckedValueAccessor;
//# sourceMappingURL=checked-value-accessor.js.map