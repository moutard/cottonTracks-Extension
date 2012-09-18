'use strict';

Cotton.UI.Home.FavoritesGrid = Class
    .extend({

      _$FavoritesGrid : null,

      init : function() {
        this._$FavoritesGrid = $('<div class="ct-favorites-grid">');
        for ( var iI = 0; iI < 1; iI++) {
          new Cotton.UI.Home.Ticket(this,
              '/media/images/home/tickets/TC.jpg', Math
                  .floor(Math.random() * 80 + 10), 'Techcrunch',
              'http://techcrunch.com');
          new Cotton.UI.Home.Ticket(this,
              '/media/images/home/tickets/Fubiz.jpg', Math
                  .floor(Math.random() * 80 + 10), 'Fubiz', 'http://fubiz.net');
          new Cotton.UI.Home.Ticket(this,
              '/media/images/home/tickets/FB.jpg', Math
                  .floor(Math.random() * 80 + 10), 'Facebook',
              'http://facebook.com');
          new Cotton.UI.Home.Ticket(this,
              '/media/images/home/tickets/Dribbble.jpg', Math.floor(Math
                  .random() * 80 + 10), 'Dribbble', 'http://dribbble.com');
          new Cotton.UI.Home.Ticket(this,
              '/media/images/home/tickets/PandoDaily.jpg', Math.floor(Math
                  .random() * 80 + 10), 'PandoDaily', 'http://pandodaily.com');
          new Cotton.UI.Home.Ticket(this,
              '/media/images/home/tickets/MTV.jpg', Math
                  .floor(Math.random() * 80 + 10), 'MTV', 'http://www.mtv.com');
          new Cotton.UI.Home.Ticket(this,
              '/media/images/home/tickets/Twitter.jpg', Math.floor(Math
                  .random() * 80 + 10), 'Twitter', 'http://twitter.com');
          new Cotton.UI.Home.Ticket(this,
              '/media/images/home/tickets/Pinterest.jpg', Math.floor(Math
                  .random() * 80 + 10), 'Pinterest', 'http://pinterest.com');
        }
      },

      $ : function() {
        return this._$FavoritesGrid;
      },

      // TODO(fwouts): Find a way to avoid having to manipulate DOM elements.
      append : function($ticket) {
        this._$FavoritesGrid.append($ticket);
      },

      hide : function() {
        this._$FavoritesGrid.hide();
      },

      show : function() {
        this._$FavoritesGrid.show();
      }
    });
