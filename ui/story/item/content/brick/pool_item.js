'use strict';

/**
 * Item Date Contains clock icon and date
 */
Cotton.UI.Story.Item.Content.Brick.PoolItem = Class.extend({

  _$navigation_bar : null,
  _$title : null,
  _oWebsite : null,

  init : function(oHistoryItem, oDispatcher) {
    var self = this;

    this._oHistoryItem = oHistoryItem;
    this._oDispatcher = oDispatcher;

    this._$pool_item = $('<div class="pool_item"></div>').click(function(){
      self.removeFromPool();
    });

    this._$title = ('<h3>' + oHistoryItem.title() + '</h3>');
    this._oWebsite = new Cotton.UI.Story.Item.Content.Brick.Website(oHistoryItem.url());
    this._$pool_item.append(
      this._$title,
      this._oWebsite.$()
    );
  },

  $ : function() {
    return this._$pool_item;
  },

  removeFromPool : function(){
    var self = this;
    this._oDispatcher.publish('add_historyItem_from_pool', {'historyItem': this._oHistoryItem});
    this._$pool_item.addClass('collapsed');
    setTimeout(function(){
      self._$pool_item.addClass('hidden');
    }, 400);
  }
});
