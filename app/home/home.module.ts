import { NativeScriptModule } from "nativescript-angular/platform";
import { NgModule } from "@angular/core";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import {TNSFontIconModule, TNSFontIconService, TNSFontIconPipe, TNSFontIconPurePipe} from 'nativescript-ngx-fonticon';
import { homeRouting } from "./home.routes";
import { HomeComponent } from "./home.component";
import { HomeTabComponent } from './home.tab.component';
import { ChatTabComponent } from '../chat/chat.tab.component';

@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    homeRouting,
    TNSFontIconModule.forRoot({
      'fa': 'fonts/font-awesome.css'
    }),
  ],
  declarations: [    
    HomeComponent,
    HomeTabComponent,
    ChatTabComponent    
  ]
})
export class HomeModule {}