import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Page } from "ui/page";
import { BackendService, FirebaseService } from "../services";
import { RouterExtensions } from 'nativescript-angular/router/router-extensions';
import { Router } from '@angular/router';


@Component({
    moduleId: module.id,
    selector: "yw-home",
    templateUrl: "home.html"
})
export class HomeComponent implements OnInit {

    id: string;
    name: string;
    date: string;
    description: string;
    imagepath: string;
    UID: string;

    public gifts$: Observable<any>;
    
    constructor(private routerExtensions: RouterExtensions,
        private firebaseService: FirebaseService,
        private router: Router
    ) { }

    ngOnInit() {
    }


    logout() {
        this.firebaseService.logout();
        this.routerExtensions.navigate(["/login"], { clearHistory: true });
    }
}

