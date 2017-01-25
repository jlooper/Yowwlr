import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Page } from "ui/page";
import { BackendService, FirebaseService } from "../services";
import { Yowl } from "../models";
import { RouterExtensions } from 'nativescript-angular/router/router-extensions';
import { Router } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: "yw-home",
    templateUrl: "home.html"
})
export class HomeComponent implements OnInit { 

    public yowl: Yowl;
    name: string;
    username: string;
    text: string;
    
    constructor(private routerExtensions: RouterExtensions,
        private firebaseService: FirebaseService,
        private router: Router
    ) { }

    ngOnInit() {
       this.firebaseService.getMessage();
    }

    sendYowl(){
      this.yowl = new Yowl()
        this.firebaseService.sendYowl(this.yowl).then((message:any) => {
            alert(message);
       }) 
    }

    logout() {
        this.firebaseService.logout();
        this.routerExtensions.navigate(["/login"], { clearHistory: true });
    }
}

