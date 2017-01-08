var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var base_value_accessor_1 = require("./base-value-accessor");
var utils = require("../common/utils");
var SELECTED_INDEX_VALUE_ACCESSOR = { provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return SelectedIndexValueAccessor; }), multi: true };
/**
 * The accessor for setting a selectedIndex and listening to changes that is used by the
 * {@link NgModel} directives.
 *
 *  ### Example
 *  ```
 *  <SegmentedBar [(ngModel)]="model.test">
 *  ```
 */
var SelectedIndexValueAccessor = (function (_super) {
    __extends(SelectedIndexValueAccessor, _super);
    function SelectedIndexValueAccessor(elementRef) {
        _super.call(this, elementRef.nativeElement);
        this.onTouched = function () { };
    }
    SelectedIndexValueAccessor.prototype.selectedIndexChangeListener = function (event) {
        this.onChange(event.value);
    };
    SelectedIndexValueAccessor.prototype.writeValue = function (value) {
        this._normalizedValue = utils.convertToInt(value);
        if (this.viewInitialized) {
            this.view.selectedIndex = this._normalizedValue;
        }
    };
    SelectedIndexValueAccessor.prototype.ngAfterViewInit = function () {
        this.viewInitialized = true;
        this.view.selectedIndex = this._normalizedValue;
    };
    SelectedIndexValueAccessor.prototype.registerOnTouched = function (fn) { this.onTouched = fn; };
    __decorate([
        // tslint:disable-line:max-line-length directive-class-suffix
        core_1.HostListener("selectedIndexChange", ["$event"]), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], SelectedIndexValueAccessor.prototype, "selectedIndexChangeListener", null);
    SelectedIndexValueAccessor = __decorate([
        core_1.Directive({
            selector: "SegmentedBar[ngModel], segmentedBar[ngModel], segmented-bar[ngModel], ListPicker[ngModel], listPicker[ngModel], list-picker[ngModel], TabView[ngModel], tabView[ngModel], tab-view[ngModel]",
            providers: [SELECTED_INDEX_VALUE_ACCESSOR]
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], SelectedIndexValueAccessor);
    return SelectedIndexValueAccessor;
}(base_value_accessor_1.BaseValueAccessor));
exports.SelectedIndexValueAccessor = SelectedIndexValueAccessor;
//# sourceMappingURL=selectedIndex-value-accessor.js.map