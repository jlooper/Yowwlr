Object.defineProperty(exports, "__esModule", { value: true });
var urlRegEx = /\s*url\((?:('|")([^\1]*)\1|([^\)]*))\)\s*/gy;
function parseURL(text, start) {
    if (start === void 0) { start = 0; }
    urlRegEx.lastIndex = start;
    var result = urlRegEx.exec(text);
    if (!result) {
        return null;
    }
    var end = urlRegEx.lastIndex;
    var value = result[2] || result[3];
    return { start: start, end: end, value: value };
}
exports.parseURL = parseURL;
var hexColorRegEx = /\s*#((?:[0-9A-F]{8})|(?:[0-9A-F]{6})|(?:[0-9A-F]{3}))\s*/giy;
function parseHexColor(text, start) {
    if (start === void 0) { start = 0; }
    hexColorRegEx.lastIndex = start;
    var result = hexColorRegEx.exec(text);
    if (!result) {
        return null;
    }
    var end = hexColorRegEx.lastIndex;
    var hex = result[1];
    var argb;
    if (hex.length === 8) {
        argb = parseInt("0x" + hex);
    }
    else if (hex.length === 6) {
        argb = parseInt("0xFF" + hex);
    }
    else if (hex.length === 3) {
        argb = parseInt("0xFF" + hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]);
    }
    return { start: start, end: end, value: argb };
}
exports.parseHexColor = parseHexColor;
function rgbaToArgbNumber(r, g, b, a) {
    if (a === void 0) { a = 1; }
    if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255 && a >= 0 && a <= 1) {
        return (Math.round(a * 0xFF) * 0x01000000) + (r * 0x010000) + (g * 0x000100) + (b * 0x000001);
    }
    else {
        return null;
    }
}
var rgbColorRegEx = /\s*(rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\))/gy;
function parseRGBColor(text, start) {
    if (start === void 0) { start = 0; }
    rgbColorRegEx.lastIndex = start;
    var result = rgbColorRegEx.exec(text);
    if (!result) {
        return null;
    }
    var end = rgbColorRegEx.lastIndex;
    var value = result[1] && rgbaToArgbNumber(parseInt(result[2]), parseInt(result[3]), parseInt(result[4]));
    return { start: start, end: end, value: value };
}
exports.parseRGBColor = parseRGBColor;
var rgbaColorRegEx = /\s*(rgba\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*,\s*([01]?\.?\d*)\s*\))/gy;
function parseRGBAColor(text, start) {
    if (start === void 0) { start = 0; }
    rgbaColorRegEx.lastIndex = start;
    var result = rgbaColorRegEx.exec(text);
    if (!result) {
        return null;
    }
    var end = rgbaColorRegEx.lastIndex;
    var value = rgbaToArgbNumber(parseInt(result[2]), parseInt(result[3]), parseInt(result[4]), parseFloat(result[5]));
    return { start: start, end: end, value: value };
}
exports.parseRGBAColor = parseRGBAColor;
var colors;
(function (colors) {
    colors[colors["transparent"] = 0] = "transparent";
    colors[colors["aliceblue"] = 4293982463] = "aliceblue";
    colors[colors["antiquewhite"] = 4294634455] = "antiquewhite";
    colors[colors["aqua"] = 4278255615] = "aqua";
    colors[colors["aquamarine"] = 4286578644] = "aquamarine";
    colors[colors["azure"] = 4293984255] = "azure";
    colors[colors["beige"] = 4294309340] = "beige";
    colors[colors["bisque"] = 4294960324] = "bisque";
    colors[colors["black"] = 4278190080] = "black";
    colors[colors["blanchedalmond"] = 4294962125] = "blanchedalmond";
    colors[colors["blue"] = 4278190335] = "blue";
    colors[colors["blueviolet"] = 4287245282] = "blueviolet";
    colors[colors["brown"] = 4289014314] = "brown";
    colors[colors["burlywood"] = 4292786311] = "burlywood";
    colors[colors["cadetblue"] = 4284456608] = "cadetblue";
    colors[colors["chartreuse"] = 4286578432] = "chartreuse";
    colors[colors["chocolate"] = 4291979550] = "chocolate";
    colors[colors["coral"] = 4294934352] = "coral";
    colors[colors["cornflowerblue"] = 4284782061] = "cornflowerblue";
    colors[colors["cornsilk"] = 4294965468] = "cornsilk";
    colors[colors["crimson"] = 4292613180] = "crimson";
    colors[colors["cyan"] = 4278255615] = "cyan";
    colors[colors["darkblue"] = 4278190219] = "darkblue";
    colors[colors["darkcyan"] = 4278225803] = "darkcyan";
    colors[colors["darkgoldenrod"] = 4290283019] = "darkgoldenrod";
    colors[colors["darkgray"] = 4289309097] = "darkgray";
    colors[colors["darkgreen"] = 4278215680] = "darkgreen";
    colors[colors["darkgrey"] = 4289309097] = "darkgrey";
    colors[colors["darkkhaki"] = 4290623339] = "darkkhaki";
    colors[colors["darkmagenta"] = 4287299723] = "darkmagenta";
    colors[colors["darkolivegreen"] = 4283788079] = "darkolivegreen";
    colors[colors["darkorange"] = 4294937600] = "darkorange";
    colors[colors["darkorchid"] = 4288230092] = "darkorchid";
    colors[colors["darkred"] = 4287299584] = "darkred";
    colors[colors["darksalmon"] = 4293498490] = "darksalmon";
    colors[colors["darkseagreen"] = 4287609999] = "darkseagreen";
    colors[colors["darkslateblue"] = 4282924427] = "darkslateblue";
    colors[colors["darkslategray"] = 4281290575] = "darkslategray";
    colors[colors["darkslategrey"] = 4281290575] = "darkslategrey";
    colors[colors["darkturquoise"] = 4278243025] = "darkturquoise";
    colors[colors["darkviolet"] = 4287889619] = "darkviolet";
    colors[colors["deeppink"] = 4294907027] = "deeppink";
    colors[colors["deepskyblue"] = 4278239231] = "deepskyblue";
    colors[colors["dimgray"] = 4285098345] = "dimgray";
    colors[colors["dimgrey"] = 4285098345] = "dimgrey";
    colors[colors["dodgerblue"] = 4280193279] = "dodgerblue";
    colors[colors["firebrick"] = 4289864226] = "firebrick";
    colors[colors["floralwhite"] = 4294966000] = "floralwhite";
    colors[colors["forestgreen"] = 4280453922] = "forestgreen";
    colors[colors["fuchsia"] = 4294902015] = "fuchsia";
    colors[colors["gainsboro"] = 4292664540] = "gainsboro";
    colors[colors["ghostwhite"] = 4294506751] = "ghostwhite";
    colors[colors["gold"] = 4294956800] = "gold";
    colors[colors["goldenrod"] = 4292519200] = "goldenrod";
    colors[colors["gray"] = 4286611584] = "gray";
    colors[colors["green"] = 4278222848] = "green";
    colors[colors["greenyellow"] = 4289593135] = "greenyellow";
    colors[colors["grey"] = 4286611584] = "grey";
    colors[colors["honeydew"] = 4293984240] = "honeydew";
    colors[colors["hotpink"] = 4294928820] = "hotpink";
    colors[colors["indianred"] = 4291648604] = "indianred";
    colors[colors["indigo"] = 4283105410] = "indigo";
    colors[colors["ivory"] = 4294967280] = "ivory";
    colors[colors["khaki"] = 4293977740] = "khaki";
    colors[colors["lavender"] = 4293322490] = "lavender";
    colors[colors["lavenderblush"] = 4294963445] = "lavenderblush";
    colors[colors["lawngreen"] = 4286381056] = "lawngreen";
    colors[colors["lemonchiffon"] = 4294965965] = "lemonchiffon";
    colors[colors["lightblue"] = 4289583334] = "lightblue";
    colors[colors["lightcoral"] = 4293951616] = "lightcoral";
    colors[colors["lightcyan"] = 4292935679] = "lightcyan";
    colors[colors["lightgoldenrodyellow"] = 4294638290] = "lightgoldenrodyellow";
    colors[colors["lightgray"] = 4292072403] = "lightgray";
    colors[colors["lightgreen"] = 4287688336] = "lightgreen";
    colors[colors["lightgrey"] = 4292072403] = "lightgrey";
    colors[colors["lightpink"] = 4294948545] = "lightpink";
    colors[colors["lightsalmon"] = 4294942842] = "lightsalmon";
    colors[colors["lightseagreen"] = 4280332970] = "lightseagreen";
    colors[colors["lightskyblue"] = 4287090426] = "lightskyblue";
    colors[colors["lightslategray"] = 4286023833] = "lightslategray";
    colors[colors["lightslategrey"] = 4286023833] = "lightslategrey";
    colors[colors["lightsteelblue"] = 4289774814] = "lightsteelblue";
    colors[colors["lightyellow"] = 4294967264] = "lightyellow";
    colors[colors["lime"] = 4278255360] = "lime";
    colors[colors["limegreen"] = 4281519410] = "limegreen";
    colors[colors["linen"] = 4294635750] = "linen";
    colors[colors["magenta"] = 4294902015] = "magenta";
    colors[colors["maroon"] = 4286578688] = "maroon";
    colors[colors["mediumaquamarine"] = 4284927402] = "mediumaquamarine";
    colors[colors["mediumblue"] = 4278190285] = "mediumblue";
    colors[colors["mediumorchid"] = 4290401747] = "mediumorchid";
    colors[colors["mediumpurple"] = 4287852763] = "mediumpurple";
    colors[colors["mediumseagreen"] = 4282168177] = "mediumseagreen";
    colors[colors["mediumslateblue"] = 4286277870] = "mediumslateblue";
    colors[colors["mediumspringgreen"] = 4278254234] = "mediumspringgreen";
    colors[colors["mediumturquoise"] = 4282962380] = "mediumturquoise";
    colors[colors["mediumvioletred"] = 4291237253] = "mediumvioletred";
    colors[colors["midnightblue"] = 4279834992] = "midnightblue";
    colors[colors["mintcream"] = 4294311930] = "mintcream";
    colors[colors["mistyrose"] = 4294960353] = "mistyrose";
    colors[colors["moccasin"] = 4294960309] = "moccasin";
    colors[colors["navajowhite"] = 4294958765] = "navajowhite";
    colors[colors["navy"] = 4278190208] = "navy";
    colors[colors["oldlace"] = 4294833638] = "oldlace";
    colors[colors["olive"] = 4286611456] = "olive";
    colors[colors["olivedrab"] = 4285238819] = "olivedrab";
    colors[colors["orange"] = 4294944000] = "orange";
    colors[colors["orangered"] = 4294919424] = "orangered";
    colors[colors["orchid"] = 4292505814] = "orchid";
    colors[colors["palegoldenrod"] = 4293847210] = "palegoldenrod";
    colors[colors["palegreen"] = 4288215960] = "palegreen";
    colors[colors["paleturquoise"] = 4289720046] = "paleturquoise";
    colors[colors["palevioletred"] = 4292571283] = "palevioletred";
    colors[colors["papayawhip"] = 4294963157] = "papayawhip";
    colors[colors["peachpuff"] = 4294957753] = "peachpuff";
    colors[colors["peru"] = 4291659071] = "peru";
    colors[colors["pink"] = 4294951115] = "pink";
    colors[colors["plum"] = 4292714717] = "plum";
    colors[colors["powderblue"] = 4289781990] = "powderblue";
    colors[colors["purple"] = 4286578816] = "purple";
    colors[colors["red"] = 4294901760] = "red";
    colors[colors["rosybrown"] = 4290547599] = "rosybrown";
    colors[colors["royalblue"] = 4282477025] = "royalblue";
    colors[colors["saddlebrown"] = 4287317267] = "saddlebrown";
    colors[colors["salmon"] = 4294606962] = "salmon";
    colors[colors["sandybrown"] = 4294222944] = "sandybrown";
    colors[colors["seagreen"] = 4281240407] = "seagreen";
    colors[colors["seashell"] = 4294964718] = "seashell";
    colors[colors["sienna"] = 4288696877] = "sienna";
    colors[colors["silver"] = 4290822336] = "silver";
    colors[colors["skyblue"] = 4287090411] = "skyblue";
    colors[colors["slateblue"] = 4285160141] = "slateblue";
    colors[colors["slategray"] = 4285563024] = "slategray";
    colors[colors["slategrey"] = 4285563024] = "slategrey";
    colors[colors["snow"] = 4294966010] = "snow";
    colors[colors["springgreen"] = 4278255487] = "springgreen";
    colors[colors["steelblue"] = 4282811060] = "steelblue";
    colors[colors["tan"] = 4291998860] = "tan";
    colors[colors["teal"] = 4278222976] = "teal";
    colors[colors["thistle"] = 4292394968] = "thistle";
    colors[colors["tomato"] = 4294927175] = "tomato";
    colors[colors["turquoise"] = 4282441936] = "turquoise";
    colors[colors["violet"] = 4293821166] = "violet";
    colors[colors["wheat"] = 4294303411] = "wheat";
    colors[colors["white"] = 4294967295] = "white";
    colors[colors["whitesmoke"] = 4294309365] = "whitesmoke";
    colors[colors["yellow"] = 4294967040] = "yellow";
    colors[colors["yellowgreen"] = 4288335154] = "yellowgreen";
})(colors = exports.colors || (exports.colors = {}));
;
function parseColorKeyword(value, start, keyword) {
    if (keyword === void 0) { keyword = parseKeyword(value, start); }
    if (keyword && keyword.value in colors) {
        var end = keyword.end;
        var value_1 = colors[keyword.value];
        return { start: start, end: end, value: value_1 };
    }
    return null;
}
exports.parseColorKeyword = parseColorKeyword;
function parseColor(value, start, keyword) {
    if (start === void 0) { start = 0; }
    if (keyword === void 0) { keyword = parseKeyword(value, start); }
    return parseHexColor(value, start) || parseColorKeyword(value, start, keyword) || parseRGBColor(value, start) || parseRGBAColor(value, start);
}
exports.parseColor = parseColor;
var keywordRegEx = /\s*([a-z][\w\-]*)\s*/giy;
function parseKeyword(text, start) {
    if (start === void 0) { start = 0; }
    keywordRegEx.lastIndex = start;
    var result = keywordRegEx.exec(text);
    if (!result) {
        return null;
    }
    var end = keywordRegEx.lastIndex;
    var value = result[1];
    return { start: start, end: end, value: value };
}
var backgroundRepeatKeywords = new Set(["repeat", "repeat-x", "repeat-y", "no-repeat"]);
function parseRepeat(value, start, keyword) {
    if (start === void 0) { start = 0; }
    if (keyword === void 0) { keyword = parseKeyword(value, start); }
    if (keyword && backgroundRepeatKeywords.has(keyword.value)) {
        var end = keyword.end;
        var value_2 = keyword.value;
        return { start: start, end: end, value: value_2 };
    }
    return null;
}
exports.parseRepeat = parseRepeat;
var unitRegEx = /\s*([\+\-]?(?:\d+\.\d+|\d+|\.\d+)(?:[eE][\+\-]?\d+)?)([a-zA-Z]+|%)?\s*/gy;
function parseUnit(text, start) {
    if (start === void 0) { start = 0; }
    unitRegEx.lastIndex = start;
    var result = unitRegEx.exec(text);
    if (!result) {
        return null;
    }
    var end = unitRegEx.lastIndex;
    var value = parseFloat(result[1]);
    var unit = result[2] || "dip";
    return { start: start, end: end, value: { value: value, unit: unit } };
}
exports.parseUnit = parseUnit;
function parsePercentageOrLength(text, start) {
    if (start === void 0) { start = 0; }
    var unitResult = parseUnit(text, start);
    if (unitResult) {
        var start_1 = unitResult.start, end = unitResult.end;
        var value = unitResult.value;
        if (value.unit === "%") {
            value.value /= 100;
        }
        else if (!value.unit) {
            value.unit = "dip";
        }
        else if (value.unit === "px" || value.unit === "dip") {
        }
        else {
            return null;
        }
        return { start: start_1, end: end, value: value };
    }
    return null;
}
exports.parsePercentageOrLength = parsePercentageOrLength;
var angleUnitsToRadMap = {
    "deg": function (start, end, deg) { return ({ start: start, end: end, value: deg / 180 * Math.PI }); },
    "rad": function (start, end, rad) { return ({ start: start, end: end, value: rad }); },
    "grad": function (start, end, grad) { return ({ start: start, end: end, value: grad / 200 * Math.PI }); },
    "turn": function (start, end, turn) { return ({ start: start, end: end, value: turn * Math.PI * 2 }); }
};
function parseAngle(value, start) {
    if (start === void 0) { start = 0; }
    var angleResult = parseUnit(value, start);
    if (angleResult) {
        var start_2 = angleResult.start, end = angleResult.end, value_3 = angleResult.value;
        return (angleUnitsToRadMap[value_3.unit] || (function (_, __, ___) { return null; }))(start_2, end, value_3.value);
    }
    return null;
}
exports.parseAngle = parseAngle;
var backgroundSizeKeywords = new Set(["auto", "contain", "cover"]);
function parseBackgroundSize(value, start, keyword) {
    if (start === void 0) { start = 0; }
    if (keyword === void 0) { keyword = parseKeyword(value, start); }
    var end = start;
    if (keyword && backgroundSizeKeywords.has(keyword.value)) {
        end = keyword.end;
        var value_4 = keyword.value;
        return { start: start, end: end, value: value_4 };
    }
    var firstLength = parsePercentageOrLength(value, end);
    if (firstLength) {
        end = firstLength.end;
        var secondLength = parsePercentageOrLength(value, firstLength.end);
        if (secondLength) {
            end = secondLength.end;
            return { start: start, end: end, value: { x: firstLength.value, y: secondLength.value } };
        }
        else {
            return { start: start, end: end, value: { x: firstLength.value, y: "auto" } };
        }
    }
    return null;
}
exports.parseBackgroundSize = parseBackgroundSize;
var backgroundPositionKeywords = Object.freeze(new Set(["left", "right", "top", "bottom", "center"]));
var backgroundPositionKeywordsDirection = {
    "left": "x",
    "right": "x",
    "center": "center",
    "top": "y",
    "bottom": "y"
};
function parseBackgroundPosition(text, start, keyword) {
    if (start === void 0) { start = 0; }
    if (keyword === void 0) { keyword = parseKeyword(text, start); }
    function formatH(align, offset) {
        if (align.value === "center") {
            return "center";
        }
        if (offset && offset.value.value !== 0) {
            return { align: align.value, offset: offset.value };
        }
        return align.value;
    }
    function formatV(align, offset) {
        if (align.value === "center") {
            return "center";
        }
        if (offset && offset.value.value !== 0) {
            return { align: align.value, offset: offset.value };
        }
        return align.value;
    }
    var end = start;
    if (keyword && backgroundPositionKeywords.has(keyword.value)) {
        end = keyword.end;
        var firstDirection = backgroundPositionKeywordsDirection[keyword.value];
        var firstLength = firstDirection !== "center" && parsePercentageOrLength(text, end);
        if (firstLength) {
            end = firstLength.end;
        }
        var secondKeyword = parseKeyword(text, end);
        if (secondKeyword && backgroundPositionKeywords.has(secondKeyword.value)) {
            end = secondKeyword.end;
            var secondDirection = backgroundPositionKeywordsDirection[secondKeyword.end];
            if (firstDirection === secondDirection && firstDirection !== "center") {
                return null;
            }
            var secondLength = secondDirection !== "center" && parsePercentageOrLength(text, end);
            if (secondLength) {
                end = secondLength.end;
            }
            if ((firstDirection === secondDirection && secondDirection === "center") || (firstDirection === "x" || secondDirection === "y")) {
                return { start: start, end: end, value: {
                        x: formatH(keyword, firstLength),
                        y: formatV(secondKeyword, secondLength)
                    } };
            }
            else {
                return { start: start, end: end, value: {
                        x: formatH(secondKeyword, secondLength),
                        y: formatV(keyword, firstLength),
                    } };
            }
        }
        else {
            if (firstDirection === "center") {
                return { start: start, end: end, value: { x: "center", y: "center" } };
            }
            else if (firstDirection === "x") {
                return { start: start, end: end, value: { x: formatH(keyword, firstLength), y: "center" } };
            }
            else {
                return { start: start, end: end, value: { x: "center", y: formatV(keyword, firstLength) } };
            }
        }
    }
    else {
        var firstLength = parsePercentageOrLength(text, end);
        if (firstLength) {
            end = firstLength.end;
            var secondLength = parsePercentageOrLength(text, end);
            if (secondLength) {
                end = secondLength.end;
                return { start: start, end: end, value: { x: { align: "left", offset: firstLength.value }, y: { align: "top", offset: secondLength.value } } };
            }
            else {
                return { start: start, end: end, value: { x: { align: "left", offset: firstLength.value }, y: "center" } };
            }
        }
        else {
            return null;
        }
    }
}
exports.parseBackgroundPosition = parseBackgroundPosition;
var directionRegEx = /\s*to\s*(left|right|top|bottom)\s*(left|right|top|bottom)?\s*/gy;
var sideDirections = {
    top: Math.PI * 0 / 2,
    right: Math.PI * 1 / 2,
    bottom: Math.PI * 2 / 2,
    left: Math.PI * 3 / 2
};
var cornerDirections = {
    top: {
        right: Math.PI * 1 / 4,
        left: Math.PI * 7 / 4
    },
    right: {
        top: Math.PI * 1 / 4,
        bottom: Math.PI * 3 / 4
    },
    bottom: {
        right: Math.PI * 3 / 4,
        left: Math.PI * 5 / 4
    },
    left: {
        top: Math.PI * 7 / 4,
        bottom: Math.PI * 5 / 4
    }
};
function parseDirection(text, start) {
    if (start === void 0) { start = 0; }
    directionRegEx.lastIndex = start;
    var result = directionRegEx.exec(text);
    if (!result) {
        return null;
    }
    var end = directionRegEx.lastIndex;
    var firstDirection = result[1];
    if (result[2]) {
        var secondDirection = result[2];
        var value = cornerDirections[firstDirection][secondDirection];
        return value === undefined ? null : { start: start, end: end, value: value };
    }
    else {
        return { start: start, end: end, value: sideDirections[firstDirection] };
    }
}
var openingBracketRegEx = /\s*\(\s*/gy;
var closingBracketRegEx = /\s*\)\s*/gy;
var closingBracketOrCommaRegEx = /\s*(\)|,)\s*/gy;
function parseArgumentsList(text, start, argument) {
    openingBracketRegEx.lastIndex = start;
    var openingBracket = openingBracketRegEx.exec(text);
    if (!openingBracket) {
        return null;
    }
    var end = openingBracketRegEx.lastIndex;
    var value = [];
    closingBracketRegEx.lastIndex = end;
    var closingBracket = closingBracketRegEx.exec(text);
    if (closingBracket) {
        return { start: start, end: end, value: value };
    }
    for (var index = 0; true; index++) {
        var arg = argument(text, end, index);
        if (!arg) {
            return null;
        }
        end = arg.end;
        value.push(arg);
        closingBracketOrCommaRegEx.lastIndex = end;
        var closingBracketOrComma = closingBracketOrCommaRegEx.exec(text);
        if (closingBracketOrComma) {
            end = closingBracketOrCommaRegEx.lastIndex;
            if (closingBracketOrComma[1] === ",") {
                continue;
            }
            else if (closingBracketOrComma[1] === ")") {
                return { start: start, end: end, value: value };
            }
        }
        else {
            return null;
        }
    }
}
function parseColorStop(text, start) {
    if (start === void 0) { start = 0; }
    var color = parseColor(text, start);
    if (!color) {
        return null;
    }
    var end = color.end;
    var offset = parsePercentageOrLength(text, end);
    if (offset) {
        end = offset.end;
        return { start: start, end: end, value: { argb: color.value, offset: offset.value } };
    }
    return { start: start, end: end, value: { argb: color.value } };
}
exports.parseColorStop = parseColorStop;
var linearGradientStartRegEx = /\s*linear-gradient\s*/gy;
function parseLinearGradient(text, start) {
    if (start === void 0) { start = 0; }
    linearGradientStartRegEx.lastIndex = start;
    var lgs = linearGradientStartRegEx.exec(text);
    if (!lgs) {
        return null;
    }
    var end = linearGradientStartRegEx.lastIndex;
    var angle = Math.PI;
    var colors = [];
    var parsedArgs = parseArgumentsList(text, end, function (text, start, index) {
        if (index === 0) {
            var angleArg = parseAngle(text, start) || parseDirection(text, start);
            if (angleArg) {
                angle = angleArg.value;
                return angleArg;
            }
        }
        var colorStop = parseColorStop(text, start);
        if (colorStop) {
            colors.push(colorStop.value);
            return colorStop;
        }
        return null;
    });
    if (!parsedArgs) {
        return null;
    }
    end = parsedArgs.end;
    return { start: start, end: end, value: { angle: angle, colors: colors } };
}
exports.parseLinearGradient = parseLinearGradient;
var slashRegEx = /\s*(\/)\s*/gy;
function parseSlash(text, start) {
    slashRegEx.lastIndex = start;
    var slash = slashRegEx.exec(text);
    if (!slash) {
        return null;
    }
    var end = slashRegEx.lastIndex;
    return { start: start, end: end, value: "/" };
}
function parseBackground(text, start) {
    if (start === void 0) { start = 0; }
    var value = {};
    var end = start;
    while (end < text.length) {
        var keyword = parseKeyword(text, end);
        var color = parseColor(text, end, keyword);
        if (color) {
            value.color = color.value;
            end = color.end;
            continue;
        }
        var repeat = parseRepeat(text, end, keyword);
        if (repeat) {
            value.repeat = repeat.value;
            end = repeat.end;
            continue;
        }
        var position = parseBackgroundPosition(text, end, keyword);
        if (position) {
            position.value.text = text.substring(position.start, position.end);
            value.position = position.value;
            end = position.end;
            var slash = parseSlash(text, end);
            if (slash) {
                end = slash.end;
                var size = parseBackgroundSize(text, end);
                if (!size) {
                    return null;
                }
                value.size = size.value;
                end = size.end;
            }
            continue;
        }
        var url = parseURL(text, end);
        if (url) {
            value.image = url.value;
            end = url.end;
            continue;
        }
        var gradient = parseLinearGradient(text, end);
        if (gradient) {
            value.image = gradient.value;
            end = gradient.end;
            continue;
        }
        return null;
    }
    return { start: start, end: end, value: value };
}
exports.parseBackground = parseBackground;
var universalSelectorRegEx = /\*/gy;
function parseUniversalSelector(text, start) {
    if (start === void 0) { start = 0; }
    universalSelectorRegEx.lastIndex = start;
    var result = universalSelectorRegEx.exec(text);
    if (!result) {
        return null;
    }
    var end = universalSelectorRegEx.lastIndex;
    return { start: start, end: end, value: { type: "*" } };
}
exports.parseUniversalSelector = parseUniversalSelector;
var simpleIdentifierSelectorRegEx = /(#|\.|:|\b)([_-\w][_-\w\d]*)/gy;
function parseSimpleIdentifierSelector(text, start) {
    if (start === void 0) { start = 0; }
    simpleIdentifierSelectorRegEx.lastIndex = start;
    var result = simpleIdentifierSelectorRegEx.exec(text);
    if (!result) {
        return null;
    }
    var end = simpleIdentifierSelectorRegEx.lastIndex;
    var type = result[1];
    var identifier = result[2];
    var value = { type: type, identifier: identifier };
    return { start: start, end: end, value: value };
}
exports.parseSimpleIdentifierSelector = parseSimpleIdentifierSelector;
var attributeSelectorRegEx = /\[\s*([_-\w][_-\w\d]*)\s*(?:(=|\^=|\$=|\*=|\~=|\|=)\s*(?:([_-\w][_-\w\d]*)|"((?:[^\\"]|\\(?:"|n|r|f|\\|0-9a-f))*)"|'((?:[^\\']|\\(?:'|n|r|f|\\|0-9a-f))*)')\s*)?\]/gy;
function parseAttributeSelector(text, start) {
    attributeSelectorRegEx.lastIndex = start;
    var result = attributeSelectorRegEx.exec(text);
    if (!result) {
        return null;
    }
    var end = attributeSelectorRegEx.lastIndex;
    var property = result[1];
    if (result[2]) {
        var test_1 = result[2];
        var value = result[3] || result[4] || result[5];
        return { start: start, end: end, value: { type: "[]", property: property, test: test_1, value: value } };
    }
    return { start: start, end: end, value: { type: "[]", property: property } };
}
exports.parseAttributeSelector = parseAttributeSelector;
function parseSimpleSelector(text, start) {
    if (start === void 0) { start = 0; }
    return parseUniversalSelector(text, start) ||
        parseSimpleIdentifierSelector(text, start) ||
        parseAttributeSelector(text, start);
}
exports.parseSimpleSelector = parseSimpleSelector;
function parseSimpleSelectorSequence(text, start) {
    var simpleSelector = parseSimpleSelector(text, start);
    if (!simpleSelector) {
        return null;
    }
    var end = simpleSelector.end;
    var value = [];
    while (simpleSelector) {
        value.push(simpleSelector.value);
        end = simpleSelector.end;
        simpleSelector = parseSimpleSelector(text, end);
    }
    return { start: start, end: end, value: value };
}
exports.parseSimpleSelectorSequence = parseSimpleSelectorSequence;
var combinatorRegEx = /\s*(\+|~|>)?\s*/gy;
function parseCombinator(text, start) {
    if (start === void 0) { start = 0; }
    combinatorRegEx.lastIndex = start;
    var result = combinatorRegEx.exec(text);
    if (!result) {
        return null;
    }
    var end = combinatorRegEx.lastIndex;
    var value = result[1] || " ";
    return { start: start, end: end, value: value };
}
exports.parseCombinator = parseCombinator;
var whiteSpaceRegEx = /\s*/gy;
function parseSelector(text, start) {
    if (start === void 0) { start = 0; }
    var end = start;
    whiteSpaceRegEx.lastIndex = end;
    var leadingWhiteSpace = whiteSpaceRegEx.exec(text);
    if (leadingWhiteSpace) {
        end = whiteSpaceRegEx.lastIndex;
    }
    var value = [];
    var combinator;
    var expectSimpleSelector = true;
    var pair;
    do {
        var simpleSelectorSequence = parseSimpleSelectorSequence(text, end);
        if (!simpleSelectorSequence) {
            if (expectSimpleSelector) {
                return null;
            }
            else {
                break;
            }
        }
        end = simpleSelectorSequence.end;
        if (combinator) {
            pair[1] = combinator.value;
        }
        pair = [simpleSelectorSequence.value, undefined];
        value.push(pair);
        combinator = parseCombinator(text, end);
        if (combinator) {
            end = combinator.end;
        }
        expectSimpleSelector = combinator && combinator.value !== " ";
    } while (combinator);
    return { start: start, end: end, value: value };
}
exports.parseSelector = parseSelector;
var whitespaceRegEx = /[\s\t\n\r\f]*/gym;
var singleQuoteStringRegEx = /'((?:[^\n\r\f\']|\\(?:\$|\n|[0-9a-fA-F]{1,6}\s?))*)(:?'|$)/gym;
var doubleQuoteStringRegEx = /"((?:[^\n\r\f\"]|\\(?:\$|\n|[0-9a-fA-F]{1,6}\s?))*)(:?"|$)/gym;
var commentRegEx = /(\/\*(?:[^\*]|\*[^\/])*\*\/)/gym;
var numberRegEx = /[\+\-]?(?:\d+\.\d+|\d+|\.\d+)(?:[eE][\+\-]?\d+)?/gym;
var nameRegEx = /-?(?:(?:[a-zA-Z_]|[^\x00-\x7F]|\\(?:\$|\n|[0-9a-fA-F]{1,6}\s?))(?:[a-zA-Z_0-9\-]*|\\(?:\$|\n|[0-9a-fA-F]{1,6}\s?))*)/gym;
var CSS3Parser = (function () {
    function CSS3Parser(text) {
        this.text = text;
        this.nextInputCodePointIndex = 0;
    }
    CSS3Parser.prototype.tokenize = function () {
        var tokens = [];
        var inputToken;
        do {
            inputToken = this.consumeAToken();
            tokens.push(inputToken);
        } while (inputToken);
        return tokens;
    };
    CSS3Parser.prototype.consumeAToken = function () {
        if (this.reconsumedInputToken) {
            var result = this.reconsumedInputToken;
            this.reconsumedInputToken = null;
            return result;
        }
        var char = this.text[this.nextInputCodePointIndex];
        switch (char) {
            case "\"": return this.consumeAStringToken();
            case "'": return this.consumeAStringToken();
            case "(":
            case ")":
            case ",":
            case ":":
            case ";":
            case "[":
            case "]":
            case "{":
            case "}":
                this.nextInputCodePointIndex++;
                return char;
            case "#": return this.consumeAHashToken() || this.consumeADelimToken();
            case " ":
            case "\t":
            case "\n":
            case "\r":
            case "\f":
                return this.consumeAWhitespace();
            case "@": return this.consumeAtKeyword() || this.consumeADelimToken();
            case "\\": return this.consumeAnIdentLikeToken() || this.consumeADelimToken();
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                return this.consumeANumericToken();
            case "u":
            case "U":
                if (this.text[this.nextInputCodePointIndex + 1] === "+") {
                    var thirdChar = this.text[this.nextInputCodePointIndex + 2];
                    if (thirdChar >= "0" && thirdChar <= "9" || thirdChar === "?") {
                        throw new Error("Unicode tokens not supported!");
                    }
                }
                return this.consumeAnIdentLikeToken() || this.consumeADelimToken();
            case "$":
            case "*":
            case "^":
            case "|":
            case "~":
                return this.consumeAMatchToken() || this.consumeADelimToken();
            case "-": return this.consumeANumericToken() || this.consumeAnIdentLikeToken() || this.consumeCDC() || this.consumeADelimToken();
            case "+":
            case ".":
                return this.consumeANumericToken() || this.consumeADelimToken();
            case "/": return this.consumeAComment() || this.consumeADelimToken();
            case "<": return this.consumeCDO() || this.consumeADelimToken();
            case undefined: return undefined;
            default: return this.consumeAnIdentLikeToken() || this.consumeADelimToken();
        }
    };
    CSS3Parser.prototype.consumeADelimToken = function () {
        return { type: 2, text: this.text[this.nextInputCodePointIndex++] };
    };
    CSS3Parser.prototype.consumeAWhitespace = function () {
        whitespaceRegEx.lastIndex = this.nextInputCodePointIndex;
        whitespaceRegEx.exec(this.text);
        this.nextInputCodePointIndex = whitespaceRegEx.lastIndex;
        return " ";
    };
    CSS3Parser.prototype.consumeAHashToken = function () {
        this.nextInputCodePointIndex++;
        var hashName = this.consumeAName();
        if (hashName) {
            return { type: 12, text: "#" + hashName.text };
        }
        this.nextInputCodePointIndex--;
        return null;
    };
    CSS3Parser.prototype.consumeCDO = function () {
        if (this.text.substr(this.nextInputCodePointIndex, 4) === "<!--") {
            this.nextInputCodePointIndex += 4;
            return "<!--";
        }
        return null;
    };
    CSS3Parser.prototype.consumeCDC = function () {
        if (this.text.substr(this.nextInputCodePointIndex, 3) === "-->") {
            this.nextInputCodePointIndex += 3;
            return "-->";
        }
        return null;
    };
    CSS3Parser.prototype.consumeAMatchToken = function () {
        if (this.text[this.nextInputCodePointIndex + 1] === "=") {
            var token = this.text.substr(this.nextInputCodePointIndex, 2);
            this.nextInputCodePointIndex += 2;
            return token;
        }
        return null;
    };
    CSS3Parser.prototype.consumeANumericToken = function () {
        numberRegEx.lastIndex = this.nextInputCodePointIndex;
        var result = numberRegEx.exec(this.text);
        if (!result) {
            return null;
        }
        this.nextInputCodePointIndex = numberRegEx.lastIndex;
        if (this.text[this.nextInputCodePointIndex] === "%") {
            return { type: 4, text: result[0] };
        }
        var name = this.consumeAName();
        if (name) {
            return { type: 5, text: result[0] + name.text };
        }
        return { type: 3, text: result[0] };
    };
    CSS3Parser.prototype.consumeAnIdentLikeToken = function () {
        var name = this.consumeAName();
        if (!name) {
            return null;
        }
        if (this.text[this.nextInputCodePointIndex] === "(") {
            this.nextInputCodePointIndex++;
            if (name.text.toLowerCase() === "url") {
                return this.consumeAURLToken();
            }
            return { type: 8, name: name.text, text: name.text + "(" };
        }
        return name;
    };
    CSS3Parser.prototype.consumeAStringToken = function () {
        var char = this.text[this.nextInputCodePointIndex];
        var result;
        if (char === "'") {
            singleQuoteStringRegEx.lastIndex = this.nextInputCodePointIndex;
            result = singleQuoteStringRegEx.exec(this.text);
            if (!result) {
                return null;
            }
            this.nextInputCodePointIndex = singleQuoteStringRegEx.lastIndex;
        }
        else if (char === "\"") {
            doubleQuoteStringRegEx.lastIndex = this.nextInputCodePointIndex;
            result = doubleQuoteStringRegEx.exec(this.text);
            if (!result) {
                return null;
            }
            this.nextInputCodePointIndex = doubleQuoteStringRegEx.lastIndex;
        }
        return { type: 1, text: result[0] };
    };
    CSS3Parser.prototype.consumeAURLToken = function () {
        var start = this.nextInputCodePointIndex - 3 - 1;
        var urlToken = { type: 7, text: undefined };
        this.consumeAWhitespace();
        if (this.nextInputCodePointIndex >= this.text.length) {
            return urlToken;
        }
        var nextInputCodePoint = this.text[this.nextInputCodePointIndex];
        if (nextInputCodePoint === "\"" || nextInputCodePoint === "'") {
            var stringToken = this.consumeAStringToken();
            urlToken.text = stringToken.text;
            this.consumeAWhitespace();
            if (this.text[this.nextInputCodePointIndex] === ")" || this.nextInputCodePointIndex >= this.text.length) {
                this.nextInputCodePointIndex++;
                var end = this.nextInputCodePointIndex;
                urlToken.text = this.text.substring(start, end);
                return urlToken;
            }
            else {
                return null;
            }
        }
        while (this.nextInputCodePointIndex < this.text.length) {
            var char = this.text[this.nextInputCodePointIndex++];
            switch (char) {
                case ")": return urlToken;
                case " ":
                case "\t":
                case "\n":
                case "\r":
                case "\f":
                    this.consumeAWhitespace();
                    if (this.text[this.nextInputCodePointIndex] === ")") {
                        this.nextInputCodePointIndex++;
                        return urlToken;
                    }
                    else {
                        return null;
                    }
                case "\"":
                case "\'":
                    return null;
                case "\\":
                    throw new Error("Escaping not yet supported!");
                default:
                    urlToken.text += char;
            }
        }
        return urlToken;
    };
    CSS3Parser.prototype.consumeAName = function () {
        nameRegEx.lastIndex = this.nextInputCodePointIndex;
        var result = nameRegEx.exec(this.text);
        if (!result) {
            return null;
        }
        this.nextInputCodePointIndex = nameRegEx.lastIndex;
        return { type: 6, text: result[0] };
    };
    CSS3Parser.prototype.consumeAtKeyword = function () {
        this.nextInputCodePointIndex++;
        var name = this.consumeAName();
        if (name) {
            return { type: 11, text: name.text };
        }
        this.nextInputCodePointIndex--;
        return null;
    };
    CSS3Parser.prototype.consumeAComment = function () {
        if (this.text[this.nextInputCodePointIndex + 1] === "*") {
            commentRegEx.lastIndex = this.nextInputCodePointIndex;
            var result = commentRegEx.exec(this.text);
            if (!result) {
                return null;
            }
            this.nextInputCodePointIndex = commentRegEx.lastIndex;
            return this.consumeAToken();
        }
        return null;
    };
    CSS3Parser.prototype.reconsumeTheCurrentInputToken = function (currentInputToken) {
        this.reconsumedInputToken = currentInputToken;
    };
    CSS3Parser.prototype.parseAStylesheet = function () {
        this.topLevelFlag = true;
        var stylesheet = {
            rules: this.consumeAListOfRules()
        };
        return stylesheet;
    };
    CSS3Parser.prototype.consumeAListOfRules = function () {
        var rules = [];
        var inputToken;
        while (inputToken = this.consumeAToken()) {
            switch (inputToken) {
                case " ": continue;
                case "<!--":
                case "-->":
                    if (this.topLevelFlag) {
                        continue;
                    }
                    this.reconsumeTheCurrentInputToken(inputToken);
                    var atRule = this.consumeAnAtRule();
                    if (atRule) {
                        rules.push(atRule);
                    }
                    continue;
            }
            if (inputToken.type === 11) {
                this.reconsumeTheCurrentInputToken(inputToken);
                var atRule = this.consumeAnAtRule();
                if (atRule) {
                    rules.push(atRule);
                }
                continue;
            }
            this.reconsumeTheCurrentInputToken(inputToken);
            var qualifiedRule = this.consumeAQualifiedRule();
            if (qualifiedRule) {
                rules.push(qualifiedRule);
            }
        }
        return rules;
    };
    CSS3Parser.prototype.consumeAnAtRule = function () {
        var inputToken = this.consumeAToken();
        var atRule = {
            type: "at-rule",
            name: inputToken.text,
            prelude: [],
            block: undefined
        };
        while (inputToken = this.consumeAToken()) {
            if (inputToken === ";") {
                return atRule;
            }
            else if (inputToken === "{") {
                atRule.block = this.consumeASimpleBlock(inputToken);
                return atRule;
            }
            else if (inputToken.type === 9 && inputToken.associatedToken === "{") {
                atRule.block = inputToken;
                return atRule;
            }
            this.reconsumeTheCurrentInputToken(inputToken);
            var component = this.consumeAComponentValue();
            if (component) {
                atRule.prelude.push(component);
            }
        }
        return atRule;
    };
    CSS3Parser.prototype.consumeAQualifiedRule = function () {
        var qualifiedRule = {
            type: "qualified-rule",
            prelude: [],
            block: undefined
        };
        var inputToken;
        while (inputToken = this.consumeAToken()) {
            if (inputToken === "{") {
                var block = this.consumeASimpleBlock(inputToken);
                qualifiedRule.block = block;
                return qualifiedRule;
            }
            else if (inputToken.type === 9) {
                var simpleBlock = inputToken;
                if (simpleBlock.associatedToken === "{") {
                    qualifiedRule.block = simpleBlock;
                    return qualifiedRule;
                }
            }
            this.reconsumeTheCurrentInputToken(inputToken);
            var componentValue = this.consumeAComponentValue();
            if (componentValue) {
                qualifiedRule.prelude.push(componentValue);
            }
        }
        return null;
    };
    CSS3Parser.prototype.consumeAComponentValue = function () {
        var inputToken = this.consumeAToken();
        switch (inputToken) {
            case "{":
            case "[":
            case "(":
                this.nextInputCodePointIndex++;
                return this.consumeASimpleBlock(inputToken);
        }
        if (typeof inputToken === "object" && inputToken.type === 8) {
            return this.consumeAFunction(inputToken.name);
        }
        return inputToken;
    };
    CSS3Parser.prototype.consumeASimpleBlock = function (associatedToken) {
        var endianToken = {
            "[": "]",
            "{": "}",
            "(": ")"
        }[associatedToken];
        var start = this.nextInputCodePointIndex - 1;
        var block = {
            type: 9,
            text: undefined,
            associatedToken: associatedToken,
            values: []
        };
        var nextInputToken;
        while (nextInputToken = this.text[this.nextInputCodePointIndex]) {
            if (nextInputToken === endianToken) {
                this.nextInputCodePointIndex++;
                var end = this.nextInputCodePointIndex;
                block.text = this.text.substring(start, end);
                return block;
            }
            var value = this.consumeAComponentValue();
            if (value) {
                block.values.push(value);
            }
        }
        block.text = this.text.substring(start);
        return block;
    };
    CSS3Parser.prototype.consumeAFunction = function (name) {
        var start = this.nextInputCodePointIndex;
        var funcToken = { type: 14, name: name, text: undefined, components: [] };
        do {
            if (this.nextInputCodePointIndex >= this.text.length) {
                funcToken.text = name + "(" + this.text.substring(start);
                return funcToken;
            }
            var nextInputToken = this.text[this.nextInputCodePointIndex];
            switch (nextInputToken) {
                case ")":
                    this.nextInputCodePointIndex++;
                    var end = this.nextInputCodePointIndex;
                    funcToken.text = name + "(" + this.text.substring(start, end);
                    return funcToken;
                default:
                    var component = this.consumeAComponentValue();
                    if (component) {
                        funcToken.components.push(component);
                    }
            }
        } while (true);
    };
    return CSS3Parser;
}());
exports.CSS3Parser = CSS3Parser;
var CSSNativeScript = (function () {
    function CSSNativeScript() {
    }
    CSSNativeScript.prototype.parseStylesheet = function (stylesheet) {
        return {
            type: "stylesheet",
            stylesheet: {
                rules: this.parseRules(stylesheet.rules)
            }
        };
    };
    CSSNativeScript.prototype.parseRules = function (rules) {
        var _this = this;
        return rules.map(function (rule) { return _this.parseRule(rule); });
    };
    CSSNativeScript.prototype.parseRule = function (rule) {
        if (rule.type === "at-rule") {
            return this.parseAtRule(rule);
        }
        else if (rule.type === "qualified-rule") {
            return this.parseQualifiedRule(rule);
        }
    };
    CSSNativeScript.prototype.parseAtRule = function (rule) {
        if (rule.name === "import") {
            return {
                import: rule.prelude.map(function (m) { return typeof m === "string" ? m : m.text; }).join("").trim(),
                type: "import"
            };
        }
        return;
    };
    CSSNativeScript.prototype.parseQualifiedRule = function (rule) {
        return {
            type: "rule",
            selectors: this.preludeToSelectorsStringArray(rule.prelude),
            declarations: this.ruleBlockToDeclarations(rule.block.values)
        };
    };
    CSSNativeScript.prototype.ruleBlockToDeclarations = function (declarationsInputTokens) {
        var declarations = [];
        var property = "";
        var value = "";
        var reading = "property";
        for (var i = 0; i < declarationsInputTokens.length; i++) {
            var inputToken = declarationsInputTokens[i];
            if (reading === "property") {
                if (inputToken === ":") {
                    reading = "value";
                }
                else if (typeof inputToken === "string") {
                    property += inputToken;
                }
                else {
                    property += inputToken.text;
                }
            }
            else {
                if (inputToken === ";") {
                    property = property.trim();
                    value = value.trim();
                    declarations.push({ type: "declaration", property: property, value: value });
                    property = "";
                    value = "";
                    reading = "property";
                }
                else if (typeof inputToken === "string") {
                    value += inputToken;
                }
                else {
                    value += inputToken.text;
                }
            }
        }
        property = property.trim();
        value = value.trim();
        if (property || value) {
            declarations.push({ type: "declaration", property: property, value: value });
        }
        return declarations;
    };
    CSSNativeScript.prototype.preludeToSelectorsStringArray = function (prelude) {
        var selectors = [];
        var selector = "";
        prelude.forEach(function (inputToken) {
            if (typeof inputToken === "string") {
                if (inputToken === ",") {
                    if (selector) {
                        selectors.push(selector.trim());
                    }
                    selector = "";
                }
                else {
                    selector += inputToken;
                }
            }
            else if (typeof inputToken === "object") {
                selector += inputToken.text;
            }
        });
        if (selector) {
            selectors.push(selector.trim());
        }
        return selectors;
    };
    return CSSNativeScript;
}());
exports.CSSNativeScript = CSSNativeScript;
//# sourceMappingURL=parser.js.map