'use strict';

Cotton.UI.Story.Item.Element = Class
    .extend({

      _oVisitItem : null,

      _$item : null,

      _oItemContent : null,
      _$storyLink : null,

      init : function(oVisitItem) {
        // Cotton.Model.VisitItem contains all data.
        this._oVisitItem = oVisitItem;

        // current element.
        this._$item = $('<div class="ct-storyItem ct-storyItem_left"></div>');

        // current sub elements.
        this._oItemContent = new Cotton.UI.Story.Item.Content.Factory(this);

        this._$storyLink = $('<div class="ct-storyItemLink"></div>');

        // create item
        this._$item.append(this._$storyLink.append($(
            '<div class="ct-storyItemLinkLine"></div>').append(
            $('<div class="ct-storyItemLinkDot"></div>'))), this._oItemContent
            .$());

      },

      $ : function() {
        return this._$item;
      },

      appendTo : function(oStoryLine) {
        oStoryLine.$().append(this._$item);
      },

      setTop : function(iTop) {
        this._$item.css({
          top : iTop
        });
      },

      setSide : function(sSide) {
        switch (sSide) {
        case 'left':
          this._$item.removeClass('ct-storyItem_right').addClass(
              'ct-storyItem_left');
          break;
        case 'right':
          this._$item.removeClass('ct-storyItem_left').addClass(
              'ct-storyItem_right');
          break;
        }
      },

    });
