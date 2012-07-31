'use strict';

/**
 * DbSync
 *
 * handles tabs openning. Each time a new tab is opened, a visitItem is created
 * Then send to the content_script_listener. That will put it in the database.
 *
 * Because DbSync is in a content script, their options are limited.
 */

Cotton.Behavior.Passive.DbSync = Class.extend({

  _iId : undefined,
  _oCurrentvisitItem : undefined,

  init : function(){
    this._iId = "";
    this._oCurrentVisitItem = new Cotton.Model.VisitItem();
  },

  start : function(){
    this._oCurrentVisitItem.getInfoFromPage();
    this.createVisit();
  },

  current : function(){
    return this._oCurrentVisitItem;
  },

  // For the moment create and update are exactly the same
  createVisit : function(){
    var self = this;

    console.log("create visit");
    /**
     * sendRequest serialize the params. So we will put a dbRecord.
     */
    // TODO (rmoutard) sendRequest seems deprecated. now called sendMessage but not in the externs file yet.

    // in the content_scitps it's always the last version of the model.
    var lTranslators = Cotton.Translators.VISIT_ITEM_TRANSLATORS;
    var oTranslator = lTranslators[lTranslators.length - 1];
    var dDbRecord = oTranslator.objectToDbRecord(self._oCurrentVisitItem);

    chrome.extension.sendMessage({
      'action': 'create_visit_item',
      'params': {
        'visitItem': dDbRecord
      }
    }, function(response) {
      console.log(response);
      self._iId = response['id'];
      self._oCurrentVisitItem.initId(response['id']);
      console.log("dbSync create visit");
      console.log(self._oCurrentVisitItem);
    });

  },

  updateVisit : function(){
    var self = this;

      // in the content_scitps it's always the last version of the model.
    var lTranslators = Cotton.Translators.VISIT_ITEM_TRANSLATORS;
    var oTranslator = lTranslators[lTranslators.length - 1];
    var dDbRecord = oTranslator.objectToDbRecord(self._oCurrentVisitItem);

    if(self._oCurrentVisitItem.id() === undefined){
      console.log("can't update id is not set.");
      console.log(self._oCurrentVisitItem);
    } else {
      chrome.extension.sendMessage({
        'action' : 'create_visit_item',
        'params' : {
          'visitItem' : dDbRecord
        }
      }, function(response) {
        console.log("dbSync update visit");
        console.log(response);
        console.log(self._oCurrentVisitItem);
      });
    }

  },



});

var sync = new Cotton.Behavior.Passive.DbSync();

$(document).ready(function() {
  // Need to wait the document is ready to get the title.
  if(!chrome.extension.inIncognitoContext){
      sync.start();
    new Cotton.Behavior.Active.ReadingRater();
  }
});


// According to Chrome API, the object oCurrentHistoryItem will be serialized.

// CHROME TABS API
//
// chrome.tabs.getCurrent(function(oTab){console.log(oTab);})
// can't be used outside the extension context. But could b very usefull.
