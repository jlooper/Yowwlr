var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var lang_facade_1 = require("../lang-facade");
var base_value_accessor_1 = require("./base-value-accessor");
var TEXT_VALUE_ACCESSOR = { provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return TextValueAccessor; }), multi: true };
/**
 * The accessor for writing a text and listening to changes that is used by the
 * {@link NgModel} directives.
 *
 *  ### Example
 *  ```
 *  <TextField [(ngModel)]="model.test">
 *  ```
 */
var TextValueAccessor = (function (_super) {
    __extends(TextValueAccessor, _super);
    function TextValueAccessor(elementRef) {
        _super.call(this, elementRef.nativeElement);
        this.onTouched = function () { };
    }
    TextValueAccessor.prototype.textChangeListener = function (event) {
        this.onChange(event.value);
    };
    TextValueAccessor.prototype.writeValue = function (value) {
        var normalizedValue = lang_facade_1.isBlank(value) ? "" : value.toString();
        this.view.text = normalizedValue;
    };
    TextValueAccessor.prototype.registerOnTouched = function (fn) { this.onTouched = fn; };
    __decorate([
        // tslint:disable-line:directive-class-suffix
        core_1.HostListener("textChange", ["$event"]), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], TextValueAccessor.prototype, "textChangeListener", null);
    TextValueAccessor = __decorate([
        core_1.Directive({
            selector: "TextField[ngModel], textField[ngModel], text-field[ngModel], TextView[ngModel], textView[ngModel], text-view[ngModel], SearchBar[ngModel], search-bar[ngModel], searchBar[ngModel]",
            providers: [TEXT_VALUE_ACCESSOR]
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], TextValueAccessor);
    return TextValueAccessor;
}(base_value_accessor_1.BaseValueAccessor));
exports.TextValueAccessor = TextValueAccessor;
//# sourceMappingURL=text-value-accessor.js.map