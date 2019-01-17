Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var dialogs_1 = require("./directives/dialogs");
var platform_providers_1 = require("./platform-providers");
var directives_1 = require("./directives");
var NativeScriptCommonModule = /** @class */ (function () {
    function NativeScriptCommonModule() {
    }
    NativeScriptCommonModule = __decorate([
        core_1.NgModule({
            declarations: [
                dialogs_1.ModalDialogHost
            ].concat(directives_1.NS_DIRECTIVES),
            providers: [
                dialogs_1.ModalDialogService,
                platform_providers_1.defaultDeviceProvider,
                platform_providers_1.defaultFrameProvider,
                platform_providers_1.defaultPageProvider,
            ],
            imports: [
                common_1.CommonModule,
            ],
            exports: [
                common_1.CommonModule,
                dialogs_1.ModalDialogHost
            ].concat(directives_1.NS_DIRECTIVES),
            schemas: [core_1.NO_ERRORS_SCHEMA]
        })
    ], NativeScriptCommonModule);
    return NativeScriptCommonModule;
}());
exports.NativeScriptCommonModule = NativeScriptCommonModule;
//# sourceMappingURL=common.js.map