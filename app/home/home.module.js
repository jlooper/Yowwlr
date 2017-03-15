"use strict";
var platform_1 = require("nativescript-angular/platform");
var core_1 = require("@angular/core");
var forms_1 = require("nativescript-angular/forms");
var nativescript_ngx_fonticon_1 = require('nativescript-ngx-fonticon');
var home_routes_1 = require("./home.routes");
var home_component_1 = require("./home.component");
var home_tab_component_1 = require('./home.tab.component');
var chat_tab_component_1 = require('../chat/chat.tab.component');
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
                home_tab_component_1.HomeTabComponent,
                chat_tab_component_1.ChatTabComponent
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], HomeModule);
    return HomeModule;
}());
exports.HomeModule = HomeModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9tZS5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJob21lLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEseUJBQW1DLCtCQUErQixDQUFDLENBQUE7QUFDbkUscUJBQXlCLGVBQWUsQ0FBQyxDQUFBO0FBQ3pDLHNCQUF3Qyw0QkFBNEIsQ0FBQyxDQUFBO0FBQ3JFLDBDQUEwRiwyQkFBMkIsQ0FBQyxDQUFBO0FBQ3RILDRCQUE0QixlQUFlLENBQUMsQ0FBQTtBQUM1QywrQkFBOEIsa0JBQWtCLENBQUMsQ0FBQTtBQUNqRCxtQ0FBaUMsc0JBQXNCLENBQUMsQ0FBQTtBQUN4RCxtQ0FBaUMsNEJBQTRCLENBQUMsQ0FBQTtBQWlCOUQ7SUFBQTtJQUF5QixDQUFDO0lBZjFCO1FBQUMsZUFBUSxDQUFDO1lBQ1IsT0FBTyxFQUFFO2dCQUNQLDZCQUFrQjtnQkFDbEIsK0JBQXVCO2dCQUN2Qix5QkFBVztnQkFDWCw2Q0FBaUIsQ0FBQyxPQUFPLENBQUM7b0JBQ3hCLElBQUksRUFBRSx3QkFBd0I7aUJBQy9CLENBQUM7YUFDSDtZQUNELFlBQVksRUFBRTtnQkFDWiw4QkFBYTtnQkFDYixxQ0FBZ0I7Z0JBQ2hCLHFDQUFnQjthQUNqQjtTQUNGLENBQUM7O2tCQUFBO0lBQ3VCLGlCQUFDO0FBQUQsQ0FBQyxBQUExQixJQUEwQjtBQUFiLGtCQUFVLGFBQUcsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5hdGl2ZVNjcmlwdE1vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9wbGF0Zm9ybVwiO1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgTmF0aXZlU2NyaXB0Rm9ybXNNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvZm9ybXNcIjtcbmltcG9ydCB7VE5TRm9udEljb25Nb2R1bGUsIFROU0ZvbnRJY29uU2VydmljZSwgVE5TRm9udEljb25QaXBlLCBUTlNGb250SWNvblB1cmVQaXBlfSBmcm9tICduYXRpdmVzY3JpcHQtbmd4LWZvbnRpY29uJztcbmltcG9ydCB7IGhvbWVSb3V0aW5nIH0gZnJvbSBcIi4vaG9tZS5yb3V0ZXNcIjtcbmltcG9ydCB7IEhvbWVDb21wb25lbnQgfSBmcm9tIFwiLi9ob21lLmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgSG9tZVRhYkNvbXBvbmVudCB9IGZyb20gJy4vaG9tZS50YWIuY29tcG9uZW50JztcbmltcG9ydCB7IENoYXRUYWJDb21wb25lbnQgfSBmcm9tICcuLi9jaGF0L2NoYXQudGFiLmNvbXBvbmVudCc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBOYXRpdmVTY3JpcHRNb2R1bGUsXG4gICAgTmF0aXZlU2NyaXB0Rm9ybXNNb2R1bGUsXG4gICAgaG9tZVJvdXRpbmcsXG4gICAgVE5TRm9udEljb25Nb2R1bGUuZm9yUm9vdCh7XG4gICAgICAnZmEnOiAnZm9udHMvZm9udC1hd2Vzb21lLmNzcydcbiAgICB9KSxcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbICAgIFxuICAgIEhvbWVDb21wb25lbnQsXG4gICAgSG9tZVRhYkNvbXBvbmVudCxcbiAgICBDaGF0VGFiQ29tcG9uZW50ICAgIFxuICBdXG59KVxuZXhwb3J0IGNsYXNzIEhvbWVNb2R1bGUge30iXX0=