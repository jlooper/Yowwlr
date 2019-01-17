Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_1 = require("tns-core-modules/platform");
var platform_providers_1 = require("../platform-providers");
var AndroidFilterComponent = /** @class */ (function () {
    function AndroidFilterComponent(device) {
        this.show = (device.os === platform_1.platformNames.android);
    }
    AndroidFilterComponent = __decorate([
        core_1.Component({
            selector: "android",
            template: "<ng-content *ngIf=\"show\"></ng-content>",
        }),
        __param(0, core_1.Inject(platform_providers_1.DEVICE)),
        __metadata("design:paramtypes", [Object])
    ], AndroidFilterComponent);
    return AndroidFilterComponent;
}());
exports.AndroidFilterComponent = AndroidFilterComponent;
var IosFilterComponent = /** @class */ (function () {
    function IosFilterComponent(device) {
        this.show = (device.os === platform_1.platformNames.ios);
    }
    IosFilterComponent = __decorate([
        core_1.Component({
            selector: "ios",
            template: "<ng-content *ngIf=\"show\"></ng-content>",
        }),
        __param(0, core_1.Inject(platform_providers_1.DEVICE)),
        __metadata("design:paramtypes", [Object])
    ], IosFilterComponent);
    return IosFilterComponent;
}());
exports.IosFilterComponent = IosFilterComponent;
//# sourceMappingURL=platform-filters.js.map