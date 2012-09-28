'use strict';

Cotton.UI.Home.AppsGrid = Class.extend({

  _$AppsGrid : null,
  _lApps : [],

  init : function() {
    var self = this;
    this._$AppsGrid = $('<div class="ct-apps-grid">');

    // The list of all apps & extensions.
    var completeList = [];

    // A filtered list of apps we actually want to show.
    var appList = [];

    function compare(a, b) {
      return (a > b) ? 1 : (a == b ? 0 : -1);
    }

    function compareByName(app1, app2) {
      return compare(app1.name.toLowerCase(), app2.name.toLowerCase());
    }

    chrome.management.getAll(function(info) {
      for ( var i = 0, oExtensionInfo; oExtensionInfo = info[i]; i++) {
        if (oExtensionInfo.isApp) {
          new Cotton.UI.Home.AppsTicket(self, oExtensionInfo);
          // appList.push(oExtensionInfo);
        }
      }
    });

  },

  $ : function() {
    return this._$AppsGrid;
  },

  append : function($appsticket) {
    this._$AppsGrid.append($appsticket);
  },

  hide : function() {
    this._$AppsGrid.hide();
  },

  show : function() {
    Cotton.UI.Story.Storyline.removeAnyOpenStoryline();
    this._$AppsGrid.show();
  },

  compare : function(a, b) {
    return (a > b) ? 1 : (a == b ? 0 : -1);
  },

  compareByName : function(app1, app2) {
    return this.compare(app1.name.toLowerCase(), app2.name.toLowerCase());
  }

});
