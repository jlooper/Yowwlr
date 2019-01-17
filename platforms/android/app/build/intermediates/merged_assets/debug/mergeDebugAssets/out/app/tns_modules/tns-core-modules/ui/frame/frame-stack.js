Object.defineProperty(exports, "__esModule", { value: true });
exports.frameStack = [];
function topmost() {
    if (exports.frameStack.length > 0) {
        return exports.frameStack[exports.frameStack.length - 1];
    }
    return undefined;
}
exports.topmost = topmost;
function _pushInFrameStack(frame) {
    if (frame._isInFrameStack && exports.frameStack[exports.frameStack.length - 1] === frame) {
        return;
    }
    if (frame._isInFrameStack) {
        var indexOfFrame = exports.frameStack.indexOf(frame);
        exports.frameStack.splice(indexOfFrame, 1);
    }
    exports.frameStack.push(frame);
    frame._isInFrameStack = true;
}
exports._pushInFrameStack = _pushInFrameStack;
function _popFromFrameStack(frame) {
    if (!frame._isInFrameStack) {
        return;
    }
    var top = topmost();
    if (top !== frame) {
        throw new Error("Cannot pop a Frame which is not at the top of the navigation stack.");
    }
    exports.frameStack.pop();
    frame._isInFrameStack = false;
}
exports._popFromFrameStack = _popFromFrameStack;
function _removeFromFrameStack(frame) {
    if (!frame._isInFrameStack) {
        return;
    }
    var index = exports.frameStack.indexOf(frame);
    exports.frameStack.splice(index, 1);
    frame._isInFrameStack = false;
}
exports._removeFromFrameStack = _removeFromFrameStack;
//# sourceMappingURL=frame-stack.js.map