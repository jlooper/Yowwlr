"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AD_SIZE = {
    SMART_BANNER: "SMART",
    LARGE_BANNER: "LARGE",
    BANNER: "BANNER",
    MEDIUM_RECTANGLE: "MEDIUM",
    FULL_BANNER: "FULL",
    LEADERBOARD: "LEADERBOARD",
    SKYSCRAPER: "SKYSCRAPER",
    FLUID: "FLUID"
};
exports.BANNER_DEFAULTS = {
    margins: {
        top: -1,
        bottom: -1
    },
    testing: false,
    size: "SMART",
    view: undefined
};
exports.rewardedVideoCallbacks = {
    onRewarded: function (reward) { return console.warn("onRewarded callback not set - the fallback implementation caught this reward: " + JSON.stringify(reward)); },
    onLeftApplication: function () {
    },
    onClosed: function () {
    },
    onOpened: function () {
    },
    onStarted: function () {
    },
    onCompleted: function () {
    },
    onLoaded: function () {
    },
    onFailedToLoad: function (err) { return console.warn("onFailedToLoad not set - the fallback implementation caught this error: " + err); },
};
