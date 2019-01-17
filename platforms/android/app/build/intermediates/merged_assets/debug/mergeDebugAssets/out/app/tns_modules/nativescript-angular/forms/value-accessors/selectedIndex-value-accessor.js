Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var base_value_accessor_1 = require("./base-value-accessor");
var SELECTED_INDEX_VALUE_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return SelectedIndexValueAccessor; }),
    multi: true,
};
/**
 * The accessor for setting a selectedIndex and listening to changes that is used by the
 * {@link NgModel} directives.
 *
 *  ### Example
 *  ```
 *  <SegmentedBar [(ngModel)]="model.test">
 *  ```
 */
var SelectedIndexValueAccessor = /** @class */ (function (_super) {
    __extends(SelectedIndexValueAccessor, _super);
    function SelectedIndexValueAccessor(elementRef) {
        return _super.call(this, elementRef.nativeElement) || this;
    }
    SelectedIndexValueAccessor.prototype.writeValue = function (value) {
        var normalized = _super.prototype.normalizeValue.call(this, value);
        this.value = normalized;
        if (this.viewInitialized) {
            this.view.selectedIndex = this.value;
        }
    };
    SelectedIndexValueAccessor.prototype.ngAfterViewInit = function () {
        this.viewInitialized = true;
        this.view.selectedIndex = this.value;
    };
    SelectedIndexValueAccessor = __decorate([
        core_1.Directive({
            selector: "SegmentedBar[ngModel],SegmentedBar[formControlName],SegmentedBar[formControl]," +
                "segmentedBar[ngModel],segmentedBar[formControlName],segmentedBar[formControl]," +
                "segmentedbar[ngModel],segmentedbar[formControlName],segmentedbar[formControl]," +
                "segmented-bar[ngModel],segmented-bar[formControlName],segmented-bar[formControl]," +
                "ListPicker[ngModel],ListPicker[formControlName],ListPicker[formControl]," +
                "listPicker[ngModel],listPicker[formControlName],listPicker[formControl]," +
                "listpicker[ngModel],listpicker[formControlName],listpicker[formControl]," +
                "list-picker[ngModel],list-picker[formControlName],list-picker[formControl]," +
                "TabView[ngModel],TabView[formControlName],TabView[formControl]," +
                "tabView[ngModel],tabView[formControlName],tabView[formControl]," +
                "tabview[ngModel],tabview[formControlName],tabview[formControl]," +
                "tab-view[ngModel],tab-view[formControlName],tab-view[formControl]",
            providers: [SELECTED_INDEX_VALUE_ACCESSOR],
            host: {
                "(selectedIndexChange)": "onChange($event.value)",
            },
        }),
        __metadata("design:paramtypes", [core_1.ElementRef])
    ], SelectedIndexValueAccessor);
    return SelectedIndexValueAccessor;
}(base_value_accessor_1.BaseValueAccessor));
exports.SelectedIndexValueAccessor = SelectedIndexValueAccessor;
//# sourceMappingURL=selectedIndex-value-accessor.js.map