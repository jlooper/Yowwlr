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
        this.yowls$ = this.firebaseService.getYowls();
    };
    HomeComponent.prototype.sendYowl = function () {
        this.yowl = new models_1.Yowl(this.id, this.name, this.username, this.text, this.date, this.UID);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9tZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJob21lLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEscUJBQWtDLGVBQWUsQ0FBQyxDQUFBO0FBR2xELHlCQUFnRCxhQUFhLENBQUMsQ0FBQTtBQUM5RCx1QkFBcUIsV0FBVyxDQUFDLENBQUE7QUFDakMsa0NBQWlDLCtDQUErQyxDQUFDLENBQUE7QUFDakYsdUJBQXVCLGlCQUFpQixDQUFDLENBQUE7QUFPekM7SUFZSSx1QkFBb0IsZ0JBQWtDLEVBQzFDLGVBQWdDLEVBQ2hDLE1BQWM7UUFGTixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQzFDLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUNoQyxXQUFNLEdBQU4sTUFBTSxDQUFRO0lBQ3RCLENBQUM7SUFFTCxnQ0FBUSxHQUFSO1FBQ0csSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNsQyxJQUFJLENBQUMsTUFBTSxHQUFRLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDdEQsQ0FBQztJQUVELGdDQUFRLEdBQVI7UUFDRSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksYUFBSSxDQUNoQixJQUFJLENBQUMsRUFBRSxFQUNQLElBQUksQ0FBQyxJQUFJLEVBQ1QsSUFBSSxDQUFDLFFBQVEsRUFDYixJQUFJLENBQUMsSUFBSSxFQUNULElBQUksQ0FBQyxJQUFJLEVBQ1QsSUFBSSxDQUFDLEdBQUcsQ0FDWCxDQUFBO1FBQ0MsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLE9BQVc7WUFDdEQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3BCLENBQUMsQ0FBQyxDQUFBO0lBQ0wsQ0FBQztJQUVELDhCQUFNLEdBQU47UUFDSSxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQzlCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZFLENBQUM7SUE1Q0w7UUFBQyxnQkFBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFFBQVEsRUFBRSxTQUFTO1lBQ25CLFdBQVcsRUFBRSxXQUFXO1NBQzNCLENBQUM7O3FCQUFBO0lBeUNGLG9CQUFDO0FBQUQsQ0FBQyxBQXhDRCxJQXdDQztBQXhDWSxxQkFBYSxnQkF3Q3pCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMvT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBQYWdlIH0gZnJvbSBcInVpL3BhZ2VcIjtcbmltcG9ydCB7IEJhY2tlbmRTZXJ2aWNlLCBGaXJlYmFzZVNlcnZpY2UgfSBmcm9tIFwiLi4vc2VydmljZXNcIjtcbmltcG9ydCB7IFlvd2wgfSBmcm9tIFwiLi4vbW9kZWxzXCI7XG5pbXBvcnQgeyBSb3V0ZXJFeHRlbnNpb25zIH0gZnJvbSAnbmF0aXZlc2NyaXB0LWFuZ3VsYXIvcm91dGVyL3JvdXRlci1leHRlbnNpb25zJztcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5cbkBDb21wb25lbnQoe1xuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gICAgc2VsZWN0b3I6IFwieXctaG9tZVwiLFxuICAgIHRlbXBsYXRlVXJsOiBcImhvbWUuaHRtbFwiXG59KVxuZXhwb3J0IGNsYXNzIEhvbWVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQgeyBcblxuICAgIHB1YmxpYyB5b3dsOiBZb3dsO1xuICAgIGlkOiBzdHJpbmc7XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIHVzZXJuYW1lOiBzdHJpbmc7XG4gICAgdGV4dDogc3RyaW5nO1xuICAgIGRhdGU6IHN0cmluZztcbiAgICBVSUQ6IHN0cmluZ1xuXG4gICAgcHVibGljIHlvd2xzJDogT2JzZXJ2YWJsZTxhbnk+O1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcm91dGVyRXh0ZW5zaW9uczogUm91dGVyRXh0ZW5zaW9ucyxcbiAgICAgICAgcHJpdmF0ZSBmaXJlYmFzZVNlcnZpY2U6IEZpcmViYXNlU2VydmljZSxcbiAgICAgICAgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlclxuICAgICkgeyB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICB0aGlzLmZpcmViYXNlU2VydmljZS5nZXRNZXNzYWdlKCk7XG4gICAgICAgdGhpcy55b3dscyQgPSA8YW55PnRoaXMuZmlyZWJhc2VTZXJ2aWNlLmdldFlvd2xzKCk7XG4gICAgfVxuXG4gICAgc2VuZFlvd2woKXtcbiAgICAgIHRoaXMueW93bCA9IG5ldyBZb3dsKFxuICAgICAgICAgIHRoaXMuaWQsXG4gICAgICAgICAgdGhpcy5uYW1lLFxuICAgICAgICAgIHRoaXMudXNlcm5hbWUsXG4gICAgICAgICAgdGhpcy50ZXh0LFxuICAgICAgICAgIHRoaXMuZGF0ZSxcbiAgICAgICAgICB0aGlzLlVJRCxcbiAgICAgIClcbiAgICAgICAgdGhpcy5maXJlYmFzZVNlcnZpY2Uuc2VuZFlvd2wodGhpcy55b3dsKS50aGVuKChtZXNzYWdlOmFueSkgPT4ge1xuICAgICAgICAgICAgYWxlcnQobWVzc2FnZSk7XG4gICAgICAgfSkgXG4gICAgfVxuXG4gICAgbG9nb3V0KCkge1xuICAgICAgICB0aGlzLmZpcmViYXNlU2VydmljZS5sb2dvdXQoKTtcbiAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcIi9sb2dpblwiXSwgeyBjbGVhckhpc3Rvcnk6IHRydWUgfSk7XG4gICAgfVxufVxuXG4iXX0=