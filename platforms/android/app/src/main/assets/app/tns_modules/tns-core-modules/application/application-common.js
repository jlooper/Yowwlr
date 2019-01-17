Object.defineProperty(exports, "__esModule", { value: true });
require("globals");
var observable_1 = require("../data/observable");
exports.Observable = observable_1.Observable;
var profiling_1 = require("../profiling");
var events = new observable_1.Observable();
var launched = false;
function setLaunched() {
    launched = true;
    events.off("launch", setLaunched);
}
events.on("launch", setLaunched);
if (profiling_1.level() > 0) {
    events.on("displayed", function () {
        var duration = profiling_1.uptime();
        var end = profiling_1.time();
        var start = end - duration;
        profiling_1.trace("Displayed in " + duration.toFixed(2) + "ms", start, end);
    });
}
function hasLaunched() {
    return launched;
}
exports.hasLaunched = hasLaunched;
exports.launchEvent = "launch";
exports.suspendEvent = "suspend";
exports.displayedEvent = "displayed";
exports.resumeEvent = "resume";
exports.exitEvent = "exit";
exports.lowMemoryEvent = "lowMemory";
exports.uncaughtErrorEvent = "uncaughtError";
exports.orientationChangedEvent = "orientationChanged";
var cssFile = "./app.css";
var resources = {};
function getResources() {
    return resources;
}
exports.getResources = getResources;
function setResources(res) {
    resources = res;
}
exports.setResources = setResources;
exports.android = undefined;
exports.ios = undefined;
exports.on = events.on.bind(events);
exports.off = events.off.bind(events);
exports.notify = events.notify.bind(events);
exports.hasListeners = events.hasListeners.bind(events);
var app;
function setApplication(instance) {
    app = instance;
}
exports.setApplication = setApplication;
function livesync() {
    events.notify({ eventName: "livesync", object: app });
    var liveSyncCore = global.__onLiveSyncCore;
    if (liveSyncCore) {
        liveSyncCore();
    }
}
exports.livesync = livesync;
function setCssFileName(cssFileName) {
    cssFile = cssFileName;
    events.notify({ eventName: "cssChanged", object: app, cssFile: cssFileName });
}
exports.setCssFileName = setCssFileName;
function getCssFileName() {
    return cssFile;
}
exports.getCssFileName = getCssFileName;
function loadAppCss() {
    try {
        events.notify({ eventName: "loadAppCss", object: app, cssFile: getCssFileName() });
    }
    catch (e) {
        throw new Error("The file " + getCssFileName() + " couldn't be loaded! " +
            "You may need to register it inside ./app/vendor.ts.");
    }
}
exports.loadAppCss = loadAppCss;
function addCss(cssText) {
    events.notify({ eventName: "cssChanged", object: app, cssText: cssText });
}
exports.addCss = addCss;
global.__onUncaughtError = function (error) {
    events.notify({ eventName: exports.uncaughtErrorEvent, object: app, android: error, ios: error, error: error });
};
//# sourceMappingURL=application-common.js.map