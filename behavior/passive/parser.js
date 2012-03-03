'use strict';

Cotton.Behavior.Passive.Parser = Class.extend({
  init: function() {
    
    function couldBeContentBlock($block) {
      return ($block.is(':visible') && $block.width() > 400 && $block.height() > 400);
    }
    
    function findContentBlock($block) {
      
      var bCouldBeContentBlock = couldBeContentBlock($block);
      
      if (bCouldBeContentBlock) {
        // Check if there is one child (and only one) that could also be a content block. Then it
        // would be a better content block.
        var lMatchingChildren = $block.children().filter(function() {
          var $childBlock = $(this);
          var bCouldBeContentBlock = couldBeContentBlock($childBlock);
          return bCouldBeContentBlock;
        });
        if (lMatchingChildren.length == 1) {
          return findContentBlock($(lMatchingChildren[0]));
        } else {
          console.log(lMatchingChildren);
          return $block;
        }
      } else {
        return $([]);
      }
    }
    
    var $contentBlock = findContentBlock($('body'));
    console.log("Found the content block:");
    console.log($contentBlock);
  }
});

// For testing.
$(function() {
  new Cotton.Behavior.Passive.Parser();
});
