Object.defineProperty(exports, "__esModule", { value: true });
require("./ts-helpers");
global.moduleMerge = function (sourceExports, destExports) {
    for (var key in sourceExports) {
        destExports[key] = sourceExports[key];
    }
};
var modules = new Map();
global.moduleResolvers = [global.require];
global.registerModule = function (name, loader) {
    modules.set(name, loader);
};
var defaultExtensionMap = { ".js": ".js", ".ts": ".js", ".css": ".css", ".scss": ".css", ".xml": ".xml", ".less": ".css", ".sass": ".css" };
global.registerWebpackModules = function registerWebpackModules(context, extensionMap) {
    if (extensionMap === void 0) { extensionMap = {}; }
    context.keys().forEach(function (key) {
        var extDotIndex = key.lastIndexOf(".");
        var base = key.substr(0, extDotIndex);
        var originalExt = key.substr(extDotIndex);
        var registerExt = extensionMap[originalExt] || defaultExtensionMap[originalExt] || originalExt;
        var isSourceFile = originalExt !== registerExt;
        var registerName = base + registerExt;
        if (registerName.startsWith("./") && registerName.endsWith(".js")) {
            var jsNickNames = [
                registerName.substr(2, registerName.length - 5),
                registerName.substr(0, registerName.length - 3),
                registerName.substr(2),
            ];
            jsNickNames.forEach(function (jsNickName) {
                if (isSourceFile || !global.moduleExists(jsNickName)) {
                    global.registerModule(jsNickName, function () { return context(key); });
                }
            });
        }
        if (isSourceFile || !global.moduleExists(registerName)) {
            global.registerModule(registerName, function () { return context(key); });
        }
    });
};
global.moduleExists = function (name) {
    return modules.has(name);
};
global.loadModule = function (name) {
    var loader = modules.get(name);
    if (loader) {
        return loader();
    }
    var _loop_1 = function (resolver) {
        var result = resolver(name);
        if (result) {
            modules.set(name, function () { return result; });
            return { value: result };
        }
    };
    for (var _i = 0, _a = global.moduleResolvers; _i < _a.length; _i++) {
        var resolver = _a[_i];
        var state_1 = _loop_1(resolver);
        if (typeof state_1 === "object")
            return state_1.value;
    }
};
global.zonedCallback = function (callback) {
    if (global.zone) {
        return global.zone.bind(callback);
    }
    if (global.Zone) {
        return global.Zone.current.wrap(callback);
    }
    else {
        return callback;
    }
};
global.registerModule("timer", function () { return require("timer"); });
global.registerModule("ui/dialogs", function () { return require("ui/dialogs"); });
global.registerModule("xhr", function () { return require("xhr"); });
global.registerModule("fetch", function () { return require("fetch"); });
global.System = {
    import: function (path) {
        return new Promise(function (resolve, reject) {
            try {
                resolve(global.require(path));
            }
            catch (e) {
                reject(e);
            }
        });
    }
};
function registerOnGlobalContext(name, module) {
    Object.defineProperty(global, name, {
        get: function () {
            var m = global.loadModule(module);
            var resolvedValue = m[name];
            Object.defineProperty(this, name, { value: resolvedValue, configurable: true, writable: true });
            return resolvedValue;
        },
        configurable: true
    });
}
var snapshotGlobals;
function install() {
    if (global.__snapshot || global.__snapshotEnabled) {
        if (!snapshotGlobals) {
            var timer = require("timer");
            var dialogs = require("ui/dialogs");
            var xhr = require("xhr");
            var fetch = require("fetch");
            snapshotGlobals = snapshotGlobals || {
                setTimeout: timer.setTimeout,
                clearTimeout: timer.clearTimeout,
                setInterval: timer.setInterval,
                clearInterval: timer.clearInterval,
                alert: dialogs.alert,
                confirm: dialogs.confirm,
                prompt: dialogs.prompt,
                login: dialogs.login,
                action: dialogs.action,
                XMLHttpRequest: xhr.XMLHttpRequest,
                FormData: xhr.FormData,
                fetch: fetch.fetch,
                Headers: fetch.Headers,
                Request: fetch.Request,
                Response: fetch.Response,
            };
        }
        var consoleModule = require("console").Console;
        global.console = global.console || new consoleModule();
        Object.assign(global, snapshotGlobals);
    }
    else {
        registerOnGlobalContext("setTimeout", "timer");
        registerOnGlobalContext("clearTimeout", "timer");
        registerOnGlobalContext("setInterval", "timer");
        registerOnGlobalContext("clearInterval", "timer");
        registerOnGlobalContext("alert", "ui/dialogs");
        registerOnGlobalContext("confirm", "ui/dialogs");
        registerOnGlobalContext("prompt", "ui/dialogs");
        registerOnGlobalContext("login", "ui/dialogs");
        registerOnGlobalContext("action", "ui/dialogs");
        registerOnGlobalContext("XMLHttpRequest", "xhr");
        registerOnGlobalContext("FormData", "xhr");
        registerOnGlobalContext("fetch", "fetch");
        registerOnGlobalContext("Headers", "fetch");
        registerOnGlobalContext("Request", "fetch");
        registerOnGlobalContext("Response", "fetch");
    }
}
exports.install = install;
install();
function Deprecated(target, key, descriptor) {
    if (descriptor) {
        var originalMethod = descriptor.value;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            console.log(key.toString() + " is deprecated");
            return originalMethod.apply(this, args);
        };
        return descriptor;
    }
    else {
        console.log((target && target.name || target) + " is deprecated");
        return target;
    }
}
exports.Deprecated = Deprecated;
global.Deprecated = Deprecated;
function Experimental(target, key, descriptor) {
    if (descriptor) {
        var originalMethod = descriptor.value;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            console.log(key.toString() + " is experimental");
            return originalMethod.apply(this, args);
        };
        return descriptor;
    }
    else {
        console.log((target && target.name || target) + " is experimental");
        return target;
    }
}
exports.Experimental = Experimental;
global.Experimental = Experimental;
//# sourceMappingURL=globals.js.map