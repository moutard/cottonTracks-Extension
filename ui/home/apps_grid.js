'use strict';

//DO NOT FORGET THE PADDING (5 left and 5 right) for ticket.
//DO NOT FORGET THE BORDER.
Cotton.UI.Home.Apps = {};
Cotton.UI.Home.Apps.SMALL_WIDTH = 32;
Cotton.UI.Home.Apps.SMALL_MARGIN = 10;

Cotton.UI.Home.Apps.MEDIUM_WIDTH = 64;
Cotton.UI.Home.Apps.MEDIUM_MARGIN = 15;

Cotton.UI.Home.Apps.LARGE_WIDTH = 128;
Cotton.UI.Home.Apps.LARGE_MARGIN = 20;

Cotton.UI.Home.Apps.MIN_PADDING = 40;
Cotton.UI.Home.Apps.NB_COLUMN = 5;

Cotton.UI.Home.AppsGrid = Class.extend({

  _$AppsGrid : null,
  _lApps : [],

  init : function() {
    var self = this;
    self._$AppsGrid = $('<div class="ct-apps-grid">');

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
          self._lApps.push(new Cotton.UI.Home.AppsTicket(self, oExtensionInfo));
        }
      }
      self.recomputeGrid();
    });

    $(window).resize(function(){
      self.recomputeGrid();
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
  },

  recomputeGrid : function() {
    var self = this;

    var iEstmatedLargeWidth = (Cotton.UI.Home.NB_COLUMN * Cotton.UI.Home.Apps.LARGE_WIDTH)
      + ((2 * Cotton.UI.Home.NB_COLUMN) * Cotton.UI.Home.Apps.LARGE_MARGIN);
    var iEstmatedMediumWidth = (Cotton.UI.Home.NB_COLUMN * Cotton.UI.Home.Apps.MEDIUM_WIDTH)
      + ((2 * Cotton.UI.Home.NB_COLUMN) * Cotton.UI.Home.Apps.MEDIUM_MARGIN);
    var iEstmatedSmallWidth = (Cotton.UI.Home.NB_COLUMN *  Cotton.UI.Home.Apps.SMALL_WIDTH)
      + ((2 * Cotton.UI.Home.NB_COLUMN) * Cotton.UI.Home.Apps.SMALL_MARGIN);

    if(($(window).width() - iEstmatedLargeWidth) > 2 * Cotton.UI.Home.MIN_PADDING){
      // Large size fit well.

      _.each(self._lApps, function(oTicket){
        oTicket.setLarge();
        self.append(oTicket.$());
      });

      self._$AppsGrid.width(iEstmatedLargeWidth);
      var iMargin = ($(window).width() - iEstmatedLargeWidth) / 2;
      self._$AppsGrid.css('margin-left', iMargin + "px");
      //self._$FavoritesGrid.css('margin-right', iMargin + "px");

    } else if(($(window).width() - iEstmatedMediumWidth) > 2 * Cotton.UI.Home.MIN_PADDING) {
      // Medium size fit well.

      _.each(self._lApps, function(oTicket){
        oTicket.setMedium();
        self.append(oTicket.$());
      });

      self._$AppsGrid.width(iEstmatedMediumWidth);
      var iMargin = ($(window).width() - iEstmatedMediumWidth) / 2;
      self._$AppsGrid.css('margin-left', iMargin + "px");
      //self._$FavoritesGrid.css('margin-right', iMargin + "px");

    } else {
      // Small size fit well.

      _.each(self._lApps, function(oTicket){
        oTicket.setSmall();
        self.append(oTicket.$());
      });

      self._$AppsGrid.width(iEstmatedSmallWidth);
      var iMargin = ($(window).width() - iEstmatedSmallWidth) / 2;
      self._$AppsGrid.css('margin-left', iMargin + "px");
      //self._$FavoritesGrid.css('margin-right', iMargin + "px");
    }
  },

});
