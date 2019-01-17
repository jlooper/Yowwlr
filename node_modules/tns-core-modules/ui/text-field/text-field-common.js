function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var editable_text_base_1 = require("../editable-text-base");
__export(require("../editable-text-base"));
var TextFieldBase = (function (_super) {
    __extends(TextFieldBase, _super);
    function TextFieldBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TextFieldBase.returnPressEvent = "returnPress";
    TextFieldBase = __decorate([
        editable_text_base_1.CSSType("TextField")
    ], TextFieldBase);
    return TextFieldBase;
}(editable_text_base_1.EditableTextBase));
exports.TextFieldBase = TextFieldBase;
TextFieldBase.prototype.recycleNativeView = "auto";
exports.secureProperty = new editable_text_base_1.Property({ name: "secure", defaultValue: false, valueConverter: editable_text_base_1.booleanConverter });
exports.secureProperty.register(TextFieldBase);
//# sourceMappingURL=text-field-common.js.map