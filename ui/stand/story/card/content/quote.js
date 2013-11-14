"use strict";

Cotton.UI.Stand.Story.Card.Content.Quote = Class.extend({

  /**
   * {array of DOM} array of DOM quote paragraphs
   **/
  _l$quotes : null,

  /**
   * {string} full paragraph text
   **/
  _sText : null,

  /**
   * {array of dict} sorted quotes from paragraph model : {'start': iStart, 'end': iEnd}
   **/
  _lQuotes : null,

  init : function(oParagraphWithQuotes) {
    this._l$quotes = [];

    this._sText = oParagraphWithQuotes.text();

    // sort the quotes in the right order
    this._lQuotes = oParagraphWithQuotes.quotes().sort(function(a,b){
      return a['start'] - b['start'];
    });

    var iLength = this._lQuotes.length;
    for (var i = 0; i < iLength; i++) {
      // new quoted sentence, we create a new dom paragraph
      var $quote = $('<p class="ct-paragraph"></p>');
      // border on the left with the vertical line.
      var $quote_border = $('<div class="ct-quote_border"></div>');
      // delete cross palced in the border, vertically centered
      var $delete_quote = $('<div class="ct-delete_quote"></div>');
      // current quote db object
      var dQuote = this._lQuotes[i];
      // parts of the text, with regular spans and styled spans for the quoted part.
      var lParts = [];

      // find start of the sentence for this quote
      // we revert the part before the start of the quote, and see where is the first
      // (reverted) end of sentence punctuation
      var sReverseStart = this._sText.slice(0, dQuote['start']).split('').reverse().join('');
      var iReverseIndex = sReverseStart.search(/\ \.|\ \!|\ \?/gi);
      if (iReverseIndex === -1) {
        // No punctuation before the quote, so this sentence is the first of the text
        var iStartIndex = 0;
      } else {
        // beginning of the sentence is iReverseIndex before the quote
        var iStartIndex = dQuote['start'] - iReverseIndex;
      }
      // add the start of the phrase, and the quote in a span for styling
      lParts.push($('<span></span>').text(
        this._sText.slice(iStartIndex, dQuote['start'])));
      lParts.push($('<span class="ct-quote"></span>').text(
        this._sText.slice(dQuote['start'], dQuote['end'])));

      // find the end of the sentence.
      if (this._sText.slice(dQuote['start'], dQuote['end']).match(/(\.\ |\!\ |\?\ |\.|\!|\?)$/gi)){
        // the quote finishes with a punctuation mark, so the end of the sentence
        // is the end of the quote
        var iEndIndex = dQuote['end'];
      } else {
        // look for the first end-of-sentence-punctuation-mark after the end of the quote.
        // search returns -1 if no result, so iNextEnd == 0 if no result.
        var iNextEnd = this._sText.slice(dQuote['end']).search(/\.\ |\!\ |\?\ /gi) + 1;
        if (iNextEnd === 0) {
          // no punctuation, the end of the sentence is the end of the text
          iEndIndex = this._sText.length;
        } else {
          // punctuation found, the end of the sentence iNextEnd after the end of the quote
          var iEndIndex = iNextEnd + dQuote['end'];
        }
      }

      // check if there are some other quotes in the same sentence, we want to include
      // them directly, and not create a new paragrpah
      while (i + 1 < iLength) {
        var dNextQuote = this._lQuotes[i+1];
        if (iEndIndex > dNextQuote['start']) {
          // next quote begins before the end of the sentence, we add the text between
          // the two quotes, plus the next quote.
          lParts.push($('<span></span>').text(
            this._sText.slice(dQuote['end'], dNextQuote['start'])));
          lParts.push($('<span class="ct-quote"></span>').text(
            this._sText.slice(dNextQuote['start'], dNextQuote['end'])));

          // find the end of the sentence, can be in another sentence if the new quote
          // spans across several sentences
          if (this._sText.slice(dNextQuote['start'], dNextQuote['end']).match(/(\.\ |\!\ |\?\ |\.|\!|\?)$/gi)){
            // the quote finishes with a punctuation mark, so the end of the sentence
            // is the end of the nextquote
            var iEndIndex = dNextQuote['end'];
          } else {
            // look for the first end-of-sentence-punctuation-mark after the end of the
            // new quote.
            var iNextEnd = this._sText.slice(dNextQuote['end']).search(/\.\ |\!\ |\?\ /gi) + 1;
            if (iNextEnd === 0) {
              // no punctuation, the end of the sentence is the end of the text
              iEndIndex = this._sText.length;
            } else {
              // punctuation found, the end of the sentence iNextEnd after the end of the
              // new quote
              var iEndIndex = iNextEnd + dNextQuote['end'];
            }
          }
          // increment i for the while loop
          i++;
          // swap current quote for next quote, either for next loop in while if
          // there is another quote,
          // or for appending the end of the sentence if it was
          // the last quote of this sentence (not of the paragraph!!)
          dQuote = this._lQuotes[i];
        } else {
          // dNextQuote['start'] > iEndIndex
          // the next quote is not in the same sentence
          break;
        }
      }

      // append the very end of the sentence, then put the quote in the dom list
      lParts.push($('<span></span>').text(
        this._sText.slice(dQuote['end'], iEndIndex)));
      $quote.append(lParts);
      $quote.append($quote_border.append($delete_quote));
      this._l$quotes.push($quote);
    }
  },

  l$ : function() {
    return this._l$quotes;
  },

  purge : function() {
    var iLength = this._l$quotes.length;
    for (var i = 0; i < iLength; i++) {
      this._l$quotes[i].empty();
      this._l$quotes[i] = null;
    }
    this._l$quotes = null;

    this._sText = null;
    this._lQuotes = null;
  }

});