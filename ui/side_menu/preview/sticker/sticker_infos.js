'use strict';

/**
 *   Infos on the story: title and content details
 **/

Cotton.UI.SideMenu.Preview.Sticker.Infos = Class.extend({

  /**
   * {Cotton.Messaging.Dispatcher} dispatcher for UI
   */
  _oDispatcher : null,

  _$stickerInfos : null,
  _$stickerTitle : null,
  _$stickerDetails : null,

  init: function(sStoryTitle, oDispatcher, sTypeOfSticker, iNumberOfItems){
    var self = this;
	  this._oDispatcher = oDispatcher;

    // Current element.
	  this._$stickerInfos = $('<div class="ct-sticker_infos"></div>');

    // Sub elements.
	  this._$stickerTitle = $('<div class="ct-sticker_title"></div>').text(sStoryTitle);
    if (sTypeOfSticker === "currentStory"){
      this._$stickerTitle.attr('contenteditable','true').blur(function(){
        self._oDispatcher.publish("edit_title", {"title": $(this).text()});
      }).keypress(function(e){
        if (e.which === 13){
          $(this).blur();
          e.preventDefault();
        }
      });
    }
	  this._$stickerDetails = $('<div class="ct-sticker_details"></div>');

    //Count details
    // FIXME(rmoutard): put text in a div to.
    // FIXME(rmoutard) do not use space, use css.
    var $bull = $('<span class="bull"> &bull; </span>');
    var $bull2 = $('<span class="bull"> &bull; </span>');
    var $articles_count = $('<span class="articles_count">0 article(s)</span>');
    var $images_count = $('<span><span class="images_count">0 images(s)</span>');
    var $videos_count = $('<span><span class="videos_count">0 videos</span>');
    if (iNumberOfItems){
      var $total_count = $('<span><span class="total_count">' + iNumberOfItems + ' cards</span>');
    }


    this._oDispatcher.subscribe('filter:update', this, function(dArguments){
      switch (dArguments['type']){
        case 'article':
        $articles_count.text(dArguments['count'] + ' article(s)');
        break;
        case 'video':
        $videos_count.text(dArguments['count'] + ' video(s)');
        break;
        case 'image':
        $images_count.text(dArguments['count'] + ' image(s)');
        break;
      }
    });

    //construct element
    if (sTypeOfSticker === 'currentStory'){
  	  this._$stickerInfos.append(
	      this._$stickerTitle,
        this._$stickerDetails.append(
            $articles_count,
            $bull,
            $images_count,
            $bull2,
            $videos_count
          )
	    );
    } else if (sTypeOfSticker === 'relatedStory'){
      this._$stickerInfos.append(
  	    this._$stickerTitle,
        this._$stickerDetails.append(
          $total_count
        )
  	  );
    }
  },

  $ : function() {
	  return this._$stickerInfos;
  }

});
