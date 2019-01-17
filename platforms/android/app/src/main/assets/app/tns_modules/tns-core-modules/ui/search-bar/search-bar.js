function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var font_1 = require("../styling/font");
var search_bar_common_1 = require("./search-bar-common");
var utils_1 = require("../../utils/utils");
__export(require("./search-bar-common"));
var SEARCHTEXT = Symbol("searchText");
var QUERY = Symbol("query");
var QueryTextListener;
var CloseListener;
function initializeNativeClasses() {
    if (QueryTextListener) {
        return;
    }
    var CompatQueryTextListenerImpl = (function (_super) {
        __extends(CompatQueryTextListenerImpl, _super);
        function CompatQueryTextListenerImpl(owner) {
            var _this = _super.call(this) || this;
            _this.owner = owner;
            return global.__native(_this);
        }
        CompatQueryTextListenerImpl.prototype.onQueryTextChange = function (newText) {
            var owner = this.owner;
            search_bar_common_1.textProperty.nativeValueChange(owner, newText);
            if (newText === "" && this[SEARCHTEXT] !== newText) {
                owner._emit(search_bar_common_1.SearchBarBase.clearEvent);
            }
            this[SEARCHTEXT] = newText;
            this[QUERY] = undefined;
            return true;
        };
        CompatQueryTextListenerImpl.prototype.onQueryTextSubmit = function (query) {
            var owner = this.owner;
            if (query !== "" && this[QUERY] !== query) {
                owner._emit(search_bar_common_1.SearchBarBase.submitEvent);
            }
            this[QUERY] = query;
            return true;
        };
        CompatQueryTextListenerImpl = __decorate([
            Interfaces([android.support.v7.widget.SearchView.OnQueryTextListener])
        ], CompatQueryTextListenerImpl);
        return CompatQueryTextListenerImpl;
    }(java.lang.Object));
    var CompatCloseListenerImpl = (function (_super) {
        __extends(CompatCloseListenerImpl, _super);
        function CompatCloseListenerImpl(owner) {
            var _this = _super.call(this) || this;
            _this.owner = owner;
            return global.__native(_this);
        }
        CompatCloseListenerImpl.prototype.onClose = function () {
            this.owner._emit(search_bar_common_1.SearchBarBase.clearEvent);
            return true;
        };
        CompatCloseListenerImpl = __decorate([
            Interfaces([android.support.v7.widget.SearchView.OnCloseListener])
        ], CompatCloseListenerImpl);
        return CompatCloseListenerImpl;
    }(java.lang.Object));
    QueryTextListener = CompatQueryTextListenerImpl;
    CloseListener = CompatCloseListenerImpl;
}
function enableSearchView(nativeView, value) {
    nativeView.setEnabled(value);
    if (!(nativeView instanceof android.view.ViewGroup)) {
        return;
    }
    for (var i = 0; i < nativeView.getChildCount(); i++) {
        var child = nativeView.getChildAt(i);
        enableSearchView(child, value);
    }
}
function enableUserInteractionSearchView(nativeView, value) {
    nativeView.setClickable(value);
    nativeView.setFocusable(value);
    if (!(nativeView instanceof android.view.ViewGroup)) {
        return;
    }
    for (var i = 0; i < nativeView.getChildCount(); i++) {
        var child = nativeView.getChildAt(i);
        enableUserInteractionSearchView(child, value);
    }
}
var SearchBar = (function (_super) {
    __extends(SearchBar, _super);
    function SearchBar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SearchBar.prototype.dismissSoftInput = function () {
        utils_1.ad.dismissSoftInput(this.nativeViewProtected);
    };
    SearchBar.prototype.focus = function () {
        var result = _super.prototype.focus.call(this);
        if (result) {
            utils_1.ad.showSoftInput(this.nativeViewProtected);
        }
        return result;
    };
    SearchBar.prototype.createNativeView = function () {
        var nativeView = new android.support.v7.widget.SearchView(this._context);
        nativeView.setIconified(false);
        return nativeView;
    };
    SearchBar.prototype.initNativeView = function () {
        _super.prototype.initNativeView.call(this);
        var nativeView = this.nativeViewProtected;
        initializeNativeClasses();
        var queryTextListener = new QueryTextListener(this);
        nativeView.setOnQueryTextListener(queryTextListener);
        nativeView.queryTextListener = queryTextListener;
        var closeListener = new CloseListener(this);
        nativeView.setOnCloseListener(closeListener);
        nativeView.closeListener = closeListener;
    };
    SearchBar.prototype.disposeNativeView = function () {
        var nativeView = this.nativeViewProtected;
        nativeView.closeListener.owner = null;
        nativeView.queryTextListener.owner = null;
        this._searchPlate = null;
        this._searchTextView = null;
        _super.prototype.disposeNativeView.call(this);
    };
    SearchBar.prototype[search_bar_common_1.isEnabledProperty.setNative] = function (value) {
        enableSearchView(this.nativeViewProtected, value);
    };
    SearchBar.prototype[search_bar_common_1.isUserInteractionEnabledProperty.setNative] = function (value) {
        enableUserInteractionSearchView(this.nativeViewProtected, value);
    };
    SearchBar.prototype[search_bar_common_1.backgroundColorProperty.getDefault] = function () {
        var result = this.nativeViewProtected.getDrawingCacheBackgroundColor();
        return result;
    };
    SearchBar.prototype[search_bar_common_1.backgroundColorProperty.setNative] = function (value) {
        var color;
        if (typeof value === "number") {
            color = value;
        }
        else {
            color = value.android;
        }
        this.nativeViewProtected.setBackgroundColor(color);
        var searchPlate = this._getSearchPlate();
        searchPlate.setBackgroundColor(color);
    };
    SearchBar.prototype[search_bar_common_1.colorProperty.getDefault] = function () {
        var textView = this._getTextView();
        return textView.getCurrentTextColor();
    };
    SearchBar.prototype[search_bar_common_1.colorProperty.setNative] = function (value) {
        var color = (typeof value === "number") ? value : value.android;
        var textView = this._getTextView();
        textView.setTextColor(color);
    };
    SearchBar.prototype[search_bar_common_1.fontSizeProperty.getDefault] = function () {
        return { nativeSize: this._getTextView().getTextSize() };
    };
    SearchBar.prototype[search_bar_common_1.fontSizeProperty.setNative] = function (value) {
        if (typeof value === "number") {
            this._getTextView().setTextSize(value);
        }
        else {
            this._getTextView().setTextSize(android.util.TypedValue.COMPLEX_UNIT_PX, value.nativeSize);
        }
    };
    SearchBar.prototype[search_bar_common_1.fontInternalProperty.getDefault] = function () {
        return this._getTextView().getTypeface();
    };
    SearchBar.prototype[search_bar_common_1.fontInternalProperty.setNative] = function (value) {
        this._getTextView().setTypeface(value instanceof font_1.Font ? value.getAndroidTypeface() : value);
    };
    SearchBar.prototype[search_bar_common_1.backgroundInternalProperty.getDefault] = function () {
        return null;
    };
    SearchBar.prototype[search_bar_common_1.backgroundInternalProperty.setNative] = function (value) {
    };
    SearchBar.prototype[search_bar_common_1.textProperty.getDefault] = function () {
        return "";
    };
    SearchBar.prototype[search_bar_common_1.textProperty.setNative] = function (value) {
        var text = (value === null || value === undefined) ? "" : value.toString();
        this.nativeViewProtected.setQuery(text, false);
    };
    SearchBar.prototype[search_bar_common_1.hintProperty.getDefault] = function () {
        return null;
    };
    SearchBar.prototype[search_bar_common_1.hintProperty.setNative] = function (value) {
        if (value === null || value === undefined) {
            this.nativeViewProtected.setQueryHint(null);
        }
        else {
            this.nativeViewProtected.setQueryHint(value.toString());
        }
    };
    SearchBar.prototype[search_bar_common_1.textFieldBackgroundColorProperty.getDefault] = function () {
        var textView = this._getTextView();
        return textView.getBackground();
    };
    SearchBar.prototype[search_bar_common_1.textFieldBackgroundColorProperty.setNative] = function (value) {
        var textView = this._getTextView();
        if (value instanceof search_bar_common_1.Color) {
            textView.setBackgroundColor(value.android);
        }
        else {
            textView.setBackground(value);
        }
    };
    SearchBar.prototype[search_bar_common_1.textFieldHintColorProperty.getDefault] = function () {
        var textView = this._getTextView();
        return textView.getCurrentTextColor();
    };
    SearchBar.prototype[search_bar_common_1.textFieldHintColorProperty.setNative] = function (value) {
        var textView = this._getTextView();
        var color = value instanceof search_bar_common_1.Color ? value.android : value;
        textView.setHintTextColor(color);
    };
    SearchBar.prototype._getTextView = function () {
        if (!this._searchTextView) {
            var pkgName = this.nativeViewProtected.getContext().getPackageName();
            var id = this.nativeViewProtected.getContext().getResources().getIdentifier("search_src_text", "id", pkgName);
            this._searchTextView = this.nativeViewProtected.findViewById(id);
        }
        return this._searchTextView;
    };
    SearchBar.prototype._getSearchPlate = function () {
        if (!this._searchPlate) {
            var pkgName = this.nativeViewProtected.getContext().getPackageName();
            var id = this.nativeViewProtected.getContext().getResources().getIdentifier("search_plate", "id", pkgName);
            this._searchPlate = this.nativeViewProtected.findViewById(id);
        }
        return this._searchPlate;
    };
    return SearchBar;
}(search_bar_common_1.SearchBarBase));
exports.SearchBar = SearchBar;
//# sourceMappingURL=search-bar.js.map