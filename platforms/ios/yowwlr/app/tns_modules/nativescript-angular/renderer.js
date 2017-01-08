var core_1 = require("@angular/core");
var platform_providers_1 = require("./platform-providers");
var lang_facade_1 = require("./lang-facade");
var view_1 = require("ui/core/view");
var application = require("application");
var frame_1 = require("ui/frame");
var view_util_1 = require("./view-util");
var trace_1 = require("./trace");
var utils_1 = require("utils/utils");
var nsAnimationDriver = require("./animation-driver");
var nsAnimationDriverModule;
function ensureAnimationDriverModule() {
    if (!nsAnimationDriverModule) {
        nsAnimationDriverModule = require("./animation-driver");
    }
}
// CONTENT_ATTR not exported from dom_renderer - we need it for styles application.
exports.COMPONENT_VARIABLE = "%COMP%";
exports.CONTENT_ATTR = "_ngcontent-" + exports.COMPONENT_VARIABLE;
var NativeScriptRootRenderer = (function () {
    function NativeScriptRootRenderer(_rootView, device, _zone) {
        this._rootView = _rootView;
        this._zone = _zone;
        this._registeredComponents = new Map();
        this._viewUtil = new view_util_1.ViewUtil(device);
    }
    Object.defineProperty(NativeScriptRootRenderer.prototype, "animationDriver", {
        get: function () {
            if (!this._animationDriver) {
                ensureAnimationDriverModule();
                this._animationDriver = new nsAnimationDriverModule.NativeScriptAnimationDriver();
            }
            return this._animationDriver;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NativeScriptRootRenderer.prototype, "rootView", {
        get: function () {
            if (!this._rootView) {
                this._rootView = frame_1.topmost().currentPage;
            }
            return this._rootView;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NativeScriptRootRenderer.prototype, "page", {
        get: function () {
            return this.rootView.page;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NativeScriptRootRenderer.prototype, "viewUtil", {
        get: function () {
            return this._viewUtil;
        },
        enumerable: true,
        configurable: true
    });
    NativeScriptRootRenderer.prototype.renderComponent = function (componentProto) {
        var renderer = this._registeredComponents.get(componentProto.id);
        if (lang_facade_1.isBlank(renderer)) {
            renderer = new NativeScriptRenderer(this, componentProto, this.animationDriver, this._zone);
            this._registeredComponents.set(componentProto.id, renderer);
        }
        return renderer;
    };
    NativeScriptRootRenderer = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Optional()),
        __param(0, core_1.Inject(platform_providers_1.APP_ROOT_VIEW)),
        __param(1, core_1.Inject(platform_providers_1.DEVICE)), 
        __metadata('design:paramtypes', [view_1.View, Object, core_1.NgZone])
    ], NativeScriptRootRenderer);
    return NativeScriptRootRenderer;
}());
exports.NativeScriptRootRenderer = NativeScriptRootRenderer;
var NativeScriptRenderer = (function (_super) {
    __extends(NativeScriptRenderer, _super);
    function NativeScriptRenderer(rootRenderer, componentProto, animationDriver, zone) {
        _super.call(this);
        this.rootRenderer = rootRenderer;
        this.animationDriver = animationDriver;
        this.zone = zone;
        this.attrReplacer = new RegExp(utils_1.escapeRegexSymbols(exports.CONTENT_ATTR), "g");
        this.attrSanitizer = /-/g;
        var stylesLength = componentProto.styles.length;
        this.componentProtoId = componentProto.id;
        for (var i = 0; i < stylesLength; i++) {
            this.hasComponentStyles = true;
            var cssString = componentProto.styles[i] + "";
            var realCSS = this.replaceNgAttribute(cssString, this.componentProtoId);
            application.addCss(realCSS);
        }
        trace_1.rendererLog("NativeScriptRenderer created");
    }
    Object.defineProperty(NativeScriptRenderer.prototype, "viewUtil", {
        get: function () {
            return this.rootRenderer.viewUtil;
        },
        enumerable: true,
        configurable: true
    });
    NativeScriptRenderer.prototype.replaceNgAttribute = function (input, componentId) {
        return input.replace(this.attrReplacer, "_ng_content_" + componentId.replace(this.attrSanitizer, "_"));
    };
    NativeScriptRenderer.prototype.renderComponent = function (componentProto) {
        return this.rootRenderer.renderComponent(componentProto);
    };
    NativeScriptRenderer.prototype.selectRootElement = function (selector) {
        trace_1.rendererLog("selectRootElement: " + selector);
        var rootView = this.rootRenderer.rootView;
        rootView.nodeName = "ROOT";
        return rootView;
    };
    NativeScriptRenderer.prototype.createViewRoot = function (hostElement) {
        trace_1.rendererLog("CREATE VIEW ROOT: " + hostElement.nodeName);
        return hostElement;
    };
    NativeScriptRenderer.prototype.projectNodes = function (parentElement, nodes) {
        var _this = this;
        trace_1.rendererLog("NativeScriptRenderer.projectNodes");
        nodes.forEach(function (node) {
            _this.viewUtil.insertChild(parentElement, node);
        });
    };
    NativeScriptRenderer.prototype.attachViewAfter = function (anchorNode, viewRootNodes) {
        var _this = this;
        trace_1.rendererLog("NativeScriptRenderer.attachViewAfter: " + anchorNode.nodeName + " " + anchorNode);
        var parent = (anchorNode.parent || anchorNode.templateParent);
        var insertPosition = this.viewUtil.getChildIndex(parent, anchorNode);
        viewRootNodes.forEach(function (node, index) {
            var childIndex = insertPosition + index + 1;
            _this.viewUtil.insertChild(parent, node, childIndex);
        });
    };
    NativeScriptRenderer.prototype.detachView = function (viewRootNodes) {
        trace_1.rendererLog("NativeScriptRenderer.detachView");
        for (var i = 0; i < viewRootNodes.length; i++) {
            var node = viewRootNodes[i];
            this.viewUtil.removeChild(node.parent, node);
        }
    };
    NativeScriptRenderer.prototype.destroyView = function (_hostElement, _viewAllNodes) {
        trace_1.rendererLog("NativeScriptRenderer.destroyView");
        // Seems to be called on component dispose only (router outlet)
        // TODO: handle this when we resolve routing and navigation.
    };
    NativeScriptRenderer.prototype.setElementProperty = function (renderElement, propertyName, propertyValue) {
        trace_1.rendererLog("NativeScriptRenderer.setElementProperty " + renderElement + ": " +
            propertyName + " = " + propertyValue);
        this.viewUtil.setProperty(renderElement, propertyName, propertyValue);
    };
    NativeScriptRenderer.prototype.setElementAttribute = function (renderElement, attributeName, attributeValue) {
        trace_1.rendererLog("NativeScriptRenderer.setElementAttribute " + renderElement + ": " +
            attributeName + " = " + attributeValue);
        return this.setElementProperty(renderElement, attributeName, attributeValue);
    };
    NativeScriptRenderer.prototype.setElementClass = function (renderElement, className, isAdd) {
        trace_1.rendererLog("NativeScriptRenderer.setElementClass " + className + " - " + isAdd);
        if (isAdd) {
            this.viewUtil.addClass(renderElement, className);
        }
        else {
            this.viewUtil.removeClass(renderElement, className);
        }
    };
    NativeScriptRenderer.prototype.setElementStyle = function (renderElement, styleName, styleValue) {
        this.viewUtil.setStyleProperty(renderElement, styleName, styleValue);
    };
    // Used only in debug mode to serialize property changes to comment nodes,
    // such as <template> placeholders.
    NativeScriptRenderer.prototype.setBindingDebugInfo = function (renderElement, propertyName, propertyValue) {
        trace_1.rendererLog("NativeScriptRenderer.setBindingDebugInfo: " + renderElement + ", " +
            propertyName + " = " + propertyValue);
    };
    NativeScriptRenderer.prototype.setElementDebugInfo = function (renderElement, _info /*RenderDebugInfo*/) {
        trace_1.rendererLog("NativeScriptRenderer.setElementDebugInfo: " + renderElement);
    };
    NativeScriptRenderer.prototype.invokeElementMethod = function (_renderElement, methodName, args) {
        trace_1.rendererLog("NativeScriptRenderer.invokeElementMethod " + methodName + " " + args);
    };
    NativeScriptRenderer.prototype.setText = function (_renderNode, _text) {
        trace_1.rendererLog("NativeScriptRenderer.setText");
    };
    NativeScriptRenderer.prototype.createTemplateAnchor = function (parentElement) {
        trace_1.rendererLog("NativeScriptRenderer.createTemplateAnchor");
        return this.viewUtil.createTemplateAnchor(parentElement);
    };
    NativeScriptRenderer.prototype.createElement = function (parentElement, name) {
        var _this = this;
        trace_1.rendererLog("NativeScriptRenderer.createElement: " + name + " parent: " +
            parentElement + ", " + (parentElement ? parentElement.nodeName : "null"));
        return this.viewUtil.createView(name, parentElement, function (view) {
            // Set an attribute to the view to scope component-specific css.
            // The property name is pre-generated by Angular.
            if (_this.hasComponentStyles) {
                var cssAttribute = _this.replaceNgAttribute(exports.CONTENT_ATTR, _this.componentProtoId);
                view[cssAttribute] = true;
            }
        });
    };
    NativeScriptRenderer.prototype.createText = function (_parentElement, _value) {
        trace_1.rendererLog("NativeScriptRenderer.createText");
        return this.viewUtil.createText();
    };
    NativeScriptRenderer.prototype.listen = function (renderElement, eventName, callback) {
        var _this = this;
        trace_1.rendererLog("NativeScriptRenderer.listen: " + eventName);
        // Explicitly wrap in zone
        var zonedCallback = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            _this.zone.run(function () {
                callback.apply(undefined, args);
            });
        };
        renderElement.on(eventName, zonedCallback);
        if (eventName === view_1.View.loadedEvent && renderElement.isLoaded) {
            var notifyData = { eventName: view_1.View.loadedEvent, object: renderElement };
            zonedCallback(notifyData);
        }
        return function () { return renderElement.off(eventName, zonedCallback); };
    };
    NativeScriptRenderer.prototype.listenGlobal = function (_target, _eventName, _callback) {
        throw new Error("NativeScriptRenderer.listenGlobal() - Not implemented.");
    };
    NativeScriptRenderer.prototype.animate = function (element, startingStyles, keyframes, duration, delay, easing) {
        var player = this.animationDriver.animate(element, startingStyles, keyframes, duration, delay, easing);
        return player;
    };
    NativeScriptRenderer = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [NativeScriptRootRenderer, core_1.RenderComponentType, nsAnimationDriver.NativeScriptAnimationDriver, core_1.NgZone])
    ], NativeScriptRenderer);
    return NativeScriptRenderer;
}(core_1.Renderer));
exports.NativeScriptRenderer = NativeScriptRenderer;
//# sourceMappingURL=renderer.js.map