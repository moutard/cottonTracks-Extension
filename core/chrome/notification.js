"use strict";
Cotton.Core.Notification = Class.extend({

  init : function(sPreviousVersion) {
    var self = this;
    this._sId = "1";
    this._sTitle = "Try out the future of cottonTracks!";
    this._sMessage = "We are testing an advanced version for cottonTracks, with more control over your organisation\n"
      + "Click here to check it out!";

    chrome.notifications.create(self._sId, {
      "type":"basic",
      "iconUrl": "/media/images/browser_action/cbutton38.png",
      "title": this._sTitle,
      "message": this._sMessage
    }, function(){});

    chrome.notifications.onClicked.addListener(function(sNotificationId){
      if (sNotificationId === self._sId){
        chrome.browserAction.onClicked.dispatch();
      }
    });
  }
});