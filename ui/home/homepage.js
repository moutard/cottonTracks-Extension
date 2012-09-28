'use strict';

/**
 * Display the homepage by default.
 */
Cotton.UI.Home.Homepage = Class.extend({

  /**
   * DOM Element, that handle the class ct-homepage.
   */
  _$homepage : null,

  _oFavoritesGrid : null,
  _oAppsGrid : null,
  _$SwitchButton : null,

  init : function() {
    var self = this;
    this._$homepage = $('<div class="ct-homepage">').appendTo('#ct');

    // Favorites or MostVisited
    if (localStorage['ct-settings_grid'] === "MostVisited") {
      this._oFavoritesGrid = new Cotton.UI.Home.MostVisitedGrid(this);
    } else {
      this._oFavoritesGrid = new Cotton.UI.Home.FavoritesGrid(this);
    }

    this._oAppsGrid = new Cotton.UI.Home.AppsGrid(this);

    this._$SwitchButton = $('<div class="ct-homepage_switch_button">').click(
        function() {
          if (localStorage['ct-grid_mode'] == 'apps') {
            self._oFavoritesGrid.show();
            self._oAppsGrid.hide();
            localStorage['ct-grid_mode'] = 'favorites';
            $(this).find('h2').text("Apps");
          } else {
            self._oFavoritesGrid.hide();
            self._oAppsGrid.show();
            localStorage['ct-grid_mode'] = 'apps';
            $(this).find('h2').text("Favorites");
          }
        }).appendTo(this._$homepage);

    this._$homepage.append(this._oFavoritesGrid.$());
    this._$homepage.append(this._oAppsGrid.$());
    if (localStorage['ct-grid_mode'] == 'apps') {
      this._oFavoritesGrid.hide();
      this._$SwitchButton.append("<h2>Favorites</h2>");
    } else {
      this._oAppsGrid.hide();
      this._$SwitchButton.append("<h2>Apps</h2>");
    }
  },

  $ : function() {
    return this._$homepage;
  },

  append : function($ticket) {
    this._$homepage.append($ticket);
  },

  hide : function() {
    this._$homepage.hide();
    $('.ct-icon_button_home').removeClass("selected");
  },

  show : function() {
    Cotton.UI.Story.Storyline.removeAnyOpenStoryline();
    this._$homepage.show();
    // $('.ct-flip').text('Welcome');
    $('.ct-icon_button_home').addClass("selected");
  },

});
