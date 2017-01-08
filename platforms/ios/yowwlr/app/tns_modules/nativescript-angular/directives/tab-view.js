var core_1 = require("@angular/core");
var tab_view_1 = require("ui/tab-view");
var utils = require("../common/utils");
var trace_1 = require("../trace");
var lang_facade_1 = require("../lang-facade");
var TabViewDirective = (function () {
    function TabViewDirective(element) {
        this.tabView = element.nativeElement;
    }
    Object.defineProperty(TabViewDirective.prototype, "selectedIndex", {
        get: function () {
            return this._selectedIndex;
        },
        set: function (value) {
            this._selectedIndex = utils.convertToInt(value);
            if (this.viewInitialized) {
                this.tabView.selectedIndex = this._selectedIndex;
            }
        },
        enumerable: true,
        configurable: true
    });
    TabViewDirective.prototype.ngAfterViewInit = function () {
        this.viewInitialized = true;
        trace_1.rendererLog("this._selectedIndex: " + this._selectedIndex);
        if (!lang_facade_1.isBlank(this._selectedIndex)) {
            this.tabView.selectedIndex = this._selectedIndex;
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], TabViewDirective.prototype, "selectedIndex", null);
    TabViewDirective = __decorate([
        core_1.Directive({
            selector: "TabView",
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], TabViewDirective);
    return TabViewDirective;
}());
exports.TabViewDirective = TabViewDirective;
var TabViewItemDirective = (function () {
    function TabViewItemDirective(owner, templateRef, viewContainer) {
        this.owner = owner;
        this.templateRef = templateRef;
        this.viewContainer = viewContainer;
    }
    Object.defineProperty(TabViewItemDirective.prototype, "title", {
        get: function () {
            return this._title;
        },
        set: function (value) {
            if (this._title !== value) {
                this._title = value;
                this.ensureItem();
                this.item.title = this._title;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabViewItemDirective.prototype, "iconSource", {
        get: function () {
            return this._iconSource;
        },
        set: function (value) {
            if (this._iconSource !== value) {
                this._iconSource = value;
                this.ensureItem();
                this.item.iconSource = this._iconSource;
            }
        },
        enumerable: true,
        configurable: true
    });
    TabViewItemDirective.prototype.ensureItem = function () {
        if (!this.item) {
            this.item = new tab_view_1.TabViewItem();
        }
    };
    TabViewItemDirective.prototype.ngOnInit = function () {
        this.ensureItem();
        if (this.config) {
            this.item.title = this._title || this.config.title;
            this.item.iconSource = this._iconSource || this.config.iconSource;
        }
        var viewRef = this.viewContainer.createEmbeddedView(this.templateRef);
        // Filter out text nodes, etc
        var realViews = viewRef.rootNodes.filter(function (node) {
            return node.nodeName && node.nodeName !== "#text";
        });
        if (realViews.length > 0) {
            this.item.view = realViews[0];
            var newItems = (this.owner.tabView.items || []).concat([this.item]);
            this.owner.tabView.items = newItems;
        }
    };
    __decorate([
        core_1.Input("tabItem"), 
        __metadata('design:type', Object)
    ], TabViewItemDirective.prototype, "config", void 0);
    __decorate([
        // tslint:disable-line:no-input-rename
        core_1.Input(), 
        __metadata('design:type', Object)
    ], TabViewItemDirective.prototype, "title", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], TabViewItemDirective.prototype, "iconSource", null);
    TabViewItemDirective = __decorate([
        core_1.Directive({
            selector: "[tabItem]" // tslint:disable-line:directive-selector
        }), 
        __metadata('design:paramtypes', [TabViewDirective, core_1.TemplateRef, core_1.ViewContainerRef])
    ], TabViewItemDirective);
    return TabViewItemDirective;
}());
exports.TabViewItemDirective = TabViewItemDirective;
//# sourceMappingURL=tab-view.js.map