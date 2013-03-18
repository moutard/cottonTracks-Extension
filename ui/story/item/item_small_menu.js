'use strict';

/**
 * Item_small_menu is the action menu for items with a small label
 * Contains remove, open buttons
 * Contains getContent/expand if item_type is default
 */
Cotton.UI.Story.Item.SmallMenu = Class.extend({

  _oItemContent : null,

  _extractedDNA : null,

  _$itemMenu : null,

  _$remove : null,
  _$openLink : null,
  _$open : null,
  _$expand : null,
  _$collapse : null,
  _$getContent : null,
  _$loading : null,
  _bGettingContent : null,

  init : function(oItemContent) {
    var self = this;

    this._extractedDNA = oItemContent.item().historyItem().extractedDNA();

    // current parent element.
    this._oItemContent = oItemContent;

    // current item
    this._$itemMenu = $('<div class="ct-label-small-menu"></div>');

    // current sub elements
    this._$remove = $('<p>Remove</p>');
    this._$openLink = $('<a href="" target="_blank"></a>');
    this._$open = $('<p>Open</p>');
    var bParagraph = ((this._extractedDNA.allParagraphs().length > 0)
      || (this._extractedDNA.paragraphs().length > 0)
      || (this._extractedDNA.firstParagraph() != "") );
    this._$expand = (bParagraph) ? $('<p class="expand">Expand</p>') : $('');
    //do not append 'Get Content' if it has already been performed or
    //if there is a paragraph
    this._$getContent = (bParagraph || this._oItemContent.item().isReloaded()
      || oItemContent.item().itemType() !== "default") ? $('')
      : $('<p class="get_content">Get Content</p>');
    this._$collapse =  $('<p class="collapse">Collapse</p>');
    this._$loading =  $('<img class="loading" src="/media/images/story/item/default_item/loading.gif">');

    //set actions on buttons
    //remove element
    this._$remove.click(function(){
      //TODO(rkorach): use only one db for the whole UI
      self._oDatabase = new Cotton.DB.IndexedDB.Wrapper('ct', {
          'historyItems' : Cotton.Translators.HISTORY_ITEM_TRANSLATORS
      }, function() {
        self._oDatabase.delete('historyItems',
          self._oItemContent.item().historyItem().id(),
          function() {
            self._oItemContent.item().container().isotope('remove',
              self._oItemContent.item().$(), function() {
                Cotton.UI.WORLD.countItems();
            });
        });
      });
    });

    //expand reader
    this._$expand.click(function(){
      oItemContent.item().$().addClass('expanded');
      self.$().addClass("visible_action_menu");
      oItemContent.item().container().isotope('reLayout');
      $(this).hide();
      self._$collapse.show();
    });

    //collapse reader
    this._$collapse.click(function(){
      oItemContent.item().$().removeClass('expanded');
      oItemContent.item().container().isotope('reLayout');
      self.$().removeClass("visible_action_menu");
      $(this).hide();
      self._$expand.show();
    });

    //get content
    this._$getContent.click(function(){
      chrome.tabs.create({
          "url" : oItemContent.item().historyItem().url(),
          "active" : false
      }, function(tab){
        chrome.extension.sendMessage({
          'action': "get_content_tab",
          'params': {
            'tab_id': tab.id
          }
        });
      });
      $(this).parent().append(self._$loading);
      $(this).hide();
    });

    chrome.extension.onMessage.addListener(function(request, sender, sendResponse){
      if (request['action'] === 'refresh_item' &&
        request['params']['itemId'] === self._oItemContent.item().historyItem().id()){
          self._oItemContent.item().reload();
      }
    });

    // url
    var sUrl = this._oItemContent.item().historyItem().url();
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

});
