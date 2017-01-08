var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var trace_1 = require("../trace");
var page_router_outlet_1 = require("./page-router-outlet");
var router_extensions_1 = require("./router-extensions");
var types_1 = require("utils/types");
/**
 * The nsRouterLink directive lets you link to specific parts of your app.
 *
 * Consider the following route configuration:
 * ```
 * [{ path: "/user", component: UserCmp }]
 * ```
 *
 * When linking to this `User` route, you can write:
 *
 * ```
 * <a [nsRouterLink]="["/user"]">link to user component</a>
 * ```
 *
 * NSRouterLink expects the value to be an array of path segments, followed by the params
 * for that level of routing. For instance `["/team", {teamId: 1}, "user", {userId: 2}]`
 * means that we want to generate a link to `/team;teamId=1/user;userId=2`.
 *
 * The first segment name can be prepended with `/`, `./`, or `../`.
 * If the segment begins with `/`, the router will look up the route from the root of the app.
 * If the segment begins with `./`, or doesn"t begin with a slash, the router will
 * instead look in the current component"s children for the route.
 * And if the segment begins with `../`, the router will go up one level.
 */
var NSRouterLink = (function () {
    function NSRouterLink(router, navigator, route, pageRoute) {
        this.router = router;
        this.navigator = navigator;
        this.route = route;
        this.pageRoute = pageRoute;
        this.commands = [];
        this.pageTransition = true;
        this.usePageRoute = (this.pageRoute && this.route === this.pageRoute.activatedRoute.getValue());
    }
    Object.defineProperty(NSRouterLink.prototype, "currentRoute", {
        get: function () {
            return this.usePageRoute ? this.pageRoute.activatedRoute.getValue() : this.route;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NSRouterLink.prototype, "params", {
        set: function (data) {
            if (Array.isArray(data)) {
                this.commands = data;
            }
            else {
                this.commands = [data];
            }
        },
        enumerable: true,
        configurable: true
    });
    NSRouterLink.prototype.onTap = function () {
        trace_1.routerLog("nsRouterLink.tapped: " + this.commands + " usePageRoute: " +
            this.usePageRoute + " clearHistory: " + this.clearHistory + " transition: " +
            JSON.stringify(this.pageTransition));
        var transition = this.getTransition();
        var extras = {
            relativeTo: this.currentRoute,
            queryParams: this.queryParams,
            fragment: this.fragment,
            clearHistory: this.clearHistory,
            animated: transition.animated,
            transition: transition.transition
        };
        this.navigator.navigate(this.commands, extras);
    };
    NSRouterLink.prototype.getTransition = function () {
        if (typeof this.pageTransition === "boolean") {
            return { animated: this.pageTransition };
        }
        else if (types_1.isString(this.pageTransition)) {
            if (this.pageTransition === "none" || this.pageTransition === "false") {
                return { animated: false };
            }
            else {
                return { animated: true, transition: { name: this.pageTransition } };
            }
        }
        else {
            return {
                animated: true,
                transition: this.pageTransition
            };
        }
    };
    NSRouterLink.prototype.ngOnChanges = function (_) {
        this.updateUrlTree();
    };
    NSRouterLink.prototype.updateUrlTree = function () {
        this.urlTree = this.router.createUrlTree(this.commands, { relativeTo: this.currentRoute, queryParams: this.queryParams, fragment: this.fragment });
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], NSRouterLink.prototype, "target", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], NSRouterLink.prototype, "queryParams", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], NSRouterLink.prototype, "fragment", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], NSRouterLink.prototype, "clearHistory", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], NSRouterLink.prototype, "pageTransition", void 0);
    __decorate([
        core_1.Input("nsRouterLink"), 
        __metadata('design:type', Object), 
        __metadata('design:paramtypes', [Object])
    ], NSRouterLink.prototype, "params", null);
    __decorate([
        core_1.HostListener("tap"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], NSRouterLink.prototype, "onTap", null);
    NSRouterLink = __decorate([
        core_1.Directive({ selector: "[nsRouterLink]" }),
        __param(3, core_1.Optional()), 
        __metadata('design:paramtypes', [router_1.Router, router_extensions_1.RouterExtensions, router_1.ActivatedRoute, page_router_outlet_1.PageRoute])
    ], NSRouterLink);
    return NSRouterLink;
}());
exports.NSRouterLink = NSRouterLink;
//# sourceMappingURL=ns-router-link.js.map