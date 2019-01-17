function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var editable_text_base_common_1 = require("./editable-text-base-common");
__export(require("./editable-text-base-common"));
var EditableTextBase = (function (_super) {
    __extends(EditableTextBase, _super);
    function EditableTextBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EditableTextBase.prototype.dismissSoftInput = function () {
        this.nativeTextViewProtected.resignFirstResponder();
        this.notify({ eventName: EditableTextBase.blurEvent, object: this });
    };
    EditableTextBase.prototype[editable_text_base_common_1.keyboardTypeProperty.getDefault] = function () {
        var keyboardType = this.nativeTextViewProtected.keyboardType;
        switch (keyboardType) {
            case 2:
                return "number";
            case 5:
                return "phone";
            case 3:
                return "url";
            case 7:
                return "email";
            default:
                return keyboardType.toString();
        }
    };
    EditableTextBase.prototype[editable_text_base_common_1.keyboardTypeProperty.setNative] = function (value) {
        var newKeyboardType;
        switch (value) {
            case "datetime":
                newKeyboardType = 2;
                break;
            case "phone":
                newKeyboardType = 5;
                break;
            case "number":
                newKeyboardType = 2;
                break;
            case "url":
                newKeyboardType = 3;
                break;
            case "email":
                newKeyboardType = 7;
                break;
            default:
                var kt = +value;
                if (!isNaN(kt)) {
                    newKeyboardType = kt;
                }
                else {
                    newKeyboardType = 0;
                }
                break;
        }
        this.nativeTextViewProtected.keyboardType = newKeyboardType;
    };
    EditableTextBase.prototype[editable_text_base_common_1.returnKeyTypeProperty.getDefault] = function () {
        var returnKeyType = this.nativeTextViewProtected.returnKeyType;
        switch (returnKeyType) {
            case 9:
                return "done";
            case 1:
                return "go";
            case 4:
                return "next";
            case 6:
                return "search";
            case 7:
                return "send";
            default:
                return returnKeyType.toString();
        }
    };
    EditableTextBase.prototype[editable_text_base_common_1.returnKeyTypeProperty.setNative] = function (value) {
        var newValue;
        switch (value) {
            case "done":
                newValue = 9;
                break;
            case "go":
                newValue = 1;
                break;
            case "next":
                newValue = 4;
                break;
            case "search":
                newValue = 6;
                break;
            case "send":
                newValue = 7;
                break;
            default:
                var rkt = +value;
                if (!isNaN(rkt)) {
                    newValue = rkt;
                }
                else {
                    newValue = 0;
                }
                break;
        }
        this.nativeTextViewProtected.returnKeyType = newValue;
    };
    EditableTextBase.prototype[editable_text_base_common_1.autocapitalizationTypeProperty.getDefault] = function () {
        var autocapitalizationType = this.nativeTextViewProtected.autocapitalizationType;
        switch (autocapitalizationType) {
            case 0:
                return "none";
            case 1:
                return "words";
            case 2:
                return "sentences";
            case 3:
                return "allcharacters";
            default:
                throw new Error("Invalid autocapitalizationType value:" + autocapitalizationType);
        }
    };
    EditableTextBase.prototype[editable_text_base_common_1.autocapitalizationTypeProperty.setNative] = function (value) {
        var newValue;
        switch (value) {
            case "none":
                newValue = 0;
                break;
            case "words":
                newValue = 1;
                break;
            case "sentences":
                newValue = 2;
                break;
            case "allcharacters":
                newValue = 3;
                break;
            default:
                newValue = 2;
                break;
        }
        this.nativeTextViewProtected.autocapitalizationType = newValue;
    };
    EditableTextBase.prototype[editable_text_base_common_1.autocorrectProperty.getDefault] = function () {
        var autocorrectionType = this.nativeTextViewProtected.autocorrectionType;
        switch (autocorrectionType) {
            case 2:
                return true;
            case 1:
                return false;
            case 0:
                return autocorrectionType;
        }
    };
    EditableTextBase.prototype[editable_text_base_common_1.autocorrectProperty.setNative] = function (value) {
        var newValue;
        if (typeof value === "number") {
            newValue = 0;
        }
        else if (value) {
            newValue = 2;
        }
        else {
            newValue = 1;
        }
        this.nativeTextViewProtected.autocorrectionType = newValue;
    };
    return EditableTextBase;
}(editable_text_base_common_1.EditableTextBase));
exports.EditableTextBase = EditableTextBase;
function _updateCharactersInRangeReplacementString(formattedText, rangeLocation, rangeLength, replacementString) {
    var deletingText = !replacementString;
    var currentLocation = 0;
    for (var i = 0, length_1 = formattedText.spans.length; i < length_1; i++) {
        var span = formattedText.spans.getItem(i);
        if (currentLocation <= rangeLocation && rangeLocation < (currentLocation + span.text.length)) {
            var newText = splice(span.text, rangeLocation - currentLocation, deletingText ? rangeLength : 0, replacementString);
            span._setTextInternal(newText);
            return;
        }
        currentLocation += span.text.length;
    }
}
exports._updateCharactersInRangeReplacementString = _updateCharactersInRangeReplacementString;
function splice(value, start, delCount, newSubStr) {
    return value.slice(0, start) + newSubStr + value.slice(start + Math.abs(delCount));
}
//# sourceMappingURL=editable-text-base.ios.js.map