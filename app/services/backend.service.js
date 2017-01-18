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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2VuZC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYmFja2VuZC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxxQ0FBcUMsc0JBQXNCLENBQUMsQ0FBQTtBQUU1RCxJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUM7QUFFekI7SUFBQTtJQWFBLENBQUM7SUFYUSx5QkFBVSxHQUFqQjtRQUNFLE1BQU0sQ0FBQyxDQUFDLENBQUMsZ0NBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRUQsc0JBQVcsdUJBQUs7YUFBaEI7WUFDRSxNQUFNLENBQUMsZ0NBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM1QixDQUFDO2FBRUQsVUFBaUIsUUFBZ0I7WUFDL0IsZ0NBQVMsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDL0IsQ0FBQzs7O09BSkE7SUFLSCxxQkFBQztBQUFELENBQUMsQUFiRCxJQWFDO0FBYlksc0JBQWMsaUJBYTFCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IGdldFN0cmluZywgc2V0U3RyaW5nIH0gZnJvbSBcImFwcGxpY2F0aW9uLXNldHRpbmdzXCI7XG5cbmNvbnN0IHRva2VuS2V5ID0gXCJ0b2tlblwiO1xuXG5leHBvcnQgY2xhc3MgQmFja2VuZFNlcnZpY2Uge1xuICBcbiAgc3RhdGljIGlzTG9nZ2VkSW4oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEhZ2V0U3RyaW5nKFwidG9rZW5cIik7XG4gIH1cblxuICBzdGF0aWMgZ2V0IHRva2VuKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGdldFN0cmluZyhcInRva2VuXCIpO1xuICB9XG5cbiAgc3RhdGljIHNldCB0b2tlbih0aGVUb2tlbjogc3RyaW5nKSB7XG4gICAgc2V0U3RyaW5nKFwidG9rZW5cIiwgdGhlVG9rZW4pO1xuICB9XG59XG4iXX0=