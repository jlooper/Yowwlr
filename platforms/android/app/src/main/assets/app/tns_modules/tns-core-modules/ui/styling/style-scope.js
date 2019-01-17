Object.defineProperty(exports, "__esModule", { value: true });
var properties_1 = require("../core/properties");
var css_1 = require("../../css");
var parser_1 = require("../../css/parser");
var css_selector_1 = require("./css-selector");
var trace_1 = require("../../trace");
var file_system_1 = require("../../file-system");
var applicationCommon = require("../../application/application-common");
var profiling_1 = require("../../profiling");
var keyframeAnimationModule;
function ensureKeyframeAnimationModule() {
    if (!keyframeAnimationModule) {
        keyframeAnimationModule = require("ui/animation/keyframe-animation");
    }
}
var cssAnimationParserModule;
function ensureCssAnimationParserModule() {
    if (!cssAnimationParserModule) {
        cssAnimationParserModule = require("./css-animation-parser");
    }
}
var parser = "rework";
try {
    var appConfig = require("~/package.json");
    if (appConfig && appConfig.cssParser === "nativescript") {
        parser = "nativescript";
    }
}
catch (e) {
}
function mergeCssSelectors() {
    applicationCssSelectors = applicationSelectors.slice();
    applicationCssSelectors.push.apply(applicationCssSelectors, applicationAdditionalSelectors);
    applicationCssSelectorVersion++;
}
exports.mergeCssSelectors = mergeCssSelectors;
var applicationCssSelectors = [];
var applicationCssSelectorVersion = 0;
var applicationSelectors = [];
var applicationAdditionalSelectors = [];
var applicationKeyframes = {};
var animationsSymbol = Symbol("animations");
var pattern = /('|")(.*?)\1/;
var CSSSource = (function () {
    function CSSSource(_ast, _url, _file, _keyframes, _source) {
        this._ast = _ast;
        this._url = _url;
        this._file = _file;
        this._keyframes = _keyframes;
        this._source = _source;
        this._selectors = [];
        this.parse();
    }
    CSSSource.fromURI = function (uri, keyframes) {
        var appRelativeUri = CSSSource.pathRelativeToApp(uri);
        try {
            var cssOrAst = global.loadModule(appRelativeUri);
            if (cssOrAst) {
                if (typeof cssOrAst === "string") {
                    return CSSSource.fromSource(cssOrAst, keyframes, appRelativeUri);
                }
                else if (typeof cssOrAst === "object" && cssOrAst.type === "stylesheet" && cssOrAst.stylesheet && cssOrAst.stylesheet.rules) {
                    return CSSSource.fromAST(cssOrAst, keyframes, appRelativeUri);
                }
                else {
                    return CSSSource.fromSource(cssOrAst.toString(), keyframes, appRelativeUri);
                }
            }
        }
        catch (e) {
        }
        return CSSSource.fromFile(appRelativeUri, keyframes);
    };
    CSSSource.pathRelativeToApp = function (uri) {
        if (!uri.startsWith("/")) {
            return uri;
        }
        var appPath = file_system_1.knownFolders.currentApp().path;
        if (!uri.startsWith(appPath)) {
            trace_1.write(uri + " does not start with " + appPath, trace_1.categories.Error, trace_1.messageType.error);
            return uri;
        }
        var relativeUri = "." + uri.substr(appPath.length);
        return relativeUri;
    };
    CSSSource.fromFile = function (url, keyframes) {
        var cssFileUrl = url.replace(/\..\w+$/, ".css");
        if (cssFileUrl !== url) {
            var cssFile = CSSSource.resolveCSSPathFromURL(cssFileUrl);
            if (cssFile) {
                return new CSSSource(undefined, url, cssFile, keyframes, undefined);
            }
        }
        var file = CSSSource.resolveCSSPathFromURL(url);
        return new CSSSource(undefined, url, file, keyframes, undefined);
    };
    CSSSource.fromFileImport = function (url, keyframes, importSource) {
        var file = CSSSource.resolveCSSPathFromURL(url, importSource);
        return new CSSSource(undefined, url, file, keyframes, undefined);
    };
    CSSSource.resolveCSSPathFromURL = function (url, importSource) {
        var app = file_system_1.knownFolders.currentApp().path;
        var file = resolveFileNameFromUrl(url, app, file_system_1.File.exists, importSource);
        return file;
    };
    CSSSource.fromSource = function (source, keyframes, url) {
        return new CSSSource(undefined, url, undefined, keyframes, source);
    };
    CSSSource.fromAST = function (ast, keyframes, url) {
        return new CSSSource(ast, url, undefined, keyframes, undefined);
    };
    Object.defineProperty(CSSSource.prototype, "selectors", {
        get: function () { return this._selectors; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CSSSource.prototype, "source", {
        get: function () { return this._source; },
        enumerable: true,
        configurable: true
    });
    CSSSource.prototype.load = function () {
        var file = file_system_1.File.fromPath(this._file);
        this._source = file.readTextSync();
    };
    CSSSource.prototype.parse = function () {
        try {
            if (!this._ast) {
                if (!this._source && this._file) {
                    this.load();
                }
                if (this._source) {
                    this.parseCSSAst();
                }
            }
            if (this._ast) {
                this.createSelectors();
            }
            else {
                this._selectors = [];
            }
        }
        catch (e) {
            trace_1.write("Css styling failed: " + e, trace_1.categories.Error, trace_1.messageType.error);
            this._selectors = [];
        }
    };
    CSSSource.prototype.parseCSSAst = function () {
        if (this._source) {
            switch (parser) {
                case "nativescript":
                    var cssparser = new parser_1.CSS3Parser(this._source);
                    var stylesheet = cssparser.parseAStylesheet();
                    var cssNS = new parser_1.CSSNativeScript();
                    this._ast = cssNS.parseStylesheet(stylesheet);
                    return;
                case "rework":
                    this._ast = css_1.parse(this._source, { source: this._file });
                    return;
            }
        }
    };
    CSSSource.prototype.createSelectors = function () {
        if (this._ast) {
            this._selectors = this.createSelectorsFromImports().concat(this.createSelectorsFromSyntaxTree());
        }
    };
    CSSSource.prototype.createSelectorsFromImports = function () {
        var _this = this;
        var imports = this._ast["stylesheet"]["rules"].filter(function (r) { return r.type === "import"; });
        var urlFromImportObject = function (importObject) {
            var importItem = importObject["import"];
            var urlMatch = importItem && importItem.match(pattern);
            return urlMatch && urlMatch[2];
        };
        var sourceFromImportObject = function (importObject) {
            return importObject["position"] && importObject["position"]["source"];
        };
        var toUrlSourcePair = function (importObject) { return ({
            url: urlFromImportObject(importObject),
            source: sourceFromImportObject(importObject),
        }); };
        var getCssFile = function (_a) {
            var url = _a.url, source = _a.source;
            return source ?
                CSSSource.fromFileImport(url, _this._keyframes, source) :
                CSSSource.fromURI(url, _this._keyframes);
        };
        var cssFiles = imports
            .map(toUrlSourcePair)
            .filter(function (_a) {
            var url = _a.url;
            return !!url;
        })
            .map(getCssFile);
        var selectors = cssFiles.map(function (file) { return (file && file.selectors) || []; });
        return selectors.reduce(function (acc, val) { return acc.concat(val); }, []);
    };
    CSSSource.prototype.createSelectorsFromSyntaxTree = function () {
        var _this = this;
        var nodes = this._ast.stylesheet.rules;
        nodes.filter(isKeyframe).forEach(function (node) { return _this._keyframes[node.name] = node; });
        var rulesets = css_selector_1.fromAstNodes(nodes);
        if (rulesets && rulesets.length) {
            ensureCssAnimationParserModule();
            rulesets.forEach(function (rule) {
                rule[animationsSymbol] = cssAnimationParserModule.CssAnimationParser
                    .keyframeAnimationsFromCSSDeclarations(rule.declarations);
            });
        }
        return rulesets;
    };
    CSSSource.prototype.toString = function () {
        return this._file || this._url || "(in-memory)";
    };
    __decorate([
        profiling_1.profile
    ], CSSSource.prototype, "load", null);
    __decorate([
        profiling_1.profile
    ], CSSSource.prototype, "parse", null);
    __decorate([
        profiling_1.profile
    ], CSSSource.prototype, "parseCSSAst", null);
    __decorate([
        profiling_1.profile
    ], CSSSource.prototype, "createSelectors", null);
    __decorate([
        profiling_1.profile
    ], CSSSource, "resolveCSSPathFromURL", null);
    return CSSSource;
}());
function removeTaggedAdditionalCSS(tag) {
    var changed = false;
    for (var i = 0; i < applicationAdditionalSelectors.length; i++) {
        if (applicationAdditionalSelectors[i].tag === tag) {
            applicationAdditionalSelectors.splice(i, 1);
            i--;
            changed = true;
        }
    }
    if (changed) {
        mergeCssSelectors();
    }
    return changed;
}
exports.removeTaggedAdditionalCSS = removeTaggedAdditionalCSS;
function addTaggedAdditionalCSS(cssText, tag) {
    var parsed = CSSSource.fromSource(cssText, applicationKeyframes, undefined).selectors;
    var changed = false;
    if (parsed && parsed.length) {
        changed = true;
        if (tag != null) {
            for (var i = 0; i < parsed.length; i++) {
                parsed[i].tag = tag;
            }
        }
        applicationAdditionalSelectors.push.apply(applicationAdditionalSelectors, parsed);
        mergeCssSelectors();
    }
    return changed;
}
exports.addTaggedAdditionalCSS = addTaggedAdditionalCSS;
var onCssChanged = profiling_1.profile("\"style-scope\".onCssChanged", function (args) {
    if (args.cssText) {
        var parsed = CSSSource.fromSource(args.cssText, applicationKeyframes, args.cssFile).selectors;
        if (parsed) {
            applicationAdditionalSelectors.push.apply(applicationAdditionalSelectors, parsed);
            mergeCssSelectors();
        }
    }
    else if (args.cssFile) {
        loadCss(args.cssFile);
    }
});
function onLiveSync(args) {
    loadCss(applicationCommon.getCssFileName());
}
var loadCss = profiling_1.profile("\"style-scope\".loadCss", function (cssFile) {
    if (!cssFile) {
        return undefined;
    }
    var result = CSSSource.fromURI(cssFile, applicationKeyframes).selectors;
    if (result.length > 0) {
        applicationSelectors = result;
        mergeCssSelectors();
    }
});
applicationCommon.on("cssChanged", onCssChanged);
applicationCommon.on("livesync", onLiveSync);
exports.loadAppCSS = profiling_1.profile("\"style-scope\".loadAppCSS", function (args) {
    loadCss(args.cssFile);
    applicationCommon.off("loadAppCss", exports.loadAppCSS);
});
if (applicationCommon.hasLaunched()) {
    exports.loadAppCSS({ eventName: "loadAppCss", object: applicationCommon, cssFile: applicationCommon.getCssFileName() });
}
else {
    applicationCommon.on("loadAppCss", exports.loadAppCSS);
}
var CssState = (function () {
    function CssState(view) {
        var _this = this;
        this.view = view;
        this._onDynamicStateChangeHandler = function () { return _this.updateDynamicState(); };
    }
    CssState.prototype.onChange = function () {
        if (this.view && this.view.isLoaded) {
            this.unsubscribeFromDynamicUpdates();
            this.updateMatch();
            this.subscribeForDynamicUpdates();
            this.updateDynamicState();
        }
        else {
            this._matchInvalid = true;
        }
    };
    CssState.prototype.onLoaded = function () {
        if (this._matchInvalid) {
            this.updateMatch();
        }
        this.subscribeForDynamicUpdates();
        this.updateDynamicState();
    };
    CssState.prototype.onUnloaded = function () {
        this.unsubscribeFromDynamicUpdates();
    };
    CssState.prototype.updateMatch = function () {
        this._match = this.view._styleScope ? this.view._styleScope.matchSelectors(this.view) : CssState.emptyMatch;
        this._matchInvalid = false;
    };
    CssState.prototype.updateDynamicState = function () {
        var _this = this;
        var matchingSelectors = this._match.selectors.filter(function (sel) { return sel.dynamic ? sel.match(_this.view) : true; });
        this.view._batchUpdate(function () {
            _this.stopKeyframeAnimations();
            _this.setPropertyValues(matchingSelectors);
            _this.playKeyframeAnimations(matchingSelectors);
        });
    };
    CssState.prototype.playKeyframeAnimations = function (matchingSelectors) {
        var _this = this;
        var animations = [];
        matchingSelectors.forEach(function (selector) {
            var ruleAnimations = selector.ruleset[animationsSymbol];
            if (ruleAnimations) {
                ensureKeyframeAnimationModule();
                for (var _i = 0, ruleAnimations_1 = ruleAnimations; _i < ruleAnimations_1.length; _i++) {
                    var animationInfo = ruleAnimations_1[_i];
                    var animation = keyframeAnimationModule.KeyframeAnimation.keyframeAnimationFromInfo(animationInfo);
                    if (animation) {
                        animations.push(animation);
                    }
                }
            }
        });
        if (this._playsKeyframeAnimations = animations.length > 0) {
            animations.map(function (animation) { return animation.play(_this.view); });
            Object.freeze(animations);
            this._appliedAnimations = animations;
        }
    };
    CssState.prototype.stopKeyframeAnimations = function () {
        if (!this._playsKeyframeAnimations) {
            return;
        }
        this._appliedAnimations
            .filter(function (animation) { return animation.isPlaying; })
            .forEach(function (animation) { return animation.cancel(); });
        this._appliedAnimations = CssState.emptyAnimationArray;
        this.view.style["keyframe:rotate"] = properties_1.unsetValue;
        this.view.style["keyframe:scaleX"] = properties_1.unsetValue;
        this.view.style["keyframe:scaleY"] = properties_1.unsetValue;
        this.view.style["keyframe:translateX"] = properties_1.unsetValue;
        this.view.style["keyframe:translateY"] = properties_1.unsetValue;
        this.view.style["keyframe:backgroundColor"] = properties_1.unsetValue;
        this.view.style["keyframe:opacity"] = properties_1.unsetValue;
        this._playsKeyframeAnimations = false;
    };
    CssState.prototype.setPropertyValues = function (matchingSelectors) {
        var newPropertyValues = new this.view.style.PropertyBag();
        matchingSelectors.forEach(function (selector) {
            return selector.ruleset.declarations.forEach(function (declaration) {
                return newPropertyValues[declaration.property] = declaration.value;
            });
        });
        Object.freeze(newPropertyValues);
        var oldProperties = this._appliedPropertyValues;
        for (var key in oldProperties) {
            if (!(key in newPropertyValues)) {
                if (key in this.view.style) {
                    this.view.style["css:" + key] = properties_1.unsetValue;
                }
                else {
                }
            }
        }
        for (var property in newPropertyValues) {
            if (oldProperties && property in oldProperties && oldProperties[property] === newPropertyValues[property]) {
                continue;
            }
            var value = newPropertyValues[property];
            try {
                if (property in this.view.style) {
                    this.view.style["css:" + property] = value;
                }
                else {
                    this.view[property] = value;
                }
            }
            catch (e) {
                trace_1.write("Failed to apply property [" + property + "] with value [" + value + "] to " + this.view + ". " + e, trace_1.categories.Error, trace_1.messageType.error);
            }
        }
        this._appliedPropertyValues = newPropertyValues;
    };
    CssState.prototype.subscribeForDynamicUpdates = function () {
        var _this = this;
        var changeMap = this._match.changeMap;
        changeMap.forEach(function (changes, view) {
            if (changes.attributes) {
                changes.attributes.forEach(function (attribute) {
                    view.addEventListener(attribute + "Change", _this._onDynamicStateChangeHandler);
                });
            }
            if (changes.pseudoClasses) {
                changes.pseudoClasses.forEach(function (pseudoClass) {
                    var eventName = ":" + pseudoClass;
                    view.addEventListener(":" + pseudoClass, _this._onDynamicStateChangeHandler);
                    if (view[eventName]) {
                        view[eventName](+1);
                    }
                });
            }
        });
        this._appliedChangeMap = changeMap;
    };
    CssState.prototype.unsubscribeFromDynamicUpdates = function () {
        var _this = this;
        this._appliedChangeMap.forEach(function (changes, view) {
            if (changes.attributes) {
                changes.attributes.forEach(function (attribute) {
                    view.removeEventListener(attribute + "Change", _this._onDynamicStateChangeHandler);
                });
            }
            if (changes.pseudoClasses) {
                changes.pseudoClasses.forEach(function (pseudoClass) {
                    var eventName = ":" + pseudoClass;
                    view.removeEventListener(eventName, _this._onDynamicStateChangeHandler);
                    if (view[eventName]) {
                        view[eventName](-1);
                    }
                });
            }
        });
        this._appliedChangeMap = CssState.emptyChangeMap;
    };
    CssState.prototype.toString = function () {
        return this.view + "._cssState";
    };
    CssState.emptyChangeMap = Object.freeze(new Map());
    CssState.emptyPropertyBag = Object.freeze({});
    CssState.emptyAnimationArray = Object.freeze([]);
    CssState.emptyMatch = { selectors: [], changeMap: new Map() };
    __decorate([
        profiling_1.profile
    ], CssState.prototype, "updateMatch", null);
    __decorate([
        profiling_1.profile
    ], CssState.prototype, "updateDynamicState", null);
    return CssState;
}());
exports.CssState = CssState;
CssState.prototype._appliedChangeMap = CssState.emptyChangeMap;
CssState.prototype._appliedPropertyValues = CssState.emptyPropertyBag;
CssState.prototype._appliedAnimations = CssState.emptyAnimationArray;
CssState.prototype._matchInvalid = true;
var StyleScope = (function () {
    function StyleScope() {
        this._css = "";
        this._localCssSelectors = [];
        this._localCssSelectorVersion = 0;
        this._localCssSelectorsAppliedVersion = 0;
        this._applicationCssSelectorsAppliedVersion = 0;
        this._keyframes = new Map();
    }
    Object.defineProperty(StyleScope.prototype, "css", {
        get: function () {
            return this._css;
        },
        set: function (value) {
            this.setCss(value);
        },
        enumerable: true,
        configurable: true
    });
    StyleScope.prototype.addCss = function (cssString, cssFileName) {
        this.appendCss(cssString, cssFileName);
    };
    StyleScope.prototype.addCssFile = function (cssFileName) {
        this.appendCss(null, cssFileName);
    };
    StyleScope.prototype.setCss = function (cssString, cssFileName) {
        this._css = cssString;
        var cssFile = CSSSource.fromSource(cssString, this._keyframes, cssFileName);
        this._localCssSelectors = cssFile.selectors;
        this._localCssSelectorVersion++;
        this.ensureSelectors();
    };
    StyleScope.prototype.appendCss = function (cssString, cssFileName) {
        if (!cssString && !cssFileName) {
            return;
        }
        var parsedCssSelectors = cssString ? CSSSource.fromSource(cssString, this._keyframes, cssFileName) : CSSSource.fromURI(cssFileName, this._keyframes);
        this._css = this._css + parsedCssSelectors.source;
        this._localCssSelectors.push.apply(this._localCssSelectors, parsedCssSelectors.selectors);
        this._localCssSelectorVersion++;
        this.ensureSelectors();
    };
    StyleScope.prototype.getKeyframeAnimationWithName = function (animationName) {
        var cssKeyframes = this._keyframes[animationName];
        if (!cssKeyframes) {
            return;
        }
        ensureKeyframeAnimationModule();
        var animation = new keyframeAnimationModule.KeyframeAnimationInfo();
        ensureCssAnimationParserModule();
        animation.keyframes = cssAnimationParserModule
            .CssAnimationParser.keyframesArrayFromCSS(cssKeyframes.keyframes);
        return animation;
    };
    StyleScope.prototype.ensureSelectors = function () {
        if (this._applicationCssSelectorsAppliedVersion !== applicationCssSelectorVersion ||
            this._localCssSelectorVersion !== this._localCssSelectorsAppliedVersion ||
            !this._mergedCssSelectors) {
            this._createSelectors();
        }
        return this._getSelectorsVersion();
    };
    StyleScope.prototype._createSelectors = function () {
        var toMerge = [];
        toMerge.push(applicationCssSelectors);
        this._applicationCssSelectorsAppliedVersion = applicationCssSelectorVersion;
        toMerge.push(this._localCssSelectors);
        this._localCssSelectorsAppliedVersion = this._localCssSelectorVersion;
        for (var keyframe in applicationKeyframes) {
            this._keyframes[keyframe] = applicationKeyframes[keyframe];
        }
        if (toMerge.length > 0) {
            this._mergedCssSelectors = toMerge.filter(function (m) { return !!m; }).reduce(function (merged, next) { return merged.concat(next); }, []);
            this._applyKeyframesOnSelectors();
            this._selectors = new css_selector_1.SelectorsMap(this._mergedCssSelectors);
        }
    };
    StyleScope.prototype.matchSelectors = function (view) {
        this.ensureSelectors();
        return this._selectors.query(view);
    };
    StyleScope.prototype.query = function (node) {
        this.ensureSelectors();
        return this._selectors.query(node).selectors;
    };
    StyleScope.prototype._getSelectorsVersion = function () {
        return 100000 * this._applicationCssSelectorsAppliedVersion + this._localCssSelectorsAppliedVersion;
    };
    StyleScope.prototype._applyKeyframesOnSelectors = function () {
        for (var i = this._mergedCssSelectors.length - 1; i >= 0; i--) {
            var ruleset = this._mergedCssSelectors[i];
            var animations = ruleset[animationsSymbol];
            if (animations !== undefined && animations.length) {
                ensureCssAnimationParserModule();
                for (var _i = 0, animations_1 = animations; _i < animations_1.length; _i++) {
                    var animation = animations_1[_i];
                    var cssKeyframe = this._keyframes[animation.name];
                    if (cssKeyframe !== undefined) {
                        animation.keyframes = cssAnimationParserModule
                            .CssAnimationParser.keyframesArrayFromCSS(cssKeyframe.keyframes);
                    }
                }
            }
        }
    };
    StyleScope.prototype.getAnimations = function (ruleset) {
        return ruleset[animationsSymbol];
    };
    __decorate([
        profiling_1.profile
    ], StyleScope.prototype, "setCss", null);
    __decorate([
        profiling_1.profile
    ], StyleScope.prototype, "appendCss", null);
    __decorate([
        profiling_1.profile
    ], StyleScope.prototype, "_createSelectors", null);
    __decorate([
        profiling_1.profile
    ], StyleScope.prototype, "matchSelectors", null);
    return StyleScope;
}());
exports.StyleScope = StyleScope;
function resolveFileNameFromUrl(url, appDirectory, fileExists, importSource) {
    var fileName = typeof url === "string" ? url.trim() : "";
    if (fileName.indexOf("~/") === 0) {
        fileName = fileName.replace("~/", "");
    }
    var isAbsolutePath = fileName.indexOf("/") === 0;
    var absolutePath = isAbsolutePath ? fileName : file_system_1.path.join(appDirectory, fileName);
    if (fileExists(absolutePath)) {
        return absolutePath;
    }
    if (!isAbsolutePath) {
        if (fileName[0] === "~" && fileName[1] !== "/" && fileName[1] !== "\"") {
            fileName = fileName.substr(1);
        }
        if (importSource) {
            var importFile = resolveFilePathFromImport(importSource, fileName);
            if (fileExists(importFile)) {
                return importFile;
            }
        }
        var external_1 = file_system_1.path.join(appDirectory, "tns_modules", fileName);
        if (fileExists(external_1)) {
            return external_1;
        }
    }
    return null;
}
exports.resolveFileNameFromUrl = resolveFileNameFromUrl;
function resolveFilePathFromImport(importSource, fileName) {
    var importSourceParts = importSource.split(file_system_1.path.separator);
    var fileNameParts = fileName.split(file_system_1.path.separator)
        .filter(function (p) { return !isCurrentDirectory(p); });
    importSourceParts.pop();
    fileNameParts.forEach(function (p) { return isParentDirectory(p) ? importSourceParts.pop() : importSourceParts.push(p); });
    return importSourceParts.join(file_system_1.path.separator);
}
exports.applyInlineStyle = profiling_1.profile(function applyInlineStyle(view, styleStr) {
    var localStyle = "local { " + styleStr + " }";
    var inlineRuleSet = CSSSource.fromSource(localStyle, new Map()).selectors;
    var style = view.style;
    inlineRuleSet[0].declarations.forEach(function (d) {
        var name = d.property;
        try {
            if (name in style) {
                style[name] = d.value;
            }
            else {
                view[name] = d.value;
            }
        }
        catch (e) {
            trace_1.write("Failed to apply property [" + d.property + "] with value [" + d.value + "] to " + view + ". " + e, trace_1.categories.Error, trace_1.messageType.error);
        }
    });
});
function isCurrentDirectory(uriPart) {
    return uriPart === ".";
}
function isParentDirectory(uriPart) {
    return uriPart === "..";
}
function isKeyframe(node) {
    return node.type === "keyframes";
}
//# sourceMappingURL=style-scope.js.map