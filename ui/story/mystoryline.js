'use strict';

(function() {

  /**
   * We keep the currently open storyline in order to close it if we try to open
   * a new one later.
   */
  var _oCurrentlyOpenStoryline = null;

  Cotton.UI.Story.Storyline = Class.extend({
    _$storyHomepage : null,
    _$storyLine : null,
    _$storyColLeft : null,
    _$storyColRight : null,

    /**
     * A jQuery DOM object representing the vertical line joining all items.
     */
    init : function() {

      Cotton.UI.Story.Storyline.removeAnyOpenStoryline();

      this._$storyHomepage = $('<div class="ct-story-homepage"></div>');
      this._$storyLine = $('<div class="ct-mystoryLine"></div>');
      this._$storyColLeft = $('<div class="ct-storyColLeft"></div>');
      this._$storyColRight = $('<div class="ct-storyColRight"></div>');

      // $('#ct-story-homepage').append(this._$storyLine);
      // this._$storyLine.append(this._$storyColLeft);
      // this._$storyLine.append(this._$storyColRight);

      $('#ct-story-homepage').append(this._$storyColLeft);
      $('#ct-story-homepage').append(this._$storyLine);
      $('#ct-story-homepage').append(this._$storyColRight);
      $('#ct-story-homepage').css('display', '');
      $('#ct-story-homepage').addClass('clearfix');
      // TODO(fwouts): Improve/cleanup.
      this._$storyLine.css({
      // height : window.innerHeight
      });

      _oCurrentlyOpenStoryline = this;
    },

    addVisitItem : function(oVisitItem, sParam) {
      var oItem = new Cotton.UI.Story.Item(oVisitItem);
      if (sParam === "left") {
        oItem.setSide('left');
        this._$storyColLeft.append(oItem.$());
      } else if (sParam === "right") {
        oItem.setSide('right');
        this._$storyColRight.append(oItem.$());
      }
    },

    buildStory : function(oVisitItem) {
      var oItem = new Cotton.UI.Story.Item(oVisitItem);
      oItem.appendTo(this);
      return oItem;
    },

    remove : function() {
      this._$storyLine.remove();
      this._$storyLine = null;
      _oCurrentlyOpenStoryline = null;
    },

    $ : function() {
      return this._$storyLine;
    }
  });

  // Static methods.
  _.extend(Cotton.UI.Story.Storyline, {
    removeAnyOpenStoryline : function() {
      if (_oCurrentlyOpenStoryline) {
        _oCurrentlyOpenStoryline.remove();
      }
    }
  });
})();
