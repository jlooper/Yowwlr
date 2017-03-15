"use strict";
// this import should be first in order to load some required settings (like globals and reflect-metadata)
var platform_1 = require("nativescript-angular/platform");
var app_module_1 = require("./app.module");
var backend_service_1 = require("./services/backend.service");
var dialogs = require("ui/dialogs");
var firebase = require("nativescript-plugin-firebase");
firebase.init({
    /*onPushTokenReceivedCallback: function(token) {
      alert("Firebase push token: " + token);
    },
    onMessageReceivedCallback: function(message) {
      dialogs.alert({
        title: "Push message: " + (message.title !== undefined ? message.title : ""),
        message: JSON.stringify(message.body),
        okButtonText: "W00t!"
      });
    },*/
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
platform_1.platformNativeScriptDynamic().bootstrapModule(app_module_1.AppModule);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDBHQUEwRztBQUMxRyx5QkFBNEMsK0JBQStCLENBQUMsQ0FBQTtBQUU1RSwyQkFBMEIsY0FBYyxDQUFDLENBQUE7QUFDekMsZ0NBQStCLDRCQUE0QixDQUFDLENBQUE7QUFDNUQsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3RDLElBQU8sUUFBUSxXQUFXLDhCQUE4QixDQUFDLENBQUM7QUFFekQsUUFBUSxDQUFDLElBQUksQ0FBQztJQUNaOzs7Ozs7Ozs7UUFTSTtJQUNKLHFGQUFxRjtJQUNyRixPQUFPLEVBQUUsS0FBSztJQUNkLDJDQUEyQztJQUMzQyxrQkFBa0IsRUFBRSxVQUFDLElBQVM7UUFDNUIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDbEIsZ0NBQWMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDdkMsQ0FBQztRQUNELElBQUksQ0FBQyxDQUFDO1lBQ0osZ0NBQWMsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQzVCLENBQUM7SUFDSCxDQUFDO0NBQ0YsQ0FBQyxDQUFDLElBQUksQ0FDSCxVQUFVLFFBQVE7SUFDaEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQ3BDLENBQUMsRUFDRCxVQUFVLEtBQUs7SUFDYixPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixHQUFHLEtBQUssQ0FBQyxDQUFDO0FBQy9DLENBQUMsQ0FDSixDQUFDO0FBRUgsc0NBQTJCLEVBQUUsQ0FBQyxlQUFlLENBQUMsc0JBQVMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gdGhpcyBpbXBvcnQgc2hvdWxkIGJlIGZpcnN0IGluIG9yZGVyIHRvIGxvYWQgc29tZSByZXF1aXJlZCBzZXR0aW5ncyAobGlrZSBnbG9iYWxzIGFuZCByZWZsZWN0LW1ldGFkYXRhKVxuaW1wb3J0IHsgcGxhdGZvcm1OYXRpdmVTY3JpcHREeW5hbWljIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL3BsYXRmb3JtXCI7XG5cbmltcG9ydCB7IEFwcE1vZHVsZSB9IGZyb20gXCIuL2FwcC5tb2R1bGVcIjtcbmltcG9ydCB7IEJhY2tlbmRTZXJ2aWNlIH0gZnJvbSBcIi4vc2VydmljZXMvYmFja2VuZC5zZXJ2aWNlXCI7XG5jb25zdCBkaWFsb2dzID0gcmVxdWlyZShcInVpL2RpYWxvZ3NcIik7XG5pbXBvcnQgZmlyZWJhc2UgPSByZXF1aXJlKFwibmF0aXZlc2NyaXB0LXBsdWdpbi1maXJlYmFzZVwiKTtcblxuIGZpcmViYXNlLmluaXQoe1xuICAgLypvblB1c2hUb2tlblJlY2VpdmVkQ2FsbGJhY2s6IGZ1bmN0aW9uKHRva2VuKSB7XG4gICAgIGFsZXJ0KFwiRmlyZWJhc2UgcHVzaCB0b2tlbjogXCIgKyB0b2tlbik7XG4gICB9LFxuICAgb25NZXNzYWdlUmVjZWl2ZWRDYWxsYmFjazogZnVuY3Rpb24obWVzc2FnZSkge1xuICAgICBkaWFsb2dzLmFsZXJ0KHtcbiAgICAgICB0aXRsZTogXCJQdXNoIG1lc3NhZ2U6IFwiICsgKG1lc3NhZ2UudGl0bGUgIT09IHVuZGVmaW5lZCA/IG1lc3NhZ2UudGl0bGUgOiBcIlwiKSxcbiAgICAgICBtZXNzYWdlOiBKU09OLnN0cmluZ2lmeShtZXNzYWdlLmJvZHkpLFxuICAgICAgIG9rQnV0dG9uVGV4dDogXCJXMDB0IVwiXG4gICAgIH0pO1xuICAgfSwqL1xuICAgLy9wZXJzaXN0IHNob3VsZCBiZSBzZXQgdG8gZmFsc2UgYXMgb3RoZXJ3aXNlIG51bWJlcnMgYXJlbid0IHJldHVybmVkIGR1cmluZyBsaXZlc3luY1xuICAgcGVyc2lzdDogZmFsc2UsXG4gICAvL3N0b3JhZ2VCdWNrZXQ6ICdnczovL3lvd3dsci5hcHBzcG90LmNvbScsXG4gICBvbkF1dGhTdGF0ZUNoYW5nZWQ6IChkYXRhOiBhbnkpID0+IHtcbiAgICAgaWYgKGRhdGEubG9nZ2VkSW4pIHtcbiAgICAgICBCYWNrZW5kU2VydmljZS50b2tlbiA9IGRhdGEudXNlci51aWQ7XG4gICAgIH1cbiAgICAgZWxzZSB7XG4gICAgICAgQmFja2VuZFNlcnZpY2UudG9rZW4gPSBcIlwiO1xuICAgICB9XG4gICB9XG4gfSkudGhlbihcbiAgICAgZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICAgY29uc29sZS5sb2coXCJmaXJlYmFzZS5pbml0IGRvbmVcIik7XG4gICAgIH0sXG4gICAgIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgIGNvbnNvbGUubG9nKFwiZmlyZWJhc2UuaW5pdCBlcnJvcjogXCIgKyBlcnJvcik7XG4gICAgIH1cbiApO1xuXG5wbGF0Zm9ybU5hdGl2ZVNjcmlwdER5bmFtaWMoKS5ib290c3RyYXBNb2R1bGUoQXBwTW9kdWxlKTsiXX0=