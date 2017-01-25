"use strict";
var platform_1 = require("nativescript-angular/platform");
var core_1 = require("@angular/core");
var http_1 = require("nativescript-angular/http");
var router_1 = require("nativescript-angular/router");
var app_routes_1 = require("./app.routes");
var app_component_1 = require("./app.component");
var services_1 = require("./services");
var login_module_1 = require("./login/login.module");
var home_module_1 = require("./home/home.module");
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            providers: [
                services_1.BackendService,
                services_1.FirebaseService,
                services_1.CatService,
                app_routes_1.authProviders
            ],
            imports: [
                platform_1.NativeScriptModule,
                http_1.NativeScriptHttpModule,
                router_1.NativeScriptRouterModule,
                router_1.NativeScriptRouterModule.forRoot(app_routes_1.appRoutes),
                login_module_1.LoginModule,
                home_module_1.HomeModule
            ],
            declarations: [
                app_component_1.AppComponent,
            ],
            bootstrap: [app_component_1.AppComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHlCQUFtQywrQkFBK0IsQ0FBQyxDQUFBO0FBQ25FLHFCQUF5QixlQUFlLENBQUMsQ0FBQTtBQUN6QyxxQkFBdUMsMkJBQTJCLENBQUMsQ0FBQTtBQUNuRSx1QkFBeUMsNkJBQTZCLENBQUMsQ0FBQTtBQUV2RSwyQkFBeUMsY0FBYyxDQUFDLENBQUE7QUFDeEQsOEJBQTZCLGlCQUFpQixDQUFDLENBQUE7QUFDL0MseUJBQTRELFlBQVksQ0FBQyxDQUFBO0FBRXpFLDZCQUE0QixzQkFBc0IsQ0FBQyxDQUFBO0FBQ25ELDRCQUEyQixvQkFBb0IsQ0FBQyxDQUFBO0FBc0JoRDtJQUFBO0lBQXlCLENBQUM7SUFwQjFCO1FBQUMsZUFBUSxDQUFDO1lBQ1IsU0FBUyxFQUFFO2dCQUNULHlCQUFjO2dCQUNkLDBCQUFlO2dCQUNmLHFCQUFVO2dCQUNWLDBCQUFhO2FBQ2Q7WUFDRCxPQUFPLEVBQUU7Z0JBQ1AsNkJBQWtCO2dCQUNsQiw2QkFBc0I7Z0JBQ3RCLGlDQUF3QjtnQkFDeEIsaUNBQXdCLENBQUMsT0FBTyxDQUFDLHNCQUFTLENBQUM7Z0JBQzNDLDBCQUFXO2dCQUNYLHdCQUFVO2FBQ1g7WUFDRCxZQUFZLEVBQUU7Z0JBQ1YsNEJBQVk7YUFDZjtZQUNELFNBQVMsRUFBRSxDQUFDLDRCQUFZLENBQUM7U0FDMUIsQ0FBQzs7aUJBQUE7SUFDdUIsZ0JBQUM7QUFBRCxDQUFDLEFBQTFCLElBQTBCO0FBQWIsaUJBQVMsWUFBSSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmF0aXZlU2NyaXB0TW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL3BsYXRmb3JtXCI7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBOYXRpdmVTY3JpcHRIdHRwTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL2h0dHBcIjtcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdFJvdXRlck1vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9yb3V0ZXJcIjtcblxuaW1wb3J0IHsgYXV0aFByb3ZpZGVycywgYXBwUm91dGVzIH0gZnJvbSBcIi4vYXBwLnJvdXRlc1wiO1xuaW1wb3J0IHsgQXBwQ29tcG9uZW50IH0gZnJvbSBcIi4vYXBwLmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgQmFja2VuZFNlcnZpY2UsIEZpcmViYXNlU2VydmljZSwgQ2F0U2VydmljZSB9IGZyb20gXCIuL3NlcnZpY2VzXCI7XG5cbmltcG9ydCB7IExvZ2luTW9kdWxlIH0gZnJvbSBcIi4vbG9naW4vbG9naW4ubW9kdWxlXCI7XG5pbXBvcnQgeyBIb21lTW9kdWxlIH0gZnJvbSBcIi4vaG9tZS9ob21lLm1vZHVsZVwiO1xuXG5ATmdNb2R1bGUoe1xuICBwcm92aWRlcnM6IFtcbiAgICBCYWNrZW5kU2VydmljZSxcbiAgICBGaXJlYmFzZVNlcnZpY2UsXG4gICAgQ2F0U2VydmljZSxcbiAgICBhdXRoUHJvdmlkZXJzXG4gIF0sXG4gIGltcG9ydHM6IFtcbiAgICBOYXRpdmVTY3JpcHRNb2R1bGUsXG4gICAgTmF0aXZlU2NyaXB0SHR0cE1vZHVsZSxcbiAgICBOYXRpdmVTY3JpcHRSb3V0ZXJNb2R1bGUsXG4gICAgTmF0aXZlU2NyaXB0Um91dGVyTW9kdWxlLmZvclJvb3QoYXBwUm91dGVzKSxcbiAgICBMb2dpbk1vZHVsZSxcbiAgICBIb21lTW9kdWxlXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW1xuICAgICAgQXBwQ29tcG9uZW50LFxuICBdLFxuICBib290c3RyYXA6IFtBcHBDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIEFwcE1vZHVsZSB7IH1cbiJdfQ==