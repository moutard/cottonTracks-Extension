'use strict';
/**
 * class CoversContainer
 * Store all the covers.
 */
Cotton.UI.Stand.Manager.CoversContainer = Class.extend({

  /**
   * {Array<Cotton.UI.Stand.Common.Cover.UICover>} _lCovers:
   */
  _lCovers : null,

  /**
   * {Array.<Cotton.Model.Story>} lStories:
   */
  _lStories : null,

  /**
   * @param {Array.<Cotton.Model.Story>} lStories
   * @param {Cotton.Messaging.Dispatcher} oGlobalDispatcher
   */
  init : function(lStories, oGlobalDispatcher) {
    this._lCovers = [];
    this._lStories = lStories;

    this._$container = $('<div class="ct-covers_container"></div>');

    var lDOMCovers = [];
    for (var i = 0, iLength = this._lStories.length; i < iLength; i++) {
      var oStory = this._lStories[i];
      var oCover = new Cotton.UI.Stand.Common.Cover.UICover(oStory);
      lDOMCovers.push(oCover.$());
    }

    this._$container.append(lDOMCovers);
  },

  $ : function() {
    return this._$container;
  },

  purge : function() {
    for (var i = 0; i < this._lCovers.length; i++) {
      this._lCovers[i].purge();
      this._lCovers[i] = null;
    }
    this._lCovers = null;
    this._lStories = purgeArray(this._lStories);
    this.$container.empty().remove();
  }

});

