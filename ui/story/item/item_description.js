'use strict';

/**
 * Item Description
 * Contains title and first paragraph
 */
Cotton.UI.Story.Item.Description = Class.extend({

  _oItemContent : null,

  _$item_description : null,

  _$title : null,
  _$first_paragraph : null,

  init : function(oItemContent) {
    // current parent element.
    this._oItemContent = oItemContent;

    // current item.
    this._$item_description = $('<div class="ct-item_description"></div>');

    // current sub elements
    this._$title = $('<h2></h2>');
    this._$first_paragraph = $('<p></p>');

    // set value
    this._$title.text('Alice in Wonderland');
    this._$first_paragraph.text('Alice is feeling bored while sitting on the riverbank with her sister, when she notices a talking, clothed White Rabbit with a pocket watch run past. She follows it down a rabbit hole when suddenly she falls a long way to a curious hall with many locked doors of all sizes. She finds a small key to a door too small for her to fit through, but through it she sees an attractive garden. She then discovers a bottle on a table labelled "DRINK ME", the contents of which cause her to shrink too small to reach the key which she has left on the table. A cake with "EAT ME" on it causes her to grow to such a tremendous size her head hits the ceilin');

    // construct item
    this._$item_description.append(
        this._$title,
        this._$first_paragraph
    );
  },

  $ : function(){
    return this._$item_description;
  },

  appendTo : function(oItemContent) {
    oItemContent.$().append(this._$item_description);
  },

});

