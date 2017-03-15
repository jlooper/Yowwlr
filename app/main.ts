// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic } from "nativescript-angular/platform";

import { AppModule } from "./app.module";
import { BackendService } from "./services/backend.service";
const dialogs = require("ui/dialogs");
import firebase = require("nativescript-plugin-firebase");

 firebase.init({
   /*onPushTokenReceivedCallback: function(token) {
     alert("Firebase push token: " + token);
   },
   onMessageReceivedCallback: function(message) {
     dialogs.alert({
       title: "Push message: " + (message.title !== undefined ? message.title : ""),
       message: JSON.stringify(message.body),
       okButtonText: "W00t!"
     });
   },*/
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

platformNativeScriptDynamic().bootstrapModule(AppModule);