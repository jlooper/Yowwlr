function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var image_common_1 = require("./image-common");
var file_system_1 = require("../../file-system");
var platform = require("../../platform");
__export(require("./image-common"));
var FILE_PREFIX = "file:///";
var ASYNC = "async";
var AndroidImageView;
var ImageLoadedListener;
function initializeImageLoadedListener() {
    if (ImageLoadedListener) {
        return;
    }
    var ImageLoadedListenerImpl = (function (_super) {
        __extends(ImageLoadedListenerImpl, _super);
        function ImageLoadedListenerImpl(owner) {
            var _this = _super.call(this) || this;
            _this.owner = owner;
            return global.__native(_this);
        }
        ImageLoadedListenerImpl.prototype.onImageLoaded = function (success) {
            var owner = this.owner;
            if (owner) {
                owner.isLoading = false;
            }
        };
        ImageLoadedListenerImpl = __decorate([
            Interfaces([org.nativescript.widgets.image.Worker.OnImageLoadedListener])
        ], ImageLoadedListenerImpl);
        return ImageLoadedListenerImpl;
    }(java.lang.Object));
    ImageLoadedListener = ImageLoadedListenerImpl;
}
var Image = (function (_super) {
    __extends(Image, _super);
    function Image() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.useCache = true;
        return _this;
    }
    Image.prototype.createNativeView = function () {
        if (!AndroidImageView) {
            AndroidImageView = org.nativescript.widgets.ImageView;
        }
        return new AndroidImageView(this._context);
    };
    Image.prototype.initNativeView = function () {
        _super.prototype.initNativeView.call(this);
        initializeImageLoadedListener();
        var nativeView = this.nativeViewProtected;
        var listener = new ImageLoadedListener(this);
        nativeView.setImageLoadedListener(listener);
        nativeView.listener = listener;
    };
    Image.prototype.disposeNativeView = function () {
        this.nativeViewProtected.listener.owner = null;
        _super.prototype.disposeNativeView.call(this);
    };
    Image.prototype.resetNativeView = function () {
        _super.prototype.resetNativeView.call(this);
        this.nativeViewProtected.setImageMatrix(new android.graphics.Matrix());
    };
    Image.prototype._createImageSourceFromSrc = function (value) {
        var imageView = this.nativeViewProtected;
        if (!imageView) {
            return;
        }
        if (!value) {
            imageView.setUri(null, 0, 0, false, false, true);
            return;
        }
        var screen = platform.screen.mainScreen;
        var decodeWidth = Math.min(image_common_1.Length.toDevicePixels(this.decodeWidth, 0), screen.widthPixels);
        var decodeHeight = Math.min(image_common_1.Length.toDevicePixels(this.decodeHeight, 0), screen.heightPixels);
        var keepAspectRatio = this._calculateKeepAspectRatio();
        if (value instanceof image_common_1.ImageAsset) {
            if (value.options) {
                decodeWidth = value.options.width || decodeWidth;
                decodeHeight = value.options.height || decodeHeight;
                keepAspectRatio = !!value.options.keepAspectRatio;
            }
            value = value.android;
        }
        var async = this.loadMode === ASYNC;
        if (typeof value === "string" || value instanceof String) {
            value = value.trim();
            this.isLoading = true;
            if (image_common_1.isDataURI(value)) {
                _super.prototype._createImageSourceFromSrc.call(this, value);
            }
            else if (image_common_1.isFileOrResourcePath(value)) {
                if (value.indexOf(image_common_1.RESOURCE_PREFIX) === 0) {
                    imageView.setUri(value, decodeWidth, decodeHeight, keepAspectRatio, this.useCache, async);
                }
                else {
                    var fileName = value;
                    if (fileName.indexOf("~/") === 0) {
                        fileName = file_system_1.knownFolders.currentApp().path + "/" + fileName.replace("~/", "");
                    }
                    imageView.setUri(FILE_PREFIX + fileName, decodeWidth, decodeHeight, keepAspectRatio, this.useCache, async);
                }
            }
            else {
                imageView.setUri(value, decodeWidth, decodeHeight, keepAspectRatio, this.useCache, true);
            }
        }
        else {
            _super.prototype._createImageSourceFromSrc.call(this, value);
        }
    };
    Image.prototype._calculateKeepAspectRatio = function () {
        return this.stretch === "fill" ? false : true;
    };
    Image.prototype[image_common_1.stretchProperty.getDefault] = function () {
        return "aspectFit";
    };
    Image.prototype[image_common_1.stretchProperty.setNative] = function (value) {
        switch (value) {
            case "aspectFit":
                this.nativeViewProtected.setScaleType(android.widget.ImageView.ScaleType.FIT_CENTER);
                break;
            case "aspectFill":
                this.nativeViewProtected.setScaleType(android.widget.ImageView.ScaleType.CENTER_CROP);
                break;
            case "fill":
                this.nativeViewProtected.setScaleType(android.widget.ImageView.ScaleType.FIT_XY);
                break;
            case "none":
            default:
                this.nativeViewProtected.setScaleType(android.widget.ImageView.ScaleType.MATRIX);
                break;
        }
    };
    Image.prototype[image_common_1.tintColorProperty.getDefault] = function () {
        return undefined;
    };
    Image.prototype[image_common_1.tintColorProperty.setNative] = function (value) {
        if (value === undefined) {
            this.nativeViewProtected.clearColorFilter();
        }
        else {
            this.nativeViewProtected.setColorFilter(value.android);
        }
    };
    Image.prototype[image_common_1.imageSourceProperty.getDefault] = function () {
        return undefined;
    };
    Image.prototype[image_common_1.imageSourceProperty.setNative] = function (value) {
        var nativeView = this.nativeViewProtected;
        if (value && value.android) {
            var rotation = value.rotationAngle ? value.rotationAngle : 0;
            nativeView.setRotationAngle(rotation);
            nativeView.setImageBitmap(value.android);
        }
        else {
            nativeView.setRotationAngle(0);
            nativeView.setImageBitmap(null);
        }
    };
    Image.prototype[image_common_1.srcProperty.getDefault] = function () {
        return undefined;
    };
    Image.prototype[image_common_1.srcProperty.setNative] = function (value) {
        this._createImageSourceFromSrc(value);
    };
    return Image;
}(image_common_1.ImageBase));
exports.Image = Image;
//# sourceMappingURL=image.android.js.map