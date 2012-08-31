'use strict';

Cotton.UI.Story.DefaultItem = Class.extend({

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
    this._oItemContent = new Cotton.UI.Story.Item.Content();
    var $content = $('<div class="ct-storyContent"></div>');
    var $deleteButton = $('<div class="ct-storyDelete"></div>');

    var $featuredImage = $('<img class="ct-storyFeaturedImage" />');
    var $title = $('<h3></h3>');
    var $legend = $('<span class="ct-legend"></span>');
    var $summary = $('<p></p>');
    var $quote = $('<div class="ct-quote"></div>');

    this._$storyLink = $('<div class="ct-storyItemLink"></div>');

    var sUrl = oVisitItem.url();
    // Extracts www.google.fr from http://www.google.fr/abc/def?q=deiubfds.
    var oReg = new RegExp("\/\/([^/]*)\/");
    var sDomain = sUrl.match(oReg)[1];
    $legend.text(sDomain);

    var $originLink = $('<a />');
    $originLink.attr('href', sUrl).attr('target', '_blank').text(
        oVisitItem.title());

    // First Paragraph
    if (oVisitItem.extractedDNA().firstParagraph() !== "") {
      $summary.append(oVisitItem.extractedDNA().firstParagraph());
    }

    // TextHighlight
    if (oVisitItem.extractedDNA().highlightedText().length !== 0) {
      $quote.text(oVisitItem.extractedDNA().highlightedText()[0]);
    } else {
      $quote.hide()
    }

    // Image Url
    if (oVisitItem.extractedDNA().imageUrl() !== "") {
      $featuredImage.attr("src", oVisitItem.extractedDNA().imageUrl());
    } else {
      // $featuredImage.attr("src", "/media/images/story_preview.png");
    }

    this._$item.append(
        this._$storyLink.append(
          $('<div class="ct-storyItemLinkLine"></div>').append(
            $('<div class="ct-storyItemLinkDot"></div>')
          )
        ),
        this._oItemContent.$()
    );

    // event tracking
    $title.click(function() {
      Cotton.ANALYTICS.clickDefaultElementTitle();
    });
    $featuredImage.click(function() {
      Cotton.ANALYTICS.clickDefaultElementFeaturedImage();
    });
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
  }
});
