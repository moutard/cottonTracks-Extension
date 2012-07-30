'use strict';

// TODO(fwouts): Cleanup the whole structure of this file.
Cotton.Behavior.Active.ReadingRater = Class.extend({

  /**
   * true if there was an activity recently on the page (meaning that the user
   * had the tab open and for example moved the mouse).
   *
   * @type boolean
   */
  _bDocumentActive : false,

  /**
   * true if we should send debugging messages to the JS console.
   *
   * @type boolean
   */
  _bLoggingEnabled : false,

  /**
   * An parser used to regularly analyze the content on the page to detect
   * relevant content blocks.
   *
   * @type Cotton.Behavior.Passive.Parser
   */
  _oParser : null,

  /**
   * A DOM element containing the current estimated reading rate.
   *
   * @type jQuery DOM
   */
  _$feedback : null,

  /**
   * A DOM element containing an <img /> supposed to represent the most relevant
   * image on the page.
   *
   * @type jQuery DOM
   */
  _$bestImg : null,

  init : function() {
    var self = this;

    // Detect user's activity on the page when they move their cursor.
    // If they don't move it during 10 seconds, we conclude they are
    // inactive.
    this._bDocumentActive = true;
    var oTimeout = null;
    $(document).mousemove(function() {
      self._bDocumentActive = true;

      clearTimeout(oTimeout);
      oTimeout = setTimeout(function() {
        self._bDocumentActive = false;
      }, 10000);
    });

    this._bLoggingEnabled = false;

    var oParser = this._oParser = new Cotton.Behavior.Passive.Parser();
    // var oGoogleParser = this._oParser = new
    // Cotton.Behavior.Passive.GoogleParser();
    // oGoogleParser._findSearchImageResult();

    if (Cotton.Config.Parameters.bDevMode === true){
    	this._generateFeedbackElement();
    }

    this._initializeHighlightListener();

    // We will relaunch the parsing every 5 seconds. We do not use
    // setInterval
    // for performance issues.
    var mRefreshParsing = function() {
      oParser.parse();
      var $bestImg = oParser.findBestImage();
      if ($bestImg) {
        self._$bestImg.attr('src', $bestImg);
        // Update oCurrentVisitItem
        sync._oCurrentVisitItem.extractedDNA().setImageUrl($bestImg);
        // console.log(oCurrentVisitItem);
        sync.updateVisit();
      }
      // Refresh every 5 seconds.
      setTimeout(mRefreshParsing, 5000);
    };

    // Launch almost immediately (but try to avoid freezing the page).
    setTimeout(mRefreshParsing, 0);

    $('[data-meaningful]').livequery(function() {
      var $block = $(this);
      var oScore = $block.data('score');
      if (!oScore) {
        oScore = new Cotton.Behavior.Active.ReadingRater.Score($block);
        $block.data('score', oScore);
      }
    });

    var mRefreshReadingRate = function() {
      // Do not increase scores if the document is inactive.
      if (self._bDocumentActive) {
        var fPageScore = self._computePageScore();
        var iPercent = Math.round(100 * fPageScore);
        if(Cotton.Config.Parameters.bDevMode){
          self._$feedback.text(iPercent + '%');
        }
        sync.current().extractedDNA().setPageScore(fPageScore);
        sync.current().extractedDNA().setPercent(iPercent);
        // console.log(oCurrentVisitItem);
        sync.updateVisit();
      }

      // Refresh after a little while.
      setTimeout(mRefreshReadingRate,
          Cotton.Behavior.Active.ReadingRater.REFRESH_RATE * 100);
    };

    mRefreshReadingRate();
  },

  log : function(msg) {
    if (this._bLoggingEnabled) {
      console.log(msg);
    }
  },

  /**
   * Computes the page score.
   *
   * @returns float between 0 and 1
   */
  _computePageScore : function() {

    var lBlockBundles = this._computeBlockBundles();

    // Get the total visible and unvisible surface of all content blocks.
    var iVisiblePageSurface = 0;
    var iTotalPageSurface = 0;
    $.each(lBlockBundles, function() {
      iVisiblePageSurface += this.iVisibleSurface;
      iTotalPageSurface += this.iTotalSurface;
    });

    // If there are no content blocks, just return 0.
    if (iVisiblePageSurface == 0) {
      return 0;
    }

    var fPageScore = 0;
    $.each(lBlockBundles, function() {
      var fFocusProportion = this.iVisibleSurface / iVisiblePageSurface;
      var oScore = this.$block.data('score');
      // TODO(fwouts): If only 10% of the block is ever visible, the maximum
      // score should be of 10%.

      // TODO(fwouts): Use the total quantity of text visible instead of the
      // total visible surface?
      oScore.increment(fFocusProportion * this.iVisibleSurface
          / Math.pow(this.iTotalSurface, 2) * 1000
          * Cotton.Behavior.Active.ReadingRater.REFRESH_RATE);
      fPageScore += oScore.score() * (this.iTotalSurface / iTotalPageSurface);
    });
    return fPageScore;
  },

  _computeBlockBundles : function() {
    // Compute the visible surface of each block and the total visible
    // surface.
    var lBlockBundles = [];

    $('[data-meaningful]').each(function() {
      var $block = $(this);
      var oScore = $block.data('score');
      if (oScore) {
        var iVisibleSurface = oScore.visibleSurface();
        var iTotalSurface = oScore.totalSurface();
        if (iTotalSurface == 0) {
          // Ignore this block.
          return true;
        }
        lBlockBundles.push({
          $block : $block,
          iVisibleSurface : iVisibleSurface,
          iTotalSurface : iTotalSurface
        });
      }
      // TODO(fwouts): Check if it is ever possible to not have oScore.
    });

    return lBlockBundles;
  },

  /**
   * Prepares a block to give feedback on the reading percentage.
   */
  _generateFeedbackElement : function() {
    if (this._$feedback) {
      return;
    }

    var $container = $('<div>').css({
      position : 'fixed',
      left : 0,
      bottom : 0,
      border : '3px solid #000',
      background : '#fff',
      fontSize : '2em',
      padding : '0.4em'
    });

    this._$feedback = $('<p>');

    this._$bestImg = $('<img />').css({
      width : 50,
      height : 50
    });

    $('body').append($container.append(this._$feedback, this._$bestImg));
  },

  /**
   * Adds a document listener to know when a selection happens and increment the
   * score of the relevant content block consequently.
   */
  _initializeHighlightListener : function() {
    var self = this;

    /**
     * A jQuery DOM object used to keep in memory highlighted blocks in order to
     * re-augment their score in case they are copied (Ctrl/Cmd+C).
     *
     * Initialized to $([]) to make sure we always have a jQuery DOM object.
     */
    var $highlightedContentBlocks = $([]);

    $(document).mouseup(
        function(oEvent) {
          var oSelection = window.getSelection();

          if (oSelection.isCollapsed) {
            // Do not do anything on empty selections.
            $highlightedContentBlocks = $([]);
            return;
          }
          sync.current().extractedDNA().addHighlightedText(
              oSelection.toString());
          var oStartNode = oSelection.anchorNode;
          var oEndNode = oSelection.focusNode;

          // We will try to detect if either the start node and the end
          // node are
          // both located inside a common content block (which will have
          // an
          // attribute named "data-meaningful" because of
          // Cotton.Behavior.Passive.Parser.
          $highlightedContentBlocks = self
              ._findCommonMeaningfulAncestorsForNodes(oStartNode, oEndNode);

          // If there is such a content block, we will increment the
          // score
          // attached
          // to the block.
          $highlightedContentBlocks.each(function() {
            var oScore = $(this).data('score');
            if (oScore) {
              // TODO(fwouts): Tweak the incremental score.
              oScore.increment(0.2);
            }
          });
        });

    // We specifically listen to 'copy' events to re-augment the score of
    // highlighted content blocks that are also copied.
    $(document).bind('copy', function() {
      $highlightedContentBlocks.each(function() {
        var oScore = $(this).data('score');
        if (oScore) {
          // TODO(fwouts): Tweak the incremental score.
          oScore.increment(0.5);
        }
      });
    });
  },

  /**
   * Finds all content blocks that are ancestors of both nodes.
   *
   * @returns jQuery DOM
   */
  _findCommonMeaningfulAncestorsForNodes : function(oNode1, oNode2) {
    var $meaningfulAncestors1 = $(oNode1).parents('[data-meaningful]');
    var $meaningfulAncestors2 = $(oNode2).parents('[data-meaningful]');
    var lIntersectingAncestors = _.intersect(_.toArray($meaningfulAncestors1),
        _.toArray($meaningfulAncestors2));
    return $(lIntersectingAncestors);
  }
});

Cotton.Behavior.Active.ReadingRater.REFRESH_RATE = 200;

// For testing.
// $(function() {
// new Cotton.Behavior.Active.ReadingRater();
// });
