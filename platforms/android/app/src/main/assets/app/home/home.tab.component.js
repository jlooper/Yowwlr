"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var services_1 = require("../services");
var HomeTabComponent = /** @class */ (function () {
    function HomeTabComponent(firebaseService) {
        this.firebaseService = firebaseService;
    }
    HomeTabComponent.prototype.ngOnInit = function () {
        console.log("HomeTab ngOnInit");
        this.yowls$ = this.firebaseService.getYowls();
    };
    HomeTabComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: "home-tab",
            templateUrl: "home.tab.html"
        }),
        __metadata("design:paramtypes", [services_1.FirebaseService])
    ], HomeTabComponent);
    return HomeTabComponent;
}());
exports.HomeTabComponent = HomeTabComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9tZS50YWIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaG9tZS50YWIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWtEO0FBRWxELHdDQUE4QztBQU85QztJQUVJLDBCQUNZLGVBQWdDO1FBQWhDLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtJQUN6QyxDQUFDO0lBSUcsbUNBQVEsR0FBZjtRQUNJLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUNoQyxJQUFJLENBQUMsTUFBTSxHQUFRLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDdkQsQ0FBQztJQVhRLGdCQUFnQjtRQUw1QixnQkFBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFFBQVEsRUFBRSxVQUFVO1lBQ3BCLFdBQVcsRUFBRSxlQUFlO1NBQy9CLENBQUM7eUNBSStCLDBCQUFlO09BSG5DLGdCQUFnQixDQWE1QjtJQUFELHVCQUFDO0NBQUEsQUFiRCxJQWFDO0FBYlksNENBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgRmlyZWJhc2VTZXJ2aWNlIH0gZnJvbSBcIi4uL3NlcnZpY2VzXCI7XG5cbkBDb21wb25lbnQoe1xuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gICAgc2VsZWN0b3I6IFwiaG9tZS10YWJcIixcbiAgICB0ZW1wbGF0ZVVybDogXCJob21lLnRhYi5odG1sXCJcbn0pXG5leHBvcnQgY2xhc3MgSG9tZVRhYkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgZmlyZWJhc2VTZXJ2aWNlOiBGaXJlYmFzZVNlcnZpY2VcbiAgICApIHt9XG5cbiAgICBwdWJsaWMgeW93bHMkOiBPYnNlcnZhYmxlPGFueT47XG4gICAgXG4gICAgcHVibGljIG5nT25Jbml0KCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkhvbWVUYWIgbmdPbkluaXRcIik7XG4gICAgICAgIHRoaXMueW93bHMkID0gPGFueT50aGlzLmZpcmViYXNlU2VydmljZS5nZXRZb3dscygpO1xuICAgIH1cblxufSJdfQ==