Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ns_location_strategy_1 = require("../router/ns-location-strategy");
var app_host_view_1 = require("../app-host-view");
var detached_loader_1 = require("../common/detached-loader");
var platform_providers_1 = require("../platform-providers");
var utils_1 = require("../common/utils");
var frame_1 = require("tns-core-modules/ui/frame");
var ModalDialogParams = /** @class */ (function () {
    function ModalDialogParams(context, closeCallback) {
        if (context === void 0) { context = {}; }
        this.context = context;
        this.closeCallback = closeCallback;
    }
    return ModalDialogParams;
}());
exports.ModalDialogParams = ModalDialogParams;
var ModalDialogService = /** @class */ (function () {
    function ModalDialogService(location) {
        this.location = location;
    }
    ModalDialogService.prototype.showModal = function (type, _a) {
        var _this = this;
        var viewContainerRef = _a.viewContainerRef, moduleRef = _a.moduleRef, context = _a.context, fullscreen = _a.fullscreen, animated = _a.animated, stretched = _a.stretched;
        if (!viewContainerRef) {
            throw new Error("No viewContainerRef: " +
                "Make sure you pass viewContainerRef in ModalDialogOptions.");
        }
        var parentView = viewContainerRef.element.nativeElement;
        if (parentView instanceof app_host_view_1.AppHostView && parentView.ngAppRoot) {
            parentView = parentView.ngAppRoot;
        }
        // _ngDialogRoot is the first child of the previously detached proxy.
        // It should have 'viewController' (iOS) or '_dialogFragment' (Android) available for
        // presenting future modal views.
        if (parentView._ngDialogRoot) {
            parentView = parentView._ngDialogRoot;
        }
        var pageFactory = viewContainerRef.injector.get(platform_providers_1.PAGE_FACTORY);
        // resolve from particular module (moduleRef)
        // or from same module as parentView (viewContainerRef)
        var componentContainer = moduleRef || viewContainerRef;
        var resolver = componentContainer.injector.get(core_1.ComponentFactoryResolver);
        var frame = parentView;
        if (!(parentView instanceof frame_1.Frame)) {
            frame = (parentView.page && parentView.page.frame) || frame_1.topmost();
        }
        if (frame) {
            this.location._beginModalNavigation(frame);
        }
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                try {
                    _this._showDialog({
                        containerRef: viewContainerRef,
                        context: context,
                        doneCallback: resolve,
                        fullscreen: fullscreen,
                        animated: animated,
                        stretched: stretched,
                        pageFactory: pageFactory,
                        parentView: parentView,
                        resolver: resolver,
                        type: type,
                    });
                }
                catch (err) {
                    reject(err);
                }
            }, 10);
        });
    };
    ModalDialogService.prototype._showDialog = function (_a) {
        var _this = this;
        var containerRef = _a.containerRef, context = _a.context, doneCallback = _a.doneCallback, fullscreen = _a.fullscreen, animated = _a.animated, stretched = _a.stretched, pageFactory = _a.pageFactory, parentView = _a.parentView, resolver = _a.resolver, type = _a.type;
        var componentView;
        var detachedLoaderRef;
        var closeCallback = utils_1.once(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            doneCallback.apply(undefined, args);
            if (componentView) {
                componentView.closeModal();
                _this.location._closeModalNavigation();
                detachedLoaderRef.instance.detectChanges();
                detachedLoaderRef.destroy();
            }
        });
        var modalParams = new ModalDialogParams(context, closeCallback);
        var providers = core_1.ReflectiveInjector.resolve([
            { provide: ModalDialogParams, useValue: modalParams },
        ]);
        var childInjector = core_1.ReflectiveInjector.fromResolvedProviders(providers, containerRef.parentInjector);
        var detachedFactory = resolver.resolveComponentFactory(detached_loader_1.DetachedLoader);
        detachedLoaderRef = containerRef.createComponent(detachedFactory, -1, childInjector, null);
        detachedLoaderRef.instance.loadComponent(type).then(function (compRef) {
            var detachedProxy = compRef.location.nativeElement;
            if (detachedProxy.getChildrenCount() > 1) {
                throw new Error("Modal content has more than one root view.");
            }
            componentView = detachedProxy.getChildAt(0);
            if (componentView.parent) {
                componentView.parent._ngDialogRoot = componentView;
                componentView.parent.removeChild(componentView);
            }
            // TODO: remove <any> cast after https://github.com/NativeScript/NativeScript/pull/5734
            // is in a published version of tns-core-modules.
            parentView.showModal(componentView, context, closeCallback, fullscreen, animated, stretched);
        });
    };
    ModalDialogService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [ns_location_strategy_1.NSLocationStrategy])
    ], ModalDialogService);
    return ModalDialogService;
}());
exports.ModalDialogService = ModalDialogService;
var ModalDialogHost = /** @class */ (function () {
    function ModalDialogHost() {
        throw new Error("ModalDialogHost is deprecated. " +
            "Call ModalDialogService.showModal() " +
            "by passing ViewContainerRef in the options instead.");
    }
    ModalDialogHost = __decorate([
        core_1.Directive({
            selector: "[modal-dialog-host]" // tslint:disable-line:directive-selector
        }),
        __metadata("design:paramtypes", [])
    ], ModalDialogHost);
    return ModalDialogHost;
}());
exports.ModalDialogHost = ModalDialogHost;
//# sourceMappingURL=dialogs.js.map