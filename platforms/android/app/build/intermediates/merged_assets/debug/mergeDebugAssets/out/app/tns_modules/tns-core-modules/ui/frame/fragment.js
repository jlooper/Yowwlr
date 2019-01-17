Object.defineProperty(exports, "__esModule", { value: true });
var frame_1 = require("./frame");
var FragmentClass = (function (_super) {
    __extends(FragmentClass, _super);
    function FragmentClass() {
        var _this = _super.call(this) || this;
        return global.__native(_this);
    }
    FragmentClass.prototype.onHiddenChanged = function (hidden) {
        this._callbacks.onHiddenChanged(this, hidden, _super.prototype.onHiddenChanged);
    };
    FragmentClass.prototype.onCreateAnimator = function (transit, enter, nextAnim) {
        return this._callbacks.onCreateAnimator(this, transit, enter, nextAnim, _super.prototype.onCreateAnimator);
    };
    FragmentClass.prototype.onStop = function () {
        this._callbacks.onStop(this, _super.prototype.onStop);
    };
    FragmentClass.prototype.onCreate = function (savedInstanceState) {
        if (!this._callbacks) {
            frame_1.setFragmentCallbacks(this);
        }
        this.setHasOptionsMenu(true);
        this._callbacks.onCreate(this, savedInstanceState, _super.prototype.onCreate);
    };
    FragmentClass.prototype.onCreateView = function (inflater, container, savedInstanceState) {
        var result = this._callbacks.onCreateView(this, inflater, container, savedInstanceState, _super.prototype.onCreateView);
        return result;
    };
    FragmentClass.prototype.onSaveInstanceState = function (outState) {
        this._callbacks.onSaveInstanceState(this, outState, _super.prototype.onSaveInstanceState);
    };
    FragmentClass.prototype.onDestroyView = function () {
        this._callbacks.onDestroyView(this, _super.prototype.onDestroyView);
    };
    FragmentClass.prototype.onDestroy = function () {
        this._callbacks.onDestroy(this, _super.prototype.onDestroy);
    };
    FragmentClass.prototype.toString = function () {
        var callbacks = this._callbacks;
        if (callbacks) {
            return callbacks.toStringOverride(this, _super.prototype.toString);
        }
        else {
            _super.prototype.toString.call(this);
        }
    };
    FragmentClass = __decorate([
        JavaProxy("com.tns.FragmentClass")
    ], FragmentClass);
    return FragmentClass;
}(org.nativescript.widgets.FragmentBase));
frame_1.setFragmentClass(FragmentClass);
//# sourceMappingURL=fragment.js.map