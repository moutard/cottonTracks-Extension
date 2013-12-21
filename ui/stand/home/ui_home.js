'use strict';

Cotton.UI.Stand.Home.UIHome = Class.extend({

  init : function(oGlobalDispatcher) {
    this._$home = $('<div class="ct-home"></div>');
    this._oIgniter = new Cotton.UI.Stand.Home.Igniter.UIIgniter(oGlobalDispatcher);
    this._oLibrary = new Cotton.UI.Stand.Home.Library.UILibrary(oGlobalDispatcher);
    this._$home.append(this._oIgniter.$(), this._oLibrary.$());
  },

  $ : function() {
    return this._$home;
  },

  removeCheesecake : function(iId) {
    this._oLibrary.removeCheesecake(iId);
  },

  purge : function() {
    this._oIgniter.purge();
    this._oIgniter = null;
    this._oLibrary.purge();
    this._oLibrary = null;
    this._$home.remove();
    this._$home = null;
  }

});