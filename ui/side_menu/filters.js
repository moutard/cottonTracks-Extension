'use strict';

Cotton.UI.SideMenu.Filters = Class.extend({

  _oMenu : null,
  _$filters : null,
  _$all : null,
  _$article : null,
  _$images : null,
  _$videos : null,
  _$maps : null,
  _$sounds : null,
  _$quotes : null,

 init: function(oMenu){
	  this._oMenu = oMenu;
	
	  this._$filters = $('<div class="ct-filters"></div>');
	  this._$all = $('<div class="ct-filter all_filter">');
		this._$articles = $('<div class="ct-filter articles_filter">');
		this._$images = $('<div class="ct-filter images_filter">');
		this._$videos = $('<div class="ct-filter videos_filter">');
		this._$maps = $('<div class="ct-filter maps_filter">');
		this._$sounds = $('<div class="ct-filter sounds_filter">');
		this._$quotes = $('<div class="ct-filter quotes_filter">');
		
		//set values
		var sAllCount = '<span class="all_count"></span> All'
		this._$all.html(sAllCount);
		var sArticlesCount = '<span class="article_count"></span> Articles'
		this._$articles.html(sArticlesCount);
		var sImagesCount = '<span class="images_count"></span> Images'
		this._$images.html(sImagesCount);
		var sVideosCount = '<span class="videos_count"></span> Videos'
		this._$videos.html(sVideosCount);
		var sMapsCount = '<span class="maps_count"></span> Maps'
		this._$maps.html(sMapsCount);
		var sSoundsCount = '<span class="sounds_count"></span> Sounds'
		this._$sounds.html(sSoundsCount);
		var sQuotesCount = '<span class="quotes_count"></span> Quotes'
		this._$quotes.html(sQuotesCount);
		
    //construct element
	  this._$filters.append( 
      this._$all,
      this._$articles,
      this._$images,
      this._$videos,
      this._$maps,
      this._$sounds,
      this._$quotes
	  );
	
	  this._$filters.children().click(function(){
		  //do something
	  });
  },

  $ : function(){
	  return this._$filters;
  },

});