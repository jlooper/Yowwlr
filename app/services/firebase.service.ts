import {Injectable, NgZone} from "@angular/core";
import {User, Yowl} from "../models";
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


yowls: BehaviorSubject<Array<Yowl>> = new BehaviorSubject([]);
private _allYowls: Array<Yowl> = [];

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

 getYowls(): Observable<any> {
    return new Observable((observer: any) => {
      let path = 'Yowls';
      
        let onValueEvent = (snapshot: any) => {
          this.ngZone.run(() => {
            let results = this.handleSnapshot(snapshot.value);
            console.log(JSON.stringify(results))
             observer.next(results);
          });
        };
        firebase.addValueEventListener(onValueEvent, `/${path}`);
    }).share();              
  }

  handleSnapshot(data: any) {
    //empty array, then refill and filter
    this._allYowls = [];
    if (data) {
      for (let id in data) {        
        let result = (<any>Object).assign({id: id}, data[id]);
          this._allYowls.push(result);
          console.log(JSON.stringify(result))
      }
      this.publishUpdates();
    }
    return this._allYowls;
  }

  sendYowl(Yowl:any) {
    let yowl = Yowl;   
    return firebase.push(
        "/Yowls",
        { "name": "Mr. Growlllr", "username": "MrGrwwlr", "text": "Yooowwwwlll!", "UID": BackendService.token, "date": 0 - Date.now()}
      ).then(
        function (result:any) {
          console.log(JSON.stringify(result))
          return 'Yowwled!';
        },
        function (errorMessage:any) {
          console.log(errorMessage);
        }); 
  }

   publishUpdates() {
    // here, we sort must emit a *new* value (immutability!)
    this.yowls.next([...this._allYowls]);
  }

  handleErrors(error) {
    console.log(JSON.stringify(error));
    return Promise.reject(error.message);
  }
}