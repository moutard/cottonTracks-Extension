"use strict";
Cotton.Core.Notification = Class.extend({

  init : function() {
    chrome.notifications.create("1", {
      "type":"basic",
      "iconUrl": "/media/images/browser_action/cbutton38.png",
      "title": "The new version of cottonTracks is out!",
      "message":"We've released a new interface for you to make the best of your online discoveries. Give it a try it clicking our icon in your browser!",
    }, function(){});
  }
});