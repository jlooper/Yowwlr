"use strict";
var core_1 = require("@angular/core");
var backend_service_1 = require("./backend.service");
var firebase = require("nativescript-plugin-firebase");
require('rxjs/add/operator/share');
var FirebaseService = (function () {
    function FirebaseService(ngZone) {
        this.ngZone = ngZone;
    }
    FirebaseService.prototype.getMessage = function () {
        firebase.addOnMessageReceivedCallback(function (data) {
            alert(JSON.stringify(data));
        });
    };
    FirebaseService.prototype.register = function (user) {
        return firebase.createUser({
            email: user.email,
            password: user.password
        }).then(function (result) {
            return JSON.stringify(result);
        }, function (errorMessage) {
            alert(errorMessage);
        });
    };
    FirebaseService.prototype.login = function (user) {
        return firebase.login({
            type: firebase.LoginType.PASSWORD,
            email: user.email,
            password: user.password
        }).then(function (result) {
            backend_service_1.BackendService.token = result.uid;
            return JSON.stringify(result);
        }, function (errorMessage) {
            alert(errorMessage);
        });
    };
    FirebaseService.prototype.logout = function () {
        backend_service_1.BackendService.token = "";
        firebase.logout();
    };
    FirebaseService.prototype.resetPassword = function (email) {
        return firebase.resetPassword({
            email: email
        }).then(function (result) {
            alert(JSON.stringify(result));
        }, function (errorMessage) {
            alert(errorMessage);
        }).catch(this.handleErrors);
    };
    FirebaseService.prototype.handleErrors = function (error) {
        console.log(JSON.stringify(error));
        return Promise.reject(error.message);
    };
    FirebaseService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [core_1.NgZone])
    ], FirebaseService);
    return FirebaseService;
}());
exports.FirebaseService = FirebaseService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlyZWJhc2Uuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZpcmViYXNlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHFCQUFpQyxlQUFlLENBQUMsQ0FBQTtBQUVqRCxnQ0FBK0IsbUJBQW1CLENBQUMsQ0FBQTtBQUNuRCxJQUFPLFFBQVEsV0FBVyw4QkFBOEIsQ0FBQyxDQUFDO0FBRzFELFFBQU8seUJBQXlCLENBQUMsQ0FBQTtBQUdqQztJQUNFLHlCQUNVLE1BQWM7UUFBZCxXQUFNLEdBQU4sTUFBTSxDQUFRO0lBQ3RCLENBQUM7SUFFSCxvQ0FBVSxHQUFWO1FBQ0UsUUFBUSxDQUFDLDRCQUE0QixDQUFDLFVBQVUsSUFBSTtZQUNoRCxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUVELGtDQUFRLEdBQVIsVUFBUyxJQUFVO1FBQ2pCLE1BQU0sQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDO1lBQ3pCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztZQUNqQixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7U0FDeEIsQ0FBQyxDQUFDLElBQUksQ0FDRCxVQUFVLE1BQVU7WUFDbEIsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDaEMsQ0FBQyxFQUNELFVBQVUsWUFBZ0I7WUFDeEIsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3RCLENBQUMsQ0FDSixDQUFBO0lBQ0wsQ0FBQztJQUVELCtCQUFLLEdBQUwsVUFBTSxJQUFVO1FBQ2QsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7WUFDcEIsSUFBSSxFQUFFLFFBQVEsQ0FBQyxTQUFTLENBQUMsUUFBUTtZQUNqQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7WUFDakIsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO1NBQ3hCLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxNQUFXO1lBQ2QsZ0NBQWMsQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQztZQUNsQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNsQyxDQUFDLEVBQUUsVUFBQyxZQUFpQjtZQUNuQixLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDdEIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsZ0NBQU0sR0FBTjtRQUNFLGdDQUFjLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUMxQixRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQUVELHVDQUFhLEdBQWIsVUFBYyxLQUFLO1FBQ2pCLE1BQU0sQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDO1lBQzlCLEtBQUssRUFBRSxLQUFLO1NBQ1gsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLE1BQVc7WUFDZCxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLENBQUMsRUFDRCxVQUFVLFlBQWdCO1lBQ3hCLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUN0QixDQUFDLENBQ0osQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFJRCxzQ0FBWSxHQUFaLFVBQWEsS0FBSztRQUNoQixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNuQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQTdESDtRQUFDLGlCQUFVLEVBQUU7O3VCQUFBO0lBOERiLHNCQUFDO0FBQUQsQ0FBQyxBQTdERCxJQTZEQztBQTdEWSx1QkFBZSxrQkE2RDNCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGUsIE5nWm9uZX0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7VXNlcn0gZnJvbSBcIi4uL21vZGVsc1wiO1xuaW1wb3J0IHsgQmFja2VuZFNlcnZpY2UgfSBmcm9tIFwiLi9iYWNrZW5kLnNlcnZpY2VcIjtcbmltcG9ydCBmaXJlYmFzZSA9IHJlcXVpcmUoXCJuYXRpdmVzY3JpcHQtcGx1Z2luLWZpcmViYXNlXCIpO1xuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdyeGpzL09ic2VydmFibGUnO1xuaW1wb3J0IHtCZWhhdmlvclN1YmplY3R9IGZyb20gJ3J4anMvQmVoYXZpb3JTdWJqZWN0JztcbmltcG9ydCAncnhqcy9hZGQvb3BlcmF0b3Ivc2hhcmUnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRmlyZWJhc2VTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBuZ1pvbmU6IE5nWm9uZSxcbiAgKXt9XG5cbiAgZ2V0TWVzc2FnZSgpeyBcbiAgICBmaXJlYmFzZS5hZGRPbk1lc3NhZ2VSZWNlaXZlZENhbGxiYWNrKGZ1bmN0aW9uIChkYXRhICl7XG4gICAgICAgIGFsZXJ0KEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICB9KVxuICB9XG4gICAgXG4gIHJlZ2lzdGVyKHVzZXI6IFVzZXIpIHtcbiAgICByZXR1cm4gZmlyZWJhc2UuY3JlYXRlVXNlcih7XG4gICAgICBlbWFpbDogdXNlci5lbWFpbCxcbiAgICAgIHBhc3N3b3JkOiB1c2VyLnBhc3N3b3JkXG4gICAgfSkudGhlbihcbiAgICAgICAgICBmdW5jdGlvbiAocmVzdWx0OmFueSkge1xuICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHJlc3VsdCk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBmdW5jdGlvbiAoZXJyb3JNZXNzYWdlOmFueSkge1xuICAgICAgICAgICAgYWxlcnQoZXJyb3JNZXNzYWdlKTtcbiAgICAgICAgICB9XG4gICAgICApXG4gIH1cblxuICBsb2dpbih1c2VyOiBVc2VyKSB7XG4gICAgcmV0dXJuIGZpcmViYXNlLmxvZ2luKHtcbiAgICAgIHR5cGU6IGZpcmViYXNlLkxvZ2luVHlwZS5QQVNTV09SRCxcbiAgICAgIGVtYWlsOiB1c2VyLmVtYWlsLFxuICAgICAgcGFzc3dvcmQ6IHVzZXIucGFzc3dvcmRcbiAgICB9KS50aGVuKChyZXN1bHQ6IGFueSkgPT4ge1xuICAgICAgICAgIEJhY2tlbmRTZXJ2aWNlLnRva2VuID0gcmVzdWx0LnVpZDtcbiAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkocmVzdWx0KTtcbiAgICAgIH0sIChlcnJvck1lc3NhZ2U6IGFueSkgPT4ge1xuICAgICAgICBhbGVydChlcnJvck1lc3NhZ2UpO1xuICAgICAgfSk7XG4gIH1cblxuICBsb2dvdXQoKXtcbiAgICBCYWNrZW5kU2VydmljZS50b2tlbiA9IFwiXCI7XG4gICAgZmlyZWJhc2UubG9nb3V0KCk7ICAgIFxuICB9XG4gIFxuICByZXNldFBhc3N3b3JkKGVtYWlsKSB7XG4gICAgcmV0dXJuIGZpcmViYXNlLnJlc2V0UGFzc3dvcmQoe1xuICAgIGVtYWlsOiBlbWFpbFxuICAgIH0pLnRoZW4oKHJlc3VsdDogYW55KSA9PiB7XG4gICAgICAgICAgYWxlcnQoSlNPTi5zdHJpbmdpZnkocmVzdWx0KSk7XG4gICAgICAgIH0sXG4gICAgICAgIGZ1bmN0aW9uIChlcnJvck1lc3NhZ2U6YW55KSB7XG4gICAgICAgICAgYWxlcnQoZXJyb3JNZXNzYWdlKTtcbiAgICAgICAgfVxuICAgICkuY2F0Y2godGhpcy5oYW5kbGVFcnJvcnMpO1xuICB9ICBcblxuIFxuXG4gIGhhbmRsZUVycm9ycyhlcnJvcikge1xuICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KGVycm9yKSk7XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yLm1lc3NhZ2UpO1xuICB9XG59Il19