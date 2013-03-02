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

      init : function(oVisitItem) {
        // Cotton.Model.VisitItem contains all data.
        this._oVisitItem = oVisitItem;

        // Container for all items
        this._$storyContainer = $(".ct-story_container");

        // current element.
        this._$item = $('<div class="ct-story_item"></div>');

        // current sub elements.
        this._oItemContent = new Cotton.UI.Story.Item.Content.Factory(this);

        // create item
        this._$item.append(this._oItemContent.$());
        this._$storyContainer.isotope( 'insert', this._$item);
      },

      $ : function() {
        return this._$item;
      },

      visitItem : function() {
        return this._oVisitItem;
      },

    });
