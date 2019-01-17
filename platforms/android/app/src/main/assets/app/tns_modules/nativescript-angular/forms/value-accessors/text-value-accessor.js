Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var base_value_accessor_1 = require("./base-value-accessor");
var TEXT_VALUE_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return TextValueAccessor; }),
    multi: true,
};
/**
 * The accessor for writing a text and listening to changes that is used by the
 * {@link NgModel} directives.
 *
 *  ### Example
 *  ```
 *  <TextField [(ngModel)]="model.test">
 *  ```
 */
var TextValueAccessor = /** @class */ (function (_super) {
    __extends(TextValueAccessor, _super);
    function TextValueAccessor(elementRef) {
        return _super.call(this, elementRef.nativeElement) || this;
    }
    TextValueAccessor.prototype.writeValue = function (value) {
        var normalized = _super.prototype.normalizeValue.call(this, value);
        this.view.text = normalized;
    };
    TextValueAccessor = __decorate([
        core_1.Directive({
            selector: "TextField[ngModel],TextField[formControlName],TextField[formControl]," +
                "textField[ngModel],textField[formControlName],textField[formControl]," +
                "textfield[ngModel],textfield[formControlName],textfield[formControl]," +
                "text-field[ngModel],text-field[formControlName],text-field[formControl]," +
                "TextView[ngModel],TextView[formControlName],TextView[formControl]," +
                "textView[ngModel],textView[formControlName],textView[formControl]," +
                "textview[ngModel],textview[formControlName],textview[formControl]," +
                "text-view[ngModel],text-view[formControlName],text-view[formControl]," +
                "SearchBar[ngModel],SearchBar[formControlName],SearchBar[formControl]," +
                "searchBar[ngModel],searchBar[formControlName],searchBar[formControl]," +
                "searchbar[ngModel],searchbar[formControlName],searchbar[formControl]," +
                "search-bar[ngModel], search-bar[formControlName],search-bar[formControl]",
            providers: [TEXT_VALUE_ACCESSOR],
            host: {
                "(blur)": "onTouched()",
                "(textChange)": "onChange($event.value)",
            },
        }),
        __metadata("design:paramtypes", [core_1.ElementRef])
    ], TextValueAccessor);
    return TextValueAccessor;
}(base_value_accessor_1.BaseValueAccessor));
exports.TextValueAccessor = TextValueAccessor;
//# sourceMappingURL=text-value-accessor.js.map