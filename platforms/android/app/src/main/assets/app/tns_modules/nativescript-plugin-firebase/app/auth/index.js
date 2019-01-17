"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var firebase = require("../../firebase");
var firebase_1 = require("../../firebase");
var auth;
(function (auth) {
    var Auth = (function () {
        function Auth() {
        }
        Auth.prototype.onAuthStateChanged = function (handler) {
            this.authStateChangedHandler = handler;
            console.log(">> added onAuthStateChanged handler");
        };
        ;
        Auth.prototype.signOut = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                firebase.logout()
                    .then(function () {
                    _this.currentUser = undefined;
                    _this.authStateChangedHandler && _this.authStateChangedHandler();
                    resolve();
                })
                    .catch(function (err) {
                    reject({
                        message: err
                    });
                });
            });
        };
        Auth.prototype.unlink = function (providerId) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                firebase.unlink(providerId)
                    .then(function (user) {
                    _this.currentUser = user;
                    resolve(user);
                })
                    .catch(function (err) {
                    reject({
                        message: err
                    });
                });
            });
        };
        Auth.prototype.signInWithEmailAndPassword = function (email, password) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                firebase.login({
                    type: firebase_1.LoginType.PASSWORD,
                    passwordOptions: {
                        email: email,
                        password: password
                    }
                }).then(function (user) {
                    _this.currentUser = user;
                    _this.authStateChangedHandler && _this.authStateChangedHandler(user);
                    resolve({
                        additionalUserInfo: user.additionalUserInfo,
                        credential: null,
                        operationType: "SignIn",
                        user: user,
                    });
                }).catch(function (err) {
                    var code = 'auth/exception';
                    var message = err.toString();
                    if (message.includes('com.google.firebase.auth.FirebaseAuthInvalidCredentialsException')) {
                        code = 'auth/wrong-password';
                    }
                    else if (message.includes('com.google.firebase.auth.FirebaseAuthInvalidUserException')) {
                        code = 'auth/user-not-found';
                    }
                    reject({
                        code: code,
                        message: message
                    });
                });
            });
        };
        Auth.prototype.sendSignInLinkToEmail = function (email, actionCodeSettings) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                firebase.login({
                    type: firebase_1.LoginType.EMAIL_LINK,
                    emailLinkOptions: {
                        email: email,
                        url: actionCodeSettings.url,
                    }
                }).then(function (user) {
                    _this.currentUser = user;
                    _this.authStateChangedHandler && _this.authStateChangedHandler(user);
                    resolve();
                }, (function (err) {
                    reject({
                        message: err
                    });
                }));
            });
        };
        Auth.prototype.createUserWithEmailAndPassword = function (email, password) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                firebase.createUser({
                    email: email,
                    password: password
                }).then(function (user) {
                    _this.currentUser = user;
                    resolve(user);
                }).catch(function (err) { return reject(err); });
            });
        };
        Auth.prototype.signInAnonymously = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                firebase.login({
                    type: firebase_1.LoginType.ANONYMOUS
                }).then(function (user) {
                    _this.currentUser = user;
                    _this.authStateChangedHandler && _this.authStateChangedHandler(user);
                    resolve();
                }, (function (err) {
                    reject({
                        message: err
                    });
                }));
            });
        };
        Auth.prototype.fetchProvidersForEmail = function (email) {
            return firebase.fetchProvidersForEmail(email);
        };
        Auth.prototype.fetchSignInMethodsForEmail = function (email) {
            return firebase.fetchSignInMethodsForEmail(email);
        };
        return Auth;
    }());
    auth.Auth = Auth;
})(auth = exports.auth || (exports.auth = {}));
