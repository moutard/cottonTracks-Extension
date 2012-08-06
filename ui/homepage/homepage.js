'use strict';

Cotton.UI.Homepage.Homepage = Class.extend({

  _$homepage : null,
  _oFavoritesGrid : null,
  _oAppsGrid : null,
  _$SwitchButton : null,

  init : function() {
    var self = this;
    this._$homepage = $('<div class="ct-homepage">').appendTo('#ct');

    this._oFavoritesGrid = new Cotton.UI.Homepage.FavoritesGrid();
    this._oAppsGrid = new Cotton.UI.Homepage.AppsGrid();

    this._$SwitchButton = $('<div class="ct-homepage_switch_button">').click(
      function() {
		self.switchView();
      }).appendTo(this._$homepage);

    this._$homepage.append(this._oFavoritesGrid.$());
    this._$homepage.append(this._oAppsGrid.$());
    if (localStorage['gridMode'] == 'apps'){
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
    if (localStorage['gridMode'] == 'apps') {
      this._oFavoritesGrid.show();
      this._oAppsGrid.hide();
      localStorage['gridMode'] = 'favorites';
      $(this._$SwitchButton).find('h2').text("Apps");
    } else {
      this._oFavoritesGrid.hide();
      this._oAppsGrid.show();
      localStorage['gridMode'] = 'apps';
      $(this._$SwitchButton).find('h2').text("Favorites");
    }
  },

});
