var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var trace_1 = require("../trace");
var frame_1 = require("ui/frame");
var lang_facade_1 = require("../lang-facade");
var defaultNavOptions = {
    clearHistory: false,
    animated: true
};
var NSLocationStrategy = (function (_super) {
    __extends(NSLocationStrategy, _super);
    function NSLocationStrategy(frame) {
        _super.call(this);
        this.frame = frame;
        this.states = new Array();
        this.popStateCallbacks = new Array();
        this._isPageNavigationgBack = false;
        trace_1.routerLog("NSLocationStrategy.constructor()");
    }
    NSLocationStrategy.prototype.path = function () {
        var state = this.peekState();
        var result = state ? state.url : "/";
        trace_1.routerLog("NSLocationStrategy.path(): " + result);
        return result;
    };
    NSLocationStrategy.prototype.prepareExternalUrl = function (internal) {
        trace_1.routerLog("NSLocationStrategy.prepareExternalUrl() internal: " + internal);
        return internal;
    };
    NSLocationStrategy.prototype.pushState = function (state, title, url, queryParams) {
        trace_1.routerLog("NSLocationStrategy.pushState state: " +
            (state + ", title: " + title + ", url: " + url + ", queryParams: " + queryParams));
        this.pushStateInternal(state, title, url, queryParams);
    };
    NSLocationStrategy.prototype.pushStateInternal = function (state, title, url, queryParams) {
        var isNewPage = this.states.length === 0;
        this.states.push({
            state: state,
            title: title,
            url: url,
            queryParams: queryParams,
            isPageNavigation: isNewPage
        });
    };
    NSLocationStrategy.prototype.replaceState = function (state, title, url, queryParams) {
        if (this.states.length > 0) {
            trace_1.routerLog("NSLocationStrategy.replaceState changing exisitng state: " +
                (state + ", title: " + title + ", url: " + url + ", queryParams: " + queryParams));
            var topState = this.peekState();
            topState.state = state;
            topState.title = title;
            topState.url = url;
            topState.queryParams = queryParams;
        }
        else {
            trace_1.routerLog("NSLocationStrategy.replaceState pushing new state: " +
                (state + ", title: " + title + ", url: " + url + ", queryParams: " + queryParams));
            this.pushStateInternal(state, title, url, queryParams);
        }
    };
    NSLocationStrategy.prototype.forward = function () {
        throw new Error("NSLocationStrategy.forward() - not implemented");
    };
    NSLocationStrategy.prototype.back = function () {
        if (this._isPageNavigationgBack) {
            // We are navigating to the previous page 
            // clear the stack until we get to a page navigation state
            var state = this.states.pop();
            var count = 1;
            while (!(state.isPageNavigation)) {
                state = this.states.pop();
                count++;
            }
            trace_1.routerLog("NSLocationStrategy.back() while navigating back. States popped: " + count);
            this.callPopState(state, true);
        }
        else {
            var state = this.peekState();
            if (state.isPageNavigation) {
                // This was a page navigation - so navigate through frame.
                trace_1.routerLog("NSLocationStrategy.back() while not navigating back but top" +
                    " state is page - will call frame.goback()");
                this.frame.goBack();
            }
            else {
                // Nested navigation - just pop the state
                trace_1.routerLog("NSLocationStrategy.back() while not navigating back but top" +
                    " state is not page - just pop");
                this.callPopState(this.states.pop(), true);
            }
        }
    };
    NSLocationStrategy.prototype.canGoBack = function () {
        return this.states.length > 1;
    };
    NSLocationStrategy.prototype.onPopState = function (fn) {
        trace_1.routerLog("NSLocationStrategy.onPopState");
        this.popStateCallbacks.push(fn);
    };
    NSLocationStrategy.prototype.getBaseHref = function () {
        trace_1.routerLog("NSLocationStrategy.getBaseHref()");
        return "";
    };
    NSLocationStrategy.prototype.callPopState = function (state, pop) {
        if (pop === void 0) { pop = true; }
        var change = { url: state.url, pop: pop };
        for (var _i = 0, _a = this.popStateCallbacks; _i < _a.length; _i++) {
            var fn = _a[_i];
            fn(change);
        }
    };
    NSLocationStrategy.prototype.peekState = function () {
        if (this.states.length > 0) {
            return this.states[this.states.length - 1];
        }
        return null;
    };
    NSLocationStrategy.prototype.toString = function () {
        return this.states
            .map(function (v, i) { return (i + ".[" + (v.isPageNavigation ? "PAGE" : "INTERNAL") + "] \"" + v.url + "\""); })
            .reverse()
            .join("\n");
    };
    // Methods for syncing with page navigation in PageRouterOutlet
    NSLocationStrategy.prototype._beginBackPageNavigation = function () {
        trace_1.routerLog("NSLocationStrategy.startGoBack()");
        if (this._isPageNavigationgBack) {
            throw new Error("Calling startGoBack while going back.");
        }
        this._isPageNavigationgBack = true;
    };
    NSLocationStrategy.prototype._finishBackPageNavigation = function () {
        trace_1.routerLog("NSLocationStrategy.finishBackPageNavigation()");
        if (!this._isPageNavigationgBack) {
            throw new Error("Calling endGoBack while not going back.");
        }
        this._isPageNavigationgBack = false;
    };
    NSLocationStrategy.prototype._isPageNavigatingBack = function () {
        return this._isPageNavigationgBack;
    };
    NSLocationStrategy.prototype._beginPageNavigation = function () {
        trace_1.routerLog("NSLocationStrategy._beginPageNavigation()");
        var lastState = this.peekState();
        if (lastState) {
            lastState.isPageNavigation = true;
        }
        var navOptions = this._currentNavigationOptions || defaultNavOptions;
        if (navOptions.clearHistory) {
            trace_1.routerLog("NSLocationStrategy._beginPageNavigation clearing states history");
            this.states = [lastState];
        }
        this._currentNavigationOptions = undefined;
        return navOptions;
    };
    NSLocationStrategy.prototype._setNavigationOptions = function (options) {
        this._currentNavigationOptions = {
            clearHistory: lang_facade_1.isPresent(options.clearHistory) ? options.clearHistory : false,
            animated: lang_facade_1.isPresent(options.animated) ? options.animated : true,
            transition: options.transition
        };
        trace_1.routerLog("NSLocationStrategy._setNavigationOptions(" +
            (JSON.stringify(this._currentNavigationOptions) + ")"));
    };
    NSLocationStrategy.prototype._getSatates = function () {
        return this.states.slice();
    };
    NSLocationStrategy = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [frame_1.Frame])
    ], NSLocationStrategy);
    return NSLocationStrategy;
}(common_1.LocationStrategy));
exports.NSLocationStrategy = NSLocationStrategy;
//# sourceMappingURL=ns-location-strategy.js.map