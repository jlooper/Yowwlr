Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var router_1 = require("@angular/router");
var trace_1 = require("../trace");
var lang_facade_1 = require("../lang-facade");
var platform_providers_1 = require("../platform-providers");
var Outlet = /** @class */ (function () {
    function Outlet(outletKey, path, pathByOutlets, modalNavigationDepth) {
        // More than one frame available when using NSEmptyOutletComponent component
        // in module that lazy loads children (loadChildren) and has outlet name.
        this.frames = [];
        this.states = [];
        // Used in reuse-strategy by its children to determine if they should be detached too.
        this.shouldDetach = true;
        this.outletKeys = [outletKey];
        this.isPageNavigationBack = false;
        this.showingModal = false;
        this.modalNavigationDepth = modalNavigationDepth || 0;
        this.pathByOutlets = pathByOutlets;
        this.path = path;
    }
    Outlet.prototype.containsFrame = function (frame) {
        return this.frames.indexOf(frame) > -1;
    };
    Outlet.prototype.peekState = function () {
        if (this.states.length > 0) {
            return this.states[this.states.length - 1];
        }
        return null;
    };
    Outlet.prototype.containsTopState = function (stateUrl) {
        var lastState = this.peekState();
        return lastState && lastState.segmentGroup.toString() === stateUrl;
    };
    // Search for frame that can go back.
    // Nested 'primary' outlets could result in Outlet with multiple navigatable frames.
    Outlet.prototype.getFrameToBack = function () {
        var frame = this.frames[this.frames.length - 1];
        if (!this.isNSEmptyOutlet) {
            for (var index = this.frames.length - 1; index >= 0; index--) {
                var currentFrame = this.frames[index];
                if (currentFrame.canGoBack()) {
                    frame = currentFrame;
                    break;
                }
            }
        }
        return frame;
    };
    return Outlet;
}());
exports.Outlet = Outlet;
var defaultNavOptions = {
    clearHistory: false,
    animated: true
};
var NSLocationStrategy = /** @class */ (function (_super) {
    __extends(NSLocationStrategy, _super);
    function NSLocationStrategy(frameService) {
        var _this = _super.call(this) || this;
        _this.frameService = frameService;
        _this.outlets = [];
        _this.popStateCallbacks = new Array();
        _this._modalNavigationDepth = 0;
        if (trace_1.isLogEnabled()) {
            trace_1.routerLog("NSLocationStrategy.constructor()");
        }
        return _this;
    }
    NSLocationStrategy.prototype.path = function () {
        if (!this.currentUrlTree) {
            return "/";
        }
        var state = this.currentOutlet && this.currentOutlet.peekState();
        if (!state) {
            return "/";
        }
        var tree = this.currentUrlTree;
        var changedOutlet = this.getSegmentGroupByOutlet(this.currentOutlet);
        // Handle case where the user declares a component at path "/".
        // The url serializer doesn't parse this url as having a primary outlet.
        if (state.isRootSegmentGroup) {
            tree.root = state.segmentGroup;
        }
        else if (changedOutlet) {
            this.updateSegmentGroup(tree.root, changedOutlet, state.segmentGroup);
        }
        var urlSerializer = new router_1.DefaultUrlSerializer();
        var url = urlSerializer.serialize(tree);
        if (trace_1.isLogEnabled()) {
            trace_1.routerLog("NSLocationStrategy.path(): " + url);
        }
        return url;
    };
    NSLocationStrategy.prototype.prepareExternalUrl = function (internal) {
        if (trace_1.isLogEnabled()) {
            trace_1.routerLog("NSLocationStrategy.prepareExternalUrl() internal: " + internal);
        }
        return internal;
    };
    NSLocationStrategy.prototype.pushState = function (state, title, url, queryParams) {
        if (trace_1.isLogEnabled()) {
            trace_1.routerLog("NSLocationStrategy.pushState state: " +
                (state + ", title: " + title + ", url: " + url + ", queryParams: " + queryParams));
        }
        this.pushStateInternal(state, title, url, queryParams);
    };
    NSLocationStrategy.prototype.pushStateInternal = function (state, title, url, queryParams) {
        var _this = this;
        var urlSerializer = new router_1.DefaultUrlSerializer();
        this.currentUrlTree = urlSerializer.parse(url);
        var urlTreeRoot = this.currentUrlTree.root;
        // Handle case where the user declares a component at path "/".
        // The url serializer doesn't parse this url as having a primary outlet.
        if (!Object.keys(urlTreeRoot.children).length) {
            var segmentGroup = this.currentUrlTree && this.currentUrlTree.root;
            var outletKey = this.getOutletKey(this.getSegmentGroupFullPath(segmentGroup), "primary");
            var outlet = this.findOutletByKey(outletKey);
            if (outlet && this.updateStates(outlet, segmentGroup)) {
                this.currentOutlet = outlet; // If states updated
            }
            else if (!outlet) {
                var rootOutlet = this.createOutlet("primary", null, segmentGroup, null);
                this.currentOutlet = rootOutlet;
            }
            this.currentOutlet.peekState().isRootSegmentGroup = true;
            return;
        }
        var queue = [];
        var currentTree = urlTreeRoot;
        while (currentTree) {
            Object.keys(currentTree.children).forEach(function (outletName) {
                var currentSegmentGroup = currentTree.children[outletName];
                currentSegmentGroup.outlet = outletName;
                currentSegmentGroup.root = urlTreeRoot;
                var outletPath = _this.getSegmentGroupFullPath(currentTree);
                var outletKey = _this.getOutletKey(outletPath, outletName);
                var outlet = _this.findOutletByKey(outletKey);
                var parentOutletName = currentTree.outlet || "";
                var parentOutletPath = _this.getSegmentGroupFullPath(currentTree.parent);
                var parentOutletKey = _this.getOutletKey(parentOutletPath, parentOutletName);
                var parentOutlet = _this.findOutletByKey(parentOutletKey);
                var containsLastState = outlet && outlet.containsTopState(currentSegmentGroup.toString());
                if (!outlet) {
                    // tslint:disable-next-line:max-line-length
                    outlet = _this.createOutlet(outletKey, outletPath, currentSegmentGroup, parentOutlet, _this._modalNavigationDepth);
                    _this.currentOutlet = outlet;
                }
                else if (_this._modalNavigationDepth > 0 && outlet.showingModal && !containsLastState) {
                    // Navigation inside modal view.
                    _this.upsertModalOutlet(outlet, currentSegmentGroup);
                }
                else {
                    outlet.parent = parentOutlet;
                    if (_this.updateStates(outlet, currentSegmentGroup)) {
                        _this.currentOutlet = outlet; // If states updated
                    }
                }
                queue.push(currentSegmentGroup);
            });
            currentTree = queue.shift();
        }
    };
    NSLocationStrategy.prototype.replaceState = function (state, title, url, queryParams) {
        var states = this.currentOutlet && this.currentOutlet.states;
        if (states && states.length > 0) {
            if (trace_1.isLogEnabled()) {
                trace_1.routerLog("NSLocationStrategy.replaceState changing existing state: " +
                    (state + ", title: " + title + ", url: " + url + ", queryParams: " + queryParams));
            }
        }
        else {
            if (trace_1.isLogEnabled()) {
                trace_1.routerLog("NSLocationStrategy.replaceState pushing new state: " +
                    (state + ", title: " + title + ", url: " + url + ", queryParams: " + queryParams));
            }
            this.pushStateInternal(state, title, url, queryParams);
        }
    };
    NSLocationStrategy.prototype.forward = function () {
        throw new Error("NSLocationStrategy.forward() - not implemented");
    };
    NSLocationStrategy.prototype.back = function (outlet) {
        this.currentOutlet = outlet || this.currentOutlet;
        if (this.currentOutlet.isPageNavigationBack) {
            var states = this.currentOutlet.states;
            // We are navigating to the previous page
            // clear the stack until we get to a page navigation state
            var state = states.pop();
            var count = 1;
            while (!state.isPageNavigation) {
                state = states.pop();
                count++;
            }
            if (trace_1.isLogEnabled()) {
                trace_1.routerLog("NSLocationStrategy.back() while navigating back. States popped: " + count);
            }
            this.callPopState(state, true);
        }
        else {
            var state = this.currentOutlet.peekState();
            if (state && state.isPageNavigation) {
                // This was a page navigation - so navigate through frame.
                if (trace_1.isLogEnabled()) {
                    trace_1.routerLog("NSLocationStrategy.back() while not navigating back but top" +
                        " state is page - will call frame.goBack()");
                }
                if (!outlet) {
                    var topmostFrame = this.frameService.getFrame();
                    this.currentOutlet = this.getOutletByFrame(topmostFrame);
                }
                this.currentOutlet.getFrameToBack().goBack();
            }
            else {
                // Nested navigation - just pop the state
                if (trace_1.isLogEnabled()) {
                    trace_1.routerLog("NSLocationStrategy.back() while not navigating back but top" +
                        " state is not page - just pop");
                }
                this.callPopState(this.currentOutlet.states.pop(), true);
            }
        }
    };
    NSLocationStrategy.prototype.canGoBack = function (outlet) {
        outlet = outlet || this.currentOutlet;
        return outlet.states.length > 1;
    };
    NSLocationStrategy.prototype.onPopState = function (fn) {
        if (trace_1.isLogEnabled()) {
            trace_1.routerLog("NSLocationStrategy.onPopState");
        }
        this.popStateCallbacks.push(fn);
    };
    NSLocationStrategy.prototype.getBaseHref = function () {
        if (trace_1.isLogEnabled()) {
            trace_1.routerLog("NSLocationStrategy.getBaseHref()");
        }
        return "";
    };
    NSLocationStrategy.prototype.callPopState = function (state, pop, outlet) {
        if (pop === void 0) { pop = true; }
        outlet = outlet || this.currentOutlet;
        var urlSerializer = new router_1.DefaultUrlSerializer();
        var changedOutlet = this.getSegmentGroupByOutlet(outlet);
        if (state && changedOutlet) {
            this.updateSegmentGroup(this.currentUrlTree.root, changedOutlet, state.segmentGroup);
        }
        else if (changedOutlet) {
            // when closing modal view there are scenarios (e.g. root viewContainerRef) when we need
            // to clean up the named page router outlet to make sure we will open the modal properly again if needed.
            this.updateSegmentGroup(this.currentUrlTree.root, changedOutlet, null);
        }
        var url = urlSerializer.serialize(this.currentUrlTree);
        var change = { url: url, pop: pop };
        for (var _i = 0, _a = this.popStateCallbacks; _i < _a.length; _i++) {
            var fn = _a[_i];
            fn(change);
        }
    };
    NSLocationStrategy.prototype.toString = function () {
        var result = [];
        this.outlets.forEach(function (outlet) {
            var outletStates = outlet.states;
            var outletLog = outletStates
                // tslint:disable-next-line:max-line-length
                .map(function (v, i) { return outlet.outletKeys + "." + i + ".[" + (v.isPageNavigation ? "PAGE" : "INTERNAL") + "].[" + (outlet.modalNavigationDepth ? "MODAL" : "BASE") + "] \"" + v.segmentGroup.toString() + "\""; })
                .reverse();
            result = result.concat(outletLog);
        });
        return result.join("\n");
    };
    // Methods for syncing with page navigation in PageRouterOutlet
    NSLocationStrategy.prototype._beginBackPageNavigation = function (frame) {
        var outlet = this.getOutletByFrame(frame);
        if (!outlet || outlet.isPageNavigationBack) {
            if (trace_1.isLogEnabled()) {
                trace_1.routerError("Attempted to call startGoBack while going back.");
            }
            return;
        }
        if (trace_1.isLogEnabled()) {
            trace_1.routerLog("NSLocationStrategy.startGoBack()");
        }
        outlet.isPageNavigationBack = true;
        this.currentOutlet = outlet;
    };
    NSLocationStrategy.prototype._finishBackPageNavigation = function (frame) {
        var outlet = this.getOutletByFrame(frame);
        if (!outlet || !outlet.isPageNavigationBack) {
            if (trace_1.isLogEnabled()) {
                trace_1.routerError("Attempted to call endGoBack while not going back.");
            }
            return;
        }
        if (trace_1.isLogEnabled()) {
            trace_1.routerLog("NSLocationStrategy.finishBackPageNavigation()");
        }
        outlet.isPageNavigationBack = false;
    };
    NSLocationStrategy.prototype._beginModalNavigation = function (frame) {
        if (trace_1.isLogEnabled()) {
            trace_1.routerLog("NSLocationStrategy._beginModalNavigation()");
        }
        this.currentOutlet = this.getOutletByFrame(frame);
        // It is possible to have frame, but not corresponding Outlet, if
        // showing modal dialog on app.component.ts ngOnInit() e.g.
        if (this.currentOutlet) {
            this.currentOutlet.showingModal = true;
            this._modalNavigationDepth++;
        }
    };
    NSLocationStrategy.prototype._closeModalNavigation = function () {
        if (trace_1.isLogEnabled()) {
            trace_1.routerLog("NSLocationStrategy.closeModalNavigation()");
        }
        if (this._modalNavigationDepth > 0) {
            this._modalNavigationDepth--;
        }
        // currentOutlet should be the one that corresponds to the topmost() frame
        var topmostOutlet = this.getOutletByFrame(this.frameService.getFrame());
        this.currentOutlet = this.findOutletByModal(this._modalNavigationDepth, true) || topmostOutlet;
        if (this.currentOutlet) {
            this.currentOutlet.showingModal = false;
            this.callPopState(this.currentOutlet.peekState(), false);
        }
    };
    NSLocationStrategy.prototype._beginPageNavigation = function (frame) {
        if (trace_1.isLogEnabled()) {
            trace_1.routerLog("NSLocationStrategy._beginPageNavigation()");
        }
        this.currentOutlet = this.getOutletByFrame(frame);
        var lastState = this.currentOutlet.peekState();
        if (lastState) {
            lastState.isPageNavigation = true;
        }
        var navOptions = this._currentNavigationOptions || defaultNavOptions;
        if (navOptions.clearHistory) {
            if (trace_1.isLogEnabled()) {
                trace_1.routerLog("NSLocationStrategy._beginPageNavigation clearing states history");
            }
            this.currentOutlet.states = [lastState];
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
        if (trace_1.isLogEnabled()) {
            trace_1.routerLog("NSLocationStrategy._setNavigationOptions(" +
                (JSON.stringify(this._currentNavigationOptions) + ")"));
        }
    };
    NSLocationStrategy.prototype._getOutlets = function () {
        return this.outlets;
    };
    NSLocationStrategy.prototype.updateOutletFrame = function (outlet, frame) {
        if (!outlet.containsFrame(frame)) {
            outlet.frames.push(frame);
        }
        this.currentOutlet = outlet;
    };
    NSLocationStrategy.prototype.clearOutlet = function (frame) {
        var _this = this;
        this.outlets = this.outlets.filter(function (currentOutlet) {
            var isEqualToCurrent;
            if (_this.currentOutlet) {
                isEqualToCurrent = currentOutlet.pathByOutlets === _this.currentOutlet.pathByOutlets;
            }
            // Remove outlet from the url tree.
            if (currentOutlet.containsFrame(frame) && !isEqualToCurrent) {
                _this.callPopState(null, true, currentOutlet);
            }
            if (!currentOutlet.isNSEmptyOutlet) {
                currentOutlet.frames = currentOutlet.frames.filter(function (currentFrame) { return currentFrame !== frame; });
                return currentOutlet.frames.length;
            }
            return !currentOutlet.containsFrame(frame);
        });
    };
    NSLocationStrategy.prototype.getSegmentGroupFullPath = function (segmentGroup) {
        var fullPath = "";
        while (segmentGroup) {
            var url = segmentGroup.toString();
            if (fullPath) {
                fullPath = (url ? url + "/" : "") + fullPath;
            }
            else {
                fullPath = url;
            }
            segmentGroup = segmentGroup.parent;
        }
        return fullPath;
    };
    NSLocationStrategy.prototype.getRouteFullPath = function (currentRoute) {
        var outletName = currentRoute.outlet;
        var fullPath;
        currentRoute = currentRoute.parent;
        while (currentRoute) {
            var urls = (currentRoute.url.value || currentRoute.url);
            var url = urls;
            if (Array.isArray(urls)) {
                url = url.join("/");
            }
            fullPath = fullPath ? (url ? url + "/" : url) + fullPath : url;
            currentRoute = currentRoute.parent;
        }
        return fullPath ? fullPath + "-" + outletName : outletName;
    };
    NSLocationStrategy.prototype.getPathByOutlets = function (urlSegmentGroup) {
        if (!urlSegmentGroup) {
            return "";
        }
        var pathToOutlet;
        var lastPath = urlSegmentGroup.outlet || "primary";
        var parent = urlSegmentGroup.parent;
        while (parent && urlSegmentGroup.root !== parent) {
            if (parent && parent.outlet !== lastPath) {
                if (lastPath === "primary") {
                    lastPath = parent.outlet;
                }
                else {
                    lastPath = parent.outlet;
                    pathToOutlet = lastPath + "-" + (pathToOutlet || urlSegmentGroup.outlet);
                }
            }
            parent = parent.parent;
        }
        return pathToOutlet || lastPath;
    };
    NSLocationStrategy.prototype.findOutletByModal = function (modalNavigation, isShowingModal) {
        return this.outlets.find(function (outlet) {
            var isEqual = outlet.modalNavigationDepth === modalNavigation;
            return isShowingModal ? isEqual && outlet.showingModal : isEqual;
        });
    };
    NSLocationStrategy.prototype.findOutletByOutletPath = function (pathByOutlets) {
        return this.outlets.find(function (outlet) { return outlet.pathByOutlets === pathByOutlets; });
    };
    NSLocationStrategy.prototype.findOutletByKey = function (outletKey) {
        return this.outlets.find(function (outlet) { return outlet.outletKeys.indexOf(outletKey) > -1; });
    };
    NSLocationStrategy.prototype.getOutletByFrame = function (frame) {
        var outlet;
        for (var index = 0; index < this.outlets.length; index++) {
            var currentOutlet = this.outlets[index];
            if (currentOutlet.containsFrame(frame)) {
                outlet = currentOutlet;
                break;
            }
        }
        return outlet;
    };
    NSLocationStrategy.prototype.updateStates = function (outlet, currentSegmentGroup) {
        var isNewPage = outlet.states.length === 0;
        var lastState = outlet.states[outlet.states.length - 1];
        var equalStateUrls = outlet.containsTopState(currentSegmentGroup.toString());
        var locationState = {
            segmentGroup: currentSegmentGroup,
            isRootSegmentGroup: false,
            isPageNavigation: isNewPage
        };
        if (!lastState || !equalStateUrls) {
            outlet.states.push(locationState);
            // Update last state segmentGroup of parent Outlet.
            if (this._modalNavigationDepth === 0 && !outlet.showingModal) {
                this.updateParentsStates(outlet, currentSegmentGroup.parent);
            }
            return true;
        }
        return false;
    };
    NSLocationStrategy.prototype.updateParentsStates = function (outlet, newSegmentGroup) {
        var parentOutlet = outlet.parent;
        // Update parents lastState segmentGroups
        while (parentOutlet && newSegmentGroup) {
            var state = parentOutlet.peekState();
            if (state) {
                state.segmentGroup = newSegmentGroup;
                newSegmentGroup = newSegmentGroup.parent;
                parentOutlet = parentOutlet.parent;
            }
        }
    };
    // tslint:disable-next-line:max-line-length
    NSLocationStrategy.prototype.createOutlet = function (outletKey, path, segmentGroup, parent, modalNavigation) {
        var pathByOutlets = this.getPathByOutlets(segmentGroup);
        var newOutlet = new Outlet(outletKey, path, pathByOutlets, modalNavigation);
        var locationState = {
            segmentGroup: segmentGroup,
            isRootSegmentGroup: false,
            isPageNavigation: true // It is a new OutletNode.
        };
        newOutlet.states = [locationState];
        newOutlet.parent = parent;
        this.outlets.push(newOutlet);
        // Update last state segmentGroup of parent Outlet.
        if (this._modalNavigationDepth === 0 && !newOutlet.showingModal) {
            this.updateParentsStates(newOutlet, segmentGroup.parent);
        }
        return newOutlet;
    };
    NSLocationStrategy.prototype.getSegmentGroupByOutlet = function (outlet) {
        var pathList = outlet.pathByOutlets.split("-");
        var segmentGroup = this.currentUrlTree.root;
        var pathToOutlet;
        for (var index = 0; index < pathList.length; index++) {
            var currentPath = pathList[index];
            var childrenCount = Object.keys(segmentGroup.children).length;
            if (childrenCount && segmentGroup.children[currentPath]) {
                var url = segmentGroup.toString();
                pathToOutlet = pathToOutlet ? pathToOutlet + "/" + url : url;
                segmentGroup = segmentGroup.children[currentPath];
            }
            else {
                // If no child outlet found with the given name - forget about all previously found outlets.
                // example: seaching for 'primary-second-primary' shouldn't return 'primary-second'
                // if no 'primary' child available on 'second'.
                segmentGroup = null;
                break;
            }
        }
        // Paths should also match since there could be another Outlet
        // with the same pathByOutlets but different url path.
        if (segmentGroup && outlet.path && pathToOutlet && outlet.path !== pathToOutlet) {
            segmentGroup = null;
        }
        return segmentGroup;
    };
    // Traversal and replacement of segmentGroup.
    NSLocationStrategy.prototype.updateSegmentGroup = function (rootNode, oldSegmentGroup, newSegmentGroup) {
        var queue = [];
        var currentTree = rootNode;
        while (currentTree) {
            Object.keys(currentTree.children).forEach(function (outletName) {
                if (currentTree.children[outletName] === oldSegmentGroup) {
                    if (newSegmentGroup) {
                        currentTree.children[outletName] = newSegmentGroup;
                    }
                    else {
                        delete currentTree.children[outletName];
                    }
                }
                queue.push(currentTree.children[outletName]);
            });
            currentTree = queue.shift();
        }
    };
    NSLocationStrategy.prototype.upsertModalOutlet = function (parentOutlet, segmentedGroup) {
        var currentModalOutlet = this.findOutletByModal(this._modalNavigationDepth);
        // We want to treat every p-r-o as a standalone Outlet.
        if (!currentModalOutlet) {
            if (this._modalNavigationDepth > 1) {
                // The parent of the current Outlet should be the previous opened modal (if any).
                parentOutlet = this.findOutletByModal(this._modalNavigationDepth - 1);
            }
            // No currentModalOutlet available when opening 'primary' p-r-o.
            var outletName = "primary";
            var outletPath = parentOutlet.peekState().segmentGroup.toString();
            var outletKey = this.getOutletKey(outletPath, outletName);
            // tslint:disable-next-line:max-line-length
            currentModalOutlet = this.createOutlet(outletKey, outletPath, segmentedGroup, parentOutlet, this._modalNavigationDepth);
            this.currentOutlet = currentModalOutlet;
        }
        else if (this.updateStates(currentModalOutlet, segmentedGroup)) {
            this.currentOutlet = currentModalOutlet; // If states updated
        }
    };
    NSLocationStrategy.prototype.getOutletKey = function (path, outletName) {
        return path ? path + "-" + outletName : outletName;
    };
    NSLocationStrategy = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [platform_providers_1.FrameService])
    ], NSLocationStrategy);
    return NSLocationStrategy;
}(common_1.LocationStrategy));
exports.NSLocationStrategy = NSLocationStrategy;
//# sourceMappingURL=ns-location-strategy.js.map