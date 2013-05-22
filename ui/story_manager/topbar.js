'use strict'

Cotton.UI.StoryManager.Topbar = Class.extend({

  init: function(oDispatcher){
    this._oDispatcher = oDispatcher;

    this._$topbar = $('<div class="ct-topbar"></div>');
    this._$topbar_container = $('<div class="ct-topbar_container"></div>');

    this._oSearch = new Cotton.UI.StoryManager.Search(oDispatcher);

    this._$topbar.append(
      this._$topbar_container.append(
        this._oSearch.$()
      )
    );

  },

  $: function(){
    return this._$topbar;
  },

  show: function(){
    this._$topbar.addClass('show');
  }

});