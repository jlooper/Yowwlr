Object.defineProperty(exports, "__esModule", { value: true });
var file_system_1 = require("../file-system");
var utils_1 = require("../utils/utils");
exports.isFileOrResourcePath = utils_1.isFileOrResourcePath;
var http;
function ensureHttp() {
    if (!http) {
        http = require("../http");
    }
}
var ImageSource = (function () {
    function ImageSource() {
    }
    ImageSource.prototype.fromAsset = function (asset) {
        return new Promise(function (resolve, reject) {
            asset.getImageAsync(function (image, err) {
                if (image) {
                    resolve(fromNativeSource(image));
                }
                else {
                    reject(err);
                }
            });
        });
    };
    ImageSource.prototype.loadFromResource = function (name) {
        this.ios = UIImage.tns_safeImageNamed(name) || UIImage.tns_safeImageNamed(name + ".jpg");
        return this.ios != null;
    };
    ImageSource.prototype.fromResource = function (name) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                UIImage.tns_safeDecodeImageNamedCompletion(name, function (image) {
                    if (image) {
                        _this.ios = image;
                        resolve(true);
                    }
                    else {
                        UIImage.tns_safeDecodeImageNamedCompletion(name + ".jpg", function (image) {
                            _this.ios = image;
                            resolve(true);
                        });
                    }
                });
            }
            catch (ex) {
                reject(ex);
            }
        });
    };
    ImageSource.prototype.loadFromFile = function (path) {
        this.ios = UIImage.imageWithContentsOfFile(getFileName(path));
        return this.ios != null;
    };
    ImageSource.prototype.fromFile = function (path) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                UIImage.tns_decodeImageWidthContentsOfFileCompletion(getFileName(path), function (image) {
                    _this.ios = image;
                    resolve(true);
                });
            }
            catch (ex) {
                reject(ex);
            }
        });
    };
    ImageSource.prototype.loadFromData = function (data) {
        this.ios = UIImage.imageWithData(data);
        return this.ios != null;
    };
    ImageSource.prototype.fromData = function (data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                UIImage.tns_decodeImageWithDataCompletion(data, function (image) {
                    _this.ios = image;
                    resolve(true);
                });
            }
            catch (ex) {
                reject(ex);
            }
        });
    };
    ImageSource.prototype.loadFromBase64 = function (source) {
        if (typeof source === "string") {
            var data = NSData.alloc().initWithBase64EncodedStringOptions(source, 1);
            this.ios = UIImage.imageWithData(data);
        }
        return this.ios != null;
    };
    ImageSource.prototype.fromBase64 = function (source) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var data = NSData.alloc().initWithBase64EncodedStringOptions(source, 1);
                UIImage.imageWithData["async"](UIImage, [data]).then(function (image) {
                    _this.ios = image;
                    resolve(true);
                });
            }
            catch (ex) {
                reject(ex);
            }
        });
    };
    ImageSource.prototype.setNativeSource = function (source) {
        if (source && !(source instanceof UIImage)) {
            throw new Error("The method setNativeSource() expects UIImage instance.");
        }
        this.ios = source;
    };
    ImageSource.prototype.saveToFile = function (path, format, quality) {
        if (!this.ios) {
            return false;
        }
        if (quality) {
            quality = (quality - 0) / (100 - 0);
        }
        var data = getImageData(this.ios, format, quality);
        if (data) {
            return NSFileManager.defaultManager.createFileAtPathContentsAttributes(path, data, null);
        }
        return false;
    };
    ImageSource.prototype.toBase64String = function (format, quality) {
        var res = null;
        if (!this.ios) {
            return res;
        }
        if (quality) {
            quality = (quality - 0) / (100 - 0);
        }
        var data = getImageData(this.ios, format, quality);
        if (data) {
            res = data.base64Encoding();
        }
        return res;
    };
    Object.defineProperty(ImageSource.prototype, "height", {
        get: function () {
            if (this.ios) {
                return this.ios.size.height;
            }
            return NaN;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImageSource.prototype, "width", {
        get: function () {
            if (this.ios) {
                return this.ios.size.width;
            }
            return NaN;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImageSource.prototype, "rotationAngle", {
        get: function () {
            return NaN;
        },
        enumerable: true,
        configurable: true
    });
    return ImageSource;
}());
exports.ImageSource = ImageSource;
function getFileName(path) {
    var fileName = typeof path === "string" ? path.trim() : "";
    if (fileName.indexOf("~/") === 0) {
        fileName = file_system_1.path.join(file_system_1.knownFolders.currentApp().path, fileName.replace("~/", ""));
    }
    return fileName;
}
function getImageData(instance, format, quality) {
    if (quality === void 0) { quality = 0.9; }
    var data = null;
    switch (format) {
        case "png":
            data = UIImagePNGRepresentation(instance);
            break;
        case "jpeg":
        case "jpg":
            data = UIImageJPEGRepresentation(instance, quality);
            break;
    }
    return data;
}
function fromAsset(asset) {
    var image = new ImageSource();
    return image.fromAsset(asset);
}
exports.fromAsset = fromAsset;
function fromResource(name) {
    var image = new ImageSource();
    return image.loadFromResource(name) ? image : null;
}
exports.fromResource = fromResource;
function fromFile(path) {
    var image = new ImageSource();
    return image.loadFromFile(path) ? image : null;
}
exports.fromFile = fromFile;
function fromData(data) {
    var image = new ImageSource();
    return image.loadFromData(data) ? image : null;
}
exports.fromData = fromData;
function fromBase64(source) {
    var image = new ImageSource();
    return image.loadFromBase64(source) ? image : null;
}
exports.fromBase64 = fromBase64;
function fromNativeSource(source) {
    var imageSource = new ImageSource();
    imageSource.setNativeSource(source);
    return imageSource;
}
exports.fromNativeSource = fromNativeSource;
function fromUrl(url) {
    ensureHttp();
    return http.getImage(url);
}
exports.fromUrl = fromUrl;
function fromFileOrResource(path) {
    if (!utils_1.isFileOrResourcePath(path)) {
        throw new Error("Path \"" + "\" is not a valid file or resource.");
    }
    if (path.indexOf(utils_1.RESOURCE_PREFIX) === 0) {
        return fromResource(path.substr(utils_1.RESOURCE_PREFIX.length));
    }
    return fromFile(path);
}
exports.fromFileOrResource = fromFileOrResource;
//# sourceMappingURL=image-source.ios.js.map