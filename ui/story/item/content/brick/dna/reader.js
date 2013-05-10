'use strict'

/**
 * Reader is for default elements. It contains three reader modes:
 * best(paragraphs), quotes, and whole article. And the reader selector
 * bar to toggle between these 3 modes
 */

Cotton.UI.Story.Item.Content.Brick.Dna.Reader = Class.extend({

  _oHistoryItemDNA : null,

  // current element.
  _$reader : null,
  _bScrolled : null,

  init : function(oHistoryItemDNA){
    var self = this;

    this._oHistoryItemDNA = oHistoryItemDNA;

    // current element
    this._$reader = $('<div class="ct-content_reader"></div>');

    //construct element
    this._$article = $('<div class="ct-reader_article"></div>').scroll(function(){
      if (!self._bScrolled){
        Cotton.ANALYTICS.scrollReader();
        self._bScrolled = true;
      }
    });
    ;
    this.setReader();
    this._$top_shadow = $('<div class="ct-reader_shadow top"></div>');
    this._$bottom_shadow = $('<div class="ct-reader_shadow bottom"></div>');
    this._$reader.append(
      this._$article,
      this._$top_shadow,
      this._$bottom_shadow
    );
  },

  $ : function(){
    return this._$reader;
  },

  recycle : function(oDNA, bHasExpand){
    if (bHasExpand){
      this._oHistoryItemDNA = oDNA;
      this.setReader();
    }
  },

  setReader : function(){
    var self = this;
    var lBestParagraphs = this._oHistoryItemDNA.paragraphs();
    var lHighlightedText = this._oHistoryItemDNA.highlightedText();

    if (lBestParagraphs.length === 0){
      var sFirstParagraph = this._oHistoryItemDNA.firstParagraph();
      if (sFirstParagraph !== ""){
        var $paragraph = $('<p>' + sFirstParagraph + '</p>');
        self._$article.append($paragraph);
      }
    } else{
      for (var i = 0, oParagraph; oParagraph = lBestParagraphs[i]; i++) {
        if(oParagraph.text() !== ""){
          var sParagraph = "" + oParagraph.text();
          for (var j = 0, sQuote; sQuote = oParagraph.quotes()[j]; j++){
            sParagraph = sParagraph.slice(0,sQuote['start'])
            + '<span class="quote">' + sParagraph.slice(sQuote['start'], sQuote['end'])
            + '</span>' + sParagraph.slice(sQuote['end'], sParagraph.length);
          }
          var $paragraph = $('<p class="best">' + sParagraph + '</p>');
          self._$article.append($paragraph);
        }
      }
    }
  }

});