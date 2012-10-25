'use strict';

Cotton.UI.Home.FavoritesGrid = Class
    .extend({

      _$FavoritesGrid : null,
      _lFavoritesTicket : [],

      init : function() {
        var self = this;

        self._$FavoritesGrid = $('<div class="ct-favorites-grid">');
        self._lFavoritesTicket = [];

          self._lFavoritesTicket.push(new Cotton.UI.Home.Ticket(this,
              '/media/images/home/tickets/TC.jpg', 'Techcrunch',
              'http://techcrunch.com'));
          self._lFavoritesTicket.push(new Cotton.UI.Home.Ticket(this,
              '/media/images/home/tickets/Fubiz.jpg', 'Fubiz', 'http://fubiz.net'));
          self._lFavoritesTicket.push(new Cotton.UI.Home.Ticket(this,
              '/media/images/home/tickets/FB.jpg', 'Facebook',
              'http://facebook.com'));
          self._lFavoritesTicket.push(new Cotton.UI.Home.Ticket(this,
              '/media/images/home/tickets/Dribbble.jpg', 'Dribbble', 'http://dribbble.com'));
          self._lFavoritesTicket.push(new Cotton.UI.Home.Ticket(this,
              '/media/images/home/tickets/PandoDaily.jpg', 'PandoDaily', 'http://pandodaily.com'));
          self._lFavoritesTicket.push(new Cotton.UI.Home.Ticket(this,
              '/media/images/home/tickets/MTV.jpg', 'MTV', 'http://www.mtv.com'));
          self._lFavoritesTicket.push(new Cotton.UI.Home.Ticket(this,
              '/media/images/home/tickets/Twitter.jpg', 'Twitter', 'http://twitter.com'));
          self._lFavoritesTicket.push(new Cotton.UI.Home.Ticket(this,
              '/media/images/home/tickets/Pinterest.jpg', 'Pinterest', 'http://pinterest.com'));

         $(window).resize(function(){
          console.log($(this).width());
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

        var iEstmatedWidth = à;
        _.each(self._lFavoritesTicket, function(oTicket){
          oTicket.setWidth(200);
          oTicket.setMargin(10);
          self.append(oTicket.$());
        });

        //var iMargin = ($(window).width() -) / 2;
        //self._$FavoritesGrid.css('margin-left', iMargin + "px");
        //self._$FavoritesGrid.css('margin-right', iMargin + "px");

      },
    });
