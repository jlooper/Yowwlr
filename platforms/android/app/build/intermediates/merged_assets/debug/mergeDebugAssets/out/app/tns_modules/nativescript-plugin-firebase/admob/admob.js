"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var firebase_common_1 = require("../firebase-common");
var admob_common_1 = require("./admob-common");
exports.AD_SIZE = admob_common_1.AD_SIZE;
var appModule = require("tns-core-modules/application");
var frame_1 = require("tns-core-modules/ui/frame");
var utils_1 = require("tns-core-modules/utils/utils");
function showBanner(arg) {
    var _this = this;
    return new Promise(function (resolve, reject) {
        try {
            var settings = firebase_common_1.firebase.merge(arg, admob_common_1.BANNER_DEFAULTS);
            if (firebase_common_1.firebase.admob.adView !== null && firebase_common_1.firebase.admob.adView !== undefined) {
                var parent_1 = firebase_common_1.firebase.admob.adView.getParent();
                if (parent_1 !== null) {
                    parent_1.removeView(firebase_common_1.firebase.admob.adView);
                }
            }
            firebase_common_1.firebase.admob.adView = new com.google.android.gms.ads.AdView(appModule.android.foregroundActivity);
            firebase_common_1.firebase.admob.adView.setAdUnitId(settings.androidBannerId);
            var bannerType = _getBannerType(settings.size);
            firebase_common_1.firebase.admob.adView.setAdSize(bannerType);
            _this.resolve = resolve;
            _this.reject = reject;
            var BannerAdListener = com.google.android.gms.ads.AdListener.extend({
                resolve: null,
                reject: null,
                onAdLoaded: function () {
                    _this.resolve();
                },
                onAdFailedToLoad: function (errorCode) {
                    _this.reject(errorCode);
                }
            });
            firebase_common_1.firebase.admob.adView.setAdListener(new BannerAdListener());
            var ad = _buildAdRequest(settings);
            firebase_common_1.firebase.admob.adView.loadAd(ad);
            var density = utils_1.layout.getDisplayDensity(), top_1 = settings.margins.top * density, bottom = settings.margins.bottom * density;
            var relativeLayoutParams = new android.widget.RelativeLayout.LayoutParams(android.widget.RelativeLayout.LayoutParams.MATCH_PARENT, android.widget.RelativeLayout.LayoutParams.WRAP_CONTENT);
            if (bottom > -1) {
                relativeLayoutParams.bottomMargin = bottom;
                relativeLayoutParams.addRule(android.widget.RelativeLayout.ALIGN_PARENT_BOTTOM);
            }
            else {
                if (top_1 > -1) {
                    relativeLayoutParams.topMargin = top_1;
                }
                relativeLayoutParams.addRule(android.widget.RelativeLayout.ALIGN_PARENT_TOP);
            }
            var adViewLayout_1 = new android.widget.RelativeLayout(appModule.android.foregroundActivity);
            adViewLayout_1.addView(firebase_common_1.firebase.admob.adView, relativeLayoutParams);
            var relativeLayoutParamsOuter_1 = new android.widget.RelativeLayout.LayoutParams(android.widget.RelativeLayout.LayoutParams.MATCH_PARENT, android.widget.RelativeLayout.LayoutParams.MATCH_PARENT);
            setTimeout(function () {
                if (frame_1.topmost() !== undefined) {
                    frame_1.topmost().currentPage.android.getParent().addView(adViewLayout_1, relativeLayoutParamsOuter_1);
                }
                else {
                    appModule.android.foregroundActivity.getWindow().getDecorView().addView(adViewLayout_1, relativeLayoutParamsOuter_1);
                }
            }, 0);
        }
        catch (ex) {
            console.log("Error in firebase.admob.showBanner: " + ex);
            reject(ex);
        }
    });
}
exports.showBanner = showBanner;
function preloadInterstitial(arg) {
    return new Promise(function (resolve, reject) {
        try {
            var settings = firebase_common_1.firebase.merge(arg, admob_common_1.BANNER_DEFAULTS);
            var activity = appModule.android.foregroundActivity || appModule.android.startActivity;
            firebase_common_1.firebase.admob.interstitialView = new com.google.android.gms.ads.InterstitialAd(activity);
            firebase_common_1.firebase.admob.interstitialView.setAdUnitId(settings.androidInterstitialId);
            var InterstitialAdListener = com.google.android.gms.ads.AdListener.extend({
                onAdLoaded: function () {
                    resolve();
                },
                onAdFailedToLoad: function (errorCode) {
                    reject(errorCode);
                },
                onAdClosed: function () {
                    if (firebase_common_1.firebase.admob.interstitialView) {
                        firebase_common_1.firebase.admob.interstitialView.setAdListener(null);
                        firebase_common_1.firebase.admob.interstitialView = null;
                    }
                    arg.onAdClosed && arg.onAdClosed();
                }
            });
            firebase_common_1.firebase.admob.interstitialView.setAdListener(new InterstitialAdListener());
            var ad = _buildAdRequest(settings);
            firebase_common_1.firebase.admob.interstitialView.loadAd(ad);
        }
        catch (ex) {
            console.log("Error in firebase.admob.showInterstitial: " + ex);
            reject(ex);
        }
    });
}
exports.preloadInterstitial = preloadInterstitial;
function showInterstitial(arg) {
    return new Promise(function (resolve, reject) {
        try {
            if (!arg) {
                if (firebase_common_1.firebase.admob.interstitialView) {
                    firebase_common_1.firebase.admob.interstitialView.show();
                    resolve();
                }
                else {
                    reject("Please call 'preloadInterstitial' first");
                }
                return;
            }
            var settings = firebase_common_1.firebase.merge(arg, admob_common_1.BANNER_DEFAULTS);
            var activity = appModule.android.foregroundActivity || appModule.android.startActivity;
            firebase_common_1.firebase.admob.interstitialView = new com.google.android.gms.ads.InterstitialAd(activity);
            firebase_common_1.firebase.admob.interstitialView.setAdUnitId(settings.androidInterstitialId);
            var InterstitialAdListener = com.google.android.gms.ads.AdListener.extend({
                onAdLoaded: function () {
                    if (firebase_common_1.firebase.admob.interstitialView) {
                        firebase_common_1.firebase.admob.interstitialView.show();
                    }
                    resolve();
                },
                onAdFailedToLoad: function (errorCode) {
                    reject(errorCode);
                },
                onAdClosed: function () {
                    if (firebase_common_1.firebase.admob.interstitialView) {
                        firebase_common_1.firebase.admob.interstitialView.setAdListener(null);
                        firebase_common_1.firebase.admob.interstitialView = null;
                    }
                    arg.onAdClosed && arg.onAdClosed();
                }
            });
            firebase_common_1.firebase.admob.interstitialView.setAdListener(new InterstitialAdListener());
            var ad = _buildAdRequest(settings);
            firebase_common_1.firebase.admob.interstitialView.loadAd(ad);
        }
        catch (ex) {
            console.log("Error in firebase.admob.showInterstitial: " + ex);
            reject(ex);
        }
    });
}
exports.showInterstitial = showInterstitial;
function preloadRewardedVideoAd(arg) {
    return new Promise(function (resolve, reject) {
        try {
            var settings = firebase_common_1.firebase.merge(arg, admob_common_1.BANNER_DEFAULTS);
            var activity = appModule.android.foregroundActivity || appModule.android.startActivity;
            firebase_common_1.firebase.admob.rewardedAdVideoView = com.google.android.gms.ads.MobileAds.getRewardedVideoAdInstance(activity);
            admob_common_1.rewardedVideoCallbacks.onLoaded = resolve;
            admob_common_1.rewardedVideoCallbacks.onFailedToLoad = reject;
            var RewardedVideoAdListener = com.google.android.gms.ads.reward.RewardedVideoAdListener.extend({
                onRewarded: function (reward) {
                    admob_common_1.rewardedVideoCallbacks.onRewarded({
                        amount: reward.getAmount(),
                        type: reward.getType()
                    });
                },
                onRewardedVideoAdLeftApplication: function () {
                    admob_common_1.rewardedVideoCallbacks.onLeftApplication();
                },
                onRewardedVideoAdClosed: function () {
                    if (firebase_common_1.firebase.admob.rewardedAdVideoView) {
                        firebase_common_1.firebase.admob.rewardedAdVideoView.setRewardedVideoAdListener(null);
                        firebase_common_1.firebase.admob.rewardedAdVideoView = null;
                    }
                    admob_common_1.rewardedVideoCallbacks.onClosed();
                },
                onRewardedVideoAdFailedToLoad: function (errorCode) {
                    admob_common_1.rewardedVideoCallbacks.onFailedToLoad(errorCode);
                },
                onRewardedVideoAdLoaded: function () {
                    admob_common_1.rewardedVideoCallbacks.onLoaded();
                },
                onRewardedVideoAdOpened: function () {
                    admob_common_1.rewardedVideoCallbacks.onOpened();
                },
                onRewardedVideoStarted: function () {
                    admob_common_1.rewardedVideoCallbacks.onStarted();
                },
                onRewardedVideoCompleted: function () {
                    admob_common_1.rewardedVideoCallbacks.onCompleted();
                }
            });
            firebase_common_1.firebase.admob.rewardedAdVideoView.setRewardedVideoAdListener(new RewardedVideoAdListener());
            var ad = _buildAdRequest(settings);
            firebase_common_1.firebase.admob.rewardedAdVideoView.loadAd(settings.androidAdPlacementId, ad);
        }
        catch (ex) {
            console.log("Error in firebase.admob.preloadRewardedVideoAd: " + ex);
            reject(ex);
        }
    });
}
exports.preloadRewardedVideoAd = preloadRewardedVideoAd;
function showRewardedVideoAd(arg) {
    return new Promise(function (resolve, reject) {
        try {
            if (!firebase_common_1.firebase.admob.rewardedAdVideoView) {
                reject("Please call 'preloadRewardedVideoAd' first");
                return;
            }
            if (arg.onRewarded) {
                admob_common_1.rewardedVideoCallbacks.onRewarded = arg.onRewarded;
            }
            if (arg.onLeftApplication) {
                admob_common_1.rewardedVideoCallbacks.onLeftApplication = arg.onLeftApplication;
            }
            if (arg.onClosed) {
                admob_common_1.rewardedVideoCallbacks.onClosed = arg.onClosed;
            }
            if (arg.onOpened) {
                admob_common_1.rewardedVideoCallbacks.onOpened = arg.onOpened;
            }
            if (arg.onStarted) {
                admob_common_1.rewardedVideoCallbacks.onStarted = arg.onStarted;
            }
            if (arg.onCompleted) {
                admob_common_1.rewardedVideoCallbacks.onCompleted = arg.onCompleted;
            }
            firebase_common_1.firebase.admob.rewardedAdVideoView.show();
            resolve();
        }
        catch (ex) {
            console.log("Error in firebase.admob.showRewardedVideoAd: " + ex);
            reject(ex);
        }
    });
}
exports.showRewardedVideoAd = showRewardedVideoAd;
function hideBanner() {
    return new Promise(function (resolve, reject) {
        try {
            if (firebase_common_1.firebase.admob.adView !== null) {
                var parent_2 = firebase_common_1.firebase.admob.adView.getParent();
                if (parent_2 !== null) {
                    parent_2.removeView(firebase_common_1.firebase.admob.adView);
                }
                firebase_common_1.firebase.admob.adView = null;
            }
            resolve();
        }
        catch (ex) {
            console.log("Error in firebase.admob.hideBanner: " + ex);
            reject(ex);
        }
    });
}
exports.hideBanner = hideBanner;
function _getBannerType(size) {
    if (size === admob_common_1.AD_SIZE.BANNER) {
        return com.google.android.gms.ads.AdSize.BANNER;
    }
    else if (size === admob_common_1.AD_SIZE.LARGE_BANNER) {
        return com.google.android.gms.ads.AdSize.LARGE_BANNER;
    }
    else if (size === admob_common_1.AD_SIZE.MEDIUM_RECTANGLE) {
        return com.google.android.gms.ads.AdSize.MEDIUM_RECTANGLE;
    }
    else if (size === admob_common_1.AD_SIZE.FULL_BANNER) {
        return com.google.android.gms.ads.AdSize.FULL_BANNER;
    }
    else if (size === admob_common_1.AD_SIZE.LEADERBOARD) {
        return com.google.android.gms.ads.AdSize.LEADERBOARD;
    }
    else if (size === admob_common_1.AD_SIZE.SMART_BANNER) {
        return com.google.android.gms.ads.AdSize.SMART_BANNER;
    }
    else {
        return null;
    }
}
function _buildAdRequest(settings) {
    var builder = new com.google.android.gms.ads.AdRequest.Builder();
    if (settings.testing) {
        builder.addTestDevice(com.google.android.gms.ads.AdRequest.DEVICE_ID_EMULATOR);
        var activity = appModule.android.foregroundActivity || appModule.android.startActivity;
        var ANDROID_ID = android.provider.Settings.Secure.getString(activity.getContentResolver(), android.provider.Settings.Secure.ANDROID_ID);
        var deviceId = _md5(ANDROID_ID);
        if (deviceId !== null) {
            deviceId = deviceId.toUpperCase();
            console.log("Treating this deviceId as testdevice: " + deviceId);
            builder.addTestDevice(deviceId);
        }
    }
    if (settings.keywords !== undefined && settings.keywords.length > 0) {
        for (var i = 0; i < settings.keywords.length; i++) {
            builder.addKeyword(settings.keywords[i]);
        }
    }
    var bundle = new android.os.Bundle();
    bundle.putInt("nativescript", 1);
    var adextras = new com.google.android.gms.ads.mediation.admob.AdMobExtras(bundle);
    return builder.build();
}
function _md5(input) {
    try {
        var digest = java.security.MessageDigest.getInstance("MD5");
        var bytes = [];
        for (var j = 0; j < input.length; ++j) {
            bytes.push(input.charCodeAt(j));
        }
        var s = new java.lang.String(input);
        digest.update(s.getBytes());
        var messageDigest = digest.digest();
        var hexString = "";
        for (var i = 0; i < messageDigest.length; i++) {
            var h = java.lang.Integer.toHexString(0xFF & messageDigest[i]);
            while (h.length < 2)
                h = "0" + h;
            hexString += h;
        }
        return hexString;
    }
    catch (noSuchAlgorithmException) {
        console.log("error generating md5: " + noSuchAlgorithmException);
        return null;
    }
}
