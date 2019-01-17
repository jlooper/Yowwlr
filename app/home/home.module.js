"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nativescript_module_1 = require("nativescript-angular/nativescript.module");
var core_1 = require("@angular/core");
var forms_1 = require("nativescript-angular/forms");
var nativescript_ngx_fonticon_1 = require("nativescript-ngx-fonticon");
var home_routes_1 = require("./home.routes");
var home_component_1 = require("./home.component");
var home_tab_component_1 = require("./home.tab.component");
var chat_tab_component_1 = require("../chat/chat.tab.component");
var HomeModule = /** @class */ (function () {
    function HomeModule() {
    }
    HomeModule = __decorate([
        core_1.NgModule({
            imports: [
                nativescript_module_1.NativeScriptModule,
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
        })
    ], HomeModule);
    return HomeModule;
}());
exports.HomeModule = HomeModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9tZS5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJob21lLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGdGQUE4RTtBQUM5RSxzQ0FBeUM7QUFDekMsb0RBQXFFO0FBQ3JFLHVFQUE4RDtBQUM5RCw2Q0FBNEM7QUFDNUMsbURBQWlEO0FBQ2pELDJEQUF3RDtBQUN4RCxpRUFBOEQ7QUFpQjlEO0lBQUE7SUFBeUIsQ0FBQztJQUFiLFVBQVU7UUFmdEIsZUFBUSxDQUFDO1lBQ1IsT0FBTyxFQUFFO2dCQUNQLHdDQUFrQjtnQkFDbEIsK0JBQXVCO2dCQUN2Qix5QkFBVztnQkFDWCw2Q0FBaUIsQ0FBQyxPQUFPLENBQUM7b0JBQ3hCLElBQUksRUFBRSx3QkFBd0I7aUJBQy9CLENBQUM7YUFDSDtZQUNELFlBQVksRUFBRTtnQkFDWiw4QkFBYTtnQkFDYixxQ0FBZ0I7Z0JBQ2hCLHFDQUFnQjthQUNqQjtTQUNGLENBQUM7T0FDVyxVQUFVLENBQUc7SUFBRCxpQkFBQztDQUFBLEFBQTFCLElBQTBCO0FBQWIsZ0NBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOYXRpdmVTY3JpcHRNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvbmF0aXZlc2NyaXB0Lm1vZHVsZVwiO1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgTmF0aXZlU2NyaXB0Rm9ybXNNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvZm9ybXNcIjtcbmltcG9ydCB7IFROU0ZvbnRJY29uTW9kdWxlIH0gZnJvbSAnbmF0aXZlc2NyaXB0LW5neC1mb250aWNvbic7XG5pbXBvcnQgeyBob21lUm91dGluZyB9IGZyb20gXCIuL2hvbWUucm91dGVzXCI7XG5pbXBvcnQgeyBIb21lQ29tcG9uZW50IH0gZnJvbSBcIi4vaG9tZS5jb21wb25lbnRcIjtcbmltcG9ydCB7IEhvbWVUYWJDb21wb25lbnQgfSBmcm9tICcuL2hvbWUudGFiLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDaGF0VGFiQ29tcG9uZW50IH0gZnJvbSAnLi4vY2hhdC9jaGF0LnRhYi5jb21wb25lbnQnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgTmF0aXZlU2NyaXB0TW9kdWxlLFxuICAgIE5hdGl2ZVNjcmlwdEZvcm1zTW9kdWxlLFxuICAgIGhvbWVSb3V0aW5nLFxuICAgIFROU0ZvbnRJY29uTW9kdWxlLmZvclJvb3Qoe1xuICAgICAgJ2ZhJzogJ2ZvbnRzL2ZvbnQtYXdlc29tZS5jc3MnXG4gICAgfSksXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogWyAgICBcbiAgICBIb21lQ29tcG9uZW50LFxuICAgIEhvbWVUYWJDb21wb25lbnQsXG4gICAgQ2hhdFRhYkNvbXBvbmVudCAgICBcbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBIb21lTW9kdWxlIHt9Il19