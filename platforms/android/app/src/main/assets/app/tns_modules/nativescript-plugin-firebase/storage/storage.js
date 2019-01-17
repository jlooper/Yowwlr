"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var file_system_1 = require("tns-core-modules/file-system");
var firebase_common_1 = require("../firebase-common");
function getStorageRef(reject, arg) {
    if (typeof (com.google.firebase.storage) === "undefined") {
        reject("Uncomment firebase-storage in the plugin's include.gradle first");
        return;
    }
    if (!arg.remoteFullPath) {
        reject("remoteFullPath is mandatory");
        return;
    }
    if (arg.bucket) {
        return com.google.firebase.storage.FirebaseStorage.getInstance().getReferenceFromUrl(arg.bucket);
    }
    else if (firebase_common_1.firebase.storageBucket) {
        return firebase_common_1.firebase.storageBucket;
    }
    else {
        return com.google.firebase.storage.FirebaseStorage.getInstance().getReference();
    }
}
function uploadFile(arg) {
    return new Promise(function (resolve, reject) {
        try {
            var storageRef = getStorageRef(reject, arg);
            if (!storageRef) {
                return;
            }
            var storageReference = storageRef.child(arg.remoteFullPath);
            var onSuccessListener = new com.google.android.gms.tasks.OnSuccessListener({
                onSuccess: function (uploadTaskSnapshot) {
                    var metadata = uploadTaskSnapshot.getMetadata();
                    resolve({
                        name: metadata.getName(),
                        contentType: metadata.getContentType(),
                        created: new Date(metadata.getCreationTimeMillis()),
                        updated: new Date(metadata.getUpdatedTimeMillis()),
                        bucket: metadata.getBucket(),
                        size: metadata.getSizeBytes(),
                    });
                }
            });
            var onFailureListener = new com.google.android.gms.tasks.OnFailureListener({
                onFailure: function (exception) {
                    reject("Upload failed. " + exception);
                }
            });
            var onProgressListener = new com.google.firebase.storage.OnProgressListener({
                onProgress: function (snapshot) {
                    if (typeof (arg.onProgress) === "function") {
                        var fractionCompleted = snapshot.getBytesTransferred() / snapshot.getTotalByteCount();
                        arg.onProgress({
                            fractionCompleted: fractionCompleted,
                            percentageCompleted: Math.round(fractionCompleted * 100)
                        });
                    }
                }
            });
            if (arg.localFile) {
                if (typeof (arg.localFile) !== "object") {
                    reject("localFile argument must be a File object; use file-system module to create one");
                    return;
                }
                var localFileUrl = android.net.Uri.fromFile(new java.io.File(arg.localFile.path));
                storageReference.putFile(localFileUrl)
                    .addOnFailureListener(onFailureListener)
                    .addOnSuccessListener(onSuccessListener)
                    .addOnProgressListener(onProgressListener);
            }
            else if (arg.localFullPath) {
                if (!file_system_1.File.exists(arg.localFullPath)) {
                    reject("File does not exist: " + arg.localFullPath);
                    return;
                }
                var localFileUrl = android.net.Uri.fromFile(new java.io.File(arg.localFullPath));
                storageReference.putFile(localFileUrl)
                    .addOnFailureListener(onFailureListener)
                    .addOnSuccessListener(onSuccessListener)
                    .addOnProgressListener(onProgressListener);
            }
            else {
                reject("One of localFile or localFullPath is required");
            }
        }
        catch (ex) {
            console.log("Error in firebase.uploadFile: " + ex);
            reject(ex);
        }
    });
}
exports.uploadFile = uploadFile;
function downloadFile(arg) {
    return new Promise(function (resolve, reject) {
        try {
            var storageRef = getStorageRef(reject, arg);
            if (!storageRef) {
                return;
            }
            var storageReference = storageRef.child(arg.remoteFullPath);
            var onSuccessListener = new com.google.android.gms.tasks.OnSuccessListener({
                onSuccess: function (downloadTaskSnapshot) { return resolve(); }
            });
            var onFailureListener = new com.google.android.gms.tasks.OnFailureListener({
                onFailure: function (exception) { return reject("Download failed. " + exception); }
            });
            var localFilePath = void 0;
            if (arg.localFile) {
                if (typeof (arg.localFile) !== "object") {
                    reject("localFile argument must be a File object; use file-system module to create one");
                    return;
                }
                localFilePath = arg.localFile.path;
            }
            else if (arg.localFullPath) {
                localFilePath = arg.localFullPath;
            }
            else {
                reject("One of localFile or localFullPath is required");
                return;
            }
            var file = new java.io.File(localFilePath);
            storageReference.getFile(file)
                .addOnSuccessListener(onSuccessListener)
                .addOnFailureListener(onFailureListener);
        }
        catch (ex) {
            console.log("Error in firebase.downloadFile: " + ex);
            reject(ex);
        }
    });
}
exports.downloadFile = downloadFile;
function getDownloadUrl(arg) {
    return new Promise(function (resolve, reject) {
        try {
            var storageRef = getStorageRef(reject, arg);
            if (!storageRef) {
                return;
            }
            var storageReference = storageRef.child(arg.remoteFullPath);
            var onSuccessListener = new com.google.android.gms.tasks.OnSuccessListener({
                onSuccess: function (uri) {
                    resolve(uri.toString());
                }
            });
            var onFailureListener = new com.google.android.gms.tasks.OnFailureListener({
                onFailure: function (exception) {
                    reject(exception.getMessage());
                }
            });
            storageReference.getDownloadUrl()
                .addOnSuccessListener(onSuccessListener)
                .addOnFailureListener(onFailureListener);
        }
        catch (ex) {
            console.log("Error in firebase.getDownloadUrl: " + ex);
            reject(ex);
        }
    });
}
exports.getDownloadUrl = getDownloadUrl;
function deleteFile(arg) {
    return new Promise(function (resolve, reject) {
        try {
            var storageRef = getStorageRef(reject, arg);
            if (!storageRef) {
                return;
            }
            var storageReference = storageRef.child(arg.remoteFullPath);
            var onSuccessListener = new com.google.android.gms.tasks.OnSuccessListener({
                onSuccess: function () {
                    resolve();
                }
            });
            var onFailureListener = new com.google.android.gms.tasks.OnFailureListener({
                onFailure: function (exception) {
                    reject(exception.getMessage());
                }
            });
            storageReference.delete()
                .addOnSuccessListener(onSuccessListener)
                .addOnFailureListener(onFailureListener);
        }
        catch (ex) {
            console.log("Error in firebase.deleteFile: " + ex);
            reject(ex);
        }
    });
}
exports.deleteFile = deleteFile;
