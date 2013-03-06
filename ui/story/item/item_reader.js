'use strict'

/**
 * Expanded block in default items
 */

Cotton.UI.Story.Item.Reader = Class.extend({
  _$reader : null,
  _$readerSelector : null,
  _$readerBestSelector : null,
  _$readerQuoteSelector : null,
  _$readerWholeSelector : null,
  _$readerBestContent : null,
  _$readerQuoteContent : null,
  _$readerWholeContent : null,
  _$readerSelectorCursor : null,
  _oVisitItem : null,

  init : function(oItemContent){
	self = this;
	this._oVisitItem = oItemContent.item().visitItem();

	this._bWhole = this._oVisitItem.extractedDNA().allParagraphs().length > 0;
	this._bBest = (this._oVisitItem.extractedDNA().paragraphs().length > 0) || (this._oVisitItem.extractedDNA().firstParagraph() != "");
	this._bQuote = this._oVisitItem.extractedDNA().highlightedText().length > 0;
		
    this._$reader = $('<div class="item-reader"></div>');
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
      _.each(this._oVisitItem.extractedDNA().allParagraphs(), function(sParagraph){
        if(sParagraph !== "") {
          var $paragraph = $('<p>' + sParagraph + '</p>');
          self._$readerWholeContent.append($paragraph);
        }
      });
    }

    //Best paragraphs
    var $paragraph = $('<p class="default_text">After you read an article, find all its best parts automatically sorted here</p>');
    self._$readerBestContent.append($paragraph);
    if (this._bBest){
	  self._$readerBestContent.empty();
	  var sFirstParagraph = this._oVisitItem.extractedDNA().firstParagraph();
	  if (sFirstParagraph != ""){
        var $paragraph = $('<p>' + sFirstParagraph + '</p>');
        self._$readerBestContent.append($paragraph);
	  }
      _.each(this._oVisitItem.extractedDNA().paragraphs(), function(oParagraph){
        if(oParagraph.text() !== "" && oParagraph.text() !== sFirstParagraph) {
          var $paragraph = $('<p>' + oParagraph.text() + '</p>');
          self._$readerBestContent.append($paragraph);
        }
      });
    }

    //Quotes
    var $quote = $('<p class="default_text">Highlight or copy/paste a quote in a article and find it back in this section</p>');
    self._$readerQuoteContent.append($quote);
	if (this._bQuotes){
      self._$readerQuoteContent.empty();
      _.each(this._oVisitItem.extractedDNA().highlightedText(), function(sQuote){
        if(sQuote !== "") {
          var $quote = $('<p>' + sQuote + '</p>');
          self._$readerQuoteContent.append($quote);
        }
      });
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
      $(this).siblings(".reader_selector_cursor").css('left', '35px');
      $(this).parent().siblings(".item-reader_content").hide();
      $(this).parent().siblings(".item-reader_best_content").show();
    });
    this._$readerQuoteSelector.click(function(){
	  $(this).siblings(".reader_selector_cursor").css('left', '142px');
      $(this).parent().siblings(".item-reader_content").hide();
      $(this).parent().siblings(".item-reader_quote_content").show();
    })
    this._$readerWholeSelector.click(function(){
	  $(this).siblings(".reader_selector_cursor").css('left', '275px');
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
	  this._$readerSelectorCursor.css('left','275px');
    } else if (this._bBest){
	  this._$readerBestContent.show();
	  this._$readerSelectorCursor.css('left','35px');
    }  else {
      this._$readerQuoteContent.show();
	  this._$readerSelectorCursor.css('left','142px');
    }
  },

});