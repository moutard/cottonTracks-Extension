'use strict'

Cotton.UI.StoryManager.Search = Class.extend({

  init: function(oDispatcher){
    this._$search = $('<div class="ct-topbar-search"></div>');
    this._$input = $('<input type="text" name="ct-search" placeholder="Search for more stories">');
    this._$search_button = $('<img class="ct-search_icon" src="media/images/related/search_icon.png">');
    this._$underscore = $('<div class="ct-search_underline"></div>');

    this._$input.keypress(function(e){
      if (e.which === 13){
        Cotton.ANALYTICS.searchStories('topbar');
        var sQuery = $(this).val().toLowerCase();
        var lSearchWords = (sQuery.length > 0) ? sQuery.split(' ') : [];
        oDispatcher.publish('search_stories', {
          'searchWords': lSearchWords,
          'context': 'manager'
        });
      }
    }).keyup(function(e) {
      if (e.which === 8 || e.which === 46) {
        var sQuery = $(this).val().toLowerCase();
        var lSearchWords = (sQuery.length > 0) ? sQuery.split(' ') : [];
        if (lSearchWords.length === 0) {
          oDispatcher.publish('search_stories', {
            'searchWords': lSearchWords,
            'context': 'manager'
          });
        }
      }
    });

    this._$search.append(this._$input, this._$search_button, this._$underscore);
  },

  $: function(){
    return this._$search;
  }
});