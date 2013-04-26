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
   * {Cotton.Messaging.Dispatcher} dispatcher for UI
   */
  _oDispatcher : null,

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

    this._lFilters = ['all', 'article', 'image', 'video', 'map'];

    this._oDispatcher = oDispatcher;

    this._oDispatcher.subscribe('update_filters', this, function(dFiltersCount){
      for (var sFilter in dFiltersCount) {
        self.setFilterCount(sFilter, dFiltersCount[sFilter]);
      }
    });
    this._oDispatcher.subscribe('item:delete', this, function(dArguments){
      var sRemovedItemType = dArguments['type'];
      self.decrementFilter(sRemovedItemType);
    });
    this._oDispatcher.subscribe('element:added', this, function(dArguments){
      var sAddedItemType = dArguments['type'];
      self.incrementFilter(sAddedItemType);
    });
    this._$filters = $('<div class="ct-filters"></div>');
    this._$separationLine = $('<div class="separation_line"></div>');

    function createFilterDOM(sFilter, sFilterCount) {
      sFilterCount = sFilterCount || 0;
      self._dFilters[sFilter] = {};
      self._dFilters[sFilter]['dom'] = $('<span class="' + sFilter + '_count"></span>').text(
        sFilterCount);
      return  $('<div class="ct-filter "></div>').append(
          $('<span></span>').text(sFilter + (sFilter !== 'all' ? 's  (' : ' (')),
          self._dFilters[sFilter]['dom'],
          $('<span></span>').text(')')).click(function(){
            // Update the story on click.
            if(sFilter === "all") {
              var sFilterCode = '*';
            } else {
              var sFilterCode = '.' + sFilter;
            }
            self._oDispatcher.publish('story:filter', {
              'filter': sFilterCode
            });
            Cotton.ANALYTICS.filter(sFilterCode);
          });
    };

    var lDOMFiltersElements = [];
    for (var i = 0, sFilter; sFilter=this._lFilters[i]; i++){
      lDOMFiltersElements.push(createFilterDOM(sFilter));
    }
    //construct element
    this._$filters.append(
      this._$separationLine,
      lDOMFiltersElements
    );

  },

  $ : function(){
    return this._$filters;
  },

  setFilterCount : function(sFilter, iCount) {
    if (this._dFilters[sFilter]) {
      this._dFilters[sFilter]['count'] = iCount;
      this._dFilters[sFilter]['dom'].text(iCount);
      this._oDispatcher.publish('filter:update', {
        'type': sFilter,
        'count': iCount
      });
    }
  },

  decrementFilter : function (sFilter){
    if (this._dFilters[sFilter]) {
      this.setFilterCount(sFilter, this._dFilters[sFilter]['count'] - 1);
    }
    this.setFilterCount('all', this._dFilters['all']['count'] - 1);
  },

  incrementFilter : function (sFilter){
    if (this._dFilters[sFilter]) {
      this.setFilterCount(sFilter, this._dFilters[sFilter]['count'] + 1);
    }
    this.setFilterCount('all', this._dFilters['all']['count'] + 1);
  }

});
