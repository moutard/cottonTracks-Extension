"use strict";

Cotton.UI.Stand.Cheesecake.Card.Content.QuoteHolder = Class.extend({

  /**
   * {Array of Cotton.Model.ExtractedParagraph} list of best paragraphs for the historyItem
   **/
  _lParagraphs : null,

  /**
   * {array of Cotton.UI.Stand.Cheesecake.Card.Content.Quote} list of the quote objects
   **/
  _lQuotes : null,

  /**
   * {DOM} container for all the quotes dom paragraphs
   **/
  _$quote_holder : null,

  init : function(oHistoryItem, oGlobalDispatcher) {
    var l$quotes = [];
    // if there is a featured image, we constrain the width of the quote in advance
    // by adding the ct-with_image class to the quote holder.
    // we do this because the height of the quote holder will be naturally impacted
    // and we need this size to set the height of the card once the quotes are
    // generated, then only to append the image
    this._$quote_holder = $('<div class="ct-quote_holder"></div>');

    if (oHistoryItem.extractedDNA().description()) {
      var $quote = $('<p class="ct-paragraph"></p>').text(oHistoryItem.extractedDNA().description());
      var $quote_border = $('<div class="ct-quote_border"></div>');
      var $delete_quote = $('<div class="ct-delete_quote"></div>');
      $quote.append($quote_border.append($delete_quote));
      l$quotes.push($quote);
    }


    this._lParagraphs = oHistoryItem.extractedDNA().paragraphs().sort(function(a,b){
      return a.id() - b.id();
    });

    // filter paragraphs with no quotes
    var iLength = this._lParagraphs.length;
    var lTempParagraphs = [];
    for (var i = 0; i < iLength; i++) {
      var oParagraph = this._lParagraphs[i];
      if (oParagraph.quotes().length > 0) {
        lTempParagraphs = lTempParagraphs.concat(oParagraph);
      }
    }
    this._lParagraphs = lTempParagraphs;

    // new length of the array of only paragraphs that contain quotes
    iLength = this._lParagraphs.length;
    if (iLength > 0) {
      this._lQuotes = [];
      for (var i = 0; i < iLength; i++) {
        var oQuote = new Cotton.UI.Stand.Cheesecake.Card.Content.Quote(this._lParagraphs[i]);
        this._lQuotes.push(oQuote);
        // oQuote l$ method returns an array of dom elements
        l$quotes = l$quotes.concat(oQuote.l$());
      }
    }
    this._$quote_holder.append(l$quotes);
  },

  $ : function() {
    return this._$quote_holder;
  },

  purge : function() {
    this._lParagraphs = null;

    if (this._lQuotes) {
      var iLength = this._lQuotes.length;
      for (var i = 0; i < iLength; i++) {
        this._lQuotes[i].purge();
        this._lQuotes[i] = null;
      }
    this._lQuotes = null;

    this._$quote_holder.remove();
    this._$quote_holder = null;
    }
  }

});