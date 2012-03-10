'use strict';

// TODO(fwouts): Reorganize and write better comments.
Cotton.Behavior.Passive.Parser = Class.extend({
  init: function() {
    
    // Returns true if the block could be a content block (not necessarily the main one).
    function couldBeContentBlock($block) {
      // Any content block should be visible and big enough.
      return $block.is(':visible') && $block.width() > 300 && $block.height() > 150;
    }
    
    // Returns true if the block could be the main content block.
    function couldBeMainContentBlock($block) {
      // The main content block should be a content block and start between 50px and
      // 600px from the top.
      return couldBeContentBlock($block) && $block.offset().top > 50 && $block.offset().top < 600;
    }
    
    // Finds all the possible main content blocks. The list returned will most of the time
    // return the actual main content block along with all its ancestors, since they are
    // possible too (only bigger, with more information). We will then need to find
    // which "level of zoom" is the most appropriate.
    function findPossibleMainContentBlocks($block) {
      // Get all the possible descendant content blocks. Note that they will not always
      // be the children themselves, but they can also be any descendant of the children.
      var lDescendantContentBlocks = [];
      $block.children().each(function() {
        var $childBlock = $(this);
        lDescendantContentBlocks = lDescendantContentBlocks.concat(findPossibleMainContentBlocks($childBlock));
      });
      
      var lContentBlocks = lDescendantContentBlocks;
      
      // Check if the current block is a candidate to be a content block given its size
      // and position.
      // Note that some blocks contain blocks bigger than themselves, such as any div
      // containing floating divs. So we also need to check if any of their descendants
      // could also be a content block, even if they could not.
      if (couldBeMainContentBlock($block)) {
        lContentBlocks.push($block[0]);
      }
      return lContentBlocks;
    }
    
    // Finds all the possible content blocks (not only main blocks), while ignoring $ignoreBlock
    // and all its descendants.
    function findPossibleContentBlocks($block, $ignoreBlock) {
      var lDescendantContentBlocks = [];
      $block.children().each(function() {
        if (this == $ignoreBlock[0]) {
          return true;
        }
        var $childBlock = $(this);
        lDescendantContentBlocks = lDescendantContentBlocks.concat(findPossibleContentBlocks($childBlock, $ignoreBlock));
      });
      var lContentBlocks = lDescendantContentBlocks;
      if (couldBeContentBlock($block)) {
        lContentBlocks.push($block[0]);
      }
      return lDescendantContentBlocks;
    }
    
    var lPossibleMainContentBlocks = findPossibleMainContentBlocks($('body'));
    
    // Now among all possible main content blocks, we need to find the best candidate.
    // It needs to contain the most content blocks (not just main content blocks) possible,
    // but it should not be too big either.
    
    // One frequent case is a long article beginning with a big image or paragraph. Since
    // only this image/paragraph is within the top of the page, they are considered as a
    // possible main content block while the rest is not. As a result, we need to consider
    // their closest enclosing potential main content block and see if it contains much
    // more actual content. If so, then we should use the enclosing potential main content
    // block. Otherwise, we can use the smallest one.
    
    var lExcludeFromMainContentBlocks = [];
    
    $.each(lPossibleMainContentBlocks, function() {
      var $possibleMainContentBlock = $(this);
      
      var $ancestor = $possibleMainContentBlock;
      var bFoundBetterAncestor = false;
      do {
        $ancestor = $ancestor.parent();
        if ($.inArray($ancestor[0], lPossibleMainContentBlocks) != -1) {
          if (ancestorIsBetterThanDescendant($ancestor, $possibleMainContentBlock)) {
            bFoundBetterAncestor = true;
          } else {
            lExcludeFromMainContentBlocks.push($ancestor[0]);
          }
        }
      } while($ancestor.parent().length);
    });
    
    function ancestorIsBetterThanDescendant($ancestor, $descendant) {
      return !containsComments($ancestor)
          && findPossibleContentBlocks($ancestor, $descendant).length > 1;
    }
    
    function containsComments($block) {
      // TODO(fwouts): Use a more general logic.
      // One example where we cannot remove comments at all: http://www.ehow.com/feature_8524049_8-herbs-culinary-garden-growing.html.
      return $block.find('#disqus_thread, fb\\:comments, #comments, .comments, .commentlist, .comment_list').length > 0;
    }
    
    var lBestMainContentBlocks = _.difference(lPossibleMainContentBlocks, lExcludeFromMainContentBlocks);
    
    // Get the biggest possible containers among all best ones.
    $.each(lBestMainContentBlocks, function() {
      var $possibleMainContentBlock = $(this);
      
      var $ancestor = $possibleMainContentBlock;
      do {
        $ancestor = $ancestor.parent();
        if ($.inArray($ancestor[0], lBestMainContentBlocks) != -1) {
          lExcludeFromMainContentBlocks.push($possibleMainContentBlock[0]);
        }
      } while($ancestor.parent().length);
    });
    
    lBestMainContentBlocks = _.difference(lBestMainContentBlocks, lExcludeFromMainContentBlocks);
    
    // $(lPossibleMainContentBlocks).css('border', '2px dashed #58f');
    $(lBestMainContentBlocks).css('border', '5px dashed #f00');
  }
});

// For testing.
$(function() {
  new Cotton.Behavior.Passive.Parser();
});
