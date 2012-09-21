'use strict';

// (function() {

/**
 * We keep the currently open storyline in order to close it if we try to open a
 * new one later.
 */
var _oCurrentlyOpenStoryline = null;

Cotton.UI.Story.Storyline = Class
    .extend({

      _oCurrentStory : null,

      // TODO(rmoutard) : use coherent notation, when the ui will be definitive.
      _$story_homepage : null,
      _$story_line : null,

      _$story_column_left : null,
      _$story_column_right : null,

      /**
       * A jQuery DOM object representing the vertical line joining all items.
       * 
       * @param {Cotton.Model.Story}
       *          oStory
       */
      init : function(oStory) {
        var self = this;

        if (!_oCurrentlyOpenStoryline
            || _oCurrentlyOpenStoryline._oCurrentStory.id() !== oStory.id()) {

          self._oCurrentStory = oStory;
          Cotton.UI.Story.Storyline.removeAnyOpenStoryline();

          this._$story_homepage = $('<div id="ct-story_homepage" class="clearfix"></div>');
          this._$story_line = $('<div class="ct-mystory_line"></div>');
          this._$story_column_left = $('<div class="ct-story_column_left"></div>');
          this._$story_column_right = $('<div class="ct-story_column_right"></div>');

          $('#ct').append(this._$story_homepage);

          this._$story_homepage.append(this._$story_column_left);
          this._$story_homepage.append(this._$story_line);
          this._$story_homepage.append(this._$story_column_right);
          this._$story_homepage.css('display', '');
          this._$story_homepage.addClass('clearfix');

          _oCurrentlyOpenStoryline = this;

          _.each(self._oCurrentStory.visitItems(), function(oVisitItem, iI) {
            var oItem = self.addVisitItem(oVisitItem, iI % 2 == 0 ? 'left'
                : 'right');
            // var oItem = oStoryline.buildStory(oVisitItem);
            setTimeout(function() {
              oItem.$().css("opacity", "1");
            }, iI * 100);
          });

          // Make sortable and draggable

          var dSortableParameters = {
            // Sortable only on vertical axis.
            axis : "y",
            // Se can't drag an element out of containment.
            containment : ".ct-story_column_left",
            // Element draggable.
            handle : ".ct-item_content",
            // Drag start after 10px movement.
            distance : 0,
            // Callback stop function.
            stop : function(event, ui) {
              // self._$story_column_left.find('.ct-story_item').each(function(){
              // Update position.

              // });
            },
          };

          self._$story_column_left.sortable(dSortableParameters);
          self._$story_column_right.sortable(dSortableParameters);

          // event tracking
          var bScrolled = false;
          $(window).on('scroll.Storyline', function() {
            if (bScrolled == false) {
              bScrolled = true;
              Cotton.ANALYTICS.scrollStory();
            }
          });
        }
      },

      story : function() {
        return this._oCurrentStory;
      },

      addVisitItem : function(oVisitItem, sParam) {
        var oItem = new Cotton.UI.Story.Item.Element(oVisitItem);
        oItem.$().css("opacity", "0");
        if (sParam === "left") {
          oItem.setSide('left');
          this._$story_column_left.append(oItem.$());

        } else if (sParam === "right") {
          oItem.setSide('right');
          this._$story_column_right.append(oItem.$());

        }

        return oItem;
      },

      buildStory : function(oVisitItem) {
        var oItem = Cotton.UI.Story.Item.Element(oVisitItem);
        oItem.appendTo(this);
        return oItem;
      },

      remove : function() {
        this._$story_homepage.remove();
        this._$story_homepage = null;
        _oCurrentlyOpenStoryline = null;
      },

      $ : function() {
        return this._$story_homepage;
      }
    });

// Static methods.
_.extend(Cotton.UI.Story.Storyline, {
  removeAnyOpenStoryline : function() {
    if (_oCurrentlyOpenStoryline) {
      $(window).off('scroll.Storyline');
      _oCurrentlyOpenStoryline.remove();
    }
  }
});
// })();
