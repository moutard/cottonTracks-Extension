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
   * Messenger for handle core message. (Chrome message)
   */
  _oMessenger : null,

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
   * Triggered historyItem id
   **/
  _iHistoryItemId : null,

  /**
   * Triggered historyItem
   **/
  _oHistoryItem : null,

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
   * list of HistoryItems in the triggered story
   **/
  _Messenger : null,

  /**
   * first arrival on the page, to avoid first onpopstate event
   **/
  _bLanding : null,

  /**
   *
   */
  init : function(oMessenger){

    var self = this;
    LOG && DEBUG && console.debug("Controller Lightyear - init -");
    this._oMessenger = oMessenger;
    this._oDispatcher = new Cotton.Messaging.Dispatcher();

    this._bLanding = true;
    this.replaceState(chrome.extension.getURL("lightyear.html"));

    self._oDatabase = new Cotton.DB.IndexedDB.Wrapper('ct', {
        'stories' : Cotton.Translators.STORY_TRANSLATORS,
        'historyItems' : Cotton.Translators.HISTORY_ITEM_TRANSLATORS,
        'searchKeywords' : Cotton.Translators.SEARCH_KEYWORD_TRANSLATORS
    }, function() {
      self._oMessenger.sendMessage({
        'action': 'get_trigger_story'
      }, function(response){
        self._iStoryId = self._iOriginalStoryId = response['trigger_id'];
        self._iHistoryItemId = self._iOriginalHistoryItemId = response['trigger_item_id'];
        self._lStoriesInTabsId = response['stories_in_tabs_id'];

        //Main Story
        if (self._iStoryId){
          if (self._iStoryId === -1){
            // the triggering url is https
            self._oStory = new Cotton.Model.Story();
            self._oStory.setId(-1);
            self._bStoryReady = true;
            self._bHistoryItemReady = true;
            self._bRelatedReady = true;
            if (self._bStoriesInTabsReady && self._bWorldReady){
              self._oWorld.updateManager(self._oStory, self._oHistoryItem, self._lStoriesInTabs, self._lRelatedStories);
            }
          } else {
            self._oDatabase.find('stories', 'id', self._iStoryId, function(oStory) {
              self.setItemsNoSearch(oStory, function(oStoryNoSearch){
                if (oStoryNoSearch.historyItems().length === 0){
                  self._oStory = null;
                  self._bStoryReady = true;
                  self._bHistoryItemReady = true;
                  self._bRelatedReady = true;
                  if (self._bStoriesInTabsReady && self._bWorldReady){
                    self._oWorld.updateManager(self._oStory, self._oHistoryItem, self._lStoriesInTabs, self._lRelatedStories);
                  }
                } else {
                  self._oStory = oStoryNoSearch;
                  self._bStoryReady = true;

                  if (self._iHistoryItemId >= 0){
                    for (var i = 0, oHistoryItem; oHistoryItem = oStory.historyItems()[i]; i++){
                      if (oHistoryItem.id() === self._iHistoryItemId){
                        self._oHistoryItem = self._oOriginalHistoryItem = oHistoryItem;
                        self._bHistoryItemReady = true;
                      }
                    }
                  } else {
                    self._bHistoryItemReady = true;
                  }

                  //find related stories
                  self._oDatabase.findGroup('searchKeywords', 'sKeyword',
                    self._oStory.searchKeywords(), function(lSearchKeywords){
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
                          self._bRelatedReady = true;
                          if (self._bStoriesInTabsReady && self._bWorldReady){
                            self._oWorld.updateManager(self._oStory, self._oHistoryItem, self._lStoriesInTabs, self._lRelatedStories);
                          }
                        } else {
                          var lRelatedStories = [];
                          var iRelatedLength = lStories.length;
                          var iCount = 0;
                          for (var i = 0, oRelatedStory; oRelatedStory = lStories[i]; i++){
                            self.setItemsNoSearch(oRelatedStory, function(oStoryNoSearch){
                              iCount++;
                              if (oStoryNoSearch.historyItems().length > 0){
                                lRelatedStories.push(oStoryNoSearch);
                              }
                              if (iCount === iRelatedLength){
                                //sort related stories by closest
                                for (var j = 0, oStory; oStory = lRelatedStories[j]; j++){
                                  oStory['scoreToStory'] = Cotton.Algo.Score.Object.storyToStory(oStory, self._oStory);
                                }
                                lRelatedStories.sort(function(a,b){
                                  return b['scoreToStory'] - a['scoreToStory'];
                                });
                                self._lRelatedStories = lRelatedStories;
                                self._bRelatedReady = true;
                                if (self._bStoriesInTabsReady && self._bWorldReady){
                                  self._oWorld.updateManager(self._oStory, self._oHistoryItem, self._lStoriesInTabs, self._lRelatedStories);
                                }
                              }
                            });
                          }
                        }
                      });
                  });
                }
              });
            });
          }
        } else {
          self._oStory = null;
          self._bStoryReady = true;
          self._bHistoryItemReady = true;
          self._bRelatedReady = true;
          if (self._bStoriesInTabsReady && self._bWorldReady){
            self._oWorld.updateManager(self._oStory, self._oHistoryItem, self._lStoriesInTabs, self._lRelatedStories);
          }
        }

        //Stories in other tabs
        var iTabsLength = self._lStoriesInTabsId.length;
        if (iTabsLength > 0){
          self._oDatabase.findGroup('stories', 'id', self._lStoriesInTabsId, function(lStories) {
            self._lStoriesInTabs = [];
            var iCount = 0;
            for (var i = 0, oTabStory; oTabStory = lStories[i]; i++){
              self.setItemsNoSearch(oTabStory, function(oStoryNoSearch){
                iCount++;
                if (oStoryNoSearch.historyItems().length > 0){
                  self._lStoriesInTabs.push(oStoryNoSearch);
                }
                if (iCount === iTabsLength){
                  self._bStoriesInTabsReady = true;
                  if (self._bStoryReady && self._bHistoryItemReady && self._bRelatedReady && self._bWorldReady){
                    self._oWorld.updateManager(self._oStory, self._oHistoryItem, self._lStoriesInTabs, self._lRelatedStories);
                  }
                }
              });
            }
          });
        } else {
          self._lStoriesInTabs = [];
          self._bStoriesInTabsReady = true;
          if (self._bHistoryItemReady && self._bStoryReady && self._bRelatedReady && self._bWorldReady ){
            self._oWorld.updateManager(self._oStory, self._oHistoryItem, self._lStoriesInTabs, self._lRelatedStories);
          }
        }
      });
    });

    $(window).ready(function(){
      self._oWorld = new Cotton.UI.World(self, oMessenger, self._oDispatcher);
      self._bWorldReady = true;
      if (self._bHistoryItemReady && self._bStoryReady && self._bStoriesInTabsReady && self._bRelatedReady){
        self._oWorld.updateManager(self._oStory, self._oHistoryItem, self._lStoriesInTabs, self._lRelatedStories);
      }
    });

    window.onpopstate = function(){
      if (!self._bLanding){
        if (window.history.state['path'] === chrome.extension.getURL('lightyear.html')){
          self._oDispatcher.publish('open_manager', {'noPushState': true});
        } else {
          var sPath = history.state['path'];
          var iStoryId = parseInt(sPath.split("=")[1]);
          self._oDispatcher.publish('enter_story', {
            'story_id': iStoryId,
            'noPushState': true
          });
        }
      }
      self._bLanding = false;
    }

    // DISPATCHER SUBSCRIPTIONS
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
        self._oMessenger.sendMessage({
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
      self._oStory.dna().bagOfWords().mergeBag(
        oHistoryItem.extractedDNA().bagOfWords().get());
      if ((!self._oStory.featuredImage() || self._oStory.featuredImage() === "")
        && oHistoryItem.extractedDNA().imageUrl() !== ""){
          self._oStory.setFeaturedImage(oHistoryItem.extractedDNA().imageUrl());
      }
      oHistoryItem.setStoryId(self._oStory.id());
      self._oDatabase.put('stories', self._oStory, function(iId){
        self._oWorld.recycleMenu(self._oStory);
      });
      self._oDatabase.put('historyItems', oHistoryItem, function(iId){});
      self._oPool.delete(oHistoryItem.id());
    });


    this._oDispatcher.subscribe('enter_story', this, function(dArguments){
      self._iStoryId = dArguments['story_id'];

      if (!dArguments['noPushState']){
        var sStoryUrl = chrome.extension.getURL("lightyear.html")+"?sid=" + dArguments['story_id'];
        this.pushState(sStoryUrl);
      }
      if (self._iOriginalStoryId !== dArguments['story_id']){
        self._iHistoryItemId = -1;
        self._oHistoryItem = null;
      } else {
        self._iHistoryItemId = self._iOriginalHistoryItemId;
        self._oHistoryItem = self._oOriginalHistoryItem;
      }
      self._oMessenger.sendMessage({
        'action': 'change_story',
        'params': {'story_id': self._iStoryId}
      }, function(response){
        // set the new stories in tabs
        //TODO(rkorach) do it only when going back to the manager
        self._lStoriesInTabsId = response['stories_in_tabs_id'];
        var iTabsLength = self._lStoriesInTabsId.length;
        if (iTabsLength > 0){
          self._oDatabase.findGroup('stories', 'id', self._lStoriesInTabsId, function(lStories) {
            self._lStoriesInTabs = [];
            for (var i = 0, oTabStory; oTabStory = lStories[i]; i++){
              self.setItemsNoSearch(oTabStory, function(oStoryNoSearch){
                if (oStoryNoSearch.historyItems().length > 0){
                  self._lStoriesInTabs.push(oStoryNoSearch);
                }
              });
            }
          });
        } else {
          self._lStoriesInTabs = [];
        }
      });

      var getRelated = function(oStory){
        // related story
        self._oDatabase.findGroup('searchKeywords', 'sKeyword',
          self._oStory.searchKeywords(), function(lSearchKeywords){
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
              if (!lStories || lStories.length === 0){
                self._lRelatedStories = [];
                self._oWorld.clearAll();
                self._oWorld.updateMenu(self._oStory, self._lRelatedStories.length);
                self._oWorld.updateStory(self._oStory);
                document.title = "cottonTracks - " + self._oStory.title();
              } else {
                var iRelatedLength = lStories.length;
                var lRelatedStories = [];
                var iCount = 0;
                for (var i = 0, oStory; oStory = lStories[i]; i++){
                  self.setItemsNoSearch(oStory, function(oStoryNoSearch){
                    iCount++;
                    if (oStoryNoSearch.historyItems().length > 0){
                      lRelatedStories.push(oStoryNoSearch);
                    }
                    if (iCount === iRelatedLength){
                      //take the 6 closest stories
                      for (var i = 0, oStory; oStory = lRelatedStories[i]; i++){
                        oStory['scoreToStory'] = Cotton.Algo.Score.Object.storyToStory(oStory, self._oStory);
                      }
                      lRelatedStories.sort(function(a,b){
                        return b['scoreToStory'] - a['scoreToStory']
                      });
                      lRelatedStories = lRelatedStories.slice(0,Math.min(6, lRelatedStories.length));
                      self._lRelatedStories = lRelatedStories;
                      self._oWorld.clearAll();
                      self._oWorld.updateMenu(self._oStory, self._lRelatedStories.length);
                      self._oWorld.updateStory(self._oStory);
                      document.title = "cottonTracks - " + self._oStory.title();
                    }
                  });
                }
              }
            });
        });
      };

      if (dArguments['story']){
        self._oStory = dArguments['story'];

        // sort items with most recent first
        var lHistoryItems = self._oStory.historyItems();
        lHistoryItems.sort(function(a,b){
          return b.lastVisitTime() - a.lastVisitTime();
        });
        self._oStory.setHistoryItems(lHistoryItems);
        getRelated(self._oStory);
      } else {
        self._oDatabase.find('stories', 'id', self._iStoryId, function(oStory){
          self.setItemsNoSearch(oStory, function(oStoryNoSearch){
            self._oStory = oStoryNoSearch;
            getRelated(self._oStory);
          })
        });
      }
    });

    this._oDispatcher.subscribe('related_stories', this, function(dArguments){
      self._oWorld.relatedStories(self._lRelatedStories);
    });

    this._oDispatcher.subscribe('search_stories', this, function(dArguments){
      self.searchStories(dArguments['searchWords'], dArguments['context'], function(lSearchResultStories){
        var iSearch = lSearchResultStories.length;
        if (iSearch > 0){
          var iCount = 0;
          var lSearchStories = [];
          for (var i = 0, oStory; oStory = lSearchResultStories[i]; i++){
            iCount++;
            self.setItemsNoSearch(oStory, function(oStoryNoSearch){
              if (oStoryNoSearch.historyItems().length > 0){
                lSearchStories.push(oStoryNoSearch);
              }
              if (iCount === iSearch){
                if (dArguments['context'] === 'manager'){
                  self._oWorld.refreshManager(lSearchStories);
                } else {
                  self._oWorld.refreshRelatedStories(lSearchStories);
                }
              }
            });
          }
        }
        else {
          if (dArguments['context'] === 'manager'){
            self._oWorld.refreshManager(lSearchResultStories);
          } else {
            self._oWorld.refreshRelatedStories(lSearchResultStories);
          }
        }
      });
    });

    this._oDispatcher.subscribe('open_manager', this, function(dArguments){
      self._oWorld.clearAll();
      self._oWorld.updateManager(self._oStory, self._oHistoryItem, self._lStoriesInTabs, self._lRelatedStories);
      document.title = "cottonTracks";
      if (!dArguments || !dArguments['noPushState']){
        var sManagerUrl = chrome.extension.getURL("lightyear.html");
        this.pushState(sManagerUrl);
      }
    });

    this._oDispatcher.subscribe('edit_title', this, function(dArguments){
      self._oDatabase.find('stories', 'id', dArguments['id'], function(oStory){
        oStory.setTitle(dArguments['title']);
        var lTitle = dArguments['title'].split(' ');
        var lStrongWords = Cotton.Algo.Tools.Filter(lTitle);
        oStory.dna().addListWords(lStrongWords, oStory.dna().bagOfWords().maxWeight());
        self._oDatabase.put('stories', oStory, function(){});
      });
      if (self._lRelatedStories){
        for (var i=0, oRelated; oRelated = self._lRelatedStories[i]; i++){
          if (oRelated.id() === dArguments['id']){
            oRelated.setTitle(dArguments['title']);
          }
        }
      }
      if (self._oStory && self._oStory === dArguments['id']){
        self._oStory.setTitle(dArguments['title']);
      }
    });

    this._oDispatcher.subscribe('get_more_all_stories', this, function(dArguments){
      self._oDatabase.getFirst('stories', 'fLastVisitTime', function(oStory){
        if (oStory && oStory.lastVisitTime() < dArguments['fDate']){
          //there are some more stories, get them.
          self._oDatabase.getKeyRange('stories', 'fLastVisitTime',
            dArguments['fDate'] - 100000000, dArguments['fDate']-1, function(lStories) {
              var iLength = lStories.length;
              if (iLength > 0){
                var iCount = 0;
                var lStoriesToAdd = [];
                for (var i = 0, oStory; oStory = lStories[i]; i++){
                  self.setItemsNoSearch(oStory, function(oStoryNoSearch){
                    iCount++;
                    if (oStoryNoSearch.historyItems().length > 0){
                      lStoriesToAdd.push(oStoryNoSearch);
                    }
                    if (iCount === iLength){
                      self._oDispatcher.publish('more_all_stories',
                        {
                          'stories_to_add': lStoriesToAdd,
                          'more_stories_to_add': true
                        }
                      );
                    }
                  });
                }
              } else {
                self._oDispatcher.publish('more_all_stories',
                  {
                    'stories_to_add': null,
                    'more_stories_to_add': true
                  }
                );
              }
          });
        } else {
          self._oDispatcher.publish('more_all_stories',
            {
              'stories_to_add': null,
              'more_stories_to_add': false
            }
          );
        }
      });
    });

    this._oDispatcher.subscribe('story:delete', this, function(dArguments){
      var bMainStory = dArguments['id'] === self._iStoryId;
      self._oDatabase.delete('stories', dArguments['id'], function(){
        self._oDispatcher.publish('story:deleted', {
          'id': dArguments['id'],
          'main_story': bMainStory,
          'bOpenStorySticker': dArguments['bOpenStorySticker']
        });
      });
      if (dArguments['id'] === self._iStoryId){
        // tell background that the current main story has been deleted
        self._iStoryId = null;
        self._oMessenger.sendMessage({
          'action': 'delete_main_story',
        }, function(response){});
      }
    });


    // Message listening from background page for getContent
    this._oMessenger.listen('refresh_item', function(request, sender, sendResponse){
      self.recycleItem(request['params']['itemId']);
      self.recycleMenu();
    });

    // go back to manager if browserAction clicked
    chrome.browserAction.onClicked.addListener(function() {
      //open manager
      window.location.href = "lightyear.html";
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
      self._oDatabase, self._oStory.id(), sHistoryItemId, function(){
        self._oDispatcher.publish('database:item_deleted',{'id':sHistoryItemId});
      }
    );
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
  },

  pushState : function(sUrl){
    history.pushState({path: sUrl}, '', sUrl);
  },

  replaceState : function(sUrl){
    history.replaceState({path: sUrl}, '', sUrl);
  },

  setItemsNoSearch : function(oStory, mCallback){
    var lHistoryItemsNoSearch = oStory.historyItems() || [];
    this._oDatabase.getKeyRange('historyItems', 'sStoryId', oStory.id(), oStory.id(), function(lHistoryItems){
      for (var j = 0, oHistoryItem; oHistoryItem = lHistoryItems[j]; j++){
        var oUrl = oHistoryItem.oUrl();
        oUrl.fineDecomposition();
        if (!oUrl.isGoogle || !oUrl.dSearch || oUrl.isGoogleMaps){
          lHistoryItemsNoSearch.push(oHistoryItem);
        }
      }
      oStory.setHistoryItems(lHistoryItemsNoSearch);
      if (mCallback){
        mCallback.call(self, oStory);
      }
    });
  }

});

var oMessenger = new Cotton.Core.Messenger();
Cotton.Controllers.LIGHTYEAR = new Cotton.Controllers.Lightyear(oMessenger);
