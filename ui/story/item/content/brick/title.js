'use strict';

/**
 * Contains title
 */
Cotton.UI.Story.Item.Content.Brick.Title = Class.extend({

  /**
   * {Cotton.UI.Story.Item.Content.Element} parent object if one.
   */
  _oItemContent : null,

  /**
   * {String} sTitle
   */
  _sTitle : null,

  /**
   * {DOM} dom element
   */
  _$title : null,


  init : function(sTitle, oItemContent, sUrl) {

    // current parent element.
    this._oItemContent = oItemContent;

    // current item
    this._$title = $('<h3></h3>').text(sTitle);
    if (sUrl){
      this._$title = $('<a href="' + sUrl + '" target="blank"></a>').append(this._$title);
    }

  },

  $ : function() {
    return this._$title;
  }

});
