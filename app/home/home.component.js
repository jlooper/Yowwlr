"use strict";
var core_1 = require('@angular/core');
var services_1 = require("../services");
var router_extensions_1 = require('nativescript-angular/router/router-extensions');
var router_1 = require('@angular/router');
var HomeComponent = (function () {
    function HomeComponent(routerExtensions, firebaseService, catService, router) {
        this.routerExtensions = routerExtensions;
        this.firebaseService = firebaseService;
        this.catService = catService;
        this.router = router;
    }
    HomeComponent.prototype.ngOnInit = function () {
        this.firebaseService.getMessage();
        this.cats$ = this.catService.getCats();
        console.log(JSON.stringify(this.cats$));
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
        __metadata('design:paramtypes', [router_extensions_1.RouterExtensions, services_1.FirebaseService, services_1.CatService, router_1.Router])
    ], HomeComponent);
    return HomeComponent;
}());
exports.HomeComponent = HomeComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9tZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJob21lLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEscUJBQWtDLGVBQWUsQ0FBQyxDQUFBO0FBR2xELHlCQUE0RCxhQUFhLENBQUMsQ0FBQTtBQUMxRSxrQ0FBaUMsK0NBQStDLENBQUMsQ0FBQTtBQUNqRix1QkFBdUIsaUJBQWlCLENBQUMsQ0FBQTtBQVF6QztJQU1JLHVCQUFvQixnQkFBa0MsRUFDMUMsZUFBZ0MsRUFDaEMsVUFBc0IsRUFDdEIsTUFBYztRQUhOLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFDMUMsb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBQ2hDLGVBQVUsR0FBVixVQUFVLENBQVk7UUFDdEIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtJQUN0QixDQUFDO0lBRUwsZ0NBQVEsR0FBUjtRQUNHLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDbEMsSUFBSSxDQUFDLEtBQUssR0FBUSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzVDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQTtJQUMxQyxDQUFDO0lBRUQsOEJBQU0sR0FBTjtRQUNJLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDOUIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7SUFDdkUsQ0FBQztJQTFCTDtRQUFDLGdCQUFTLENBQUM7WUFDUCxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsUUFBUSxFQUFFLFNBQVM7WUFDbkIsV0FBVyxFQUFFLFdBQVc7U0FDM0IsQ0FBQzs7cUJBQUE7SUF1QkYsb0JBQUM7QUFBRCxDQUFDLEFBdEJELElBc0JDO0FBdEJZLHFCQUFhLGdCQXNCekIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcy9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFBhZ2UgfSBmcm9tIFwidWkvcGFnZVwiO1xuaW1wb3J0IHsgQmFja2VuZFNlcnZpY2UsIEZpcmViYXNlU2VydmljZSwgQ2F0U2VydmljZSB9IGZyb20gXCIuLi9zZXJ2aWNlc1wiO1xuaW1wb3J0IHsgUm91dGVyRXh0ZW5zaW9ucyB9IGZyb20gJ25hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlci9yb3V0ZXItZXh0ZW5zaW9ucyc7XG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgQ2F0IH0gZnJvbSAnLi4vbW9kZWxzL2NhdC5tb2RlbCc7XG5cbkBDb21wb25lbnQoe1xuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gICAgc2VsZWN0b3I6IFwieXctaG9tZVwiLFxuICAgIHRlbXBsYXRlVXJsOiBcImhvbWUuaHRtbFwiXG59KVxuZXhwb3J0IGNsYXNzIEhvbWVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQgeyBcbiAgICBcbiBcblxuICAgIHB1YmxpYyBjYXRzJDogT2JzZXJ2YWJsZTxDYXRbXT47XG4gICAgXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByb3V0ZXJFeHRlbnNpb25zOiBSb3V0ZXJFeHRlbnNpb25zLFxuICAgICAgICBwcml2YXRlIGZpcmViYXNlU2VydmljZTogRmlyZWJhc2VTZXJ2aWNlLFxuICAgICAgICBwcml2YXRlIGNhdFNlcnZpY2U6IENhdFNlcnZpY2UsXG4gICAgICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXJcbiAgICApIHsgfVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgdGhpcy5maXJlYmFzZVNlcnZpY2UuZ2V0TWVzc2FnZSgpO1xuICAgICAgIHRoaXMuY2F0cyQgPSA8YW55PnRoaXMuY2F0U2VydmljZS5nZXRDYXRzKCk7XG4gICAgICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkodGhpcy5jYXRzJCkpXG4gICAgfVxuXG4gICAgbG9nb3V0KCkge1xuICAgICAgICB0aGlzLmZpcmViYXNlU2VydmljZS5sb2dvdXQoKTtcbiAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcIi9sb2dpblwiXSwgeyBjbGVhckhpc3Rvcnk6IHRydWUgfSk7XG4gICAgfVxufVxuXG4iXX0=