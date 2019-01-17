Object.defineProperty(exports, "__esModule", { value: true });
var view_1 = require("../core/view");
var Placeholder = (function (_super) {
    __extends(Placeholder, _super);
    function Placeholder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Placeholder_1 = Placeholder;
    Placeholder.prototype.createNativeView = function () {
        var args = { eventName: Placeholder_1.creatingViewEvent, object: this, view: undefined, context: this._context };
        this.notify(args);
        return args.view;
    };
    var Placeholder_1;
    Placeholder.creatingViewEvent = "creatingView";
    Placeholder = Placeholder_1 = __decorate([
        view_1.CSSType("Placeholder")
    ], Placeholder);
    return Placeholder;
}(view_1.View));
exports.Placeholder = Placeholder;
//# sourceMappingURL=placeholder.js.map