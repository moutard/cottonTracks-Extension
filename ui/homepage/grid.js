'use strict';

Cotton.UI.Homepage.Grid = Class
    .extend({

      _$homepage : null,

      init : function() {
        this._$homepage = $('<div class="ct-homepage">').appendTo('#ct');
        for ( var iI = 0; iI < 1; iI++) {
          new Cotton.UI.Homepage.Ticket(this, '/media/images/home/tickets/TC.jpg',
              Math.floor(Math.random() * 80 + 10), 'Techcrunch',
              'http://techcrunch.com');
          new Cotton.UI.Homepage.Ticket(this, '/media/images/home/tickets/Fubiz.jpg',
              Math.floor(Math.random() * 80 + 10), 'Fubiz', 'http://fubiz.net');
          new Cotton.UI.Homepage.Ticket(this, '/media/images/home/tickets/FB.jpg',
              Math.floor(Math.random() * 80 + 10), 'Facebook',
              'http://facebook.com');
          new Cotton.UI.Homepage.Ticket(this,
              'images/home/tickets/Dribbble.jpg', Math
                  .floor(Math.random() * 80 + 10), 'Dribbble',
              'http://dribbble.com');
          new Cotton.UI.Homepage.Ticket(this,
              'images/home/tickets/PandoDaily.jpg', Math
                  .floor(Math.random() * 80 + 10), 'PandoDaily',
              'http://pandodaily.com');
          new Cotton.UI.Homepage.Ticket(this, '/media/images/home/tickets/MTV.jpg',
              Math.floor(Math.random() * 80 + 10), 'MTV', 'http://www.mtv.com');
          new Cotton.UI.Homepage.Ticket(this,
              '/media/images/home/tickets/Twitter.jpg', Math
                  .floor(Math.random() * 80 + 10), 'Twitter',
              'http://twitter.com');
          new Cotton.UI.Homepage.Ticket(this,
              '/media/images/home/tickets/Pinterest.jpg', Math
                  .floor(Math.random() * 80 + 10), 'Pinterest',
              'http://pinterest.com');
        }
      },

      // TODO(fwouts): Find a way to avoid having to manipulate DOM elements.
      append : function($ticket) {
        this._$homepage.append($ticket);
      },

      hide : function() {
        this._$homepage.hide();
        // TODO : Put in the less file
        $('.ct-iconButton_home').css({
          background : 'url("/media/images/topbar/home.png")',
          cursor : 'pointer'
        });
      },

      show : function() {
        Cotton.UI.Story.Storyline.removeAnyOpenStoryline();
        this._$homepage.show();
        // TODO : Put in the less file
        $('.ct-iconButton_home').css({
          background : 'url("/media/images/topbar/home_selected.png")',
          cursor : 'default'
        });
      }
    });
