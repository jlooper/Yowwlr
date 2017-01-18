import { Component, OnInit } from "@angular/core";

@Component({
    moduleId: module.id,
    selector: "home-tab",
    templateUrl: "home.tab.html"
})
export class HomeTabComponent implements OnInit {

    public constructor() {}

    public ngOnInit() {
        console.log("init Tab 1");
    }

}