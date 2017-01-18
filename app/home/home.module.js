"use strict";
var platform_1 = require("nativescript-angular/platform");
var core_1 = require("@angular/core");
var forms_1 = require("nativescript-angular/forms");
var nativescript_ng2_fonticon_1 = require('nativescript-ng2-fonticon');
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
                nativescript_ng2_fonticon_1.TNSFontIconModule.forRoot({
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9tZS5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJob21lLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEseUJBQW1DLCtCQUErQixDQUFDLENBQUE7QUFDbkUscUJBQXlCLGVBQWUsQ0FBQyxDQUFBO0FBQ3pDLHNCQUF3Qyw0QkFBNEIsQ0FBQyxDQUFBO0FBQ3JFLDBDQUEwRiwyQkFBMkIsQ0FBQyxDQUFBO0FBRXRILDRCQUE0QixlQUFlLENBQUMsQ0FBQTtBQUM1QywrQkFBOEIsa0JBQWtCLENBQUMsQ0FBQTtBQUVqRCxtQ0FBaUMsc0JBQXNCLENBQUMsQ0FBQTtBQWdCeEQ7SUFBQTtJQUF5QixDQUFDO0lBZDFCO1FBQUMsZUFBUSxDQUFDO1lBQ1IsT0FBTyxFQUFFO2dCQUNQLDZCQUFrQjtnQkFDbEIsK0JBQXVCO2dCQUN2Qix5QkFBVztnQkFDWCw2Q0FBaUIsQ0FBQyxPQUFPLENBQUM7b0JBQ2xCLElBQUksRUFBRSx3QkFBd0I7aUJBQ2pDLENBQUM7YUFDUDtZQUNELFlBQVksRUFBRTtnQkFDWiw4QkFBYTtnQkFDYixxQ0FBZ0I7YUFDakI7U0FDRixDQUFDOztrQkFBQTtJQUN1QixpQkFBQztBQUFELENBQUMsQUFBMUIsSUFBMEI7QUFBYixrQkFBVSxhQUFHLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOYXRpdmVTY3JpcHRNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvcGxhdGZvcm1cIjtcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdEZvcm1zTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL2Zvcm1zXCI7XG5pbXBvcnQge1ROU0ZvbnRJY29uTW9kdWxlLCBUTlNGb250SWNvblNlcnZpY2UsIFROU0ZvbnRJY29uUGlwZSwgVE5TRm9udEljb25QdXJlUGlwZX0gZnJvbSAnbmF0aXZlc2NyaXB0LW5nMi1mb250aWNvbic7XG5cbmltcG9ydCB7IGhvbWVSb3V0aW5nIH0gZnJvbSBcIi4vaG9tZS5yb3V0ZXNcIjtcbmltcG9ydCB7IEhvbWVDb21wb25lbnQgfSBmcm9tIFwiLi9ob21lLmNvbXBvbmVudFwiO1xuXG5pbXBvcnQgeyBIb21lVGFiQ29tcG9uZW50IH0gZnJvbSAnLi9ob21lLnRhYi5jb21wb25lbnQnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgTmF0aXZlU2NyaXB0TW9kdWxlLFxuICAgIE5hdGl2ZVNjcmlwdEZvcm1zTW9kdWxlLFxuICAgIGhvbWVSb3V0aW5nLFxuICAgIFROU0ZvbnRJY29uTW9kdWxlLmZvclJvb3Qoe1xuICAgICAgICAgICAgJ2ZhJzogJ2ZvbnRzL2ZvbnQtYXdlc29tZS5jc3MnXG4gICAgICAgIH0pLFxuICBdLFxuICBkZWNsYXJhdGlvbnM6IFsgICAgXG4gICAgSG9tZUNvbXBvbmVudCxcbiAgICBIb21lVGFiQ29tcG9uZW50ICAgIFxuICBdXG59KVxuZXhwb3J0IGNsYXNzIEhvbWVNb2R1bGUge30iXX0=