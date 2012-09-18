'use strict';

(function() {

  /**
   * We keep the currently open storyline in order to close it if we try to open
   * a new one later.
   */
  var _oCurrentlyOpenStoryline = null;

  Cotton.UI.Story.Storyline = Class
      .extend({

        _oCurrentStory : null,

        _$storyHomepage : null,
        _$storyLine : null,

        _$storyColLeft : null,
        _$storyColRight : null,

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

            this._$storyHomepage = $('<div id="ct-story-homepage" class="clearfix"></div>');
            this._$storyLine = $('<div class="ct-mystoryLine"></div>');
            this._$storyColLeft = $('<div class="ct-storyColLeft"></div>');
            this._$storyColRight = $('<div class="ct-storyColRight"></div>');

            $('#ct').append(this._$storyHomepage);
            // this._$storyLine.append(this._$storyColLeft);
            // this._$storyLine.append(this._$storyColRight);

            this._$storyHomepage.append(this._$storyColLeft);
            this._$storyHomepage.append(this._$storyLine);
            this._$storyHomepage.append(this._$storyColRight);
            this._$storyHomepage.css('display', '');
            this._$storyHomepage.addClass('clearfix');
            // TODO(fwouts): Improve/cleanup.
            this._$storyLine.css({
            // height : window.innerHeight
            });

            _oCurrentlyOpenStoryline = this;

            _.each(self._oCurrentStory.visitItems(), function(oVisitItem, iI) {
              var oItem = self.addVisitItem(oVisitItem, iI % 2 == 0 ? 'left'
                  : 'right');
              // var oItem = oStoryline.buildStory(oVisitItem);
              setTimeout(function() {
                oItem.$().css("opacity", "1");
              }, iI * 100);
            });

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

        addVisitItem : function(oVisitItem, sParam) {
          var oItem = new Cotton.UI.Story.Item.Element(oVisitItem);
          oItem.$().css("opacity", "0");
          if (sParam === "left") {
            oItem.setSide('left');
            this._$storyColLeft.append(oItem.$());

          } else if (sParam === "right") {
            oItem.setSide('right');
            this._$storyColRight.append(oItem.$());

          }

          return oItem;
        },

        buildStory : function(oVisitItem) {
          var oItem = Cotton.UI.Story.Item.Element(oVisitItem);
          oItem.appendTo(this);
          return oItem;
        },

        remove : function() {
          this._$storyHomepage.remove();
          // this._$storyLine.remove();
          this._$storyHomepage = null;
          _oCurrentlyOpenStoryline = null;
        },

        $ : function() {
          return this._$storyHomepage;
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
})();
