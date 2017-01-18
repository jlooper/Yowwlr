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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9tZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJob21lLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEscUJBQWtDLGVBQWUsQ0FBQyxDQUFBO0FBR2xELHlCQUFnRCxhQUFhLENBQUMsQ0FBQTtBQUM5RCxrQ0FBaUMsK0NBQStDLENBQUMsQ0FBQTtBQUNqRix1QkFBdUIsaUJBQWlCLENBQUMsQ0FBQTtBQU96QztJQVdJLHVCQUFvQixnQkFBa0MsRUFDMUMsZUFBZ0MsRUFDaEMsTUFBYztRQUZOLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFDMUMsb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBQ2hDLFdBQU0sR0FBTixNQUFNLENBQVE7SUFDdEIsQ0FBQztJQUVMLGdDQUFRLEdBQVI7SUFDQSxDQUFDO0lBR0QsOEJBQU0sR0FBTjtRQUNJLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDOUIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7SUFDdkUsQ0FBQztJQTVCTDtRQUFDLGdCQUFTLENBQUM7WUFDUCxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsUUFBUSxFQUFFLFNBQVM7WUFDbkIsV0FBVyxFQUFFLFdBQVc7U0FDM0IsQ0FBQzs7cUJBQUE7SUF5QkYsb0JBQUM7QUFBRCxDQUFDLEFBeEJELElBd0JDO0FBeEJZLHFCQUFhLGdCQXdCekIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcy9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFBhZ2UgfSBmcm9tIFwidWkvcGFnZVwiO1xuaW1wb3J0IHsgQmFja2VuZFNlcnZpY2UsIEZpcmViYXNlU2VydmljZSB9IGZyb20gXCIuLi9zZXJ2aWNlc1wiO1xuaW1wb3J0IHsgUm91dGVyRXh0ZW5zaW9ucyB9IGZyb20gJ25hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlci9yb3V0ZXItZXh0ZW5zaW9ucyc7XG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuXG5AQ29tcG9uZW50KHtcbiAgICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICAgIHNlbGVjdG9yOiBcInl3LWhvbWVcIixcbiAgICB0ZW1wbGF0ZVVybDogXCJob21lLmh0bWxcIlxufSlcbmV4cG9ydCBjbGFzcyBIb21lQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICAgIGlkOiBzdHJpbmc7XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIGRhdGU6IHN0cmluZztcbiAgICBkZXNjcmlwdGlvbjogc3RyaW5nO1xuICAgIGltYWdlcGF0aDogc3RyaW5nO1xuICAgIFVJRDogc3RyaW5nO1xuXG4gICAgcHVibGljIGdpZnRzJDogT2JzZXJ2YWJsZTxhbnk+O1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcm91dGVyRXh0ZW5zaW9uczogUm91dGVyRXh0ZW5zaW9ucyxcbiAgICAgICAgcHJpdmF0ZSBmaXJlYmFzZVNlcnZpY2U6IEZpcmViYXNlU2VydmljZSxcbiAgICAgICAgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlclxuICAgICkgeyB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICB9XG5cblxuICAgIGxvZ291dCgpIHtcbiAgICAgICAgdGhpcy5maXJlYmFzZVNlcnZpY2UubG9nb3V0KCk7XG4gICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCIvbG9naW5cIl0sIHsgY2xlYXJIaXN0b3J5OiB0cnVlIH0pO1xuICAgIH1cbn1cblxuIl19