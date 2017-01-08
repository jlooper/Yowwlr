"use strict";
var router_1 = require("@angular/router");
var home_component_1 = require("./home.component");
var auth_guard_service_1 = require("../auth-guard.service");
var homeRoutes = [
    { path: "", component: home_component_1.HomeComponent, canActivate: [auth_guard_service_1.AuthGuard] },
];
exports.homeRouting = router_1.RouterModule.forChild(homeRoutes);
//# sourceMappingURL=home.routes.js.map