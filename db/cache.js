'use strict';

Cotton.DB.Cache = Class.extend({
  init : function(){
    //if(!localStorage['ct-stories-cache']){
      localStorage['ct-stories-cache'] = JSON.stringify([
      {
        fLastVisitTime: 1360338084196.688,
        fRelevance: null,
        id: 1,
        lTags: [],
        lVisitItemsId: [1141],
        sFeaturedImage: "",
        sFormatVersion: "0.1",
        sTitle: "My Reviews | git.corp Code Review",
      },
      {
        fLastVisitTime: 1360331471984.9082,
        fRelevance: null,
        lTags: [],
        lVisitItemsId: [1141],
        sFeaturedImage: "",
        sFormatVersion: "0.1",
        sTitle: "LTU",
      },
      {
        fLastVisitTime: 1360329780640.9968,
        fRelevance: null,
        lTags: [],
        lVisitItemsId: [1141],
        sFeaturedImage: "",
        sFormatVersion: "0.1",
        sTitle: "Add New Promotion ‹ LTU — WordPress",
      },
      {
        fLastVisitTime: 1359718583764.991,
        fRelevance: null,
        lTags: [],
        lVisitItemsId: [1141],
        sFeaturedImage: "http://www.spclarke.com/wp-content/uploads/2011/11/platters-singing.jpg",
        sFormatVersion: "0.1",
        sTitle: "bogart",
      }
      ]);
    //}
  },
  get : function(){
    return JSON.parse(localStorage['ct-stories-cache']);
  },
});
