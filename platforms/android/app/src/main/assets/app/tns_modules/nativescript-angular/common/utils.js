Object.defineProperty(exports, "__esModule", { value: true });
function throwIfAlreadyLoaded(parentModule, moduleName) {
    if (parentModule) {
        throw new Error(moduleName + " has already been loaded. Import " + moduleName + " in the AppModule only.");
    }
}
exports.throwIfAlreadyLoaded = throwIfAlreadyLoaded;
function once(fn) {
    var wasCalled = false;
    return function wrapper() {
        if (wasCalled) {
            return;
        }
        wasCalled = true;
        fn.apply(null, arguments);
    };
}
exports.once = once;
//# sourceMappingURL=utils.js.map