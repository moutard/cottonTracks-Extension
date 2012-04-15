'use strict'

Cotton.Model.Tools = function() {
  this._sId; // visitId.
  this._sTitle;
  this._sHostname;

  // Satistiques
  this._fFrequency;
};

$.extend(Cotton.Model.VisitItem.prototype, {
  // GETTER
  // can't be set
  id : function() {
    return this._sId;
  },
  title : function() {
    return this._sTitle;
  },
  hostname : function() {
    return this._sHostname;
  },
  frequency : function() {
    return this._iFrequency;
  },

});
