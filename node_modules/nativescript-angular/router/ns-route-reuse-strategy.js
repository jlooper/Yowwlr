Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var trace_1 = require("../trace");
var ns_location_strategy_1 = require("./ns-location-strategy");
var page_router_outlet_1 = require("./page-router-outlet");
/**
 * Detached state cache
 */
var DetachedStateCache = /** @class */ (function () {
    function DetachedStateCache() {
        this.cache = new Array();
    }
    Object.defineProperty(DetachedStateCache.prototype, "length", {
        get: function () {
            return this.cache.length;
        },
        enumerable: true,
        configurable: true
    });
    DetachedStateCache.prototype.push = function (cacheItem) {
        this.cache.push(cacheItem);
    };
    DetachedStateCache.prototype.pop = function () {
        return this.cache.pop();
    };
    DetachedStateCache.prototype.peek = function () {
        return this.cache[this.cache.length - 1];
    };
    DetachedStateCache.prototype.clear = function () {
        if (trace_1.isLogEnabled()) {
            trace_1.routeReuseStrategyLog("DetachedStateCache.clear() " + this.cache.length + " items will be destroyed");
        }
        while (this.cache.length > 0) {
            var state = this.cache.pop().state;
            if (!state.componentRef) {
                throw new Error("No componentRed found in DetachedRouteHandle");
            }
            page_router_outlet_1.destroyComponentRef(state.componentRef);
        }
    };
    DetachedStateCache.prototype.clearModalCache = function () {
        var removedItemsCount = 0;
        var hasModalPages = this.cache.some(function (cacheItem) {
            return cacheItem.isModal;
        });
        if (hasModalPages) {
            var modalCacheCleared = false;
            while (!modalCacheCleared) {
                var cacheItem = this.peek();
                var state = cacheItem.state;
                if (!state.componentRef) {
                    throw new Error("No componentRef found in DetachedRouteHandle");
                }
                page_router_outlet_1.destroyComponentRef(state.componentRef);
                if (cacheItem.isModal) {
                    modalCacheCleared = true;
                }
                this.pop();
                removedItemsCount++;
            }
        }
        if (trace_1.isLogEnabled()) {
            trace_1.routeReuseStrategyLog("DetachedStateCache.clearModalCache() " + removedItemsCount + " items will be destroyed");
        }
    };
    return DetachedStateCache;
}());
/**
 * Detaches subtrees loaded inside PageRouterOutlet in forward navigation
 * and reattaches them on back.
 * Reuses routes as long as their route config is the same.
 */
