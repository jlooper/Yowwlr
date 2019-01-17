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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlyZWJhc2Uuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZpcmViYXNlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBbUQ7QUFFbkQscURBQW1EO0FBQ25ELHVEQUEwRDtBQUMxRCw2QkFBbUQ7QUFDbkQsNENBQXVDO0FBR3ZDO0lBQ0UseUJBQ1UsTUFBYztRQUFkLFdBQU0sR0FBTixNQUFNLENBQVE7UUFJeEIsVUFBSyxHQUFpQyxJQUFJLHNCQUFlLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDdEQsY0FBUyxHQUFnQixFQUFFLENBQUM7UUFDcEMsVUFBSyxHQUFpQyxJQUFJLHNCQUFlLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDdEQsY0FBUyxHQUFnQixFQUFFLENBQUM7SUFOaEMsQ0FBQztJQVFMLG9DQUFVLEdBQVY7UUFDRSxRQUFRLENBQUMsNEJBQTRCLENBQUMsVUFBVSxJQUFJO1lBQ2xELEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDOUIsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDO0lBRUQsa0NBQVEsR0FBUixVQUFTLElBQVU7UUFDakIsT0FBTyxRQUFRLENBQUMsVUFBVSxDQUFDO1lBQ3pCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztZQUNqQixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7U0FDeEIsQ0FBQyxDQUFDLElBQUksQ0FDTCxVQUFVLE1BQVc7WUFDbkIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2hDLENBQUMsRUFDRCxVQUFVLFlBQWlCO1lBQ3pCLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUN0QixDQUFDLENBQ0YsQ0FBQTtJQUNILENBQUM7SUFFRCwrQkFBSyxHQUFMLFVBQU0sSUFBVTtRQUNkLE9BQU8sUUFBUSxDQUFDLEtBQUssQ0FBQztZQUNwQixJQUFJLEVBQUUsUUFBUSxDQUFD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O2dCQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzlCLE9BQU8sQ0FBQyxDQUFDO1FBQ1gsQ0FBQyxDQUFDLENBQUE7UUFDRixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBSyxJQUFJLENBQUMsU0FBUyxTQUFFLENBQUM7SUFDdkMsQ0FBQztJQUVELHNDQUFZLEdBQVosVUFBYSxLQUFLO1FBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ25DLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQXZLVSxlQUFlO1FBRDNCLGlCQUFVLEVBQUU7eUNBR08sYUFBTTtPQUZiLGVBQWUsQ0F3SzNCO0lBQUQsc0JBQUM7Q0FBQSxBQXhLRCxJQXdLQztBQXhLWSwwQ0FBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIE5nWm9uZSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBVc2VyLCBZb3dsIH0gZnJvbSBcIi4uL21vZGVsc1wiO1xuaW1wb3J0IHsgQmFja2VuZFNlcnZpY2UgfSBmcm9tIFwiLi9iYWNrZW5kLnNlcnZpY2VcIjtcbmltcG9ydCBmaXJlYmFzZSA9IHJlcXVpcmUoXCJuYXRpdmVzY3JpcHQtcGx1Z2luLWZpcmViYXNlXCIpO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBzaGFyZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEZpcmViYXNlU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgbmdab25lOiBOZ1pvbmUsXG4gICkgeyB9XG5cblxuICB5b3dsczogQmVoYXZpb3JTdWJqZWN0PEFycmF5PFlvd2w+PiA9IG5ldyBCZWhhdmlvclN1YmplY3QoW10pO1xuICBwcml2YXRlIF9hbGxZb3dsczogQXJyYXk8WW93bD4gPSBbXTtcbiAgY2hhdHM6IEJlaGF2aW9yU3ViamVjdDxBcnJheTxZb3dsPj4gPSBuZXcgQmVoYXZpb3JTdWJqZWN0KFtdKTtcbiAgcHJpdmF0ZSBfYWxsQ2hhdHM6IEFycmF5PFlvd2w+ID0gW107XG5cbiAgZ2V0TWVzc2FnZSgpIHtcbiAgICBmaXJlYmFzZS5hZGRPbk1lc3NhZ2VSZWNlaXZlZENhbGxiYWNrKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICBhbGVydChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgfSlcbiAgfVxuXG4gIHJlZ2lzdGVyKHVzZXI6IFVzZXIpIHtcbiAgICByZXR1cm4gZmlyZWJhc2UuY3JlYXRlVXNlcih7XG4gICAgICBlbWFpbDogdXNlci5lbWFpbCxcbiAgICAgIHBhc3N3b3JkOiB1c2VyLnBhc3N3b3JkXG4gICAgfSkudGhlbihcbiAgICAgIGZ1bmN0aW9uIChyZXN1bHQ6IGFueSkge1xuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkocmVzdWx0KTtcbiAgICAgIH0sXG4gICAgICBmdW5jdGlvbiAoZXJyb3JNZXNzYWdlOiBhbnkpIHtcbiAgICAgICAgYWxlcnQoZXJyb3JNZXNzYWdlKTtcbiAgICAgIH1cbiAgICApXG4gIH1cblxuICBsb2dpbih1c2VyOiBVc2VyKSB7XG4gICAgcmV0dXJuIGZpcmViYXNlLmxvZ2luKHtcbiAgICAgIHR5cGU6IGZpcmViYXNlLkxvZ2luVHlwZS5QQVNTV09SRCxcbiAgICAgIHBhc3N3b3JkT3B0aW9uczoge1xuICAgICAgICBlbWFpbDogdXNlci5lbWFpbCxcbiAgICAgICAgcGFzc3dvcmQ6IHVzZXIucGFzc3dvcmRcbiAgICAgIH1cbiAgICB9KS50aGVuKChyZXN1bHQ6IGFueSkgPT4ge1xuICAgICAgQmFja2VuZFNlcnZpY2UudG9rZW4gPSByZXN1bHQudWlkO1xuICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHJlc3VsdCk7XG4gICAgfSwgKGVycm9yTWVzc2FnZTogYW55KSA9PiB7XG4gICAgICBhbGVydChlcnJvck1lc3NhZ2UpO1xuICAgIH0pO1xuICB9XG5cbiAgbG9nb3V0KCkge1xuICAgIEJhY2tlbmRTZXJ2aWNlLnRva2VuID0gXCJcIjtcbiAgICBmaXJlYmFzZS5sb2dvdXQoKTtcbiAgfVxuXG4gIHJlc2V0UGFzc3dvcmQoZW1haWwpIHtcbiAgICByZXR1cm4gZmlyZWJhc2UucmVzZXRQYXNzd29yZCh7XG4gICAgICBlbWFpbDogZW1haWxcbiAgICB9KS50aGVuKChyZXN1bHQ6IGFueSkgPT4ge1xuICAgICAgYWxlcnQoSlNPTi5zdHJpbmdpZnkocmVzdWx0KSk7XG4gICAgfSxcbiAgICAgIGZ1bmN0aW9uIChlcnJvck1lc3NhZ2U6IGFueSkge1xuICAgICAgICBhbGVydChlcnJvck1lc3NhZ2UpO1xuICAgICAgfVxuICAgICkuY2F0Y2godGhpcy5oYW5kbGVFcnJvcnMpO1xuICB9XG5cbiAgZ2V0WW93bHMoKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUoKG9ic2VydmVyOiBhbnkpID0+IHtcbiAgICAgIGxldCBwYXRoID0gJ1lvd2xzJztcblxuICAgICAgbGV0IG9uVmFsdWVFdmVudCA9IChzbmFwc2hvdDogYW55KSA9PiB7XG4gICAgICAgIHRoaXMubmdab25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgbGV0IHJlc3VsdHMgPSB0aGlzLmhhbmRsZVNuYXBzaG90KHNuYXBzaG90LnZhbHVlKTtcbiAgICAgICAgICBvYnNlcnZlci5uZXh0KHJlc3VsdHMpO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICBmaXJlYmFzZS5hZGRWYWx1ZUV2ZW50TGlzdGVuZXIob25WYWx1ZUV2ZW50LCBgLyR7cGF0aH1gKTtcbiAgICB9KS5waXBlKHNoYXJlKCkpO1xuICB9XG5cbiAgaGFuZGxlU25hcHNob3QoZGF0YTogYW55KSB7XG4gICAgLy9lbXB0eSBhcnJheSwgdGhlbiByZWZpbGwgYW5kIGZpbHRlclxuICAgIHRoaXMuX2FsbFlvd2xzID0gW107XG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIGZvciAobGV0IGlkIGluIGRhdGEpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9ICg8YW55Pk9iamVjdCkuYXNzaWduKHsgaWQ6IGlkIH0sIGRhdGFbaWRdKTtcbiAgICAgICAgdGhpcy5fYWxsWW93bHMucHVzaChyZXN1bHQpO1xuICAgICAgfVxuICAgICAgdGhpcy5wdWJsaXNoVXBkYXRlcygpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fYWxsWW93bHM7XG4gIH1cblxuICBnZXRDaGF0cygpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZSgob2JzZXJ2ZXI6IGFueSkgPT4ge1xuICAgICAgbGV0IHBhdGggPSAnQ2hhdHMnO1xuXG4gICAgICBsZXQgb25WYWx1ZUV2ZW50ID0gKHNuYXBzaG90OiBhbnkpID0+IHtcbiAgICAgICAgdGhpcy5uZ1pvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICBsZXQgcmVzdWx0cyA9IHRoaXMuaGFuZGxlQ2hhdFNuYXBzaG90KHNuYXBzaG90LnZhbHVlKTtcbiAgICAgICAgICBvYnNlcnZlci5uZXh0KHJlc3VsdHMpO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICBmaXJlYmFzZS5hZGRWYWx1ZUV2ZW50TGlzdGVuZXIob25WYWx1ZUV2ZW50LCBgLyR7cGF0aH1gKTtcbiAgICB9KS5waXBlKHNoYXJlKCkpO1xuICB9XG5cbiAgaGFuZGxlQ2hhdFNuYXBzaG90KGRhdGE6IGFueSkge1xuICAgIC8vZW1wdHkgYXJyYXksIHRoZW4gcmVmaWxsIGFuZCBmaWx0ZXJcbiAgICB0aGlzLl9hbGxDaGF0cyA9IFtdO1xuICAgIGlmIChkYXRhKSB7XG4gICAgICBmb3IgKGxldCBpZCBpbiBkYXRhKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSAoPGFueT5PYmplY3QpLmFzc2lnbih7IGlkOiBpZCB9LCBkYXRhW2lkXSk7XG4gICAgICAgIHRoaXMuX2FsbENoYXRzLnB1c2gocmVzdWx0KTtcbiAgICAgIH1cbiAgICAgIHRoaXMucHVibGlzaENoYXRVcGRhdGVzKCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9hbGxDaGF0cztcbiAgfVxuXG4gIHNlbmRZb3dsKFlvd2w6IGFueSkge1xuICAgIGxldCB5b3dsID0gWW93bDtcbiAgICByZXR1cm4gZmlyZWJhc2UucHVzaChcbiAgICAgIFwiL1lvd2xzXCIsXG4gICAgICB7IFwibmFtZVwiOiBcIk1yLiBHcm93bGxsclwiLCBcInVzZXJuYW1lXCI6IFwiTXJHcnd3bHJcIiwgXCJ0ZXh0XCI6IFwiWW9vb3d3d3dsbGwhXCIsIFwiVUlEXCI6IEJhY2tlbmRTZXJ2aWNlLnRva2VuLCBcImRhdGVcIjogMCAtIERhdGUubm93KCkgfVxuICAgICkudGhlbihcbiAgICAgIGZ1bmN0aW9uIChyZXN1bHQ6IGFueSkge1xuICAgICAgICByZXR1cm4gJ1lvd3dsZWQhJztcbiAgICAgIH0sXG4gICAgICBmdW5jdGlvbiAoZXJyb3JNZXNzYWdlOiBhbnkpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3JNZXNzYWdlKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgY2hhdChtZXNzYWdlOiBzdHJpbmcpIHtcbiAgICAvL2xldCBjaGF0ID0gQ2hhdDsgXG4gICAgY29uc29sZS5sb2cobWVzc2FnZSlcbiAgICByZXR1cm4gZmlyZWJhc2UucHVzaChcbiAgICAgIFwiL0NoYXRzXCIsXG4gICAgICB7IFwibWVzc2FnZVwiOiBtZXNzYWdlLCBcInRvXCI6IFwiTXJHcnd3bHJcIiwgXCJmcm9tXCI6IEJhY2tlbmRTZXJ2aWNlLnRva2VuLCBcImRhdGVcIjogMCAtIERhdGUubm93KCkgfVxuICAgICkudGhlbihcbiAgICAgIGZ1bmN0aW9uIChyZXN1bHQ6IGFueSkge1xuICAgICAgICByZXR1cm4gXCJjaGF0dGVkXCI7XG4gICAgICB9LFxuICAgICAgZnVuY3Rpb24gKGVycm9yTWVzc2FnZTogYW55KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yTWVzc2FnZSk7XG4gICAgICB9KTtcbiAgfVxuXG4gIHB1Ymxpc2hVcGRhdGVzKCkge1xuICAgIHRoaXMuX2FsbFlvd2xzLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgIGlmIChhLmRhdGUgPCBiLmRhdGUpIHJldHVybiAtMTtcbiAgICAgIGlmIChhLmRhdGUgPiBiLmRhdGUpIHJldHVybiAxO1xuICAgICAgcmV0dXJuIDA7XG4gICAgfSlcbiAgICB0aGlzLnlvd2xzLm5leHQoWy4uLnRoaXMuX2FsbFlvd2xzXSk7XG4gIH1cblxuICBwdWJsaXNoQ2hhdFVwZGF0ZXMoKSB7XG4gICAgdGhpcy5fYWxsQ2hhdHMuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgaWYgKGEuZGF0ZSA+IGIuZGF0ZSkgcmV0dXJuIC0xO1xuICAgICAgaWYgKGEuZGF0ZSA8IGIuZGF0ZSkgcmV0dXJuIDE7XG4gICAgICByZXR1cm4gMDtcbiAgICB9KVxuICAgIHRoaXMuY2hhdHMubmV4dChbLi4udGhpcy5fYWxsQ2hhdHNdKTtcbiAgfVxuXG4gIGhhbmRsZUVycm9ycyhlcnJvcikge1xuICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KGVycm9yKSk7XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yLm1lc3NhZ2UpO1xuICB9XG59Il19