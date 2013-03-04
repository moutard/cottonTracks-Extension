'use strict'

/**
 * Expanded block in default items
 */

Cotton.UI.Story.Item.Reader = Class.extend({
  _$reader : null,
  _$readerSelector : null,

  init : function(oItemContent){
	self = this;
	
    this._$reader = $('<div class="item-reader"></div>');
    this._$readerSelector = $('<div class="item-reader_selector"></div>')
    this._$readerContent = $('<div class="item-reader_content"></div>')

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
      this._$readerSelector,
      this._$readerContent
    )
  },

  $ : function(){
    return this._$reader;
  }
});