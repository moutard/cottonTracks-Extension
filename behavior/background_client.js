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

  _bStoryImageUpdated : null,
  _oMessenger : null,

  /**
   *
   */
  init : function(oMessenger) {
    this._iId = "";
    this._oCurrentHistoryItem = new Cotton.Model.HistoryItem();
    this._bStoryImageUpdated = false;
    this._oMessenger = oMessenger;
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
   * used for the current page through createVisitItem,
   * or standalone for videos for example
   */
  createHistoryItem : function(oItem, mCallback) {
    var self = this;

    var lTranslators = Cotton.Translators.HISTORY_ITEM_TRANSLATORS;
    var oTranslator = lTranslators[lTranslators.length - 1];
    var dDbRecord = oTranslator.objectToDbRecord(oItem);

    this._oMessenger.sendMessage({
      'action' : 'create_history_item',
      'params' : {
        'historyItem' : dDbRecord
      }
    }, function(response) {
      if (response) {
        if (response['ghost']) {
          self._bGhost = true;
        } else if (response['status'] == "not started") {
          // the database is not ready yet, retry.
          self.createVisit();
        } else {
          oItem.initId(response['id']);
          oItem.setStoryId(response['storyId']);
          DEBUG && console.debug('DBSync create history item', {
            'item': oItem, 'response': response
          });
          if(typeof mCallback === 'function'){
            mCallback.call(this, response);
          }
        }
      }
    });
  },

  /**
   * Create a visit item for the current page
   * separate from createHistoryItem because createHistoryItem can be used
   * standalone just to create a historyItem for the iframes clicked (videos)
   */
  createVisit : function() {
    var self = this;
      self.createHistoryItem(self.current(), function(response) {
        self._iId = response['id'];
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

    // in the content_scripts it's always the last version of the model.
    var lTranslators = Cotton.Translators.HISTORY_ITEM_TRANSLATORS;
    var oTranslator = lTranslators[lTranslators.length - 1];
    var dDbRecord = oTranslator.objectToDbRecord(self._oCurrentHistoryItem);

    if (self._oCurrentHistoryItem.id() === undefined) {
      DEBUG && console.debug("can't update id is not set.");
      if (self._bGhost){
        // the page was loaded in the background in a "hidden tab" (chrome prerendering)
        // we did not listen to it, because chrome doesn't recognise messaging to tabs
        // with id -1, plus we don't want a historyItem that wasn't actually visited.
        // However, when the ghost page is actually visited, we don't want to reload it
        // so we create a new visit.
        //TODO(rkorach) use chrome.tabs.replace api that handles this particular event.
        self.createVisit();
      }
    } else {
      this._oMessenger.sendMessage({
        'action' : 'update_history_item',
        'params' : {
          'historyItem' : dDbRecord,
        }
      }, function(response) {
        // DEPRECATED - update_history_item do not respond.
      });
    }

  }

});

// According to Chrome API, the object oCurrentHistoryItem will be serialized.

// CHROME TABS API
//
// chrome.tabs.getCurrent(function(oTab){DEBUG && console.debug(oTab);})
// can't be used outside the extension context. But could b very usefull.
