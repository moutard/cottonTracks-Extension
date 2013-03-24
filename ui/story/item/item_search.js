'use strict';

/**
 * Search Item content. Contains a search input filed,
 * a title, a small label and small action menu
 */
Cotton.UI.Story.Item.Search = Cotton.UI.Story.Item.Element.extend({

  // sub elements.
  _$itemInfo : null,
  _$title : null,
  _$searchBox : null,
  _$searchInput : null,
  _$searchButton : null,
  _oItemDate : null,
  _oItemLabel : null,

  init : function(oHistoryItem, oDispacher, oItem) {
    this._super(oHistoryItem, oDispacher, oItem);

    // current element.
    this.setType("search");

    // sub elements.
    this._$itemInfo = $('<div class="ct-infos"></div>');
    this._$title = $('<h3></h3>');
    this._$searchBox = $('<div class="ct-searchbox"></div>');
    this._$searchInput = $('<input type="text" name="ct-google-search">');
    this._$searchButton = $('<img class="ct-search_button" src="media/images/story/item/search_item/search.png"/>');
    this._oItemDate = new Cotton.UI.Story.Item.Content.Brick.Date(
      oHistoryItem.lastVisitTime(), this);
    this._oItemLabel = new Cotton.UI.Story.Item.Content.Brick.SmallLabel(
      oHistoryItem.url(), this);
    this._oToolbox = new Cotton.UI.Story.Item.Toolbox.Simple(oHistoryItem.url(),
      this._oDispatcher, this, 'small');

    // Title
    if (oHistoryItem.title() !== "") {
      var sTitle = oHistoryItem.title().split(" - ")[0];
      this._$title.text(sTitle);
      this._$searchInput.val(sTitle);
    } else {
      this._$title.text("Search");
    }

    // create the item
    this._$item.append(
      this._$content.append(
        this._$itemInfo.append(
          this._$title,
          this._oItemDate.$(),
          this._$searchBox.append(
            this._$searchInput,
            this._$searchButton
          ),
          this._oItemLabel.$()
        ),
        this._oToolbox.$()
      )
    );

  }

});
