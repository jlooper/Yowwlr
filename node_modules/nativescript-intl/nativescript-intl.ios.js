"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nativescript_intl_common_1 = require("./nativescript-intl-common");
var DateTimeFormat = (function (_super) {
    __extends(DateTimeFormat, _super);
    function DateTimeFormat() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DateTimeFormat.prototype.getNativePattern = function (patternDefinition, locale) {
        var dateFormatter = NSDateFormatter.new();
        if (locale) {
            dateFormatter.locale = NSLocale.alloc().initWithLocaleIdentifier(locale);
        }
        if (patternDefinition.date) {
            dateFormatter.dateStyle = patternDefinition.date === nativescript_intl_common_1.FULL ?
                4 :
                1;
        }
        if (patternDefinition.time) {
            dateFormatter.timeStyle = 3;
        }
        return dateFormatter.dateFormat;
    };
    DateTimeFormat.prototype.formatNative = function (pattern, locale, date) {
        var dateFormatter = NSDateFormatter.new();
        if (locale) {
            dateFormatter.locale = NSLocale.alloc().initWithLocaleIdentifier(locale);
        }
        dateFormatter.dateFormat = pattern;
        return dateFormatter.stringFromDate(date ? date : new Date());
    };
    return DateTimeFormat;
}(nativescript_intl_common_1.DateTimeFormat));
exports.DateTimeFormat = DateTimeFormat;
var NumberFormat = (function (_super) {
    __extends(NumberFormat, _super);
    function NumberFormat() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NumberFormat.prototype.formatNative = function (value, locale, options, pattern) {
        var numberFormat = NSNumberFormatter.new();
        if (locale) {
            numberFormat.locale = NSLocale.alloc().initWithLocaleIdentifier(locale);
        }
        if (options) {
            switch (options.style.toLowerCase()) {
                case "decimal":
                    numberFormat.numberStyle = 1;
                    break;
                case "percent":
                    numberFormat.numberStyle = 3;
                    break;
                case "currency":
                    numberFormat.numberStyle = 2;
                    if (options.currency !== void 0) {
                        numberFormat.currencyCode = options.currency;
                    }
                    break;
                default:
                    numberFormat.numberStyle = 1;
                    break;
            }
        }
        else {
            numberFormat.numberStyle = 1;
        }
        if (options && options.minimumIntegerDigits !== void 0) {
            numberFormat.minimumIntegerDigits = options.minimumIntegerDigits;
        }
        if (options && options.minimumFractionDigits !== void 0) {
            numberFormat.minimumFractionDigits = options.minimumFractionDigits;
        }
        if (options && options.maximumFractionDigits !== void 0) {
            numberFormat.maximumFractionDigits = options.maximumFractionDigits;
        }
        if (options && options.useGrouping !== void 0) {
            numberFormat.usesGroupingSeparator = options.useGrouping;
        }
        if (pattern) {
            numberFormat.positiveFormat = pattern;
        }
        else {
            if (options && (options.style.toLowerCase() === "currency" && options.currencyDisplay === "code")) {
                var tempPattern = numberFormat.positiveFormat;
                tempPattern = tempPattern.replace("¤", "¤¤");
                numberFormat.positiveFormat = tempPattern;
            }
        }
        return numberFormat.stringFromNumber(value);
    };
    return NumberFormat;
}(nativescript_intl_common_1.NumberFormat));
exports.NumberFormat = NumberFormat;
