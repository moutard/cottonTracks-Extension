'use strict';

/**
 * Global menu of the interface.
 * Contains the SumUp of the story (with sticker image, title, content details,
 * and actions available) the filters, and the settings button
 */
Cotton.UI.SideMenu.Menu = Class.extend({

  /**
   * {Cotton.UI.World} parent element.
   */
  _oWorld : null,

  /**
   * {DOM} current element.
   */
  _$menu : null,

  _oStory : null,

  _oPreview : null,
  _oRelatedToggler : null,
  _oFilters : null,
  _oSettings : null,

  init : function(oStory, oDispatcher, iNumberOfRelated) {
    if (iNumberOfRelated === undefined){
      iNumberOfRelated = 0;
    }
    this._oDispatcher = oDispatcher;
    this._iRelated = iNumberOfRelated;

    // Current element.
    this._$menu = $('<div class="ct-menu"></div>');
    this._oStory = oStory;

    // Sub elements.
    this._oPreview = new Cotton.UI.SideMenu.Preview.Element(
        oStory, this._oDispatcher);
    this._oRelatedToggler = new Cotton.UI.SideMenu.RelatedToggler(iNumberOfRelated, this._oDispatcher);
    this._oFilters = new Cotton.UI.SideMenu.Filters(this._oDispatcher);
    this._oSettings = new Cotton.UI.SideMenu.Settings(this._oDispatcher);

    this._oFilters.setFilterCount("all", oStory.historyItems().length);
    //construct element
    this._$menu.append(
      this._oPreview.$(),
      this._oRelatedToggler.$(),
      this._oFilters.$(),
      this._oSettings.$()
    )
  },

  $ : function() {
    return this._$menu;
  },

  world : function() {
    return this._oWorld;
  },

  story : function() {
    return this._oStory;
  },

  updateStory : function(oStory) {
    this._oStory = oStory;
  },

  recycle : function(oStory) {
    this.updateStory(oStory);
    this._oPreview.recycle(oStory);
  },

  preview : function() {
    return this._oPreview;
  },

  slideIn : function() {
    // FIXME(rmoutard) : use a open class css.
    this._$menu.animate({left: '+=250',}, 300, function(){});
  },

  filters : function() {
    return this._$filters;
  }

});
