"use strict";
Cotton.Core.Notification = Class.extend({

  init : function(sPreviousVersion) {
    var self = this;
    this._sId = "1";
    this._sTitle = "Wow, two new features in cottonTracks!";
    this._sMessage = "- Edit manually the title of your stories by clicking on it.\n" +
      "- Share easily any card with facebook, twitter or email.";

    if (sPreviousVersion !== "0.7.4") {
      chrome.notifications.create(self._sId, {
        "type":"basic",
        "iconUrl": "/media/images/browser_action/cbutton38.png",
        "title": this._sTitle,
        "message": this._sMessage
      }, function(){});
    }

    chrome.notifications.onClicked.addListener(function(sNotificationId){
      if (sNotificationId === self._sId){
        chrome.browserAction.onClicked.dispatch();
      }
    });
  }
});