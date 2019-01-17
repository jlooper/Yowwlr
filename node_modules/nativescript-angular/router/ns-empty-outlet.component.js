Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var page_1 = require("tns-core-modules/ui/page");
var page_router_outlet_1 = require("./page-router-outlet");
var NSEmptyOutletComponent = /** @class */ (function () {
    function NSEmptyOutletComponent(page) {
        var _this = this;
        this.page = page;
        if (this.page) {
            this.page.actionBarHidden = true;
            this.page.on("loaded", function () {
                if (_this.pageRouterOutlet && _this.page.frame) {
                    _this.pageRouterOutlet.setActionBarVisibility(_this.page.frame.actionBarVisibility);
                }
            });
        }
    }
    __decorate([
        core_1.ViewChild(page_router_outlet_1.PageRouterOutlet),
        __metadata("design:type", page_router_outlet_1.PageRouterOutlet)
    ], NSEmptyOutletComponent.prototype, "pageRouterOutlet", void 0);
    NSEmptyOutletComponent = __decorate([
        core_1.Component({
            // tslint:disable-next-line:component-selector
            selector: "ns-empty-outlet",
            moduleId: module.id,
            template: "<page-router-outlet isEmptyOutlet='true'></page-router-outlet>"
        }),
        __metadata("design:paramtypes", [page_1.Page])
    ], NSEmptyOutletComponent);
    return NSEmptyOutletComponent;
}());
exports.NSEmptyOutletComponent = NSEmptyOutletComponent;
//# sourceMappingURL=ns-empty-outlet.component.js.map