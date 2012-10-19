'use strict';

/**
 * Display the searchpage.
 */
Cotton.UI.Search.Searchpage = Class.extend({

  /**
   * DOM Element, that handle the class ct-searchpage.
   */
  _$searchpage : null,

  _$title : null,
  _$search_bar : null,

  init : function() {
    var self = this;
    self._$searchpage = $('<div class="ct-searchpage">').hide().appendTo('#ct');

    self._$title = $('<h1>Search among all the elements in cottonTracks</h1>');
    self._$search_bar = $('<input class="ct-search_bar" type="text" name="search_tags">');
    var $warning = $("<p>Warning : The search feature is still in beta version. You would be enjoy soon this amazing feature.</p>");
    self._$searchpage.append(self._$title, self._$search_bar, $warning);
  },

  $ : function(){
    return this._searchpage;
  },

  show : function(){
    this._$searchpage.show();
  },
  hide : function(){
    this._$searchpage.hide();
  },
});
