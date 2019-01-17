function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var view_1 = require("../core/view");
__export(require("../core/view"));
var ListPickerBase = (function (_super) {
    __extends(ListPickerBase, _super);
    function ListPickerBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ListPickerBase.prototype._getItemAsString = function (index) {
        var items = this.items;
        if (!items) {
            return " ";
        }
        var item = this.isItemsSource ? this.items.getItem(index) : this.items[index];
        return (item === undefined || item === null) ? index + "" : this.parseItem(item);
    };
    ListPickerBase.prototype.parseItem = function (item) {
        return this.textField ? item[this.textField] + "" : item + "";
    };
    ListPickerBase.prototype.updateSelectedValue = function (index) {
        var newVal = null;
        if (index >= 0) {
            var item = this.items[index];
            newVal = this.valueField ? item[this.valueField] : item;
        }
        if (this.selectedValue !== newVal) {
            this.set("selectedValue", newVal);
        }
    };
    ListPickerBase = __decorate([
        view_1.CSSType("ListPicker")
    ], ListPickerBase);
    return ListPickerBase;
}(view_1.View));
exports.ListPickerBase = ListPickerBase;
ListPickerBase.prototype.recycleNativeView = "auto";
exports.selectedIndexProperty = new view_1.CoercibleProperty({
    name: "selectedIndex", defaultValue: -1,
    valueConverter: function (v) { return parseInt(v); },
    coerceValue: function (target, value) {
        var items = target.items;
        if (items) {
            var max = items.length - 1;
            if (value < 0) {
                value = 0;
            }
            if (value > max) {
                value = max;
            }
        }
        else {
            value = -1;
        }
        target.updateSelectedValue(value);
        return value;
    }
});
exports.selectedIndexProperty.register(ListPickerBase);
exports.itemsProperty = new view_1.Property({
    name: "items", valueChanged: function (target, oldValue, newValue) {
        var getItem = newValue && newValue.getItem;
        target.isItemsSource = typeof getItem === "function";
    }
});
exports.itemsProperty.register(ListPickerBase);
exports.textFieldProperty = new view_1.Property({
    name: "textField",
    defaultValue: ""
});
exports.textFieldProperty.register(ListPickerBase);
exports.valueFieldProperty = new view_1.Property({
    name: "valueField",
    defaultValue: ""
});
exports.valueFieldProperty.register(ListPickerBase);
exports.selectedValueProperty = new view_1.Property({
    name: "selectedValue",
    defaultValue: null
});
exports.selectedValueProperty.register(ListPickerBase);
//# sourceMappingURL=list-picker-common.js.map