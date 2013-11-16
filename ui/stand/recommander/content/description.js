"use strict";

Cotton.UI.Stand.Recommander.Content.Description = Class.extend({

  init : function(oRecoItem, oGlobalDispatcher) {
    this._$description = $('<div class="ct-reco_description"></div>');
    this._$title = $('<a class="ct-reco_title" href="' + oRecoItem.url() +'" target="_blank"></a>').text(
      oRecoItem.title()).click(function(){
        oGlobalDispatcher.publish('put_item_in_db', {'history_item': oRecoItem});
      });
    this._$paragraph = $('<div class="ct-reco_text"></div>').html(oRecoItem._sDescription);

    this._$description.append(this._$title, this._$paragraph);
  },

  $ : function() {
    return this._$description;
  },

  purge : function() {
    this._$paragraph.remove();
    this._$paragraph = null;
    this._$title.remove();
    this._$title = null;
    this._$description.remove();
    this._$description = null;
  }
});