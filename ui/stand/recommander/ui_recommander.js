"use strict";

Cotton.UI.Stand.Recommander.UIRecommander = Class.extend({

  init : function(oGlobalDispatcher) {
    this._oGlobalDispatcher = oGlobalDispatcher;
    this._$recommander = $('<div class="ct-stand ct-recommander"></div>');
    this._$recoholder = $('<div class="ct-shelves_container"></div>');

    this._lRecoCards = [];

    this._$recommander.append(this._$recoholder);

    this._oGlobalDispatcher.subscribe('new_reco', this, function(dArguments){
      this.drawRecoCard(dArguments['reco_item']);
    });
  },

  $ : function() {
    return this._$recommander;
  },

  drawRecoCard : function(oRecoItem) {
    var oRecoCard = new Cotton.UI.Stand.Recommander.RecoCard(oRecoItem);
    this._lRecoCards.push(oRecoCard);
    this._$recoholder.append(oRecoCard.$());
  },

  purge : function() {
    this._$recommander = null;
  }
});