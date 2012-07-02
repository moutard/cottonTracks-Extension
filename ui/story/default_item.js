'use strict';

Cotton.UI.Story.DefaultItem = Class.extend({

  _oVisitItem: null,
  _$item: null,
  _$storyLink: null,

  init: function(oVisitItem) {
    this._oVisitItem = oVisitItem;

    this._$item = $('<div class="ct-storyItem ct-storyItem_left"></div>');
    var $content = $('<div class="ct-storyContent"></div>');
    var $deleteButton = $('<div class="ct-storyDelete"></div>');
    var $grabHandle = $('<div class="ct-storyGrab"></div>');
    var $featuredImage = $('<img class="ct-storyFeaturedImage" />');
    var $title = $('<h3></h3>');
    var $legend = $('<span class="ct-legend"></span>');
    var $summary = $('<p></p>');
    var $bottom = $('<div class="ct-item_bottom"></div>');
    var $quote = $('<div class="ct-quote"></div>');

    this._$storyLink = $('<div class="ct-storyItemLink"></div>');

    // TODO(fwouts): Cleanup.
    // $title.text(oVisitItem.title());

    var sUrl = oVisitItem.url();
    // Extracts www.google.fr from http://www.google.fr/abc/def?q=deiubfds.
    var sDomain = sUrl.match(/\/\/([^/]*)\// )[1];
    $legend.text(sDomain);

    var $originLink = $('<a />');
    $originLink
      .attr('href', sUrl)
      .attr('target', '_blank')
      .text(oVisitItem.title());

    // First Paragraph
    if(oVisitItem.extractedDNA().firstParagraph() !== ""){
      $summary.append(oVisitItem.extractedDNA().firstParagraph());
    }

    // TextHighlight
    if(oVisitItem.extractedDNA().highLightedText().length !== 0){
      $quote.text(oVisitItem.extractedDNA().highLightedText()[0]);
    } else {
      $quote.hide()
    }

    // Image Url
    if(oVisitItem.extractedDNA().imageUrl() !== ""){
      $featuredImage.attr("src", oVisitItem.extractedDNA().imageUrl());
    } else {
      //$featuredImage.attr("src", "/media/images/story_preview.png");
    }

    this._$item.append(
        this._$storyLink.append(
            $('<div class="ct-storyItemLinkLine"></div>').append(
                $('<div class="ct-storyItemLinkDot"></div>')
            )
        ),
        $content.append(
            // $deleteButton,
            // $grabHandle,
            $featuredImage,
            $title.append($originLink),
            $legend,
            $summary
        ),
        $bottom,
        $quote
    );
  },

  $ : function(){
    return this._$item;
  },

  appendTo: function(oStoryLine) {
    oStoryLine.$().append(this._$item);
  },

  setTop: function(iTop) {
    this._$item.css({
      top: iTop
    });
  },

  setSide: function(sSide) {
    switch (sSide) {
    case 'left':
      this._$item
        .removeClass('ct-storyItem_right')
        .addClass('ct-storyItem_left');
      break;
    case 'right':
      this._$item
        .removeClass('ct-storyItem_left')
        .addClass('ct-storyItem_right');
      break;
    }
  }
});
