'use strict';

/**
 * Item Description Contains title and first paragraph
 */
Cotton.UI.Story.Item.Info = Class
    .extend({

      _oItemContent : null,

			_$itemInfo : null,
			_$info : null,

      _$title : null,
		  _$date : null,
      _$quote : null,
			_iQuoteNumber : null,

			_$itemLabel : null,			
			_$website : null,
			_$favicon : null,
			_$url : null,

      init : function(oItemContent) {
        var self = this;

        // current parent element.
        this._oItemContent = oItemContent;

        // current item.
        this._$itemInfo = $('<div class="ct-item_info"></div>');
				this._$info = $('<div class="info"></div>');
				
        // current sub elements
        this._$title = $('<h3></h3>');

        this._iQuoteNumber =  this._oItemContent.item().visitItem().extractedDNA().highlightedText().length;
        
        if(this._iQuoteNumber > 0){
          this._$quote = $('<div class="ct-quote"><img src="media/images/quote.png"/><h4>' + self._iQuoteNUmber +' Quotes</h4></div>');
        } else {
          this._$quote = $('<div></div>');
      	}
		    this._$history_reference = $('<div class="ct-history_reference"><img src="media/images/story/item/date_clock.png"/></div>');
		    this._$date = $('<h4 class="ct-date"></h4>');
		    this._$itemLabel = $('<div class="ct-label-small"></div>');
				this._$website = $('<div class="website"></div>'); 
				this._$favicon = $('<img class="favicon">');
				this._$url = $('<div class="url"></div>');
				
        // set values

        // Title
        if (this._oItemContent._oItem._oVisitItem.title() !== "") {
          //var $title_link = $('<a></a>');
          //$title_link.attr("href", this._oItemContent._oItem._oVisitItem.url());
          //$title_link.text(this._oItemContent._oItem._oVisitItem.title());

          this._$title.text(this._oItemContent._oItem._oVisitItem.title()).click(function(){
            chrome.tabs.create({
              'url': self._oItemContent._oItem._oVisitItem.url(),
              'selected': true
            });
          });
        }

				// date
		    var oDate = new Date(this._oItemContent._oItem._oVisitItem.visitTime());
		    var lDate = oDate.toDateString().split(" ");
		    this._$date.text(lDate[2] + " " + lDate[1]);
		
        // label

		
        // construct item
        this._$itemInfo.append(
				  self._$title,
	        this._$info.append(
					  self._$history_reference.append(self._$date),
					  self._$quote
					),
          self._$itemLabel.append(
	  			  self._$website.append(
		  			  self._$favicon,
			  		  self._$url
				  	)
				  )
				);

      },

      $ : function() {
        return this._$itemInfo;
      },

      appendTo : function(oItemContent) {
        oItemContent.$().append(this._$item_description);
      },

      /**
       * Make the title editable.
       */
      editTitle : function(bContentItemAlreadyEditable) {
        var self = this;

        if(!self._sTitleAlreadyEditable && !bContentItemAlreadyEditable){
          self._sTitleAlreadyEditable = true;
          // Create an input field to change the title.
          self._$input_title = $('<input class="ct-editable_title" type="text" name="title">');

          // Set the default value, with the current title.
          self._$input_title.val(self._$title.text());
          self._$input_title.keypress(function(event) {
            // on press 'Enter' event.
            if (event.which == 13) {
              var sTitle = self._$input_title.val();
              self._$title.text(sTitle);
              self._$input_title.remove();
              self._$title.show();
              self._sTitleAlreadyEditable = false;

              // Event tracking
              Cotton.ANALYTICS.changeItemTitle();

              // Set the title in the model.
              self._oItemContent.item().visitItem().setTitle(sTitle);
              self._oItemContent.item().visitItemHasBeenSet();
            }
          });
              
          // hide the title and replace it by the input field.
          self._$title.hide();
          self._$input_title.insertAfter(self._$title);
        } else {
          self._$input_title.remove();
          self._$title.show();
          self._sTitleAlreadyEditable = false;
        }
      },

    });
