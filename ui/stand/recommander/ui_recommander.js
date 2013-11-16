"use strict";

Cotton.UI.Stand.Recommander.UIRecommander = Class.extend({

  init : function(oGlobalDispatcher) {
    this._oGlobalDispatcher = oGlobalDispatcher;
    this._$recommander = $('<div class="ct-stand ct-recommander"></div>');
    this._$recoholder = $('<div class="ct-shelves_container"></div>');

    this._lRecoCards = [];

    this._$recommander.append(this._$recoholder);

    this._oGlobalDispatcher.subscribe('new_reco', this, function(dArguments){
      this.drawRecoCard(dArguments['reco_item'], dArguments['matching_story']);
    });
  },

  $ : function() {
    return this._$recommander;
  },

  drawRecoCard : function(oRecoItem, oMatchingStory) {
    var oRecoCard = new Cotton.UI.Stand.Recommander.RecoCard(oRecoItem, oMatchingStory, this._oGlobalDispatcher);
    this._lRecoCards.push(oRecoCard);
    this._$recoholder.append(oRecoCard.$());
  },

  purgeRecoCards : function() {
    var iLength = this._lRecoCards.length;
    for (var i = 0; i < iLength; i++) {
      this._lRecoCards[i].purge();
      this._lRecoCards[i] = null;
    }
    this._lRecoCards = null;
  },

  purge : function() {
    this._$recoholder.remove();
    this._$recoholder = null;
    this._$recommander.remove();
    this._$recommander = null;
    this.purgeRecoCards();
    this._oGlobalDispatcher.unsubscribe('new_reco', this);
    this._oGlobalDispatcher = null;
  }
});