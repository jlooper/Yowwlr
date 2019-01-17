function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var text_field_common_1 = require("./text-field-common");
var profiling_1 = require("../../profiling");
__export(require("./text-field-common"));
var zeroLength = {
    value: 0,
    unit: "px"
};
var UITextFieldDelegateImpl = (function (_super) {
    __extends(UITextFieldDelegateImpl, _super);
    function UITextFieldDelegateImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UITextFieldDelegateImpl.initWithOwner = function (owner) {
        var delegate = UITextFieldDelegateImpl.new();
        delegate._owner = owner;
        return delegate;
    };
    UITextFieldDelegateImpl.prototype.textFieldShouldBeginEditing = function (textField) {
        this.firstEdit = true;
        var owner = this._owner.get();
        if (owner) {
            return owner.editable;
        }
        return true;
    };
    UITextFieldDelegateImpl.prototype.textFieldDidBeginEditing = function (textField) {
        var owner = this._owner.get();
        if (owner) {
            owner.notify({ eventName: TextField.focusEvent, object: owner });
        }
    };
    UITextFieldDelegateImpl.prototype.textFieldDidEndEditing = function (textField) {
        var owner = this._owner.get();
        if (owner) {
            if (owner.updateTextTrigger === "focusLost") {
                text_field_common_1.textProperty.nativeValueChange(owner, textField.text);
            }
            owner.dismissSoftInput();
        }
    };
    UITextFieldDelegateImpl.prototype.textFieldShouldClear = function (textField) {
        this.firstEdit = false;
        var owner = this._owner.get();
        if (owner) {
            text_field_common_1.textProperty.nativeValueChange(owner, "");
        }
        return true;
    };
    UITextFieldDelegateImpl.prototype.textFieldShouldReturn = function (textField) {
        var owner = this._owner.get();
        if (owner) {
            owner.dismissSoftInput();
            owner.notify({ eventName: TextField.returnPressEvent, object: owner });
        }
        return true;
    };
    UITextFieldDelegateImpl.prototype.textFieldShouldChangeCharactersInRangeReplacementString = function (textField, range, replacementString) {
        var owner = this._owner.get();
        if (owner) {
            var delta = replacementString.length - range.length;
            if (delta > 0) {
                if (textField.text.length + delta > owner.maxLength) {
                    return false;
                }
            }
            if (owner.updateTextTrigger === "textChanged") {
                if (textField.secureTextEntry && this.firstEdit) {
                    text_field_common_1.textProperty.nativeValueChange(owner, replacementString);
                }
                else {
                    if (range.location <= textField.text.length) {
                        var newText = NSString.stringWithString(textField.text).stringByReplacingCharactersInRangeWithString(range, replacementString);
                        text_field_common_1.textProperty.nativeValueChange(owner, newText);
                    }
                }
            }
            if (owner.formattedText) {
                text_field_common_1._updateCharactersInRangeReplacementString(owner.formattedText, range.location, range.length, replacementString);
            }
        }
        this.firstEdit = false;
        return true;
    };
    UITextFieldDelegateImpl.ObjCProtocols = [UITextFieldDelegate];
    return UITextFieldDelegateImpl;
}(NSObject));
var UITextFieldImpl = (function (_super) {
    __extends(UITextFieldImpl, _super);
    function UITextFieldImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UITextFieldImpl.initWithOwner = function (owner) {
        var handler = UITextFieldImpl.new();
        handler._owner = owner;
        return handler;
    };
    UITextFieldImpl.prototype._getTextRectForBounds = function (bounds) {
        var owner = this._owner ? this._owner.get() : null;
        if (!owner) {
            return bounds;
        }
        var size = bounds.size;
        var x = text_field_common_1.layout.toDeviceIndependentPixels(owner.effectiveBorderLeftWidth + owner.effectivePaddingLeft);
        var y = text_field_common_1.layout.toDeviceIndependentPixels(owner.effectiveBorderTopWidth + owner.effectivePaddingTop);
        var width = text_field_common_1.layout.toDeviceIndependentPixels(text_field_common_1.layout.toDevicePixels(size.width) - (owner.effectiveBorderLeftWidth + owner.effectivePaddingLeft + owner.effectivePaddingRight + owner.effectiveBorderRightWidth));
        var height = text_field_common_1.layout.toDeviceIndependentPixels(text_field_common_1.layout.toDevicePixels(size.height) - (owner.effectiveBorderTopWidth + owner.effectivePaddingTop + owner.effectivePaddingBottom + owner.effectiveBorderBottomWidth));
        return CGRectMake(x, y, width, height);
    };
    UITextFieldImpl.prototype.textRectForBounds = function (bounds) {
        return this._getTextRectForBounds(bounds);
    };
    UITextFieldImpl.prototype.editingRectForBounds = function (bounds) {
        return this._getTextRectForBounds(bounds);
    };
    return UITextFieldImpl;
}(UITextField));
var TextField = (function (_super) {
    __extends(TextField, _super);
    function TextField() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TextField.prototype.createNativeView = function () {
        return UITextFieldImpl.initWithOwner(new WeakRef(this));
    };
    TextField.prototype.initNativeView = function () {
        _super.prototype.initNativeView.call(this);
        this._delegate = UITextFieldDelegateImpl.initWithOwner(new WeakRef(this));
    };
    TextField.prototype.disposeNativeView = function () {
        this._delegate = null;
        _super.prototype.disposeNativeView.call(this);
    };
    TextField.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        this.ios.delegate = this._delegate;
    };
    TextField.prototype.onUnloaded = function () {
        this.ios.delegate = null;
        _super.prototype.onUnloaded.call(this);
    };
    Object.defineProperty(TextField.prototype, "ios", {
        get: function () {
            return this.nativeViewProtected;
        },
        enumerable: true,
        configurable: true
    });
    TextField.prototype[text_field_common_1.hintProperty.getDefault] = function () {
        return this.nativeTextViewProtected.placeholder;
    };
    TextField.prototype[text_field_common_1.hintProperty.setNative] = function (value) {
        this._updateAttributedPlaceholder();
    };
    TextField.prototype[text_field_common_1.secureProperty.getDefault] = function () {
        return this.nativeTextViewProtected.secureTextEntry;
    };
    TextField.prototype[text_field_common_1.secureProperty.setNative] = function (value) {
        this.nativeTextViewProtected.secureTextEntry = value;
    };
    TextField.prototype[text_field_common_1.colorProperty.getDefault] = function () {
        return {
            textColor: this.nativeTextViewProtected.textColor,
            tintColor: this.nativeTextViewProtected.tintColor
        };
    };
    TextField.prototype[text_field_common_1.colorProperty.setNative] = function (value) {
        if (value instanceof text_field_common_1.Color) {
            var color = value instanceof text_field_common_1.Color ? value.ios : value;
            this.nativeTextViewProtected.textColor = color;
            this.nativeTextViewProtected.tintColor = color;
        }
        else {
            this.nativeTextViewProtected.textColor = value.textColor;
            this.nativeTextViewProtected.tintColor = value.tintColor;
        }
    };
    TextField.prototype[text_field_common_1.placeholderColorProperty.getDefault] = function () {
        return null;
    };
    TextField.prototype[text_field_common_1.placeholderColorProperty.setNative] = function (value) {
        this._updateAttributedPlaceholder();
    };
    TextField.prototype._updateAttributedPlaceholder = function () {
        var stringValue = this.hint;
        if (stringValue === null || stringValue === void 0) {
            stringValue = "";
        }
        else {
            stringValue = stringValue + "";
        }
        if (stringValue === "") {
            stringValue = " ";
        }
        var attributes = {};
        if (this.style.placeholderColor) {
            attributes[NSForegroundColorAttributeName] = this.style.placeholderColor.ios;
        }
        var attributedPlaceholder = NSAttributedString.alloc().initWithStringAttributes(stringValue, attributes);
        this.nativeTextViewProtected.attributedPlaceholder = attributedPlaceholder;
    };
    TextField.prototype[text_field_common_1.paddingTopProperty.getDefault] = function () {
        return zeroLength;
    };
    TextField.prototype[text_field_common_1.paddingTopProperty.setNative] = function (value) {
    };
    TextField.prototype[text_field_common_1.paddingRightProperty.getDefault] = function () {
        return zeroLength;
    };
    TextField.prototype[text_field_common_1.paddingRightProperty.setNative] = function (value) {
    };
    TextField.prototype[text_field_common_1.paddingBottomProperty.getDefault] = function () {
        return zeroLength;
    };
    TextField.prototype[text_field_common_1.paddingBottomProperty.setNative] = function (value) {
    };
    TextField.prototype[text_field_common_1.paddingLeftProperty.getDefault] = function () {
        return zeroLength;
    };
    TextField.prototype[text_field_common_1.paddingLeftProperty.setNative] = function (value) {
    };
    __decorate([
        profiling_1.profile
    ], TextField.prototype, "onLoaded", null);
    return TextField;
}(text_field_common_1.TextFieldBase));
exports.TextField = TextField;
//# sourceMappingURL=text-field.ios.js.map