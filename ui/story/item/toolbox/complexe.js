'use strict';

/**
 * Toolbox Small is the action menu for items with a small label
 * Contains remove, open buttons
 * Contains getContent/expand if item_type is default
 */
Cotton.UI.Story.Item.Toolbox.Complexe = Cotton.UI.Story.Item.Toolbox.Simple
  .extend({

    _bGettingContent : null,

    _$expand : null,
    _$collapse : null,
    _$loading : null,
    _$getContent : null,

    init : function(bHasExpand, sUrl, oDispatcher, oItem, sSize) {
      var self = this;

      this._super(sUrl, oDispatcher, oItem, sSize);

      // current item
      this._$toolbox.addClass('small');

      this._$expand = $('<p class="expand">Expand</p>').hide();
      this._$collapse = $('<p class="collapse">Collapse</p>').hide();
      this._$getContent = $('<p class="get_content">Grab Article</p>').hide();
      this._$loading = $('<img class="loading" src="media/images/story/item/default_item/loading.gif">').hide();

      // If there is no paragraph you can expand display the getContent button.
      if (bHasExpand) {
        this._$expand.show();
      } else {
        this._$getContent.show();
      }

      //set actions on buttons

      //expand reader
      this._$expand.click(function(){
        // FIXME(rmoutard) : we can avoid that with local dispatcher or id.
        self._oItem.$().addClass('expanded');
        self._$toolbox.addClass("visible");
        $(this).hide();
        self._$collapse.show();
        self._oDispatcher.publish('item:expand');
        Cotton.ANALYTICS.expand();
      });

      //collapse reader
      this._$collapse.click(function(){
        self._oItem.$().removeClass('expanded');
        self._$toolbox.removeClass("visible");
        $(this).hide();
        self._$expand.show();
        self._oDispatcher.publish('item:expand');
        Cotton.ANALYTICS.collapse();
      });

      //get content
      this._$getContent.click(function(){
        self._oDispatcher.publish('item:get_content', {
          'id': oItem.historyItem().id(),
          'url': oItem.historyItem().url()
        });
        self._$loading.show();
        $(this).hide();
        self.$().addClass('visible');
        Cotton.ANALYTICS.getContent();
      });

      // construct item
      this._$toolbox.append(
        this._$expand,
        this._$collapse,
        this._$getContent,
        this._$loading
      );

    },

    $ : function() {
      return this._$toolbox;
    },

    recycle : function(bHasExpand) {
      this._$loading.hide();
      if (bHasExpand){
        this._$expand.show().click();
      } else {
        this.$().removeClass('visible');
      }

    }

});
