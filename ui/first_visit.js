'use strict';

Cotton.UI.firstVisit = function (){
  $(document).ready(function($){
    var sContent = "<div id='firstVisit'>" + 
    "<h1>CottonTracks</h1>" +
    "<p> Congrat's you have downloaded one of the most innovative application, that will allow you to handle your navigation and to take all the benefits of your history.<br/>" +
    "This apllication should be so intuitive, but if you need more help take a look at this tutorial. <br/>" +
    "All the team wish a great first time on CottonTracks ;) <br/>" +
    "</p>" +
    "</div>";
  $("body").append(sContent);
});
}
