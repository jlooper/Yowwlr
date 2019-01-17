import { Component, OnInit } from "@angular/core";
import { Observable } from 'rxjs';
import { FirebaseService } from "../services";

@Component({
    moduleId: module.id,
    selector: "home-tab",
    templateUrl: "home.tab.html"
})
export class HomeTabComponent implements OnInit {

    public constructor(
        private firebaseService: FirebaseService
    ) {}

    public yowls$: Observable<any>;
    
    public ngOnInit() {
        console.log("HomeTab ngOnInit");
        this.yowls$ = <any>this.firebaseService.getYowls();
    }

}