"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var application_settings_1 = require("tns-core-modules/application-settings");
var tokenKey = "token";
var BackendService = /** @class */ (function () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2VuZC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYmFja2VuZC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsOEVBQTZFO0FBRTdFLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQztBQUV6QjtJQUFBO0lBYUEsQ0FBQztJQVhNLHlCQUFVLEdBQWpCO1FBQ0ksT0FBTyxDQUFDLENBQUMsZ0NBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRUQsc0JBQVcsdUJBQUs7YUFBaEI7WUFDRSxPQUFPLGdDQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDNUIsQ0FBQzthQUVELFVBQWlCLFFBQWdCO1lBQy9CLGdDQUFTLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQy9CLENBQUM7OztPQUpBO0lBS0gscUJBQUM7QUFBRCxDQUFDLEFBYkQsSUFhQztBQWJZLHdDQUFjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2V0U3RyaW5nLCBzZXRTdHJpbmcgfSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy9hcHBsaWNhdGlvbi1zZXR0aW5nc1wiO1xuXG5jb25zdCB0b2tlbktleSA9IFwidG9rZW5cIjtcblxuZXhwb3J0IGNsYXNzIEJhY2tlbmRTZXJ2aWNlIHtcblxuc3RhdGljIGlzTG9nZ2VkSW4oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEhZ2V0U3RyaW5nKFwidG9rZW5cIik7XG4gIH1cblxuICBzdGF0aWMgZ2V0IHRva2VuKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGdldFN0cmluZyhcInRva2VuXCIpO1xuICB9XG5cbiAgc3RhdGljIHNldCB0b2tlbih0aGVUb2tlbjogc3RyaW5nKSB7XG4gICAgc2V0U3RyaW5nKFwidG9rZW5cIiwgdGhlVG9rZW4pO1xuICB9XG59XG4iXX0=