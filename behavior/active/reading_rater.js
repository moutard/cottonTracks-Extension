'use strict';

Cotton.Behavior.Active.REFRESH_RATE = 8; // seconds

Cotton.Behavior.Active.ReadingRater = Class.extend({

  /**
   * true if there was an activity recently on the page (meaning that the user
   * had the tab open and for example moved the mouse).
   *
   * @type boolean
   */
  _bDocumentActive : false,

  /**
   * An int that contain the percentage of reading.
   */
  _iReadingRate : 0,

  /**
   * An parser used to regularly analyze the content on the page to detect
   * relevant content blocks.
   *
   * @type Cotton.Behavior.Passive.Parser
   */
  _oParser : null,

  /**
   * {Cotton.Behavior.Active.FeedbackElement}
   */
  _oFeedbackElement : null,

  /**
   * Current session of the timeout. Clear it to stop parser.
   */
  _oTimeoutSession : null,

  /**
   * @constructor
   */
  init : function() {
    var self = this;

    // Detect user's activity on the page when they move their cursor.
    // If they don't move it during 10 seconds, we conclude they are
    // inactive.
    this._bDocumentActive = true;

    // Create the parser but don't start it.
    this._oParser = new Cotton.Behavior.Passive.ParserFactory();
    this._oFeedbackElement = new Cotton.Behavior.Active.FeedbackElement();
  },

  /**
   * Start when the document is ready. Start parser and reading rater. Refresh
   * reading rater every 5 seconds. To improve performance no need to refresh
   * parser.
   */
  start : function() {
    var self = this;

    var oTimeout = null;
    $(document).mousemove(function() {
      if (self._bDocumentActive === false) {
        self.restart();
      }
      self._bDocumentActive = true;

      clearTimeout(oTimeout);
      oTimeout = setTimeout(function() {
        self._bDocumentActive = false;
        self.stop();
      }, 10000);
    });

    // Detect if the user is focused on the current window.
    $(window).blur(function() {
      self._bDocumentActive = false;
      self.stop();
    });
    $(window).focus(function() {
      self._bDocumentActive = true;
      self.restart();
    });

    this._initializeHighlightListener();

    sync.current().extractedDNA().setTimeTabActive(0);
    sync.current().extractedDNA().setTimeTabOpen(0);
    // To increase performance the parsing is just lanched once.
    var mRefreshParsing = function() {
      self._oParser.parse();

      // Set $feedback
      var sBestImg = self._oParser.bestImage();
      if (sBestImg) {
        if (self._oFeedbackElement) {
          self._oFeedbackElement.setBestImage(sBestImg);
        }

        // Update oCurrentVisitItem
        sync.current().extractedDNA().setImageUrl(sBestImg);
        sync.updateVisit();
      }

    };

    // Launch almost immediately (but try to avoid freezing the page).
    setTimeout(mRefreshParsing, 0);

    // Livequery is a plugin jQuery.
    // For each block marked as meaningfull by the parser, the reading-rater
    // will compute a score and will add it to the DOM data.
    $('[data-meaningful]').livequery(function() {
      var $block = $(this);
      var oScore = $block.data('score');
      if (!oScore) {
        oScore = new Cotton.Behavior.Active.Score($block);
        $block.data('score', oScore);
      }
    });

    var mRefreshReadingRate = function() {
      // Do not increase scores if the document is inactive.
      if (self._bDocumentActive) {
        var fPageScore = self._computePageScore();
        var iPercent = self._iRatingRate = Math.round(100 * fPageScore);
        if (self._oFeedbackElement) {
          self._oFeedbackElement.setPercentage(iPercent + '%');
        }

        sync.current().extractedDNA().setPageScore(fPageScore);
        sync.current().extractedDNA().setPercent(iPercent);
        sync.current().extractedDNA().setPercent(iPercent);
        sync.current().extractedDNA().increaseTimeTabActive(
            Cotton.Behavior.Active.REFRESH_RATE);
        sync.updateVisit();
      }

      // Refresh after a REFRESH_RATE seconds.
      self._oTimeoutSession = setTimeout(function() {
        mRefreshReadingRate();
      }, Cotton.Behavior.Active.REFRESH_RATE * 1000);
    };

    self._oTimeoutSession = setTimeout(function() {
      mRefreshReadingRate();
    }, 10);

  },

  restart : function() {
    var self = this;
    self._bDocumentActive = true;

    if (self._oFeedbackElement) {
      self._oFeedbackElement.start();
    }
    // livequery is a jQuery plugin.
    // I think this is not usefull because it's done one in start function.
    $('[data-meaningful]').livequery(function() {
      var $block = $(this);
      var oScore = $block.data('score');
      if (!oScore) {
        oScore = new Cotton.Behavior.Active.Score($block);
        $block.data('score', oScore);
      }
    });

    var mRefreshReadingRate = function() {
      // Do not increase scores if the document is inactive.
      if (self._bDocumentActive) {
        var fPageScore = self._computePageScore();
        var iPercent = self._iRatingRate = Math.round(100 * fPageScore);
        if (self._oFeedbackElement) {
          self._oFeedbackElement.setPercentage(iPercent + '%');
        }

        sync.current().extractedDNA().setPageScore(fPageScore);
        sync.current().extractedDNA().setPercent(iPercent);
        sync.updateVisit();
      }

      // Refresh after a REFRESH_RATE seconds.
      self._oTimeoutSession = setTimeout(function() {
        mRefreshReadingRate();
      }, Cotton.Behavior.Active.REFRESH_RATE * 1000);
    };

    self._oTimeoutSession = setTimeout(function() {
      mRefreshReadingRate();
    }, Cotton.Behavior.Active.REFRESH_RATE * 1000);
  },

  stop : function() {
    var self = this;
    self._bDocumentActive = false;
    clearTimeout(self._oTimeoutSession);
    if (self._oFeedbackElement) {
      self._oFeedbackElement.stop();
    }
  },

  readingRate : function() {
    return this._iReadingRate;
  },

  parser : function() {
    return this._oParser;
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
          * Cotton.Behavior.Active.REFRESH_RATE);

      // For each meanigful paragraph create a paragraph in the story.
      var oParagraph = new Cotton.Model.ExtractedParagraph(oScore.text());
      oParagraph.setId(oScore.id());
      oParagraph.setPercent(oScore.score());
      sync.current().extractedDNA().addParagraph(oParagraph);

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
        sync.current().extractedDNA().addCopyPaste($(this).text());
        sync.updateVisit();
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

// We don't need to wait document 'ready' signal to create instance.
var sync = new Cotton.Behavior.Passive.DbSync();
var readingRater = new Cotton.Behavior.Active.ReadingRater();

$(document).ready(function() {
  // Need to wait the document is ready to get the title.

  // Do not store informations in incognito mode.
  if (!chrome.extension.inIncognitoContext) {
    sync.start();
    readingRater.start();
  }
});
