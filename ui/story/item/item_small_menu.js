'use strict';

/**
 * Item Description Contains title and first paragraph
 */
Cotton.UI.Story.Item.SmallMenu = Class.extend({

  _oItemContent : null,

  _$itemMenu : null,

  _$remove : null,
  _$openLink : null,
  _$open : null,
  _$expand : null,
  _$collapse : null,
  _$getContent : null,
  _bGettingContent : null,

  init : function(oItemContent) {
    var self = this;

    // current parent element.
    this._oItemContent = oItemContent;

    // current item
    this._$itemMenu = $('<div class="ct-label-small-menu"></div>');

    // current sub elements
    this._$remove = $('<p>Remove</p>');
    this._$openLink = $('<a href="" target="_blank"></a>');
    this._$open = $('<p>Open</p>');
    var bParagraph = (oItemContent.item().visitItem().extractedDNA().paragraphs().length > 0)
      || (oItemContent.item().visitItem().extractedDNA().firstParagraph() !== "");
    this._$expand = (bParagraph) ? $('<p class="expand">Expand</p>') : $('');
    this._$getContent = (bParagraph) ? $('') : $('<p class="get_content">Get Content</p>');
    this._$collapse =  $('<p class="collapse">Collapse</p>');

    this._$remove.click(function(){
      //TODO(rkorach): use only one db for the whole UI
	    self._oDatabase = new Cotton.DB.IndexedDB.Wrapper('ct', {
		      'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS
		  }, function() {
		    self._oDatabase.delete('visitItems', self._oItemContent.item().visitItem().id(),
		      function() {
			      self._oItemContent.item().container().isotope('remove',
              self._oItemContent.item().$());
		    });
		  });
		});


    //expand reader
		this._$expand.click(function(){
      oItemContent.item().$().css('height', '630px');
      self.$().addClass("visible_action_menu");
      oItemContent.item().container().isotope('reLayout');
      $(this).hide();
      self._$collapse.show();
    });

    //collapse reader
    this._$collapse.click(function(){
      oItemContent.item().$().css('height', '150px');
      oItemContent.item().container().isotope('reLayout');
      self.$().removeClass("visible_action_menu");
      $(this).hide();
      self._$expand.show();
    });

    //get content
	  this._$getContent.click(function(){
		  chrome.tabs.create({
		  	"url" : self._oItemContent.item().visitItem().url(),
			  "active" : false
		  });
		  self._bGettingContent = true;
	  });

	  chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	    if (request["action"] == "get_content"
        && sender.tab.url == self._oItemContent.item().visitItem().url()
        && self._bGettingContent) {
	        self._bGettingContent = false;
	        chrome.tabs.remove(sender.tab.id);
	        self._oItemContent.item().reload();
      }
		});

    // url
    var sUrl = this._oItemContent.item().visitItem().url();
    self._$openLink.attr('href',sUrl);

    // construct item
    self._$itemMenu.append(
      self._$openLink.append(self._$open),
      self._$remove,
      self._$expand,
      self._$collapse,
      self._$getContent
    );

    // if the item is constructed from a reload (i.e getContent), expand it.
		if (this._oItemContent.item().isReloaded()){
	    self._$expand.click();
    }
  },

  $ : function() {
    return this._$itemMenu;
  },

  appendTo : function(oItemContent) {
    oItemContent.$().append(this._$itemMenu);
  },

});
