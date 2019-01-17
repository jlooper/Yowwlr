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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhdC50YWIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2hhdC50YWIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQXlFO0FBRXpFLHdDQUE4RDtBQVU5RDtJQVVJLDBCQUNZLGVBQWdDO1FBQWhDLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtJQUN4QyxDQUFDO0lBSUUsbUNBQVEsR0FBZjtRQUNJLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUVqQyxJQUFJLENBQUMsRUFBRSxHQUFHLHlCQUFjLENBQUMsS0FBSyxDQUFDO1FBQy9CLElBQUksQ0FBQyxNQUFNLEdBQVEsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUN2RCxDQUFDO0lBRU0sMENBQWUsR0FBdEI7UUFDSSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUM7SUFDM0MsQ0FBQztJQUVELGlDQUFNLEdBQU4sVUFBTyxLQUFZO1FBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLEtBQUssQ0FBQyxDQUFBO1FBQ25DLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssR0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCwrQkFBSSxHQUFKLFVBQUssT0FBZTtRQUFwQixpQkFNQztRQUxHLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLElBQVM7WUFDOUMsSUFBSSxLQUFLLEdBQUcsS0FBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO1lBQ25DLEtBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdkIsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUVELGlDQUFNLEdBQU4sVUFBTyxNQUFNO1FBQ1QsSUFBSSxNQUFNLElBQUkseUJBQWMsQ0FBQyxLQUFLLEVBQUU7WUFDaEMsT0FBTyxJQUFJLENBQUE7U0FDZDthQUNJO1lBQ0QsT0FBTyxNQUFNLENBQUE7U0FDaEI7SUFDTCxDQUFDO0lBRUQsZ0NBQUssR0FBTCxVQUFNLE1BQU07UUFDUixJQUFJLE1BQU0sSUFBSSx5QkFBYyxDQUFDLEtBQUssRUFBRTtZQUNoQyxPQUFPLE9BQU8sQ0FBQTtTQUNqQjthQUNJO1lBQ0QsT0FBTyxNQUFNLENBQUE7U0FDaEI7SUFDTCxDQUFDO0lBQ0Qsb0NBQVMsR0FBVCxVQUFVLE1BQU07UUFDWixJQUFJLE1BQU0sSUFBSSx5QkFBYyxDQUFDLEtBQUssRUFBRTtZQUNoQyxPQUFPLFdBQVcsQ0FBQTtTQUNyQjthQUNJO1lBQ0QsT0FBTyxTQUFTLENBQUE7U0FDbkI7SUFDTCxDQUFDO0lBOURrQjtRQUFsQixnQkFBUyxDQUFDLE1BQU0sQ0FBQztrQ0FBSyxpQkFBVTtnREFBQztJQUNWO1FBQXZCLGdCQUFTLENBQUMsV0FBVyxDQUFDO2tDQUFLLGlCQUFVO2dEQUFDO0lBTDlCLGdCQUFnQjtRQU41QixnQkFBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFFBQVEsRUFBRSxVQUFVO1lBQ3BCLFdBQVcsRUFBRSx5QkFBeUI7WUFDdEMsU0FBUyxFQUFFLENBQUMsd0JBQXdCLENBQUM7U0FDeEMsQ0FBQzt5Q0FZK0IsMEJBQWU7T0FYbkMsZ0JBQWdCLENBb0U1QjtJQUFELHVCQUFDO0NBQUEsQUFwRUQsSUFvRUM7QUFwRVksNENBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIFZpZXdDaGlsZCwgRWxlbWVudFJlZiB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBCYWNrZW5kU2VydmljZSwgRmlyZWJhc2VTZXJ2aWNlIH0gZnJvbSBcIi4uL3NlcnZpY2VzXCI7XG5pbXBvcnQgeyBMaXN0VmlldyB9IGZyb20gJ3Rucy1jb3JlLW1vZHVsZXMvdWkvbGlzdC12aWV3JztcbmltcG9ydCB7IFRleHRGaWVsZCB9IGZyb20gJ3Rucy1jb3JlLW1vZHVsZXMvdWkvdGV4dC1maWVsZCc7XG5cbkBDb21wb25lbnQoe1xuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gICAgc2VsZWN0b3I6IFwiY2hhdC10YWJcIixcbiAgICB0ZW1wbGF0ZVVybDogXCJjaGF0LnRhYi5jb21wb25lbnQuaHRtbFwiLFxuICAgIHN0eWxlVXJsczogW1wiY2hhdC50YWIuY29tcG9uZW50LmNzc1wiXVxufSlcbmV4cG9ydCBjbGFzcyBDaGF0VGFiQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICAgIHB1YmxpYyBtZTogU3RyaW5nO1xuICAgIFxuICAgIEBWaWV3Q2hpbGQoXCJsaXN0XCIpIGx2OiBFbGVtZW50UmVmO1xuICAgIEBWaWV3Q2hpbGQoXCJ0ZXh0ZmllbGRcIikgdGY6IEVsZW1lbnRSZWY7XG5cbiAgICBsaXN0OiBMaXN0VmlldztcbiAgICB0ZXh0ZmllbGQ6IFRleHRGaWVsZDtcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSBmaXJlYmFzZVNlcnZpY2U6IEZpcmViYXNlU2VydmljZVxuICAgICkgeyB9XG5cbiAgICBwdWJsaWMgY2hhdHMkOiBPYnNlcnZhYmxlPGFueT47XG4gICAgXG4gICAgcHVibGljIG5nT25Jbml0KCkge1xuICAgICAgICBjb25zb2xlLmxvZyhgQ2hhdCBZVGFiIG9uSW5pdCBgKTtcbiBcbiAgICAgICAgdGhpcy5tZSA9IEJhY2tlbmRTZXJ2aWNlLnRva2VuO1xuICAgICAgICB0aGlzLmNoYXRzJCA9IDxhbnk+dGhpcy5maXJlYmFzZVNlcnZpY2UuZ2V0Q2hhdHMoKTsgICAgICAgXG4gICAgfVxuXG4gICAgcHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgdGhpcy5saXN0ID0gdGhpcy5sdi5uYXRpdmVFbGVtZW50O1xuICAgICAgICB0aGlzLnRleHRmaWVsZCA9IHRoaXMudGYubmF0aXZlRWxlbWVudDtcbiAgICB9XG5cbiAgICBzY3JvbGwoY291bnQ6bnVtYmVyKXtcbiAgICAgICBjb25zb2xlLmxvZyhcInNjcm9sbGluZyB0byBcIiwgY291bnQpXG4gICAgICAgdGhpcy5saXN0LnNjcm9sbFRvSW5kZXgoY291bnQtMSk7XG4gICAgICAgdGhpcy5saXN0LnJlZnJlc2goKTtcbiAgICB9XG5cbiAgICBjaGF0KG1lc3NhZ2U6IHN0cmluZykge1xuICAgICAgICB0aGlzLmZpcmViYXNlU2VydmljZS5jaGF0KG1lc3NhZ2UpLnRoZW4oKGRhdGE6IGFueSkgPT4ge1xuICAgICAgICAgICAgbGV0IGNvdW50ID0gdGhpcy5saXN0Lml0ZW1zLmxlbmd0aDtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsKGNvdW50KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMudGV4dGZpZWxkLnRleHQgPSAnJzsgICAgICAgIFxuICAgIH1cblxuICAgIGZpbHRlcihzZW5kZXIpIHtcbiAgICAgICAgaWYgKHNlbmRlciA9PSBCYWNrZW5kU2VydmljZS50b2tlbikge1xuICAgICAgICAgICAgcmV0dXJuIFwibWVcIlxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFwidGhlbVwiXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhbGlnbihzZW5kZXIpIHtcbiAgICAgICAgaWYgKHNlbmRlciA9PSBCYWNrZW5kU2VydmljZS50b2tlbikge1xuICAgICAgICAgICAgcmV0dXJuIFwicmlnaHRcIlxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFwibGVmdFwiXG4gICAgICAgIH1cbiAgICB9XG4gICAgc2hvd0ltYWdlKHNlbmRlcikge1xuICAgICAgICBpZiAoc2VuZGVyID09IEJhY2tlbmRTZXJ2aWNlLnRva2VuKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJjb2xsYXBzZWRcIlxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFwidmlzaWJsZVwiXG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxuXG5cbiJdfQ==