var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var common_1 = require("@angular/common");
var ns_router_link_1 = require("./router/ns-router-link");
var ns_router_link_active_1 = require("./router/ns-router-link-active");
var page_router_outlet_1 = require("./router/page-router-outlet");
var ns_location_strategy_1 = require("./router/ns-location-strategy");
var ns_platform_location_1 = require("./router/ns-platform-location");
var router_extensions_1 = require("./router/router-extensions");
var trace_1 = require("./trace");
exports.routerTraceCategory = trace_1.routerTraceCategory;
var page_router_outlet_2 = require("./router/page-router-outlet");
exports.PageRoute = page_router_outlet_2.PageRoute;
var router_extensions_2 = require("./router/router-extensions");
exports.RouterExtensions = router_extensions_2.RouterExtensions;
var nativescript_module_1 = require("./nativescript.module");
var NativeScriptRouterModule = (function () {
    function NativeScriptRouterModule() {
    }
    NativeScriptRouterModule.forRoot = function (routes, config) {
        return router_1.RouterModule.forRoot(routes, config);
    };
    NativeScriptRouterModule.forChild = function (routes) {
        return router_1.RouterModule.forChild(routes);
    };
    NativeScriptRouterModule = __decorate([
        core_1.NgModule({
            declarations: [
                ns_router_link_1.NSRouterLink,
                ns_router_link_active_1.NSRouterLinkActive,
                page_router_outlet_1.PageRouterOutlet
            ],
            providers: [
                ns_location_strategy_1.NSLocationStrategy,
                { provide: common_1.LocationStrategy, useExisting: ns_location_strategy_1.NSLocationStrategy },
                ns_platform_location_1.NativescriptPlatformLocation,
                { provide: common_1.PlatformLocation, useClass: ns_platform_location_1.NativescriptPlatformLocation },
                router_extensions_1.RouterExtensions
            ],
            imports: [
                router_1.RouterModule,
                nativescript_module_1.NativeScriptModule
            ],
            exports: [
                router_1.RouterModule,
                ns_router_link_1.NSRouterLink,
                ns_router_link_active_1.NSRouterLinkActive,
                page_router_outlet_1.PageRouterOutlet
            ],
            schemas: [core_1.NO_ERRORS_SCHEMA]
        }), 
        __metadata('design:paramtypes', [])
    ], NativeScriptRouterModule);
    return NativeScriptRouterModule;
}());
exports.NativeScriptRouterModule = NativeScriptRouterModule;
//# sourceMappingURL=router.js.map