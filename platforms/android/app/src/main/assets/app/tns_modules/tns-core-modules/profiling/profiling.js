Object.defineProperty(exports, "__esModule", { value: true });
function uptime() {
    return global.android ? org.nativescript.Process.getUpTime() : global.__tns_uptime();
}
exports.uptime = uptime;
function log(message) {
    if (global.__nslog) {
        global.__nslog("CONSOLE LOG: " + message);
    }
    console.log(message);
}
exports.log = log;
var timers = {};
var anyGlobal = global;
var profileNames = [];
exports.time = global.__time || Date.now;
function start(name) {
    var info = timers[name];
    if (info) {
        info.currentStart = exports.time();
        info.runCount++;
    }
    else {
        info = {
            totalTime: 0,
            count: 0,
            currentStart: exports.time(),
            runCount: 1
        };
        timers[name] = info;
        profileNames.push(name);
    }
}
exports.start = start;
function stop(name) {
    var info = timers[name];
    if (!info) {
        throw new Error("No timer started: " + name);
    }
    if (info.runCount) {
        info.runCount--;
        if (info.runCount) {
            info.count++;
        }
        else {
            info.lastTime = exports.time() - info.currentStart;
            info.totalTime += info.lastTime;
            info.count++;
            info.currentStart = 0;
        }
    }
    else {
        throw new Error("Timer " + name + " paused more times than started.");
    }
    return info;
}
exports.stop = stop;
function timer(name) {
    return timers[name];
}
exports.timer = timer;
function print(name) {
    var info = timers[name];
    if (!info) {
        throw new Error("No timer started: " + name);
    }
    console.log("---- [" + name + "] STOP total: " + info.totalTime + " count:" + info.count);
    return info;
}
exports.print = print;
function isRunning(name) {
    var info = timers[name];
    return !!(info && info.runCount);
}
exports.isRunning = isRunning;
function countersProfileFunctionFactory(fn, name, type) {
    if (type === void 0) { type = 1; }
    profileNames.push(name);
    return function () {
        start(name);
        try {
            return fn.apply(this, arguments);
        }
        finally {
            stop(name);
        }
    };
}
function timelineProfileFunctionFactory(fn, name, type) {
    if (type === void 0) { type = 1; }
    return type === 1 ? function () {
        var start = exports.time();
        try {
            return fn.apply(this, arguments);
        }
        finally {
            var end = exports.time();
            console.log("Timeline: Modules: " + name + " " + this + "  (" + start + "ms. - " + end + "ms.)");
        }
    } : function () {
        var start = exports.time();
        try {
            return fn.apply(this, arguments);
        }
        finally {
            var end = exports.time();
            console.log("Timeline: Modules: " + name + "  (" + start + "ms. - " + end + "ms.)");
        }
    };
}
var Level;
(function (Level) {
    Level[Level["none"] = 0] = "none";
    Level[Level["lifecycle"] = 1] = "lifecycle";
    Level[Level["timeline"] = 2] = "timeline";
})(Level = exports.Level || (exports.Level = {}));
var tracingLevel = Level.none;
var profileFunctionFactory;
function enable(mode) {
    if (mode === void 0) { mode = "counters"; }
    profileFunctionFactory = mode && {
        counters: countersProfileFunctionFactory,
        timeline: timelineProfileFunctionFactory
    }[mode];
    tracingLevel = {
        lifecycle: Level.lifecycle,
        timeline: Level.timeline,
    }[mode] || Level.none;
}
exports.enable = enable;
try {
    var appConfig = require("~/package.json");
    if (appConfig && appConfig.profiling) {
        enable(appConfig.profiling);
    }
}
catch (e1) {
    try {
        console.log("Profiling startup failed to figure out defaults from package.json, error: " + e1);
    }
    catch (e2) {
    }
}
function disable() {
    profileFunctionFactory = undefined;
}
exports.disable = disable;
function profileFunction(fn, customName) {
    return profileFunctionFactory(fn, customName || fn.name);
}
var profileMethodUnnamed = function (target, key, descriptor) {
    if (descriptor === undefined) {
        descriptor = Object.getOwnPropertyDescriptor(target, key);
    }
    var originalMethod = descriptor.value;
    var className = "";
    if (target && target.constructor && target.constructor.name) {
        className = target.constructor.name + ".";
    }
    var name = className + key;
    descriptor.value = profileFunctionFactory(originalMethod, name, 1);
    return descriptor;
};
var profileStaticMethodUnnamed = function (ctor, key, descriptor) {
    if (descriptor === undefined) {
        descriptor = Object.getOwnPropertyDescriptor(ctor, key);
    }
    var originalMethod = descriptor.value;
    var className = "";
    if (ctor && ctor.name) {
        className = ctor.name + ".";
    }
    var name = className + key;
    descriptor.value = profileFunctionFactory(originalMethod, name, 0);
    return descriptor;
};
function profileMethodNamed(name) {
    return function (target, key, descriptor) {
        if (descriptor === undefined) {
            descriptor = Object.getOwnPropertyDescriptor(target, key);
        }
        var originalMethod = descriptor.value;
        descriptor.value = profileFunctionFactory(originalMethod, name);
        return descriptor;
    };
}
var voidMethodDecorator = function () {
};
function profile(nameFnOrTarget, fnOrKey, descriptor) {
    if (typeof nameFnOrTarget === "object" && (typeof fnOrKey === "string" || typeof fnOrKey === "symbol")) {
        if (!profileFunctionFactory) {
            return;
        }
        return profileMethodUnnamed(nameFnOrTarget, fnOrKey, descriptor);
    }
    else if (typeof nameFnOrTarget === "function" && (typeof fnOrKey === "string" || typeof fnOrKey === "symbol")) {
        if (!profileFunctionFactory) {
            return;
        }
        return profileStaticMethodUnnamed(nameFnOrTarget, fnOrKey, descriptor);
    }
    else if (typeof nameFnOrTarget === "string" && typeof fnOrKey === "function") {
        if (!profileFunctionFactory) {
            return fnOrKey;
        }
        return profileFunction(fnOrKey, nameFnOrTarget);
    }
    else if (typeof nameFnOrTarget === "function") {
        if (!profileFunctionFactory) {
            return nameFnOrTarget;
        }
        return profileFunction(nameFnOrTarget);
    }
    else if (typeof nameFnOrTarget === "string") {
        if (!profileFunctionFactory) {
            return voidMethodDecorator;
        }
        return profileMethodNamed(nameFnOrTarget);
    }
    else {
        if (!profileFunctionFactory) {
            return voidMethodDecorator;
        }
        return profileMethodUnnamed;
    }
}
exports.profile = profile;
function dumpProfiles() {
    profileNames.forEach(function (name) {
        var info = timers[name];
        if (info) {
            console.log("---- [" + name + "] STOP total: " + info.totalTime + " count:" + info.count);
        }
        else {
            console.log("---- [" + name + "] Never called");
        }
    });
}
exports.dumpProfiles = dumpProfiles;
function resetProfiles() {
    profileNames.forEach(function (name) {
        var info = timers[name];
        if (info) {
            if (info.runCount) {
                console.log("---- timer with name [" + name + "] is currently running and won't be reset");
            }
            else {
                timers[name] = undefined;
            }
        }
    });
}
exports.resetProfiles = resetProfiles;
function startCPUProfile(name) {
    if (anyGlobal.android) {
        __startCPUProfiler(name);
    }
}
exports.startCPUProfile = startCPUProfile;
function stopCPUProfile(name) {
    if (anyGlobal.android) {
        __stopCPUProfiler(name);
    }
}
exports.stopCPUProfile = stopCPUProfile;
function level() {
    return tracingLevel;
}
exports.level = level;
function trace(message, start, end) {
    log("Timeline: Modules: " + message + "  (" + start + "ms. - " + end + "ms.)");
}
exports.trace = trace;
//# sourceMappingURL=profiling.js.map