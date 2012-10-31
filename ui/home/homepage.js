'use strict';

/**
 * Display the homepage by default.
 */
Cotton.UI.Home.Homepage = Class.extend({

  _oWorld : null,

  /**
   * DOM Element, that handle the class ct-homepage.
   */
  _$homepage : null,

  _oFavoritesGrid : null,
  _oMVWGrid : null,
  _oAppsGrid : null,
  _$SwitchButton : null,

  _$apps_grid_button : null,
  _$favorites_grid_button : null,
  _$mvw_grid_button : null,

  /*
   * @constructor
   */
  init : function(oWorld) {
    var self = this;

    self._oWorld = oWorld;
    self._$homepage = $('<div class="ct-homepage">').appendTo('#ct');


    // GRID
    self._oFavoritesGrid = new Cotton.UI.Home.FavoritesGrid(this);
    self._oMVWGrid = new Cotton.UI.Home.MostVisitedGrid(this);
    self._oAppsGrid = new Cotton.UI.Home.AppsGrid(this);

    // GRID BUTTON
    self._$switch_button = $('<div class="ct-homepage_switch_button"></div>');
    self._$apps_grid_button = $('<div class="ct-homepage_select_button"><h2>Apps</h2><div>').click(
        function(event){
          self.selectGrid("apps");
        });
    self._$favorites_grid_button = $('<div class="ct-homepage_select_button"><h2>Favorites</h2></div>').click(
        function(event){
            self.selectGrid("favorites");
        });
    self._$mvw_grid_button = $('<div class="ct-homepage_select_button"><h2>Most Visited</h2></div>').click(
        function(){
            self.selectGrid("mvw");
        });


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
        });

    this._$homepage.append( self._$switch_button.append(
                              self._$apps_grid_button,
                              self._$favorites_grid_button,
                              self._$mvw_grid_button
                            ),
                            self._oFavoritesGrid.$(),
                            self._oMVWGrid.$(),
                            self._oAppsGrid.$());

     // Open the good grid.
    var oCurrentOpen = localStorage['ct-grid_mode'];
    self.selectGrid(oCurrentOpen);

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
    this._oWorld.reset();
    this._$homepage.show();
    $('.ct-icon_button_home').addClass("selected");
  },

  /**
   * Select the grid that corresponds to the given option.
   * @param {String} sOption : can have value "favorites", "apps", "mvw"
   */
  selectGrid : function(sOption) {
    var self = this;
    switch(sOption){
      case "favorites":
        self._oFavoritesGrid.show();
        self._oMVWGrid.hide();
        self._oAppsGrid.hide();
        localStorage['ct-grid_mode'] = 'favorites';
        self._$apps_grid_button.removeClass("selected");
        self._$favorites_grid_button.addClass("selected");
        self._$mvw_grid_button.removeClass("selected");
        break;

      case "apps":
        self._oFavoritesGrid.hide();
        self._oMVWGrid.hide();
        self._oAppsGrid.show();
        localStorage['ct-grid_mode'] = 'apps';
        self._$apps_grid_button.addClass("selected");
        self._$favorites_grid_button.removeClass("selected");
        self._$mvw_grid_button.removeClass("selected");

        break;

      case "mvw":
        self._oFavoritesGrid.hide();
        self._oMVWGrid.show();
        self._oAppsGrid.hide();
        localStorage['ct-grid_mode'] = 'mvw';
        self._$apps_grid_button.removeClass("selected");
        self._$favorites_grid_button.removeClass("selected");
        self._$mvw_grid_button.addClass("selected");

        break;

    }

  }
});
