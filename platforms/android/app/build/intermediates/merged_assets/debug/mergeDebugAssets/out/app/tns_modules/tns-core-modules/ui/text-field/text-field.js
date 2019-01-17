function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var text_field_common_1 = require("./text-field-common");
__export(require("./text-field-common"));
var TextField = (function (_super) {
    __extends(TextField, _super);
    function TextField() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TextField.prototype._configureEditText = function (editText) {
        editText.setInputType(android.text.InputType.TYPE_CLASS_TEXT | android.text.InputType.TYPE_TEXT_VARIATION_NORMAL | android.text.InputType.TYPE_TEXT_FLAG_CAP_SENTENCES | android.text.InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS);
        editText.setLines(1);
        editText.setMaxLines(1);
        editText.setHorizontallyScrolling(true);
    };
    TextField.prototype._onReturnPress = function () {
        this.notify({ eventName: TextField.returnPressEvent, object: this });
    };
    TextField.prototype[text_field_common_1.secureProperty.setNative] = function () {
        this.setSecureAndKeyboardType();
    };
    TextField.prototype[text_field_common_1.keyboardTypeProperty.setNative] = function () {
        this.setSecureAndKeyboardType();
    };
    TextField.prototype.setSecureAndKeyboardType = function () {
        var inputType;
        if (this.secure) {
            if (this.keyboardType === "number") {
                inputType = android.text.InputType.TYPE_CLASS_NUMBER | android.text.InputType.TYPE_NUMBER_VARIATION_PASSWORD;
            }
            else {
                inputType = android.text.InputType.TYPE_CLASS_TEXT | android.text.InputType.TYPE_TEXT_VARIATION_PASSWORD;
            }
        }
        else {
            inputType = android.text.InputType.TYPE_CLASS_TEXT | android.text.InputType.TYPE_TEXT_VARIATION_NORMAL;
            if (this.autocorrect) {
                inputType = inputType | android.text.InputType.TYPE_TEXT_FLAG_AUTO_COMPLETE;
                inputType = inputType | android.text.InputType.TYPE_TEXT_FLAG_AUTO_CORRECT;
                inputType = inputType & ~android.text.InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS;
            }
            switch (this.autocapitalizationType) {
                case "words":
                    inputType = inputType | android.text.InputType.TYPE_TEXT_FLAG_CAP_WORDS;
                    break;
                case "sentences":
                    inputType = inputType | android.text.InputType.TYPE_TEXT_FLAG_CAP_SENTENCES;
                    break;
                case "allcharacters":
                    inputType = inputType | android.text.InputType.TYPE_TEXT_FLAG_CAP_CHARACTERS;
                    break;
                default:
                    break;
            }
            switch (this.keyboardType) {
                case "datetime":
                    inputType = android.text.InputType.TYPE_CLASS_DATETIME | android.text.InputType.TYPE_DATETIME_VARIATION_NORMAL;
                    break;
                case "phone":
                    inputType = android.text.InputType.TYPE_CLASS_PHONE;
                    break;
                case "number":
                    inputType = android.text.InputType.TYPE_CLASS_NUMBER | android.text.InputType.TYPE_NUMBER_VARIATION_NORMAL | android.text.InputType.TYPE_NUMBER_FLAG_SIGNED | android.text.InputType.TYPE_NUMBER_FLAG_DECIMAL;
                    break;
                case "url":
                    inputType = android.text.InputType.TYPE_CLASS_TEXT | android.text.InputType.TYPE_TEXT_VARIATION_URI;
                    break;
                case "email":
                    inputType = android.text.InputType.TYPE_CLASS_TEXT | android.text.InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS;
                    break;
                default:
                    break;
            }
        }
        this._setInputType(inputType);
    };
    TextField.prototype[text_field_common_1.whiteSpaceProperty.getDefault] = function () {
        return "nowrap";
    };
    TextField.prototype[text_field_common_1.whiteSpaceProperty.setNative] = function (value) {
    };
    return TextField;
}(text_field_common_1.TextFieldBase));
exports.TextField = TextField;
TextField.prototype._isSingleLine = true;
//# sourceMappingURL=text-field.js.map