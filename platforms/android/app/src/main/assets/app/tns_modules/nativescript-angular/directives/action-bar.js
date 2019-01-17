Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var action_bar_1 = require("tns-core-modules/ui/action-bar");
var page_1 = require("tns-core-modules/ui/page");
var lang_facade_1 = require("../lang-facade");
var element_registry_1 = require("../element-registry");
function isActionItem(view) {
    return view instanceof action_bar_1.ActionItem;
}
exports.isActionItem = isActionItem;
function isNavigationButton(view) {
    return view instanceof action_bar_1.NavigationButton;
}
exports.isNavigationButton = isNavigationButton;
var ɵ0 = function (parent, child, next) {
    if (element_registry_1.isInvisibleNode(child)) {
        return;
    }
    else if (isNavigationButton(child)) {
        parent.navigationButton = child;
        child.parentNode = parent;
    }
    else if (isActionItem(child)) {
        addActionItem(parent, child, next);
        child.parentNode = parent;
    }
    else if (element_registry_1.isView(child)) {
        parent.titleView = child;
    }
}, ɵ1 = function (parent, child) {
    if (element_registry_1.isInvisibleNode(child)) {
        return;
    }
    else if (isNavigationButton(child)) {
        if (parent.navigationButton === child) {
            parent.navigationButton = null;
        }
        child.parentNode = null;
    }
    else if (isActionItem(child)) {
        parent.actionItems.removeItem(child);
        child.parentNode = null;
    }
    else if (element_registry_1.isView(child) && parent.titleView && parent.titleView === child) {
        parent.titleView = null;
    }
};
exports.ɵ0 = ɵ0;
exports.ɵ1 = ɵ1;
var actionBarMeta = {
    skipAddToDom: true,
    insertChild: ɵ0,
    removeChild: ɵ1,
};
var addActionItem = function (bar, item, next) {
    if (next) {
        insertActionItemBefore(bar, item, next);
    }
    else {
        appendActionItem(bar, item);
    }
};
var ɵ2 = addActionItem;
exports.ɵ2 = ɵ2;
var insertActionItemBefore = function (bar, item, next) {
    var actionItems = bar.actionItems;
    var actionItemsCollection = actionItems.getItems();
    var indexToInsert = actionItemsCollection.indexOf(next);
    actionItemsCollection.splice(indexToInsert, 0, item);
    actionItems.setItems(actionItemsCollection);
};
var ɵ3 = insertActionItemBefore;
exports.ɵ3 = ɵ3;
var appendActionItem = function (bar, item) {
    bar.actionItems.addItem(item);
};
var ɵ4 = appendActionItem;
exports.ɵ4 = ɵ4;
element_registry_1.registerElement("ActionBar", function () { return require("tns-core-modules/ui/action-bar").ActionBar; }, actionBarMeta);
element_registry_1.registerElement("ActionItem", function () { return require("tns-core-modules/ui/action-bar").ActionItem; });
element_registry_1.registerElement("NavigationButton", function () { return require("tns-core-modules/ui/action-bar").NavigationButton; });
var ActionBarComponent = /** @class */ (function () {
    function ActionBarComponent(element, page) {
        this.element = element;
        this.page = page;
        if (!this.page) {
            throw new Error("Inside ActionBarComponent but no Page found in DI.");
        }
        if (lang_facade_1.isBlank(this.page.actionBarHidden)) {
            this.page.actionBarHidden = false;
        }
        this.page.actionBar = this.element.nativeElement;
        this.page.actionBar.update();
    }
    ActionBarComponent = __decorate([
        core_1.Component({
            selector: "ActionBar",
            template: "<ng-content></ng-content>"
        }),
        __metadata("design:paramtypes", [core_1.ElementRef, page_1.Page])
    ], ActionBarComponent);
    return ActionBarComponent;
}());
exports.ActionBarComponent = ActionBarComponent;
var ActionBarScope = /** @class */ (function () {
    function ActionBarScope(page) {
        this.page = page;
        if (!this.page) {
            throw new Error("Inside ActionBarScope but no Page found in DI.");
        }
    }
    ActionBarScope.prototype.onNavButtonInit = function (navBtn) {
        this.page.actionBar.navigationButton = navBtn.element.nativeElement;
    };
    ActionBarScope.prototype.onNavButtonDestroy = function (navBtn) {
        var nav = navBtn.element.nativeElement;
        if (nav && this.page.actionBar.navigationButton === nav) {
            this.page.actionBar.navigationButton = null;
        }
    };
    ActionBarScope.prototype.onActionInit = function (item) {
        this.page.actionBar.actionItems.addItem(item.element.nativeElement);
    };
    ActionBarScope.prototype.onActionDestroy = function (item) {
        if (item.element.nativeElement.actionBar) {
            this.page.actionBar.actionItems.removeItem(item.element.nativeElement);
        }
    };
    ActionBarScope = __decorate([
        core_1.Component({
            selector: "ActionBarExtension",
            template: ""
        }),
        __metadata("design:paramtypes", [page_1.Page])
    ], ActionBarScope);
    return ActionBarScope;
}());
exports.ActionBarScope = ActionBarScope;
var ActionItemDirective = /** @class */ (function () {
    function ActionItemDirective(element, ownerScope) {
        this.element = element;
        this.ownerScope = ownerScope;
        if (this.ownerScope) {
            this.ownerScope.onActionInit(this);
        }
    }
    ActionItemDirective.prototype.ngOnDestroy = function () {
        if (this.ownerScope) {
            this.ownerScope.onActionDestroy(this);
        }
    };
    ActionItemDirective = __decorate([
        core_1.Directive({
            selector: "ActionItem" // tslint:disable-line:directive-selector
        }),
        __param(1, core_1.Optional()),
        __metadata("design:paramtypes", [core_1.ElementRef, ActionBarScope])
    ], ActionItemDirective);
    return ActionItemDirective;
}());
exports.ActionItemDirective = ActionItemDirective;
var NavigationButtonDirective = /** @class */ (function () {
    function NavigationButtonDirective(element, ownerScope) {
        this.element = element;
        this.ownerScope = ownerScope;
        if (this.ownerScope) {
            this.ownerScope.onNavButtonInit(this);
        }
    }
    NavigationButtonDirective.prototype.ngOnDestroy = function () {
        if (this.ownerScope) {
            this.ownerScope.onNavButtonDestroy(this);
        }
    };
    NavigationButtonDirective = __decorate([
        core_1.Directive({
            selector: "NavigationButton" // tslint:disable-line:directive-selector
        }),
        __param(1, core_1.Optional()),
        __metadata("design:paramtypes", [core_1.ElementRef, ActionBarScope])
    ], NavigationButtonDirective);
    return NavigationButtonDirective;
}());
exports.NavigationButtonDirective = NavigationButtonDirective;
//# sourceMappingURL=action-bar.js.map