"use strict";

Cotton.UI.Stand.Home.ThemeSuggestor.UIThemeSuggestor = Class.extend({

  init : function (oGlobalDispatcher) {
    this._$suggestor = $('<div class="ct-suggestor"></div>');
    this._$suggestor_container = $('<div class="ct-suggestor_container"></div>');
    this._oGlobalDispatcher = oGlobalDispatcher;

    this._lTiles = [];

    this._oGlobalDispatcher.subscribe('window_resize', this, function(dArguments){
      this.setWidth(this._computeSlots(dArguments['width']));
    });

    this._$suggestor.append(
      this._$suggestor_container
    )
  },

  $ : function () {
    return this._$suggestor;
  },

  drawSuggestions : function(lStories, bText) {
    this.setWidth(this._computeSlots($(window).width()));
    var iLength = lStories.length;
    for (var i = 0; i < iLength; i++) {
      var oThemeSuggestion = new Cotton.UI.Stand.Home.Common.ThemeSuggestion(lStories[i], this._oGlobalDispatcher);
      this._lTiles.push(oThemeSuggestion);
      this._$suggestor_container.append(oThemeSuggestion.$());
    }

    if (lStories.length > 0 && bText) {
      this._$try_these = $('<div class="ct-try_these">or try one of these subjects</div>');
      if (lStories.length === 1) {
        this._$try_these.text("or try this subject");
      }
      this._$suggestor_container.prepend(
        this._$try_these
      );
    }
  },

  pop : function(iIndex) {
    var iIndexToDelete = iIndex - 2 || 0;
    var iLength = this._lTiles.length;
    var lTempTiles = [];
    for (var i = 0; i < iLength; i++) {
      if (i !== iIndexToDelete) {
        lTempTiles.push(this._lTiles[i]);
      } else {
        this._lTiles[i].purge();
        this._lTiles[i] = null;
      }
    }
    this._lTiles = lTempTiles;
  },

  _computeSlots : function(iWindowWidth) {
    var ELEMENT_WIDTH = 170;
    var ELEMENT_MARGIN = 20;
    var iSlotsPerLine = Math.floor((iWindowWidth)/(ELEMENT_WIDTH + 2 * ELEMENT_MARGIN));
    return iSlotsPerLine;
  },

  setWidth : function(iSlotsPerLine) {
    var ELEMENT_WIDTH = 170;
    var ELEMENT_MARGIN = 20;
    this._$suggestor_container.width(iSlotsPerLine * (ELEMENT_WIDTH + 2 * ELEMENT_MARGIN));
  },

  _purgeTiles : function() {
    var iLength = this._lTiles.length;
    for (var i = 0; i < iLength; i++) {
      this._lTiles[i].purge();
      this._lTiles[i] = null;
    }
    this._lTiles = null;
  },

  purge : function() {
    this._oGlobalDispatcher.unsubscribe('window_resize', this);
    this._oGlobalDispatcher = null;
    this._iElementWidth = null;
    this._iElementMargin = null;
    if (this._$try_these) {
      this._$try_these.remove();
      this._$try_these = null;
    }
    this._purgeTiles();
    this._$suggestor_container.remove();
    this._$suggestor_container = null;
    this._$suggestor.remove();
    this._$suggestor = null;
  }

});