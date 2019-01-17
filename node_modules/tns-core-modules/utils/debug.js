Object.defineProperty(exports, "__esModule", { value: true });
var file_system_1 = require("../file-system");
var platform_1 = require("../platform");
exports.debug = true;
var applicationRootPath;
function ensureAppRootPath() {
    if (!applicationRootPath) {
        applicationRootPath = file_system_1.knownFolders.currentApp().path;
        applicationRootPath = applicationRootPath.substr(0, applicationRootPath.length - "app/".length);
    }
}
var Source = (function () {
    function Source(uri, line, column) {
        ensureAppRootPath();
        if (uri.length > applicationRootPath.length && uri.substr(0, applicationRootPath.length) === applicationRootPath) {
            this._uri = "file://" + uri.substr(applicationRootPath.length);
        }
        else {
            this._uri = uri;
        }
        this._line = line;
        this._column = column;
    }
    Object.defineProperty(Source.prototype, "uri", {
        get: function () { return this._uri; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Source.prototype, "line", {
        get: function () { return this._line; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Source.prototype, "column", {
        get: function () { return this._column; },
        enumerable: true,
        configurable: true
    });
    Source.prototype.toString = function () {
        return this._uri + ":" + this._line + ":" + this._column;
    };
    Source.get = function (object) {
        return object[Source._source];
    };
    Source.set = function (object, src) {
        object[Source._source] = src;
    };
    Source._source = Symbol("source");
    return Source;
}());
exports.Source = Source;
var ScopeError = (function (_super) {
    __extends(ScopeError, _super);
    function ScopeError(inner, message) {
        var _this = this;
        var formattedMessage;
        if (message && inner.message) {
            formattedMessage = message + "\n > " + inner.message.replace("\n", "\n  ");
        }
        else {
            formattedMessage = message || inner.message || undefined;
        }
        _this = _super.call(this, formattedMessage) || this;
        _this.stack = platform_1.isAndroid ? "Error: " + _this.message + "\n" + inner.stack.substr(inner.stack.indexOf("\n") + 1) : inner.stack;
        _this.message = formattedMessage;
        return _this;
    }
    return ScopeError;
}(Error));
exports.ScopeError = ScopeError;
var SourceError = (function (_super) {
    __extends(SourceError, _super);
    function SourceError(child, source, message) {
        return _super.call(this, child, message ? message + " @" + source + "" : source + "") || this;
    }
    return SourceError;
}(ScopeError));
exports.SourceError = SourceError;
//# sourceMappingURL=debug.js.map