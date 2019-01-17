function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var time_picker_common_1 = require("./time-picker-common");
var utils_1 = require("../../utils/utils");
var getter = utils_1.ios.getter;
__export(require("./time-picker-common"));
function getDate(hour, minute) {
    var components = NSDateComponents.alloc().init();
    components.hour = hour;
    components.minute = minute;
    return getter(NSCalendar, NSCalendar.currentCalendar).dateFromComponents(components);
}
function getComponents(date) {
    return getter(NSCalendar, NSCalendar.currentCalendar).componentsFromDate(32 | 64, date);
}
var TimePicker = (function (_super) {
    __extends(TimePicker, _super);
    function TimePicker() {
        var _this = _super.call(this) || this;
        var components = getComponents(NSDate.date());
        _this.hour = components.hour;
        _this.minute = components.minute;
        return _this;
    }
    TimePicker.prototype.createNativeView = function () {
        var picker = UIDatePicker.new();
        picker.datePickerMode = 0;
        return picker;
    };
    TimePicker.prototype.initNativeView = function () {
        _super.prototype.initNativeView.call(this);
        this._changeHandler = UITimePickerChangeHandlerImpl.initWithOwner(new WeakRef(this));
        this.nativeViewProtected.addTargetActionForControlEvents(this._changeHandler, "valueChanged", 4096);
    };
    TimePicker.prototype.disposeNativeView = function () {
        this._changeHandler = null;
        _super.prototype.initNativeView.call(this);
    };
    Object.defineProperty(TimePicker.prototype, "ios", {
        get: function () {
            return this.nativeViewProtected;
        },
        enumerable: true,
        configurable: true
    });
    TimePicker.prototype[time_picker_common_1.timeProperty.getDefault] = function () {
        return this.nativeViewProtected.date;
    };
    TimePicker.prototype[time_picker_common_1.timeProperty.setNative] = function (value) {
        this.nativeViewProtected.date = getDate(this.hour, this.minute);
    };
    TimePicker.prototype[time_picker_common_1.minuteProperty.getDefault] = function () {
        return this.nativeViewProtected.date.getMinutes();
    };
    TimePicker.prototype[time_picker_common_1.minuteProperty.setNative] = function (value) {
        this.nativeViewProtected.date = getDate(this.hour, value);
    };
    TimePicker.prototype[time_picker_common_1.hourProperty.getDefault] = function () {
        return this.nativeViewProtected.date.getHours();
    };
    TimePicker.prototype[time_picker_common_1.hourProperty.setNative] = function (value) {
        this.nativeViewProtected.date = getDate(value, this.minute);
    };
    TimePicker.prototype[time_picker_common_1.minHourProperty.getDefault] = function () {
        return this.nativeViewProtected.minimumDate ? this.nativeViewProtected.minimumDate.getHours() : 0;
    };
    TimePicker.prototype[time_picker_common_1.minHourProperty.setNative] = function (value) {
        this.nativeViewProtected.minimumDate = getDate(value, this.minute);
    };
    TimePicker.prototype[time_picker_common_1.maxHourProperty.getDefault] = function () {
        return this.nativeViewProtected.maximumDate ? this.nativeViewProtected.maximumDate.getHours() : 24;
    };
    TimePicker.prototype[time_picker_common_1.maxHourProperty.setNative] = function (value) {
        this.nativeViewProtected.maximumDate = getDate(value, this.minute);
    };
    TimePicker.prototype[time_picker_common_1.minMinuteProperty.getDefault] = function () {
        return this.nativeViewProtected.minimumDate ? this.nativeViewProtected.minimumDate.getMinutes() : 0;
    };
    TimePicker.prototype[time_picker_common_1.minMinuteProperty.setNative] = function (value) {
        this.nativeViewProtected.minimumDate = getDate(this.hour, value);
    };
    TimePicker.prototype[time_picker_common_1.maxMinuteProperty.getDefault] = function () {
        return this.nativeViewProtected.maximumDate ? this.nativeViewProtected.maximumDate.getMinutes() : 60;
    };
    TimePicker.prototype[time_picker_common_1.maxMinuteProperty.setNative] = function (value) {
        this.nativeViewProtected.maximumDate = getDate(this.hour, value);
    };
    TimePicker.prototype[time_picker_common_1.minuteIntervalProperty.getDefault] = function () {
        return this.nativeViewProtected.minuteInterval;
    };
    TimePicker.prototype[time_picker_common_1.minuteIntervalProperty.setNative] = function (value) {
        this.nativeViewProtected.minuteInterval = value;
    };
    TimePicker.prototype[time_picker_common_1.colorProperty.getDefault] = function () {
        return this.nativeViewProtected.valueForKey("textColor");
    };
    TimePicker.prototype[time_picker_common_1.colorProperty.setNative] = function (value) {
        var color = value instanceof time_picker_common_1.Color ? value.ios : value;
        this.nativeViewProtected.setValueForKey(color, "textColor");
    };
    return TimePicker;
}(time_picker_common_1.TimePickerBase));
exports.TimePicker = TimePicker;
var UITimePickerChangeHandlerImpl = (function (_super) {
    __extends(UITimePickerChangeHandlerImpl, _super);
    function UITimePickerChangeHandlerImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UITimePickerChangeHandlerImpl.initWithOwner = function (owner) {
        var handler = UITimePickerChangeHandlerImpl.new();
        handler._owner = owner;
        return handler;
    };
    UITimePickerChangeHandlerImpl.prototype.valueChanged = function (sender) {
        var owner = this._owner.get();
        if (!owner) {
            return;
        }
        var components = getComponents(sender.date);
        var timeChanged = false;
        if (components.hour !== owner.hour) {
            time_picker_common_1.hourProperty.nativeValueChange(owner, components.hour);
            timeChanged = true;
        }
        if (components.minute !== owner.minute) {
            time_picker_common_1.minuteProperty.nativeValueChange(owner, components.minute);
            timeChanged = true;
        }
        if (timeChanged) {
            time_picker_common_1.timeProperty.nativeValueChange(owner, new Date(0, 0, 0, components.hour, components.minute));
        }
    };
    UITimePickerChangeHandlerImpl.ObjCExposedMethods = {
        "valueChanged": { returns: interop.types.void, params: [UIDatePicker] }
    };
    return UITimePickerChangeHandlerImpl;
}(NSObject));
//# sourceMappingURL=time-picker.ios.js.map