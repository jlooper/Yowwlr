import { Injectable, NgZone } from "@angular/core";
import { User, Yowl } from "../models";
import { BackendService } from "./backend.service";
import firebase = require("nativescript-plugin-firebase");
import { BehaviorSubject, Observable } from 'rxjs';
import { share } from 'rxjs/operators';

@Injectable()
export class FirebaseService {
  constructor(
    private ngZone: NgZone,
  ){}


yowls: BehaviorSubject<Array<Yowl>> = new BehaviorSubject([]);
private _allYowls: Array<Yowl> = [];
chats: BehaviorSubject<Array<Yowl>> = new BehaviorSubject([]);
private _allChats: Array<Yowl> = [];

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
      passwordOptions: {
        email: user.email,
        password: user.password
      }
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
             observer.next(results);
          });
        };
        firebase.addValueEventListener(onValueEvent, `/${path}`);
    }).pipe(share());              
  }

  handleSnapshot(data: any) {
    //empty array, then refill and filter
    this._allYowls = [];
    if (data) {
      for (let id in data) {        
        let result = (<any>Object).assign({id: id}, data[id]);
          this._allYowls.push(result);
      }
      this.publishUpdates();
    }
    return this._allYowls;
  }

  getChats(): Observable<any> {
    return new Observable((observer: any) => {
      let path = 'Chats';
      
        let onValueEvent = (snapshot: any) => {
          this.ngZone.run(() => {
            let results = this.handleChatSnapshot(snapshot.value);
             observer.next(results);
          });
        };
        firebase.addValueEventListener(onValueEvent, `/${path}`);
    }).pipe(share());               
  }

  handleChatSnapshot(data: any) {
    //empty array, then refill and filter
    this._allChats = [];
    if (data) {
      for (let id in data) {        
        let result = (<any>Object).assign({id: id}, data[id]);
          this._allChats.push(result);
      }
      this.publishChatUpdates();
    }
    return this._allChats;
  }

  sendYowl(Yowl:any) {
    let yowl = Yowl;   
    return firebase.push(
        "/Yowls",
        { "name": "Mr. Growlllr", "username": "MrGrwwlr", "text": "Yooowwwwlll!", "UID": BackendService.token, "date": 0 - Date.now()}
      ).then(
        function (result:any) {
          return 'Yowwled!';
        },
        function (errorMessage:any) {
          console.log(errorMessage);
        }); 
  }

  chat(message:string) {
    //let chat = Chat; 
    console.log(`BackendService.token ${BackendService.token}`);
    console.log("chat from firebase Service");
    console.log(message)  
    return firebase.push(
        "/Chats",
        { "message": message, "to": "MrGrwwlr", "from": BackendService.token, "date": 0 - Date.now()}
      ).then(
        function (result:any) {
          return "chatted";
        },
        function (errorMessage:any) {
          console.log(errorMessage);
        }); 
  }

   publishUpdates() {
    this._allYowls.sort(function(a, b){
        if(a.date < b.date) return -1;
        if(a.date > b.date) return 1;
      return 0;
    })
    this.yowls.next([...this._allYowls]);
  }

  publishChatUpdates() {
    this._allChats.sort(function(a, b){
        if(a.date > b.date) return -1;
        if(a.date < b.date) return 1;
      return 0;
    })
    this.chats.next([...this._allChats]);
  }

  handleErrors(error) {
    console.log(JSON.stringify(error));
    return Promise.reject(error.message);
  }
}