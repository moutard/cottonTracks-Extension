'use strict';

// DO NOT FORGET THE PADDING (5 left and 5 right) for ticket.
// DO NOT FORGET THE BORDER.
Cotton.UI.Home.SMALL_WIDTH = 100;
Cotton.UI.Home.SMALL_WIDTH_WITHOUT_PADDING = 88;
Cotton.UI.Home.SMALL_MARGIN = 10;

Cotton.UI.Home.MEDIUM_WIDTH = 150;
Cotton.UI.Home.MEDIUM_WIDTH_WITHOUT_PADDING = 138;
Cotton.UI.Home.MEDIUM_MARGIN = 15;

Cotton.UI.Home.LARGE_WIDTH = 200;
Cotton.UI.Home.LARGE_WIDTH_WITHOUT_PADDING = 188;
Cotton.UI.Home.LARGE_MARGIN = 20;

Cotton.UI.Home.MIN_PADDING = 40;
Cotton.UI.Home.NB_COLUMN = 5;


Cotton.UI.Home.FavoritesGrid = Class
    .extend({

      _$FavoritesGrid : null,
      _lFavoritesTicket : [],

      init : function() {
        var self = this;

        self._$FavoritesGrid = $('<div class="ct-favorites-grid">');
        self._lFavoritesTicket = [];

        var lFavorites = JSON.parse(localStorage['ct-favorites_webistes']);
        _.each(lFavorites, function(dRecord){
          self._lFavoritesTicket.push(new Cotton.UI.Home.Ticket(this,
              dRecord['image'], dRecord['name'], dRecord['url']));
        });

         $(window).resize(function(){
           self.recomputeGrid();
         });

          self.recomputeGrid();
      },

      $ : function() {
        return this._$FavoritesGrid;
      },

      append : function($ticket) {
        this._$FavoritesGrid.append($ticket);
      },

      hide : function() {
        this._$FavoritesGrid.hide();
      },

      show : function() {
        this._$FavoritesGrid.show();
      },

      recomputeGrid : function() {
        var self = this;

        var iEstmatedLargeWidth = (Cotton.UI.Home.NB_COLUMN * Cotton.UI.Home.LARGE_WIDTH)
          + ((2 * Cotton.UI.Home.NB_COLUMN) * Cotton.UI.Home.LARGE_MARGIN) + 2;
        var iEstmatedMediumWidth = (Cotton.UI.Home.NB_COLUMN * Cotton.UI.Home.MEDIUM_WIDTH)
          + ((2 * Cotton.UI.Home.NB_COLUMN) * Cotton.UI.Home.MEDIUM_MARGIN) + 2;
        var iEstmatedSmallWidth = (Cotton.UI.Home.NB_COLUMN *  Cotton.UI.Home.SMALL_WIDTH)
          + ((2 * Cotton.UI.Home.NB_COLUMN) * Cotton.UI.Home.SMALL_MARGIN) + 2;

        if(($(window).width() - iEstmatedLargeWidth) > 2 * Cotton.UI.Home.MIN_PADDING){
          // Large size fit well.

          _.each(self._lFavoritesTicket, function(oTicket){
            oTicket.setLarge();
            self.append(oTicket.$());
          });

          self._$FavoritesGrid.width(iEstmatedLargeWidth);
          var iMargin = ($(window).width() - iEstmatedLargeWidth) / 2;
          self._$FavoritesGrid.css('margin-left', iMargin + "px");
          //self._$FavoritesGrid.css('margin-right', iMargin + "px");

        } else if(($(window).width() - iEstmatedMediumWidth) > 2 * Cotton.UI.Home.MIN_PADDING) {
          // Medium size fit well.

          _.each(self._lFavoritesTicket, function(oTicket){
            oTicket.setMedium();
            self.append(oTicket.$());
          });

          self._$FavoritesGrid.width(iEstmatedMediumWidth);
          var iMargin = ($(window).width() - iEstmatedMediumWidth) / 2;
          self._$FavoritesGrid.css('margin-left', iMargin + "px");
          //self._$FavoritesGrid.css('margin-right', iMargin + "px");

        } else {
          // Small size fit well.

          _.each(self._lFavoritesTicket, function(oTicket){
            oTicket.setSmall();
            self.append(oTicket.$());
          });

          self._$FavoritesGrid.width(iEstmatedSmallWidth);
          var iMargin = ($(window).width() - iEstmatedSmallWidth) / 2;
          self._$FavoritesGrid.css('margin-left', iMargin + "px");
          //self._$FavoritesGrid.css('margin-right', iMargin + "px");
        }
      },
    });
