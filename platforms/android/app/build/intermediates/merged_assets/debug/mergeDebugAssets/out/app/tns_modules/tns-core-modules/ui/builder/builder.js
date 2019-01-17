Object.defineProperty(exports, "__esModule", { value: true });
var debug_1 = require("../../utils/debug");
var xml = require("../../xml");
var file_system_1 = require("../../file-system");
var types_1 = require("../../utils/types");
var component_builder_1 = require("./component-builder");
var platform_1 = require("../../platform");
var file_name_resolver_1 = require("../../file-system/file-name-resolver");
var profiling_1 = require("../../profiling");
var ios = platform_1.platformNames.ios.toLowerCase();
var android = platform_1.platformNames.android.toLowerCase();
var defaultNameSpaceMatcher = /tns\.xsd$/i;
var trace;
function ensureTrace() {
    if (!trace) {
        trace = require("trace");
    }
}
function parse(value, context) {
    if (typeof value === "function") {
        return value();
    }
    else {
        var exports_1 = context ? getExports(context) : undefined;
        var componentModule = parseInternal(value, exports_1);
        return componentModule && componentModule.component;
    }
}
exports.parse = parse;
function parseMultipleTemplates(value, context) {
    var dummyComponent = "<ListView><ListView.itemTemplates>" + value + "</ListView.itemTemplates></ListView>";
    return parseInternal(dummyComponent, context).component["itemTemplates"];
}
exports.parseMultipleTemplates = parseMultipleTemplates;
function load(pathOrOptions, context) {
    var componentModule;
    if (!context) {
        if (typeof pathOrOptions === "string") {
            componentModule = loadInternal(pathOrOptions);
        }
        else {
            componentModule = loadCustomComponent(pathOrOptions.path, pathOrOptions.name, pathOrOptions.attributes, pathOrOptions.exports, pathOrOptions.page, true);
        }
    }
    else {
        var path_1 = pathOrOptions;
        componentModule = loadInternal(path_1, context);
    }
    return componentModule && componentModule.component;
}
exports.load = load;
function loadPage(moduleNamePath, fileName, context) {
    var componentModule = loadInternal(fileName, context, moduleNamePath);
    return componentModule && componentModule.component;
}
exports.loadPage = loadPage;
var loadModule = profiling_1.profile("loadModule", function (moduleNamePath, entry) {
    if (global.moduleExists(entry.moduleName)) {
        return global.loadModule(entry.moduleName);
    }
    else {
        var moduleExportsResolvedPath = file_name_resolver_1.resolveFileName(moduleNamePath, "js");
        if (moduleExportsResolvedPath) {
            moduleExportsResolvedPath = moduleExportsResolvedPath.substr(0, moduleExportsResolvedPath.length - 3);
            return global.loadModule(moduleExportsResolvedPath);
        }
    }
    return null;
});
var viewFromBuilder = profiling_1.profile("viewFromBuilder", function (moduleNamePath, moduleExports) {
    var fileName = file_name_resolver_1.resolveFileName(moduleNamePath, "xml");
    return loadPage(moduleNamePath, fileName, moduleExports);
});
exports.createViewFromEntry = profiling_1.profile("createViewFromEntry", function (entry) {
    if (entry.create) {
        return createView(entry);
    }
    else if (entry.moduleName) {
        var currentAppPath = file_system_1.knownFolders.currentApp().path;
        var moduleNamePath = file_system_1.path.join(currentAppPath, entry.moduleName);
        var moduleExports = loadModule(moduleNamePath, entry);
        if (moduleExports && moduleExports.createPage) {
            return moduleCreateView(moduleNamePath, moduleExports);
        }
        else {
            return viewFromBuilder(moduleNamePath, moduleExports);
        }
    }
    throw new Error("Failed to load page XML file for module: " + entry.moduleName);
});
var createView = profiling_1.profile("entry.create", function (entry) {
    var view = entry.create();
    if (!view) {
        throw new Error("Failed to create Page with entry.create() function.");
    }
    return view;
});
var moduleCreateView = profiling_1.profile("module.createView", function (moduleNamePath, moduleExports) {
    var view = moduleExports.createPage();
    var cssFileName = file_name_resolver_1.resolveFileName(moduleNamePath, "css");
    if (cssFileName) {
        view.addCssFile(cssFileName);
    }
    return view;
});
function loadInternal(fileName, context, moduleNamePath) {
    var componentModule;
    var appPath = file_system_1.knownFolders.currentApp().path;
    var filePathRelativeToApp = (moduleNamePath && moduleNamePath.startsWith(appPath) ? "./" + moduleNamePath.substr(appPath.length + 1) : moduleNamePath) + ".xml";
    if (global.moduleExists(filePathRelativeToApp)) {
        var text = global.loadModule(filePathRelativeToApp);
        componentModule = parseInternal(text, context, fileName, moduleNamePath);
    }
    else if (fileName && file_system_1.File.exists(fileName)) {
        var file = file_system_1.File.fromPath(fileName);
        var text_1 = file.readTextSync(function (error) { throw new Error("Error loading file " + fileName + " :" + error.message); });
        componentModule = parseInternal(text_1, context, fileName, moduleNamePath);
    }
    if (componentModule && componentModule.component) {
        componentModule.component.exports = context;
    }
    return componentModule;
}
function loadCustomComponent(componentPath, componentName, attributes, context, parentPage, isRootComponent, moduleNamePath) {
    if (isRootComponent === void 0) { isRootComponent = true; }
    if (!parentPage && context) {
        parentPage = context["_parentPage"];
        delete context["_parentPage"];
    }
    var result;
    componentPath = componentPath.replace("~/", "");
    var moduleName = componentPath + "/" + componentName;
    var xmlModuleName = moduleName + ".xml";
    var fullComponentPathFilePathWithoutExt = componentPath;
    if (!file_system_1.File.exists(componentPath) || componentPath === "." || componentPath === "./") {
        fullComponentPathFilePathWithoutExt = file_system_1.path.join(file_system_1.knownFolders.currentApp().path, componentPath, componentName);
    }
    var xmlFilePath = file_name_resolver_1.resolveFileName(fullComponentPathFilePathWithoutExt, "xml");
    if (xmlFilePath || global.moduleExists(xmlModuleName)) {
        var subExports = context;
        if (global.moduleExists(moduleName)) {
            subExports = global.loadModule(moduleName);
        }
        else {
            var jsFilePath = file_name_resolver_1.resolveFileName(fullComponentPathFilePathWithoutExt, "js");
            if (jsFilePath) {
                subExports = global.loadModule(jsFilePath);
            }
        }
        if (!subExports) {
            subExports = {};
        }
        subExports["_parentPage"] = parentPage;
        result = xmlFilePath ?
            loadInternal(xmlFilePath, subExports) :
            loadInternal(xmlFilePath, subExports, moduleName);
        if (types_1.isDefined(result) && types_1.isDefined(result.component) && types_1.isDefined(attributes)) {
            for (var attr in attributes) {
                component_builder_1.setPropertyValue(result.component, subExports, context, attr, attributes[attr]);
            }
        }
    }
    else {
        result = component_builder_1.getComponentModule(componentName, componentPath, attributes, context, moduleNamePath, isRootComponent);
    }
    var cssModulePath = fullComponentPathFilePathWithoutExt + ".css";
    if (cssModulePath.startsWith("/")) {
        var app = file_system_1.knownFolders.currentApp().path + "/";
        if (cssModulePath.startsWith(app)) {
            cssModulePath = "./" + cssModulePath.substr(app.length);
        }
    }
    if (global.moduleExists(cssModulePath)) {
        parentPage.addCssFile(cssModulePath);
    }
    else {
        var cssFilePath = file_name_resolver_1.resolveFileName(fullComponentPathFilePathWithoutExt, "css");
        if (cssFilePath) {
            if (parentPage && typeof parentPage.addCssFile === "function") {
                parentPage.addCssFile(cssFilePath);
            }
            else {
                ensureTrace();
                trace.write("CSS file found but no page specified. Please specify page in the options!", trace.categories.Error, trace.messageType.error);
            }
        }
    }
    return result;
}
function getExports(instance) {
    var isView = !!instance._domId;
    if (!isView) {
        return instance.exports || instance;
    }
    var exportObject = instance.exports;
    var parent = instance.parent;
    while (exportObject === undefined && parent) {
        exportObject = parent.exports;
        parent = parent.parent;
    }
    return exportObject;
}
function parseInternal(value, context, uri, moduleNamePath) {
    var start;
    var ui;
    var errorFormat = (debug_1.debug && uri) ? xml2ui.SourceErrorFormat(uri) : xml2ui.PositionErrorFormat;
    var componentSourceTracker = (debug_1.debug && uri) ? xml2ui.ComponentSourceTracker(uri) : function () {
    };
    (start = new xml2ui.XmlStringParser(errorFormat))
        .pipe(new xml2ui.PlatformFilter())
        .pipe(new xml2ui.XmlStateParser(ui = new xml2ui.ComponentParser(context, errorFormat, componentSourceTracker, moduleNamePath)));
    start.parse(value);
    return ui.rootComponentModule;
}
var xml2ui;
(function (xml2ui) {
    var XmlProducerBase = (function () {
        function XmlProducerBase() {
        }
        XmlProducerBase.prototype.pipe = function (next) {
            this._next = next;
            return next;
        };
        XmlProducerBase.prototype.next = function (args) {
            this._next.parse(args);
        };
        return XmlProducerBase;
    }());
    xml2ui.XmlProducerBase = XmlProducerBase;
    var XmlStringParser = (function (_super) {
        __extends(XmlStringParser, _super);
        function XmlStringParser(error) {
            var _this = _super.call(this) || this;
            _this.error = error || PositionErrorFormat;
            return _this;
        }
        XmlStringParser.prototype.parse = function (value) {
            var _this = this;
            var xmlParser = new xml.XmlParser(function (args) {
                try {
                    _this.next(args);
                }
                catch (e) {
                    throw _this.error(e, args.position);
                }
            }, function (e, p) {
                throw _this.error(e, p);
            }, true);
            if (types_1.isString(value)) {
                xmlParser.parse(value);
            }
        };
        return XmlStringParser;
    }(XmlProducerBase));
    xml2ui.XmlStringParser = XmlStringParser;
    function PositionErrorFormat(e, p) {
        return new debug_1.ScopeError(e, "Parsing XML at " + p.line + ":" + p.column);
    }
    xml2ui.PositionErrorFormat = PositionErrorFormat;
    function SourceErrorFormat(uri) {
        return function (e, p) {
            var source = p ? new debug_1.Source(uri, p.line, p.column) : new debug_1.Source(uri, -1, -1);
            e = new debug_1.SourceError(e, source, "Building UI from XML.");
            return e;
        };
    }
    xml2ui.SourceErrorFormat = SourceErrorFormat;
    function ComponentSourceTracker(uri) {
        return function (component, p) {
            if (!debug_1.Source.get(component)) {
                var source = p ? new debug_1.Source(uri, p.line, p.column) : new debug_1.Source(uri, -1, -1);
                debug_1.Source.set(component, source);
            }
        };
    }
    xml2ui.ComponentSourceTracker = ComponentSourceTracker;
    var PlatformFilter = (function (_super) {
        __extends(PlatformFilter, _super);
        function PlatformFilter() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PlatformFilter.prototype.parse = function (args) {
            if (args.eventType === xml.ParserEventType.StartElement) {
                if (PlatformFilter.isPlatform(args.elementName)) {
                    if (this.currentPlatformContext) {
                        throw new Error("Already in '" + this.currentPlatformContext + "' platform context and cannot switch to '" + args.elementName + "' platform! Platform tags cannot be nested.");
                    }
                    this.currentPlatformContext = args.elementName;
                    return;
                }
            }
            if (args.eventType === xml.ParserEventType.EndElement) {
                if (PlatformFilter.isPlatform(args.elementName)) {
                    this.currentPlatformContext = undefined;
                    return;
                }
            }
            if (this.currentPlatformContext && !PlatformFilter.isCurentPlatform(this.currentPlatformContext)) {
                return;
            }
            this.next(args);
        };
        PlatformFilter.isPlatform = function (value) {
            if (value) {
                var toLower = value.toLowerCase();
                return toLower === android || toLower === ios;
            }
            return false;
        };
        PlatformFilter.isCurentPlatform = function (value) {
            return value && value.toLowerCase() === platform_1.device.os.toLowerCase();
        };
        return PlatformFilter;
    }(XmlProducerBase));
    xml2ui.PlatformFilter = PlatformFilter;
    var XmlArgsReplay = (function (_super) {
        __extends(XmlArgsReplay, _super);
        function XmlArgsReplay(args, errorFormat) {
            var _this = _super.call(this) || this;
            _this.args = args;
            _this.error = errorFormat;
            return _this;
        }
        XmlArgsReplay.prototype.replay = function () {
            var _this = this;
            this.args.forEach(function (args) {
                try {
                    _this.next(args);
                }
                catch (e) {
                    throw _this.error(e, args.position);
                }
            });
        };
        return XmlArgsReplay;
    }(XmlProducerBase));
    xml2ui.XmlArgsReplay = XmlArgsReplay;
    var XmlStateParser = (function () {
        function XmlStateParser(state) {
            this.state = state;
        }
        XmlStateParser.prototype.parse = function (args) {
            this.state = this.state.parse(args);
        };
        return XmlStateParser;
    }());
    xml2ui.XmlStateParser = XmlStateParser;
    var TemplateParser = (function () {
        function TemplateParser(parent, templateProperty, setTemplateProperty) {
            if (setTemplateProperty === void 0) { setTemplateProperty = true; }
            this.parent = parent;
            this._context = templateProperty.context;
            this._recordedXmlStream = new Array();
            this._templateProperty = templateProperty;
            this._nestingLevel = 0;
            this._state = 0;
            this._setTemplateProperty = setTemplateProperty;
        }
        TemplateParser.prototype.parse = function (args) {
            if (args.eventType === xml.ParserEventType.StartElement) {
                this.parseStartElement(args.prefix, args.namespace, args.elementName, args.attributes);
            }
            else if (args.eventType === xml.ParserEventType.EndElement) {
                this.parseEndElement(args.prefix, args.elementName);
            }
            this._recordedXmlStream.push(args);
            return this._state === 2 ? this.parent : this;
        };
        Object.defineProperty(TemplateParser.prototype, "elementName", {
            get: function () {
                return this._templateProperty.elementName;
            },
            enumerable: true,
            configurable: true
        });
        TemplateParser.prototype.parseStartElement = function (prefix, namespace, elementName, attributes) {
            if (this._state === 0) {
                this._state = 1;
            }
            else if (this._state === 2) {
                throw new Error("Template must have exactly one root element but multiple elements were found.");
            }
            this._nestingLevel++;
        };
        TemplateParser.prototype.parseEndElement = function (prefix, elementName) {
            if (this._state === 0) {
                throw new Error("Template must have exactly one root element but none was found.");
            }
            else if (this._state === 2) {
                throw new Error("No more closing elements expected for this template.");
            }
            this._nestingLevel--;
            if (this._nestingLevel === 0) {
                this._state = 2;
                if (this._setTemplateProperty && this._templateProperty.name in this._templateProperty.parent.component) {
                    var template = this.buildTemplate();
                    this._templateProperty.parent.component[this._templateProperty.name] = template;
                }
            }
        };
        TemplateParser.prototype.buildTemplate = function () {
            var _this = this;
            var context = this._context;
            var errorFormat = this._templateProperty.errorFormat;
            var sourceTracker = this._templateProperty.sourceTracker;
            var template = profiling_1.profile("Template()", function () {
                var start;
                var ui;
                (start = new xml2ui.XmlArgsReplay(_this._recordedXmlStream, errorFormat))
                    .pipe(new XmlStateParser(ui = new ComponentParser(context, errorFormat, sourceTracker)));
                start.replay();
                return ui.rootComponentModule.component;
            });
            return template;
        };
        return TemplateParser;
    }());
    xml2ui.TemplateParser = TemplateParser;
    var MultiTemplateParser = (function () {
        function MultiTemplateParser(parent, templateProperty) {
            this.parent = parent;
            this.templateProperty = templateProperty;
            this._childParsers = new Array();
        }
        Object.defineProperty(MultiTemplateParser.prototype, "value", {
            get: function () { return this._value; },
            enumerable: true,
            configurable: true
        });
        MultiTemplateParser.prototype.parse = function (args) {
            if (args.eventType === xml.ParserEventType.StartElement && args.elementName === "template") {
                var childParser = new TemplateParser(this, this.templateProperty, false);
                childParser["key"] = args.attributes["key"];
                this._childParsers.push(childParser);
                return childParser;
            }
            if (args.eventType === xml.ParserEventType.EndElement) {
                var name_1 = ComponentParser.getComplexPropertyName(args.elementName);
                if (name_1 === this.templateProperty.name) {
                    var templates = new Array();
                    for (var i = 0; i < this._childParsers.length; i++) {
                        templates.push({
                            key: this._childParsers[i]["key"],
                            createView: this._childParsers[i].buildTemplate()
                        });
                    }
                    this._value = templates;
                    return this.parent.parse(args);
                }
            }
            return this;
        };
        return MultiTemplateParser;
    }());
    xml2ui.MultiTemplateParser = MultiTemplateParser;
    var ComponentParser = (function () {
        function ComponentParser(context, errorFormat, sourceTracker, moduleNamePath) {
            this.moduleNamePath = moduleNamePath;
            this.parents = new Array();
            this.complexProperties = new Array();
            this.context = context;
            this.error = errorFormat;
            this.sourceTracker = sourceTracker;
        }
        ComponentParser.prototype.buildComponent = function (args) {
            if (args.prefix && args.namespace) {
                return loadCustomComponent(args.namespace, args.elementName, args.attributes, this.context, this.currentRootView, !this.currentRootView, this.moduleNamePath);
            }
            else {
                var namespace = args.namespace;
                if (defaultNameSpaceMatcher.test(namespace || "")) {
                    namespace = undefined;
                }
                return component_builder_1.getComponentModule(args.elementName, namespace, args.attributes, this.context, this.moduleNamePath, !this.currentRootView);
            }
        };
        ComponentParser.prototype.parse = function (args) {
            var parent = this.parents[this.parents.length - 1];
            var complexProperty = this.complexProperties[this.complexProperties.length - 1];
            if (args.eventType === xml.ParserEventType.StartElement) {
                if (ComponentParser.isComplexProperty(args.elementName)) {
                    var name = ComponentParser.getComplexPropertyName(args.elementName);
                    var complexProperty_1 = {
                        parent: parent,
                        name: name,
                        items: []
                    };
                    this.complexProperties.push(complexProperty_1);
                    if (ComponentParser.isKnownTemplate(name, parent.exports)) {
                        return new TemplateParser(this, {
                            context: (parent ? getExports(parent.component) : null) || this.context,
                            parent: parent,
                            name: name,
                            elementName: args.elementName,
                            templateItems: [],
                            errorFormat: this.error,
                            sourceTracker: this.sourceTracker
                        });
                    }
                    if (ComponentParser.isKnownMultiTemplate(name, parent.exports)) {
                        var parser = new MultiTemplateParser(this, {
                            context: (parent ? getExports(parent.component) : null) || this.context,
                            parent: parent,
                            name: name,
                            elementName: args.elementName,
                            templateItems: [],
                            errorFormat: this.error,
                            sourceTracker: this.sourceTracker
                        });
                        complexProperty_1.parser = parser;
                        return parser;
                    }
                }
                else {
                    var componentModule = this.buildComponent(args);
                    if (componentModule) {
                        this.sourceTracker(componentModule.component, args.position);
                        if (parent) {
                            if (complexProperty) {
                                ComponentParser.addToComplexProperty(parent, complexProperty, componentModule);
                            }
                            else if (parent.component._addChildFromBuilder) {
                                parent.component._addChildFromBuilder(args.elementName, componentModule.component);
                            }
                        }
                        else if (this.parents.length === 0) {
                            this.rootComponentModule = componentModule;
                            if (this.rootComponentModule) {
                                this.currentRootView = this.rootComponentModule.component;
                                if (this.currentRootView.exports) {
                                    this.context = this.currentRootView.exports;
                                }
                            }
                        }
                        this.parents.push(componentModule);
                    }
                }
            }
            else if (args.eventType === xml.ParserEventType.EndElement) {
                if (ComponentParser.isComplexProperty(args.elementName)) {
                    if (complexProperty) {
                        if (complexProperty.parser) {
                            parent.component[complexProperty.name] = complexProperty.parser.value;
                        }
                        else if (parent && parent.component._addArrayFromBuilder) {
                            parent.component._addArrayFromBuilder(complexProperty.name, complexProperty.items);
                            complexProperty.items = [];
                        }
                    }
                    this.complexProperties.pop();
                }
                else {
                    this.parents.pop();
                }
            }
            return this;
        };
        ComponentParser.isComplexProperty = function (name) {
            return types_1.isString(name) && name.indexOf(".") !== -1;
        };
        ComponentParser.getComplexPropertyName = function (fullName) {
            var name;
            if (types_1.isString(fullName)) {
                var names = fullName.split(".");
                name = names[names.length - 1];
            }
            return name;
        };
        ComponentParser.isKnownTemplate = function (name, exports) {
            return ComponentParser.KNOWNTEMPLATES in exports && exports[ComponentParser.KNOWNTEMPLATES] && name in exports[ComponentParser.KNOWNTEMPLATES];
        };
        ComponentParser.isKnownMultiTemplate = function (name, exports) {
            return ComponentParser.KNOWNMULTITEMPLATES in exports && exports[ComponentParser.KNOWNMULTITEMPLATES] && name in exports[ComponentParser.KNOWNMULTITEMPLATES];
        };
        ComponentParser.addToComplexProperty = function (parent, complexProperty, elementModule) {
            var parentComponent = parent.component;
            if (ComponentParser.isKnownCollection(complexProperty.name, parent.exports)) {
                complexProperty.items.push(elementModule.component);
            }
            else if (parentComponent._addChildFromBuilder) {
                parentComponent._addChildFromBuilder(complexProperty.name, elementModule.component);
            }
            else {
                parentComponent[complexProperty.name] = elementModule.component;
            }
        };
        ComponentParser.isKnownCollection = function (name, context) {
            return ComponentParser.KNOWNCOLLECTIONS in context && context[ComponentParser.KNOWNCOLLECTIONS] && name in context[ComponentParser.KNOWNCOLLECTIONS];
        };
        ComponentParser.KNOWNCOLLECTIONS = "knownCollections";
        ComponentParser.KNOWNTEMPLATES = "knownTemplates";
        ComponentParser.KNOWNMULTITEMPLATES = "knownMultiTemplates";
        __decorate([
            profiling_1.profile
        ], ComponentParser.prototype, "buildComponent", null);
        return ComponentParser;
    }());
    xml2ui.ComponentParser = ComponentParser;
})(xml2ui || (xml2ui = {}));
//# sourceMappingURL=builder.js.map