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
   * {Cotton.Messaging.Dispatcher}
   */
  _oGlobalDispatcher : null,

  /**
   * @param {Array.<Cotton.Model.Story>} lStories
   * @param {Cotton.Messaging.Dispatcher} oGlobalDispatcher
   */
  init : function(oGlobalDispatcher) {
    this._oGlobalDispatcher = oGlobalDispatcher;
    this._lCovers = [];
    this._lStories = [];
    this._$container = $('<div class="ct-covers_container"></div>');
  },

  $ : function() {
    return this._$container;
  },

  /**
   * Return the number of stories stored in the coversContainer.
   */
  length : function() {
    return this._lStories.length;
  },

  /**
   * For each stories create a associated cover, append it
   * to the _$container, and update _lStories.
   *
   * @param {Array.<Cotton.Model.Story>}
   *        lStories: list of stories you want to add.
   */
  add : function(lStories, iSlotsPerLine) {
    var lDOMCovers = [];
    for (var i = 0, iLength = lStories.length; i < iLength; i++) {
      var oStory = lStories[i];
      this._lStories.push(oStory);
      var oCover = new Cotton.UI.Stand.Common.Cover.UICover(oStory,
         this._oGlobalDispatcher);
      this._lCovers.push(oCover);
      lDOMCovers.push(oCover.$());
      this.positionOneCover(oCover, this._lStories.length - 1, iSlotsPerLine);
      oCover.setIndex(this._lStories.length - 1);
      oCover.animate();
    }
    this.setHeight(iSlotsPerLine);
    this._$container.append(lDOMCovers);
    // (FIXME) rkorach rmoutard: we artificially delay the moment we set the animate class
    // by checking the css 'top' property. Weird behavior, hen not put, animate behaves
    // as if it was called before the setHeight function
    this._$container.css('top');
    this.animate();
  },

  setHeight : function(iSlotsPerLine) {
    var COVER_HEIGHT = 250;
    var COVER_TOP_MARGIN = 22;
    var iLines = Math.ceil(this._lStories.length / iSlotsPerLine);
    this._$container.css('height', iLines * (COVER_HEIGHT + COVER_TOP_MARGIN));
  },

  animate : function() {
    this._$container.addClass('ct-animate');
  },

  positionCovers : function(iSlotsPerLine) {
    var iLength = this._lCovers.length;
    for (var i = 0; i < iLength; i++) {
      this.positionOneCover(this._lCovers[i], i, iSlotsPerLine);
    }
  },

  /**
   * positions a cover on the manager depending on its position in the covers_container
   * and the number of slots per row available
   * @param {int} iSlotsPerRow:
   *    the number of covers you can put on a line
   **/
  positionOneCover : function(oCover, iPosition, iSlotsPerLine) {
    var iPositionOnRow = iPosition % iSlotsPerLine;
    var COVER_HEIGHT = 250;
    var COVER_WIDTH = 396;
    var TOP_MARGIN = 22;
    var LEFT_MARGIN = 25;

    var iTop = (Math.floor(iPosition / iSlotsPerLine)) * (COVER_HEIGHT + TOP_MARGIN);
    var iLeft = (iPositionOnRow) * (COVER_WIDTH + LEFT_MARGIN);
    oCover.setPosition(iTop, iLeft);
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
