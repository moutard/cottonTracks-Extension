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

  init : function(oHistoryItemDNA, iHistoryItemId, oDispatcher){
    var self = this;

    this._oHistoryItemDNA = oHistoryItemDNA;
    this._oDispatcher = oDispatcher;
    this._iHistoryItemId = iHistoryItemId;

    // current element
    this._$reader = $('<div class="ct-content_reader"></div>');

    //construct element
    this._$article = $('<div class="ct-reader_article"></div>').scroll(function(){
      if (!self._bScrolled){
        Cotton.ANALYTICS.scrollReader();
        self._bScrolled = true;
      }
    });

    this._oDispatcher.subscribe('reader:expand', this, function(dArguments){
      if (this._iHistoryItemId === dArguments['id']){
        this.$().addClass('expanded');
        this.fitToWindow();
      }
    });

    this._oDispatcher.subscribe('reader:collapse', this, function(dArguments){
      if (this._iHistoryItemId === dArguments['id']){
        this.$().removeClass('expanded');
        this.$().height(0);
        this._$article.height(0);
      }
    });

    $(window).resize(function(){
      if (self.$().hasClass('expanded')){
        self.fitToWindow();
      }
    });

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
      if (sFirstParagraph && sFirstParagraph !== ""){
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
  },

  fitToWindow : function(){
    if (this.$().hasClass('expanded')){
      var sHeight = $(window).height();
      // 150: height of a card
      // 10: top and bottom margin in the window
      // 40: height of the scrollbar
      this.$().height(Math.min(sHeight - 150 - 10 - 10 - 40, 480));
      // 10: added top and bottom margin in the reader
      this._$article.height(Math.min(sHeight - 150 - 10 - 10 - 10 - 10 - 40, 460))
    }
  }

});