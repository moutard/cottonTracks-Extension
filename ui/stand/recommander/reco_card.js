"use strict";

Cotton.UI.Stand.Recommander.RecoCard = Class.extend({

  /**
   * @param: oRecoItem, a Cotton.Model.HistoryItem
   *         with additional properties
   */
  init : function(oRecoItem) {
    this._$recocard = $('<div class="ct-reco_card"></div>');
    this._oIllustration = new Cotton.UI.Stand.Recommander.Content.Illustration(oRecoItem);
    if (oRecoItem.extractedDNA().imageUrl()) {
      this._$recocard.addClass('ct-with_image');
      this._oIllustration.setImage(oRecoItem.extractedDNA().imageUrl());
    }

    this._oDescription = new Cotton.UI.Stand.Recommander.Content.Description(oRecoItem);

    this._oOrigin = new Cotton.UI.Stand.Recommander.Content.Origin(oRecoItem._iStoryId, oRecoItem._sStoryTitle);

    this._$recocard.append(this._oIllustration.$(), this._oDescription.$(), this._oOrigin.$());
  },

  $ : function() {
    return this._$recocard;
  },

  purge : function() {
    this._oIllustration.purge();
    this._oIllustration = null;
    this._oDescription.purge();
    this._oDescription = null;
    this._oOrigin.purge();
    this._oOrigin = null;
    this._$recocard.remove();
    this._$recocard = null;
  }
});