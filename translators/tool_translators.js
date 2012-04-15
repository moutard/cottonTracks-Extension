'use strict';

Cotton.Translators.TOOL_TRANSLATORS = [];

// Translator for version 0.1.
(function() {

  var mObjectToDbRecordConverter = function(oTool) {

    var dDbRecord = {
      // id : id is auto-incremented. Becareful do not confuse with
      // clusterId, that is a temporary id attribute by DBSCAN to a new
      // story.
      sTitle : oTool.title(),
      sHostname : oTool.hostname(),
      fFrequency : oTool.frequency(),
    };
    var iId = oTool.id() || null;
    if (iId) {
      dDbRecord.id = iId;
    }
    return dDbRecord;
  };

  var mDbRecordToObjectConverter = function(oDbRecord) {

    var oTool = new Cotton.Model.Tool();

    oTool._sId = oDbRecord._sId;
    oTool._sTitle = oDbRecord._sTitle;
    oTool._sHostname = oDbRecord._sHostname;

    if (oDbRecord.fRelevance !== undefined) {
      oTool.setFrequency(oDbRecord.fFrequency);
    }
    return oTool;
  };

  // The dictionary of all index descriptions.
  /*
   * E.g. if we wanted to have a non-unique index on relevance: var dIndexes = {
   * fRelevance: { unique: false } };
   */
  var dIndexes = {
    // TODO(fwouts) : id should be index automatically !
    id : {
      unique : true
    },
    name : {
      unique : true
    },
  };

  var oTranslator = new Cotton.DB.Translator('0.1', mObjectToDbRecordConverter,
      mDbRecordToObjectConverter, dIndexes);
  Cotton.Translators.TOOL_TRANSLATORS.push(oTranslator);

})();
