import { Component, OnInit } from "@angular/core";
const firebase = require("nativescript-plugin-firebase");
import * as dialogs from "tns-core-modules/ui/dialogs";
import { BackendService } from "./services/backend.service";

@Component({
  selector: "yw-main",
  template: "<page-router-outlet></page-router-outlet>"
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    firebase.init({
      /*onPushTokenReceivedCallback: function(token) {
        alert("Firebase push token: " + token);
      },*/
      onMessageReceivedCallback: function(message) {
        dialogs.alert({
          title: "Push message: " + (message.title !== undefined ? message.title : ""),
          message: JSON.stringify(message.body),
          okButtonText: "W00t!"
        });
      },
      //persist should be set to false as otherwise numbers aren't returned during livesync
      persist: false,
      //storageBucket: 'gs://yowwlr.appspot.com',
      onAuthStateChanged: (data: any) => {
        if (data.loggedIn) {
          BackendService.token = data.user.uid;
        }
        else {
          BackendService.token = "";
        }
      }
    }).then(
        function (instance) {
          console.log("firebase.init done");
        },
        function (error) {
          console.log("firebase.init error: " + error);
        }
    );
  }
}