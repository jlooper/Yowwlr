Object.defineProperty(exports, "__esModule", { value: true });
var observable_1 = require("../../../data/observable");
var style_1 = require("../../styling/style");
exports.Style = style_1.Style;
var profiling_1 = require("../../../profiling");
exports.unsetValue = new Object();
var cssPropertyNames = [];
var symbolPropertyMap = {};
var cssSymbolPropertyMap = {};
var inheritableProperties = new Array();
var inheritableCssProperties = new Array();
function print(map) {
    var symbols = Object.getOwnPropertySymbols(map);
    for (var _i = 0, symbols_1 = symbols; _i < symbols_1.length; _i++) {
        var symbol = symbols_1[_i];
        var prop = map[symbol];
        if (!prop.registered) {
            console.log("Property " + prop.name + " not Registered!!!!!");
        }
    }
}
function _printUnregisteredProperties() {
    print(symbolPropertyMap);
    print(cssSymbolPropertyMap);
}
exports._printUnregisteredProperties = _printUnregisteredProperties;
function _getProperties() {
    return getPropertiesFromMap(symbolPropertyMap);
}
exports._getProperties = _getProperties;
function _getStyleProperties() {
    return getPropertiesFromMap(cssSymbolPropertyMap);
}
exports._getStyleProperties = _getStyleProperties;
function getPropertiesFromMap(map) {
    var props = [];
    Object.getOwnPropertySymbols(map).forEach(function (symbol) { return props.push(map[symbol]); });
    return props;
}
var Property = (function () {
    function Property(options) {
        this.enumerable = true;
        this.configurable = true;
        var propertyName = options.name;
        this.name = propertyName;
        var key = Symbol(propertyName + ":propertyKey");
        this.key = key;
        var getDefault = Symbol(propertyName + ":getDefault");
        this.getDefault = getDefault;
        var setNative = Symbol(propertyName + ":setNative");
        this.setNative = setNative;
        var defaultValueKey = Symbol(propertyName + ":nativeDefaultValue");
        this.defaultValueKey = defaultValueKey;
        var defaultValue = options.defaultValue;
        this.defaultValue = defaultValue;
        var eventName = propertyName + "Change";
        var equalityComparer = options.equalityComparer;
        var affectsLayout = options.affectsLayout;
        var valueChanged = options.valueChanged;
        var valueConverter = options.valueConverter;
        var property = this;
        this.set = function (boxedValue) {
            var reset = boxedValue === exports.unsetValue;
            var value;
            var wrapped;
            if (reset) {
                value = defaultValue;
            }
            else {
                wrapped = boxedValue && boxedValue.wrapped;
                value = wrapped ? observable_1.WrappedValue.unwrap(boxedValue) : boxedValue;
                if (valueConverter && typeof value === "string") {
                    value = valueConverter(value);
                }
            }
            var oldValue = key in this ? this[key] : defaultValue;
            var changed = equalityComparer ? !equalityComparer(oldValue, value) : oldValue !== value;
            if (wrapped || changed) {
                if (affectsLayout) {
                    this.requestLayout();
                }
                if (reset) {
                    delete this[key];
                    if (valueChanged) {
                        valueChanged(this, oldValue, value);
                    }
                    if (this[setNative]) {
                        if (this._suspendNativeUpdatesCount) {
                            if (this._suspendedUpdates) {
                                this._suspendedUpdates[propertyName] = property;
                            }
                        }
                        else {
                            if (defaultValueKey in this) {
                                this[setNative](this[defaultValueKey]);
                                delete this[defaultValueKey];
                            }
                            else {
                                this[setNative](defaultValue);
                            }
                        }
                    }
                }
                else {
                    this[key] = value;
                    if (valueChanged) {
                        valueChanged(this, oldValue, value);
                    }
                    if (this[setNative]) {
                        if (this._suspendNativeUpdatesCount) {
                            if (this._suspendedUpdates) {
                                this._suspendedUpdates[propertyName] = property;
                            }
                        }
                        else {
                            if (!(defaultValueKey in this)) {
                                this[defaultValueKey] = this[getDefault] ? this[getDefault]() : defaultValue;
                            }
                            this[setNative](value);
                        }
                    }
                }
                if (this.hasListeners(eventName)) {
                    this.notify({ object: this, eventName: eventName, propertyName: propertyName, value: value, oldValue: oldValue });
                }
                if (this.domNode) {
                    if (reset) {
                        this.domNode.attributeRemoved(propertyName);
                    }
                    else {
                        this.domNode.attributeModified(propertyName, value);
                    }
                }
            }
        };
        this.get = function () {
            return key in this ? this[key] : defaultValue;
        };
        this.nativeValueChange = function (owner, value) {
            var oldValue = key in owner ? owner[key] : defaultValue;
            var changed = equalityComparer ? !equalityComparer(oldValue, value) : oldValue !== value;
            if (changed) {
                owner[key] = value;
                if (valueChanged) {
                    valueChanged(owner, oldValue, value);
                }
                if (owner.nativeViewProtected && !(defaultValueKey in owner)) {
                    owner[defaultValueKey] = owner[getDefault] ? owner[getDefault]() : defaultValue;
                }
                if (owner.hasListeners(eventName)) {
                    owner.notify({ object: owner, eventName: eventName, propertyName: propertyName, value: value, oldValue: oldValue });
                }
                if (affectsLayout) {
                    owner.requestLayout();
                }
                if (owner.domNode) {
                    owner.domNode.attributeModified(propertyName, value);
                }
            }
        };
        symbolPropertyMap[key] = this;
    }
    Property.prototype.register = function (cls) {
        if (this.registered) {
            throw new Error("Property " + this.name + " already registered.");
        }
        this.registered = true;
        Object.defineProperty(cls.prototype, this.name, this);
    };
    Property.prototype.isSet = function (instance) {
        return this.key in instance;
    };
    return Property;
}());
exports.Property = Property;
Property.prototype.isStyleProperty = false;
var CoercibleProperty = (function (_super) {
    __extends(CoercibleProperty, _super);
    function CoercibleProperty(options) {
        var _this = _super.call(this, options) || this;
        var propertyName = options.name;
        var key = _this.key;
        var getDefault = _this.getDefault;
        var setNative = _this.setNative;
        var defaultValueKey = _this.defaultValueKey;
        var defaultValue = _this.defaultValue;
        var coerceKey = Symbol(propertyName + ":coerceKey");
        var eventName = propertyName + "Change";
        var affectsLayout = options.affectsLayout;
        var equalityComparer = options.equalityComparer;
        var valueChanged = options.valueChanged;
        var valueConverter = options.valueConverter;
        var coerceCallback = options.coerceValue;
        var property = _this;
        _this.coerce = function (target) {
            var originalValue = coerceKey in target ? target[coerceKey] : defaultValue;
            target[propertyName] = originalValue;
        };
        _this.set = function (boxedValue) {
            var reset = boxedValue === exports.unsetValue;
            var value;
            var wrapped;
            if (reset) {
                value = defaultValue;
                delete this[coerceKey];
            }
            else {
                wrapped = boxedValue && boxedValue.wrapped;
                value = wrapped ? observable_1.WrappedValue.unwrap(boxedValue) : boxedValue;
                if (valueConverter && typeof value === "string") {
                    value = valueConverter(value);
                }
                this[coerceKey] = value;
                value = coerceCallback(this, value);
            }
            var oldValue = key in this ? this[key] : defaultValue;
            var changed = equalityComparer ? !equalityComparer(oldValue, value) : oldValue !== value;
            if (wrapped || changed) {
                if (reset) {
                    delete this[key];
                    if (valueChanged) {
                        valueChanged(this, oldValue, value);
                    }
                    if (this[setNative]) {
                        if (this._suspendNativeUpdatesCount) {
                            if (this._suspendedUpdates) {
                                this._suspendedUpdates[propertyName] = property;
                            }
                        }
                        else {
                            if (defaultValueKey in this) {
                                this[setNative](this[defaultValueKey]);
                                delete this[defaultValueKey];
                            }
                            else {
                                this[setNative](defaultValue);
                            }
                        }
                    }
                }
                else {
                    this[key] = value;
                    if (valueChanged) {
                        valueChanged(this, oldValue, value);
                    }
                    if (this[setNative]) {
                        if (this._suspendNativeUpdatesCount) {
                            if (this._suspendedUpdates) {
                                this._suspendedUpdates[propertyName] = property;
                            }
                        }
                        else {
                            if (!(defaultValueKey in this)) {
                                this[defaultValueKey] = this[getDefault] ? this[getDefault]() : defaultValue;
                            }
                            this[setNative](value);
                        }
                    }
                }
                if (this.hasListeners(eventName)) {
                    this.notify({ object: this, eventName: eventName, propertyName: propertyName, value: value, oldValue: oldValue });
                }
                if (affectsLayout) {
                    this.requestLayout();
                }
                if (this.domNode) {
                    if (reset) {
                        this.domNode.attributeRemoved(propertyName);
                    }
                    else {
                        this.domNode.attributeModified(propertyName, value);
                    }
                }
            }
        };
        return _this;
    }
    return CoercibleProperty;
}(Property));
exports.CoercibleProperty = CoercibleProperty;
var InheritedProperty = (function (_super) {
    __extends(InheritedProperty, _super);
    function InheritedProperty(options) {
        var _this = _super.call(this, options) || this;
        var name = options.name;
        var key = _this.key;
        var defaultValue = options.defaultValue;
        var sourceKey = Symbol(name + ":valueSourceKey");
        _this.sourceKey = sourceKey;
        var setBase = _this.set;
        var setFunc = function (valueSource) { return function (value) {
            var that = this;
            var unboxedValue;
            var newValueSource;
            if (value === exports.unsetValue) {
                var parent_1 = that.parent;
                if (parent_1 && parent_1[sourceKey] !== 0) {
                    unboxedValue = parent_1[name];
                    newValueSource = 1;
                }
                else {
                    unboxedValue = defaultValue;
                    newValueSource = 0;
                }
            }
            else {
                unboxedValue = value;
                newValueSource = valueSource;
            }
            var currentValue = that[key];
            setBase.call(that, unboxedValue);
            var newValue = that[key];
            that[sourceKey] = newValueSource;
            if (currentValue !== newValue) {
                var reset_1 = newValueSource === 0;
                that.eachChild(function (child) {
                    var childValueSource = child[sourceKey] || 0;
                    if (reset_1) {
                        if (childValueSource === 1) {
                            setFunc.call(child, exports.unsetValue);
                        }
                    }
                    else {
                        if (childValueSource <= 1) {
                            setInheritedValue.call(child, newValue);
                        }
                    }
                    return true;
                });
            }
        }; };
        var setInheritedValue = setFunc(1);
        _this.setInheritedValue = setInheritedValue;
        _this.set = setFunc(3);
        inheritableProperties.push(_this);
        return _this;
    }
    return InheritedProperty;
}(Property));
exports.InheritedProperty = InheritedProperty;
var CssProperty = (function () {
    function CssProperty(options) {
        var propertyName = options.name;
        this.name = propertyName;
        cssPropertyNames.push(options.cssName);
        this.cssName = "css:" + options.cssName;
        this.cssLocalName = options.cssName;
        var key = Symbol(propertyName + ":propertyKey");
        this.key = key;
        var sourceKey = Symbol(propertyName + ":valueSourceKey");
        this.sourceKey = sourceKey;
        var getDefault = Symbol(propertyName + ":getDefault");
        this.getDefault = getDefault;
        var setNative = Symbol(propertyName + ":setNative");
        this.setNative = setNative;
        var defaultValueKey = Symbol(propertyName + ":nativeDefaultValue");
        this.defaultValueKey = defaultValueKey;
        var defaultValue = options.defaultValue;
        this.defaultValue = defaultValue;
        var eventName = propertyName + "Change";
        var affectsLayout = options.affectsLayout;
        var equalityComparer = options.equalityComparer;
        var valueChanged = options.valueChanged;
        var valueConverter = options.valueConverter;
        var property = this;
        function setLocalValue(newValue) {
            var reset = newValue === exports.unsetValue || newValue === "";
            var value;
            if (reset) {
                value = defaultValue;
                delete this[sourceKey];
            }
            else {
                this[sourceKey] = 3;
                value = (valueConverter && typeof newValue === "string") ?
                    valueConverter(newValue) :
                    newValue;
            }
            var oldValue = key in this ? this[key] : defaultValue;
            var changed = equalityComparer ? !equalityComparer(oldValue, value) : oldValue !== value;
            if (changed) {
                var view = this.view;
                if (reset) {
                    delete this[key];
                    if (valueChanged) {
                        valueChanged(this, oldValue, value);
                    }
                    if (view[setNative]) {
                        if (view._suspendNativeUpdatesCount) {
                            if (view._suspendedUpdates) {
                                view._suspendedUpdates[propertyName] = property;
                            }
                        }
                        else {
                            if (defaultValueKey in this) {
                                view[setNative](this[defaultValueKey]);
                                delete this[defaultValueKey];
                            }
                            else {
                                view[setNative](defaultValue);
                            }
                        }
                    }
                }
                else {
                    this[key] = value;
                    if (valueChanged) {
                        valueChanged(this, oldValue, value);
                    }
                    if (view[setNative]) {
                        if (view._suspendNativeUpdatesCount) {
                            if (view._suspendedUpdates) {
                                view._suspendedUpdates[propertyName] = property;
                            }
                        }
                        else {
                            if (!(defaultValueKey in this)) {
                                this[defaultValueKey] = view[getDefault] ? view[getDefault]() : defaultValue;
                            }
                            view[setNative](value);
                        }
                    }
                }
                if (this.hasListeners(eventName)) {
                    this.notify({ object: this, eventName: eventName, propertyName: propertyName, value: value, oldValue: oldValue });
                }
                if (affectsLayout) {
                    view.requestLayout();
                }
            }
        }
        function setCssValue(newValue) {
            var currentValueSource = this[sourceKey] || 0;
            if (currentValueSource === 3) {
                return;
            }
            var reset = newValue === exports.unsetValue || newValue === "";
            var value;
            if (reset) {
                value = defaultValue;
                delete this[sourceKey];
            }
            else {
                value = valueConverter && typeof newValue === "string" ?
                    valueConverter(newValue) :
                    newValue;
                this[sourceKey] = 2;
            }
            var oldValue = key in this ? this[key] : defaultValue;
            var changed = equalityComparer ? !equalityComparer(oldValue, value) : oldValue !== value;
            if (changed) {
                var view = this.view;
                if (reset) {
                    delete this[key];
                    if (valueChanged) {
                        valueChanged(this, oldValue, value);
                    }
                    if (view[setNative]) {
                        if (view._suspendNativeUpdatesCount) {
                            if (view._suspendedUpdates) {
                                view._suspendedUpdates[propertyName] = property;
                            }
                        }
                        else {
                            if (defaultValueKey in this) {
                                view[setNative](this[defaultValueKey]);
                                delete this[defaultValueKey];
                            }
                            else {
                                view[setNative](defaultValue);
                            }
                        }
                    }
                }
                else {
                    this[key] = value;
                    if (valueChanged) {
                        valueChanged(this, oldValue, value);
                    }
                    if (view[setNative]) {
                        if (view._suspendNativeUpdatesCount) {
                            if (view._suspendedUpdates) {
                                view._suspendedUpdates[propertyName] = property;
                            }
                        }
                        else {
                            if (!(defaultValueKey in this)) {
                                this[defaultValueKey] = view[getDefault] ? view[getDefault]() : defaultValue;
                            }
                            view[setNative](value);
                        }
                    }
                }
                if (this.hasListeners(eventName)) {
                    this.notify({ object: this, eventName: eventName, propertyName: propertyName, value: value, oldValue: oldValue });
                }
                if (affectsLayout) {
                    view.requestLayout();
                }
            }
        }
        function get() {
            return key in this ? this[key] : defaultValue;
        }
        this.cssValueDescriptor = {
            enumerable: true,
            configurable: true,
            get: get,
            set: setCssValue
        };
        this.localValueDescriptor = {
            enumerable: true,
            configurable: true,
            get: get,
            set: setLocalValue
        };
        cssSymbolPropertyMap[key] = this;
    }
    CssProperty.prototype.register = function (cls) {
        if (this.registered) {
            throw new Error("Property " + this.name + " already registered.");
        }
        this.registered = true;
        Object.defineProperty(cls.prototype, this.name, this.localValueDescriptor);
        Object.defineProperty(cls.prototype, this.cssName, this.cssValueDescriptor);
        if (this.cssLocalName !== this.cssName) {
            Object.defineProperty(cls.prototype, this.cssLocalName, this.localValueDescriptor);
        }
    };
    CssProperty.prototype.isSet = function (instance) {
        return this.key in instance;
    };
    return CssProperty;
}());
exports.CssProperty = CssProperty;
CssProperty.prototype.isStyleProperty = true;
var CssAnimationProperty = (function () {
    function CssAnimationProperty(options) {
        var valueConverter = options.valueConverter, equalityComparer = options.equalityComparer, valueChanged = options.valueChanged, defaultValue = options.defaultValue;
        var propertyName = options.name;
        this.name = propertyName;
        cssPropertyNames.push(options.cssName);
        CssAnimationProperty.properties[propertyName] = this;
        if (options.cssName && options.cssName !== propertyName) {
            CssAnimationProperty.properties[options.cssName] = this;
        }
        this._valueConverter = options.valueConverter;
        var cssLocalName = (options.cssName || propertyName);
        this.cssLocalName = cssLocalName;
        var cssName = "css:" + cssLocalName;
        this.cssName = cssName;
        var keyframeName = "keyframe:" + propertyName;
        this.keyframe = keyframeName;
        var defaultName = "default:" + propertyName;
        var defaultValueKey = Symbol(defaultName);
        this.defaultValueKey = defaultValueKey;
        this.defaultValue = defaultValue;
        var cssValue = Symbol(cssName);
        var styleValue = Symbol("local:" + propertyName);
        var keyframeValue = Symbol(keyframeName);
        var computedValue = Symbol("computed-value:" + propertyName);
        this.key = computedValue;
        var computedSource = Symbol("computed-source:" + propertyName);
        this.source = computedSource;
        this.getDefault = Symbol(propertyName + ":getDefault");
        var getDefault = this.getDefault;
        var setNative = this.setNative = Symbol(propertyName + ":setNative");
        var eventName = propertyName + "Change";
        var property = this;
        function descriptor(symbol, propertySource, enumerable, configurable, getsComputed) {
            return {
                enumerable: enumerable, configurable: configurable,
                get: getsComputed ? function () { return this[computedValue]; } : function () { return this[symbol]; },
                set: function (boxedValue) {
                    var oldValue = this[computedValue];
                    var oldSource = this[computedSource];
                    var wasSet = oldSource !== 0;
                    var reset = boxedValue === exports.unsetValue || boxedValue === "";
                    if (reset) {
                        this[symbol] = exports.unsetValue;
                        if (this[computedSource] === propertySource) {
                            if (this[styleValue] !== exports.unsetValue) {
                                this[computedSource] = 3;
                                this[computedValue] = this[styleValue];
                            }
                            else if (this[cssValue] !== exports.unsetValue) {
                                this[computedSource] = 2;
                                this[computedValue] = this[cssValue];
                            }
                            else {
                                delete this[computedSource];
                                delete this[computedValue];
                            }
                        }
                    }
                    else {
                        if (valueConverter && typeof boxedValue === "string") {
                            boxedValue = valueConverter(boxedValue);
                        }
                        this[symbol] = boxedValue;
                        if (this[computedSource] <= propertySource) {
                            this[computedSource] = propertySource;
                            this[computedValue] = boxedValue;
                        }
                    }
                    var value = this[computedValue];
                    var source = this[computedSource];
                    var isSet = source !== 0;
                    var computedValueChanged = oldValue !== value && (!equalityComparer || !equalityComparer(oldValue, value));
                    if (computedValueChanged && valueChanged) {
                        valueChanged(this, oldValue, value);
                    }
                    var view = this.view;
                    if (view[setNative] && (computedValueChanged || isSet !== wasSet)) {
                        if (view._suspendNativeUpdatesCount) {
                            if (view._suspendedUpdates) {
                                view._suspendedUpdates[propertyName] = property;
                            }
                        }
                        else {
                            if (isSet) {
                                if (!wasSet && !(defaultValueKey in this)) {
                                    this[defaultValueKey] = view[getDefault] ? view[getDefault]() : defaultValue;
                                }
                                view[setNative](value);
                            }
                            else if (wasSet) {
                                if (defaultValueKey in this) {
                                    view[setNative](this[defaultValueKey]);
                                }
                                else {
                                    view[setNative](defaultValue);
                                }
                            }
                        }
                    }
                    if (computedValueChanged && this.hasListeners(eventName)) {
                        this.notify({ object: this, eventName: eventName, propertyName: propertyName, value: value, oldValue: oldValue });
                    }
                }
            };
        }
        var defaultPropertyDescriptor = descriptor(defaultValueKey, 0, false, false, false);
        var cssPropertyDescriptor = descriptor(cssValue, 2, false, false, false);
        var stylePropertyDescriptor = descriptor(styleValue, 3, true, true, true);
        var keyframePropertyDescriptor = descriptor(keyframeValue, 4, false, false, false);
        symbolPropertyMap[computedValue] = this;
        cssSymbolPropertyMap[computedValue] = this;
        this.register = function (cls) {
            cls.prototype[computedValue] = options.defaultValue;
            cls.prototype[computedSource] = 0;
            cls.prototype[cssValue] = exports.unsetValue;
            cls.prototype[styleValue] = exports.unsetValue;
            cls.prototype[keyframeValue] = exports.unsetValue;
            Object.defineProperty(cls.prototype, defaultName, defaultPropertyDescriptor);
            Object.defineProperty(cls.prototype, cssName, cssPropertyDescriptor);
            Object.defineProperty(cls.prototype, propertyName, stylePropertyDescriptor);
            if (options.cssName && options.cssName !== options.name) {
                Object.defineProperty(cls.prototype, options.cssName, stylePropertyDescriptor);
            }
            Object.defineProperty(cls.prototype, keyframeName, keyframePropertyDescriptor);
        };
    }
    CssAnimationProperty.prototype._initDefaultNativeValue = function (target) {
        var defaultValueKey = this.defaultValueKey;
        if (!(defaultValueKey in target)) {
            var view = target.view;
            var getDefault = this.getDefault;
            target[defaultValueKey] = view[getDefault] ? view[getDefault]() : this.defaultValue;
        }
    };
    CssAnimationProperty._getByCssName = function (name) {
        return this.properties[name];
    };
    CssAnimationProperty._getPropertyNames = function () {
        return Object.keys(CssAnimationProperty.properties);
    };
    CssAnimationProperty.prototype.isSet = function (instance) {
        return instance[this.source] !== 0;
    };
    CssAnimationProperty.properties = {};
    return CssAnimationProperty;
}());
exports.CssAnimationProperty = CssAnimationProperty;
CssAnimationProperty.prototype.isStyleProperty = true;
var InheritedCssProperty = (function (_super) {
    __extends(InheritedCssProperty, _super);
    function InheritedCssProperty(options) {
        var _this = _super.call(this, options) || this;
        var propertyName = options.name;
        var key = _this.key;
        var sourceKey = _this.sourceKey;
        var getDefault = _this.getDefault;
        var setNative = _this.setNative;
        var defaultValueKey = _this.defaultValueKey;
        var eventName = propertyName + "Change";
        var defaultValue = options.defaultValue;
        var affectsLayout = options.affectsLayout;
        var equalityComparer = options.equalityComparer;
        var valueChanged = options.valueChanged;
        var valueConverter = options.valueConverter;
        var property = _this;
        var setFunc = function (valueSource) { return function (boxedValue) {
            var reset = boxedValue === exports.unsetValue || boxedValue === "";
            var currentValueSource = this[sourceKey] || 0;
            if (reset) {
                if (valueSource === 2 && currentValueSource === 3) {
                    return;
                }
            }
            else {
                if (currentValueSource > valueSource) {
                    return;
                }
            }
            var oldValue = key in this ? this[key] : defaultValue;
            var view = this.view;
            var value;
            var unsetNativeValue = false;
            if (reset) {
                var parent_2 = view.parent;
                var style = parent_2 ? parent_2.style : null;
                if (style && style[sourceKey] > 0) {
                    value = style[propertyName];
                    this[sourceKey] = 1;
                    this[key] = value;
                }
                else {
                    value = defaultValue;
                    delete this[sourceKey];
                    delete this[key];
                    unsetNativeValue = true;
                }
            }
            else {
                this[sourceKey] = valueSource;
                if (valueConverter && typeof boxedValue === "string") {
                    value = valueConverter(boxedValue);
                }
                else {
                    value = boxedValue;
                }
                this[key] = value;
            }
            var changed = equalityComparer ? !equalityComparer(oldValue, value) : oldValue !== value;
            if (changed) {
                var view_1 = this.view;
                if (valueChanged) {
                    valueChanged(this, oldValue, value);
                }
                if (view_1[setNative]) {
                    if (view_1._suspendNativeUpdatesCount) {
                        if (view_1._suspendedUpdates) {
                            view_1._suspendedUpdates[propertyName] = property;
                        }
                    }
                    else {
                        if (unsetNativeValue) {
                            if (defaultValueKey in this) {
                                view_1[setNative](this[defaultValueKey]);
                                delete this[defaultValueKey];
                            }
                            else {
                                view_1[setNative](defaultValue);
                            }
                        }
                        else {
                            if (!(defaultValueKey in this)) {
                                this[defaultValueKey] = view_1[getDefault] ? view_1[getDefault]() : defaultValue;
                            }
                            view_1[setNative](value);
                        }
                    }
                }
                if (this.hasListeners(eventName)) {
                    this.notify({ object: this, eventName: eventName, propertyName: propertyName, value: value, oldValue: oldValue });
                }
                if (affectsLayout) {
                    view_1.requestLayout();
                }
                view_1.eachChild(function (child) {
                    var childStyle = child.style;
                    var childValueSource = childStyle[sourceKey] || 0;
                    if (reset) {
                        if (childValueSource === 1) {
                            setDefaultFunc.call(childStyle, exports.unsetValue);
                        }
                    }
                    else {
                        if (childValueSource <= 1) {
                            setInheritedFunc.call(childStyle, value);
                        }
                    }
                    return true;
                });
            }
        }; };
        var setDefaultFunc = setFunc(0);
        var setInheritedFunc = setFunc(1);
        _this.setInheritedValue = setInheritedFunc;
        _this.cssValueDescriptor.set = setFunc(2);
        _this.localValueDescriptor.set = setFunc(3);
        inheritableCssProperties.push(_this);
        return _this;
    }
    return InheritedCssProperty;
}(CssProperty));
exports.InheritedCssProperty = InheritedCssProperty;
var ShorthandProperty = (function () {
    function ShorthandProperty(options) {
        this.name = options.name;
        var key = Symbol(this.name + ":propertyKey");
        this.key = key;
        this.cssName = "css:" + options.cssName;
        this.cssLocalName = "" + options.cssName;
        var converter = options.converter;
        function setLocalValue(value) {
            var _this = this;
            this.view._batchUpdate(function () {
                for (var _i = 0, _a = converter(value); _i < _a.length; _i++) {
                    var _b = _a[_i], p = _b[0], v = _b[1];
                    _this[p.name] = v;
                }
            });
        }
        function setCssValue(value) {
            var _this = this;
            this.view._batchUpdate(function () {
                for (var _i = 0, _a = converter(value); _i < _a.length; _i++) {
                    var _b = _a[_i], p = _b[0], v = _b[1];
                    _this[p.cssName] = v;
                }
            });
        }
        this.cssValueDescriptor = {
            enumerable: true,
            configurable: true,
            get: options.getter,
            set: setCssValue
        };
        this.localValueDescriptor = {
            enumerable: true,
            configurable: true,
            get: options.getter,
            set: setLocalValue
        };
        this.propertyBagDescriptor = {
            enumerable: false,
            configurable: true,
            set: function (value) {
                var _this = this;
                converter(value).forEach(function (_a) {
                    var property = _a[0], value = _a[1];
                    _this[property.cssLocalName] = value;
                });
            }
        };
        cssSymbolPropertyMap[key] = this;
    }
    ShorthandProperty.prototype.register = function (cls) {
        if (this.registered) {
            throw new Error("Property " + this.name + " already registered.");
        }
        this.registered = true;
        Object.defineProperty(cls.prototype, this.name, this.localValueDescriptor);
        Object.defineProperty(cls.prototype, this.cssName, this.cssValueDescriptor);
        if (this.cssLocalName !== this.cssName) {
            Object.defineProperty(cls.prototype, this.cssLocalName, this.localValueDescriptor);
        }
        Object.defineProperty(cls.prototype.PropertyBag, this.cssLocalName, this.propertyBagDescriptor);
    };
    return ShorthandProperty;
}());
exports.ShorthandProperty = ShorthandProperty;
function inheritablePropertyValuesOn(view) {
    var array = new Array();
    for (var _i = 0, inheritableProperties_1 = inheritableProperties; _i < inheritableProperties_1.length; _i++) {
        var prop = inheritableProperties_1[_i];
        var sourceKey = prop.sourceKey;
        var valueSource = view[sourceKey] || 0;
        if (valueSource !== 0) {
            array.push({ property: prop, value: view[prop.name] });
        }
    }
    return array;
}
function inheritableCssPropertyValuesOn(style) {
    var array = new Array();
    for (var _i = 0, inheritableCssProperties_1 = inheritableCssProperties; _i < inheritableCssProperties_1.length; _i++) {
        var prop = inheritableCssProperties_1[_i];
        var sourceKey = prop.sourceKey;
        var valueSource = style[sourceKey] || 0;
        if (valueSource !== 0) {
            array.push({ property: prop, value: style[prop.name] });
        }
    }
    return array;
}
exports.initNativeView = profiling_1.profile("\"properties\".initNativeView", function initNativeView(view) {
    if (view._suspendedUpdates) {
        applyPendingNativeSetters(view);
    }
    else {
        applyAllNativeSetters(view);
    }
    view._suspendedUpdates = {};
});
function applyPendingNativeSetters(view) {
    var suspendedUpdates = view._suspendedUpdates;
    for (var propertyName in suspendedUpdates) {
        var property = suspendedUpdates[propertyName];
        var setNative = property.setNative;
        if (view[setNative]) {
            var getDefault = property.getDefault, isStyleProperty = property.isStyleProperty, defaultValueKey = property.defaultValueKey, defaultValue = property.defaultValue;
            var value = void 0;
            if (isStyleProperty) {
                var style = view.style;
                if (property.isSet(view.style)) {
                    if (!(defaultValueKey in style)) {
                        style[defaultValueKey] = view[getDefault] ? view[getDefault]() : defaultValue;
                    }
                    value = view.style[propertyName];
                }
                else {
                    value = style[defaultValueKey];
                }
            }
            else {
                if (property.isSet(view)) {
                    if (!(defaultValueKey in view)) {
                        view[defaultValueKey] = view[getDefault] ? view[getDefault]() : defaultValue;
                    }
                    value = view[propertyName];
                }
                else {
                    value = view[defaultValueKey];
                }
            }
            view[setNative](value);
        }
    }
}
exports.applyPendingNativeSetters = applyPendingNativeSetters;
function applyAllNativeSetters(view) {
    var symbols = Object.getOwnPropertySymbols(view);
    for (var _i = 0, symbols_2 = symbols; _i < symbols_2.length; _i++) {
        var symbol = symbols_2[_i];
        var property = symbolPropertyMap[symbol];
        if (!property) {
            continue;
        }
        var setNative = property.setNative;
        var getDefault = property.getDefault;
        if (setNative in view) {
            var defaultValueKey = property.defaultValueKey;
            if (!(defaultValueKey in view)) {
                view[defaultValueKey] = view[getDefault] ? view[getDefault]() : property.defaultValue;
            }
            var value = view[symbol];
            view[setNative](value);
        }
    }
    var style = view.style;
    symbols = Object.getOwnPropertySymbols(style);
    for (var _a = 0, symbols_3 = symbols; _a < symbols_3.length; _a++) {
        var symbol = symbols_3[_a];
        var property = cssSymbolPropertyMap[symbol];
        if (!property) {
            continue;
        }
        if (view[property.setNative]) {
            var defaultValueKey = property.defaultValueKey;
            if (!(defaultValueKey in style)) {
                style[defaultValueKey] = view[property.getDefault] ? view[property.getDefault]() : property.defaultValue;
            }
            var value = style[symbol];
            view[property.setNative](value);
        }
    }
}
exports.applyAllNativeSetters = applyAllNativeSetters;
function resetNativeView(view) {
    var symbols = Object.getOwnPropertySymbols(view);
    for (var _i = 0, symbols_4 = symbols; _i < symbols_4.length; _i++) {
        var symbol = symbols_4[_i];
        var property = symbolPropertyMap[symbol];
        if (!property) {
            continue;
        }
        if (view[property.setNative]) {
            if (property.defaultValueKey in view) {
                view[property.setNative](view[property.defaultValueKey]);
                delete view[property.defaultValueKey];
            }
            else {
                view[property.setNative](property.defaultValue);
            }
        }
    }
    var style = view.style;
    symbols = Object.getOwnPropertySymbols(style);
    for (var _a = 0, symbols_5 = symbols; _a < symbols_5.length; _a++) {
        var symbol = symbols_5[_a];
        var property = cssSymbolPropertyMap[symbol];
        if (!property) {
            continue;
        }
        if (view[property.setNative]) {
            if (property.defaultValueKey in style) {
                view[property.setNative](style[property.defaultValueKey]);
                delete style[property.defaultValueKey];
            }
            else {
                view[property.setNative](property.defaultValue);
            }
        }
    }
}
exports.resetNativeView = resetNativeView;
function clearInheritedProperties(view) {
    for (var _i = 0, inheritableProperties_2 = inheritableProperties; _i < inheritableProperties_2.length; _i++) {
        var prop = inheritableProperties_2[_i];
        var sourceKey = prop.sourceKey;
        if (view[sourceKey] === 1) {
            prop.set.call(view, exports.unsetValue);
        }
    }
    var style = view.style;
    for (var _a = 0, inheritableCssProperties_2 = inheritableCssProperties; _a < inheritableCssProperties_2.length; _a++) {
        var prop = inheritableCssProperties_2[_a];
        var sourceKey = prop.sourceKey;
        if (style[sourceKey] === 1) {
            prop.setInheritedValue.call(style, exports.unsetValue);
        }
    }
}
exports.clearInheritedProperties = clearInheritedProperties;
function resetCSSProperties(style) {
    var symbols = Object.getOwnPropertySymbols(style);
    for (var _i = 0, symbols_6 = symbols; _i < symbols_6.length; _i++) {
        var symbol = symbols_6[_i];
        var cssProperty = void 0;
        if (cssProperty = cssSymbolPropertyMap[symbol]) {
            style[cssProperty.cssName] = exports.unsetValue;
            if (cssProperty instanceof CssAnimationProperty) {
                style[cssProperty.keyframe] = exports.unsetValue;
            }
        }
    }
}
exports.resetCSSProperties = resetCSSProperties;
function propagateInheritableProperties(view, child) {
    var inheritablePropertyValues = inheritablePropertyValuesOn(view);
    for (var _i = 0, inheritablePropertyValues_1 = inheritablePropertyValues; _i < inheritablePropertyValues_1.length; _i++) {
        var pair = inheritablePropertyValues_1[_i];
        var prop = pair.property;
        var sourceKey = prop.sourceKey;
        var currentValueSource = child[sourceKey] || 0;
        if (currentValueSource <= 1) {
            prop.setInheritedValue.call(child, pair.value);
        }
    }
}
exports.propagateInheritableProperties = propagateInheritableProperties;
function propagateInheritableCssProperties(parentStyle, childStyle) {
    var inheritableCssPropertyValues = inheritableCssPropertyValuesOn(parentStyle);
    for (var _i = 0, inheritableCssPropertyValues_1 = inheritableCssPropertyValues; _i < inheritableCssPropertyValues_1.length; _i++) {
        var pair = inheritableCssPropertyValues_1[_i];
        var prop = pair.property;
        var sourceKey = prop.sourceKey;
        var currentValueSource = childStyle[sourceKey] || 0;
        if (currentValueSource <= 1) {
            prop.setInheritedValue.call(childStyle, pair.value, 1);
        }
    }
}
exports.propagateInheritableCssProperties = propagateInheritableCssProperties;
function makeValidator() {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
    var set = new Set(values);
    return function (value) { return set.has(value); };
}
exports.makeValidator = makeValidator;
function makeParser(isValid) {
    return function (value) {
        var lower = value && value.toLowerCase();
        if (isValid(lower)) {
            return lower;
        }
        else {
            throw new Error("Invalid value: " + value);
        }
    };
}
exports.makeParser = makeParser;
function getSetProperties(view) {
    var result = [];
    Object.getOwnPropertyNames(view).forEach(function (prop) {
        result.push([prop, view[prop]]);
    });
    var symbols = Object.getOwnPropertySymbols(view);
    for (var _i = 0, symbols_7 = symbols; _i < symbols_7.length; _i++) {
        var symbol = symbols_7[_i];
        var property = symbolPropertyMap[symbol];
        if (!property) {
            continue;
        }
        var value = view[property.key];
        result.push([property.name, value]);
    }
    return result;
}
exports.getSetProperties = getSetProperties;
function getComputedCssValues(view) {
    var result = [];
    var style = view.style;
    for (var _i = 0, cssPropertyNames_1 = cssPropertyNames; _i < cssPropertyNames_1.length; _i++) {
        var prop = cssPropertyNames_1[_i];
        result.push([prop, style[prop]]);
    }
    result.push(["top", "auto"]);
    result.push(["left", "auto"]);
    result.push(["bottom", "auto"]);
    result.push(["right", "auto"]);
    return result;
}
exports.getComputedCssValues = getComputedCssValues;
//# sourceMappingURL=properties.js.map