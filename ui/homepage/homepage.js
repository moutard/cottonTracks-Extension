'use strict';

Cotton.UI.Homepage.Homepage = Class
    .extend({

      _$homepage : null,
      _oFavoritesGrid : null,
      _oAppsGrid : null,

      init : function() {
        this._$homepage = $('<div class="ct-homepage">').appendTo('#ct');

        this._oFavoritesGrid = new Cotton.UI.Homepage.FavoritesGrid();
        this._oAppsGrid = new Cotton.UI.Homepage.FavoritesGrid();

        this._$homepage.append(this._oFavoritesGrid.$());
        this._$homepage.append(this._oAppsGrid.$());
      },
    });

