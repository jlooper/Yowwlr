Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var trace_1 = require("../trace");
var router_extensions_1 = require("./router-extensions");
var types_1 = require("tns-core-modules/utils/types");
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
var NSRouterLink = /** @class */ (function () {
    function NSRouterLink(router, navigator, route) {
        this.router = router;
        this.navigator = navigator;
        this.route = route;
        this.pageTransition = true;
        this.commands = [];
    }
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
        if (trace_1.isLogEnabled()) {
            trace_1.routerLog("nsRouterLink.tapped: " + this.commands + " " +
                ("clear: " + this.clearHistory + " ") +
                ("transition: " + JSON.stringify(this.pageTransition) + " ") +
                ("duration: " + this.pageTransitionDuration));
        }
        var extras = this.getExtras();
        this.navigator.navigateByUrl(this.urlTree, extras);
    };
    NSRouterLink.prototype.getExtras = function () {
        var transition = this.getTransition();
        return {
            skipLocationChange: attrBoolValue(this.skipLocationChange),
            replaceUrl: attrBoolValue(this.replaceUrl),
            clearHistory: this.convertClearHistory(this.clearHistory),
            animated: transition.animated,
            transition: transition.transition,
        };
    };
    Object.defineProperty(NSRouterLink.prototype, "urlTree", {
        get: function () {
            var urlTree = this.router.createUrlTree(this.commands, {
                relativeTo: this.route,
                queryParams: this.queryParams,
                fragment: this.fragment,
                preserveQueryParams: attrBoolValue(this.preserveQueryParams),
                queryParamsHandling: this.queryParamsHandling,
                preserveFragment: attrBoolValue(this.preserveFragment),
            });
            if (trace_1.isLogEnabled()) {
                trace_1.routerLog("nsRouterLink urlTree created: " + urlTree);
            }
            return urlTree;
        },
        enumerable: true,
        configurable: true
    });
    NSRouterLink.prototype.convertClearHistory = function (value) {
        return value === true || value === "true";
    };
    NSRouterLink.prototype.getTransition = function () {
        var transition = {};
        var animated;
        if (typeof this.pageTransition === "boolean") {
            animated = this.pageTransition;
        }
        else if (types_1.isString(this.pageTransition)) {
            if (this.pageTransition === "none" || this.pageTransition === "false") {
                animated = false;
            }
            else {
                animated = true;
                transition.name = this.pageTransition;
            }
        }
        else {
            animated = true;
            transition = this.pageTransition;
        }
        var duration = +this.pageTransitionDuration;
        if (!isNaN(duration)) {
            transition.duration = duration;
        }
        return { animated: animated, transition: transition };
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], NSRouterLink.prototype, "target", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], NSRouterLink.prototype, "queryParams", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], NSRouterLink.prototype, "fragment", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], NSRouterLink.prototype, "queryParamsHandling", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], NSRouterLink.prototype, "preserveQueryParams", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], NSRouterLink.prototype, "preserveFragment", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], NSRouterLink.prototype, "skipLocationChange", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], NSRouterLink.prototype, "replaceUrl", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], NSRouterLink.prototype, "clearHistory", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], NSRouterLink.prototype, "pageTransition", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], NSRouterLink.prototype, "pageTransitionDuration", void 0);
    __decorate([
        core_1.Input("nsRouterLink"),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], NSRouterLink.prototype, "params", null);
    __decorate([
        core_1.HostListener("tap"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], NSRouterLink.prototype, "onTap", null);
    NSRouterLink = __decorate([
        core_1.Directive({ selector: "[nsRouterLink]" }),
        __metadata("design:paramtypes", [router_1.Router,
            router_extensions_1.RouterExtensions,
            router_1.ActivatedRoute])
    ], NSRouterLink);
    return NSRouterLink;
}());
exports.NSRouterLink = NSRouterLink;
function attrBoolValue(s) {
    return s === "" || !!s;
}
//# sourceMappingURL=ns-router-link.js.map