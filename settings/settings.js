window.onload = function(){

  /**
   * PRE FILLED
   * filled all the settings with value in the local storage, or with default
   * value
   */

  // GRID
  if(localStorage['ct-settings_grid'] === "MostVisited"){
    $('#grid input[value=MostVisited]').attr("checked", "checked");
  } else {
    $('#grid input[value=Favorites]').attr("checked", "checked");
  }

  // Favorites
  var favorites = localStorage['ct-settings_favorites'];
  if(!favorites || favorites === "undefined"){
    favorites = {'favorites' : [
      {
        'title':'Techcrunch',
        'url' : 'http://techcrunch.com',
        'thumbnail' : '/media/images/home/tickets/TC.jpg'
      },
      {
        'title': 'Fubiz',
        'url' : 'http://fubiz.net',
        'thumbnail' : '/media/images/home/tickets/Fubiz.jpg'
      },
      {
        'title': 'Facebook',
        'url' : 'http://facebook.com',
        'thumbnail' : '/media/images/home/tickets/FB.jpg'
      },
      {
        'title': 'Dribble',
        'url' : 'http://dribbble.com',
        'thumbnail' :'/media/images/home/tickets/Dribbble.jpg'
      },
      {
        'title': 'PandoDaily',
        'url' : 'http://pandodaily.com',
        'thumbnail' :'/media/images/home/tickets/PandoDaily.jpg'
      },
      {
        'title': 'MTV',
        'url' : 'http://www.mtv.com',
        'thumbnail' :'/media/images/home/tickets/MTV.jpg'
      },
      {
        'title': 'Twitter',
        'url' : 'http://twitter.com',
        'thumbnail' :'/media/images/home/tickets/Twitter.jpg'
      },
      {
        'title': 'Pinterest',
        'url' : 'http://pinterest.com',
        'thumbnail' :'/media/images/home/tickets/Pinterest.jpg'
      },

      ]};
  } else {
    favorites = JSON.parse(favorites);
  }

  for(var i = 0, oFavorite; oFavorite = favorites['favorites'][i]; i++){
    $('#grid input[name=favorites_title]:eq('+ i +')').val(oFavorite['title']);
    $('#grid input[name=favorites_url]:eq('+ i +')').val(oFavorite['url']);
  }



  // ACTION
  // Store the settings using localStorage
  $('#grid input').click(function() {
    localStorage['ct-settings_grid'] = $(this + ':checked').val();
  });

  //
  $('#grid').submit(function() {
    for(var i = 0, oFavorite; oFavorite = favorites['favorites'][i]; i++){
      oFavorite['title'] = $('#grid input[name=favorites_title]:eq('+ i +')').val();
      oFavorite['url'] = $('#grid input[name=favorites_url]:eq('+ i +')').val();
    }

    localStorage['ct-settings_favorites'] = JSON.stringify(favorites);
  });

};
