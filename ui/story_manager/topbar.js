'use strict'

Cotton.UI.StoryManager.Topbar = Class.extend({

  init: function(oDispatcher){
    this._oDispatcher = oDispatcher;

    this._$topbar = $('<div class="ct-topbar"></div>');
    this._$topbar_container = $('<div class="ct-topbar_container"></div>');

    this._$logo_manager = $('<img class="ct-logo_manager" src="media/images/manager/logo_manager.png">');
    this._oSearch = new Cotton.UI.StoryManager.Search(oDispatcher);
    this._$quit = $('<div class="ct-quit"><img src="media/images/manager/close_manager.png"><p>Go back to the page</p></div>').click(function(){
      Cotton.ANALYTICS.backToPage('topbar X');
      window.history.back();
    });

    this._$topbar.append(
      this._$logo_manager,
      this._$topbar_container.append(
        this._oSearch.$()
      ),
      this._$quit
    );

  },

  $: function(){
    return this._$topbar;
  },

  show: function(){
    this._$topbar.addClass('show');
  }

});
