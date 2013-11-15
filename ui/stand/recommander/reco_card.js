"use strict";

Cotton.UI.Stand.Recommander.RecoCard = Class.extend({

  /**
   * @param: oRecoItem, a Cotton.Model.HistoryItem
   *         with additional properties
   */
  init : function(oRecoItem) {
    this._$recocard = $('<div class="ct-reco_card"></div>');
    this._oIllustration = new Cotton.UI.Stand.Recommander.Content.Illustration(oRecoItem);

    this._oDescription = new Cotton.UI.Stand.Recommander.Content.Description(oRecoItem);

    this._oOrigin = new Cotton.UI.Stand.Recommander.Content.Origin(oRecoItem._iStoryId, oRecoItem._sStoryTitle);

    this._$recocard.append(this._oIllustration.$(), this._oDescription.$(), this._oOrigin.$());
  },

  $ : function() {
    return this._$recocard;
  }
});