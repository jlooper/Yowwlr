"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var file_system_1 = require("tns-core-modules/file-system");
var firebaseStorage = require("../../storage/storage");
var storage;
(function (storage) {
    var Reference = (function () {
        function Reference(path) {
            this.fullPath = this.path;
            this.path = path;
            if (path && path.length > 0) {
                this.root = new Reference();
            }
            else {
                this.root = this;
            }
        }
        Reference.prototype.child = function (path) {
            return new Reference(this.path ? this.path + "/" + path : path);
        };
        Reference.prototype.delete = function () {
            return firebaseStorage.deleteFile({
                remoteFullPath: this.path
            });
        };
        Reference.prototype.getDownloadURL = function () {
            return firebaseStorage.getDownloadUrl({
                remoteFullPath: this.path
            });
        };
        Reference.prototype.put = function (data, metadata) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                firebaseStorage.uploadFile({
                    localFile: data instanceof file_system_1.File ? data : undefined,
                    localFullPath: !(data instanceof file_system_1.File) ? data : undefined,
                    remoteFullPath: _this.path,
                    onProgress: function (progress) { return console.log("Upload progress: " + progress.percentageCompleted + "% completed"); }
                }).then(function (result) {
                    _this.getDownloadURL()
                        .then(function (url) {
                        resolve({
                            downloadURL: url,
                            totalBytes: result.size
                        });
                    });
                }).catch(function (err) { return reject(err); });
            });
        };
        Reference.prototype.download = function (downloadToPath) {
            return firebaseStorage.downloadFile({
                localFullPath: downloadToPath,
                remoteFullPath: this.path
            });
        };
        return Reference;
    }());
    storage.Reference = Reference;
    var Storage = (function () {
        function Storage() {
        }
        Storage.prototype.ref = function () {
            return new Reference();
        };
        return Storage;
    }());
    storage.Storage = Storage;
})(storage = exports.storage || (exports.storage = {}));
