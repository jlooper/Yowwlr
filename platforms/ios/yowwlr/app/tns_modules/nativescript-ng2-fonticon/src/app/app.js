"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
require('reflect-metadata');
var platform_1 = require('nativescript-angular/platform');
var core_1 = require('@angular/core');
var BehaviorSubject_1 = require('rxjs/BehaviorSubject');
var nativescript_ng2_fonticon_1 = require('nativescript-ng2-fonticon');
nativescript_ng2_fonticon_1.TNSFontIconService.debug = true;
var DemoComponent = (function () {
    function DemoComponent(pluginService) {
        var _this = this;
        this.pluginService = pluginService;
        this.firstIcon$ = new BehaviorSubject_1.BehaviorSubject('');
        this.firstIonIcon$ = new BehaviorSubject_1.BehaviorSubject('');
        this.isToggled = false;
        setTimeout(function () {
            _this.firstIcon$.next('fa-glass');
            _this.firstIonIcon$.next('ion-close');
        });
    }
    DemoComponent.prototype.toggleFirst = function () {
        this.isToggled = !this.isToggled;
        if (this.isToggled) {
            this.firstIcon$.next('fa-stop');
            this.firstIonIcon$.next('ion-videocamera');
        }
        else {
            this.firstIcon$.next('fa-glass');
            this.firstIonIcon$.next('ion-close');
        }
    };
    DemoComponent = __decorate([
        core_1.Component({
            selector: 'app',
            template: "\n  <ActionBar title=\"Fonticon Demo\"> \n    <ActionItem (tap)=\"toggleFirst()\" ios.position=\"right\">\n      <Button text=\"Toggle\"></Button>\n    </ActionItem> \n  </ActionBar>\n  <TabView>\n    <ScrollView *tabItem=\"{title: 'FontAwesome'}\">\n      <GridLayout rows=\"auto,auto,auto,auto,auto,auto,auto,auto\" columns=\"*,*\">\n        <Label row=\"0\" col=\"0\" class=\"fa\" [text]=\"(firstIcon$ | async) | fonticonPure\"></Label>\n        <Label row=\"0\" col=\"1\" class=\"fa\" [text]=\"'fa-music' | fonticon\"></Label>\n        <Label row=\"1\" col=\"0\" class=\"fa\" [text]=\"'fa-search' | fonticon\"></Label>\n        <Label row=\"1\" col=\"1\" class=\"fa\" [text]=\"'fa-heart' | fonticon\"></Label>\n        <Label row=\"2\" col=\"0\" class=\"fa\" [text]=\"'fa-star' | fonticon\"></Label>\n        <Label row=\"2\" col=\"1\" class=\"fa\" [text]=\"'fa-user' | fonticon\"></Label>\n        <Label row=\"3\" col=\"0\" class=\"fa\" [text]=\"'fa-film' | fonticon\"></Label>\n        <Label row=\"3\" col=\"1\" class=\"fa\" [text]=\"'fa-check' | fonticon\"></Label>\n        <Label row=\"4\" col=\"0\" class=\"fa\" [text]=\"'fa-power-off' | fonticon\"></Label>\n        <Label row=\"4\" col=\"1\" class=\"fa\" [text]=\"'fa-signal' | fonticon\"></Label>\n        <Label row=\"5\" col=\"0\" class=\"fa\" [text]=\"'fa-gear' | fonticon\"></Label>\n        <Label row=\"5\" col=\"1\" class=\"fa\" [text]=\"'fa-bluetooth' | fonticon\"></Label>\n        <Label row=\"6\" col=\"0\" class=\"fa\" [text]=\"'fa-refresh' | fonticon\"></Label>\n        <Label row=\"6\" col=\"1\" class=\"fa\" [text]=\"'fa-lock' | fonticon\"></Label>\n        <Label row=\"7\" col=\"0\" class=\"fa\" [text]=\"'fa-flag' | fonticon\"></Label>\n        <Label row=\"7\" col=\"1\" class=\"fa\" [text]=\"'fa-headphones' | fonticon\"></Label>\n      </GridLayout>\n    </ScrollView>\n\n    <ScrollView *tabItem=\"{title: 'Ionicons'}\">\n      <GridLayout rows=\"auto,auto,auto,auto,auto,auto,auto,auto\" columns=\"*,*\">\n        <Label row=\"0\" col=\"0\" class=\"ion\" [text]=\"(firstIonIcon$ | async) | fonticonPure\"></Label>\n        <Label row=\"0\" col=\"1\" class=\"ion\" [text]=\"'ion-code' | fonticon\"></Label>\n        <Label row=\"1\" col=\"0\" class=\"ion\" [text]=\"'ion-crop' | fonticon\"></Label>\n        <Label row=\"1\" col=\"1\" class=\"ion\" [text]=\"'ion-document' | fonticon\"></Label>\n        <Label row=\"2\" col=\"0\" class=\"ion\" [text]=\"'ion-earth' | fonticon\"></Label>\n        <Label row=\"2\" col=\"1\" class=\"ion\" [text]=\"'ion-edit' | fonticon\"></Label>\n        <Label row=\"3\" col=\"0\" class=\"ion\" [text]=\"'ion-flag' | fonticon\"></Label>\n        <Label row=\"3\" col=\"1\" class=\"ion\" [text]=\"'ion-fork' | fonticon\"></Label>\n        <Label row=\"4\" col=\"0\" class=\"ion\" [text]=\"'ion-grid' | fonticon\"></Label>\n        <Label row=\"4\" col=\"1\" class=\"ion\" [text]=\"'ion-hammer' | fonticon\"></Label>\n        <Label row=\"5\" col=\"0\" class=\"ion\" [text]=\"'ion-headphone' | fonticon\"></Label>\n        <Label row=\"5\" col=\"1\" class=\"ion\" [text]=\"'ion-heart' | fonticon\"></Label>\n        <Label row=\"6\" col=\"0\" class=\"ion\" [text]=\"'ion-home' | fonticon\"></Label>\n        <Label row=\"6\" col=\"1\" class=\"ion\" [text]=\"'ion-images' | fonticon\"></Label>\n        <Label row=\"7\" col=\"0\" class=\"ion\" [text]=\"'ion-paintbrush' | fonticon\"></Label>\n        <Label row=\"7\" col=\"1\" class=\"ion\" [text]=\"'ion-person' | fonticon\"></Label>\n      </GridLayout>\n    </ScrollView>\n  </TabView>  \n  "
        }), 
        __metadata('design:paramtypes', [nativescript_ng2_fonticon_1.TNSFontIconService])
    ], DemoComponent);
    return DemoComponent;
}());
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_1.NativeScriptModule,
                nativescript_ng2_fonticon_1.TNSFontIconModule.forRoot({
                    'fa': 'font-awesome.css',
                    'ion': 'ionicons.css'
                })
            ],
            declarations: [
                DemoComponent
            ],
            bootstrap: [DemoComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
platform_1.platformNativeScriptDynamic().bootstrapModule(AppModule);
//# sourceMappingURL=app.js.map