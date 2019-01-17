Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var frame_1 = require("tns-core-modules/ui/frame");
var page_1 = require("tns-core-modules/ui/page");
var profiling_1 = require("tns-core-modules/profiling");
var rxjs_1 = require("rxjs");
var platform_providers_1 = require("../platform-providers");
var trace_1 = require("../trace");
var detached_loader_1 = require("../common/detached-loader");
var view_util_1 = require("../view-util");
var ns_location_strategy_1 = require("./ns-location-strategy");
var ns_route_reuse_strategy_1 = require("./ns-route-reuse-strategy");
var PageRoute = /** @class */ (function () {
    function PageRoute(startRoute) {
        this.activatedRoute = new rxjs_1.BehaviorSubject(startRoute);
    }
    return PageRoute;
}());
exports.PageRoute = PageRoute;
// Used to "mark" ActivatedRoute snapshots that are handled in PageRouterOutlet
exports.pageRouterActivatedSymbol = Symbol("page-router-activated");
exports.loaderRefSymbol = Symbol("loader-ref");
function destroyComponentRef(componentRef) {
    if (componentRef) {
        var loaderRef = componentRef[exports.loaderRefSymbol];
        if (loaderRef) {
            loaderRef.destroy();
        }
        componentRef.destroy();
    }
}
exports.destroyComponentRef = destroyComponentRef;
var ChildInjector = /** @class */ (function () {
    function ChildInjector(providers, parent) {
        this.providers = providers;
        this.parent = parent;
    }
    ChildInjector.prototype.get = function (token, notFoundValue) {
        var localValue = this.providers.get(token);
        if (localValue) {
            return localValue;
        }
        return this.parent.get(token, notFoundValue);
    };
    return ChildInjector;
}());
/**
 * There are cases where multiple activatedRoute nodes should be associated/handled by the same PageRouterOutlet.
 * We can gat additional ActivatedRoutes nodes when there is:
 *  - Lazy loading - there is an additional ActivatedRoute node for the RouteConfig with the `loadChildren` setup
 *  - Componentless routes - there is an additional ActivatedRoute node for the componentless RouteConfig
 *
 * Example:
 *   R  <-- root
 *   |
 * feature (lazy module) <-- RouteConfig: { path: "lazy", loadChildren: "./feature/feature.module#FeatureModule" }
 *   |
 * module (componentless route) <-- RouteConfig: { path: "module", children: [...] } // Note: No 'component'
 *   |
 *  home <-- RouteConfig: { path: "module", component: MyComponent } - this is what we get as activatedRoute param
 *
 *  In these cases we will mark the top-most node (feature). NSRouteReuseStrategy will detach the tree there and
 *  use this ActivateRoute as a kay for caching.
 */
