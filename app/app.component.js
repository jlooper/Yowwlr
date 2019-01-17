"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var firebase = require("nativescript-plugin-firebase");
var dialogs = require("tns-core-modules/ui/dialogs");
var backend_service_1 = require("./services/backend.service");
var AppComponent = /** @class */ (function () {
    function AppComponent() {
    }
    AppComponent.prototype.ngOnInit = function () {
        firebase.init({
            /*onPushTokenReceivedCallback: function(token) {
              alert("Firebase push token: " + token);
            },*/
            onMessageReceivedCallback: function (message) {
                dialogs.alert({
                    title: "Push message: " + (message.title !== undefined ? message.title : ""),
                    message: JSON.stringify(message.body),
                    okButtonText: "W00t!"
                });
            },
            //persist should be set to false as otherwise numbers aren't returned during livesync
            persist: false,
            //storageBucket: 'gs://yowwlr.appspot.com',
            onAuthStateChanged: function (data) {
                if (data.loggedIn) {
                    backend_service_1.BackendService.token = data.user.uid;
                }
                else {
                    backend_service_1.BackendService.token = "";
                }
            }
        }).then(function (instance) {
            console.log("firebase.init done");
        }, function (error) {
            console.log("firebase.init error: " + error);
        });
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: "yw-main",
            template: "<page-router-outlet></page-router-outlet>"
        })
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBa0Q7QUFDbEQsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLDhCQUE4QixDQUFDLENBQUM7QUFDekQscURBQXVEO0FBQ3ZELDhEQUE0RDtBQU01RDtJQUFBO0lBaUNBLENBQUM7SUFoQ0MsK0JBQVEsR0FBUjtRQUNFLFFBQVEsQ0FBQyxJQUFJLENBQUM7WUFDWjs7Z0JBRUk7WUFDSix5QkFBeUIsRUFBRSxVQUFTLE9BQU87Z0JBQ3pDLE9BQU8sQ0FBQyxLQUFLLENBQUM7b0JBQ1osS0FBSyxFQUFFLGdCQUFnQixHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztvQkFDNUUsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztvQkFDckMsWUFBWSxFQUFFLE9BQU87aUJBQ3RCLENBQUMsQ0FBQztZQUNMLENBQUM7WUFDRCxxRkFBcUY7WUFDckYsT0FBTyxFQUFFLEtBQUs7WUFDZCwyQ0FBMkM7WUFDM0Msa0JBQWtCLEVBQUUsVUFBQyxJQUFTO2dCQUM1QixJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7b0JBQ2pCLGdDQUFjLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO2lCQUN0QztxQkFDSTtvQkFDSCxnQ0FBYyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7aUJBQzNCO1lBQ0gsQ0FBQztTQUNGLENBQUMsQ0FBQyxJQUFJLENBQ0gsVUFBVSxRQUFRO1lBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUNwQyxDQUFDLEVBQ0QsVUFBVSxLQUFLO1lBQ2IsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsR0FBRyxLQUFLLENBQUMsQ0FBQztRQUMvQyxDQUFDLENBQ0osQ0FBQztJQUNKLENBQUM7SUFoQ1UsWUFBWTtRQUp4QixnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLFNBQVM7WUFDbkIsUUFBUSxFQUFFLDJDQUEyQztTQUN0RCxDQUFDO09BQ1csWUFBWSxDQWlDeEI7SUFBRCxtQkFBQztDQUFBLEFBakNELElBaUNDO0FBakNZLG9DQUFZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuY29uc3QgZmlyZWJhc2UgPSByZXF1aXJlKFwibmF0aXZlc2NyaXB0LXBsdWdpbi1maXJlYmFzZVwiKTtcbmltcG9ydCAqIGFzIGRpYWxvZ3MgZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvdWkvZGlhbG9nc1wiO1xuaW1wb3J0IHsgQmFja2VuZFNlcnZpY2UgfSBmcm9tIFwiLi9zZXJ2aWNlcy9iYWNrZW5kLnNlcnZpY2VcIjtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiBcInl3LW1haW5cIixcbiAgdGVtcGxhdGU6IFwiPHBhZ2Utcm91dGVyLW91dGxldD48L3BhZ2Utcm91dGVyLW91dGxldD5cIlxufSlcbmV4cG9ydCBjbGFzcyBBcHBDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICBmaXJlYmFzZS5pbml0KHtcbiAgICAgIC8qb25QdXNoVG9rZW5SZWNlaXZlZENhbGxiYWNrOiBmdW5jdGlvbih0b2tlbikge1xuICAgICAgICBhbGVydChcIkZpcmViYXNlIHB1c2ggdG9rZW46IFwiICsgdG9rZW4pO1xuICAgICAgfSwqL1xuICAgICAgb25NZXNzYWdlUmVjZWl2ZWRDYWxsYmFjazogZnVuY3Rpb24obWVzc2FnZSkge1xuICAgICAgICBkaWFsb2dzLmFsZXJ0KHtcbiAgICAgICAgICB0aXRsZTogXCJQdXNoIG1lc3NhZ2U6IFwiICsgKG1lc3NhZ2UudGl0bGUgIT09IHVuZGVmaW5lZCA/IG1lc3NhZ2UudGl0bGUgOiBcIlwiKSxcbiAgICAgICAgICBtZXNzYWdlOiBKU09OLnN0cmluZ2lmeShtZXNzYWdlLmJvZHkpLFxuICAgICAgICAgIG9rQnV0dG9uVGV4dDogXCJXMDB0IVwiXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIC8vcGVyc2lzdCBzaG91bGQgYmUgc2V0IHRvIGZhbHNlIGFzIG90aGVyd2lzZSBudW1iZXJzIGFyZW4ndCByZXR1cm5lZCBkdXJpbmcgbGl2ZXN5bmNcbiAgICAgIHBlcnNpc3Q6IGZhbHNlLFxuICAgICAgLy9zdG9yYWdlQnVja2V0OiAnZ3M6Ly95b3d3bHIuYXBwc3BvdC5jb20nLFxuICAgICAgb25BdXRoU3RhdGVDaGFuZ2VkOiAoZGF0YTogYW55KSA9PiB7XG4gICAgICAgIGlmIChkYXRhLmxvZ2dlZEluKSB7XG4gICAgICAgICAgQmFja2VuZFNlcnZpY2UudG9rZW4gPSBkYXRhLnVzZXIudWlkO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIEJhY2tlbmRTZXJ2aWNlLnRva2VuID0gXCJcIjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pLnRoZW4oXG4gICAgICAgIGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiZmlyZWJhc2UuaW5pdCBkb25lXCIpO1xuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcImZpcmViYXNlLmluaXQgZXJyb3I6IFwiICsgZXJyb3IpO1xuICAgICAgICB9XG4gICAgKTtcbiAgfVxufSJdfQ==