import {Injectable, NgZone} from "@angular/core";
import {User} from "../models";
import { BackendService } from "./backend.service";
import firebase = require("nativescript-plugin-firebase");
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/share';

@Injectable()
export class FirebaseService {
  constructor(
    private ngZone: NgZone,
  ){}

  getMessage(){ 
    firebase.addOnMessageReceivedCallback(function (data ){
        alert(JSON.stringify(data));
    })
  }
    
  register(user: User) {
    return firebase.createUser({
      email: user.email,
      password: user.password
    }).then(
          function (result:any) {
            return JSON.stringify(result);
          },
          function (errorMessage:any) {
            alert(errorMessage);
          }
      )
  }

  login(user: User) {
    return firebase.login({
      type: firebase.LoginType.PASSWORD,
      email: user.email,
      password: user.password
    }).then((result: any) => {
          BackendService.token = result.uid;
          return JSON.stringify(result);
      }, (errorMessage: any) => {
        alert(errorMessage);
      });
  }

  logout(){
    BackendService.token = "";
    firebase.logout();    
  }
  
  resetPassword(email) {
    return firebase.resetPassword({
    email: email
    }).then((result: any) => {
          alert(JSON.stringify(result));
        },
        function (errorMessage:any) {
          alert(errorMessage);
        }
    ).catch(this.handleErrors);
  }  

 

  handleErrors(error) {
    console.log(JSON.stringify(error));
    return Promise.reject(error.message);
  }
}