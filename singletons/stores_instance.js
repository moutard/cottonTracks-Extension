// Stores singletons
// - visit items
// - stories

Cotton.Stores = {};

Cotton.Stores.oVisitItems = new Cotton.DB.Store('ct', {
  'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS
}, function() {
});

Cotton.Stores.oStories = new Cotton.DB.Store('ct', {
  'stories' : Cotton.Translators.STORY_TRANSLATORS
}, function() {
});