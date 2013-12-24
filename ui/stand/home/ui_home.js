'use strict';

Cotton.UI.Stand.Home.UIHome = Class.extend({

  init : function(oGlobalDispatcher) {
    this._oGlobalDispatcher = oGlobalDispatcher;

    this._$home = $('<div class="ct-home ct-welcome"></div>');
    this._oIgniter = new Cotton.UI.Stand.Home.Igniter.UIIgniter(oGlobalDispatcher);
    this._oLibrary = new Cotton.UI.Stand.Home.Library.UILibrary(oGlobalDispatcher);

    this._$home.append(this._oIgniter.$(), this._oLibrary.$());

    this._oGlobalDispatcher.publish('start_homescreen');

    var MAX_THEMES = 18;

    this._oGlobalDispatcher.subscribe('fill_homescreen', this, function(dArguments){
      if (dArguments['cheesecakes'].length > 0) {
        this._$home.removeClass("ct-welcome");
        this._oLibrary.drawCheesecakes(dArguments['cheesecakes']);
        this._oIgniter.appendCreator();
        this._oIgniter.suggest(dArguments['stories']);
      } else {
        this._oLibrary.drawSuggestions(dArguments['stories'].slice(0, MAX_THEMES));
        this._oIgniter.welcome();
        this._oIgniter.appendCreator();
      }
    });

  },

  $ : function() {
    return this._$home;
  },

  removeCheesecake : function(iId) {
    this._oLibrary.removeCheesecake(iId);
  },

  purge : function() {
    this._oGlobalDispatcher.unsubscribe('fill_homescreen', this);
    this._oGlobalDispatcher = null;
    this._oIgniter.purge();
    this._oIgniter = null;
    this._oLibrary.purge();
    this._oLibrary = null;
    this._$home.remove();
    this._$home = null;
  }

});