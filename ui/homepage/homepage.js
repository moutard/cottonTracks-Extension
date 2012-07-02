'use strict';

Cotton.UI.Homepage.Homepage = Class.extend({

  _$homepage : null,
  _oFavoritesGrid : null,
  _oAppsGrid : null,
  _$SwitchButton : null,
  _bFavoritesVisible : true,

  init : function() {
    var self = this;
    this._$homepage = $('<div class="ct-homepage">').appendTo('#ct');

    this._oFavoritesGrid = new Cotton.UI.Homepage.FavoritesGrid();
    this._oAppsGrid = new Cotton.UI.Homepage.AppsGrid();

    this._$SwitchButton = $('<div class="ct-homepage_switch_button">').click(
        function() {
          if (self._bFavoritesVisible) {
            self._oFavoritesGrid.hide();
            self._oAppsGrid.show();
            self._bFavoritesVisible = false;
            $(this).find('h2').text("Favorites");
          } else {
            self._oFavoritesGrid.show();
            self._oAppsGrid.hide();
            self._bFavoritesVisible = true;
            $(this).find('h2').text("Apps");
          }
        }).appendTo(this._$homepage);
    this._$SwitchButton.append("<h2>Apps</h2>");

    this._$homepage.append(this._oFavoritesGrid.$());
    this._$homepage.append(this._oAppsGrid.$());
    this._oAppsGrid.hide();

    this._bFavoritesVisible = true;
  },

  $ : function() {
    return this._$homepage;
  },

  // TODO(fwouts): Find a way to avoid having to manipulate DOM elements.
  append : function($ticket) {
    this._$homepage.append($ticket);
  },

  hide : function() {
    this._$homepage.hide();
    //TODO:put in the less file
    $('.ct-iconButton_home').css({
      background : 'url("/media/images/topbar/home.png")',
      cursor : 'pointer'
    });
  },

  show : function() {
    Cotton.UI.Story.Storyline.removeAnyOpenStoryline();
    this._$homepage.show();
    $('.ct-flip').text('Welcome');
    //TODO: Put in the less file
    $('.ct-iconButton_home').css({
      background : 'url("/media/images/topbar/home_selected.png")',
      cursor : 'default'
    });
  },

  switchView : function() {
    if (this._bFavoritesVisible) {
      this._oFavoritesGrid.hide();
      this._oAppsGrid.show();
      this._bFavoritesVisible = false;
    } else {
      this._oFavoritesGrid.show();
      this._oAppsGrid.hide();
      this._bFavoritesVisible = true;
    }
  },

});
