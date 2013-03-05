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
  _$readerSelectorCursor : null,

  init : function(oItemContent){
	self = this;
	
    this._$reader = $('<div class="item-reader"></div>');
    this._$readerSelector = $('<div class="item-reader_selector"></div>')
    this._$readerContent = $('<div class="item-reader_content"></div>')
    this._$readerBestSelector = (oItemContent.item().visitItem().extractedDNA().paragraphs().length > 0) ? $('<p class="reader_best_selector">Best</p>') : $('');
    this._$readerQuoteSelector = (oItemContent.item().visitItem().extractedDNA().highlightedText().length > 0) ? $('<p class="reader_quote_selector">Quotes</p>') : $('');
    this._$readerWholeSelector = $('<p class="reader_whole_selector">Whole Article</p>');
    this._$readerSelectorCursor = $('<div class="reader_selector_cursor"></div>');

    //bug! .css(prop,value) doesn't want to work on 
    //self._$readerSelectorCursor. Hence the $(".reader_selector_cursor")
    this._$readerBestSelector.click(function(){
	  $(this).siblings(".reader_selector_cursor").css('left', '35px');
    });
    this._$readerQuoteSelector.click(function(){
	  $(this).siblings(".reader_selector_cursor").css('left', '142px');
    })
    this._$readerWholeSelector.click(function(){
	  $(this).siblings(".reader_selector_cursor").css('left', '275px');
    });

    //set values
    //paragraphs
    var sFirstParagraph = oItemContent.item().visitItem().extractedDNA().firstParagraph();
    var $paragraph = (sFirstParagraph !== "") ? $('<p>' + sFirstParagraph + '</p>') : $('');
    this._$readerContent.append($paragraph);
    _.each(oItemContent.item().visitItem().extractedDNA().paragraphs(), function(oParagraph){
      if((oParagraph.text() !== sFirstParagraph) && (oParagraph.text() !== "")) {
        $paragraph = $('<p>' + oParagraph.text() + '</p>');
        self._$readerContent.append($paragraph);
	  }
	});

    //construct element
    this._$reader.append(
      this._$readerSelector.append(
        this._$readerBestSelector,
        this._$readerQuoteSelector,
        this._$readerWholeSelector,
        this._$readerSelectorCursor
	  ),
      this._$readerContent
    );

  },

  $ : function(){
    return this._$reader;
  }
});