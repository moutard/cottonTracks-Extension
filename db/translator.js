'use strict';

Cotton.DB.Translator = function(sFormatVersion, mObjectToDbRecordConverter, mDbRecordToObjectConverter) {
  this._sFormatVersion = sFormatVersion;
  this._mObjectToDbRecordConverter = mObjectToDbRecordConverter;
  this._mDbRecordToObjectConverter = mDbRecordToObjectConverter;
};

$.extend(Cotton.DB.Translator.prototype, {
  objectToDbRecord: function(oObject) {
    var dDbRecord = this._mObjectToDbRecordConverter.call(this, oObject);
    dDbRecord.sFormatVersion = this._sFormatVersion;
    return dDbRecord;
  },
  dbRecordToObject: function(oDbRecord) {
    if (oDbRecord.sFormatVersion != this._sFormatVersion) {
      throw "Version mismatch."
    }
    return this._mDbRecordToObjectConverter.call(this, oDbRecord);
  },
  formatVersion: function() {
    return this._sFormatVersion;
  }
});
