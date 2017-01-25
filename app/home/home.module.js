"use strict";
var platform_1 = require("nativescript-angular/platform");
var core_1 = require("@angular/core");
var forms_1 = require("nativescript-angular/forms");
var nativescript_ngx_fonticon_1 = require('nativescript-ngx-fonticon');
var home_routes_1 = require("./home.routes");
var home_component_1 = require("./home.component");
var home_tab_component_1 = require('./home.tab.component');
var HomeModule = (function () {
    function HomeModule() {
    }
    HomeModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_1.NativeScriptModule,
                forms_1.NativeScriptFormsModule,
                home_routes_1.homeRouting,
                nativescript_ngx_fonticon_1.TNSFontIconModule.forRoot({
                    'fa': 'fonts/font-awesome.css'
                }),
            ],
            declarations: [
                home_component_1.HomeComponent,
                home_tab_component_1.HomeTabComponent
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], HomeModule);
    return HomeModule;
}());
exports.HomeModule = HomeModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9tZS5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJob21lLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEseUJBQW1DLCtCQUErQixDQUFDLENBQUE7QUFDbkUscUJBQXlCLGVBQWUsQ0FBQyxDQUFBO0FBQ3pDLHNCQUF3Qyw0QkFBNEIsQ0FBQyxDQUFBO0FBQ3JFLDBDQUEwRiwyQkFBMkIsQ0FBQyxDQUFBO0FBQ3RILDRCQUE0QixlQUFlLENBQUMsQ0FBQTtBQUM1QywrQkFBOEIsa0JBQWtCLENBQUMsQ0FBQTtBQUNqRCxtQ0FBaUMsc0JBQXNCLENBQUMsQ0FBQTtBQWdCeEQ7SUFBQTtJQUF5QixDQUFDO0lBZDFCO1FBQUMsZUFBUSxDQUFDO1lBQ1IsT0FBTyxFQUFFO2dCQUNQLDZCQUFrQjtnQkFDbEIsK0JBQXVCO2dCQUN2Qix5QkFBVztnQkFDWCw2Q0FBaUIsQ0FBQyxPQUFPLENBQUM7b0JBQ3hCLElBQUksRUFBRSx3QkFBd0I7aUJBQy9CLENBQUM7YUFDSDtZQUNELFlBQVksRUFBRTtnQkFDWiw4QkFBYTtnQkFDYixxQ0FBZ0I7YUFDakI7U0FDRixDQUFDOztrQkFBQTtJQUN1QixpQkFBQztBQUFELENBQUMsQUFBMUIsSUFBMEI7QUFBYixrQkFBVSxhQUFHLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOYXRpdmVTY3JpcHRNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvcGxhdGZvcm1cIjtcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdEZvcm1zTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL2Zvcm1zXCI7XG5pbXBvcnQge1ROU0ZvbnRJY29uTW9kdWxlLCBUTlNGb250SWNvblNlcnZpY2UsIFROU0ZvbnRJY29uUGlwZSwgVE5TRm9udEljb25QdXJlUGlwZX0gZnJvbSAnbmF0aXZlc2NyaXB0LW5neC1mb250aWNvbic7XG5pbXBvcnQgeyBob21lUm91dGluZyB9IGZyb20gXCIuL2hvbWUucm91dGVzXCI7XG5pbXBvcnQgeyBIb21lQ29tcG9uZW50IH0gZnJvbSBcIi4vaG9tZS5jb21wb25lbnRcIjtcbmltcG9ydCB7IEhvbWVUYWJDb21wb25lbnQgfSBmcm9tICcuL2hvbWUudGFiLmNvbXBvbmVudCc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBOYXRpdmVTY3JpcHRNb2R1bGUsXG4gICAgTmF0aXZlU2NyaXB0Rm9ybXNNb2R1bGUsXG4gICAgaG9tZVJvdXRpbmcsXG4gICAgVE5TRm9udEljb25Nb2R1bGUuZm9yUm9vdCh7XG4gICAgICAnZmEnOiAnZm9udHMvZm9udC1hd2Vzb21lLmNzcydcbiAgICB9KSxcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbICAgIFxuICAgIEhvbWVDb21wb25lbnQsXG4gICAgSG9tZVRhYkNvbXBvbmVudCAgICBcbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBIb21lTW9kdWxlIHt9Il19