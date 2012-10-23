'use strict';

/**
 * Display the searchpage.
 */
Cotton.UI.Search.Searchpage = Class.extend({

  _oWorld : null,

  /**
   * DOM Element, that handle the class ct-searchpage.
   */
  _$searchpage : null,

  _$title : null,
  _$search_bar : null,
  _$undo_button : null,
  _$spinner : null,

  init : function(oWorld) {
    var self = this;

    self._oWorld = oWorld;
    self._$searchpage = $('<div class="ct-searchpage">').hide().appendTo('#ct');

    self._$title = $('<h1>Search among all the elements in cottonTracks</h1>');
    self._$search_bar = $('<input class="ct-search_bar" type="text" name="search_tags">');
    self._$search_bar.keypress(function(event) {
      // on press 'Enter' event.
      if (event.which == 13) {
        self._$spinner.show();
        var sSearchPattern = self._$search_bar.val();
        // Put the search in a worker.
        setTimeout(function(){
          Cotton.CONTROLLER.searchStoryFromSearchKeywords(sSearchPattern, function(lStories){
            self._$spinner.remove();
          });
        }, 10);
      }
    });

    self._$undo_button = $('<div class="ct-search_undo_button"></div>').click(function(){
      self._$search_bar.val("");
      Cotton.CONTROLLER.resetSearch();
    });

    var $warning = $("<p>Warning : The search feature is still in beta version. You would be enjoy soon this amazing feature.</p>");
    self._$spinner = $('<div class="ct-spinning_gears medium animate"></div>').hide();

    self._$searchpage.append(self._$title, self._$undo_button, self._$search_bar, $warning, self._$spinner);
  },

  $ : function(){
    return this._searchpage;
  },

  show : function(){
    this._oWorld.reset();
    this._$searchpage.show();
  },

  hide : function(){
    this._$searchpage.hide();
  },

  nothingFoundError : function(){
    var self = this;
    var $nothing_found = $('<p class="ct-nothing_found">Nothing found</p>');
    self._$searchpage.append($nothing_found);
    self._$search_bar.css("background-color", "#DE4646");
    self._$search_bar.animate({
      "background-color" :  "#FFFFFF"
    }, 1000);
    setTimeout(function(){ $nothing_found.remove();}, 1000);
  },
});
