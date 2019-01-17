function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var list_picker_common_1 = require("./list-picker-common");
__export(require("./list-picker-common"));
var Formatter;
var ValueChangeListener;
function initializeNativeClasses() {
    if (Formatter) {
        return;
    }
    var FormatterImpl = (function (_super) {
        __extends(FormatterImpl, _super);
        function FormatterImpl(owner) {
            var _this = _super.call(this) || this;
            _this.owner = owner;
            return global.__native(_this);
        }
        FormatterImpl.prototype.format = function (index) {
            return this.owner._getItemAsString(index);
        };
        FormatterImpl = __decorate([
            Interfaces([android.widget.NumberPicker.Formatter])
        ], FormatterImpl);
        return FormatterImpl;
    }(java.lang.Object));
    var ValueChangeListenerImpl = (function (_super) {
        __extends(ValueChangeListenerImpl, _super);
        function ValueChangeListenerImpl(owner) {
            var _this = _super.call(this) || this;
            _this.owner = owner;
            return global.__native(_this);
        }
        ValueChangeListenerImpl.prototype.onValueChange = function (picker, oldValue, newValue) {
            list_picker_common_1.selectedIndexProperty.nativeValueChange(this.owner, newValue);
            this.owner.updateSelectedValue(newValue);
        };
        ValueChangeListenerImpl = __decorate([
            Interfaces([android.widget.NumberPicker.OnValueChangeListener])
        ], ValueChangeListenerImpl);
        return ValueChangeListenerImpl;
    }(java.lang.Object));
    Formatter = FormatterImpl;
    ValueChangeListener = ValueChangeListenerImpl;
}
function getEditText(picker) {
    for (var i = 0, count = picker.getChildCount(); i < count; i++) {
        var child = picker.getChildAt(i);
        if (child instanceof android.widget.EditText) {
            return child;
        }
    }
    return null;
}
var selectorWheelPaintField;
function getSelectorWheelPaint(picker) {
    if (!selectorWheelPaintField) {
        selectorWheelPaintField = picker.getClass().getDeclaredField("mSelectorWheelPaint");
        selectorWheelPaintField.setAccessible(true);
    }
    return selectorWheelPaintField.get(picker);
}
var ListPicker = (function (_super) {
    __extends(ListPicker, _super);
    function ListPicker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ListPicker.prototype.createNativeView = function () {
        var picker = new android.widget.NumberPicker(this._context);
        picker.setDescendantFocusability(android.widget.NumberPicker.FOCUS_BLOCK_DESCENDANTS);
        picker.setMinValue(0);
        picker.setMaxValue(0);
        picker.setValue(0);
        picker.setWrapSelectorWheel(false);
        return picker;
    };
    ListPicker.prototype.initNativeView = function () {
        _super.prototype.initNativeView.call(this);
        initializeNativeClasses();
        var nativeView = this.nativeViewProtected;
        this._selectorWheelPaint = getSelectorWheelPaint(nativeView);
        var formatter = new Formatter(this);
        nativeView.setFormatter(formatter);
        nativeView.formatter = formatter;
        var valueChangedListener = new ValueChangeListener(this);
        nativeView.setOnValueChangedListener(valueChangedListener);
        nativeView.valueChangedListener = valueChangedListener;
        var editText = getEditText(nativeView);
        if (editText) {
            nativeView.editText = editText;
            editText.setFilters([]);
            editText.setText(" ", android.widget.TextView.BufferType.NORMAL);
        }
    };
    ListPicker.prototype.disposeNativeView = function () {
        var nativeView = this.nativeViewProtected;
        nativeView.formatter.owner = null;
        nativeView.valueChangedListener.owner = null;
        _super.prototype.disposeNativeView.call(this);
    };
    ListPicker.prototype._fixNumberPickerRendering = function () {
        var nativeView = this.nativeViewProtected;
        nativeView.setFormatter(null);
        nativeView.setFormatter(nativeView.formatter);
        var editText = nativeView.editText;
        if (editText) {
            editText.setFilters([]);
            editText.invalidate();
        }
        nativeView.invalidate();
    };
    ListPicker.prototype[list_picker_common_1.selectedIndexProperty.getDefault] = function () {
        return -1;
    };
    ListPicker.prototype[list_picker_common_1.selectedIndexProperty.setNative] = function (value) {
        if (value >= 0) {
            this.nativeViewProtected.setValue(value);
        }
    };
    ListPicker.prototype[list_picker_common_1.itemsProperty.getDefault] = function () {
        return null;
    };
    ListPicker.prototype[list_picker_common_1.itemsProperty.setNative] = function (value) {
        var maxValue = value && value.length > 0 ? value.length - 1 : 0;
        this.nativeViewProtected.setMaxValue(maxValue);
        this._fixNumberPickerRendering();
        list_picker_common_1.selectedIndexProperty.coerce(this);
    };
    ListPicker.prototype[list_picker_common_1.colorProperty.getDefault] = function () {
        var editText = this.nativeViewProtected.editText;
        return {
            wheelColor: this._selectorWheelPaint.getColor(),
            textColor: editText ? editText.getTextColors().getDefaultColor() : -1
        };
    };
    ListPicker.prototype[list_picker_common_1.colorProperty.setNative] = function (value) {
        var color;
        var wheelColor;
        if (value instanceof list_picker_common_1.Color) {
            color = wheelColor = value.android;
        }
        else {
            color = value.textColor;
            wheelColor = value.wheelColor;
        }
        this._selectorWheelPaint.setColor(wheelColor);
        var editText = this.nativeViewProtected.editText;
        if (editText) {
            editText.setTextColor(color);
        }
    };
    return ListPicker;
}(list_picker_common_1.ListPickerBase));
exports.ListPicker = ListPicker;
//# sourceMappingURL=list-picker.android.js.map