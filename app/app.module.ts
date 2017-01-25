import { NativeScriptModule } from "nativescript-angular/platform";
import { NgModule } from "@angular/core";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { authProviders, appRoutes } from "./app.routes";
import { AppComponent } from "./app.component";
import { BackendService, FirebaseService, CatService } from "./services";

import { LoginModule } from "./login/login.module";
import { HomeModule } from "./home/home.module";

@NgModule({
  providers: [
    BackendService,
    FirebaseService,
    CatService,
    authProviders
  ],
  imports: [
    NativeScriptModule,
    NativeScriptHttpModule,
    NativeScriptRouterModule,
    NativeScriptRouterModule.forRoot(appRoutes),
    LoginModule,
    HomeModule
  ],
  declarations: [
      AppComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
