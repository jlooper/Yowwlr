"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var services_1 = require("../services");
var ChatTabComponent = /** @class */ (function () {
    function ChatTabComponent(firebaseService) {
        this.firebaseService = firebaseService;
    }
    ChatTabComponent.prototype.ngOnInit = function () {
        console.log("Chat YTab onInit ");
        this.me = services_1.BackendService.token;
        // this.chats$ = <any>this.firebaseService.getChats();       
        this.chats$ = this.firebaseService.getChats();
    };
    ChatTabComponent.prototype.ngAfterViewInit = function () {
        this.list = this.lv.nativeElement;
        this.textfield = this.tf.nativeElement;
    };
    ChatTabComponent.prototype.scroll = function (count) {
        console.log("scrolling to ", count);
        this.list.scrollToIndex(count - 1);
        this.list.refresh();
    };
    ChatTabComponent.prototype.chat = function (message) {
        var _this = this;
        this.firebaseService.chat(message).then(function (data) {
            var count = _this.list.items.length;
            _this.scroll(count);
        });
        this.textfield.text = '';
    };
    ChatTabComponent.prototype.filter = function (sender) {
        if (sender == services_1.BackendService.token) {
            return "me";
        }
        else {
            return "them";
        }
    };
    ChatTabComponent.prototype.align = function (sender) {
        if (sender == services_1.BackendService.token) {
            return "right";
        }
        else {
            return "left";
        }
    };
    ChatTabComponent.prototype.showImage = function (sender) {
        if (sender == services_1.BackendService.token) {
            return "collapsed";
        }
        else {
            return "visible";
        }
    };
    __decorate([
        core_1.ViewChild("list"),
        __metadata("design:type", core_1.ElementRef)
    ], ChatTabComponent.prototype, "lv", void 0);
    __decorate([
        core_1.ViewChild("textfield"),
        __metadata("design:type", core_1.ElementRef)
    ], ChatTabComponent.prototype, "tf", void 0);
    ChatTabComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: "chat-tab",
            templateUrl: "chat.tab.component.html",
            styleUrls: ["chat.tab.component.css"]
        }),
        __metadata("design:paramtypes", [services_1.FirebaseService])
    ], ChatTabComponent);
    return ChatTabComponent;
}());
exports.ChatTabComponent = ChatTabComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhdC50YWIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2hhdC50YWIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQXlFO0FBRXpFLHdDQUE4RDtBQVU5RDtJQVVJLDBCQUNZLGVBQWdDO1FBQWhDLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtJQUN4QyxDQUFDO0lBSUUsbUNBQVEsR0FBZjtRQUNJLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUVqQyxJQUFJLENBQUMsRUFBRSxHQUFHLHlCQUFjLENBQUMsS0FBSyxDQUFDO1FBQy9CLDZEQUE2RDtRQUM3RCxJQUFJLENBQUMsTUFBTSxHQUFRLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDdkQsQ0FBQztJQUVNLDBDQUFlLEdBQXRCO1FBQ0ksSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQztRQUNsQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDO0lBQzNDLENBQUM7SUFFRCxpQ0FBTSxHQUFOLFVBQU8sS0FBWTtRQUNoQixPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUNuQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEdBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUN2QixDQUFDO0lBRUQsK0JBQUksR0FBSixVQUFLLE9BQWU7UUFBcEIsaUJBTUM7UUFMRyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxJQUFTO1lBQzlDLElBQUksS0FBSyxHQUFHLEtBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztZQUNuQyxLQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFFRCxpQ0FBTSxHQUFOLFVBQU8sTUFBTTtRQUNULElBQUksTUFBTSxJQUFJLHlCQUFjLENBQUMsS0FBSyxFQUFFO1lBQ2hDLE9BQU8sSUFBSSxDQUFBO1NBQ2Q7YUFDSTtZQUNELE9BQU8sTUFBTSxDQUFBO1NBQ2hCO0lBQ0wsQ0FBQztJQUVELGdDQUFLLEdBQUwsVUFBTSxNQUFNO1FBQ1IsSUFBSSxNQUFNLElBQUkseUJBQWMsQ0FBQyxLQUFLLEVBQUU7WUFDaEMsT0FBTyxPQUFPLENBQUE7U0FDakI7YUFDSTtZQUNELE9BQU8sTUFBTSxDQUFBO1NBQ2hCO0lBQ0wsQ0FBQztJQUNELG9DQUFTLEdBQVQsVUFBVSxNQUFNO1FBQ1osSUFBSSxNQUFNLElBQUkseUJBQWMsQ0FBQyxLQUFLLEVBQUU7WUFDaEMsT0FBTyxXQUFXLENBQUE7U0FDckI7YUFDSTtZQUNELE9BQU8sU0FBUyxDQUFBO1NBQ25CO0lBQ0wsQ0FBQztJQS9Ea0I7UUFBbEIsZ0JBQVMsQ0FBQyxNQUFNLENBQUM7a0NBQUssaUJBQVU7Z0RBQUM7SUFDVjtRQUF2QixnQkFBUyxDQUFDLFdBQVcsQ0FBQztrQ0FBSyxpQkFBVTtnREFBQztJQUw5QixnQkFBZ0I7UUFONUIsZ0JBQVMsQ0FBQztZQUNQLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixRQUFRLEVBQUUsVUFBVTtZQUNwQixXQUFXLEVBQUUseUJBQXlCO1lBQ3RDLFNBQVMsRUFBRSxDQUFDLHdCQUF3QixDQUFDO1NBQ3hDLENBQUM7eUNBWStCLDBCQUFlO09BWG5DLGdCQUFnQixDQXFFNUI7SUFBRCx1QkFBQztDQUFBLEFBckVELElBcUVDO0FBckVZLDRDQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBWaWV3Q2hpbGQsIEVsZW1lbnRSZWYgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgQmFja2VuZFNlcnZpY2UsIEZpcmViYXNlU2VydmljZSB9IGZyb20gXCIuLi9zZXJ2aWNlc1wiO1xuaW1wb3J0IHsgTGlzdFZpZXcgfSBmcm9tICd0bnMtY29yZS1tb2R1bGVzL3VpL2xpc3Qtdmlldyc7XG5pbXBvcnQgeyBUZXh0RmllbGQgfSBmcm9tICd0bnMtY29yZS1tb2R1bGVzL3VpL3RleHQtZmllbGQnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICAgIHNlbGVjdG9yOiBcImNoYXQtdGFiXCIsXG4gICAgdGVtcGxhdGVVcmw6IFwiY2hhdC50YWIuY29tcG9uZW50Lmh0bWxcIixcbiAgICBzdHlsZVVybHM6IFtcImNoYXQudGFiLmNvbXBvbmVudC5jc3NcIl1cbn0pXG5leHBvcnQgY2xhc3MgQ2hhdFRhYkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgICBwdWJsaWMgbWU6IFN0cmluZztcbiAgICBcbiAgICBAVmlld0NoaWxkKFwibGlzdFwiKSBsdjogRWxlbWVudFJlZjtcbiAgICBAVmlld0NoaWxkKFwidGV4dGZpZWxkXCIpIHRmOiBFbGVtZW50UmVmO1xuXG4gICAgbGlzdDogTGlzdFZpZXc7XG4gICAgdGV4dGZpZWxkOiBUZXh0RmllbGQ7XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgZmlyZWJhc2VTZXJ2aWNlOiBGaXJlYmFzZVNlcnZpY2VcbiAgICApIHsgfVxuXG4gICAgcHVibGljIGNoYXRzJDogT2JzZXJ2YWJsZTxhbnk+O1xuICAgIFxuICAgIHB1YmxpYyBuZ09uSW5pdCgpIHtcbiAgICAgICAgY29uc29sZS5sb2coYENoYXQgWVRhYiBvbkluaXQgYCk7XG4gXG4gICAgICAgIHRoaXMubWUgPSBCYWNrZW5kU2VydmljZS50b2tlbjtcbiAgICAgICAgLy8gdGhpcy5jaGF0cyQgPSA8YW55PnRoaXMuZmlyZWJhc2VTZXJ2aWNlLmdldENoYXRzKCk7ICAgICAgIFxuICAgICAgICB0aGlzLmNoYXRzJCA9IDxhbnk+dGhpcy5maXJlYmFzZVNlcnZpY2UuZ2V0Q2hhdHMoKTsgICAgICAgXG4gICAgfVxuXG4gICAgcHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgdGhpcy5saXN0ID0gdGhpcy5sdi5uYXRpdmVFbGVtZW50O1xuICAgICAgICB0aGlzLnRleHRmaWVsZCA9IHRoaXMudGYubmF0aXZlRWxlbWVudDtcbiAgICB9XG5cbiAgICBzY3JvbGwoY291bnQ6bnVtYmVyKXtcbiAgICAgICBjb25zb2xlLmxvZyhcInNjcm9sbGluZyB0byBcIiwgY291bnQpXG4gICAgICAgdGhpcy5saXN0LnNjcm9sbFRvSW5kZXgoY291bnQtMSk7XG4gICAgICAgdGhpcy5saXN0LnJlZnJlc2goKTtcbiAgICB9XG5cbiAgICBjaGF0KG1lc3NhZ2U6IHN0cmluZykge1xuICAgICAgICB0aGlzLmZpcmViYXNlU2VydmljZS5jaGF0KG1lc3NhZ2UpLnRoZW4oKGRhdGE6IGFueSkgPT4ge1xuICAgICAgICAgICAgbGV0IGNvdW50ID0gdGhpcy5saXN0Lml0ZW1zLmxlbmd0aDtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsKGNvdW50KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMudGV4dGZpZWxkLnRleHQgPSAnJzsgICAgICAgIFxuICAgIH1cblxuICAgIGZpbHRlcihzZW5kZXIpIHtcbiAgICAgICAgaWYgKHNlbmRlciA9PSBCYWNrZW5kU2VydmljZS50b2tlbikge1xuICAgICAgICAgICAgcmV0dXJuIFwibWVcIlxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFwidGhlbVwiXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhbGlnbihzZW5kZXIpIHtcbiAgICAgICAgaWYgKHNlbmRlciA9PSBCYWNrZW5kU2VydmljZS50b2tlbikge1xuICAgICAgICAgICAgcmV0dXJuIFwicmlnaHRcIlxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFwibGVmdFwiXG4gICAgICAgIH1cbiAgICB9XG4gICAgc2hvd0ltYWdlKHNlbmRlcikge1xuICAgICAgICBpZiAoc2VuZGVyID09IEJhY2tlbmRTZXJ2aWNlLnRva2VuKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJjb2xsYXBzZWRcIlxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFwidmlzaWJsZVwiXG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxuXG5cbiJdfQ==