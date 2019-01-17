# NativeScript TypeScript

A package providing TypeScript support for NativeScript.

[NativeScript](https://www.nativescript.org/) is a framework which enables developers to write truly native mobile applications for Android and iOS using JavaScript and CSS. [Angular](https://angular.io/) is one of the most popular open source JavaScript frameworks for application development. We [worked closely with developers at Google](http://angularjs.blogspot.bg/2015/12/building-mobile-apps-with-angular-2-and.html) to make Angular in NativeScript a reality. The result is a software architecture that allows you to build mobile apps using the same framework—and in some cases the same code—that you use to build Angular web apps, with the performance you’d expect from native code. [Read more about building truly native mobile apps with NativeScript and Angular](https://docs.nativescript.org/tutorial/ng-chapter-0).

## How to use in NativeScript projects

```
$ npm install -D nativescript-dev-typescript
```

The above command adds `nativescript-dev-typescript` package as dev dependency and installs the necessary hooks. TypeScript compilation happens when the project is prepared for build. A file named `tsconfig.json` that specifies compilation options will be created in the project folder and should be committed to source control. [Read more about tsconfig.json options](http://www.typescriptlang.org/docs/handbook/tsconfig-json.html).

## How it works

When the plugin installed what it will do out of the box is to add
 - `tsconfig.json` file to the project (if it doesn't exist), 
 - `typescript` as dev dependency
 - `before-prepare` hook which takes care to transpile all files before preparing your project
 - `before-watch` hook to start the typescript watcher and transpile on every typescript change during project livesync
 - `after-watch` hook to stop the typescript watcher after the livesync is stopped

## How to use in NativeScript plugins

This package is not meant to be used in plugins. It's applicable for NativeScript projects only.

## Contribute
We love PRs! Check out the [contributing guidelines](CONTRIBUTING.md). If you want to contribute, but you are not sure where to start - look for [issues labeled `help wanted`](https://github.com/NativeScript/nativescript-dev-typescript/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22).

## Get Help 
Please, use [github issues](https://github.com/NativeScript/nativescript-dev-typescript/issues) strictly for [reporting bugs](CONTRIBUTING.md#reporting-bugs) or [requesting features](CONTRIBUTING.md#requesting-features). For general questions and support, check out the [NativeScript community forum](https://discourse.nativescript.org/) or ask our experts in [NativeScript community Slack channel](http://developer.telerik.com/wp-login.php?action=slack-invitation).
  
![](https://ga-beacon.appspot.com/UA-111455-24/nativescript/nativescript-dev-typescript?pixel) 
