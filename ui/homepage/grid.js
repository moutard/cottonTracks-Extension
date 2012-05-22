'use strict';

Cotton.UI.Homepage.Grid = Class.extend({
  
  _$homepage: null,
  
  init: function() {
    this._$homepage = $('<<div class="ct-homepage">').appendTo('body');
    for (var iI = 0; iI < 8; iI++) {
      new Cotton.UI.Homepage.Ticket(this, 'https://www.google.fr/images/srpr/logo3w.png', 50, 'Some title');
    }
  },
  
  // TODO(fwouts): Find a way to avoid having to manipulate DOM elements.
  append : function($ticket) {
    this._$homepage.append($ticket);
  },
  
  hide: function() {
    this._$homepage.hide();
  },
  
  show: function() {
    Cotton.UI.Story.Storyline.removeAnyOpenStoryline();
    this._$homepage.show();
  }
});
