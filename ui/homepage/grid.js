'use strict';

Cotton.UI.Homepage.Grid = Class.extend({

  _$homepage : null,

  init : function() {
    this._$homepage = $('<div class="ct-homepage">').appendTo('#ct');
for (var iI = 0; iI < 1; iI++) {
      new Cotton.UI.Homepage.Ticket(this, 'http://tctechcrunch.files.wordpress.com/2011/07/logo-3d.png?w=0', Math.floor(Math.random()*80+10), 'Techcrunch','http://techcrunch.com');
      new Cotton.UI.Homepage.Ticket(this, 'http://blog.agent-influence.com/wp-content/uploads/2010/06/fubiz.png', Math.floor(Math.random()*80+10), 'Fubiz','http://fubiz.net');
      new Cotton.UI.Homepage.Ticket(this, 'http://www.destination-webmarketing.fr/wp-content/uploads/2011/02/facebook-logo1.jpg', Math.floor(Math.random()*80+10), 'Facebook','http://facebook.com');
      new Cotton.UI.Homepage.Ticket(this, 'http://drew-hoffman.com/wp-content/uploads/2010/12/dribbble_logo.jpg', Math.floor(Math.random()*80+10), 'Dribbble','http://dribbble.com');
      new Cotton.UI.Homepage.Ticket(this, 'http://imjustcreative.com/wp-content/uploads/ImJustCreative-2010-01-05-at-15.58.04.jpg', Math.floor(Math.random()*80+10), 'Daring Fireball','http://daringfireball.com');
      new Cotton.UI.Homepage.Ticket(this, 'https://studies2.hec.fr/jahia/webdav/site/hec/shared/sites/compta-gestion/acces_anonyme/Photos%20HEC/Logo-porte-web.jpg', Math.floor(Math.random()*80+10), 'HEC Paris','http://www.hec.edu');
      new Cotton.UI.Homepage.Ticket(this, 'http://appleheadlines.com/wp-content/uploads/2011/01/netflix_logo.gif', Math.floor(Math.random()*80+10), 'Netflix','http://netflix.com');
      new Cotton.UI.Homepage.Ticket(this, 'http://pampelmoose.com/mimg/wired_logo.jpg', Math.floor(Math.random()*80+10), 'Wired','http://wired.com');
    }
  },

  // TODO(fwouts): Find a way to avoid having to manipulate DOM elements.
  append : function($ticket) {
    this._$homepage.append($ticket);
  },

  hide : function() {
    this._$homepage.hide();
  },

  show : function() {
    Cotton.UI.Story.Storyline.removeAnyOpenStoryline();
    this._$homepage.show();
  }
});
