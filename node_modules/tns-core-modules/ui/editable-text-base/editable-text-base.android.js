function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var editable_text_base_common_1 = require("./editable-text-base-common");
var utils_1 = require("../../utils/utils");
__export(require("./editable-text-base-common"));
var EditTextListeners;
function clearDismissTimer() {
    exports.dismissKeyboardOwner = null;
    if (exports.dismissKeyboardTimeoutId) {
        clearTimeout(exports.dismissKeyboardTimeoutId);
        exports.dismissKeyboardTimeoutId = null;
    }
}
function dismissSoftInput(owner) {
    clearDismissTimer();
    if (!exports.dismissKeyboardTimeoutId) {
        exports.dismissKeyboardTimeoutId = setTimeout(function () {
            var owner = exports.dismissKeyboardOwner && exports.dismissKeyboardOwner.get();
            var activity = (owner && owner._context);
            var nativeView = owner && owner.nativeViewProtected;
            exports.dismissKeyboardTimeoutId = null;
            exports.dismissKeyboardOwner = null;
            var focused = activity && activity.getCurrentFocus();
            if (!focused || !(focused instanceof android.widget.EditText)) {
                utils_1.ad.dismissSoftInput(nativeView);
            }
        }, 10);
    }
}
function initializeEditTextListeners() {
    if (EditTextListeners) {
        return;
    }
    var EditTextListenersImpl = (function (_super) {
        __extends(EditTextListenersImpl, _super);
        function EditTextListenersImpl(owner) {
            var _this = _super.call(this) || this;
            _this.owner = owner;
            return global.__native(_this);
        }
        EditTextListenersImpl.prototype.beforeTextChanged = function (text, start, count, after) {
        };
        EditTextListenersImpl.prototype.onTextChanged = function (text, start, before, count) {
        };
        EditTextListenersImpl.prototype.afterTextChanged = function (editable) {
            var owner = this.owner;
            if (!owner || owner._changeFromCode) {
                return;
            }
            switch (owner.updateTextTrigger) {
                case "focusLost":
                    owner._dirtyTextAccumulator = editable.toString();
                    break;
                case "textChanged":
                    editable_text_base_common_1.textProperty.nativeValueChange(owner, editable.toString());
                    break;
                default:
                    throw new Error("Invalid updateTextTrigger: " + owner.updateTextTrigger);
            }
        };
        EditTextListenersImpl.prototype.onFocusChange = function (view, hasFocus) {
            var owner = this.owner;
            if (!owner) {
                return;
            }
            if (hasFocus) {
                clearDismissTimer();
                owner.notify({ eventName: EditableTextBase.focusEvent, object: owner });
            }
            else {
                if (owner._dirtyTextAccumulator || owner._dirtyTextAccumulator === "") {
                    editable_text_base_common_1.textProperty.nativeValueChange(owner, owner._dirtyTextAccumulator);
                    owner._dirtyTextAccumulator = undefined;
                }
                owner.notify({ eventName: EditableTextBase.blurEvent, object: owner });
                dismissSoftInput(owner);
            }
        };
        EditTextListenersImpl.prototype.onEditorAction = function (textView, actionId, event) {
            var owner = this.owner;
            if (!owner) {
                return false;
            }
            if (actionId === android.view.inputmethod.EditorInfo.IME_ACTION_DONE ||
                actionId === android.view.inputmethod.EditorInfo.IME_ACTION_UNSPECIFIED ||
                (event && event.getKeyCode() === android.view.KeyEvent.KEYCODE_ENTER)) {
                if (textView.getMaxLines() === 1) {
                    owner.dismissSoftInput();
                }
                owner._onReturnPress();
            }
            else if (actionId === android.view.inputmethod.EditorInfo.IME_ACTION_NEXT ||
                actionId === android.view.inputmethod.EditorInfo.IME_ACTION_PREVIOUS) {
                owner._onReturnPress();
            }
            return false;
        };
        EditTextListenersImpl = __decorate([
            Interfaces([android.text.TextWatcher, android.view.View.OnFocusChangeListener, android.widget.TextView.OnEditorActionListener])
        ], EditTextListenersImpl);
        return EditTextListenersImpl;
    }(java.lang.Object));
    EditTextListeners = EditTextListenersImpl;
}
var EditableTextBase = (function (_super) {
    __extends(EditableTextBase, _super);
    function EditableTextBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EditableTextBase.prototype._onReturnPress = function () {
    };
    EditableTextBase.prototype.createNativeView = function () {
        return new android.widget.EditText(this._context);
    };
    EditableTextBase.prototype.initNativeView = function () {
        _super.prototype.initNativeView.call(this);
        var editText = this.nativeTextViewProtected;
        this._configureEditText(editText);
        initializeEditTextListeners();
        var listeners = new EditTextListeners(this);
        editText.addTextChangedListener(listeners);
        editText.setOnFocusChangeListener(listeners);
        editText.setOnEditorActionListener(listeners);
        editText.listener = listeners;
        this._inputType = editText.getInputType();
    };
    EditableTextBase.prototype.disposeNativeView = function () {
        this.nativeTextViewProtected.listener.owner = null;
        this._keyListenerCache = null;
        _super.prototype.disposeNativeView.call(this);
    };
    EditableTextBase.prototype.resetNativeView = function () {
        _super.prototype.resetNativeView.call(this);
        this.nativeTextViewProtected.setInputType(this._inputType);
    };
    EditableTextBase.prototype.onUnloaded = function () {
        this.dismissSoftInput();
        _super.prototype.onUnloaded.call(this);
    };
    EditableTextBase.prototype.dismissSoftInput = function () {
        var nativeView = this.nativeTextViewProtected;
        if (!nativeView) {
            return;
        }
        utils_1.ad.dismissSoftInput(nativeView);
    };
    EditableTextBase.prototype.focus = function () {
        var nativeView = this.nativeTextViewProtected;
        if (!nativeView) {
            return;
        }
        var result = _super.prototype.focus.call(this);
        if (result) {
            utils_1.ad.showSoftInput(this.nativeTextViewProtected);
        }
        return result;
    };
    EditableTextBase.prototype._setInputType = function (inputType) {
        var nativeView = this.nativeTextViewProtected;
        try {
            this._changeFromCode = true;
            nativeView.setInputType(inputType);
        }
        finally {
            this._changeFromCode = false;
        }
        var listener = nativeView.getKeyListener();
        if (listener) {
            this._keyListenerCache = listener;
        }
        if (!this.editable) {
            nativeView.setKeyListener(null);
        }
    };
    EditableTextBase.prototype[editable_text_base_common_1.textProperty.getDefault] = function () {
        return editable_text_base_common_1.resetSymbol;
    };
    EditableTextBase.prototype[editable_text_base_common_1.textProperty.setNative] = function (value) {
        try {
            this._changeFromCode = true;
            this._setNativeText(value === editable_text_base_common_1.resetSymbol);
        }
        finally {
            this._changeFromCode = false;
        }
    };
    EditableTextBase.prototype[editable_text_base_common_1.keyboardTypeProperty.getDefault] = function () {
        return this.nativeTextViewProtected.getInputType();
    };
    EditableTextBase.prototype[editable_text_base_common_1.keyboardTypeProperty.setNative] = function (value) {
        var newInputType;
        switch (value) {
            case "datetime":
                newInputType = android.text.InputType.TYPE_CLASS_DATETIME | android.text.InputType.TYPE_DATETIME_VARIATION_NORMAL;
                break;
            case "phone":
                newInputType = android.text.InputType.TYPE_CLASS_PHONE;
                break;
            case "number":
                newInputType = android.text.InputType.TYPE_CLASS_NUMBER | android.text.InputType.TYPE_NUMBER_VARIATION_NORMAL | android.text.InputType.TYPE_NUMBER_FLAG_SIGNED | android.text.InputType.TYPE_NUMBER_FLAG_DECIMAL;
                break;
            case "url":
                newInputType = android.text.InputType.TYPE_CLASS_TEXT | android.text.InputType.TYPE_TEXT_VARIATION_URI;
                break;
            case "email":
                newInputType = android.text.InputType.TYPE_CLASS_TEXT | android.text.InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS;
                break;
            default:
                newInputType = value;
                break;
        }
        this._setInputType(newInputType);
    };
    EditableTextBase.prototype[editable_text_base_common_1.returnKeyTypeProperty.getDefault] = function () {
        var ime = this.nativeTextViewProtected.getImeOptions();
        switch (ime) {
            case android.view.inputmethod.EditorInfo.IME_ACTION_DONE:
                return "done";
            case android.view.inputmethod.EditorInfo.IME_ACTION_GO:
                return "go";
            case android.view.inputmethod.EditorInfo.IME_ACTION_NEXT:
                return "next";
            case android.view.inputmethod.EditorInfo.IME_ACTION_SEARCH:
                return "search";
            case android.view.inputmethod.EditorInfo.IME_ACTION_SEND:
                return "send";
            default:
                return ime.toString();
        }
    };
    EditableTextBase.prototype[editable_text_base_common_1.returnKeyTypeProperty.setNative] = function (value) {
        var newImeOptions;
        switch (value) {
            case "done":
                newImeOptions = android.view.inputmethod.EditorInfo.IME_ACTION_DONE;
                break;
            case "go":
                newImeOptions = android.view.inputmethod.EditorInfo.IME_ACTION_GO;
                break;
            case "next":
                newImeOptions = android.view.inputmethod.EditorInfo.IME_ACTION_NEXT;
                break;
            case "search":
                newImeOptions = android.view.inputmethod.EditorInfo.IME_ACTION_SEARCH;
                break;
            case "send":
                newImeOptions = android.view.inputmethod.EditorInfo.IME_ACTION_SEND;
                break;
            default:
                var ime = +value;
                if (!isNaN(ime)) {
                    newImeOptions = ime;
                }
                else {
                    newImeOptions = android.view.inputmethod.EditorInfo.IME_ACTION_UNSPECIFIED;
                }
                break;
        }
        this.nativeTextViewProtected.setImeOptions(newImeOptions);
    };
    EditableTextBase.prototype[editable_text_base_common_1.editableProperty.setNative] = function (value) {
        var nativeView = this.nativeTextViewProtected;
        if (value) {
            nativeView.setKeyListener(this._keyListenerCache);
        }
        else {
            if (!this._keyListenerCache) {
                this._keyListenerCache = nativeView.getKeyListener();
            }
            nativeView.setKeyListener(null);
        }
    };
    EditableTextBase.prototype[editable_text_base_common_1.autocapitalizationTypeProperty.getDefault] = function () {
        var inputType = this.nativeTextViewProtected.getInputType();
        if ((inputType & android.text.InputType.TYPE_TEXT_FLAG_CAP_WORDS) === android.text.InputType.TYPE_TEXT_FLAG_CAP_WORDS) {
            return "words";
        }
        else if ((inputType & android.text.InputType.TYPE_TEXT_FLAG_CAP_SENTENCES) === android.text.InputType.TYPE_TEXT_FLAG_CAP_SENTENCES) {
            return "sentences";
        }
        else if ((inputType & android.text.InputType.TYPE_TEXT_FLAG_CAP_CHARACTERS) === android.text.InputType.TYPE_TEXT_FLAG_CAP_CHARACTERS) {
            return "allcharacters";
        }
        else {
            return inputType.toString();
        }
    };
    EditableTextBase.prototype[editable_text_base_common_1.autocapitalizationTypeProperty.setNative] = function (value) {
        var inputType = this.nativeTextViewProtected.getInputType();
        inputType = inputType & ~28672;
        switch (value) {
            case "none":
                break;
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
                var number = +value;
                if (!isNaN(number)) {
                    inputType = number;
                }
                else {
                    inputType = inputType | android.text.InputType.TYPE_TEXT_FLAG_CAP_SENTENCES;
                }
                break;
        }
        this._setInputType(inputType);
    };
    EditableTextBase.prototype[editable_text_base_common_1.autocorrectProperty.getDefault] = function () {
        var autocorrect = this.nativeTextViewProtected.getInputType();
        if ((autocorrect & android.text.InputType.TYPE_TEXT_FLAG_AUTO_CORRECT) === android.text.InputType.TYPE_TEXT_FLAG_AUTO_CORRECT) {
            return true;
        }
        return false;
    };
    EditableTextBase.prototype[editable_text_base_common_1.autocorrectProperty.setNative] = function (value) {
        var inputType = this.nativeTextViewProtected.getInputType();
        switch (value) {
            case true:
                inputType = inputType | android.text.InputType.TYPE_TEXT_FLAG_AUTO_COMPLETE;
                inputType = inputType | android.text.InputType.TYPE_TEXT_FLAG_AUTO_CORRECT;
                inputType = inputType & ~android.text.InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS;
                break;
            case false:
                inputType = inputType & ~android.text.InputType.TYPE_TEXT_FLAG_AUTO_COMPLETE;
                inputType = inputType & ~android.text.InputType.TYPE_TEXT_FLAG_AUTO_CORRECT;
                inputType = inputType | android.text.InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS;
                break;
            default:
                break;
        }
        this._setInputType(inputType);
    };
    EditableTextBase.prototype[editable_text_base_common_1.hintProperty.getDefault] = function () {
        return this.nativeTextViewProtected.getHint();
    };
    EditableTextBase.prototype[editable_text_base_common_1.hintProperty.setNative] = function (value) {
        var text = (value === null || value === undefined) ? null : value.toString();
        this.nativeTextViewProtected.setHint(text);
    };
    EditableTextBase.prototype[editable_text_base_common_1.placeholderColorProperty.getDefault] = function () {
        return this.nativeTextViewProtected.getHintTextColors();
    };
    EditableTextBase.prototype[editable_text_base_common_1.placeholderColorProperty.setNative] = function (value) {
        var color = value instanceof editable_text_base_common_1.Color ? value.android : value;
        this.nativeTextViewProtected.setHintTextColor(color);
    };
    EditableTextBase.prototype[editable_text_base_common_1.textTransformProperty.setNative] = function (value) {
    };
    EditableTextBase.prototype[editable_text_base_common_1.maxLengthProperty.setNative] = function (value) {
        if (value === Number.POSITIVE_INFINITY) {
            this.nativeTextViewProtected.setFilters([]);
        }
        else {
            var lengthFilter = new android.text.InputFilter.LengthFilter(value);
            var filters = this.nativeTextViewProtected.getFilters();
            var newFilters = [];
            for (var i = 0; i < filters.length; i++) {
                var filter = filters[i];
                if (!(filter instanceof android.text.InputFilter.LengthFilter)) {
                    newFilters.push(filter);
                }
            }
            newFilters.push(lengthFilter);
            this.nativeTextViewProtected.setFilters(newFilters);
        }
    };
    return EditableTextBase;
}(editable_text_base_common_1.EditableTextBase));
exports.EditableTextBase = EditableTextBase;
//# sourceMappingURL=editable-text-base.android.js.map