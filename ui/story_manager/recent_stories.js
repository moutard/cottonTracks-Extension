'use strict'

Cotton.UI.StoryManager.Recent = Class.extend({

  init: function(oDispatcher){
    this._$main = $('<ul id="menu"></ul>');
    this._$sub = $('<ul></ul>');
    this._$recent = $('<li><a href="#">Recent</a></li><');
    this._$favorites = $('<li><a href="#">Favorites</a></li>');
    this._$opened = $('<li><a href="#">Opened</a></li>');

    this._$open_icon = $('<img class="ct-open_icon" src="media/images/related/search_icon.png">');

    this._$main.append(
      this._$recent.append(
        this._$sub.append(
          this._$favorites,
          this._$opened
        )
      )
    );
  },

  $: function(){
    return this._$main;
  }
});
