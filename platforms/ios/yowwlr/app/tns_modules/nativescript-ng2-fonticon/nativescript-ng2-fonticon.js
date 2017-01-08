"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var core_1 = require('@angular/core');
var fonticon_pipe_1 = require('./src/app/pipes/fonticon.pipe');
var fonticon_service_1 = require('./src/app/services/fonticon.service');
__export(require('./src/app/pipes/fonticon.pipe'));
__export(require('./src/app/services/fonticon.service'));
var PIPES = [
    fonticon_pipe_1.TNSFontIconPipe,
    fonticon_pipe_1.TNSFontIconPurePipe
];
var TNSFontIconModule = (function () {
    function TNSFontIconModule() {
    }
    TNSFontIconModule.forRoot = function (providedConfig) {
        fonticon_service_1.TNSFontIconService.config = providedConfig;
        return {
            ngModule: TNSFontIconModule,
            providers: [fonticon_service_1.TNSFontIconService]
        };
    };
    TNSFontIconModule = __decorate([
        core_1.NgModule({
            declarations: PIPES,
            exports: PIPES
        }), 
        __metadata('design:paramtypes', [])
    ], TNSFontIconModule);
    return TNSFontIconModule;
}());
exports.TNSFontIconModule = TNSFontIconModule;
//# sourceMappingURL=nativescript-ng2-fonticon.js.map