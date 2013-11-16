"use strict";

Cotton.Controllers.Recommander = Class.extend({

  init : function(oGlobalDispatcher) {
    this._oGlobalDispatcher = oGlobalDispatcher;
  },

  getRSS : function(mCallback) {
    var self = this;
    var lRSS = _.shuffle(Cotton.Config.RSS);
    var iLength = lRSS.length;
    var lTitles = [];
    var lUrls = [];

    for (var i = 0; i < iLength; i++) {
      $.get(lRSS[i], function(data) {
        if ($.isXMLDoc(data)) {
          var $xml = $(data);
          $xml.find("item").each(function() {
            var $this = $(this);
            var item = {
              title: $this.find("title").text(),
              link: $this.find("link").text(),
              description: $this.find("description").text(),
              guid: $this.find("guid").text(),
              image: $this.find("enclosure").attr('url')
            }
            if (lTitles.indexOf(item.title) === -1
              && lUrls.indexOf(item.link === -1)) {
              lTitles.push(item.title);
              lUrls.push(item.link);
              mCallback(item);
            }
          });
        }
      });
    }
  },

  matchRSS : function(oItem, lStories) {
    var iMinScore = 26;
    var bMatched = false;
    var iStoriesLength = lStories.length;
    var oRSSHistoryItem = new Cotton.Model.HistoryItem({
      sTitle: oItem.title,
      sUrl: oItem.link,
      oExtractedDNA: {sImageUrl:oItem.image}
    });
    for (var i = 0; i < iStoriesLength; i++) {
      oRSSHistoryItem = Cotton.Algo.Tools.computeBagOfWordsForHistoryItem(oRSSHistoryItem);
      var iScore = Cotton.Algo.Score.Object.historyItemToStory(oRSSHistoryItem, lStories[i]);
      if (iScore > iMinScore) {
        iMinScore = iScore;
        oRSSHistoryItem._sStoryTitle = lStories[i].title();
        oRSSHistoryItem.setStoryId(lStories[i].id());
        oRSSHistoryItem._sDescription = $(oItem.description).text();
        bMatched = true;
      console.log(oRSSHistoryItem);
      }
    }
    if (bMatched) {
      this._oGlobalDispatcher.publish('new_reco', {'reco_item': oRSSHistoryItem});
    }
  }

});