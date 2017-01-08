var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var text_value_accessor_1 = require("./value-accessors/text-value-accessor");
var checked_value_accessor_1 = require("./value-accessors/checked-value-accessor");
var date_value_accessor_1 = require("./value-accessors/date-value-accessor");
var time_value_accessor_1 = require("./value-accessors/time-value-accessor");
var number_value_accessor_1 = require("./value-accessors/number-value-accessor");
var selectedIndex_value_accessor_1 = require("./value-accessors/selectedIndex-value-accessor");
exports.FORMS_DIRECTIVES = [
    text_value_accessor_1.TextValueAccessor,
    checked_value_accessor_1.CheckedValueAccessor,
    date_value_accessor_1.DateValueAccessor,
    time_value_accessor_1.TimeValueAccessor,
    selectedIndex_value_accessor_1.SelectedIndexValueAccessor,
    number_value_accessor_1.NumberValueAccessor,
];
var NativeScriptFormsModule = (function () {
    function NativeScriptFormsModule() {
    }
    NativeScriptFormsModule = __decorate([
        core_1.NgModule({
            declarations: exports.FORMS_DIRECTIVES,
            providers: [],
            imports: [
                forms_1.FormsModule
            ],
            exports: [
                forms_1.FormsModule,
                exports.FORMS_DIRECTIVES,
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], NativeScriptFormsModule);
    return NativeScriptFormsModule;
}());
exports.NativeScriptFormsModule = NativeScriptFormsModule;
//# sourceMappingURL=forms.js.map