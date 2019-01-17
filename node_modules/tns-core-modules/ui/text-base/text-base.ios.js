function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var font_1 = require("../styling/font");
var text_base_common_1 = require("./text-base-common");
__export(require("./text-base-common"));
var TextBase = (function (_super) {
    __extends(TextBase, _super);
    function TextBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TextBase.prototype[text_base_common_1.textProperty.getDefault] = function () {
        return text_base_common_1.resetSymbol;
    };
    TextBase.prototype[text_base_common_1.textProperty.setNative] = function (value) {
        var reset = value === text_base_common_1.resetSymbol;
        if (!reset && this.formattedText) {
            return;
        }
        this._setNativeText(reset);
        this._requestLayoutOnTextChanged();
    };
    TextBase.prototype[text_base_common_1.formattedTextProperty.setNative] = function (value) {
        this._setNativeText();
        text_base_common_1.textProperty.nativeValueChange(this, !value ? "" : value.toString());
        this._requestLayoutOnTextChanged();
    };
    TextBase.prototype[text_base_common_1.colorProperty.getDefault] = function () {
        var nativeView = this.nativeTextViewProtected;
        if (nativeView instanceof UIButton) {
            return nativeView.titleColorForState(0);
        }
        else {
            return nativeView.textColor;
        }
    };
    TextBase.prototype[text_base_common_1.colorProperty.setNative] = function (value) {
        var color = value instanceof text_base_common_1.Color ? value.ios : value;
        var nativeView = this.nativeTextViewProtected;
        if (nativeView instanceof UIButton) {
            nativeView.setTitleColorForState(color, 0);
            nativeView.titleLabel.textColor = color;
        }
        else {
            nativeView.textColor = color;
        }
    };
    TextBase.prototype[text_base_common_1.fontInternalProperty.getDefault] = function () {
        var nativeView = this.nativeTextViewProtected;
        nativeView = nativeView instanceof UIButton ? nativeView.titleLabel : nativeView;
        return nativeView.font;
    };
    TextBase.prototype[text_base_common_1.fontInternalProperty.setNative] = function (value) {
        if (!(value instanceof font_1.Font) || !this.formattedText) {
            var nativeView = this.nativeTextViewProtected;
            nativeView = nativeView instanceof UIButton ? nativeView.titleLabel : nativeView;
            var font = value instanceof font_1.Font ? value.getUIFont(nativeView.font) : value;
            nativeView.font = font;
        }
    };
    TextBase.prototype[text_base_common_1.textAlignmentProperty.setNative] = function (value) {
        var nativeView = this.nativeTextViewProtected;
        switch (value) {
            case "initial":
            case "left":
                nativeView.textAlignment = 0;
                break;
            case "center":
                nativeView.textAlignment = 1;
                break;
            case "right":
                nativeView.textAlignment = 2;
                break;
        }
    };
    TextBase.prototype[text_base_common_1.textDecorationProperty.setNative] = function (value) {
        this._setNativeText();
    };
    TextBase.prototype[text_base_common_1.textTransformProperty.setNative] = function (value) {
        this._setNativeText();
    };
    TextBase.prototype[text_base_common_1.letterSpacingProperty.setNative] = function (value) {
        this._setNativeText();
    };
    TextBase.prototype[text_base_common_1.lineHeightProperty.setNative] = function (value) {
        this._setNativeText();
    };
    TextBase.prototype._setNativeText = function (reset) {
        if (reset === void 0) { reset = false; }
        if (reset) {
            var nativeView = this.nativeTextViewProtected;
            if (nativeView instanceof UIButton) {
                nativeView.setAttributedTitleForState(null, 0);
                nativeView.setTitleForState(null, 0);
            }
            else {
                nativeView.attributedText = null;
                nativeView.text = null;
            }
            return;
        }
        if (this.formattedText) {
            this.setFormattedTextDecorationAndTransform();
        }
        else {
            this.setTextDecorationAndTransform();
        }
    };
    TextBase.prototype.setFormattedTextDecorationAndTransform = function () {
        var attrText = this.createNSMutableAttributedString(this.formattedText);
        if (this.letterSpacing !== 0) {
            attrText.addAttributeValueRange(NSKernAttributeName, this.letterSpacing * this.nativeTextViewProtected.font.pointSize, { location: 0, length: attrText.length });
        }
        if (this.style.lineHeight) {
            var paragraphStyle = NSMutableParagraphStyle.alloc().init();
            paragraphStyle.lineSpacing = this.lineHeight;
            paragraphStyle.alignment = this.nativeTextViewProtected.textAlignment;
            if (this.nativeTextViewProtected instanceof UILabel) {
                paragraphStyle.lineBreakMode = this.nativeTextViewProtected.lineBreakMode;
            }
            attrText.addAttributeValueRange(NSParagraphStyleAttributeName, paragraphStyle, { location: 0, length: attrText.length });
        }
        if (this.nativeTextViewProtected instanceof UIButton) {
            this.nativeTextViewProtected.setAttributedTitleForState(attrText, 0);
        }
        else {
            this.nativeTextViewProtected.attributedText = attrText;
        }
    };
    TextBase.prototype.setTextDecorationAndTransform = function () {
        var style = this.style;
        var dict = new Map();
        switch (style.textDecoration) {
            case "none":
                break;
            case "underline":
                dict.set(NSUnderlineStyleAttributeName, 1);
                break;
            case "line-through":
                dict.set(NSStrikethroughStyleAttributeName, 1);
                break;
            case "underline line-through":
                dict.set(NSUnderlineStyleAttributeName, 1);
                dict.set(NSStrikethroughStyleAttributeName, 1);
                break;
            default:
                throw new Error("Invalid text decoration value: " + style.textDecoration + ". Valid values are: 'none', 'underline', 'line-through', 'underline line-through'.");
        }
        if (style.letterSpacing !== 0) {
            dict.set(NSKernAttributeName, style.letterSpacing * this.nativeTextViewProtected.font.pointSize);
        }
        if (style.lineHeight) {
            var paragraphStyle = NSMutableParagraphStyle.alloc().init();
            paragraphStyle.lineSpacing = style.lineHeight;
            paragraphStyle.alignment = this.nativeTextViewProtected.textAlignment;
            if (this.nativeTextViewProtected instanceof UILabel) {
                paragraphStyle.lineBreakMode = this.nativeTextViewProtected.lineBreakMode;
            }
            dict.set(NSParagraphStyleAttributeName, paragraphStyle);
        }
        var isTextView = this.nativeTextViewProtected instanceof UITextView;
        if (style.color && (dict.size > 0 || isTextView)) {
            dict.set(NSForegroundColorAttributeName, style.color.ios);
        }
        var text = this.text;
        var string = (text === undefined || text === null) ? "" : text.toString();
        var source = getTransformedText(string, this.textTransform);
        if (dict.size > 0 || isTextView) {
            if (isTextView) {
                dict.set(NSFontAttributeName, this.nativeTextViewProtected.font);
            }
            var result = NSMutableAttributedString.alloc().initWithString(source);
            result.setAttributesRange(dict, { location: 0, length: source.length });
            if (this.nativeTextViewProtected instanceof UIButton) {
                this.nativeTextViewProtected.setAttributedTitleForState(result, 0);
            }
            else {
                this.nativeTextViewProtected.attributedText = result;
            }
        }
        else {
            if (this.nativeTextViewProtected instanceof UIButton) {
                this.nativeTextViewProtected.setAttributedTitleForState(null, 0);
                this.nativeTextViewProtected.setTitleForState(source, 0);
            }
            else {
                this.nativeTextViewProtected.attributedText = undefined;
                this.nativeTextViewProtected.text = source;
            }
        }
    };
    TextBase.prototype.createNSMutableAttributedString = function (formattedString) {
        var mas = NSMutableAttributedString.alloc().init();
        if (formattedString) {
            for (var i = 0, spanStart = 0, length_1 = formattedString.spans.length; i < length_1; i++) {
                var span = formattedString.spans.getItem(i);
                var text = span.text;
                var textTransform = formattedString.parent.textTransform;
                var spanText = (text === null || text === undefined) ? "" : text.toString();
                if (textTransform !== "none" && textTransform !== "initial") {
                    spanText = getTransformedText(spanText, textTransform);
                }
                var nsAttributedString = this.createMutableStringForSpan(span, spanText);
                mas.insertAttributedStringAtIndex(nsAttributedString, spanStart);
                spanStart += spanText.length;
            }
        }
        return mas;
    };
    TextBase.prototype.createMutableStringForSpan = function (span, text) {
        var viewFont = this.nativeTextViewProtected.font;
        var attrDict = {};
        var style = span.style;
        var bold = text_base_common_1.isBold(style.fontWeight);
        var italic = style.fontStyle === "italic";
        var fontFamily = span.fontFamily;
        var fontSize = span.fontSize;
        if (bold || italic || fontFamily || fontSize) {
            var font = new font_1.Font(style.fontFamily, style.fontSize, style.fontStyle, style.fontWeight);
            var iosFont = font.getUIFont(viewFont);
            attrDict[NSFontAttributeName] = iosFont;
        }
        var color = span.color;
        if (color) {
            attrDict[NSForegroundColorAttributeName] = color.ios;
        }
        var backgroundColor = (style.backgroundColor
            || span.parent.backgroundColor
            || span.parent.parent.backgroundColor);
        if (backgroundColor) {
            attrDict[NSBackgroundColorAttributeName] = backgroundColor.ios;
        }
        var valueSource;
        if (text_base_common_1.textDecorationProperty.isSet(style)) {
            valueSource = style;
        }
        else if (text_base_common_1.textDecorationProperty.isSet(span.parent.style)) {
            valueSource = span.parent.style;
        }
        else if (text_base_common_1.textDecorationProperty.isSet(span.parent.parent.style)) {
            valueSource = span.parent.parent.style;
        }
        if (valueSource) {
            var textDecorations = valueSource.textDecoration;
            var underline_1 = textDecorations.indexOf("underline") !== -1;
            if (underline_1) {
                attrDict[NSUnderlineStyleAttributeName] = underline_1;
            }
            var strikethrough = textDecorations.indexOf("line-through") !== -1;
            if (strikethrough) {
                attrDict[NSStrikethroughStyleAttributeName] = strikethrough;
            }
        }
        return NSMutableAttributedString.alloc().initWithStringAttributes(text, attrDict);
    };
    return TextBase;
}(text_base_common_1.TextBaseCommon));
exports.TextBase = TextBase;
function getTransformedText(text, textTransform) {
    switch (textTransform) {
        case "uppercase":
            return NSStringFromNSAttributedString(text).uppercaseString;
        case "lowercase":
            return NSStringFromNSAttributedString(text).lowercaseString;
        case "capitalize":
            return NSStringFromNSAttributedString(text).capitalizedString;
        default:
            return text;
    }
}
exports.getTransformedText = getTransformedText;
function NSStringFromNSAttributedString(source) {
    return NSString.stringWithString(source instanceof NSAttributedString && source.string || source);
}
//# sourceMappingURL=text-base.ios.js.map