function findTopActivatedRouteNodeForOutlet(activatedRoute) {
    var outletActivatedRoute = activatedRoute;
    while (outletActivatedRoute.parent &&
        outletActivatedRoute.parent.routeConfig &&
        !outletActivatedRoute.parent.routeConfig.component) {
        outletActivatedRoute = outletActivatedRoute.parent;
    }
    return outletActivatedRoute;
}
exports.findTopActivatedRouteNodeForOutlet = findTopActivatedRouteNodeForOutlet;
function routeToString(activatedRoute) {
    return activatedRoute.pathFromRoot.join("->");
}
var PageRouterOutlet = /** @class */ (function () {
    function PageRouterOutlet(parentContexts, location, name, actionBarVisibility, isEmptyOutlet, locationStrategy, componentFactoryResolver, resolver, changeDetector, device, pageFactory, routeReuseStrategy, elRef) {
        this.parentContexts = parentContexts;
        this.location = location;
        this.locationStrategy = locationStrategy;
        this.componentFactoryResolver = componentFactoryResolver;
        this.resolver = resolver;
        this.changeDetector = changeDetector;
        this.pageFactory = pageFactory;
        this.routeReuseStrategy = routeReuseStrategy;
        this.activated = null;
        this._activatedRoute = null;
        this.activateEvents = new core_1.EventEmitter(); // tslint:disable-line:no-output-rename
        this.deactivateEvents = new core_1.EventEmitter(); // tslint:disable-line:no-output-rename
        this.isEmptyOutlet = isEmptyOutlet;
        this.frame = elRef.nativeElement;
        this.setActionBarVisibility(actionBarVisibility);
        if (trace_1.isLogEnabled()) {
            trace_1.routerLog("PageRouterOutlet.constructor frame: " + this.frame);
        }
        this.name = name || router_1.PRIMARY_OUTLET;
        parentContexts.onChildOutletCreated(this.name, this);
        this.viewUtil = new view_util_1.ViewUtil(device);
        this.detachedLoaderFactory = resolver.resolveComponentFactory(detached_loader_1.DetachedLoader);
    }
    Object.defineProperty(PageRouterOutlet.prototype, "locationInjector", {
        /** @deprecated from Angular since v4 */
        get: function () { return this.location.injector; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageRouterOutlet.prototype, "locationFactoryResolver", {
        /** @deprecated from Angular since v4 */
        get: function () { return this.resolver; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageRouterOutlet.prototype, "isActivated", {
        get: function () {
            return !!this.activated;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageRouterOutlet.prototype, "component", {
        get: function () {
            if (!this.activated) {
                if (trace_1.isLogEnabled()) {
                    trace_1.routerLog("Outlet is not activated");
                }
                return;
            }
            return this.activated.instance;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageRouterOutlet.prototype, "activatedRoute", {
        get: function () {
            if (!this.activated) {
                if (trace_1.isLogEnabled()) {
                    trace_1.routerLog("Outlet is not activated");
                }
                return;
            }
            return this._activatedRoute;
        },
        enumerable: true,
        configurable: true
    });
    PageRouterOutlet.prototype.setActionBarVisibility = function (actionBarVisibility) {
        switch (actionBarVisibility) {
            case "always":
            case "never":
                this.frame.actionBarVisibility = actionBarVisibility;
                return;
            default:
                this.frame.actionBarVisibility = "auto";
        }
    };
    PageRouterOutlet.prototype.ngOnDestroy = function () {
        var _this = this;
        // Clear accumulated modal view page cache when page-router-outlet
        // destroyed on modal view closing
        this.parentContexts.onChildOutletDestroyed(this.name);
        if (this.outlet) {
            this.outlet.outletKeys.forEach(function (key) {
                _this.routeReuseStrategy.clearModalCache(key);
            });
            this.locationStrategy.clearOutlet(this.frame);
        }
        else {
            trace_1.routerLog("NSLocationStrategy.ngOnDestroy: no outlet available for page-router-outlet");
        }
    };
    PageRouterOutlet.prototype.deactivate = function () {
        if (!this.outlet || !this.outlet.isPageNavigationBack) {
            if (trace_1.isLogEnabled()) {
                trace_1.routerLog("Currently not in page back navigation - component should be detached instead of deactivated.");
            }
            return;
        }
        if (trace_1.isLogEnabled()) {
            trace_1.routerLog("PageRouterOutlet.deactivate() while going back - should destroy");
        }
        if (!this.isActivated) {
            return;
        }
        var c = this.activated.instance;
        destroyComponentRef(this.activated);
        this.activated = null;
        this._activatedRoute = null;
        this.deactivateEvents.emit(c);
    };
    /**
     * Called when the `RouteReuseStrategy` instructs to detach the subtree
     */
    PageRouterOutlet.prototype.detach = function () {
        if (!this.isActivated) {
            if (trace_1.isLogEnabled()) {
                trace_1.routerLog("Outlet is not activated");
            }
            return;
        }
        if (trace_1.isLogEnabled()) {
            trace_1.routerLog("PageRouterOutlet.detach() - " + routeToString(this._activatedRoute));
        }
        var component = this.activated;
        this.activated = null;
        this._activatedRoute = null;
        return component;
    };
    /**
     * Called when the `RouteReuseStrategy` instructs to re-attach a previously detached subtree
     */
    PageRouterOutlet.prototype.attach = function (ref, activatedRoute) {
        if (trace_1.isLogEnabled()) {
            trace_1.routerLog("PageRouterOutlet.attach() - " + routeToString(activatedRoute));
        }
        this.activated = ref;
        this._activatedRoute = activatedRoute;
        this.markActivatedRoute(activatedRoute);
        this.locationStrategy._finishBackPageNavigation(this.frame);
    };
    /**
     * Called by the Router to instantiate a new component during the commit phase of a navigation.
     * This method in turn is responsible for calling the `routerOnActivate` hook of its child.
     */
    PageRouterOutlet.prototype.activateWith = function (activatedRoute, resolver) {
        this.outlet = this.outlet || this.getOutlet(activatedRoute.snapshot);
        if (!this.outlet) {
            if (trace_1.isLogEnabled()) {
                trace_1.routerError("No outlet found relative to activated route");
            }
            return;
        }
        this.outlet.isNSEmptyOutlet = this.isEmptyOutlet;
        this.locationStrategy.updateOutletFrame(this.outlet, this.frame);
        if (this.outlet && this.outlet.isPageNavigationBack) {
            if (trace_1.isLogEnabled()) {
                trace_1.routerLog("Currently in page back navigation - component should be reattached instead of activated.");
            }
            this.locationStrategy._finishBackPageNavigation(this.frame);
        }
        if (trace_1.isLogEnabled()) {
            trace_1.routerLog("PageRouterOutlet.activateWith() - " + routeToString(activatedRoute));
        }
        this._activatedRoute = activatedRoute;
        this.markActivatedRoute(activatedRoute);
        resolver = resolver || this.resolver;
        this.activateOnGoForward(activatedRoute, resolver);
        this.activateEvents.emit(this.activated.instance);
    };
    PageRouterOutlet.prototype.activateOnGoForward = function (activatedRoute, loadedResolver) {
        if (trace_1.isLogEnabled()) {
            trace_1.routerLog("PageRouterOutlet.activate() forward navigation - " +
                "create detached loader in the loader container");
        }
        var factory = this.getComponentFactory(activatedRoute, loadedResolver);
        var page = this.pageFactory({
            isNavigation: true,
            componentType: factory.componentType,
        });
        var providers = new Map();
        providers.set(page_1.Page, page);
        providers.set(frame_1.Frame, this.frame);
        providers.set(PageRoute, new PageRoute(activatedRoute));
        providers.set(router_1.ActivatedRoute, activatedRoute);
        providers.set(router_1.ChildrenOutletContexts, this.parentContexts.getOrCreateContext(this.name).children);
        var childInjector = new ChildInjector(providers, this.location.injector);
        var loaderRef = this.location.createComponent(this.detachedLoaderFactory, this.location.length, childInjector, []);
        this.changeDetector.markForCheck();
        this.activated = loaderRef.instance.loadWithFactory(factory);
        this.loadComponentInPage(page, this.activated);
        this.activated[exports.loaderRefSymbol] = loaderRef;
    };
    PageRouterOutlet.prototype.loadComponentInPage = function (page, componentRef) {
        var _this = this;
        // Component loaded. Find its root native view.
        var componentView = componentRef.location.nativeElement;
        // Remove it from original native parent.
        this.viewUtil.removeChild(componentView.parent, componentView);
        // Add it to the new page
        page.content = componentView;
        page.on(page_1.Page.navigatedFromEvent, global.Zone.current.wrap(function (args) {
            if (args.isBackNavigation) {
                _this.locationStrategy._beginBackPageNavigation(_this.frame);
                _this.locationStrategy.back();
            }
        }));
        var navOptions = this.locationStrategy._beginPageNavigation(this.frame);
        // Clear refCache if navigation with clearHistory
        if (navOptions.clearHistory) {
            var clearCallback_1 = function () { return setTimeout(function () {
                if (_this.outlet) {
                    _this.routeReuseStrategy.clearCache(_this.outlet.outletKeys[0]);
                }
                page.off(page_1.Page.navigatedToEvent, clearCallback_1);
            }); };
            page.on(page_1.Page.navigatedToEvent, clearCallback_1);
        }
        this.frame.navigate({
            create: function () { return page; },
            clearHistory: navOptions.clearHistory,
            animated: navOptions.animated,
            transition: navOptions.transition
        });
    };
    // Find and mark the top activated route as an activated one.
    // In ns-location-strategy we are reusing components only if their corresponing routes
    // are marked as activated from this method.
    PageRouterOutlet.prototype.markActivatedRoute = function (activatedRoute) {
        var queue = [];
        queue.push(activatedRoute.snapshot);
        var currentRoute = queue.shift();
        while (currentRoute) {
            currentRoute.children.forEach(function (childRoute) {
                queue.push(childRoute);
            });
            var nodeToMark = findTopActivatedRouteNodeForOutlet(currentRoute);
            var outletKeyForRoute = this.locationStrategy.getRouteFullPath(nodeToMark);
            var outlet = this.locationStrategy.findOutletByKey(outletKeyForRoute);
            if (outlet && outlet.frames.length) {
                nodeToMark[exports.pageRouterActivatedSymbol] = true;
                if (trace_1.isLogEnabled()) {
                    trace_1.routerLog("Activated route marked as page: " + routeToString(nodeToMark));
                }
            }
            currentRoute = queue.shift();
        }
    };
    PageRouterOutlet.prototype.getComponentFactory = function (activatedRoute, loadedResolver) {
        var component = activatedRoute.routeConfig.component;
        return loadedResolver ?
            loadedResolver.resolveComponentFactory(component) :
            this.componentFactoryResolver.resolveComponentFactory(component);
    };
    PageRouterOutlet.prototype.getOutlet = function (activatedRouteSnapshot) {
        var topActivatedRoute = findTopActivatedRouteNodeForOutlet(activatedRouteSnapshot);
        var modalNavigation = this.locationStrategy._modalNavigationDepth;
        var outletKey = this.locationStrategy.getRouteFullPath(topActivatedRoute);
        var outlet;
        if (modalNavigation > 0) { // Modal with 'primary' p-r-o
            outlet = this.locationStrategy.findOutletByModal(modalNavigation);
        }
        else {
            var pathByOutlets = this.locationStrategy.getPathByOutlets(topActivatedRoute);
            outlet = this.locationStrategy.findOutletByKey(outletKey);
            outlet = outlet || this.locationStrategy.findOutletByOutletPath(pathByOutlets);
        }
        // Named lazy loaded outlet.
        if (!outlet && this.isEmptyOutlet) {
            var parentOutletKey = this.locationStrategy.getRouteFullPath(topActivatedRoute.parent);
            outlet = this.locationStrategy.findOutletByKey(parentOutletKey);
            if (outlet) {
                outlet.outletKeys.push(outletKey);
            }
        }
        return outlet;
    };
    __decorate([
        core_1.Output("activate"),
        __metadata("design:type", Object)
    ], PageRouterOutlet.prototype, "activateEvents", void 0);
    __decorate([
        core_1.Output("deactivate"),
        __metadata("design:type", Object)
    ], PageRouterOutlet.prototype, "deactivateEvents", void 0);
    __decorate([
        profiling_1.profile,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [router_1.ActivatedRoute,
            core_1.ComponentFactoryResolver]),
        __metadata("design:returntype", void 0)
    ], PageRouterOutlet.prototype, "activateWith", null);
    __decorate([
        profiling_1.profile,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [page_1.Page, core_1.ComponentRef]),
        __metadata("design:returntype", void 0)
    ], PageRouterOutlet.prototype, "loadComponentInPage", null);
    PageRouterOutlet = __decorate([
        core_1.Directive({ selector: "page-router-outlet" }) // tslint:disable-line:directive-selector
        ,
        __param(2, core_1.Attribute("name")),
        __param(3, core_1.Attribute("actionBarVisibility")),
        __param(4, core_1.Attribute("isEmptyOutlet")),
        __param(9, core_1.Inject(platform_providers_1.DEVICE)),
        __param(10, core_1.Inject(platform_providers_1.PAGE_FACTORY)),
        __metadata("design:paramtypes", [router_1.ChildrenOutletContexts,
            core_1.ViewContainerRef, String, String, Boolean, ns_location_strategy_1.NSLocationStrategy,
            core_1.ComponentFactoryResolver,
            core_1.ComponentFactoryResolver,
            core_1.ChangeDetectorRef, Object, Function, ns_route_reuse_strategy_1.NSRouteReuseStrategy,
            core_1.ElementRef])
    ], PageRouterOutlet);
    return PageRouterOutlet;
}());
exports.PageRouterOutlet = PageRouterOutlet;
//# sourceMappingURL=page-router-outlet.js.map