'use strict';

Cotton.Translators.STORY_TRANSLATORS = [];

// Translator for version 0.1.
(function() {

  var mObjectToDbRecordConverter = function(oStory) {

    var dDbRecord = {
      // id : id is auto-incremented. Becareful do not confuse with
      // clusterId, that is a temporary id attribute by DBSCAN to a new
      // story.
      'lVisitItemsId' : oStory.visitItemsId(),
      'fLastVisitTime' : oStory.lastVisitTime(),
      'fRelevance' : oStory.relevance(),
      'sTitle' : oStory.title(),
    };
    var iId = oStory.id() || null;
    if (iId) {
      dDbRecord['id'] = iId;
    }
    return dDbRecord;
  };

  var mDbRecordToObjectConverter = function(oDbRecord) {

    var oStory = new Cotton.Model.Story();
    oStory.setId(oDbRecord.id);

    if (oDbRecord.fLastVisitTime !== undefined) {
      oStory.setLastVisitTime(oDbRecord.fLastVisitTime);
    }
    if (oDbRecord.fRelevance !== undefined) {
      oStory.setRelevance(oDbRecord.fRelevance);
    }
    oStory.setTitle(oDbRecord.sTitle);
    if (oDbRecord.lVisitItemsId !== undefined) {
      for ( var i = 0, iVisitItemId; iVisitItemId = oDbRecord.lVisitItemsId[i]; i++) {
        oStory.addVisitItemId(iVisitItemId);
      }
    }
    return oStory;
  };

  // The dictionary of all index descriptions.
  /*
   * E.g. if we wanted to have a non-unique index on relevance: var dIndexes = {
   * fRelevance: { unique: false } };
   */
  var dIndexes = {
    // TODO(fwouts) : id should be index automatically !
    'id' : {
      'unique' : true
    },
    'fLastVisitTime' : {
      'unique' : false
    },
  };

  var oTranslator = new Cotton.DB.Translator('0.1', mObjectToDbRecordConverter,
      mDbRecordToObjectConverter, dIndexes);
  Cotton.Translators.STORY_TRANSLATORS.push(oTranslator);

})();
