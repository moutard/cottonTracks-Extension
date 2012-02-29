'use strict';

Cotton.DB.Translator = function(sObjectType, sFormatVersion, mObjectToDbRecordConverter, mDbRecordToObjectConverter) {
  this._sObjectType = sObjectType;
  this._sFormatVersion = sFormatVersion;
  this._mObjectToDbRecordConverter = mObjectToDbRecordConverter;
  this._mDbRecordToObjectConverter = mDbRecordToObjectConverter;
};

$.extend(Cotton.DB.Translator.prototype, {
  objectToDbRecord: function(oObject) {
    this._mObjectToDbRecordConverter.call(oObject);
  },
  dbRecordToObject: function(oDbRecord) {
    this._mDbRecordToObjectConverter.call(oDbRecord);
  }
});
