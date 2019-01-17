Object.defineProperty(exports, "__esModule", { value: true });
var observable_1 = require("../../../data/observable");
var Style = (function (_super) {
    __extends(Style, _super);
    function Style(view) {
        var _this = _super.call(this) || this;
        _this.view = view;
        return _this;
    }
    Style.prototype.toString = function () {
        return this.view + ".style";
    };
    return Style;
}(observable_1.Observable));
exports.Style = Style;
Style.prototype.PropertyBag = (function () {
    function class_1() {
    }
    return class_1;
}());
//# sourceMappingURL=style.js.map