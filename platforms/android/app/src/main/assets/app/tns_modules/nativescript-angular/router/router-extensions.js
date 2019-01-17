Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var ns_location_strategy_1 = require("./ns-location-strategy");
var platform_providers_1 = require("../platform-providers");
var trace_1 = require("../trace");
var page_router_outlet_1 = require("./page-router-outlet");
var RouterExtensions = /** @class */ (function () {
    function RouterExtensions(router, locationStrategy, frameService) {
        this.router = router;
        this.locationStrategy = locationStrategy;
        this.frameService = frameService;
    }
    RouterExtensions.prototype.navigate = function (commands, extras) {
        if (extras) {
            this.locationStrategy._setNavigationOptions(extras);
        }
        return this.router.navigate(commands, extras);
    };
    RouterExtensions.prototype.navigateByUrl = function (url, options) {
        if (options) {
            this.locationStrategy._setNavigationOptions(options);
        }
        return this.router.navigateByUrl(url);
    };
    RouterExtensions.prototype.back = function (backNavigationOptions) {
        if (backNavigationOptions) {
            this.backOutlets(backNavigationOptions);
        }
        else {
            this.locationStrategy.back();
        }
    };
    RouterExtensions.prototype.canGoBack = function (backNavigationOptions) {
        var _this = this;
        var canGoBack = true;
        if (backNavigationOptions) {
            var _a = this.findOutletsToBack(backNavigationOptions), outletsToBack = _a.outletsToBack, outlets = _a.outlets;
            if (outletsToBack.length !== outlets.length) {
                trace_1.routerError("No outlet found relative to activated route");
            }
            else {
                outletsToBack.forEach(function (outletToBack) {
                    if (!_this.locationStrategy.canGoBack(outletToBack)) {
                        canGoBack = false;
                    }
                });
            }
        }
        else {
            canGoBack = this.locationStrategy.canGoBack();
        }
        return canGoBack;
    };
    RouterExtensions.prototype.backToPreviousPage = function () {
        this.frameService.getFrame().goBack();
    };
    RouterExtensions.prototype.canGoBackToPreviousPage = function () {
        return this.frameService.getFrame().canGoBack();
    };
    RouterExtensions.prototype.backOutlets = function (options) {
        var _this = this;
        var _a = this.findOutletsToBack(options), outletsToBack = _a.outletsToBack, outlets = _a.outlets;
        if (outletsToBack.length !== outlets.length) {
            trace_1.routerError("No outlet found relative to activated route");
        }
        else {
            outletsToBack.forEach(function (outletToBack) {
                if (outletToBack.isPageNavigationBack) {
                    trace_1.routerError("Attempted to call startGoBack while going back:");
                }
                else {
                    _this.locationStrategy.back(outletToBack);
                }
            });
        }
    };
    // tslint:disable-next-line:max-line-length
    RouterExtensions.prototype.findOutletsToBack = function (options) {
        var outletsToBack = [];
        var rootRoute = this.router.routerState.root;
        var outlets = options.outlets;
        var relativeRoute = options.relativeTo || rootRoute;
        var relativeRouteOutlet = this.findOutletByRoute(relativeRoute);
        var isNSEmptyOutlet = relativeRouteOutlet && relativeRouteOutlet.isNSEmptyOutlet;
        // Lazy named outlet has added 'primary' inner NSEmptyOutlet child.
        // Take parent route when `relativeTo` option points to the outer named outlet.
        if (isNSEmptyOutlet && relativeRoute.outlet !== "primary") {
            relativeRoute = relativeRoute.parent || relativeRoute;
        }
        var routesToMatch = outlets ? relativeRoute.children : [relativeRoute];
        outlets = outlets || [relativeRoute.outlet];
        var _loop_1 = function (index) {
            var currentRoute = routesToMatch[index];
            if (outlets.some(function (currentOutlet) { return currentOutlet === currentRoute.outlet; })) {
                var outlet = this_1.findOutletByRoute(currentRoute);
                if (outlet) {
                    outletsToBack.push(outlet);
                }
            }
        };
        var this_1 = this;
        for (var index = 0; index < routesToMatch.length; index++) {
            _loop_1(index);
        }
        return { outletsToBack: outletsToBack, outlets: outlets };
    };
    RouterExtensions.prototype.findOutletByRoute = function (currentRoute) {
        var outlet;
        var currentRouteSnapshop = page_router_outlet_1.findTopActivatedRouteNodeForOutlet(currentRoute.snapshot);
        var outletKey = this.locationStrategy.getRouteFullPath(currentRouteSnapshop);
        outlet = this.locationStrategy.findOutletByKey(outletKey);
        return outlet;
    };
    RouterExtensions = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [router_1.Router,
            ns_location_strategy_1.NSLocationStrategy,
            platform_providers_1.FrameService])
    ], RouterExtensions);
    return RouterExtensions;
}());
exports.RouterExtensions = RouterExtensions;
//# sourceMappingURL=router-extensions.js.map