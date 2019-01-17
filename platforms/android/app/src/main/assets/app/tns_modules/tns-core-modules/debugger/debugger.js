Object.defineProperty(exports, "__esModule", { value: true });
var network;
function getNetwork() {
    return network;
}
exports.getNetwork = getNetwork;
function setNetwork(newNetwork) {
    network = newNetwork;
}
exports.setNetwork = setNetwork;
var dom;
function getDOM() {
    return dom;
}
exports.getDOM = getDOM;
function setDOM(newDOM) {
    dom = newDOM;
}
exports.setDOM = setDOM;
var css;
function getCSS() {
    return css;
}
exports.getCSS = getCSS;
function setCSS(newCSS) {
    css = newCSS;
}
exports.setCSS = setCSS;
var NetworkAgent;
(function (NetworkAgent) {
    function responseReceived(requestId, result, headers) {
        var requestIdStr = requestId.toString();
        var mimeType = headers["Content-Type"] || headers["content-type"] || "application/octet-stream";
        var contentLengthHeader = headers["Content-Length"] || headers["content-length"];
        var contentLength = parseInt(contentLengthHeader, 10);
        if (isNaN(contentLength)) {
            contentLength = 0;
        }
        var response = {
            url: result.url || "",
            status: result.statusCode,
            statusText: result.statusText || "",
            headers: headers,
            mimeType: mimeType,
            fromDiskCache: false,
            connectionReused: true,
            connectionId: 0,
            encodedDataLength: contentLength,
            securityState: "info"
        };
        var responseData = {
            requestId: requestIdStr,
            type: mimeTypeToType(response.mimeType),
            response: response,
            timestamp: getTimeStamp()
        };
        global.__inspector.responseReceived(responseData);
        global.__inspector.loadingFinished({
            requestId: requestIdStr,
            timestamp: getTimeStamp(),
            encodedDataLength: contentLength
        });
        var hasTextContent = responseData.type === "Document" || responseData.type === "Script";
        var data;
        if (!hasTextContent) {
            if (responseData.type === "Image") {
                var bitmap = result.responseAsImage;
                if (bitmap) {
                    var outputStream = new java.io.ByteArrayOutputStream();
                    bitmap.compress(android.graphics.Bitmap.CompressFormat.PNG, 100, outputStream);
                    var base64Image = android.util.Base64.encodeToString(outputStream.toByteArray(), android.util.Base64.DEFAULT);
                    data = base64Image;
                }
            }
        }
        else {
            data = result.responseAsString;
        }
        var successfulRequestData = {
            requestId: requestIdStr,
            data: data,
            hasTextContent: hasTextContent
        };
        global.__inspector.dataForRequestId(successfulRequestData);
    }
    NetworkAgent.responseReceived = responseReceived;
    function requestWillBeSent(requestId, options) {
        var request = {
            url: options.url,
            method: options.method,
            headers: options.headers || {},
            postData: options.content ? options.content.toString() : "",
            initialPriority: "Medium",
            referrerPolicy: "no-referrer-when-downgrade"
        };
        var requestData = {
            requestId: requestId.toString(),
            url: request.url,
            request: request,
            timestamp: getTimeStamp(),
            type: "Document",
            wallTime: 0
        };
        global.__inspector.requestWillBeSent(requestData);
    }
    NetworkAgent.requestWillBeSent = requestWillBeSent;
    function getTimeStamp() {
        var d = new Date();
        return Math.round(d.getTime() / 1000);
    }
    function mimeTypeToType(mimeType) {
        var type = "Document";
        if (mimeType) {
            if (mimeType.indexOf("image") === 0) {
                type = "Image";
            }
            else if (mimeType.indexOf("javascript") !== -1 || mimeType.indexOf("json") !== -1) {
                type = "Script";
            }
        }
        return type;
    }
})(NetworkAgent = exports.NetworkAgent || (exports.NetworkAgent = {}));
//# sourceMappingURL=debugger.js.map