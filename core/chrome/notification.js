"use strict";
Cotton.Core.Notification = Class.extend({

  init : function(sPreviousVersion) {
    var self = this;
    this._sId = "1";
    this._sTitle = "New release of cottonTracks";
    this._sMessage = "There is a new release for cottonTracks, check it out and explore what is new!";

    if (sPreviousVersion === "0.6.0") {
      this._sTitle = "The new version of cottonTracks is out!";
      this._sMessage = "We've released a new interface for you to make the best of your online discoveries. Click here to give it a try now!";
    } else if (sPreviousVersion === "0.7.0" || sPreviousVersion === "0.7.1") {
      this._sTitle = "\"Favorite stories\" now available";
      this._sMessage = "We've added a new feature to cottonTracks, you can now favorite the stories you like the most to access them even quicker. Click here to give it a try now!";
    } else {
      return;
    }

    chrome.notifications.create(self._sId, {
      "type":"basic",
      "iconUrl": "/media/images/browser_action/cbutton38.png",
      "title": this._sTitle,
      "message": this._sMessage
    }, function(){
    });

    chrome.notifications.onClicked.addListener(function(sNotificationId){
      if (sNotificationId === self._sId){
        chrome.browserAction.onClicked.dispatch();
      }
    });
  }
});