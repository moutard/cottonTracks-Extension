'use strict';

Cotton.Behavior.Passive.Parser = Class.extend({
  
  init: function() {
    var self = this;
    // Refresh every 5 seconds.
    setInterval(function() {
      self.parse();
    }, 5000);
    // Launch almost immediately (but try to avoid freezing the page).
    setTimeout(function() {
      self.parse();
    }, 0);
  },
  
  parse: function() {
    $('[data-meaningful]').removeAttr('data-meaningful');
    this.findMeaningfulBlocks();
    this.removeLeastMeaningfulBlocks();
  },
  
  findMeaningfulBlocks: function() {
    var self = this;
    
    // TODO(fwouts): Move constants.
    var MIN_PARAGRAPH_CONTAINER_WIDTH = 400;
    var MIN_BR_FOR_TEXT_CONTAINER = 5;
    var MIN_OBJECT_WIDTH = 400;
    var MIN_OBJECT_HEIGHT = 300;
    var MIN_PRE_WIDTH = 400;
    var MIN_PRE_HEIGHT = 100;
    
    // Detects sentences containing at least three separate words of at least three
    // letters each.
    // TODO(fwouts): Handle accentuated capitals? Handle languages not following
    //               this convention?
    // TODO(fwouts): Find a way to have the final punctuation too (causes an infinite loop
    //               on http://api.jquery.com/parent-selector/).
    var rLongEnoughSentenceRegex = /[A-Z][^.!?]*([\w]{3,} [^.!?]*){3,}/g;
    
    // TODO(fwouts): Maybe use livequery to handle dynamic content changes.
    
    //alert("This is a sentence that should be matching.".match(rLongEnoughSentenceRegex));
    
    // Loop through all the paragraphs to find the actual textual content.
    console.log("Finding all potentially meaningful paragraphs...");
    $('p, dd').each(function() {
      var $paragraph = $(this);
      var $container = $paragraph.parent();
      
      console.log("Parsing the paragraph:");
      console.log($paragraph.text());
      
      // In any article, the text should have a sufficient width to be comfortable
      // to read for the user (except maybe in multi-column layouts?).
      // We however take into account the case of articles starting with an image
      // floating on the left/right side, so we do not consider the width of the
      // paragraph itself (which depends on other factors, such as the value of the
      // CSS property overflow), but instead we consider the width of its container.
      if ($container.width() < MIN_PARAGRAPH_CONTAINER_WIDTH) {
        // If the container is not big enough, then we ignore the paragraph.
        // For example, it could be a small message "Connect with your email"
        // in a sidebar.
        console.log("Ignoring because of insufficient width.");
        return true;
      }
      
      // If the paragraph's container is big enough, it does not necessarily mean
      // that the paragraph contains useful textual information. We analyze it to
      // extract basic sentence patterns and "count" its length.
      // We count sentences that "long enough" (e.g. containing at least three
      // long-enough words).
      
      console.log("Searching for sentences...");
      
      // TODO(fwouts): Consider something else than text()?
      var lSentencesMatching = $paragraph.text().match(rLongEnoughSentenceRegex);
      if (lSentencesMatching) {
        console.log(lSentencesMatching.length + " sentences found.");
        self.markMeaningfulBlock($paragraph);
      } else {
        console.log("No sentences found.");
      }
    });
    
    // In some websites, there are no <p> nodes containing the text, instead there is only
    // a bunch of text where paragraphs are separated by <br /> (e.g. www.clubic.com).
    // We try to detect those text-containing blocks.
    // TODO(fwouts): Improve the method here.
    $('br').each(function() {
      var $parent = $(this).parent();
      if ($parent.is('p, dd')) {
        // Since the parent is a paragraph, we already considered it above.
        return true;
      }
      var iBrCount = $parent.find('br').length;
      if (iBrCount > MIN_BR_FOR_TEXT_CONTAINER) {
        self.markMeaningfulBlock($parent);
      }
    });
    
    // Loop through all interactive content such as Flash.
    console.log("Finding all potentially meaningful objects...");
    $('object, img').each(function() {
      var $object = $(this);
      if ($object.width() < MIN_OBJECT_WIDTH || $object.height() < MIN_OBJECT_HEIGHT) {
        console.log("Ignoring because of insufficient size.");
        return true;
      }
      // Since the object is big enough, we can consider that it belongs to the content block.
      self.markMeaningfulBlock($object);
    });
    
    // Take into consideration <pre> (for websites such as StackOverflow).
    $('pre').each(function() {
      var $pre = $(this);
      if ($pre.width() < MIN_PRE_WIDTH || $pre.height() < MIN_PRE_HEIGHT) {
        console.log("Ignoring because of insufficient size.");
        return true;
      }  
      self.markMeaningfulBlock($pre);
    });
    
    // TODO(fwouts): Detect non-textual informational content such as images and videos.
  },
  
  markMeaningfulBlock: function($block) {
    $block.attr('data-meaningful', 'true');
    $block.css('border', '1px dashed #35d');
  },
  
  removeLeastMeaningfulBlocks: function() {
    // TODO(fwouts): Move constants.
    var MIN_MEANINGFUL_BLOCK_COUNT_INSIDE_ARTICLE = 4;
  
    console.log("Keeping only groups of meaningful blocks...");
    
    // Separate step because we need to know the list of all meaningful elements at this point.
    // Because we will gradually remove the data-meaningful attribute to elements and the
    // algorithm depends on depth, we need to start with the deepest elements first.
    var lSortedByDepthBlocks = $('[data-meaningful]').get();
    lSortedByDepthBlocks.sort(function(oA, oB) {
      return $(oB).parents().length - $(oA).parents().length;
    });
    
    $.each(lSortedByDepthBlocks, function() {
      // We need to exclude paragraphs belonging to accessory elements such as comments.
      // One method we use here is to count the number of paragraphs within their
      // x-level ancestor (x = 3). For comments, this would generally still contain only
      // one comment box, which means that if the comment is not an essay (which would
      // arguably make it a meaningful content), then we can just count the number of
      // paragraphs and conclude that it does not represent the main article.
      // Other factors such as height should be considered (some websites do not divide
      // their pages properly into multiple paragraphs, but instead use <br />).
      // TODO(fwouts): Take height into account.
      var $paragraph = $(this);
      var $ancestor = $paragraph.parent().parent().parent();
      if ($ancestor.find('[data-meaningful]').length >= MIN_MEANINGFUL_BLOCK_COUNT_INSIDE_ARTICLE) {
        $paragraph.css('border-color', '#f00');
      } else {
        $paragraph.removeAttr('data-meaningful').attr('data-least-meaningful', true);
      }
    });
    
    if ($('[data-meaningful]').length == 0) {
      // If we did not find any really meaningful element, we might be in the case that the
      // content did not match the usual structure of at least X blocks.
      // We pick the element closest to the top, which is the most likely to be part of the content.
      // TODO(fwouts): Improve the algorithm?
      $('[data-least-meaningful]:first').removeAttr('data-least-meaningful').attr('data-meaningful', true).css('border-color', '#f00');
    }
  }
});

// For testing.
$(function() {
  new Cotton.Behavior.Passive.Parser();
});
