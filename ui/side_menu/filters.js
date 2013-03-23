'use strict';

/**
 * Filters for elements in the story.
 */

Cotton.UI.SideMenu.Filters = Class.extend({

  /**
   * {Cotton.UI.SideMenu.Menu} parent element.
   */
  _oMenu : null,

  /**
   * {DOM} current element.
   */
  _$filters : null,

  /**
   * Dictionnary that contains
   *  key : {String} filter name
   *  value : {DOM} corresponding DOM element.
   */
  _dFilters : {},

  init: function(oDispatcher, oMenu) {
    var self = this;
    this._oMenu = oMenu;
    this._dFilters = {};

    this._lFilters = ['all', 'article', 'image', 'video', 'map',
      'sound', 'quote'];

    this._oDispatcher = oDispatcher;

    this._oDispatcher.subscribe('update_filters', this, function(dFiltersCount){
      for (var sFilter in dFiltersCount) {
        self.setFilterCount(sFilter, dFiltersCount[sFilter]);
      }
    });
    this._$filters = $('<div class="ct-filters"></div>');

    function createFilterDOM(sFilter, sFilterCount) {
      sFilterCount = sFilterCount || 0;
      self._dFilters[sFilter] = $('<span class="all_count"></span>').text(sFilterCount);
      return  $('<div class="ct-filter "></div>').append(
          $('<span></span>').text(sFilter + 's  ('),
          self._dFilters[sFilter],
          $('<span></span>').text(')')).click(function(){
            // Update the story on click.
            if(sFilter === "all") {
              sFilter = '*';
            } else {
              sFilter = '.' + sFilter;
            }
            self._oDispatcher.publish('story:filter', {
              'filter': sFilter
            });
          });
    };

    var lDOMFiltersElements = [];
    for (var i = 0, sFilter; sFilter=this._lFilters[i]; i++){
      lDOMFiltersElements.push(createFilterDOM(sFilter));
    }
    //construct element
    this._$filters.append(lDOMFiltersElements);

  },

  $ : function(){
    return this._$filters;
  },

  setFilterCount : function(sFilter, iCount) {
    if (this._dFilters[sFilter]) {
      this._dFilters[sFilter].text(iCount);
    }
  },

});
