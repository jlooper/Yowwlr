Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var value_accessors_1 = require("./value-accessors");
exports.FORMS_DIRECTIVES = [
    value_accessors_1.TextValueAccessor,
    value_accessors_1.CheckedValueAccessor,
    value_accessors_1.DateValueAccessor,
    value_accessors_1.TimeValueAccessor,
    value_accessors_1.SelectedIndexValueAccessor,
    value_accessors_1.NumberValueAccessor,
];
var NativeScriptFormsModule = /** @class */ (function () {
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
        })
    ], NativeScriptFormsModule);
    return NativeScriptFormsModule;
}());
exports.NativeScriptFormsModule = NativeScriptFormsModule;
//# sourceMappingURL=forms.module.js.map