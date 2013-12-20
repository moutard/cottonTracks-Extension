'use strict';

Cotton.UI.Stand.Home.Igniter.UIIgniter = Class.extend({

  init : function(oGlobalDispatcher) {
    this._$igniter = $('<div class="ct-igniter"></div>');
    this._$igniter_container = $('<div class="ct-igniter_container"></div>');
    this._oCreator = new Cotton.UI.Stand.Home.Igniter.Creator.UICreator(oGlobalDispatcher);
    this._$igniter.append(
      this._$igniter_container.append(
        this._oCreator.$()
      )
    );
  },

  $ : function() {
    return this._$igniter;
  },

  purge : function() {
    this._oCreator.purge();
    this._oCreator = null;
    this._$igniter.remove();
    this._$igniter = null;
  }
});