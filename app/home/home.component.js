"use strict";
var core_1 = require('@angular/core');
var services_1 = require("../services");
var router_extensions_1 = require('nativescript-angular/router/router-extensions');
var router_1 = require('@angular/router');
var HomeComponent = (function () {
    function HomeComponent(routerExtensions, firebaseService, router) {
        this.routerExtensions = routerExtensions;
        this.firebaseService = firebaseService;
        this.router = router;
    }
    HomeComponent.prototype.ngOnInit = function () {
    };
    HomeComponent.prototype.logout = function () {
        this.firebaseService.logout();
        this.routerExtensions.navigate(["/login"], { clearHistory: true });
    };
    HomeComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: "yw-home",
            templateUrl: "home.html"
        }), 
        __metadata('design:paramtypes', [router_extensions_1.RouterExtensions, services_1.FirebaseService, router_1.Router])
    ], HomeComponent);
    return HomeComponent;
}());
exports.HomeComponent = HomeComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9tZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJob21lLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEscUJBQWtDLGVBQWUsQ0FBQyxDQUFBO0FBR2xELHlCQUFnRCxhQUFhLENBQUMsQ0FBQTtBQUM5RCxrQ0FBaUMsK0NBQStDLENBQUMsQ0FBQTtBQUNqRix1QkFBdUIsaUJBQWlCLENBQUMsQ0FBQTtBQVF6QztJQVdJLHVCQUFvQixnQkFBa0MsRUFDMUMsZUFBZ0MsRUFDaEMsTUFBYztRQUZOLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFDMUMsb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBQ2hDLFdBQU0sR0FBTixNQUFNLENBQVE7SUFDdEIsQ0FBQztJQUVMLGdDQUFRLEdBQVI7SUFDQSxDQUFDO0lBR0QsOEJBQU0sR0FBTjtRQUNJLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDOUIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7SUFDdkUsQ0FBQztJQTVCTDtRQUFDLGdCQUFTLENBQUM7WUFDUCxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsUUFBUSxFQUFFLFNBQVM7WUFDbkIsV0FBVyxFQUFFLFdBQVc7U0FDM0IsQ0FBQzs7cUJBQUE7SUF5QkYsb0JBQUM7QUFBRCxDQUFDLEFBeEJELElBd0JDO0FBeEJZLHFCQUFhLGdCQXdCekIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcy9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFBhZ2UgfSBmcm9tIFwidWkvcGFnZVwiO1xuaW1wb3J0IHsgQmFja2VuZFNlcnZpY2UsIEZpcmViYXNlU2VydmljZSB9IGZyb20gXCIuLi9zZXJ2aWNlc1wiO1xuaW1wb3J0IHsgUm91dGVyRXh0ZW5zaW9ucyB9IGZyb20gJ25hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlci9yb3V0ZXItZXh0ZW5zaW9ucyc7XG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuXG5cbkBDb21wb25lbnQoe1xuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gICAgc2VsZWN0b3I6IFwieXctaG9tZVwiLFxuICAgIHRlbXBsYXRlVXJsOiBcImhvbWUuaHRtbFwiXG59KVxuZXhwb3J0IGNsYXNzIEhvbWVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gICAgaWQ6IHN0cmluZztcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgZGF0ZTogc3RyaW5nO1xuICAgIGRlc2NyaXB0aW9uOiBzdHJpbmc7XG4gICAgaW1hZ2VwYXRoOiBzdHJpbmc7XG4gICAgVUlEOiBzdHJpbmc7XG5cbiAgICBwdWJsaWMgZ2lmdHMkOiBPYnNlcnZhYmxlPGFueT47XG4gICAgXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByb3V0ZXJFeHRlbnNpb25zOiBSb3V0ZXJFeHRlbnNpb25zLFxuICAgICAgICBwcml2YXRlIGZpcmViYXNlU2VydmljZTogRmlyZWJhc2VTZXJ2aWNlLFxuICAgICAgICBwcml2YXRlIHJvdXRlcjogUm91dGVyXG4gICAgKSB7IH1cblxuICAgIG5nT25Jbml0KCkge1xuICAgIH1cblxuXG4gICAgbG9nb3V0KCkge1xuICAgICAgICB0aGlzLmZpcmViYXNlU2VydmljZS5sb2dvdXQoKTtcbiAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcIi9sb2dpblwiXSwgeyBjbGVhckhpc3Rvcnk6IHRydWUgfSk7XG4gICAgfVxufVxuXG4iXX0=