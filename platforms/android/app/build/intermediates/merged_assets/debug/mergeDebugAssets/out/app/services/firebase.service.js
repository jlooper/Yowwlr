"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var backend_service_1 = require("./backend.service");
var firebase = require("nativescript-plugin-firebase");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var FirebaseService = /** @class */ (function () {
    function FirebaseService(ngZone) {
        this.ngZone = ngZone;
        this.yowls = new rxjs_1.BehaviorSubject([]);
        this._allYowls = [];
        this.chats = new rxjs_1.BehaviorSubject([]);
        this._allChats = [];
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
            passwordOptions: {
                email: user.email,
                password: user.password
            }
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
    FirebaseService.prototype.getYowls = function () {
        var _this = this;
        return new rxjs_1.Observable(function (observer) {
            var path = 'Yowls';
            var onValueEvent = function (snapshot) {
                _this.ngZone.run(function () {
                    var results = _this.handleSnapshot(snapshot.value);
                    observer.next(results);
                });
            };
            firebase.addValueEventListener(onValueEvent, "/" + path);
        }).pipe(operators_1.share());
    };
    FirebaseService.prototype.handleSnapshot = function (data) {
        //empty array, then refill and filter
        this._allYowls = [];
        if (data) {
            for (var id in data) {
                var result = Object.assign({ id: id }, data[id]);
                this._allYowls.push(result);
            }
            this.publishUpdates();
        }
        return this._allYowls;
    };
    FirebaseService.prototype.getChats = function () {
        var _this = this;
        return new rxjs_1.Observable(function (observer) {
            var path = 'Chats';
            var onValueEvent = function (snapshot) {
                _this.ngZone.run(function () {
                    var results = _this.handleChatSnapshot(snapshot.value);
                    observer.next(results);
                });
            };
            firebase.addValueEventListener(onValueEvent, "/" + path);
        }).pipe(operators_1.share());
    };
    FirebaseService.prototype.handleChatSnapshot = function (data) {
        //empty array, then refill and filter
        this._allChats = [];
        if (data) {
            for (var id in data) {
                var result = Object.assign({ id: id }, data[id]);
                this._allChats.push(result);
            }
            this.publishChatUpdates();
        }
        return this._allChats;
    };
    FirebaseService.prototype.sendYowl = function (Yowl) {
        var yowl = Yowl;
        return firebase.push("/Yowls", { "name": "Mr. Growlllr", "username": "MrGrwwlr", "text": "Yooowwwwlll!", "UID": backend_service_1.BackendService.token, "date": 0 - Date.now() }).then(function (result) {
            return 'Yowwled!';
        }, function (errorMessage) {
            console.log(errorMessage);
        });
    };
    FirebaseService.prototype.chat = function (message) {
        //let chat = Chat; 
        console.log("BackendService.token " + backend_service_1.BackendService.token);
        console.log("chat from firebase Service");
        console.log(message);
        return firebase.push("/Chats", { "message": message, "to": "MrGrwwlr", "from": backend_service_1.BackendService.token, "date": 0 - Date.now() }).then(function (result) {
            return "chatted";
        }, function (errorMessage) {
            console.log(errorMessage);
        });
    };
    FirebaseService.prototype.publishUpdates = function () {
        this._allYowls.sort(function (a, b) {
            if (a.date < b.date)
                return -1;
            if (a.date > b.date)
                return 1;
            return 0;
        });
        this.yowls.next(this._allYowls.slice());
    };
    FirebaseService.prototype.publishChatUpdates = function () {
        this._allChats.sort(function (a, b) {
            if (a.date > b.date)
                return -1;
            if (a.date < b.date)
                return 1;
            return 0;
        });
        this.chats.next(this._allChats.slice());
    };
    FirebaseService.prototype.handleErrors = function (error) {
        console.log(JSON.stringify(error));
        return Promise.reject(error.message);
    };
    FirebaseService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [core_1.NgZone])
    ], FirebaseService);
    return FirebaseService;
}());
exports.FirebaseService = FirebaseService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlyZWJhc2Uuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZpcmViYXNlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBbUQ7QUFFbkQscURBQW1EO0FBQ25ELHVEQUEwRDtBQUMxRCw2QkFBbUQ7QUFDbkQsNENBQXVDO0FBR3ZDO0lBQ0UseUJBQ1UsTUFBYztRQUFkLFdBQU0sR0FBTixNQUFNLENBQVE7UUFJMUIsVUFBSyxHQUFpQyxJQUFJLHNCQUFlLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDdEQsY0FBUyxHQUFnQixFQUFFLENBQUM7UUFDcEMsVUFBSyxHQUFpQyxJQUFJLHNCQUFlLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDdEQsY0FBUyxHQUFnQixFQUFFLENBQUM7SUFOaEMsQ0FBQztJQVFILG9DQUFVLEdBQVY7UUFDRSxRQUFRLENBQUMsNEJBQTRCLENBQUMsVUFBVSxJQUFJO1lBQ2hELEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDaEMsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDO0lBRUQsa0NBQVEsR0FBUixVQUFTLElBQVU7UUFDakIsT0FBTyxRQUFRLENBQUMsVUFBVSxDQUFDO1lBQ3pCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztZQUNqQixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7U0FDeEIsQ0FBQyxDQUFDLElBQUksQ0FDRCxVQUFVLE1BQVU7WUFDbEIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2hDLENBQUMsRUFDRCxVQUFVLFlBQWdCO1lBQ3hCLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUN0QixDQUFDLENBQ0osQ0FBQTtJQUNMLENBQUM7SUFFRCwrQkFBSyxHQUFMLFVBQU0sSUFBVTtRQUNkLE9BQU8sUUFBUSxDQUFDLEtBQUssQ0FBQztZQUNwQixJQUFJLEVBQUUsUUFBUSxDQUFD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QUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJO2dCQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDOUIsSUFBRyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJO2dCQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQy9CLE9BQU8sQ0FBQyxDQUFDO1FBQ1gsQ0FBQyxDQUFDLENBQUE7UUFDRixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBSyxJQUFJLENBQUMsU0FBUyxTQUFFLENBQUM7SUFDdkMsQ0FBQztJQUVELHNDQUFZLEdBQVosVUFBYSxLQUFLO1FBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ25DLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQXpLVSxlQUFlO1FBRDNCLGlCQUFVLEVBQUU7eUNBR08sYUFBTTtPQUZiLGVBQWUsQ0EwSzNCO0lBQUQsc0JBQUM7Q0FBQSxBQTFLRCxJQTBLQztBQTFLWSwwQ0FBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIE5nWm9uZSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBVc2VyLCBZb3dsIH0gZnJvbSBcIi4uL21vZGVsc1wiO1xuaW1wb3J0IHsgQmFja2VuZFNlcnZpY2UgfSBmcm9tIFwiLi9iYWNrZW5kLnNlcnZpY2VcIjtcbmltcG9ydCBmaXJlYmFzZSA9IHJlcXVpcmUoXCJuYXRpdmVzY3JpcHQtcGx1Z2luLWZpcmViYXNlXCIpO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBzaGFyZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEZpcmViYXNlU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgbmdab25lOiBOZ1pvbmUsXG4gICl7fVxuXG5cbnlvd2xzOiBCZWhhdmlvclN1YmplY3Q8QXJyYXk8WW93bD4+ID0gbmV3IEJlaGF2aW9yU3ViamVjdChbXSk7XG5wcml2YXRlIF9hbGxZb3dsczogQXJyYXk8WW93bD4gPSBbXTtcbmNoYXRzOiBCZWhhdmlvclN1YmplY3Q8QXJyYXk8WW93bD4+ID0gbmV3IEJlaGF2aW9yU3ViamVjdChbXSk7XG5wcml2YXRlIF9hbGxDaGF0czogQXJyYXk8WW93bD4gPSBbXTtcblxuICBnZXRNZXNzYWdlKCl7IFxuICAgIGZpcmViYXNlLmFkZE9uTWVzc2FnZVJlY2VpdmVkQ2FsbGJhY2soZnVuY3Rpb24gKGRhdGEgKXtcbiAgICAgICAgYWxlcnQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgIH0pXG4gIH1cblxuICByZWdpc3Rlcih1c2VyOiBVc2VyKSB7XG4gICAgcmV0dXJuIGZpcmViYXNlLmNyZWF0ZVVzZXIoe1xuICAgICAgZW1haWw6IHVzZXIuZW1haWwsXG4gICAgICBwYXNzd29yZDogdXNlci5wYXNzd29yZFxuICAgIH0pLnRoZW4oXG4gICAgICAgICAgZnVuY3Rpb24gKHJlc3VsdDphbnkpIHtcbiAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShyZXN1bHQpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZnVuY3Rpb24gKGVycm9yTWVzc2FnZTphbnkpIHtcbiAgICAgICAgICAgIGFsZXJ0KGVycm9yTWVzc2FnZSk7XG4gICAgICAgICAgfVxuICAgICAgKVxuICB9XG5cbiAgbG9naW4odXNlcjogVXNlcikge1xuICAgIHJldHVybiBmaXJlYmFzZS5sb2dpbih7XG4gICAgICB0eXBlOiBmaXJlYmFzZS5Mb2dpblR5cGUuUEFTU1dPUkQsXG4gICAgICBwYXNzd29yZE9wdGlvbnM6IHtcbiAgICAgICAgZW1haWw6IHVzZXIuZW1haWwsXG4gICAgICAgIHBhc3N3b3JkOiB1c2VyLnBhc3N3b3JkXG4gICAgICB9XG4gICAgfSkudGhlbigocmVzdWx0OiBhbnkpID0+IHtcbiAgICAgICAgICBCYWNrZW5kU2VydmljZS50b2tlbiA9IHJlc3VsdC51aWQ7XG4gICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHJlc3VsdCk7XG4gICAgICB9LCAoZXJyb3JNZXNzYWdlOiBhbnkpID0+IHtcbiAgICAgICAgYWxlcnQoZXJyb3JNZXNzYWdlKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgbG9nb3V0KCl7XG4gICAgQmFja2VuZFNlcnZpY2UudG9rZW4gPSBcIlwiO1xuICAgIGZpcmViYXNlLmxvZ291dCgpOyAgICBcbiAgfVxuICBcbiAgcmVzZXRQYXNzd29yZChlbWFpbCkge1xuICAgIHJldHVybiBmaXJlYmFzZS5yZXNldFBhc3N3b3JkKHtcbiAgICBlbWFpbDogZW1haWxcbiAgICB9KS50aGVuKChyZXN1bHQ6IGFueSkgPT4ge1xuICAgICAgICAgIGFsZXJ0KEpTT04uc3RyaW5naWZ5KHJlc3VsdCkpO1xuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbiAoZXJyb3JNZXNzYWdlOmFueSkge1xuICAgICAgICAgIGFsZXJ0KGVycm9yTWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICApLmNhdGNoKHRoaXMuaGFuZGxlRXJyb3JzKTtcbiAgfSAgXG5cbiBnZXRZb3dscygpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZSgob2JzZXJ2ZXI6IGFueSkgPT4ge1xuICAgICAgbGV0IHBhdGggPSAnWW93bHMnO1xuICAgICAgXG4gICAgICAgIGxldCBvblZhbHVlRXZlbnQgPSAoc25hcHNob3Q6IGFueSkgPT4ge1xuICAgICAgICAgIHRoaXMubmdab25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICBsZXQgcmVzdWx0cyA9IHRoaXMuaGFuZGxlU25hcHNob3Qoc25hcHNob3QudmFsdWUpO1xuICAgICAgICAgICAgIG9ic2VydmVyLm5leHQocmVzdWx0cyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIGZpcmViYXNlLmFkZFZhbHVlRXZlbnRMaXN0ZW5lcihvblZhbHVlRXZlbnQsIGAvJHtwYXRofWApO1xuICAgIH0pLnBpcGUoc2hhcmUoKSk7ICAgICAgICAgICAgICBcbiAgfVxuXG4gIGhhbmRsZVNuYXBzaG90KGRhdGE6IGFueSkge1xuICAgIC8vZW1wdHkgYXJyYXksIHRoZW4gcmVmaWxsIGFuZCBmaWx0ZXJcbiAgICB0aGlzLl9hbGxZb3dscyA9IFtdO1xuICAgIGlmIChkYXRhKSB7XG4gICAgICBmb3IgKGxldCBpZCBpbiBkYXRhKSB7ICAgICAgICBcbiAgICAgICAgbGV0IHJlc3VsdCA9ICg8YW55Pk9iamVjdCkuYXNzaWduKHtpZDogaWR9LCBkYXRhW2lkXSk7XG4gICAgICAgICAgdGhpcy5fYWxsWW93bHMucHVzaChyZXN1bHQpO1xuICAgICAgfVxuICAgICAgdGhpcy5wdWJsaXNoVXBkYXRlcygpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fYWxsWW93bHM7XG4gIH1cblxuICBnZXRDaGF0cygpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZSgob2JzZXJ2ZXI6IGFueSkgPT4ge1xuICAgICAgbGV0IHBhdGggPSAnQ2hhdHMnO1xuICAgICAgXG4gICAgICAgIGxldCBvblZhbHVlRXZlbnQgPSAoc25hcHNob3Q6IGFueSkgPT4ge1xuICAgICAgICAgIHRoaXMubmdab25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICBsZXQgcmVzdWx0cyA9IHRoaXMuaGFuZGxlQ2hhdFNuYXBzaG90KHNuYXBzaG90LnZhbHVlKTtcbiAgICAgICAgICAgICBvYnNlcnZlci5uZXh0KHJlc3VsdHMpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICBmaXJlYmFzZS5hZGRWYWx1ZUV2ZW50TGlzdGVuZXIob25WYWx1ZUV2ZW50LCBgLyR7cGF0aH1gKTtcbiAgICB9KS5waXBlKHNoYXJlKCkpOyAgICAgICAgICAgICAgIFxuICB9XG5cbiAgaGFuZGxlQ2hhdFNuYXBzaG90KGRhdGE6IGFueSkge1xuICAgIC8vZW1wdHkgYXJyYXksIHRoZW4gcmVmaWxsIGFuZCBmaWx0ZXJcbiAgICB0aGlzLl9hbGxDaGF0cyA9IFtdO1xuICAgIGlmIChkYXRhKSB7XG4gICAgICBmb3IgKGxldCBpZCBpbiBkYXRhKSB7ICAgICAgICBcbiAgICAgICAgbGV0IHJlc3VsdCA9ICg8YW55Pk9iamVjdCkuYXNzaWduKHtpZDogaWR9LCBkYXRhW2lkXSk7XG4gICAgICAgICAgdGhpcy5fYWxsQ2hhdHMucHVzaChyZXN1bHQpO1xuICAgICAgfVxuICAgICAgdGhpcy5wdWJsaXNoQ2hhdFVwZGF0ZXMoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2FsbENoYXRzO1xuICB9XG5cbiAgc2VuZFlvd2woWW93bDphbnkpIHtcbiAgICBsZXQgeW93bCA9IFlvd2w7ICAgXG4gICAgcmV0dXJuIGZpcmViYXNlLnB1c2goXG4gICAgICAgIFwiL1lvd2xzXCIsXG4gICAgICAgIHsgXCJuYW1lXCI6IFwiTXIuIEdyb3dsbGxyXCIsIFwidXNlcm5hbWVcIjogXCJNckdyd3dsclwiLCBcInRleHRcIjogXCJZb29vd3d3d2xsbCFcIiwgXCJVSURcIjogQmFja2VuZFNlcnZpY2UudG9rZW4sIFwiZGF0ZVwiOiAwIC0gRGF0ZS5ub3coKX1cbiAgICAgICkudGhlbihcbiAgICAgICAgZnVuY3Rpb24gKHJlc3VsdDphbnkpIHtcbiAgICAgICAgICByZXR1cm4gJ1lvd3dsZWQhJztcbiAgICAgICAgfSxcbiAgICAgICAgZnVuY3Rpb24gKGVycm9yTWVzc2FnZTphbnkpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvck1lc3NhZ2UpO1xuICAgICAgICB9KTsgXG4gIH1cblxuICBjaGF0KG1lc3NhZ2U6c3RyaW5nKSB7XG4gICAgLy9sZXQgY2hhdCA9IENoYXQ7IFxuICAgIGNvbnNvbGUubG9nKGBCYWNrZW5kU2VydmljZS50b2tlbiAke0JhY2tlbmRTZXJ2aWNlLnRva2VufWApO1xuICAgIGNvbnNvbGUubG9nKFwiY2hhdCBmcm9tIGZpcmViYXNlIFNlcnZpY2VcIik7XG4gICAgY29uc29sZS5sb2cobWVzc2FnZSkgIFxuICAgIHJldHVybiBmaXJlYmFzZS5wdXNoKFxuICAgICAgICBcIi9DaGF0c1wiLFxuICAgICAgICB7IFwibWVzc2FnZVwiOiBtZXNzYWdlLCBcInRvXCI6IFwiTXJHcnd3bHJcIiwgXCJmcm9tXCI6IEJhY2tlbmRTZXJ2aWNlLnRva2VuLCBcImRhdGVcIjogMCAtIERhdGUubm93KCl9XG4gICAgICApLnRoZW4oXG4gICAgICAgIGZ1bmN0aW9uIChyZXN1bHQ6YW55KSB7XG4gICAgICAgICAgcmV0dXJuIFwiY2hhdHRlZFwiO1xuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbiAoZXJyb3JNZXNzYWdlOmFueSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yTWVzc2FnZSk7XG4gICAgICAgIH0pOyBcbiAgfVxuXG4gICBwdWJsaXNoVXBkYXRlcygpIHtcbiAgICB0aGlzLl9hbGxZb3dscy5zb3J0KGZ1bmN0aW9uKGEsIGIpe1xuICAgICAgICBpZihhLmRhdGUgPCBiLmRhdGUpIHJldHVybiAtMTtcbiAgICAgICAgaWYoYS5kYXRlID4gYi5kYXRlKSByZXR1cm4gMTtcbiAgICAgIHJldHVybiAwO1xuICAgIH0pXG4gICAgdGhpcy55b3dscy5uZXh0KFsuLi50aGlzLl9hbGxZb3dsc10pO1xuICB9XG5cbiAgcHVibGlzaENoYXRVcGRhdGVzKCkge1xuICAgIHRoaXMuX2FsbENoYXRzLnNvcnQoZnVuY3Rpb24oYSwgYil7XG4gICAgICAgIGlmKGEuZGF0ZSA+IGIuZGF0ZSkgcmV0dXJuIC0xO1xuICAgICAgICBpZihhLmRhdGUgPCBiLmRhdGUpIHJldHVybiAxO1xuICAgICAgcmV0dXJuIDA7XG4gICAgfSlcbiAgICB0aGlzLmNoYXRzLm5leHQoWy4uLnRoaXMuX2FsbENoYXRzXSk7XG4gIH1cblxuICBoYW5kbGVFcnJvcnMoZXJyb3IpIHtcbiAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShlcnJvcikpO1xuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvci5tZXNzYWdlKTtcbiAgfVxufSJdfQ==