var NSRouteReuseStrategy = /** @class */ (function () {
    function NSRouteReuseStrategy(location) {
        this.location = location;
        this.cacheByOutlet = {};
    }
    NSRouteReuseStrategy.prototype.shouldDetach = function (route) {
        route = page_router_outlet_1.findTopActivatedRouteNodeForOutlet(route);
        var outletKey = this.location.getRouteFullPath(route);
        var outlet = this.location.findOutletByKey(outletKey);
        var key = getSnapshotKey(route);
        var isPageActivated = route[page_router_outlet_1.pageRouterActivatedSymbol];
        var isBack = outlet ? outlet.isPageNavigationBack : false;
        var shouldDetach = outlet && !isBack && isPageActivated;
        if (outlet) {
            if (outlet.parent && !outlet.parent.shouldDetach) {
                shouldDetach = false;
            }
            outlet.shouldDetach = shouldDetach;
        }
        if (trace_1.isLogEnabled()) {
            trace_1.routeReuseStrategyLog("shouldDetach isBack: " + isBack + " key: " + key + " result: " + shouldDetach);
        }
        return shouldDetach;
    };
    NSRouteReuseStrategy.prototype.shouldAttach = function (route) {
        route = page_router_outlet_1.findTopActivatedRouteNodeForOutlet(route);
        var outletKey = this.location.getRouteFullPath(route);
        var outlet = this.location.findOutletByKey(outletKey);
        var cache = this.cacheByOutlet[outletKey];
        if (!cache) {
            return false;
        }
        var key = getSnapshotKey(route);
        var isBack = outlet ? outlet.isPageNavigationBack : false;
        var shouldAttach = isBack && cache.peek().key === key;
        if (trace_1.isLogEnabled()) {
            trace_1.routeReuseStrategyLog("shouldAttach isBack: " + isBack + " key: " + key + " result: " + shouldAttach);
        }
        if (outlet) {
            outlet.shouldDetach = true;
        }
        return shouldAttach;
    };
    NSRouteReuseStrategy.prototype.store = function (route, state) {
        route = page_router_outlet_1.findTopActivatedRouteNodeForOutlet(route);
        var key = getSnapshotKey(route);
        if (trace_1.isLogEnabled()) {
            trace_1.routeReuseStrategyLog("store key: " + key + ", state: " + state);
        }
        var outletKey = this.location.getRouteFullPath(route);
        // tslint:disable-next-line:max-line-length
        var cache = this.cacheByOutlet[outletKey] = this.cacheByOutlet[outletKey] || new DetachedStateCache();
        if (state) {
            var isModal = false;
            if (this.location._modalNavigationDepth > 0) {
                isModal = true;
            }
            cache.push({ key: key, state: state, isModal: isModal });
        }
        else {
            var topItem = cache.peek();
            if (topItem.key === key) {
                cache.pop();
                if (!cache.length) {
                    delete this.cacheByOutlet[outletKey];
                }
            }
            else {
                throw new Error("Trying to pop from DetachedStateCache but keys don't match. " +
                    ("expected: " + topItem.key + " actual: " + key));
            }
        }
    };
    NSRouteReuseStrategy.prototype.retrieve = function (route) {
        route = page_router_outlet_1.findTopActivatedRouteNodeForOutlet(route);
        var outletKey = this.location.getRouteFullPath(route);
        var outlet = this.location.findOutletByKey(outletKey);
        var cache = this.cacheByOutlet[outletKey];
        if (!cache) {
            return null;
        }
        var key = getSnapshotKey(route);
        var isBack = outlet ? outlet.isPageNavigationBack : false;
        var cachedItem = cache.peek();
        var state = null;
        if (isBack && cachedItem && cachedItem.key === key) {
            state = cachedItem.state;
        }
        if (trace_1.isLogEnabled()) {
            trace_1.routeReuseStrategyLog("retrieved isBack: " + isBack + " key: " + key + " state: " + state);
        }
        return state;
    };
    NSRouteReuseStrategy.prototype.shouldReuseRoute = function (future, curr) {
        var shouldReuse = future.routeConfig === curr.routeConfig;
        if (shouldReuse && curr && curr[page_router_outlet_1.pageRouterActivatedSymbol]) {
            // When reusing route - copy the pageRouterActivated to the new snapshot
            // It's needed in shouldDetach to determine if the route should be detached.
            future[page_router_outlet_1.pageRouterActivatedSymbol] = curr[page_router_outlet_1.pageRouterActivatedSymbol];
        }
        if (trace_1.isLogEnabled()) {
            trace_1.routeReuseStrategyLog("shouldReuseRoute result: " + shouldReuse);
        }
        return shouldReuse;
    };
    NSRouteReuseStrategy.prototype.clearCache = function (outletKey) {
        var cache = this.cacheByOutlet[outletKey];
        if (cache) {
            cache.clear();
        }
    };
    NSRouteReuseStrategy.prototype.clearModalCache = function (outletKey) {
        var cache = this.cacheByOutlet[outletKey];
        if (cache) {
            cache.clearModalCache();
        }
    };
    NSRouteReuseStrategy = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [ns_location_strategy_1.NSLocationStrategy])
    ], NSRouteReuseStrategy);
    return NSRouteReuseStrategy;
}());
exports.NSRouteReuseStrategy = NSRouteReuseStrategy;
function getSnapshotKey(snapshot) {
    return snapshot.pathFromRoot.join("->");
}
//# sourceMappingURL=ns-route-reuse-strategy.js.map