Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var NSModuleFactoryLoader = /** @class */ (function (_super) {
    __extends(NSModuleFactoryLoader, _super);
    function NSModuleFactoryLoader(compiler, config) {
        var _this = _super.call(this, compiler, config) || this;
        console.log("NSModuleFactoryLoader is deprecated! " +
            "You no longer need to provide it as a module loader.");
        return _this;
    }
    NSModuleFactoryLoader = __decorate([
        core_1.Injectable(),
        __param(1, core_1.Optional()),
        __metadata("design:paramtypes", [core_1.Compiler,
            core_1.SystemJsNgModuleLoaderConfig])
    ], NSModuleFactoryLoader);
    return NSModuleFactoryLoader;
}(core_1.SystemJsNgModuleLoader));
exports.NSModuleFactoryLoader = NSModuleFactoryLoader;
//# sourceMappingURL=ns-module-factory-loader.js.map