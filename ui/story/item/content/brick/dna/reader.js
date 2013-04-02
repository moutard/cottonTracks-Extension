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

  // sub elements.
  _$select_article_part_radio_button : null,
  _$select_best_button : null,
  _$select_quote_button : null,
  _$select_whole_button : null,
  _$article_best : null,
  _$article_quote : null,
  _$article_whole : null,
  _$readerSelectorCursor : null,

  _bBest : null,
  _bQuotes : null,
  _bWhole : null,

  _bScrolledBest : null,
  _bScrolledQuotes : null,
  _bScrolledWhole : null,

  init : function(oHistoryItemDNA){
    var self = this;

    this._oHistoryItemDNA = oHistoryItemDNA;

    this._bWhole = this._oHistoryItemDNA.allParagraphs().length > 0;
    this._bBest = (this._oHistoryItemDNA.paragraphs().length > 0)
      || (this._oHistoryItemDNA.firstParagraph() != "");
    this._bQuotes = this._oHistoryItemDNA.highlightedText().length > 0;

    // current element
    this._$reader = $('<div class="ct-content_reader"></div>');

    // current sub elements
    // FIXME(rmoutard) only use one article and you change the text.
    this._$article_best  = $('<div class="ct-reader_article show_best"></div>').scroll(
      function(){
        if (!self._bScrolledBest){
          Cotton.ANALYTICS.scrollBestParagraphs();
          self._bScrolledBest = true;
        }
    });
    this._$article_quote = $('<div class="ct-reader_article show_quote"></div>').scroll(
      function(){
        if (!self._bScrolledQuotes){
          Cotton.ANALYTICS.scrollQuotes();
          self._bScrolledQuotes = true;
        }
    });
    this._$article_whole = $('<div class="ct-reader_article show_whole"></div>').scroll(
      function(){
        if (!self._bScrolledWhole){
          Cotton.ANALYTICS.scrollWholeArticle();
          self._bScrolledWhole = true;
        }
    });


    this._$select_article_part_radio_button = $('<div class="ct-select_article_part_radio_button"></div>');
    this._$select_best_button = $('<div class="ct-select_button show_best">Best</div>').click(function(){
      self.changeTab($(this), self._$article_best, 'on_best');
      Cotton.ANALYTICS.bestParagraphs();
    });
    this._$select_quote_button = $('<div class="ct-select_button show_quote">Quotes</div>').click(function(){
      self.changeTab($(this), self._$article_quote, 'on_quote');
      Cotton.ANALYTICS.quotes();
    });
    this._$select_whole_button = $('<div class="ct-select_button show_whole">Whole Article</div>').click(function(){
      self.changeTab($(this), self._$article_whole, 'on_whole');
      Cotton.ANALYTICS.wholeArticle();
    });

    this._$readerSelectorCursor = $('<div class="reader_selector_cursor"></div>');

    //set values
    // Put the whole article.
    if (this._bWhole){
      this.setWhole()
    }

    // Put the best part of the article.
    var $paragraph = $('<p class="default_text">After you read an article, find all its best parts automatically sorted here</p>');
    self._$article_best.append($paragraph);
    if (this._bBest){
      this.setBestParagraphs();
    }

    // Put the quotes of the article.
    var $quote = $('<p class="default_text">Highlight or copy/paste a quote in a article and find it back in this section</p>');
    self._$article_quote.append($quote);
    if (this._bQuotes){
      this.setQuotes();
    }

    //construct element
    this._$reader.append(
      this._$select_article_part_radio_button.append(
        this._$select_best_button,
        this._$select_quote_button,
        this._$select_whole_button,
        this._$readerSelectorCursor
      ),
      this._$article_best,
      this._$article_quote,
      this._$article_whole
    );

    this.changeTab(this._$select_best_button, this._$article_best, 'on_best');
  },

  $ : function(){
    return this._$reader;
  },

  recycle : function(oDNA, bHasExpand){
    if (bHasExpand){
      this._oHistoryItemDNA = oDNA;
      this._bWhole = oDNA.allParagraphs().length > 0;
      if (this._bWhole){
        this.setWhole();
      }
      this._bBest = (oDNA.paragraphs().length > 0)
        || (oDNA.firstParagraph() != "");
      if (this._bQuotes){
        this.setBestParagraphs();
      }
      this._bQuotes = oDNA.highlightedText().length > 0;
      if (this._bQuotes){
        this.setQuotes();
      }
    }
  },

  setBestParagraphs : function(){
    var self = this;
    self._$article_best.empty();
    var sFirstParagraph = this._oHistoryItemDNA.firstParagraph();
    if (sFirstParagraph != ""){
      var $paragraph = $('<p>' + sFirstParagraph + '</p>');
      self._$article_best.append($paragraph);
    }
    for (var i = 0, lParagraphs = this._oHistoryItemDNA.paragraphs(),
      iLength = lParagraphs.length; i < iLength; i++) {
        var oParagraph = lParagraphs[i];
        if(oParagraph.text() !== "" && oParagraph.text() !== sFirstParagraph) {
          var $paragraph = $('<p>' + oParagraph.text() + '</p>');
          self._$article_best.append($paragraph);
        }
    }
    this.changeTab(this._$select_best_button, this._$article_best, 'on_best');
  },

  setQuotes : function(){
    var self = this;
    self._$article_quote.empty();
    for (var i = 0,
      lHighlightedText = this._oHistoryItemDNA.highlightedText(),
      iLength = lHighlightedText.length; i < iLength; i++) {
        var sQuote = lHighlightedText[i];
        if(sQuote !== "") {
          var $quote = $('<p>' + sQuote + '</p>');
          self._$article_quote.append($quote);
        }
    }
  },

  setWhole : function(){
    var self = this;
    for (var i = 0, lAllParagraphs = this._oHistoryItemDNA.allParagraphs(),
      iLength = lAllParagraphs.length; i < iLength; i++) {
        var sParagraph = lAllParagraphs[i];
        if(sParagraph !== "") {
          var $paragraph = $('<p>' + sParagraph + '</p>');
          self._$article_whole.append($paragraph);
        }
    }
    if (!this._bBest){
      this.changeTab(this._$select_whole_button, this._$article_whole, 'on_whole');
    }
  },

  /**
   * @param {jQuery} $button : the clicked button.
   * @param {jQuery} $tab : the tab you want to display.
   */
  changeTab : function($button, $tab, sClass) {

    // Reset all by default.
    this._$select_best_button.removeClass('active');
    this._$select_quote_button.removeClass('active');
    this._$select_whole_button.removeClass('active');

    this._$article_best.hide();
    this._$article_quote.hide();
    this._$article_whole.hide();

    $button.addClass('active');
    $tab.show();
    this._$readerSelectorCursor.removeClass('on_best').removeClass('on_quote')
      .removeClass('on_whole').addClass(sClass);
  }

});
