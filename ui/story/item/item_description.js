'use strict';

/**
 * Item Description Contains title and first paragraph
 */
Cotton.UI.Story.Item.Description = Class
    .extend({

      _oItemContent : null,

      _$item_description : null,

      _$title : null,
      _$first_paragraph : null,
      _$quote : null,

      init : function(oItemContent) {
        var self = this;

        // current parent element.
        this._oItemContent = oItemContent;

        // current item.
        this._$item_description = $('<div class="ct-item_description"></div>');

        // current sub elements
        this._$title = $('<h2></h2>');
        this._$first_paragraph = $('<p></p>');
        this._$first_paragraph = $('<p class="ct-quote"></p>');

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
        // First Paragraph
        if (this._oItemContent._oItem._oVisitItem.extractedDNA()
            .firstParagraph() !== "") {
          this._$first_paragraph.text(this._oItemContent._oItem._oVisitItem
              .extractedDNA().firstParagraph());
        } else {
          this._$first_paragraph = null;
        }

        // construct item
        this._$item_description.append(this._$title, this._$first_paragraph);

        // event tracking
        this._$title.click(function() {
          Cotton.ANALYTICS.clickDefaultItemTitle();
        });
      },

      $ : function() {
        return this._$item_description;
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
