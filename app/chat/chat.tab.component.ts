import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import { Observable } from 'rxjs/Observable';
import { BackendService, FirebaseService } from "../services";
import { ListView } from 'ui/list-view';
import { TextField } from 'ui/text-field';
import { ScrollView } from 'ui/scroll-view';

@Component({
    moduleId: module.id,
    selector: "chat-tab",
    templateUrl: "chat.tab.component.html",
    styleUrls: ["chat.tab.component.css"]
})
export class ChatTabComponent implements OnInit {

    public me: String;
    
    @ViewChild("list") lv: ElementRef;
    @ViewChild("textfield") tf: ElementRef;

    list: ListView;
    textfield: TextField;

    public constructor(
        private firebaseService: FirebaseService
    ) { }

    public chats$: Observable<any>;
    
    public ngOnInit() {
        this.me = BackendService.token;
        this.chats$ = <any>this.firebaseService.getChats();       
    }

    public ngAfterViewInit() {
        this.list = this.lv.nativeElement;
        this.textfield = this.tf.nativeElement;
    }

    scroll(count:number){
       console.log("scrolling to ", count)
       this.list.scrollToIndex(count-1);
       this.list.refresh();
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



