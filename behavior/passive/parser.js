'use strict';

Cotton.Behavior.Passive.Parser = Class.extend({
  init: function() {
    
    // TODO(fwouts): Move constants.
    var MIN_PARAGRAPH_CONTAINER_WIDTH = 400;
    
    // Detects sentences containing at least three separate words of at least three
    // letters each.
    // TODO(fwouts): Handle accentuated capitals? Handle languages not following
    //               this convention?
    var rLongEnoughSentenceRegex = /[A-Z][^.]*([\w]{3,} [^.]*){3,}[^.]*(\.|!|\?|\:)/g;
    
    // TODO(fwouts): Maybe use livequery to handle dynamic content changes.
    
    //alert("This is a sentence that should be matching.".match(rLongEnoughSentenceRegex));
    
    // Loop through all the paragraphs to find the actual textual content.
    $('p, dd').each(function() {
      var $paragraph = $(this);
      var $container = $paragraph.parent();
      
      // In any article, the text should have a sufficient width to be comfortable
      // to read for the user (except maybe in multi-column layouts?).
      // We however take into account the case of articles starting with an image
      // floating on the left/right side, so we do not consider the width of the
      // paragraph itself, but the width of its container.
      if ($container.width() < MIN_PARAGRAPH_CONTAINER_WIDTH) {
        // If the container is not big enough, then we ignore the paragraph.
        // For example, it could be a small message "Connect with your email"
        // in a sidebar.
        return true;
      }
      
      // If the paragraph's container is big enough, it does not necessarily mean
      // that the paragraph contains useful textual information. We analyze it to
      // extract basic sentence patterns and "count" its length.
      // We count sentences that "long enough" (e.g. containing at least three
      // long-enough words).
      
      // TODO(fwouts): Consider something else than text()?
      var lSentencesMatching = $paragraph.text().match(rLongEnoughSentenceRegex);
      if (lSentencesMatching) {
        $paragraph.css('border', lSentencesMatching.length + 'px solid #f00');
      }
    });
    
    // TODO(fwouts): Detect non-textual informational content such as images and videos.
    
  }
});

// For testing.
$(function() {
  new Cotton.Behavior.Passive.Parser();
});
