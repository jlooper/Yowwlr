import { NativeScriptModule } from "nativescript-angular/platform";
import { NgModule } from "@angular/core";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import {TNSFontIconModule, TNSFontIconService, TNSFontIconPipe, TNSFontIconPurePipe} from 'nativescript-ng2-fonticon';
import { homeRouting } from "./home.routes";
import { HomeComponent } from "./home.component";
import { HomeTabComponent } from './home.tab.component';

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
    HomeTabComponent    
  ]
})
export class HomeModule {}