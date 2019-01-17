function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var list_picker_common_1 = require("./list-picker-common");
var profiling_1 = require("../../profiling");
__export(require("./list-picker-common"));
var ListPicker = (function (_super) {
    __extends(ListPicker, _super);
    function ListPicker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ListPicker.prototype.createNativeView = function () {
        return UIPickerView.new();
    };
    ListPicker.prototype.initNativeView = function () {
        _super.prototype.initNativeView.call(this);
        var nativeView = this.nativeViewProtected;
        nativeView.dataSource = this._dataSource = ListPickerDataSource.initWithOwner(new WeakRef(this));
        this._delegate = ListPickerDelegateImpl.initWithOwner(new WeakRef(this));
    };
    ListPicker.prototype.disposeNativeView = function () {
        this._dataSource = null;
        this._delegate = null;
        _super.prototype.disposeNativeView.call(this);
    };
    Object.defineProperty(ListPicker.prototype, "ios", {
        get: function () {
            return this.nativeViewProtected;
        },
        enumerable: true,
        configurable: true
    });
    ListPicker.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        this.ios.delegate = this._delegate;
    };
    ListPicker.prototype.onUnloaded = function () {
        this.ios.delegate = null;
        _super.prototype.onUnloaded.call(this);
    };
    ListPicker.prototype[list_picker_common_1.selectedIndexProperty.getDefault] = function () {
        return -1;
    };
    ListPicker.prototype[list_picker_common_1.selectedIndexProperty.setNative] = function (value) {
        if (value >= 0) {
            this.ios.selectRowInComponentAnimated(value, 0, false);
        }
    };
    ListPicker.prototype[list_picker_common_1.itemsProperty.getDefault] = function () {
        return null;
    };
    ListPicker.prototype[list_picker_common_1.itemsProperty.setNative] = function (value) {
        this.ios.reloadAllComponents();
        list_picker_common_1.selectedIndexProperty.coerce(this);
    };
    ListPicker.prototype[list_picker_common_1.backgroundColorProperty.getDefault] = function () {
        return this.ios.backgroundColor;
    };
    ListPicker.prototype[list_picker_common_1.backgroundColorProperty.setNative] = function (value) {
        this.ios.backgroundColor = value instanceof list_picker_common_1.Color ? value.ios : value;
    };
    ListPicker.prototype[list_picker_common_1.colorProperty.getDefault] = function () {
        return this.ios.tintColor;
    };
    ListPicker.prototype[list_picker_common_1.colorProperty.setNative] = function (value) {
        this.ios.tintColor = value instanceof list_picker_common_1.Color ? value.ios : value;
    };
    __decorate([
        profiling_1.profile
    ], ListPicker.prototype, "onLoaded", null);
    return ListPicker;
}(list_picker_common_1.ListPickerBase));
exports.ListPicker = ListPicker;
var ListPickerDataSource = (function (_super) {
    __extends(ListPickerDataSource, _super);
    function ListPickerDataSource() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ListPickerDataSource.initWithOwner = function (owner) {
        var dataSource = ListPickerDataSource.new();
        dataSource._owner = owner;
        return dataSource;
    };
    ListPickerDataSource.prototype.numberOfComponentsInPickerView = function (pickerView) {
        return 1;
    };
    ListPickerDataSource.prototype.pickerViewNumberOfRowsInComponent = function (pickerView, component) {
        var owner = this._owner.get();
        return (owner && owner.items) ? owner.items.length : 0;
    };
    ListPickerDataSource.ObjCProtocols = [UIPickerViewDataSource];
    return ListPickerDataSource;
}(NSObject));
var ListPickerDelegateImpl = (function (_super) {
    __extends(ListPickerDelegateImpl, _super);
    function ListPickerDelegateImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ListPickerDelegateImpl.initWithOwner = function (owner) {
        var delegate = ListPickerDelegateImpl.new();
        delegate._owner = owner;
        return delegate;
    };
    ListPickerDelegateImpl.prototype.pickerViewAttributedTitleForRowForComponent = function (pickerView, row, component) {
        var _a, _b;
        var owner = this._owner.get();
        if (owner) {
            var title = NSAttributedString.alloc().initWithStringAttributes(owner._getItemAsString(row), (_a = {}, _a[NSForegroundColorAttributeName] = pickerView.tintColor, _a));
            return title;
        }
        return NSAttributedString.alloc().initWithStringAttributes(row.toString(), (_b = {}, _b[NSForegroundColorAttributeName] = pickerView.tintColor, _b));
    };
    ListPickerDelegateImpl.prototype.pickerViewDidSelectRowInComponent = function (pickerView, row, component) {
        var owner = this._owner.get();
        if (owner) {
            list_picker_common_1.selectedIndexProperty.nativeValueChange(owner, row);
            owner.updateSelectedValue(row);
        }
    };
    ListPickerDelegateImpl.ObjCProtocols = [UIPickerViewDelegate];
    return ListPickerDelegateImpl;
}(NSObject));
//# sourceMappingURL=list-picker.ios.js.map