"use strict";

Cotton.UI.Stand.Recommander.Content.Illustration = Class.extend({

  init : function(oRecoItem) {
    this._oMedia = new Cotton.UI.Stand.Common.Content.BImage();
    this._$illustration = this._oMedia.$();
    this._oWebsite = new Cotton.UI.Stand.Story.Card.Content.Website(oRecoItem.url());

    this._$illustration.append(this._oWebsite.$());
  },

  $ : function() {
    return this._$illustration;
  },

  setImage : function(sImg) {
    this._oMedia.appendImage(sImg);
  }
});