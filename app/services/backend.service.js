"use strict";
var application_settings_1 = require("application-settings");
var tokenKey = "token";
var BackendService = (function () {
    function BackendService() {
    }
    BackendService.isLoggedIn = function () {
        return !!application_settings_1.getString("token");
    };
    Object.defineProperty(BackendService, "token", {
        get: function () {
            return application_settings_1.getString("token");
        },
        set: function (theToken) {
            application_settings_1.setString("token", theToken);
        },
        enumerable: true,
        configurable: true
    });
    return BackendService;
}());
exports.BackendService = BackendService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2VuZC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYmFja2VuZC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxxQ0FBcUMsc0JBQXNCLENBQUMsQ0FBQTtBQUU1RCxJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUM7QUFFekI7SUFBQTtJQWFBLENBQUM7SUFYTSx5QkFBVSxHQUFqQjtRQUNJLE1BQU0sQ0FBQyxDQUFDLENBQUMsZ0NBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRUQsc0JBQVcsdUJBQUs7YUFBaEI7WUFDRSxNQUFNLENBQUMsZ0NBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM1QixDQUFDO2FBRUQsVUFBaUIsUUFBZ0I7WUFDL0IsZ0NBQVMsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDL0IsQ0FBQzs7O09BSkE7SUFLSCxxQkFBQztBQUFELENBQUMsQUFiRCxJQWFDO0FBYlksc0JBQWMsaUJBYTFCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXRTdHJpbmcsIHNldFN0cmluZyB9IGZyb20gXCJhcHBsaWNhdGlvbi1zZXR0aW5nc1wiO1xuXG5jb25zdCB0b2tlbktleSA9IFwidG9rZW5cIjtcblxuZXhwb3J0IGNsYXNzIEJhY2tlbmRTZXJ2aWNlIHtcblxuc3RhdGljIGlzTG9nZ2VkSW4oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEhZ2V0U3RyaW5nKFwidG9rZW5cIik7XG4gIH1cblxuICBzdGF0aWMgZ2V0IHRva2VuKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGdldFN0cmluZyhcInRva2VuXCIpO1xuICB9XG5cbiAgc3RhdGljIHNldCB0b2tlbih0aGVUb2tlbjogc3RyaW5nKSB7XG4gICAgc2V0U3RyaW5nKFwidG9rZW5cIiwgdGhlVG9rZW4pO1xuICB9XG59XG4iXX0=