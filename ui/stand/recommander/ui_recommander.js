"use strict";

Cotton.UI.Stand.Recommander.UIRecommander = Class.extend({

  init : function(lRecoItems) {
    this._$recommander = $('<div class="ct-stand ct-recommander"></div>');
    this._$recoholder = $('<div class="ct-shelves_container"></div>');

    this._lRecoCards = [];

    this.drawRecoCards(lRecoItems);

    this._$recommander.append(this._$recoholder);
  },

  $ : function() {
    return this._$recommander;
  },

  drawRecoCards : function(lRecoItems) {
    var iLength = lRecoItems.length;
    for (var i = 0; i < iLength; i++) {
      var oRecoCard = new Cotton.UI.Stand.Recommander.RecoCard(lRecoItems[i]);
      this._lRecoCards.push(oRecoCard);
      this._$recoholder.append(oRecoCard.$());
    }
  },

  purge : function() {
    this._$recommander = null;
  }
});