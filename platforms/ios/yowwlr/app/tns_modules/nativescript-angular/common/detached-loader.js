var core_1 = require("@angular/core");
var trace = require("trace");
exports.CATEGORY = "detached-loader";
function log(message) {
    trace.write(message, exports.CATEGORY);
}
/**
 * Wrapper component used for loading components when navigating
 * It uses DetachedContainer as selector so that it is containerRef is not attached to
 * the visual tree.
 */
var DetachedLoader = (function () {
    function DetachedLoader(resolver, changeDetector, containerRef) {
        this.resolver = resolver;
        this.changeDetector = changeDetector;
        this.containerRef = containerRef;
    }
    DetachedLoader.prototype.loadInLocation = function (componentType) {
        var factory = this.resolver.resolveComponentFactory(componentType);
        var componentRef = this.containerRef.createComponent(factory, this.containerRef.length, this.containerRef.parentInjector);
        // Component is created, buit may not be checked if we are loading
        // inside component with OnPush CD strategy. Mark us for check to be sure CD will reach us.
        // We are inside a promise here so no need for setTimeout - CD should trigger
        // after the promise.
        log("DetachedLoader.loadInLocation component loaded -> markForCheck");
        this.changeDetector.markForCheck();
        return Promise.resolve(componentRef);
    };
    DetachedLoader.prototype.detectChanges = function () {
        this.changeDetector.markForCheck();
    };
    // TODO: change this API -- async promises not needed here anymore.
    DetachedLoader.prototype.loadComponent = function (componentType) {
        log("DetachedLoader.loadComponent");
        return this.loadInLocation(componentType);
    };
    DetachedLoader.prototype.loadWithFactory = function (factory) {
        return this.containerRef.createComponent(factory, this.containerRef.length, this.containerRef.parentInjector, null);
    };
    DetachedLoader = __decorate([
        core_1.Component({
            selector: "DetachedContainer",
            template: "<Placeholder #loader></Placeholder>"
        }), 
        __metadata('design:paramtypes', [core_1.ComponentFactoryResolver, core_1.ChangeDetectorRef, core_1.ViewContainerRef])
    ], DetachedLoader);
    return DetachedLoader;
}());
exports.DetachedLoader = DetachedLoader;
//# sourceMappingURL=detached-loader.js.map