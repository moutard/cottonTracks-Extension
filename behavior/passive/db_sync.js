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
  _oCurrentVisitItem : undefined,

  _bParagraphSet : null,
  _bImageSet : null,
  _lAllParagraphs : null,

  /**
   * @constructor
   */
  init : function() {
    this._iId = "";
    this._oCurrentVisitItem = new Cotton.Model.VisitItem();
    this._bParagraphSet = false;
    this._bImageSet = false;
    this._lAllParagraphs = [];
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
	  if (response['existing'] === "true"){
		//The visitItem url was already in base, init this one with the one in base
		var lTranslators = Cotton.Translators.VISIT_ITEM_TRANSLATORS;
	    var oTranslator = lTranslators[lTranslators.length - 1];
	    self._oCurrentVisitItem = oTranslator.dbRecordToObject(
	                                                response['visitItem']
	                                                  );
	    //careful not to erase paragraphs from parser with paragraphs from db
	    self._oCurrentVisitItem.extractedDNA().setAllParagraphs(self._lAllParagraphs);
	  } else {
		//The visitItem url was not in base, init this one with the new id created
        DEBUG && console.debug('DBSync create visit - response :')
        DEBUG && console.debug(response);
        self._oCurrentVisitItem.initId(response['id']);
      }
      self._iId = response['id'];
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

    // Place here the code to only store the most read paragraph.
    var lParagraphs = self._oCurrentVisitItem.extractedDNA().paragraphs();
    lParagraphs = _.sortBy(lParagraphs, function(oParagraph) {
      return -1 * oParagraph.percent();
    });
    lParagraphs = lParagraphs.slice(0, 2);
    self._oCurrentVisitItem.extractedDNA().setParagraphs(lParagraphs);

    // in the content_scitps it's always the last version of the model.
    var lTranslators = Cotton.Translators.VISIT_ITEM_TRANSLATORS;
    var oTranslator = lTranslators[lTranslators.length - 1];
    var dDbRecord = oTranslator.objectToDbRecord(self._oCurrentVisitItem);

    if (self._oCurrentVisitItem.id() === undefined) {
      DEBUG && console.debug("can't update id is not set.");
    } else {
      chrome.extension.sendMessage({
        'action' : 'update_visit_item',
        'params' : {
          'visitItem' : dDbRecord,
          'contentSet' : self._bParagraphSet
        }
      }, function(response) {
        // DEPRECATED - update_visit_item do not respond.
        DEBUG && console.debug("dbSync update visit - response :");
        DEBUG && console.debug(response);
		if (response["updated"] == "true") {
		  chrome.extension.sendMessage({
	          'action' : 'get_content',
	      });
        }
      });
    }

  },

  setParagraph : function(lAllParagraphs) {
    this._bParagraphSet = true;
    this._lAllParagraphs = lAllParagraphs;
  },

});

// According to Chrome API, the object oCurrentHistoryItem will be serialized.

// CHROME TABS API
//
// chrome.tabs.getCurrent(function(oTab){console.log(oTab);})
// can't be used outside the extension context. But could b very usefull.
