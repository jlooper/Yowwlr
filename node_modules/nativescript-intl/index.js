"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nativescript_intl_1 = require("./nativescript-intl");
var nativescript_intl_2 = require("./nativescript-intl");
exports.DateTimeFormat = nativescript_intl_2.DateTimeFormat;
exports.NumberFormat = nativescript_intl_2.NumberFormat;
if (!global.Intl) {
    global.Intl = {};
}
global.Intl.DateTimeFormat = nativescript_intl_1.DateTimeFormat;
global.Intl.NumberFormat = nativescript_intl_1.NumberFormat;
