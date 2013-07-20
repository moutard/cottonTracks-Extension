'use strict';

Cotton.Behavior.Active.REFRESH_RATE = 8; // seconds

Cotton.Behavior.Active.ReadingRater = Class.extend({

  /**
   * {Cotton.Behavior.BackgroundClient}
   */
  _oClient : null,

  /**
   * true if there was an activity recently on the page (meaning that the user
   * had the tab open and for example moved the mouse).
   *
   * @type boolean
   */
  _bDocumentActive : undefined,

  /**
   * An int that contain the percentage of reading.
   */
  _iReadingRate : undefined,

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
   *
   * @param {Cotton.Behavior.BackgroundClient} oClient:
   *  client used to communicate with the database.
   */
  init : function(oClient, oMessenger) {
    this._oClient = oClient;
    this._oMessenger = oMessenger;

    this._iReadingRate = 0;

    // Detect user's activity on the page when they move their cursor.
    // If they don't move it during 10 seconds, we conclude they are
    // inactive.
    this._bDocumentActive = false;

    // Create the parser but don't start it.
    this._oParser = new Cotton.Behavior.Passive.ParserFactory(this._oClient, oMessenger);
    this._oFeedbackElement = new Cotton.Behavior.Active.FeedbackElement();
  },

  /**
   * Start when the document is ready. Start parser and reading rater. Refresh
   * reading rater every 5 seconds. To improve performance no need to refresh
   * parser.
   */
  start : function() {
    var self = this;

    self._oClient.createVisit();
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
    this._initializeHashListener();

    self._oClient.current().extractedDNA().setTimeTabActive(0);
    self._oClient.current().extractedDNA().setTimeTabOpen(0);
    // To increase performance the parsing is just lanched once.
    var mRefreshParsing = function() {
      self._oParser.parse();

      // Set $feedback
      var sBestImg = self._oParser.bestImage();
      if (sBestImg) {
        if (self._oFeedbackElement) {
          self._oFeedbackElement.setBestImage(sBestImg);
        }

        // Update oCurrentHistoryItem
        self._oClient.current().extractedDNA().setImageUrl(sBestImg);
        self._oClient.updateVisit();
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

        self._oClient.current().extractedDNA().setPageScore(fPageScore);
        self._oClient.current().extractedDNA().setPercent(iPercent);
        self._oClient.current().extractedDNA().increaseTimeTabActive(
            Cotton.Behavior.Active.REFRESH_RATE);
        self._oClient.updateVisit();
      }

      // Refresh after a REFRESH_RATE seconds.
      self._oTimeoutSession = setTimeout(function() {
        mRefreshReadingRate();
      }, Cotton.Behavior.Active.REFRESH_RATE * 1000);
    };

    self._oTimeoutSession = setTimeout(function() {
      mRefreshReadingRate();
    }, 10);

    /**
     * If the active element is an iframe, then return the iframe
     */
    var iframeDetector = function() {
      var oActiveElement = document.activeElement;
      return oActiveElement.nodeName === 'IFRAME' && oActiveElement;
    };

    /*
     * Save active video iframes
     */
    var saveClickedIframes = function() {
      var iframe = iframeDetector();
      if (iframe) {
        self._saveVideoIframe(iframe);
      }
      return false;
    };

    /*
     * Warning: This is a hack borrowed from https://github.com/finalclap/iframeTracker-jquery
     * This is because iframe events are inaccessible and because we need to add
     * a hidden input element in order to retrieve focus from the iframe.
     * An alternative solution is to set an interval checking for the active
     * element but that is discouraged.
     *
     * Listen for blur events on the current window and call saveClickedIframes
     */
    window.addEventListener('blur', saveClickedIframes);
    $('body').append('<div style="position:fixed; top:0; left:0; overflow:hidden'
      + ';"><input style="position:absolute; left:-300px;" type="text" value=""'
      + 'id="focus_retriever" /></div>');
    var focusRetriever = $('#focus_retriever');
    $(document).mousemove(function(e){ // Focus back to page
      if( document.activeElement.nodeName === 'IFRAME' ){
        focusRetriever.focus();
      }
    });
  },

  restart : function() {
    var self = this;
    self._bDocumentActive = true;

    if (self._oFeedbackElement) {
      self._oFeedbackElement.start();
    }

    var mRefreshReadingRate = function() {
      // Do not increase scores if the document is inactive.
      if (self._bDocumentActive) {
        var fPageScore = self._computePageScore();
        var iPercent = self._iRatingRate = Math.round(100 * fPageScore);
        if (self._oFeedbackElement) {
          self._oFeedbackElement.setPercentage(iPercent + '%');
        }

        self._oClient.current().extractedDNA().setPageScore(fPageScore);
        self._oClient.current().extractedDNA().setPercent(iPercent);
        self._oClient.updateVisit();
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
    var self = this;
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
      oParagraph.setQuotes(oScore.quotes());
      self._oClient.current().extractedDNA().addParagraph(oParagraph);
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
   * Listens for a hash change in the url to create a new historyItem
   */
  _initializeHashListener : function() {
    var self = this;
    $(window).bind('hashchange', function(e){
      self.stop();
      self._refreshStart();
    });
  },

  /**
   * For Google, it is a brand new item (because a new search) with different parameters
   * For all other pages it is likely to be just an anchor, so the same page.
   * However for the moment we create a new item with new properties otherwise when
   * calling the browserAction, the new url is possibly not in the database.
   */
  _refreshStart : function() {
    var self = this;

    var oUrl = new UrlParser(window.location.href);
    oUrl.fineDecomposition();
    self._oClient.init(oMessenger);
    // empty cache to be able to re-walk through the new content.
    Cotton.Utils.emptyCache();
    self._oParser.init(self._oClient, self._oMessenger, oUrl);
    self._oClient.createVisit();

    self._oClient.current().extractedDNA().setTimeTabActive(0);
    self._oClient.current().extractedDNA().setTimeTabOpen(0);
    // To increase performance the parsing is just lanched once.
    var mRefreshParsing = function() {
      self._oParser.parse();

      // Set $feedback
      var sBestImg = self._oParser.bestImage();
      if (sBestImg) {
        if (self._oFeedbackElement) {
          self._oFeedbackElement.setBestImage(sBestImg);
        }

        // Update oCurrentHistoryItem
        self._oClient.current().extractedDNA().setImageUrl(sBestImg);
        self._oClient.updateVisit();
      }
      self.restart();
    };
    // Launch almost immediately (but try to avoid freezing the page).
    setTimeout(function(){
      mRefreshParsing();
    }, 0);
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

        if (oSelection.isCollapsed || oSelection.toString() === " ") {
          // Do not do anything on empty selections.
          $highlightedContentBlocks = $([]);
          return;
        }
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
            oScore.setScore(Math.max(oScore.score(), Cotton.Config.Parameters.minPercentageForBestParagraph));
            oScore.addQuote(oSelection.toString());

            // set the highlighted text as part of a paragraph
            var oParagraph = new Cotton.Model.ExtractedParagraph(oScore.text());
            oParagraph.setId(oScore.id());
            oParagraph.setPercent(oScore.score());
            oParagraph.setQuotes(oScore.quotes());
            self._oClient.current().extractedDNA().addParagraph(oParagraph);
            self._oClient.updateVisit();
          }
        });
    });

    // We specifically listen to 'copy' events to re-augment the score of
    // highlighted content blocks that are also copied.
    $(document).bind('copy', function() {
      $highlightedContentBlocks.each(function() {
        self._oClient.updateVisit();
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
    var lIntersectingAncestors = [];
    var lMeaningfulAncestors1 = $meaningfulAncestors1.toArray();
    var lMeaningfulAncestors2 = $meaningfulAncestors2.toArray();
    for (var i = 0, $ancestor1; $ancestor1 = lMeaningfulAncestors1[i]; i++){
      for (var j = 0, $ancestor2; $ancestor2 = lMeaningfulAncestors2[j]; j++){
        if ($ancestor1 === $ancestor2){
          lIntersectingAncestors.push($ancestor1);
        }
      }
    }
    return $(lIntersectingAncestors);
  },

  /**
   * Save video iframes.
   */
  _saveVideoIframe : function(oIframe) {
    var self = this;
    var oIframes = document.getElementsByTagName('iframe');
    var sTitle = (oIframe.title)? oIframe.title + ' - ' : '';
    var oHistoryItem = self._oClient.current();
    var oItem = new Cotton.Model.HistoryItem();
    var sVideoUrl = self._getVideoUrlFromEmbeddingUrl(oIframe.src);
    if (sVideoUrl) {
      oItem.initUrl(sVideoUrl);
      oItem.setTitle(sTitle + oHistoryItem.title());
      oItem.setLastVisitTime(Date.now());
      oItem.extractedDNA().setExtractedWords(oHistoryItem.extractedDNA()
        .extractedWords());
      self._oClient.createHistoryItem(oItem);
    }
  },

  /**
   * Get Id of embedded video from common providers
   *
   */
  _getVideoUrlFromEmbeddingUrl : function(sEmbeddingUrl) {
    var oUrlParser = new UrlParser(sEmbeddingUrl);
    var sVideoUrl;
    var rRegex;
    var match;
    var sProvider = oUrlParser.service;
    switch (sProvider){
      case 'youtube':
        rRegex = /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=))([\w\-]{10,12})\b/;
        match = sEmbeddingUrl.match(rRegex);
        if (match) {
          sVideoUrl = 'http://www.youtube.com/watch?v=';
        }
        break;
      case 'vimeo':
        rRegex = /player\.vimeo\.com\/video\/([0-9]*)/;
        match = sEmbeddingUrl.match(rRegex);
        if (match) {
          sVideoUrl = 'http://vimeo.com/';
        }
        break;
      case 'dailymotion':
        rRegex = /dailymotion\.com\/.*video\/([a-z0-9]+)/i;
        match = sEmbeddingUrl.match(rRegex);
        if (match) {
          sVideoUrl = 'http://www.dailymotion.com/video/';
        }
        break;
    }
    return sVideoUrl ? sVideoUrl + match[1] : null;
  },
});

var oExcludeContainer = new Cotton.Utils.ExcludeContainer();
if (!oExcludeContainer.isExcluded(window.location.href)){
  var oMessenger = new Cotton.Core.Messenger();
  var oBackgroundClient = new Cotton.Behavior.BackgroundClient(oMessenger);
  var oReadingRater = new Cotton.Behavior.Active.ReadingRater(oBackgroundClient, oMessenger);


  $(document).ready(function() {
    // Need to wait the document is ready to get the title and the parser can
    // work.

    oReadingRater.start();
  });
}
