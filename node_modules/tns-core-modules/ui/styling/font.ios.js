function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var font_common_1 = require("./font-common");
var trace_1 = require("../../trace");
var platform_1 = require("../../platform");
var fs = require("../../file-system");
var utils = require("../../utils/utils");
__export(require("./font-common"));
var EMULATE_OBLIQUE = true;
var OBLIQUE_TRANSFORM = CGAffineTransformMake(1, 0, 0.2, 1, 0, 0);
var DEFAULT_SERIF = "Times New Roman";
var DEFAULT_MONOSPACE = "Courier New";
var SUPPORT_FONT_WEIGHTS = parseFloat(platform_1.device.osVersion) >= 10.0;
var Font = (function (_super) {
    __extends(Font, _super);
    function Font(family, size, style, weight) {
        return _super.call(this, family, size, style, weight) || this;
    }
    Font.prototype.withFontFamily = function (family) {
        return new Font(family, this.fontSize, this.fontStyle, this.fontWeight);
    };
    Font.prototype.withFontStyle = function (style) {
        return new Font(this.fontFamily, this.fontSize, style, this.fontWeight);
    };
    Font.prototype.withFontWeight = function (weight) {
        return new Font(this.fontFamily, this.fontSize, this.fontStyle, weight);
    };
    Font.prototype.withFontSize = function (size) {
        return new Font(this.fontFamily, size, this.fontStyle, this.fontWeight);
    };
    Font.prototype.getUIFont = function (defaultFont) {
        if (!this._uiFont) {
            this._uiFont = createUIFont(this, defaultFont);
        }
        return this._uiFont;
    };
    Font.prototype.getAndroidTypeface = function () {
        return undefined;
    };
    Font.default = new Font(undefined, undefined, font_common_1.FontStyle.NORMAL, font_common_1.FontWeight.NORMAL);
    return Font;
}(font_common_1.Font));
exports.Font = Font;
function getFontFamilyRespectingGenericFonts(fontFamily) {
    if (!fontFamily) {
        return fontFamily;
    }
    switch (fontFamily.toLowerCase()) {
        case font_common_1.genericFontFamilies.serif:
            return DEFAULT_SERIF;
        case font_common_1.genericFontFamilies.monospace:
            return DEFAULT_MONOSPACE;
        default:
            return fontFamily;
    }
}
function shouldUseSystemFont(fontFamily) {
    return !fontFamily ||
        fontFamily === font_common_1.genericFontFamilies.sansSerif ||
        fontFamily === font_common_1.genericFontFamilies.system;
}
function getNativeFontWeight(fontWeight) {
    switch (fontWeight) {
        case font_common_1.FontWeight.THIN:
            return UIFontWeightUltraLight;
        case font_common_1.FontWeight.EXTRA_LIGHT:
            return UIFontWeightThin;
        case font_common_1.FontWeight.LIGHT:
            return UIFontWeightLight;
        case font_common_1.FontWeight.NORMAL:
        case "400":
        case undefined:
        case null:
            return UIFontWeightRegular;
        case font_common_1.FontWeight.MEDIUM:
            return UIFontWeightMedium;
        case font_common_1.FontWeight.SEMI_BOLD:
            return UIFontWeightSemibold;
        case font_common_1.FontWeight.BOLD:
        case "700":
            return UIFontWeightBold;
        case font_common_1.FontWeight.EXTRA_BOLD:
            return UIFontWeightHeavy;
        case font_common_1.FontWeight.BLACK:
            return UIFontWeightBlack;
        default:
            throw new Error("Invalid font weight: \"" + fontWeight + "\"");
    }
}
function getSystemFont(size, nativeWeight, italic, symbolicTraits) {
    var result = UIFont.systemFontOfSizeWeight(size, nativeWeight);
    if (italic) {
        var descriptor = utils.ios.getter(result, result.fontDescriptor).fontDescriptorWithSymbolicTraits(symbolicTraits);
        result = UIFont.fontWithDescriptorSize(descriptor, size);
    }
    return result;
}
function createUIFont(font, defaultFont) {
    var _a, _b;
    var result;
    var size = font.fontSize || defaultFont.pointSize;
    var nativeWeight = getNativeFontWeight(font.fontWeight);
    var fontFamilies = font_common_1.parseFontFamily(font.fontFamily);
    var symbolicTraits = 0;
    if (font.isBold) {
        symbolicTraits |= 2;
    }
    if (font.isItalic) {
        symbolicTraits |= 1;
    }
    var fontDescriptorTraits = (_a = {},
        _a[UIFontSymbolicTrait] = symbolicTraits,
        _a);
    if (SUPPORT_FONT_WEIGHTS) {
        fontDescriptorTraits[UIFontWeightTrait] = nativeWeight;
    }
    for (var i = 0; i < fontFamilies.length; i++) {
        var fontFamily = getFontFamilyRespectingGenericFonts(fontFamilies[i]);
        if (shouldUseSystemFont(fontFamily)) {
            result = getSystemFont(size, nativeWeight, font.isItalic, symbolicTraits);
            break;
        }
        else {
            var fontAttributes = (_b = {},
                _b[UIFontDescriptorFamilyAttribute] = fontFamily,
                _b[UIFontDescriptorTraitsAttribute] = fontDescriptorTraits,
                _b);
            var descriptor = UIFontDescriptor.fontDescriptorWithFontAttributes(fontAttributes);
            result = UIFont.fontWithDescriptorSize(descriptor, size);
            var actualItalic = utils.ios.getter(result, result.fontDescriptor).symbolicTraits & 1;
            if (font.isItalic && !actualItalic && EMULATE_OBLIQUE) {
                descriptor = descriptor.fontDescriptorWithMatrix(OBLIQUE_TRANSFORM);
                result = UIFont.fontWithDescriptorSize(descriptor, size);
            }
            if (result.familyName === fontFamily) {
                break;
            }
            else {
                result = null;
            }
        }
    }
    if (!result) {
        result = getSystemFont(size, nativeWeight, font.isItalic, symbolicTraits);
    }
    return result;
}
var ios;
(function (ios) {
    function registerFont(fontFile) {
        var filePath = fs.path.join(fs.knownFolders.currentApp().path, "fonts", fontFile);
        if (!fs.File.exists(filePath)) {
            filePath = fs.path.join(fs.knownFolders.currentApp().path, fontFile);
        }
        var fontData = utils.ios.getter(NSFileManager, NSFileManager.defaultManager).contentsAtPath(filePath);
        if (!fontData) {
            throw new Error("Could not load font from: " + fontFile);
        }
        var provider = CGDataProviderCreateWithCFData(fontData);
        var font = CGFontCreateWithDataProvider(provider);
        if (!font) {
            throw new Error("Could not load font from: " + fontFile);
        }
        var error = new interop.Reference();
        if (!CTFontManagerRegisterGraphicsFont(font, error)) {
            if (trace_1.isEnabled()) {
                trace_1.write("Error occur while registering font: " + CFErrorCopyDescription(error.value), trace_1.categories.Error, trace_1.messageType.error);
            }
        }
    }
    ios.registerFont = registerFont;
})(ios = exports.ios || (exports.ios = {}));
function registerFontsInFolder(fontsFolderPath) {
    var fontsFolder = fs.Folder.fromPath(fontsFolderPath);
    fontsFolder.eachEntity(function (fileEntity) {
        if (fs.Folder.exists(fs.path.join(fontsFolderPath, fileEntity.name))) {
            return true;
        }
        if (fileEntity instanceof fs.File &&
            (fileEntity.extension === ".ttf" || fileEntity.extension === ".otf")) {
            ios.registerFont(fileEntity.name);
        }
        return true;
    });
}
function registerCustomFonts() {
    var appDir = fs.knownFolders.currentApp().path;
    var fontsDir = fs.path.join(appDir, "fonts");
    if (fs.Folder.exists(fontsDir)) {
        registerFontsInFolder(fontsDir);
    }
}
registerCustomFonts();
//# sourceMappingURL=font.ios.js.map