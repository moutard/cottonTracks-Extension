'use strict';

Cotton.DB.Translator = Class.extend({

  init : function(sFormatVersion, mObjectToDbRecordConverter,
      mDbRecordToObjectConverter, dOptionalIndexDescriptions, mMergeDBrecords) {
    this._sFormatVersion = sFormatVersion;
    this._mObjectToDbRecordConverter = mObjectToDbRecordConverter;
    this._mDbRecordToObjectConverter = mDbRecordToObjectConverter;
    // TODO(rmoutard) : "Why it's not a {} ?"
    this._dIndexDescriptions = dOptionalIndexDescriptions || [];
    this._mMergeDBRecords = mMergeDBrecords;
  },

  objectToDbRecord : function(oObject) {
    var dDbRecord = this._mObjectToDbRecordConverter.call(this, oObject);
    dDbRecord['sFormatVersion'] = this._sFormatVersion;
    return dDbRecord;
  },
  dbRecordToObject : function(oDbRecord) {
    if (oDbRecord['sFormatVersion'] != this._sFormatVersion) {
      throw "Version mismatch."
    }
    return this._mDbRecordToObjectConverter.call(this, oDbRecord);
  },
  formatVersion : function() {
    return this._sFormatVersion;
  },
  indexDescriptions : function() {
    return this._dIndexDescriptions;
  },
  mergeDBRecords : function () {
    return this._mMergeDBRecords;
  },

});
