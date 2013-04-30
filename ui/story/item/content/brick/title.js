'use strict';

/**
 * Contains title
 */
Cotton.UI.Story.Item.Content.Brick.Title = Class.extend({

  /**
   * {Cotton.UI.Story.Item.Content.Element} parent object if one.
   */
  _oItem : null,

  /**
   * {String} sTitle
   */
  _sTitle : null,

  /**
   * {DOM} dom element
   */
  _$title : null,


  init : function(sTitle, oItem, sUrl) {

    // current parent element.
    this._oItem = oItem;

    // current item
    this._$title = $('<h3></h3>').text(sTitle);
    if (sUrl){
      this._$title = $('<a href="' + sUrl + '" target="_blank"></a>').append(this._$title);
      this._$title.click(function(){
        Cotton.ANALYTICS.openItem(oItem.type(), 'title');
      });
    }
  },

  $ : function() {
    return this._$title;
  }

});
