'use strict';

/**
 * @class : BackgroundClient
 *
 * Client to communicate between the content_scripts and the background page.
 * BackgroundClient is loaded in content_scripts so options are limited.
 */

Cotton.Behavior.BackgroundClient = Class.extend({

  /**
   * Id of the current History item in the database.
   */
  _iId : undefined,

  /**
   * Cotton.Model.HistoryItem, stores results of the parser and reading_rater.
   */
  _oCurrentHistoryItem : undefined,

  _bParagraphSet : null,
  _bImageSet : null,
  _lAllParagraphs : null,
  _sImageUrl : null,
  _bStoryImageUpdated : null,

  /**
   *
   */
  init : function() {
    this._iId = "";
    this._oCurrentHistoryItem = new Cotton.Model.HistoryItem();
    this._bParagraphSet = false;
    this._bImageSet = false;
    this._lAllParagraphs = [];
    this._sImageUrl = "";
    this._bStoryImageUpdated = false;

  },

  /**
   * return the current historyItem
   *
   * @returns {Cotton.Model.HistoryItem}
   */
  current : function() {
    return this._oCurrentHistoryItem;
  },

  /**
   * Use chrome messaging API, to send a message to the background page, that
   * will put the passed historyItem into the database.
   */
  createHistoryItem : function(oItem, mCallback) {
    var self = this;

    var lTranslators = Cotton.Translators.HISTORY_ITEM_TRANSLATORS;
    var oTranslator = lTranslators[lTranslators.length - 1];
    var dDbRecord = oTranslator.objectToDbRecord(oItem);

   chrome.runtime.sendMessage({
      'action' : 'create_history_item',
      'params' : {
        'historyItem' : dDbRecord
      }
    }, function(response) {
      if (response['ghost']){
        self._bGhost = true;
        return;
      }
      oItem.initId(response['id']);
      oItem.setStoryId(response['storyId']);
      DEBUG && console.debug('DBSync create history item', {
        'item': oItem, 'response': response
      });
      if(typeof mCallback === 'function'){
        mCallback.call(this, response);
      }
    });
  },

  /**
   * Create a visit item
   */
  createVisit : function() {
    var self = this;
    self.createHistoryItem(self.current(), function(response) {
      self._oCurrentHistoryItem.setVisitCount(response['visitCount']);
      self._oCurrentHistoryItem.extractedDNA().bagOfWords().setBag(response['bagOfWords']);
      self._iId = response['id'];
      self.updateVisit();
    });
  },

  /**
   * Use chrome messaging API, to send a message to the background page, that
   * will put the current historyItem is the database.
   *
   * For the moment, it's exaclty the same that create visit.
   */
  updateVisit : function() {
    var self = this;

    // Place here the code to only store the most read paragraph.
    var lParagraphs = self._oCurrentHistoryItem.extractedDNA().paragraphs();
    lParagraphs = _.filter(lParagraphs, function(oParagraph) {
      return (oParagraph.percent() > Cotton.Config.Parameters.minPercentageForBestParagraph);
    });
    self._oCurrentHistoryItem.extractedDNA().setParagraphs(lParagraphs);

    // in the content_scitps it's always the last version of the model.
    var lTranslators = Cotton.Translators.HISTORY_ITEM_TRANSLATORS;
    var oTranslator = lTranslators[lTranslators.length - 1];
    var dDbRecord = oTranslator.objectToDbRecord(self._oCurrentHistoryItem);

    if (self._oCurrentHistoryItem.id() === undefined) {
      DEBUG && console.debug("can't update id is not set.");
      if (self._bGhost){
        self.createVisit();
      }
    } else {
      chrome.runtime.sendMessage({
        'action' : 'update_history_item',
        'params' : {
          'historyItem' : dDbRecord,
          'contentSet' : self._bParagraphSet && self._bImageSet && !self._bStoryImageUpdated,
        }
      }, function(response) {
        // DEPRECATED - update_history_item do not respond.
        DEBUG && console.debug("dbSync update visit - response :");
        DEBUG && console.debug(response);
        self._bStoryImageUpdated = true;
      });
    }

  },

  setParagraph : function(lAllParagraphs) {
    this._bParagraphSet = true;
    this._lAllParagraphs = lAllParagraphs;
  },

  setImage : function(sImageUrl) {
    this._bImageSet = true;
    this._sImageUrl = sImageUrl;
  },
});

// According to Chrome API, the object oCurrentHistoryItem will be serialized.

// CHROME TABS API
//
// chrome.tabs.getCurrent(function(oTab){DEBUG && console.debug(oTab);})
// can't be used outside the extension context. But could b very usefull.
