'use strict';

Cotton.UI.Stand.Home.Igniter.UIIgniter = Class.extend({

  init : function(oGlobalDispatcher) {
    this._oGlobalDispatcher = oGlobalDispatcher;
    this._$igniter = $('<div class="ct-igniter"></div>');
    this._$igniter_container = $('<div class="ct-igniter_container"></div>');
    this._oCreator = new Cotton.UI.Stand.Home.Igniter.Creator.UICreator(oGlobalDispatcher);
  },

  $ : function() {
    return this._$igniter;
  },

  appendCreator : function() {
    this._$igniter.append(
      this._$igniter_container.append(
        this._oCreator.$()
      )
    );
  },

  welcome : function() {
    this._$welcome = $('<div class="ct-igniter_welcome">Welcome to your new bookmark system</div>');
    this._$explainer = $('<div class="ct-igniter_explainer">'
      + 'Thank you for installing cottonTracks. We are providing you with'
      + '</br>a smart and automated bookmark deck creator. And the best of it?'
      + '</br>Everything is stored on your computer. No cloud service here.'
      + '</div>');

    this._$igniter_container.prepend(
      this._$welcome,
      this._$explainer
    );

    this._oCreator.$().addClass('ct-welcome');
    this._$igniter.addClass('ct-welcome');
  },

  suggest : function(lStories) {
    this._lSuggestions = [];
    this._$suggestions = $('<div class="ct-suggested_themes"></div>');
    this._$try_these = $('<div class="ct-try_these">or try one of these subjects</div>');
    this._$suggestions.append(
      this._$try_these
    )
    var iLength = lStories.slice(0,2).length;
    for (var i = 0; i < iLength; i++) {
      var oSuggestedTheme = new Cotton.UI.Stand.Home.Common.ThemeSuggestion(lStories[i], this._oGlobalDispatcher);
      this._lSuggestions.push(oSuggestedTheme);
      this._$suggestions.append(oSuggestedTheme.$());
    }
    this._$igniter_container.append(
      this._$suggestions
    );
  },

  _purgeSuggestions : function() {
    var iLength = this._lSuggestions.length;
    for (var i = 0; i < iLength; i++) {
      this._lSuggestions[i] = null;
    }
    this._lSuggestions = null;
    this._$try_these.remove();
    this._$try_these = null;
    this._$suggestions.remove();
    this._$suggestions = null;
  },

  purge : function() {
    this._oGlobalDispatcher = null;
    this._oCreator.purge();
    this._oCreator = null;
    if (this._$suggestions) {
      this._purgeSuggestions();
    } else {
      this._$welcome.remove();
      this._$welcome = null;
      this._$explainer.remove();
      this._$explainer = null;
    }
    this._$igniter_container.remove();
    this._$igniter_container = null;
    this._$igniter.remove();
    this._$igniter = null;
  }
});