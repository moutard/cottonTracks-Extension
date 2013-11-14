"use strict";

Cotton.Controllers.Recommander = Class.extend({

  init : function(oGlobalDispatcher) {
    this._lItems = [];
    this._lRSSItemsToKeep = [];
  },

  getRSS : function(mCallback) {
    var self = this;
    var lRSS = Cotton.Config.RSS;
    var iLength = lRSS.length;
    var lTitles = [];
    var lUrls = [];
    var iCount = 0;

    var processRSSItem = function(data, mCallback){
      iCount++;
      if ($.isXMLDoc(data)) {
        var $xml = $(data);
        $xml.find("item").each(function() {
          var $this = $(this);
          var item = {
            title: $this.find("title").text(),
            link: $this.find("link").text(),
            description: $this.find("description").text(),
            guid: $this.find("guid").text()
          }
          if (lTitles.indexof(item['title']) === -1
            && lUrls.indexof(item['link'] === -1)) {
            lTitles.push(item['title']);
            lUrls.push(item['link']);
            self._lItems.push(item);
          }
        });
      }
      // all get request have responded
      if (iCount === iLength) {
        mCallback(self._lItems);
      }
    };

    for (var i = 0; i < iLength; i++) {
      $.get(lRSS[i]).success(function(data) {
        processRSSItem(data, mCallback);
      }).error(function(data) {
        processRSSItem(data, mCallback);
      });
    }
  },

  match : function(lStories) {
    var iStoriesLength = lStories.length;
    var jRSSItemsLength = this._lItems.length;
    var lUrlsToKeep = [];
    for (var i = 0; i < iStoriesLength; i++) {
      for (var j = 0; j < jRSSItemsLength; j++) {
        var oRSSHistoryItem = new Cotton.Model.HistoryItem({
          sTitle: this._lItems[j].title,
          sUrl: this._lItems[j].link
        });
        oRSSHistoryItem = Cotton.Algo.Tools.computeBagOfWordsForHistoryItem(oRSSHistoryItem);
        var iScore = Cotton.Algo.Score.Object.historyItemToStory(oRSSHistoryItem, lStories[i]);
        if (iScore > 0 && lUrlsToKeep.indexOf(oRSSHistoryItem.url() === -1)) {
          oRSSHistoryItem.storyTitle = lStories[i].title;
          this._lRSSItemsToKeep.push(oRSSHistoryItem);
          lUrlsToKeep.push(oRSSHistoryItem.url());
        }
      }
    }
  },

  getReco : function() {
    return this._lRSSItemsToKeep;
  }

});