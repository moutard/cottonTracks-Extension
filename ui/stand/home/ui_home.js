'use strict';

Cotton.UI.Stand.Home.UIHome = Class.extend({

  init : function(oGlobalDispatcher) {
    this._oGlobalDispatcher = oGlobalDispatcher;

    this._$home = $('<div class="ct-home"></div>');
    this._oIgniter = new Cotton.UI.Stand.Home.Igniter.UIIgniter(oGlobalDispatcher);
    this._oLibrary = new Cotton.UI.Stand.Home.Library.UILibrary(oGlobalDispatcher);

    this._$home.append(this._oIgniter.$(), this._oLibrary.$());

    this._oGlobalDispatcher.publish('start_homescreen');

    var MAX_THEMES = 18;

    this._oGlobalDispatcher.subscribe('fill_homescreen', this, function(dArguments){
      this._lStories = dArguments['stories'];
      this._lCheesecakes = dArguments['cheesecakes'];
      if (dArguments['cheesecakes'].length > 0) {
        this._oLibrary.drawCheesecakes(dArguments['cheesecakes']);
        this._oIgniter.appendCreator();
        this._oIgniter.suggest(dArguments['stories']);
      } else {
        this._oSuggestor = new Cotton.UI.Stand.Home.ThemeSuggestor.UIThemeSuggestor(oGlobalDispatcher);
        this._$home.append(this._oSuggestor.$());
        this._oSuggestor.drawSuggestions(dArguments['stories'].slice(0, MAX_THEMES), true);
        this._oIgniter.welcome();
        this._oIgniter.appendCreator();
      }
    });

    this._oGlobalDispatcher.subscribe('show_more_suggested_themes', this, function(dArguments){
      this._oSuggestor = new Cotton.UI.Stand.Home.ThemeSuggestor.UIThemeSuggestor(oGlobalDispatcher);
      this._oSuggestor.drawSuggestions(this._lStories.slice(2, this._lStories.length), false);
      this._oIgniter.$().after(this._oSuggestor.$());
    });

    this._oGlobalDispatcher.subscribe('hide_more_suggested_themes', this, function(dArguments){
      this._oSuggestor.purge();
      this._oSuggestor = null;
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
    this._oGlobalDispatcher.unsubscribe('show_more_suggested_themes', this);
    this._oGlobalDispatcher.unsubscribe('hide_more_suggested_themes', this);
    this._oGlobalDispatcher = null;
    this._oIgniter.purge();
    this._oIgniter = null;
    this._oLibrary.purge();
    this._oLibrary = null;
    this._$home.remove();
    this._$home = null;
  }

});