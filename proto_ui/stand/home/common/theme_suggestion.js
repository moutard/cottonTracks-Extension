"use strict";

Cotton.UI.Stand.Home.Common.ThemeSuggestion = Class.extend({

  init : function(oStory, oGlobalDispatcher) {
    this._$theme_suggestion = $('<div class="ct-theme_suggestion"></div>');
    this._oImage = new Cotton.UI.Stand.Common.Content.BImage();
    this._oImage.appendImage(oStory.featuredImage());
    this._$title = $('<div class="ct-theme_suggestion_title"></div>').text(oStory.title());

    this._$theme_suggestion.click(function() {
      oGlobalDispatcher.publish('create_suggested_cheesecake', {
        'title': oStory.title()
      });
    });

    this._$theme_suggestion.append(
      this._oImage.$(),
      this._$title
    );
  },

  $ : function() {
    return this._$theme_suggestion;
  },

  purge : function() {
    this._$title.remove();
    this._$title = null;
    this._oImage.purge();
    this._oImage = null;
    this._$theme_suggestion.remove();
    this._$theme_suggestion = null;
  }
});