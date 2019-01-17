Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var router_url_tree_1 = require("./private-imports/router-url-tree");
var ns_router_link_1 = require("./ns-router-link");
/**
 * The NSRouterLinkActive directive lets you add a CSS class to an element when the link"s route
 * becomes active.
 *
 * Consider the following example:
 *
 * ```
 * <a [nsRouterLink]="/user/bob" [nsRouterLinkActive]="active-link">Bob</a>
 * ```
 *
 * When the url is either "/user" or "/user/bob", the active-link class will
 * be added to the component. If the url changes, the class will be removed.
 *
 * You can set more than one class, as follows:
 *
 * ```
 * <a [nsRouterLink]="/user/bob" [nsRouterLinkActive]="class1 class2">Bob</a>
 * <a [nsRouterLink]="/user/bob" [nsRouterLinkActive]="["class1", "class2"]">Bob</a>
 * ```
 *
 * You can configure NSRouterLinkActive by passing `exact: true`. This will add the
 * classes only when the url matches the link exactly.
 *
 * ```
 * <a [nsRouterLink]="/user/bob" [nsRouterLinkActive]="active-link"
 * [nsRouterLinkActiveOptions]="{exact: true}">Bob</a>
 * ```
 *
 * Finally, you can apply the NSRouterLinkActive directive to an ancestor of a RouterLink.
 *
 * ```
 * <div [nsRouterLinkActive]="active-link" [nsRouterLinkActiveOptions]="{exact: true}">
 *   <a [nsRouterLink]="/user/jim">Jim</a>
 *   <a [nsRouterLink]="/user/bob">Bob</a>
 * </div>
 * ```
 *
 * This will set the active-link class on the div tag if the url is either "/user/jim" or
 * "/user/bob".
 *
 * @stable
 */
var NSRouterLinkActive = /** @class */ (function () {
    function NSRouterLinkActive(router, element, renderer) {
        var _this = this;
        this.router = router;
        this.element = element;
        this.renderer = renderer;
        this.classes = [];
        this.active = false;
        this.nsRouterLinkActiveOptions = { exact: false };
        this.subscription = router.events.subscribe(function (s) {
            if (s instanceof router_1.NavigationEnd) {
                _this.update();
            }
        });
    }
    Object.defineProperty(NSRouterLinkActive.prototype, "isActive", {
        get: function () {
            return this.active;
        },
        enumerable: true,
        configurable: true
    });
    NSRouterLinkActive.prototype.ngAfterContentInit = function () {
        var _this = this;
        this.links.changes.subscribe(function () { return _this.update(); });
        this.update();
    };
    Object.defineProperty(NSRouterLinkActive.prototype, "nsRouterLinkActive", {
        set: function (data) {
            if (Array.isArray(data)) {
                this.classes = data;
            }
            else {
                this.classes = data.split(" ");
            }
        },
        enumerable: true,
        configurable: true
    });
    NSRouterLinkActive.prototype.ngOnChanges = function (_) { this.update(); };
    NSRouterLinkActive.prototype.ngOnDestroy = function () { this.subscription.unsubscribe(); };
    NSRouterLinkActive.prototype.update = function () {
        var _this = this;
        if (!this.links) {
            return;
        }
        var hasActiveLinks = this.hasActiveLinks();
        // react only when status has changed to prevent unnecessary dom updates
        if (this.active !== hasActiveLinks) {
            var currentUrlTree = this.router.parseUrl(this.router.url);
            var isActiveLinks_1 = this.reduceList(currentUrlTree, this.links);
            this.classes.forEach(function (c) { return _this.renderer.setElementClass(_this.element.nativeElement, c, isActiveLinks_1); });
        }
        Promise.resolve(hasActiveLinks).then(function (active) { return _this.active = active; });
    };
    NSRouterLinkActive.prototype.reduceList = function (currentUrlTree, q) {
        var _this = this;
        return q.reduce(function (res, link) {
            return res || router_url_tree_1.containsTree(currentUrlTree, link.urlTree, _this.nsRouterLinkActiveOptions.exact);
        }, false);
    };
    NSRouterLinkActive.prototype.isLinkActive = function (router) {
        var _this = this;
        return function (link) {
            return router.isActive(link.urlTree, _this.nsRouterLinkActiveOptions.exact);
        };
    };
    NSRouterLinkActive.prototype.hasActiveLinks = function () {
        return this.links.some(this.isLinkActive(this.router));
    };
    __decorate([
        core_1.ContentChildren(ns_router_link_1.NSRouterLink),
        __metadata("design:type", core_1.QueryList)
    ], NSRouterLinkActive.prototype, "links", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], NSRouterLinkActive.prototype, "nsRouterLinkActiveOptions", void 0);
    __decorate([
        core_1.Input("nsRouterLinkActive"),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], NSRouterLinkActive.prototype, "nsRouterLinkActive", null);
    NSRouterLinkActive = __decorate([
        core_1.Directive({
            selector: "[nsRouterLinkActive]",
            exportAs: "routerLinkActive",
        }),
        __metadata("design:paramtypes", [router_1.Router, core_1.ElementRef, core_1.Renderer])
    ], NSRouterLinkActive);
    return NSRouterLinkActive;
}());
exports.NSRouterLinkActive = NSRouterLinkActive;
//# sourceMappingURL=ns-router-link-active.js.map