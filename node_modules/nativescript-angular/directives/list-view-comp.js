Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var templated_items_comp_1 = require("./templated-items-comp");
var ListViewComponent = /** @class */ (function (_super) {
    __extends(ListViewComponent, _super);
    function ListViewComponent(_elementRef, _iterableDiffers) {
        return _super.call(this, _elementRef, _iterableDiffers) || this;
    }
    ListViewComponent_1 = ListViewComponent;
    Object.defineProperty(ListViewComponent.prototype, "nativeElement", {
        get: function () {
            return this.templatedItemsView;
        },
        enumerable: true,
        configurable: true
    });
    var ListViewComponent_1;
    ListViewComponent = ListViewComponent_1 = __decorate([
        core_1.Component({
            selector: "ListView",
            template: "\n        <DetachedContainer>\n            <Placeholder #loader></Placeholder>\n        </DetachedContainer>",
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            providers: [{ provide: templated_items_comp_1.TEMPLATED_ITEMS_COMPONENT, useExisting: core_1.forwardRef(function () { return ListViewComponent_1; }) }]
        }),
        __metadata("design:paramtypes", [core_1.ElementRef,
            core_1.IterableDiffers])
    ], ListViewComponent);
    return ListViewComponent;
}(templated_items_comp_1.TemplatedItemsComponent));
exports.ListViewComponent = ListViewComponent;
//# sourceMappingURL=list-view-comp.js.map