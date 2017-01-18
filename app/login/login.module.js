"use strict";
var platform_1 = require("nativescript-angular/platform");
var forms_1 = require("nativescript-angular/forms");
var core_1 = require("@angular/core");
var login_routes_1 = require("./login.routes");
var login_component_1 = require("./login.component");
var LoginModule = (function () {
    function LoginModule() {
    }
    LoginModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_1.NativeScriptModule,
                forms_1.NativeScriptFormsModule,
                login_routes_1.loginRouting
            ],
            declarations: [
                login_component_1.LoginComponent
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], LoginModule);
    return LoginModule;
}());
exports.LoginModule = LoginModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4ubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9naW4ubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx5QkFBbUMsK0JBQStCLENBQUMsQ0FBQTtBQUNuRSxzQkFBd0MsNEJBQTRCLENBQUMsQ0FBQTtBQUNyRSxxQkFBeUIsZUFBZSxDQUFDLENBQUE7QUFFekMsNkJBQTZCLGdCQUFnQixDQUFDLENBQUE7QUFDOUMsZ0NBQStCLG1CQUFtQixDQUFDLENBQUE7QUFZbkQ7SUFBQTtJQUEyQixDQUFDO0lBVjVCO1FBQUMsZUFBUSxDQUFDO1lBQ1IsT0FBTyxFQUFFO2dCQUNQLDZCQUFrQjtnQkFDbEIsK0JBQXVCO2dCQUN2QiwyQkFBWTthQUNiO1lBQ0QsWUFBWSxFQUFFO2dCQUNaLGdDQUFjO2FBQ2Y7U0FDRixDQUFDOzttQkFBQTtJQUN5QixrQkFBQztBQUFELENBQUMsQUFBNUIsSUFBNEI7QUFBZixtQkFBVyxjQUFJLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOYXRpdmVTY3JpcHRNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvcGxhdGZvcm1cIjtcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdEZvcm1zTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL2Zvcm1zXCI7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5cbmltcG9ydCB7IGxvZ2luUm91dGluZyB9IGZyb20gXCIuL2xvZ2luLnJvdXRlc1wiO1xuaW1wb3J0IHsgTG9naW5Db21wb25lbnQgfSBmcm9tIFwiLi9sb2dpbi5jb21wb25lbnRcIjtcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICAgIE5hdGl2ZVNjcmlwdE1vZHVsZSxcbiAgICBOYXRpdmVTY3JpcHRGb3Jtc01vZHVsZSxcbiAgICBsb2dpblJvdXRpbmdcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgTG9naW5Db21wb25lbnRcbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBMb2dpbk1vZHVsZSB7IH1cbiJdfQ==