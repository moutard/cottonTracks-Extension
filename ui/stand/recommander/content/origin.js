"use strict";

Cotton.UI.Stand.Recommander.Content.Origin = Class.extend({

  init : function(iStoryId, sStoryTitle) {
    this._$origin = $('<div class="ct-reco_origin"></div>');
    this._$text = $('<span class="ct-reco_story_text"></span>').text('Related to your story ');
    this._$story = $('<span class="ct-reco_story_hook"></span>').text(sStoryTitle);

    this._$origin.append(this._$text, this._$story);
  },

  $ : function(){
    return this._$origin;
  }
});