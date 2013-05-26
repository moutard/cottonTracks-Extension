'use strict';
/**
 * Controller
 *
 * Inspired by MVC pattern.
 *
 * Handles DB, and UI.
 *
 */
Cotton.Controllers.Lightyear = Class.extend({

  /**
   * Global Store, that allow controller to make call to
   * the database. So it Contains 'historyItems', 'stories' and 'searchKeywords'.
   */
  _oDatabase : null,

  /**
   * Pool of historyItems.
   * Needed for the "add element in story" feature.
   */
  _oPool : null,

  /**
   * Sender for handle core message. (Chrome message)
   */
  _oSender : null,

  /**
   * Dispatcher that allows two diffents part of the product to communicate
   * together.
   */
  _oDispatcher : null,

  /**
   * Global view, contains the Menu, the StoryContainer.
   * UI elements act as their own controllers.
   */
  _oWorld : null,

  /**
   * state of World creation
   */
  _bWorldReady : null,

  /**
   * Triggered storyId
   **/
  _iStoryId : null,

  /**
   * Triggered story
   **/
  _oStory : null,

  /**
   * StoriesId from other opened tabs
   **/
  _lStoriesInTabsId : null,

  /**
   * Stories from other opened tabs
   **/
  _lStoriesInTabs : null,

  /**
   * Related stories ids
   **/
  _lRelatedStoriesId : null,

  /**
   * Related stories
   **/
  _lRelatedStories : null,

  /**
   * list of HistoryItems in the triggered story
   **/
  _lHistoryItems : null,

  /**
   *
   */
  init : function(oSender){

    var self = this;
    LOG && DEBUG && console.debug("Controller Lightyear - init -");
    this._oSender = oSender;
    this._oDispatcher = new Cotton.Messaging.Dispatcher();

    // On item removal
    this._oDispatcher.subscribe("item:delete", this, function(dArguments){
      self.deleteItem(dArguments['id']);
    });

    // On getContent
    this._oDispatcher.subscribe("item:get_content", this, function(dArguments){
      chrome.tabs.create({
        "url" : dArguments['url'],
        "active" : false
      }, function(tab){
        chrome.extension.sendMessage({
          'action': "get_content_tab",
          'params': {
            'tab_id': tab['id']
          }
        });
      });
    });

    // add new element from the pool
    this._oDispatcher.subscribe("show_elements", this, function(dArguments){
      self._oPool = new Cotton.DB.DatabaseFactory().getCache('pool');
      self.orderPool(self._oPool, function(lNewElements){
        self._oWorld.storyElement().showItemsToAdd(lNewElements);
      });
    });

    this._oDispatcher.subscribe('add_historyItem_from_pool', this, function(dArguments){
      var oHistoryItem = dArguments['historyItem'];
      self._oWorld.storyElement().addHistoryItem(oHistoryItem);
      self._oStory.addHistoryItemId(oHistoryItem.id());
      self._oStory.dna().bagOfWords().mergeBag(oHistoryItem.extractedDNA().bagOfWords().get());
      oHistoryItem.setStoryId(self._oStory.id());
      self._oDatabase.put('stories', self._oStory, function(iId){});
      self._oDatabase.put('historyItems', oHistoryItem, function(iId){});
      self._oPool.delete(oHistoryItem.id());
    });

    this._oDispatcher.subscribe('enter_story', this, function(dArguments){
      self._iStoryId = dArguments['story_id'];
      self._oSender.sendMessage({
        'action': 'change_story',
        'params': {'story_id': self._iStoryId}
      }, function(response){});
      self._oDatabase.find('stories', 'id', self._iStoryId, function(oStory){
        self._oStory = oStory;
        var bHistoryItemsReady = false;
        var bRelatedStoriesReady = false;
        self._oDatabase.findGroup('searchKeywords', 'sKeyword',
          oStory.searchKeywords(), function(lSearchKeywords){
            var lRelatedStoriesId = [];
            for (var i = 0, iLength = lSearchKeywords.length; i < iLength; i++){
              var oSearchKeyword = lSearchKeywords[i];
              lRelatedStoriesId = _.union(
                lRelatedStoriesId, oSearchKeyword.referringStoriesId());
            };
            for (var i = 0, iStoryId; iStoryId = lRelatedStoriesId[i]; i++){
              if (iStoryId === self._oStory.id()){
                lRelatedStoriesId.splice(i,1);
              }
            }
            self._oDatabase.findGroup('stories', 'id', lRelatedStoriesId, function(lStories){
              if (!lStories){
                self._lRelatedStories = [];
              } else {
                //take the 6 closest stories
                for (var i = 0, oStory; oStory = lStories[i]; i++){
                  oStory['scoreToStory'] = Cotton.Algo.Score.Object.storyToStory(oStory, self._oStory);
                }
                lStories.sort(function(a,b){
                  return b['scoreToStory'] - a['scoreToStory']
                });
                lStories = lStories.slice(0,Math.min(6, lStories.length));
                self._lRelatedStories = lStories;
              }
              bRelatedStoriesReady = true;
              if (bHistoryItemsReady) {
                self._oWorld.clearAll();
                self._oWorld.updateMenu(self._oStory, self._lRelatedStories.length);
                self._oWorld.updateStory(self._oStory);
              }
            });
        });
        self._oDatabase.findGroup('historyItems', 'id', oStory.historyItemsId(),
          function(lHistoryItems){
            // sort items with most recent first
            lHistoryItems.sort(function(a,b){
              return b.lastVisitTime()- a.lastVisitTime();
            });
            self._oStory.setHistoryItems(lHistoryItems);
            bHistoryItemsReady = true;
            if (bRelatedStoriesReady) {
              self._oWorld.clearAll();
              self._oWorld.updateMenu(self._oStory, self._lRelatedStories.length);
              self._oWorld.updateStory(self._oStory);
            }
        });
      });
    });

    this._oDispatcher.subscribe('related_stories', this, function(dArguments){
      self._oWorld.relatedStories(self._lRelatedStories);
    });

    this._oDispatcher.subscribe('search_stories', this, function(dArguments){
      self.searchStories(dArguments['searchWords'], dArguments['context'], function(lSearchResultStories){
        if (dArguments['context'] === 'manager'){
          self._oWorld.refreshManager(lSearchResultStories);
        } else {
          self._oWorld.refreshRelatedStories(lSearchResultStories);
        }
      });
    });

    this._oDispatcher.subscribe('open_manager', this, function(dArguments){
      self._oWorld.clearAll();
      self._oWorld.updateManager(self._oStory, self._lStoriesInTabs);
    });

    this._oDispatcher.subscribe('edit_title', this, function(dArguments){
      self._oStory.setTitle(dArguments['title']);
      var lTitle = dArguments['title'].split(' ');
      var lStrongWords = Cotton.Algo.Tools.Filter(lTitle);
      self._oStory.dna().addListWords(lStrongWords, self._oStory.dna().bagOfWords().maxWeight());
      self._oDatabase.put('stories', self._oStory, function(){});
    });

    self._oDatabase = new Cotton.DB.IndexedDB.Wrapper('ct', {
        'stories' : Cotton.Translators.STORY_TRANSLATORS,
        'historyItems' : Cotton.Translators.HISTORY_ITEM_TRANSLATORS,
        'searchKeywords' : Cotton.Translators.SEARCH_KEYWORD_TRANSLATORS
    }, function() {
      self._oSender.sendMessage({
        'action': 'get_trigger_story'
      }, function(response){
        self._iStoryId = response['trigger_id'];
        self._lStoriesInTabsId = response['stories_in_tabs_id'];
        if (self._iStoryId){
          if (self._iStoryId === -1){
            // the triggering url is https
            self._oStory = new Cotton.Model.Story();
            self._oStory.setId(-1);
            self._bStoryReady = true;
            if (self._bStoriesInTabsReady && self._bWorldReady){
              self._oWorld.updateManager(self._oStory, self._lStoriesInTabs);
            }
          } else {
            self._oDatabase.find('stories', 'id', self._iStoryId, function(oStory) {
              self._oStory = oStory;
              self._bStoryReady = true;
              if (self._bStoriesInTabsReady && self._bWorldReady){
                self._oWorld.updateManager(self._oStory, self._lStoriesInTabs);
              }
            });
          }
        } else {
          self._oStory = null;
          self._bStoryReady = true;
          if (self._bStoriesInTabsReady && self._bWorldReady){
            self._oWorld.updateManager(self._oStory, self._lStoriesInTabs);
          }
        }
        if (self._lStoriesInTabsId.length > 0){
          self._oDatabase.findGroup('stories', 'id', self._lStoriesInTabsId, function(lStories) {
            self._lStoriesInTabs = lStories;
            self._bStorInTabsReady = true;
            if (self._bStoryReady && self._bWorldReady){
              self._oWorld.updateManager(self._oStory, self._lStoriesInTabs);
            }
          });
        } else {
          self._lStoriesInTabs = [];
          self._bStoriesInTabsReady = true;
          if (self._bStoryReady && self._bWorldReady){
            self._oWorld.updateManager(self._oStory, self._lStoriesInTabs);
          }
        }
      });
    });

    $(window).ready(function(){
      self._oWorld = new Cotton.UI.World(self, oSender, self._oDispatcher);
      self._bWorldReady = true;
      if (self._bStoryReady && self._bStoriesInTabsReady){
        self._oWorld.updateManager(self._oStory, self._lStoriesInTabs);
      }
    });


    // Message listening from background page for getContent
    chrome.extension.onMessage.addListener(function(request, sender, sendResponse){
      if (request['action'] === 'refresh_item'){
        self.recycleItem(request['params']['itemId']);
        self.recycleMenu();
      }
    });

  },

  database : function(){
    return this._oDatabase;
  },

  story : function() {
    return this._oStory;
  },

  deleteItem : function(sHistoryItemId){
    var self = this;
    Cotton.DB.Stories.removeHistoryItemInStory(
      self._oDatabase, self._oStory.id(), sHistoryItemId);
  },

  recycleItem : function(sHistoryItemId){
    var self = this;
    this._oDatabase.find('historyItems', 'id', sHistoryItemId, function(oHistoryItem){
      self._oWorld.recycleItem(oHistoryItem);
    });
  },

  recycleMenu : function(){
    var self = this;
    if (!this._oStory.featuredImage() || this._oStory.featuredImage() === ""){
      this._oDatabase.find('stories', 'id', this._oStory.id(), function(oStory){
        if (oStory.featuredImage() && oStory.featuredImage() !== ""){
          self._oStory = oStory;
          self._oWorld.recycleMenu(oStory);
        }
      });
    }
  },

  orderPool : function(oPool, mCallback){
    var self = this;
    var lPoolItems = oPool.get();
    var lIds = [];
    var lSortedPool = [];
    for (var i = 0, dHistoryItem; dHistoryItem = lPoolItems[i]; i++){
      lIds.push(dHistoryItem['id']);
    }
    this._oDatabase.findGroup('historyItems', 'id', lIds, function(lHistoryItems){
      for (var i = 0, oHistoryItem; oHistoryItem = lHistoryItems[i]; i++){
        oHistoryItem['scoreToStory'] = Cotton.Algo.Score.Object.historyItemToStory(
          oHistoryItem, self._oStory);
        lSortedPool.push(oHistoryItem);
      }
      // sort items with most recent first
      lSortedPool.sort(function(a,b){
        return b['scoreToStory'] - a['scoreToStory'];
      });
      if (mCallback){
        mCallback.call(self,lSortedPool);
      }
    });
  },

  searchStories : function(lSearchWords, sContext, mCallback){
    var self = this;
    this._oDatabase.findGroup('searchKeywords', 'sKeyword',
      lSearchWords, function(lSearchKeywords){
        var lRelatedStoriesId = [];
        for (var i = 0, iLength = lSearchKeywords.length; i < iLength; i++){
          var oSearchKeyword = lSearchKeywords[i];
          lRelatedStoriesId = _.union(
            lRelatedStoriesId, oSearchKeyword.referringStoriesId());
        };
        if (sContext !== "manager"){
          for (var i = 0, iStoryId; iStoryId = lRelatedStoriesId[i]; i++){
            if (self._oStory && iStoryId === self._oStory.id()){
              lRelatedStoriesId.splice(i,1);
            }
          }
        }
        self._oDatabase.findGroup('stories', 'id', lRelatedStoriesId, function(lStories){
          if (!lStories){
            lStories = [];
          } else {
            if (sContext !== "manager"){
              //take the 6 closest stories
              for (var i = 0, oStory; oStory = lStories[i]; i++){
                oStory['scoreToStory'] = Cotton.Algo.Score.Object.storyToStory(oStory, self._oStory);
              }
              lStories.sort(function(a,b){
                return b['scoreToStory'] - a['scoreToStory']
              });
              lStories = lStories.slice(0,Math.min(6, lStories.length));
            }
          }
          if (mCallback) {
            mCallback.call(this, lStories);
          }
        });
    });
  }

});

var oSender = new Cotton.Core.Chrome.Sender();
Cotton.Controllers.LIGHTYEAR = new Cotton.Controllers.Lightyear(oSender);
