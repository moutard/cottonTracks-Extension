'use strict';

Cotton.UI.Homepage.Grid = Class
    .extend({

      _$homepage : null,

      init : function() {
      },

       // TODO(fwouts): Find a way to avoid having to manipulate DOM elements.
      append : function($appsticket) {
        this._$homepage.append($appsticket);
      },

      hide : function() {
        this._$homepage.hide();
        $('.ct-iconButton_home').css({
          background : 'url("/images/topbar/home.png")',
          cursor : 'pointer'
        });
      },

      show : function() {
        Cotton.UI.Story.Storyline.removeAnyOpenStoryline();
        this._$homepage.show();
        $('.ct-iconButton_home').css({
          background : 'url("/images/topbar/home_selected.png")',
          cursor : 'default'
        });
      }

});
