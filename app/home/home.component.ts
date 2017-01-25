import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Page } from "ui/page";
import { BackendService, FirebaseService, CatService } from "../services";
import { RouterExtensions } from 'nativescript-angular/router/router-extensions';
import { Router } from '@angular/router';
import { Cat } from '../models/cat.model';

@Component({
    moduleId: module.id,
    selector: "yw-home",
    templateUrl: "home.html"
})
export class HomeComponent implements OnInit { 
    
 

    public cats$: Observable<Cat[]>;
    
    constructor(private routerExtensions: RouterExtensions,
        private firebaseService: FirebaseService,
        private catService: CatService,
        private router: Router
    ) { }

    ngOnInit() {
       this.firebaseService.getMessage();
       this.cats$ = <any>this.catService.getCats();
       console.log(JSON.stringify(this.cats$))
    }

    logout() {
        this.firebaseService.logout();
        this.routerExtensions.navigate(["/login"], { clearHistory: true });
    }
}

