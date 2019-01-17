"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var fonticon_pipe_1 = require("./pipes/fonticon.pipe");
var fonticon_service_1 = require("./services/fonticon.service");
// for manual imports
__export(require("./pipes/fonticon.pipe"));
__export(require("./services/fonticon.service"));
var TNSFontIconModule = /** @class */ (function () {
    function TNSFontIconModule(fonticon) {
    }
    TNSFontIconModule.forRoot = function (providedConfig) {
        if (providedConfig === void 0) { providedConfig = {}; }
        return {
            ngModule: TNSFontIconModule,
            providers: [
                { provide: fonticon_service_1.USE_STORE, useValue: providedConfig },
                fonticon_service_1.TNSFontIconService
            ]
        };
    };
    TNSFontIconModule.decorators = [
        { type: core_1.NgModule, args: [{
                    declarations: [
                        fonticon_pipe_1.TNSFontIconPipe,
                        fonticon_pipe_1.TNSFontIconPurePipe
                    ],
                    exports: [
                        fonticon_pipe_1.TNSFontIconPipe,
                        fonticon_pipe_1.TNSFontIconPurePipe
                    ]
                },] },
    ];
    /** @nocollapse */
    TNSFontIconModule.ctorParameters = function () { return [
        { type: fonticon_service_1.TNSFontIconService, },
    ]; };
    return TNSFontIconModule;
}());
exports.TNSFontIconModule = TNSFontIconModule;
