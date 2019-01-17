Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:forin */
// Copied unexported functions from @angular/router/src/url_tree
var router_1 = require("@angular/router");
function containsTree(container, containee, exact) {
    if (exact) {
        return equalSegmentGroups(container.root, containee.root);
    }
    else {
        return containsSegmentGroup(container.root, containee.root);
    }
}
exports.containsTree = containsTree;
function equalSegmentGroups(container, containee) {
    if (!equalPath(container.segments, containee.segments)) {
        return false;
    }
    if (container.numberOfChildren !== containee.numberOfChildren) {
        return false;
    }
    for (var c in containee.children) {
        if (!container.children[c]) {
            return false;
        }
        if (!equalSegmentGroups(container.children[c], containee.children[c])) {
            return false;
        }
    }
    return true;
}
function containsSegmentGroup(container, containee) {
    return containsSegmentGroupHelper(container, containee, containee.segments);
}
function containsSegmentGroupHelper(container, containee, containeePaths) {
    if (container.segments.length > containeePaths.length) {
        var current = container.segments.slice(0, containeePaths.length);
        if (!equalPath(current, containeePaths)) {
            return false;
        }
        if (containee.hasChildren()) {
            return false;
        }
        return true;
    }
    else if (container.segments.length === containeePaths.length) {
        if (!equalPath(container.segments, containeePaths)) {
            return false;
        }
        for (var c in containee.children) {
            if (!container.children[c]) {
                return false;
            }
            if (!containsSegmentGroup(container.children[c], containee.children[c])) {
                return false;
            }
        }
        return true;
    }
    else {
        var current = containeePaths.slice(0, container.segments.length);
        var next = containeePaths.slice(container.segments.length);
        if (!equalPath(container.segments, current)) {
            return false;
        }
        if (!container.children[router_1.PRIMARY_OUTLET]) {
            return false;
        }
        return containsSegmentGroupHelper(container.children[router_1.PRIMARY_OUTLET], containee, next);
    }
}
function equalPath(a, b) {
    if (a.length !== b.length) {
        return false;
    }
    for (var i = 0; i < a.length; ++i) {
        if (a[i].path !== b[i].path) {
            return false;
        }
    }
    return true;
}
exports.equalPath = equalPath;
//# sourceMappingURL=router-url-tree.js.map