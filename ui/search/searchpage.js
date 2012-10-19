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

  init : function(oWorld) {
    var self = this;

    self._oWorld = oWorld;
    self._$searchpage = $('<div class="ct-searchpage">').hide().appendTo('#ct');

    self._$title = $('<h1>Search among all the elements in cottonTracks</h1>');
    self._$search_bar = $('<input class="ct-search_bar" type="text" name="search_tags">');
    self._$search_bar.keypress(function(event) {
      // on press 'Enter' event.
      if (event.which == 13) {
        var sTags = self._$search_bar.val();
          if(sTags!==""){
            var lTags = sTags.toLowerCase().split(" ");
            if(lTags.length > 0){
              Cotton.CONTROLLER.searchStoryFromTags(lTags, function(lStories){
                console.log(lStories);
              });
            }
          }
      }
    });
    var $warning = $("<p>Warning : The search feature is still in beta version. You would be enjoy soon this amazing feature.</p>");
    self._$searchpage.append(self._$title, self._$search_bar, $warning);
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
});
