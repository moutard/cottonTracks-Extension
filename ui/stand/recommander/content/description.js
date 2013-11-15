"use strict";

Cotton.UI.Stand.Recommander.Content.Description = Class.extend({

  init : function(oRecoItem) {
    this._$description = $('<div class="ct-reco_description"></div>');
    this._$title = $('<a class="ct-reco_title" href="' + oRecoItem.url() +'" target="_blank"></a>').text(oRecoItem.title());
    this._$paragraph = $('<div class="ct-reco_text"></div>').html(oRecoItem._sDescription);

    this._$description.append(this._$title, this._$paragraph);
  },

  $ : function() {
    return this._$description;
  }
});