"use strict";

Cotton.UI.Stand.Home.Common.ThemeSuggestion = Class.extend({

  init : function(oStory, oGlobalDispatcher) {
    var self = this;
    this._$theme_suggestion = $('<div class="ct-theme_suggestion"></div>');
    this._oImage = new Cotton.UI.Stand.Common.Content.BImage();
    this._oImage.appendImage(oStory.featuredImage());
    this._$title = $('<div class="ct-theme_suggestion_title"></div>').text(oStory.title());

    this._$theme_suggestion.click(function(e) {
      if (e.target !== self._$delete[0]) {
        var sMedium = ($(this).parent('.ct-suggested_themes').length > 0) ? 'top_two_suggestions' : 'all_suggestions';
        Cotton.ANALYTICS.createDeck(sMedium);
        oGlobalDispatcher.publish('create_suggested_cheesecake', {
          'title': oStory.title()
        });
      }
    });

    this._$delete = $('<div class="ct-delete_suggestion">+</div>').click(function(){
      Cotton.ANALYTICS.deleteSuggestion();
      oGlobalDispatcher.publish('delete_theme_suggestion', {
        'story_id': oStory.id(),
      });
    });

    this._$theme_suggestion.append(
      this._oImage.$(),
      this._$title,
      this._$delete
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