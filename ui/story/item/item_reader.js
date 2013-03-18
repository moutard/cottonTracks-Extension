'use strict'

/**
 * Item_reader is for default elements. It contains three reader modes:
 * best(paragraphs), quotes, and whole article. And the reader selector
 * bar to toggle between these 3 modes
 */

Cotton.UI.Story.Item.Reader = Class.extend({

  _oItemContent :null,
  _oHistoryItem : null,

  _$reader : null,
  _$readerSelector : null,
  _$readerBestSelector : null,
  _$readerQuoteSelector : null,
  _$readerWholeSelector : null,
  _$readerBestContent : null,
  _$readerQuoteContent : null,
  _$readerWholeContent : null,
  _$readerSelectorCursor : null,

  _bWhole : null,
  _bBest : null,
  _bQuotes : null,

  init : function(oItemContent){
    self = this;
    this._oHistoryItem = oItemContent.item().historyItem();

    this._bWhole = this._oHistoryItem.extractedDNA().allParagraphs().length > 0;
    this._bBest = (this._oHistoryItem.extractedDNA().paragraphs().length > 0) || (this._oHistoryItem.extractedDNA().firstParagraph() != "");
    this._bQuotes = this._oHistoryItem.extractedDNA().highlightedText().length > 0;

    // current element
    this._$reader = $('<div class="item-reader"></div>');

    // current sub elements
    this._$readerBestContent = $('<div class="item-reader_content item-reader_best_content"></div>');
    this._$readerQuoteContent = $('<div class="item-reader_content item-reader_quote_content"></div>');
    this._$readerWholeContent = $('<div class="item-reader_content item-reader_whole_content"></div>');
    this._$readerSelector = $('<div class="item-reader_selector"></div>');
    this._$readerBestSelector = $('<p class="reader_best_selector">Best</p>');
    this._$readerQuoteSelector = $('<p class="reader_quote_selector">Quotes</p>');
    this._$readerWholeSelector = $('<p class="reader_whole_selector">Whole Article</p>');
    this._$readerSelectorCursor = $('<div class="reader_selector_cursor"></div>');

    //set values
    //all paragraphs
    if (this._bWhole){
      for (var i = 0, lAllParagraphs = this._oHistoryItem.extractedDNA().allParagraphs(),
        iLength = lAllParagraphs.length; i < iLength; i++) {
          var sParagraph = lAllParagraphs[i];
          if(sParagraph !== "") {
            var $paragraph = $('<p>' + sParagraph + '</p>');
            self._$readerWholeContent.append($paragraph);
          }
      }
    }

    //Best paragraphs
    var $paragraph = $('<p class="default_text">After you read an article, find all its best parts automatically sorted here</p>');
    self._$readerBestContent.append($paragraph);
    if (this._bBest){
      self._$readerBestContent.empty();
      var sFirstParagraph = this._oHistoryItem.extractedDNA().firstParagraph();
      if (sFirstParagraph != ""){
        var $paragraph = $('<p>' + sFirstParagraph + '</p>');
        self._$readerBestContent.append($paragraph);
      }
      for (var i = 0, lParagraphs = this._oHistoryItem.extractedDNA().paragraphs(),
        iLength = lParagraphs.length; i < iLength; i++) {
          var oParagraph = lParagraphs[i];
          if(oParagraph.text() !== "" && oParagraph.text() !== sFirstParagraph) {
            var $paragraph = $('<p>' + oParagraph.text() + '</p>');
            self._$readerBestContent.append($paragraph);
          }
      }
    }

    //Quotes
    var $quote = $('<p class="default_text">Highlight or copy/paste a quote in a article and find it back in this section</p>');
    self._$readerQuoteContent.append($quote);
    if (this._bQuotes){
      self._$readerQuoteContent.empty();
      for (var i = 0,
        lHighlightedText = this._oHistoryItem.extractedDNA().highlightedText(),
        iLength = lHighlightedText.length; i < iLength; i++) {
          var sQuote = lHighlightedText[i];
          if(sQuote !== "") {
            var $quote = $('<p>' + sQuote + '</p>');
            self._$readerQuoteContent.append($quote);
          }
      }
    }

    //choose content to display
    this.chooseContent();

    //construct element
    this._$reader.append(
      this._$readerSelector.append(
        this._$readerBestSelector,
        this._$readerQuoteSelector,
        this._$readerWholeSelector,
        this._$readerSelectorCursor
      ),
      this._$readerBestContent,
      this._$readerQuoteContent,
      this._$readerWholeContent
    );

    //bug! .css(prop,value) doesn't want to work on
    //self._$readerSelectorCursor. Hence the $(".reader_selector_cursor")
    this._$readerBestSelector.click(function(){
      $(this).siblings(".reader_selector_cursor").addClass('on_best');
      $(this).siblings(".reader_selector_cursor").removeClass('on_quote on_whole');
      $(this).parent().siblings(".item-reader_content").hide();
      $(this).parent().siblings(".item-reader_best_content").show();
    });
    this._$readerQuoteSelector.click(function(){
      $(this).siblings(".reader_selector_cursor").addClass('on_quote');
      $(this).siblings(".reader_selector_cursor").removeClass('on_whole on_best');
      $(this).parent().siblings(".item-reader_content").hide();
      $(this).parent().siblings(".item-reader_quote_content").show();
    })
    this._$readerWholeSelector.click(function(){
      $(this).siblings(".reader_selector_cursor").addClass('on_whole');
      $(this).siblings(".reader_selector_cursor").removeClass('on_quote on_best');
      $(this).parent().siblings(".item-reader_content").hide();
      $(this).parent().siblings(".item-reader_whole_content").show();
    });

  },

  $ : function(){
    return this._$reader;
  },

  chooseContent : function(){
    if (this._bWhole){
      this._$readerWholeContent.show();
      this._$readerSelectorCursor.addClass('on_whole');
    } else if (this._bBest){
      this._$readerBestContent.show();
      this._$readerSelectorCursor.addClass('on_best');
    }  else {
      this._$readerQuoteContent.show();
      this._$readerSelectorCursor.addClass('on_quote');
    }
  },

});