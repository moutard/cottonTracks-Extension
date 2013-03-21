'use strict';

/**
 * Search Item content. Contains a search input filed,
 * a title, a small label and small action menu
 */
Cotton.UI.Story.Item.Content.Search = Cotton.UI.Story.Item.Content.Element.extend({

  // sub elements.
  _$itemInfo : null,
  _$title : null,
  _$searchBox : null,
  _$searchInput : null,
  _$searchButton : null,
  _oItemDate : null,
  _oItemLabel : null,

  init : function(oHistoryItem, oItem) {
    this._super(oItem);

    this._sType = "search";
    // current element.
    this._$content.addClass('ct-content-search search');

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

    // Title
    if (oHistoryItem.title() !== "") {
      var sTitle = oHistoryItem.title().split(" - ")[0];
      this._$title.text(sTitle);
      this._$searchInput.val(sTitle);
    } else {
      this._$title.text("Search");
    }

    // create the item
    this._$content.append(
      this._$itemInfo.append(
        this._$title,
        this._oItemDate.$(),
        this._$searchBox.append(
          this._$searchInput,
          this._$searchButton
        ),
        this._oItemLabel.$()
      )
    );

  }

});
