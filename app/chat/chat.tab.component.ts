import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Observable } from 'rxjs/Observable';
import { BackendService, FirebaseService } from "../services";
import { ListView } from 'ui/list-view';
import { TextField } from 'ui/text-field';
import { StackLayout } from 'ui/layouts/stack-layout';
import { ScrollView } from 'ui/scroll-view';

@Component({
    moduleId: module.id,
    selector: "chat-tab",
    templateUrl: "chat.tab.component.html",
    styleUrls: ["chat.tab.component.css"]
})
export class ChatTabComponent implements OnInit {

    public me: String;
    sub: any;
    @ViewChild("list") lv: ElementRef;
    @ViewChild("textfield") tf: ElementRef;
    @ViewChild("scrollview") sv: ElementRef;
    @ViewChild("chatbox") sl: ElementRef;

    list: ListView;
    textfield: TextField;
    scrollview: ScrollView;
    chatbox: StackLayout;


    public constructor(
        private firebaseService: FirebaseService
    ) { }

    public chats$: Observable<any>;
    
    public ngOnInit() {
        this.me = BackendService.token;
        this.list = this.lv.nativeElement;
        this.textfield = this.tf.nativeElement;
        this.scrollview = this.sv.nativeElement;
        this.chatbox = this.sl.nativeElement;

        this.chats$ = <any>this.firebaseService.getChats();       
    }

    scroll(count:number){
       console.log("scrolling to ", count)
       this.list.scrollToIndex(count-1);
    }

    chat(message: string) {
        this.firebaseService.chat(message).then((data: any) => {
            let count = this.list.items.length;
            this.scroll(count);
        });
        this.textfield.text = '';        
    }

    filter(sender) {
        if (sender == BackendService.token) {
            return "me"
        }
        else {
            return "them"
        }
    }

    align(sender) {
        if (sender == BackendService.token) {
            return "right"
        }
        else {
            return "left"
        }
    }
    showImage(sender) {
        if (sender == BackendService.token) {
            return "collapsed"
        }
        else {
            return "visible"
        }
    }

}



