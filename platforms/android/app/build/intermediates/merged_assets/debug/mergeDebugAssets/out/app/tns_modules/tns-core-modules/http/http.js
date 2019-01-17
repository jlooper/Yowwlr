function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var httpRequest = require("./http-request");
__export(require("./http-request"));
function getString(arg) {
    return new Promise(function (resolve, reject) {
        httpRequest.request(typeof arg === "string" ? { url: arg, method: "GET" } : arg)
            .then(function (r) {
            try {
                var str = r.content.toString();
                resolve(str);
            }
            catch (e) {
                reject(e);
            }
        }, function (e) { return reject(e); });
    });
}
exports.getString = getString;
function getJSON(arg) {
    return new Promise(function (resolve, reject) {
        httpRequest.request(typeof arg === "string" ? { url: arg, method: "GET" } : arg)
            .then(function (r) {
            try {
                var json = r.content.toJSON();
                resolve(json);
            }
            catch (e) {
                reject(e);
            }
        }, function (e) { return reject(e); });
    });
}
exports.getJSON = getJSON;
function getImage(arg) {
    return new Promise(function (resolve, reject) {
        httpRequest.request(typeof arg === "string" ? { url: arg, method: "GET" } : arg)
            .then(function (r) {
            try {
                resolve(r.content.toImage());
            }
            catch (err) {
                reject(err);
            }
        }, function (err) {
            reject(err);
        });
    });
}
exports.getImage = getImage;
function getFile(arg, destinationFilePath) {
    return new Promise(function (resolve, reject) {
        httpRequest.request(typeof arg === "string" ? { url: arg, method: "GET" } : arg)
            .then(function (r) {
            try {
                var file = r.content.toFile(destinationFilePath);
                resolve(file);
            }
            catch (e) {
                reject(e);
            }
        }, function (e) { return reject(e); });
    });
}
exports.getFile = getFile;
//# sourceMappingURL=http.js.map