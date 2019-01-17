function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var font_1 = require("../styling/font");
var style_properties_1 = require("../styling/style-properties");
var text_base_common_1 = require("./text-base-common");
__export(require("./text-base-common"));
var TextTransformation;
function initializeTextTransformation() {
    if (TextTransformation) {
        return;
    }
    var TextTransformationImpl = (function (_super) {
        __extends(TextTransformationImpl, _super);
        function TextTransformationImpl(textBase) {
            var _this = _super.call(this) || this;
            _this.textBase = textBase;
            return global.__native(_this);
        }
        TextTransformationImpl.prototype.getTransformation = function (charSeq, view) {
            var formattedText = this.textBase.formattedText;
            if (formattedText) {
                return createSpannableStringBuilder(formattedText);
            }
            else {
                return getTransformedText(this.textBase.text, this.textBase.textTransform);
            }
        };
        TextTransformationImpl.prototype.onFocusChanged = function (view, sourceText, focused, direction, previouslyFocusedRect) {
        };
        TextTransformationImpl = __decorate([
            Interfaces([android.text.method.TransformationMethod])
        ], TextTransformationImpl);
        return TextTransformationImpl;
    }(java.lang.Object));
    TextTransformation = TextTransformationImpl;
}
var TextBase = (function (_super) {
    __extends(TextBase, _super);
    function TextBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TextBase.prototype.initNativeView = function () {
        _super.prototype.initNativeView.call(this);
        initializeTextTransformation();
        var nativeView = this.nativeTextViewProtected;
        this._defaultTransformationMethod = nativeView.getTransformationMethod();
        this._minHeight = nativeView.getMinHeight();
        this._maxHeight = nativeView.getMaxHeight();
        this._minLines = nativeView.getMinLines();
        this._maxLines = nativeView.getMaxLines();
    };
    TextBase.prototype.resetNativeView = function () {
        _super.prototype.resetNativeView.call(this);
        var nativeView = this.nativeTextViewProtected;
        nativeView.setSingleLine(this._isSingleLine);
        nativeView.setTransformationMethod(this._defaultTransformationMethod);
        this._defaultTransformationMethod = null;
        if (this._paintFlags !== undefined) {
            nativeView.setPaintFlags(this._paintFlags);
            this._paintFlags = undefined;
        }
        if (this._minLines !== -1) {
            nativeView.setMinLines(this._minLines);
        }
        else {
            nativeView.setMinHeight(this._minHeight);
        }
        this._minHeight = this._minLines = undefined;
        if (this._maxLines !== -1) {
            nativeView.setMaxLines(this._maxLines);
        }
        else {
            nativeView.setMaxHeight(this._maxHeight);
        }
        this._maxHeight = this._maxLines = undefined;
    };
    TextBase.prototype[text_base_common_1.textProperty.getDefault] = function () {
        return text_base_common_1.resetSymbol;
    };
    TextBase.prototype[text_base_common_1.textProperty.setNative] = function (value) {
        var reset = value === text_base_common_1.resetSymbol;
        if (!reset && this.formattedText) {
            return;
        }
        this._setNativeText(reset);
    };
    TextBase.prototype[text_base_common_1.formattedTextProperty.setNative] = function (value) {
        var nativeView = this.nativeTextViewProtected;
        if (!value) {
            if (nativeView instanceof android.widget.Button &&
                nativeView.getTransformationMethod() instanceof TextTransformation) {
                nativeView.setTransformationMethod(this._defaultTransformationMethod);
            }
        }
        if (this.secure) {
            return;
        }
        var spannableStringBuilder = createSpannableStringBuilder(value);
        nativeView.setText(spannableStringBuilder);
        text_base_common_1.textProperty.nativeValueChange(this, (value === null || value === undefined) ? "" : value.toString());
        if (spannableStringBuilder && nativeView instanceof android.widget.Button &&
            !(nativeView.getTransformationMethod() instanceof TextTransformation)) {
            nativeView.setTransformationMethod(new TextTransformation(this));
        }
    };
    TextBase.prototype[text_base_common_1.textTransformProperty.setNative] = function (value) {
        if (value === "initial") {
            this.nativeTextViewProtected.setTransformationMethod(this._defaultTransformationMethod);
            return;
        }
        if (this.secure) {
            return;
        }
        this.nativeTextViewProtected.setTransformationMethod(new TextTransformation(this));
    };
    TextBase.prototype[text_base_common_1.textAlignmentProperty.getDefault] = function () {
        return "initial";
    };
    TextBase.prototype[text_base_common_1.textAlignmentProperty.setNative] = function (value) {
        var verticalGravity = this.nativeTextViewProtected.getGravity() & android.view.Gravity.VERTICAL_GRAVITY_MASK;
        switch (value) {
            case "initial":
            case "left":
                this.nativeTextViewProtected.setGravity(android.view.Gravity.START | verticalGravity);
                break;
            case "center":
                this.nativeTextViewProtected.setGravity(android.view.Gravity.CENTER_HORIZONTAL | verticalGravity);
                break;
            case "right":
                this.nativeTextViewProtected.setGravity(android.view.Gravity.END | verticalGravity);
                break;
        }
    };
    TextBase.prototype[text_base_common_1.whiteSpaceProperty.setNative] = function (value) {
        var nativeView = this.nativeTextViewProtected;
        switch (value) {
            case "initial":
            case "normal":
                nativeView.setSingleLine(false);
                nativeView.setEllipsize(null);
                break;
            case "nowrap":
                nativeView.setSingleLine(true);
                nativeView.setEllipsize(android.text.TextUtils.TruncateAt.END);
                break;
        }
    };
    TextBase.prototype[text_base_common_1.colorProperty.getDefault] = function () {
        return this.nativeTextViewProtected.getTextColors();
    };
    TextBase.prototype[text_base_common_1.colorProperty.setNative] = function (value) {
        if (!this.formattedText || !(value instanceof text_base_common_1.Color)) {
            if (value instanceof text_base_common_1.Color) {
                this.nativeTextViewProtected.setTextColor(value.android);
            }
            else {
                this.nativeTextViewProtected.setTextColor(value);
            }
        }
    };
    TextBase.prototype[text_base_common_1.fontSizeProperty.getDefault] = function () {
        return { nativeSize: this.nativeTextViewProtected.getTextSize() };
    };
    TextBase.prototype[text_base_common_1.fontSizeProperty.setNative] = function (value) {
        if (!this.formattedText || (typeof value !== "number")) {
            if (typeof value === "number") {
                this.nativeTextViewProtected.setTextSize(value);
            }
            else {
                this.nativeTextViewProtected.setTextSize(android.util.TypedValue.COMPLEX_UNIT_PX, value.nativeSize);
            }
        }
    };
    TextBase.prototype[text_base_common_1.lineHeightProperty.getDefault] = function () {
        return this.nativeTextViewProtected.getLineSpacingExtra() / text_base_common_1.layout.getDisplayDensity();
    };
    TextBase.prototype[text_base_common_1.lineHeightProperty.setNative] = function (value) {
        this.nativeTextViewProtected.setLineSpacing(value * text_base_common_1.layout.getDisplayDensity(), 1);
    };
    TextBase.prototype[text_base_common_1.fontInternalProperty.getDefault] = function () {
        return this.nativeTextViewProtected.getTypeface();
    };
    TextBase.prototype[text_base_common_1.fontInternalProperty.setNative] = function (value) {
        if (!this.formattedText || !(value instanceof font_1.Font)) {
            this.nativeTextViewProtected.setTypeface(value instanceof font_1.Font ? value.getAndroidTypeface() : value);
        }
    };
    TextBase.prototype[text_base_common_1.textDecorationProperty.getDefault] = function (value) {
        return this._paintFlags = this.nativeTextViewProtected.getPaintFlags();
    };
    TextBase.prototype[text_base_common_1.textDecorationProperty.setNative] = function (value) {
        switch (value) {
            case "none":
                this.nativeTextViewProtected.setPaintFlags(0);
                break;
            case "underline":
                this.nativeTextViewProtected.setPaintFlags(android.graphics.Paint.UNDERLINE_TEXT_FLAG);
                break;
            case "line-through":
                this.nativeTextViewProtected.setPaintFlags(android.graphics.Paint.STRIKE_THRU_TEXT_FLAG);
                break;
            case "underline line-through":
                this.nativeTextViewProtected.setPaintFlags(android.graphics.Paint.UNDERLINE_TEXT_FLAG | android.graphics.Paint.STRIKE_THRU_TEXT_FLAG);
                break;
            default:
                this.nativeTextViewProtected.setPaintFlags(value);
                break;
        }
    };
    TextBase.prototype[text_base_common_1.letterSpacingProperty.getDefault] = function () {
        return org.nativescript.widgets.ViewHelper.getLetterspacing(this.nativeTextViewProtected);
    };
    TextBase.prototype[text_base_common_1.letterSpacingProperty.setNative] = function (value) {
        org.nativescript.widgets.ViewHelper.setLetterspacing(this.nativeTextViewProtected, value);
    };
    TextBase.prototype[text_base_common_1.paddingTopProperty.getDefault] = function () {
        return { value: this._defaultPaddingTop, unit: "px" };
    };
    TextBase.prototype[text_base_common_1.paddingTopProperty.setNative] = function (value) {
        org.nativescript.widgets.ViewHelper.setPaddingTop(this.nativeTextViewProtected, text_base_common_1.Length.toDevicePixels(value, 0) + text_base_common_1.Length.toDevicePixels(this.style.borderTopWidth, 0));
    };
    TextBase.prototype[text_base_common_1.paddingRightProperty.getDefault] = function () {
        return { value: this._defaultPaddingRight, unit: "px" };
    };
    TextBase.prototype[text_base_common_1.paddingRightProperty.setNative] = function (value) {
        org.nativescript.widgets.ViewHelper.setPaddingRight(this.nativeTextViewProtected, text_base_common_1.Length.toDevicePixels(value, 0) + text_base_common_1.Length.toDevicePixels(this.style.borderRightWidth, 0));
    };
    TextBase.prototype[text_base_common_1.paddingBottomProperty.getDefault] = function () {
        return { value: this._defaultPaddingBottom, unit: "px" };
    };
    TextBase.prototype[text_base_common_1.paddingBottomProperty.setNative] = function (value) {
        org.nativescript.widgets.ViewHelper.setPaddingBottom(this.nativeTextViewProtected, text_base_common_1.Length.toDevicePixels(value, 0) + text_base_common_1.Length.toDevicePixels(this.style.borderBottomWidth, 0));
    };
    TextBase.prototype[text_base_common_1.paddingLeftProperty.getDefault] = function () {
        return { value: this._defaultPaddingLeft, unit: "px" };
    };
    TextBase.prototype[text_base_common_1.paddingLeftProperty.setNative] = function (value) {
        org.nativescript.widgets.ViewHelper.setPaddingLeft(this.nativeTextViewProtected, text_base_common_1.Length.toDevicePixels(value, 0) + text_base_common_1.Length.toDevicePixels(this.style.borderLeftWidth, 0));
    };
    TextBase.prototype._setNativeText = function (reset) {
        if (reset === void 0) { reset = false; }
        if (reset) {
            this.nativeTextViewProtected.setText(null);
            return;
        }
        var transformedText;
        if (this.formattedText) {
            transformedText = createSpannableStringBuilder(this.formattedText);
        }
        else {
            var text = this.text;
            var stringValue = (text === null || text === undefined) ? "" : text.toString();
            transformedText = getTransformedText(stringValue, this.textTransform);
        }
        this.nativeTextViewProtected.setText(transformedText);
    };
    return TextBase;
}(text_base_common_1.TextBaseCommon));
exports.TextBase = TextBase;
function getCapitalizedString(str) {
    var words = str.split(" ");
    var newWords = [];
    for (var i = 0, length_1 = words.length; i < length_1; i++) {
        var word = words[i].toLowerCase();
        newWords.push(word.substr(0, 1).toUpperCase() + word.substring(1));
    }
    return newWords.join(" ");
}
function getTransformedText(text, textTransform) {
    switch (textTransform) {
        case "uppercase":
            return text.toUpperCase();
        case "lowercase":
            return text.toLowerCase();
        case "capitalize":
            return getCapitalizedString(text);
        case "none":
        default:
            return text;
    }
}
exports.getTransformedText = getTransformedText;
function createSpannableStringBuilder(formattedString) {
    if (!formattedString) {
        return null;
    }
    var ssb = new android.text.SpannableStringBuilder();
    for (var i = 0, spanStart = 0, spanLength = 0, length_2 = formattedString.spans.length; i < length_2; i++) {
        var span = formattedString.spans.getItem(i);
        var text = span.text;
        var textTransform = formattedString.parent.textTransform;
        var spanText = (text === null || text === undefined) ? "" : text.toString();
        if (textTransform && textTransform !== "none") {
            spanText = getTransformedText(spanText, textTransform);
        }
        spanLength = spanText.length;
        if (spanLength > 0) {
            ssb.insert(spanStart, spanText);
            setSpanModifiers(ssb, span, spanStart, spanStart + spanLength);
            spanStart += spanLength;
        }
    }
    return ssb;
}
function setSpanModifiers(ssb, span, start, end) {
    var spanStyle = span.style;
    var bold = text_base_common_1.isBold(spanStyle.fontWeight);
    var italic = spanStyle.fontStyle === "italic";
    if (bold && italic) {
        ssb.setSpan(new android.text.style.StyleSpan(android.graphics.Typeface.BOLD_ITALIC), start, end, android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    }
    else if (bold) {
        ssb.setSpan(new android.text.style.StyleSpan(android.graphics.Typeface.BOLD), start, end, android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    }
    else if (italic) {
        ssb.setSpan(new android.text.style.StyleSpan(android.graphics.Typeface.ITALIC), start, end, android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    }
    var fontFamily = span.fontFamily;
    if (fontFamily) {
        var font = new font_1.Font(fontFamily, 0, (italic) ? "italic" : "normal", (bold) ? "bold" : "normal");
        var typeface = font.getAndroidTypeface() || android.graphics.Typeface.create(fontFamily, 0);
        var typefaceSpan = new org.nativescript.widgets.CustomTypefaceSpan(fontFamily, typeface);
        ssb.setSpan(typefaceSpan, start, end, android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    }
    var realFontSize = span.fontSize;
    if (realFontSize) {
        ssb.setSpan(new android.text.style.AbsoluteSizeSpan(realFontSize * text_base_common_1.layout.getDisplayDensity()), start, end, android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    }
    var color = span.color;
    if (color) {
        ssb.setSpan(new android.text.style.ForegroundColorSpan(color.android), start, end, android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    }
    var backgroundColor;
    if (style_properties_1.backgroundColorProperty.isSet(spanStyle)) {
        backgroundColor = spanStyle.backgroundColor;
    }
    else if (style_properties_1.backgroundColorProperty.isSet(span.parent.style)) {
        backgroundColor = span.parent.style.backgroundColor;
    }
    else if (style_properties_1.backgroundColorProperty.isSet(span.parent.parent.style)) {
        backgroundColor = span.parent.parent.style.backgroundColor;
    }
    if (backgroundColor) {
        ssb.setSpan(new android.text.style.BackgroundColorSpan(backgroundColor.android), start, end, android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    }
    var valueSource;
    if (text_base_common_1.textDecorationProperty.isSet(spanStyle)) {
        valueSource = spanStyle;
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
            ssb.setSpan(new android.text.style.UnderlineSpan(), start, end, android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
        }
        var strikethrough = textDecorations.indexOf("line-through") !== -1;
        if (strikethrough) {
            ssb.setSpan(new android.text.style.StrikethroughSpan(), start, end, android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
        }
    }
}
//# sourceMappingURL=text-base.android.js.map