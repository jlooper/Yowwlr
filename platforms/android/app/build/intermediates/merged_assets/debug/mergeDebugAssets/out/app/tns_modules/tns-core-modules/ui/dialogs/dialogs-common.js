Object.defineProperty(exports, "__esModule", { value: true });
var platform_1 = require("../../platform");
var types_1 = require("../../utils/types");
exports.STRING = "string";
exports.PROMPT = "Prompt";
exports.CONFIRM = "Confirm";
exports.ALERT = "Alert";
exports.LOGIN = "Login";
exports.OK = "OK";
exports.CANCEL = "Cancel";
var inputType;
(function (inputType) {
    inputType.text = "text";
    inputType.password = "password";
    inputType.email = "email";
    inputType.number = "number";
    inputType.phone = "phone";
})(inputType = exports.inputType || (exports.inputType = {}));
var capitalizationType;
(function (capitalizationType) {
    capitalizationType.none = "none";
    capitalizationType.all = "all";
    capitalizationType.sentences = "sentences";
    capitalizationType.words = "words";
})(capitalizationType = exports.capitalizationType || (exports.capitalizationType = {}));
var frame;
function getCurrentPage() {
    if (!frame) {
        frame = require("ui/frame");
    }
    var topmostFrame = frame.topmost();
    if (topmostFrame) {
        return topmostFrame.currentPage;
    }
    return undefined;
}
exports.getCurrentPage = getCurrentPage;
function applySelectors(view, callback) {
    var currentPage = getCurrentPage();
    if (currentPage) {
        var styleScope = currentPage._styleScope;
        if (styleScope) {
            view._inheritStyleScope(styleScope);
            view.onLoaded();
            callback(view);
            view.onUnloaded();
        }
    }
}
var button;
var label;
var textField;
function getButtonColors() {
    if (!button) {
        var Button = require("ui/button").Button;
        button = new Button;
        if (platform_1.isIOS) {
            button._setupUI({});
        }
    }
    var buttonColor;
    var buttonBackgroundColor;
    applySelectors(button, function (btn) {
        buttonColor = btn.color;
        buttonBackgroundColor = btn.backgroundColor;
    });
    return { color: buttonColor, backgroundColor: buttonBackgroundColor };
}
exports.getButtonColors = getButtonColors;
function getLabelColor() {
    if (!label) {
        var Label = require("ui/label").Label;
        label = new Label;
        if (platform_1.isIOS) {
            label._setupUI({});
        }
    }
    var labelColor;
    applySelectors(label, function (lbl) {
        labelColor = lbl.color;
    });
    return labelColor;
}
exports.getLabelColor = getLabelColor;
function getTextFieldColor() {
    if (!textField) {
        var TextField = require("ui/text-field").TextField;
        textField = new TextField();
        if (platform_1.isIOS) {
            textField._setupUI({});
        }
    }
    var textFieldColor;
    applySelectors(textField, function (tf) {
        textFieldColor = tf.color;
    });
    return textFieldColor;
}
exports.getTextFieldColor = getTextFieldColor;
function isDialogOptions(arg) {
    return arg && (arg.message || arg.title);
}
exports.isDialogOptions = isDialogOptions;
function parseLoginOptions(args) {
    if (args.length === 1 && types_1.isObject(args[0])) {
        return args[0];
    }
    var options = { title: exports.LOGIN, okButtonText: exports.OK, cancelButtonText: exports.CANCEL };
    if (types_1.isString(args[0])) {
        options.message = args[0];
    }
    if (types_1.isString(args[1])) {
        options.userNameHint = args[1];
    }
    if (types_1.isString(args[2])) {
        options.passwordHint = args[2];
    }
    if (types_1.isString(args[3])) {
        options.userName = args[3];
    }
    if (types_1.isString(args[4])) {
        options.password = args[4];
    }
    return options;
}
exports.parseLoginOptions = parseLoginOptions;
//# sourceMappingURL=dialogs-common.js.map