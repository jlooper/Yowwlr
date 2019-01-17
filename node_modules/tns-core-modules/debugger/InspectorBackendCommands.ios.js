Object.defineProperty(exports, "__esModule", { value: true });
function DomainDispatcher(domain) {
    return function (klass) { return __registerDomainDispatcher(domain, klass); };
}
exports.DomainDispatcher = DomainDispatcher;
var HeapDomain;
(function (HeapDomain) {
    var HeapFrontend = (function () {
        function HeapFrontend() {
        }
        HeapFrontend.prototype.garbageCollected = function (collection) {
            __inspectorSendEvent(JSON.stringify({ "method": "Heap.garbageCollected", "params": { "collection": collection } }));
        };
        HeapFrontend.prototype.trackingStart = function (timestamp, snapshotData) {
            __inspectorSendEvent(JSON.stringify({ "method": "Heap.trackingStart", "params": { "timestamp": timestamp, "snapshotData": snapshotData } }));
        };
        HeapFrontend.prototype.trackingComplete = function (timestamp, snapshotData) {
            __inspectorSendEvent(JSON.stringify({ "method": "Heap.trackingComplete", "params": { "timestamp": timestamp, "snapshotData": snapshotData } }));
        };
        return HeapFrontend;
    }());
    HeapDomain.HeapFrontend = HeapFrontend;
})(HeapDomain = exports.HeapDomain || (exports.HeapDomain = {}));
var DebuggerDomain;
(function (DebuggerDomain) {
    var DebuggerFrontend = (function () {
        function DebuggerFrontend() {
        }
        DebuggerFrontend.prototype.globalObjectCleared = function () {
            __inspectorSendEvent(JSON.stringify({ "method": "Debugger.globalObjectCleared", "params": {} }));
        };
        DebuggerFrontend.prototype.scriptParsed = function (scriptId, url, startLine, startColumn, endLine, endColumn, isContentScript, sourceURL, sourceMapURL) {
            __inspectorSendEvent(JSON.stringify({ "method": "Debugger.scriptParsed", "params": { "scriptId": scriptId, "url": url, "startLine": startLine, "startColumn": startColumn, "endLine": endLine, "endColumn": endColumn, "isContentScript": isContentScript, "sourceURL": sourceURL, "sourceMapURL": sourceMapURL } }));
        };
        DebuggerFrontend.prototype.scriptFailedToParse = function (url, scriptSource, startLine, errorLine, errorMessage) {
            __inspectorSendEvent(JSON.stringify({ "method": "Debugger.scriptFailedToParse", "params": { "url": url, "scriptSource": scriptSource, "startLine": startLine, "errorLine": errorLine, "errorMessage": errorMessage } }));
        };
        DebuggerFrontend.prototype.breakpointResolved = function (breakpointId, location) {
            __inspectorSendEvent(JSON.stringify({ "method": "Debugger.breakpointResolved", "params": { "breakpointId": breakpointId, "location": location } }));
        };
        DebuggerFrontend.prototype.paused = function (callFrames, reason, data) {
            __inspectorSendEvent(JSON.stringify({ "method": "Debugger.paused", "params": { "callFrames": callFrames, "reason": reason, "data": data } }));
        };
        DebuggerFrontend.prototype.resumed = function () {
            __inspectorSendEvent(JSON.stringify({ "method": "Debugger.resumed", "params": {} }));
        };
        DebuggerFrontend.prototype.didSampleProbe = function (sample) {
            __inspectorSendEvent(JSON.stringify({ "method": "Debugger.didSampleProbe", "params": { "sample": sample } }));
        };
        DebuggerFrontend.prototype.playBreakpointActionSound = function (breakpointActionId) {
            __inspectorSendEvent(JSON.stringify({ "method": "Debugger.playBreakpointActionSound", "params": { "breakpointActionId": breakpointActionId } }));
        };
        return DebuggerFrontend;
    }());
    DebuggerDomain.DebuggerFrontend = DebuggerFrontend;
})(DebuggerDomain = exports.DebuggerDomain || (exports.DebuggerDomain = {}));
var RuntimeDomain;
(function (RuntimeDomain) {
    ;
    var RuntimeFrontend = (function () {
        function RuntimeFrontend() {
        }
        RuntimeFrontend.prototype.executionContextCreated = function (context) {
            __inspectorSendEvent(JSON.stringify({ "method": "Runtime.executionContextCreated", "params": { "context": context } }));
        };
        return RuntimeFrontend;
    }());
    RuntimeDomain.RuntimeFrontend = RuntimeFrontend;
})(RuntimeDomain = exports.RuntimeDomain || (exports.RuntimeDomain = {}));
var ConsoleDomain;
(function (ConsoleDomain) {
    var ConsoleFrontend = (function () {
        function ConsoleFrontend() {
        }
        ConsoleFrontend.prototype.messageAdded = function (message) {
            __inspectorSendEvent(JSON.stringify({ "method": "Console.messageAdded", "params": { "message": message } }));
        };
        ConsoleFrontend.prototype.messageRepeatCountUpdated = function (count) {
            __inspectorSendEvent(JSON.stringify({ "method": "Console.messageRepeatCountUpdated", "params": { "count": count } }));
        };
        ConsoleFrontend.prototype.messagesCleared = function () {
            __inspectorSendEvent(JSON.stringify({ "method": "Console.messagesCleared", "params": {} }));
        };
        ConsoleFrontend.prototype.heapSnapshot = function (timestamp, snapshotData, title) {
            __inspectorSendEvent(JSON.stringify({ "method": "Console.heapSnapshot", "params": { "timestamp": timestamp, "snapshotData": snapshotData, "title": title } }));
        };
        return ConsoleFrontend;
    }());
    ConsoleDomain.ConsoleFrontend = ConsoleFrontend;
})(ConsoleDomain = exports.ConsoleDomain || (exports.ConsoleDomain = {}));
var PageDomain;
(function (PageDomain) {
    ;
    ;
    var PageFrontend = (function () {
        function PageFrontend() {
        }
        PageFrontend.prototype.domContentEventFired = function (timestamp) {
            __inspectorSendEvent(JSON.stringify({ "method": "Page.domContentEventFired", "params": { "timestamp": timestamp } }));
        };
        PageFrontend.prototype.loadEventFired = function (timestamp) {
            __inspectorSendEvent(JSON.stringify({ "method": "Page.loadEventFired", "params": { "timestamp": timestamp } }));
        };
        PageFrontend.prototype.frameNavigated = function (frame) {
            __inspectorSendEvent(JSON.stringify({ "method": "Page.frameNavigated", "params": { "frame": frame } }));
        };
        PageFrontend.prototype.frameDetached = function (frameId) {
            __inspectorSendEvent(JSON.stringify({ "method": "Page.frameDetached", "params": { "frameId": frameId } }));
        };
        PageFrontend.prototype.frameStartedLoading = function (frameId) {
            __inspectorSendEvent(JSON.stringify({ "method": "Page.frameStartedLoading", "params": { "frameId": frameId } }));
        };
        PageFrontend.prototype.frameStoppedLoading = function (frameId) {
            __inspectorSendEvent(JSON.stringify({ "method": "Page.frameStoppedLoading", "params": { "frameId": frameId } }));
        };
        PageFrontend.prototype.frameScheduledNavigation = function (frameId, delay) {
            __inspectorSendEvent(JSON.stringify({ "method": "Page.frameScheduledNavigation", "params": { "frameId": frameId, "delay": delay } }));
        };
        PageFrontend.prototype.frameClearedScheduledNavigation = function (frameId) {
            __inspectorSendEvent(JSON.stringify({ "method": "Page.frameClearedScheduledNavigation", "params": { "frameId": frameId } }));
        };
        PageFrontend.prototype.javascriptDialogOpening = function (message) {
            __inspectorSendEvent(JSON.stringify({ "method": "Page.javascriptDialogOpening", "params": { "message": message } }));
        };
        PageFrontend.prototype.javascriptDialogClosed = function () {
            __inspectorSendEvent(JSON.stringify({ "method": "Page.javascriptDialogClosed", "params": {} }));
        };
        PageFrontend.prototype.scriptsEnabled = function (isEnabled) {
            __inspectorSendEvent(JSON.stringify({ "method": "Page.scriptsEnabled", "params": { "isEnabled": isEnabled } }));
        };
        return PageFrontend;
    }());
    PageDomain.PageFrontend = PageFrontend;
})(PageDomain = exports.PageDomain || (exports.PageDomain = {}));
var NetworkDomain;
(function (NetworkDomain) {
    var NetworkFrontend = (function () {
        function NetworkFrontend() {
        }
        NetworkFrontend.prototype.requestWillBeSent = function (requestId, frameId, loaderId, documentURL, request, timestamp, initiator, redirectResponse, type) {
            __inspectorSendEvent(JSON.stringify({ "method": "Network.requestWillBeSent", "params": { "requestId": requestId, "frameId": frameId, "loaderId": loaderId, "documentURL": documentURL, "request": request, "timestamp": timestamp, "initiator": initiator, "redirectResponse": redirectResponse, "type": type } }));
        };
        NetworkFrontend.prototype.requestServedFromCache = function (requestId) {
            __inspectorSendEvent(JSON.stringify({ "method": "Network.requestServedFromCache", "params": { "requestId": requestId } }));
        };
        NetworkFrontend.prototype.responseReceived = function (requestId, frameId, loaderId, timestamp, type, response) {
            __inspectorSendEvent(JSON.stringify({ "method": "Network.responseReceived", "params": { "requestId": requestId, "frameId": frameId, "loaderId": loaderId, "timestamp": timestamp, "type": type, "response": response } }));
        };
        NetworkFrontend.prototype.dataReceived = function (requestId, timestamp, dataLength, encodedDataLength) {
            __inspectorSendEvent(JSON.stringify({ "method": "Network.dataReceived", "params": { "requestId": requestId, "timestamp": timestamp, "dataLength": dataLength, "encodedDataLength": encodedDataLength } }));
        };
        NetworkFrontend.prototype.loadingFinished = function (requestId, timestamp, sourceMapURL) {
            __inspectorSendEvent(JSON.stringify({ "method": "Network.loadingFinished", "params": { "requestId": requestId, "timestamp": timestamp, "sourceMapURL": sourceMapURL } }));
        };
        NetworkFrontend.prototype.loadingFailed = function (requestId, timestamp, errorText, canceled) {
            __inspectorSendEvent(JSON.stringify({ "method": "Network.loadingFailed", "params": { "requestId": requestId, "timestamp": timestamp, "errorText": errorText, "canceled": canceled } }));
        };
        NetworkFrontend.prototype.requestServedFromMemoryCache = function (requestId, frameId, loaderId, documentURL, timestamp, initiator, resource) {
            __inspectorSendEvent(JSON.stringify({ "method": "Network.requestServedFromMemoryCache", "params": { "requestId": requestId, "frameId": frameId, "loaderId": loaderId, "documentURL": documentURL, "timestamp": timestamp, "initiator": initiator, "resource": resource } }));
        };
        NetworkFrontend.prototype.webSocketWillSendHandshakeRequest = function (requestId, timestamp, request) {
            __inspectorSendEvent(JSON.stringify({ "method": "Network.webSocketWillSendHandshakeRequest", "params": { "requestId": requestId, "timestamp": timestamp, "request": request } }));
        };
        NetworkFrontend.prototype.webSocketHandshakeResponseReceived = function (requestId, timestamp, response) {
            __inspectorSendEvent(JSON.stringify({ "method": "Network.webSocketHandshakeResponseReceived", "params": { "requestId": requestId, "timestamp": timestamp, "response": response } }));
        };
        NetworkFrontend.prototype.webSocketCreated = function (requestId, url) {
            __inspectorSendEvent(JSON.stringify({ "method": "Network.webSocketCreated", "params": { "requestId": requestId, "url": url } }));
        };
        NetworkFrontend.prototype.webSocketClosed = function (requestId, timestamp) {
            __inspectorSendEvent(JSON.stringify({ "method": "Network.webSocketClosed", "params": { "requestId": requestId, "timestamp": timestamp } }));
        };
        NetworkFrontend.prototype.webSocketFrameReceived = function (requestId, timestamp, response) {
            __inspectorSendEvent(JSON.stringify({ "method": "Network.webSocketFrameReceived", "params": { "requestId": requestId, "timestamp": timestamp, "response": response } }));
        };
        NetworkFrontend.prototype.webSocketFrameError = function (requestId, timestamp, errorMessage) {
            __inspectorSendEvent(JSON.stringify({ "method": "Network.webSocketFrameError", "params": { "requestId": requestId, "timestamp": timestamp, "errorMessage": errorMessage } }));
        };
        NetworkFrontend.prototype.webSocketFrameSent = function (requestId, timestamp, response) {
            __inspectorSendEvent(JSON.stringify({ "method": "Network.webSocketFrameSent", "params": { "requestId": requestId, "timestamp": timestamp, "response": response } }));
        };
        return NetworkFrontend;
    }());
    NetworkDomain.NetworkFrontend = NetworkFrontend;
})(NetworkDomain = exports.NetworkDomain || (exports.NetworkDomain = {}));
var DOMDomain;
(function (DOMDomain) {
    ;
    ;
    ;
    var DOMFrontend = (function () {
        function DOMFrontend() {
        }
        DOMFrontend.prototype.documentUpdated = function () {
            __inspectorSendEvent(JSON.stringify({ "method": "DOM.documentUpdated", "params": {} }));
        };
        DOMFrontend.prototype.setChildNodes = function (parentId, nodes) {
            __inspectorSendEvent(JSON.stringify({ "method": "DOM.setChildNodes", "params": { "parentId": parentId, "nodes": nodes } }));
        };
        DOMFrontend.prototype.attributeModified = function (nodeId, name, value) {
            __inspectorSendEvent(JSON.stringify({ "method": "DOM.attributeModified", "params": { "nodeId": nodeId, "name": name, "value": value } }));
        };
        DOMFrontend.prototype.attributeRemoved = function (nodeId, name) {
            __inspectorSendEvent(JSON.stringify({ "method": "DOM.attributeRemoved", "params": { "nodeId": nodeId, "name": name } }));
        };
        DOMFrontend.prototype.inlineStyleInvalidated = function (nodeIds) {
            __inspectorSendEvent(JSON.stringify({ "method": "DOM.inlineStyleInvalidated", "params": { "nodeIds": nodeIds } }));
        };
        DOMFrontend.prototype.characterDataModified = function (nodeId, characterData) {
            __inspectorSendEvent(JSON.stringify({ "method": "DOM.characterDataModified", "params": { "nodeId": nodeId, "characterData": characterData } }));
        };
        DOMFrontend.prototype.childNodeCountUpdated = function (nodeId, childNodeCount) {
            __inspectorSendEvent(JSON.stringify({ "method": "DOM.childNodeCountUpdated", "params": { "nodeId": nodeId, "childNodeCount": childNodeCount } }));
        };
        DOMFrontend.prototype.childNodeInserted = function (parentNodeId, previousNodeId, node) {
            __inspectorSendEvent(JSON.stringify({ "method": "DOM.childNodeInserted", "params": { "parentNodeId": parentNodeId, "previousNodeId": previousNodeId, "node": node } }));
        };
        DOMFrontend.prototype.childNodeRemoved = function (parentNodeId, nodeId) {
            __inspectorSendEvent(JSON.stringify({ "method": "DOM.childNodeRemoved", "params": { "parentNodeId": parentNodeId, "nodeId": nodeId } }));
        };
        DOMFrontend.prototype.shadowRootPushed = function (hostId, root) {
            __inspectorSendEvent(JSON.stringify({ "method": "DOM.shadowRootPushed", "params": { "hostId": hostId, "root": root } }));
        };
        DOMFrontend.prototype.shadowRootPopped = function (hostId, rootId) {
            __inspectorSendEvent(JSON.stringify({ "method": "DOM.shadowRootPopped", "params": { "hostId": hostId, "rootId": rootId } }));
        };
        DOMFrontend.prototype.pseudoElementAdded = function (parentId, pseudoElement) {
            __inspectorSendEvent(JSON.stringify({ "method": "DOM.pseudoElementAdded", "params": { "parentId": parentId, "pseudoElement": pseudoElement } }));
        };
        DOMFrontend.prototype.pseudoElementRemoved = function (parentId, pseudoElementId) {
            __inspectorSendEvent(JSON.stringify({ "method": "DOM.pseudoElementRemoved", "params": { "parentId": parentId, "pseudoElementId": pseudoElementId } }));
        };
        return DOMFrontend;
    }());
    DOMDomain.DOMFrontend = DOMFrontend;
})(DOMDomain = exports.DOMDomain || (exports.DOMDomain = {}));
var CSSDomain;
(function (CSSDomain) {
    ;
    var CSSFrontend = (function () {
        function CSSFrontend() {
        }
        CSSFrontend.prototype.mediaQueryResultChanged = function () {
            __inspectorSendEvent(JSON.stringify({ "method": "CSS.mediaQueryResultChanged", "params": {} }));
        };
        CSSFrontend.prototype.fontsUpdated = function () {
            __inspectorSendEvent(JSON.stringify({ "method": "CSS.fontsUpdated", "params": {} }));
        };
        CSSFrontend.prototype.styleSheetChanged = function (styleSheetId) {
            __inspectorSendEvent(JSON.stringify({ "method": "CSS.styleSheetChanged", "params": { "styleSheetId": styleSheetId } }));
        };
        CSSFrontend.prototype.styleSheetAdded = function (header) {
            __inspectorSendEvent(JSON.stringify({ "method": "CSS.styleSheetAdded", "params": { "header": header } }));
        };
        CSSFrontend.prototype.styleSheetRemoved = function (styleSheetId) {
            __inspectorSendEvent(JSON.stringify({ "method": "CSS.styleSheetRemoved", "params": { "styleSheetId": styleSheetId } }));
        };
        CSSFrontend.prototype.layoutEditorChange = function (styleSheetId, changeRange) {
            __inspectorSendEvent(JSON.stringify({ "method": "CSS.layoutEditorChange", "params": { "styleSheetId": styleSheetId, "changeRange": changeRange } }));
        };
        return CSSFrontend;
    }());
    CSSDomain.CSSFrontend = CSSFrontend;
})(CSSDomain = exports.CSSDomain || (exports.CSSDomain = {}));
//# sourceMappingURL=InspectorBackendCommands.ios.js.map