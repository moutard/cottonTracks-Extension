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
    this._$getContent = (bParagraph) ? $('') : $('<p>Get Content</p>');
    this._$collapse =  $('<p class="collapse">Collapse</p>');

    this._$expand.click(function(){
      oItemContent.item().$().css('height', '630px');
      oItemContent.item().container().isotope('reLayout');
      $(this).toggle();
      self._$collapse.toggle();
    });

    this._$collapse.click(function(){
      oItemContent.item().$().css('height', '150px');
      oItemContent.item().container().isotope('reLayout');
      $(this).toggle();
      self._$expand.toggle();
    });

    // url
    var sUrl = this._oItemContent.item().visitItem().url();
    self._$openLink.attr('href',sUrl);

    // construct item
    self._$itemMenu.append(
      self._$openLink.append(self._$open),
      self._$expand,
      self._$collapse,
      self._$getContent
    );
  },

  $ : function() {
    return this._$itemMenu;
  },

  appendTo : function(oItemContent) {
    oItemContent.$().append(this._$itemMenu);
  },

});
