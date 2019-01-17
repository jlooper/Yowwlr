Object.defineProperty(exports, "__esModule", { value: true });
var css_selector_1 = require("tns-core-modules/ui/styling/css-selector");
var properties_1 = require("tns-core-modules/ui/core/properties");
var view_1 = require("tns-core-modules/ui/core/view");
var proxy_view_container_1 = require("tns-core-modules/ui/proxy-view-container");
var animation_player_1 = require("./animation-player");
var utils_1 = require("./utils");
var element_registry_1 = require("../element-registry");
var trace_1 = require("../trace");
var Selector = /** @class */ (function () {
    function Selector(rawSelector) {
        this.parse(rawSelector);
    }
    Selector.prototype.match = function (element) {
        return this.nsSelectorMatch(element) || this.classSelectorsMatch(element);
    };
    Selector.prototype.parse = function (rawSelector) {
        var selectors = rawSelector.split(",").map(function (s) { return s.trim(); });
        this.nsSelectors = selectors.map(css_selector_1.createSelector);
        this.classSelectors = selectors
            .filter(function (s) { return s.startsWith("."); })
            .map(function (s) { return s.substring(1); });
    };
    Selector.prototype.nsSelectorMatch = function (element) {
        return this.nsSelectors.some(function (s) { return s.match(element); });
    };
    Selector.prototype.classSelectorsMatch = function (element) {
        var _this = this;
        return this.classSelectors.some(function (s) { return _this.hasClass(element, s); });
    };
    // we're using that instead of match for classes
    // that are dynamically added by the animation engine
    // such as .ng-trigger, that's added for every :enter view
    Selector.prototype.hasClass = function (element, cls) {
        return element && element["$$classes"] && element["$$classes"][cls];
    };
    return Selector;
}());
var NativeScriptAnimationDriver = /** @class */ (function () {
    function NativeScriptAnimationDriver() {
    }
    NativeScriptAnimationDriver.prototype.validateStyleProperty = function (property) {
        trace_1.animationsLog("CssAnimationProperty.validateStyleProperty: " + property);
        return NativeScriptAnimationDriver.validProperties.indexOf(property) !== -1;
    };
    NativeScriptAnimationDriver.prototype.matchesElement = function (element, rawSelector) {
        trace_1.animationsLog("NativeScriptAnimationDriver.matchesElement " +
            ("element: " + element + ", selector: " + rawSelector));
        var selector = this.makeSelector(rawSelector);
        return selector.match(element);
    };
    NativeScriptAnimationDriver.prototype.containsElement = function (elm1, elm2) {
        trace_1.animationsLog("NativeScriptAnimationDriver.containsElement " +
            ("element1: " + elm1 + ", element2: " + elm2));
        // Checking if the parent is our fake body object
        if (elm1["isOverride"]) {
            return true;
        }
        var params = { originalView: elm2 };
        var result = this.visitDescendants(elm1, viewMatches, params);
        return result.found;
    };
    NativeScriptAnimationDriver.prototype.query = function (element, rawSelector, multi) {
        trace_1.animationsLog("NativeScriptAnimationDriver.query " +
            ("element: " + element + ", selector: " + rawSelector + " ") +
            ("multi: " + multi));
        var selector = this.makeSelector(rawSelector);
        var params = { selector: selector, multi: multi };
        var result = this.visitDescendants(element, queryDescendants, params);
        return result.matches || [];
    };
    NativeScriptAnimationDriver.prototype.computeStyle = function (element, prop) {
        trace_1.animationsLog("NativeScriptAnimationDriver.computeStyle " +
            ("element: " + element + ", prop: " + prop));
        var camelCaseProp = utils_1.dashCaseToCamelCase(prop);
        return element.style[camelCaseProp];
    };
    NativeScriptAnimationDriver.prototype.animate = function (element, keyframes, duration, delay, easing) {
        trace_1.animationsLog("NativeScriptAnimationDriver.animate " +
            ("element: " + element + ", keyframes: " + keyframes + " ") +
            ("duration: " + duration + ", delay: " + delay + " ") +
            ("easing: " + easing));
        return new animation_player_1.NativeScriptAnimationPlayer(element, keyframes, duration, delay, easing);
    };
    NativeScriptAnimationDriver.prototype.makeSelector = function (rawSelector) {
        return new Selector(rawSelector);
    };
    NativeScriptAnimationDriver.prototype.visitDescendants = function (element, cb, cbParams) {
        var result = {};
        // fill the result obj with the result from the callback function
        view_1.eachDescendant(element, function (child) { return cb(child, result, cbParams); });
        return result;
    };
    NativeScriptAnimationDriver.validProperties = properties_1.CssAnimationProperty._getPropertyNames().concat([
        "transform",
    ]);
    return NativeScriptAnimationDriver;
}());
exports.NativeScriptAnimationDriver = NativeScriptAnimationDriver;
function viewMatches(element, result, params) {
    if (element === params.originalView) {
        result.found = true;
    }
    return !result.found;
}
function queryDescendants(element, result, params) {
    if (!result.matches) {
        result.matches = [];
    }
    var selector = params.selector, multi = params.multi;
    // skip comment and text nodes
    // because they are not actual Views
    // and cannot be animated
    if (element instanceof element_registry_1.InvisibleNode || !selector.match(element)) {
        return true;
    }
    if (element instanceof proxy_view_container_1.ProxyViewContainer) {
        element.eachChild(function (child) {
            result.matches.push(child);
            return true;
        });
    }
    else {
        result.matches.push(element);
    }
    return multi;
}
//# sourceMappingURL=animation-driver.js.map