'use strict';

Cotton.Behavior.Passive.Parser = Class.extend({
  init: function() {
    
    // Returns true if the block could be a content block.
    function couldBeContentBlock($block) {
      // Any content block should be visible, big enough, and start between 50px and
      // 600px from the top.
      return $block.is(':visible') && $block.width() > 300 && $block.height() > 300
          && $block.offset().top > 50 && $block.offset().top < 600;
    }
    
    // Finds all the possible content blocks. The list returned will most of the time
    // return the actual content block along with all its ancestors, since they are
    // possible too (only bigger, with more information). We will then need to find
    // which "level of zoom" is the most appropriate.
    function findPossibleContentBlocks($block) {
      // Get all the possible descendant content blocks. Note that they will not always
      // be the children themselves, but they can also be any descendant of the children.
      var lDescendantContentBlocks = [];
      $block.children().each(function() {
        var $childBlock = $(this);
        lDescendantContentBlocks = lDescendantContentBlocks.concat(findPossibleContentBlocks($childBlock));
      });
      
      var lContentBlocks = lDescendantContentBlocks;
      
      // Check if the current block is a candidate to be a content block given its size
      // and position.
      // Note that some blocks contain blocks bigger than themselves, such as any div
      // containing floating divs. So we also need to check if any of their descendants
      // could also be a content block, even if they could not.
      var bCouldBeContentBlock = couldBeContentBlock($block);
      if (bCouldBeContentBlock) {
        lContentBlocks.push($block[0]);
      }
      return lContentBlocks;
    }
    
    function couldBeImportantPart($block) {
      return $block.is(':visible') && $block.width() > 300 && $block.height() > 300;
    }
    
    function findImportantParts($block) {
      var lImportantParts = [];
      $block.children().each(function() {
        var $childBlock = $(this);
        if (couldBeImportantPart($childBlock)) {
          lImportantParts.push(this);
        }
      });
      return lImportantParts;
    }
    
    var lPossibleContentBlocks = findPossibleContentBlocks($('body'));
    
    var lBestContentBlocks = [];
    var lExcludeFromBestContentBlocks = [];
    
    // Now that we have the list of possible content blocks, find the best candidate.
    $.each(lPossibleContentBlocks, function() {
      var $possibleContentBlock = $(this);
      var lImportantParts = findImportantParts($possibleContentBlock);
      
      var bParentIsBetterCandidate = false;
      var oParentNode = $possibleContentBlock.parent()[0];
      if ($.inArray(oParentNode, lPossibleContentBlocks) != -1) {
        // The parent element is also a possible content block.
        var $parentPossibleContentBlock = $(oParentNode);
        if (findImportantParts($parentPossibleContentBlock).length > lImportantParts.length) {
          // The parent is probably a better candidate than the child, since it contains more
          // important information.
          bParentIsBetterCandidate = true;
        }
      }
      
      if (!bParentIsBetterCandidate) {
        lBestContentBlocks.push(this);
        lExcludeFromBestContentBlocks.push(oParentNode);
      } else {
        lExcludeFromBestContentBlocks.push(this);
      }
    });
    
    lBestContentBlocks = _.difference(lBestContentBlocks, lExcludeFromBestContentBlocks);
    
    $(lBestContentBlocks).css('border', '5px dashed #f00');
  }
});

// For testing.
$(function() {
  new Cotton.Behavior.Passive.Parser();
});
