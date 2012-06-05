'use strict';
// DB_SYNC.
// Each time a new tab is opened, a visitItem is created. Then send to the
// content_script_listener. That will put it in the database.
Cotton.Behavior.Passive.DbSync = Class.extend({

  init : function(){
    this._iId = "";
    this._oCurrentVisitItem = new Cotton.Model.VisitItem();
  },

  start : function(){
    this._oCurrentVisitItem.getInfoFromPage();
  },

  current : function(){
    return this._oCurrentVisitItem;
  },

  // For the moment create and update are exactly the same
  createVisit : function(){
    var self = this;
    chrome.extension.sendRequest({
      action: 'create_visit_item',
      params: {
        visitItem: this._oCurrentVisitItem
      }
    }, function(response) {
      console.log(response);
      self._iId = response.id;
      self._oCurrentVisitItem._sId = response.id;
      //console.log(this._oCurrentVisitItem);
    });

  },

  updateVisit : function(){
    var self = this;
    chrome.extension.sendRequest({
      action: 'create_visit_item',
      params: {
        visitItem: this._oCurrentVisitItem
      }
    }, function(response) {
      console.log(response);
      self._oCurrentVisitItem._sId = response.id;
      console.log(self._oCurrentVisitItem);
    });

  },



});

var oCurrentVisitItem = new Cotton.Model.VisitItem();
var sync = new Cotton.Behavior.Passive.DbSync();

$(document).ready(function() {
  // Need to wait the document is ready to get the title.

  /*
   * oCurrentVisitItem.getInfoFromPage();

  chrome.extension.sendRequest({
    action: 'create_visit_item',
    params: {
      visitItem: oCurrentVisitItem
    }
  }, function(response) {
    console.log(response);
    oCurrentVisitItem._sId = response.id;
    console.log(oCurrentVisitItem);
  });
  */
  sync.start();
  new Cotton.Behavior.Active.ReadingRater();

});


// According to Chrome API, the object oCurrentHistoryItem will
// be serialized.


// CHROME TABS API
//
// chrome.tabs.getCurrent(function(oTab){console.log(oTab);})
// can't be used outside the extension context. But could b very usefull.
