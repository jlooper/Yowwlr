"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var services_1 = require("../services");
var models_1 = require("../models");
var router_extensions_1 = require("nativescript-angular/router/router-extensions");
var router_1 = require("@angular/router");
var HomeComponent = /** @class */ (function () {
    function HomeComponent(routerExtensions, firebaseService, router) {
        this.routerExtensions = routerExtensions;
        this.firebaseService = firebaseService;
        this.router = router;
    }
    HomeComponent.prototype.ngOnInit = function () {
        this.firebaseService.getMessage();
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
        __metadata("design:paramtypes", [router_extensions_1.RouterExtensions,
            services_1.FirebaseService,
            router_1.Router])
    ], HomeComponent);
    return HomeComponent;
}());
exports.HomeComponent = HomeComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9tZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJob21lLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFrRDtBQUVsRCx3Q0FBOEM7QUFDOUMsb0NBQWlDO0FBQ2pDLG1GQUFpRjtBQUNqRiwwQ0FBeUM7QUFPekM7SUFZSSx1QkFBb0IsZ0JBQWtDLEVBQzFDLGVBQWdDLEVBQ2hDLE1BQWM7UUFGTixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQzFDLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUNoQyxXQUFNLEdBQU4sTUFBTSxDQUFRO0lBQ3ZCLENBQUM7SUFFSixnQ0FBUSxHQUFSO1FBQ0csSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUNyQyxDQUFDO0lBRUQsZ0NBQVEsR0FBUjtRQUNFLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxhQUFJLENBQ2hCLElBQUksQ0FBQyxFQUFFLEVBQ1AsSUFBSSxDQUFDLElBQUksRUFDVCxJQUFJLENBQUMsUUFBUSxFQUNiLElBQUksQ0FBQyxJQUFJLEVBQ1QsSUFBSSxDQUFDLElBQUksRUFDVCxJQUFJLENBQUMsR0FBRyxDQUNYLENBQUE7UUFDQyxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsT0FBVztZQUN0RCxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDcEIsQ0FBQyxDQUFDLENBQUE7SUFDTCxDQUFDO0lBRUQsOEJBQU0sR0FBTjtRQUNJLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDOUIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7SUFDdkUsQ0FBQztJQXRDUSxhQUFhO1FBTHpCLGdCQUFTLENBQUM7WUFDUCxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsUUFBUSxFQUFFLFNBQVM7WUFDbkIsV0FBVyxFQUFFLFdBQVc7U0FDM0IsQ0FBQzt5Q0Fhd0Msb0NBQWdCO1lBQ3pCLDBCQUFlO1lBQ3hCLGVBQU07T0FkakIsYUFBYSxDQXVDekI7SUFBRCxvQkFBQztDQUFBLEFBdkNELElBdUNDO0FBdkNZLHNDQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IEZpcmViYXNlU2VydmljZSB9IGZyb20gXCIuLi9zZXJ2aWNlc1wiO1xuaW1wb3J0IHsgWW93bCB9IGZyb20gXCIuLi9tb2RlbHNcIjtcbmltcG9ydCB7IFJvdXRlckV4dGVuc2lvbnMgfSBmcm9tICduYXRpdmVzY3JpcHQtYW5ndWxhci9yb3V0ZXIvcm91dGVyLWV4dGVuc2lvbnMnO1xuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcblxuQENvbXBvbmVudCh7XG4gICAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgICBzZWxlY3RvcjogXCJ5dy1ob21lXCIsXG4gICAgdGVtcGxhdGVVcmw6IFwiaG9tZS5odG1sXCJcbn0pXG5leHBvcnQgY2xhc3MgSG9tZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7IFxuXG4gICAgcHVibGljIHlvd2w6IFlvd2w7XG4gICAgaWQ6IHN0cmluZztcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgdXNlcm5hbWU6IHN0cmluZztcbiAgICB0ZXh0OiBzdHJpbmc7XG4gICAgZGF0ZTogc3RyaW5nO1xuICAgIFVJRDogc3RyaW5nXG5cbiAgICBwdWJsaWMgeW93bHMkOiBPYnNlcnZhYmxlPGFueT47XG4gICAgXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByb3V0ZXJFeHRlbnNpb25zOiBSb3V0ZXJFeHRlbnNpb25zLFxuICAgICAgICBwcml2YXRlIGZpcmViYXNlU2VydmljZTogRmlyZWJhc2VTZXJ2aWNlLFxuICAgICAgICBwcml2YXRlIHJvdXRlcjogUm91dGVyXG4gICAgKSB7fVxuXG4gICAgbmdPbkluaXQoKSB7ICAgICAgICBcbiAgICAgICB0aGlzLmZpcmViYXNlU2VydmljZS5nZXRNZXNzYWdlKCk7XG4gICAgfVxuICAgIFxuICAgIHNlbmRZb3dsKCl7XG4gICAgICB0aGlzLnlvd2wgPSBuZXcgWW93bChcbiAgICAgICAgICB0aGlzLmlkLFxuICAgICAgICAgIHRoaXMubmFtZSxcbiAgICAgICAgICB0aGlzLnVzZXJuYW1lLFxuICAgICAgICAgIHRoaXMudGV4dCxcbiAgICAgICAgICB0aGlzLmRhdGUsXG4gICAgICAgICAgdGhpcy5VSUQsXG4gICAgICApXG4gICAgICAgIHRoaXMuZmlyZWJhc2VTZXJ2aWNlLnNlbmRZb3dsKHRoaXMueW93bCkudGhlbigobWVzc2FnZTphbnkpID0+IHtcbiAgICAgICAgICAgIGFsZXJ0KG1lc3NhZ2UpO1xuICAgICAgIH0pIFxuICAgIH1cblxuICAgIGxvZ291dCgpIHtcbiAgICAgICAgdGhpcy5maXJlYmFzZVNlcnZpY2UubG9nb3V0KCk7XG4gICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCIvbG9naW5cIl0sIHsgY2xlYXJIaXN0b3J5OiB0cnVlIH0pO1xuICAgIH1cbn1cblxuIl19