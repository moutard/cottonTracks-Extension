'use strict';

/**
 * @class : DbSync
 * 
 * handles tabs openning. Each time a new tab is opened, a visitItem is created
 * Then send to the content_script_listener. That will put it in the database.
 * 
 * Because DbSync is in a content script, their options are limited.
 */

Cotton.Behavior.Passive.DbSync = Class.extend({

  /**
   * Id of the current Visit item in the database.
   */
  _iId : undefined,

  /**
   * Cotton.Model.VisitItem, stores results of the parser and reading_rater.
   */
  _oCurrentvisitItem : undefined,

  /**
   * @constructor
   */
  init : function() {
    this._iId = "";
    this._oCurrentVisitItem = new Cotton.Model.VisitItem();
  },

  /**
   * Start when the document is ready, to get title, and first information.
   */
  start : function() {
    this._oCurrentVisitItem.getInfoFromPage();
    this.createVisit();
  },

  /**
   * return the current visitItem
   * 
   * @returns {Cotton.Model.VisitItem}
   */
  current : function() {
    return this._oCurrentVisitItem;
  },

  /**
   * Use chrome messaging API, to send a message to the background page, that
   * will put the current visitItem is the database.
   */
  createVisit : function() {
    var self = this;

    // We don't want chrome make the serialization. So we use translators to
    // make it.
    var lTranslators = Cotton.Translators.VISIT_ITEM_TRANSLATORS;
    var oTranslator = lTranslators[lTranslators.length - 1];
    var dDbRecord = oTranslator.objectToDbRecord(self._oCurrentVisitItem);

    chrome.extension.sendMessage({
      'action' : 'create_visit_item',
      'params' : {
        'visitItem' : dDbRecord
      }
    }, function(response) {
      console.log(response);
      self._iId = response['id'];
      self._oCurrentVisitItem.initId(response['id']);
      console.log("dbSync create visit");
      console.log(self._oCurrentVisitItem);
    });

  },

  /**
   * Use chrome messaging API, to send a message to the background page, that
   * will put the current visitItem is the database.
   * 
   * For the moment, it's exaclty the same that create visit.
   */
  updateVisit : function() {
    var self = this;

    // in the content_scitps it's always the last version of the model.
    var lTranslators = Cotton.Translators.VISIT_ITEM_TRANSLATORS;
    var oTranslator = lTranslators[lTranslators.length - 1];
    var dDbRecord = oTranslator.objectToDbRecord(self._oCurrentVisitItem);

    if (self._oCurrentVisitItem.id() === undefined) {
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

// According to Chrome API, the object oCurrentHistoryItem will be serialized.

// CHROME TABS API
//
// chrome.tabs.getCurrent(function(oTab){console.log(oTab);})
// can't be used outside the extension context. But could b very usefull.
