import {Component} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {User} from '../models/user.model';
import {FirebaseService} from '../services';
import {prompt} from "ui/dialogs";
import { RouterExtensions } from 'nativescript-angular/router/router-extensions';

@Component({
  moduleId: module.id,
  selector: 'yw-login',
  templateUrl: 'login.html'
})
export class LoginComponent {
  user: User;
  isLoggingIn = true;
  isAuthenticating = false;

  
  constructor(private firebaseService: FirebaseService,
              private routerExtensions: RouterExtensions
            ) {
              this.user = new User();
              this.user.email = "user@nativescript.org";
              this.user.password = "password";
            }

 
 submit() {
    this.isAuthenticating = true;
    if (this.isLoggingIn) {
      this.login();
    } else {
      this.signUp();
    }
  }

  login() {
     this.firebaseService.login(this.user)
      .then(() => {
        this.isAuthenticating = false;
        this.routerExtensions.navigate(["/"], { clearHistory: true } );

      })
      .catch((message:any) => {
        this.isAuthenticating = false;
      });
  }

  signUp() {
    this.firebaseService.register(this.user)
      .then(() => {
        this.isAuthenticating = false;
        this.toggleDisplay();
      })
      .catch((message:any) => {
        alert(message);
        this.isAuthenticating = false;
      });
  }

  forgotPassword() {

    prompt({
      title: "Forgot Password",
      message: "Enter the email address you used to register for Yowwlr to reset your password.",
      defaultText: "",
      okButtonText: "Ok",
      cancelButtonText: "Cancel"
    }).then((data) => {
      if (data.result) {
        this.firebaseService.resetPassword(data.text.trim())
          .then((result:any) => {
            if(result){
              alert(result);
            }
         });
      }
    });
 }
  
toggleDisplay() {
    this.isLoggingIn = !this.isLoggingIn;
  }
}