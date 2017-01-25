"use strict";
var core_1 = require('@angular/core');
var services_1 = require("../services");
var models_1 = require("../models");
var router_extensions_1 = require('nativescript-angular/router/router-extensions');
var router_1 = require('@angular/router');
var HomeComponent = (function () {
    function HomeComponent(routerExtensions, firebaseService, router) {
        this.routerExtensions = routerExtensions;
        this.firebaseService = firebaseService;
        this.router = router;
    }
    HomeComponent.prototype.ngOnInit = function () {
        this.firebaseService.getMessage();
    };
    HomeComponent.prototype.sendYowl = function () {
        this.yowl = new models_1.Yowl();
        this.firebaseService.sendYowl(this.yowl).then(function (message) {
            alert(message);
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9tZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJob21lLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEscUJBQWtDLGVBQWUsQ0FBQyxDQUFBO0FBR2xELHlCQUFnRCxhQUFhLENBQUMsQ0FBQTtBQUM5RCx1QkFBcUIsV0FBVyxDQUFDLENBQUE7QUFDakMsa0NBQWlDLCtDQUErQyxDQUFDLENBQUE7QUFDakYsdUJBQXVCLGlCQUFpQixDQUFDLENBQUE7QUFPekM7SUFPSSx1QkFBb0IsZ0JBQWtDLEVBQzFDLGVBQWdDLEVBQ2hDLE1BQWM7UUFGTixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQzFDLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUNoQyxXQUFNLEdBQU4sTUFBTSxDQUFRO0lBQ3RCLENBQUM7SUFFTCxnQ0FBUSxHQUFSO1FBQ0csSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUNyQyxDQUFDO0lBRUQsZ0NBQVEsR0FBUjtRQUNFLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxhQUFJLEVBQUUsQ0FBQTtRQUNwQixJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsT0FBVztZQUN0RCxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDcEIsQ0FBQyxDQUFDLENBQUE7SUFDTCxDQUFDO0lBRUQsOEJBQU0sR0FBTjtRQUNJLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDOUIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7SUFDdkUsQ0FBQztJQS9CTDtRQUFDLGdCQUFTLENBQUM7WUFDUCxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsUUFBUSxFQUFFLFNBQVM7WUFDbkIsV0FBVyxFQUFFLFdBQVc7U0FDM0IsQ0FBQzs7cUJBQUE7SUE0QkYsb0JBQUM7QUFBRCxDQUFDLEFBM0JELElBMkJDO0FBM0JZLHFCQUFhLGdCQTJCekIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcy9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFBhZ2UgfSBmcm9tIFwidWkvcGFnZVwiO1xuaW1wb3J0IHsgQmFja2VuZFNlcnZpY2UsIEZpcmViYXNlU2VydmljZSB9IGZyb20gXCIuLi9zZXJ2aWNlc1wiO1xuaW1wb3J0IHsgWW93bCB9IGZyb20gXCIuLi9tb2RlbHNcIjtcbmltcG9ydCB7IFJvdXRlckV4dGVuc2lvbnMgfSBmcm9tICduYXRpdmVzY3JpcHQtYW5ndWxhci9yb3V0ZXIvcm91dGVyLWV4dGVuc2lvbnMnO1xuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcblxuQENvbXBvbmVudCh7XG4gICAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgICBzZWxlY3RvcjogXCJ5dy1ob21lXCIsXG4gICAgdGVtcGxhdGVVcmw6IFwiaG9tZS5odG1sXCJcbn0pXG5leHBvcnQgY2xhc3MgSG9tZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7IFxuXG4gICAgcHVibGljIHlvd2w6IFlvd2w7XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIHVzZXJuYW1lOiBzdHJpbmc7XG4gICAgdGV4dDogc3RyaW5nO1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcm91dGVyRXh0ZW5zaW9uczogUm91dGVyRXh0ZW5zaW9ucyxcbiAgICAgICAgcHJpdmF0ZSBmaXJlYmFzZVNlcnZpY2U6IEZpcmViYXNlU2VydmljZSxcbiAgICAgICAgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlclxuICAgICkgeyB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICB0aGlzLmZpcmViYXNlU2VydmljZS5nZXRNZXNzYWdlKCk7XG4gICAgfVxuXG4gICAgc2VuZFlvd2woKXtcbiAgICAgIHRoaXMueW93bCA9IG5ldyBZb3dsKClcbiAgICAgICAgdGhpcy5maXJlYmFzZVNlcnZpY2Uuc2VuZFlvd2wodGhpcy55b3dsKS50aGVuKChtZXNzYWdlOmFueSkgPT4ge1xuICAgICAgICAgICAgYWxlcnQobWVzc2FnZSk7XG4gICAgICAgfSkgXG4gICAgfVxuXG4gICAgbG9nb3V0KCkge1xuICAgICAgICB0aGlzLmZpcmViYXNlU2VydmljZS5sb2dvdXQoKTtcbiAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcIi9sb2dpblwiXSwgeyBjbGVhckhpc3Rvcnk6IHRydWUgfSk7XG4gICAgfVxufVxuXG4iXX0=