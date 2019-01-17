function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var view_1 = require("../core/view");
__export(require("../core/view"));
var SwitchBase = (function (_super) {
    __extends(SwitchBase, _super);
    function SwitchBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SwitchBase = __decorate([
        view_1.CSSType("Switch")
    ], SwitchBase);
    return SwitchBase;
}(view_1.View));
exports.SwitchBase = SwitchBase;
SwitchBase.prototype.recycleNativeView = "auto";
exports.checkedProperty = new view_1.Property({ name: "checked", defaultValue: false, valueConverter: view_1.booleanConverter });
exports.checkedProperty.register(SwitchBase);
//# sourceMappingURL=switch-common.js.map