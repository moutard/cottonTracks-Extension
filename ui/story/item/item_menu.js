'use strict';

/**
 * Item Description Contains title and first paragraph
 */
Cotton.UI.Story.Item.Menu = Class
    .extend({

      _oItemContent : null,

			_$itemInfo : null,
      _$itemMenu : null,

			_$remove : null,
  		_$openLink : null,
  		_$open : null,
	  	_$expand : null,

      init : function(oItemContent) {
        var self = this;

        // current parent element.
        this._oItemContent = oItemContent;

        // parent DOM element (in info).
        this._$itemInfo = this._oItemContent.itemInfo().$();

       // current item
        this._$itemMenu = $('<div class="ct-label-small-menu"></div>');
				
        // current sub elements
		    this._$remove = $('<p>Remove</p>');
		    this._$openLink = $('<a href=""></a>');
		    this._$open = $('<p>Open</p>');
		    this._$expand = $('<p>Expand</p>');
		
        // set values

		    // Link
				// url
		    var sUrl = this._oItemContent.item().visitItem().url();
		    self._$openLink.attr('href',sUrl);
		
        // construct item
        self._$itemInfo.append(
          self._$itemMenu.append(
	  			  self._$remove,
		  		  self._$openLink.append(self._$open),
			  	  self._$expand
  				)
        );
      },

      $ : function() {
        return this._$item_menu;
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
