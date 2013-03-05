'use strict';

/**
 * In charge of displaying an item (dot + link + content). Handle his position
 * in the storyline.
 */
Cotton.UI.Story.Item.Element = Class
    .extend({

      _oVisitItem : null,

      _$item : null,

      _oItemContent : null,

      _$storyContainer : null,

      _bReload : null,

      init : function(oVisitItem, $storyContainer) {
        // Cotton.Model.VisitItem contains all data.
        this._oVisitItem = oVisitItem;

        // Container for all items
        this._$storyContainer = $storyContainer;

        // current element.
        this._$item = $('<div class="ct-story_item"></div>');

        // current sub elements.
        this._oItemContent = new Cotton.UI.Story.Item.Content.Factory(this);

        // create item
        this._$item.append(this._oItemContent.$());
        this._$storyContainer.isotope( 'insert', this._$item);

        //boolean to know if a reload has been performed
        this._bReload = false;
      },

      $ : function() {
        return this._$item;
      },

      visitItem : function() {
        return this._oVisitItem;
      },

      container : function() {
        return this._$storyContainer;
      },

	  reload : function() {
        self = this;
	  
        var oDatabase = new Cotton.DB.IndexedDB.Wrapper('ct', {
            'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS
        }, function() {
          self = self;
          oDatabase.find('visitItems', 'id', self.visitItem().id(), function(oVisitItem) {
            self._$item.empty();
            self._oVisitItem = oVisitItem;
            self._bReload = true;
            self._oItemContent = new Cotton.UI.Story.Item.Content.Factory(self);
          });
        });
      },

      isReloaded : function() {
	    return this._bReload;
      },

      setReloaded : function(bool) {
	    this._bReload = bool;
      }
});
