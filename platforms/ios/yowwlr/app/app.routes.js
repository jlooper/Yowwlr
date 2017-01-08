"use strict";
var auth_guard_service_1 = require("./auth-guard.service");
exports.authProviders = [
    auth_guard_service_1.AuthGuard
];
exports.appRoutes = [
    { path: "", redirectTo: "/home", pathMatch: "full" }
];
//# sourceMappingURL=app.routes.js.map