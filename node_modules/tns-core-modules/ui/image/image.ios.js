function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var image_common_1 = require("./image-common");
__export(require("./image-common"));
var Image = (function (_super) {
    __extends(Image, _super);
    function Image() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._imageSourceAffectsLayout = true;
        return _this;
    }
    Image.prototype.createNativeView = function () {
        var imageView = UIImageView.new();
        imageView.contentMode = 1;
        imageView.userInteractionEnabled = true;
        return imageView;
    };
    Image.prototype.initNativeView = function () {
        _super.prototype.initNativeView.call(this);
        this._setNativeClipToBounds();
    };
    Image.prototype.setTintColor = function (value) {
        if (value && this.nativeViewProtected.image && !this._templateImageWasCreated) {
            this.nativeViewProtected.image = this.nativeViewProtected.image.imageWithRenderingMode(2);
            this._templateImageWasCreated = true;
        }
        else if (!value && this.nativeViewProtected.image && this._templateImageWasCreated) {
            this._templateImageWasCreated = false;
            this.nativeViewProtected.image = this.nativeViewProtected.image.imageWithRenderingMode(0);
        }
        this.nativeViewProtected.tintColor = value ? value.ios : null;
    };
    Image.prototype._setNativeImage = function (nativeImage) {
        this.nativeViewProtected.image = nativeImage;
        this._templateImageWasCreated = false;
        this.setTintColor(this.style.tintColor);
        if (this._imageSourceAffectsLayout) {
            this.requestLayout();
        }
    };
    Image.prototype._setNativeClipToBounds = function () {
        this.nativeViewProtected.clipsToBounds = true;
    };
    Image.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        var width = image_common_1.layout.getMeasureSpecSize(widthMeasureSpec);
        var widthMode = image_common_1.layout.getMeasureSpecMode(widthMeasureSpec);
        var height = image_common_1.layout.getMeasureSpecSize(heightMeasureSpec);
        var heightMode = image_common_1.layout.getMeasureSpecMode(heightMeasureSpec);
        var nativeWidth = this.imageSource ? image_common_1.layout.toDevicePixels(this.imageSource.width) : 0;
        var nativeHeight = this.imageSource ? image_common_1.layout.toDevicePixels(this.imageSource.height) : 0;
        var measureWidth = Math.max(nativeWidth, this.effectiveMinWidth);
        var measureHeight = Math.max(nativeHeight, this.effectiveMinHeight);
        var finiteWidth = widthMode !== image_common_1.layout.UNSPECIFIED;
        var finiteHeight = heightMode !== image_common_1.layout.UNSPECIFIED;
        this._imageSourceAffectsLayout = widthMode !== image_common_1.layout.EXACTLY || heightMode !== image_common_1.layout.EXACTLY;
        if (nativeWidth !== 0 && nativeHeight !== 0 && (finiteWidth || finiteHeight)) {
            var scale = Image.computeScaleFactor(width, height, finiteWidth, finiteHeight, nativeWidth, nativeHeight, this.stretch);
            var resultW = Math.round(nativeWidth * scale.width);
            var resultH = Math.round(nativeHeight * scale.height);
            measureWidth = finiteWidth ? Math.min(resultW, width) : resultW;
            measureHeight = finiteHeight ? Math.min(resultH, height) : resultH;
            if (image_common_1.traceEnabled()) {
                image_common_1.traceWrite("Image stretch: " + this.stretch +
                    ", nativeWidth: " + nativeWidth +
                    ", nativeHeight: " + nativeHeight, image_common_1.traceCategories.Layout);
            }
        }
        var widthAndState = Image.resolveSizeAndState(measureWidth, width, widthMode, 0);
        var heightAndState = Image.resolveSizeAndState(measureHeight, height, heightMode, 0);
        this.setMeasuredDimension(widthAndState, heightAndState);
    };
    Image.computeScaleFactor = function (measureWidth, measureHeight, widthIsFinite, heightIsFinite, nativeWidth, nativeHeight, imageStretch) {
        var scaleW = 1;
        var scaleH = 1;
        if ((imageStretch === "aspectFill" || imageStretch === "aspectFit" || imageStretch === "fill") &&
            (widthIsFinite || heightIsFinite)) {
            scaleW = (nativeWidth > 0) ? measureWidth / nativeWidth : 0;
            scaleH = (nativeHeight > 0) ? measureHeight / nativeHeight : 0;
            if (!widthIsFinite) {
                scaleW = scaleH;
            }
            else if (!heightIsFinite) {
                scaleH = scaleW;
            }
            else {
                switch (imageStretch) {
                    case "aspectFit":
                        scaleH = scaleW < scaleH ? scaleW : scaleH;
                        scaleW = scaleH;
                        break;
                    case "aspectFill":
                        scaleH = scaleW > scaleH ? scaleW : scaleH;
                        scaleW = scaleH;
                        break;
                }
            }
        }
        return { width: scaleW, height: scaleH };
    };
    Image.prototype[image_common_1.stretchProperty.setNative] = function (value) {
        switch (value) {
            case "aspectFit":
                this.nativeViewProtected.contentMode = 1;
                break;
            case "aspectFill":
                this.nativeViewProtected.contentMode = 2;
                break;
            case "fill":
                this.nativeViewProtected.contentMode = 0;
                break;
            case "none":
            default:
                this.nativeViewProtected.contentMode = 9;
                break;
        }
    };
    Image.prototype[image_common_1.tintColorProperty.setNative] = function (value) {
        this.setTintColor(value);
    };
    Image.prototype[image_common_1.imageSourceProperty.setNative] = function (value) {
        this._setNativeImage(value ? value.ios : null);
    };
    Image.prototype[image_common_1.srcProperty.setNative] = function (value) {
        this._createImageSourceFromSrc(value);
    };
    return Image;
}(image_common_1.ImageBase));
exports.Image = Image;
//# sourceMappingURL=image.ios.js.map