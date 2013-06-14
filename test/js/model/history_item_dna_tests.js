'use strict';

module("Cotton.DB.Model.HistoryItemDNA",{
  setup: function() {
    // runs before each test

  },
  teardown: function() {
    // runs after each test
  }
});

test("init.", function() {
  var oHistoryItemDNA = new Cotton.Model.HistoryItemDNA({});
  ok(oHistoryItemDNA);
});


test("init with a dbRecord.", function() {
  var oHistoryItemDNA = new Cotton.Model.HistoryItemDNA({
    'dBagOfWords': {'Alice': 3, 'Wonderland': 2},
    'iPercent' : 45,
    'lQueryWords': ['Alice', 'Wonderland']
  });
  ok(oHistoryItemDNA);
  deepEqual(oHistoryItemDNA.bagOfWords().getWords(), ["alice", "wonderland"]);
});

test("getters.", function() {
  var oHistoryItemDNA = new Cotton.Model.HistoryItemDNA({
    'dBagOfWords': {'Alice': 3, 'Wonderland': 2},
    'iPercent' : 45,
    'lQueryWords': ['Alice', 'Wonderland']
  });
  equal(oHistoryItemDNA.get('iPercent'), 45);
  equal(oHistoryItemDNA.percent(), 45);
  equal(oHistoryItemDNA.imageUrl(), "");
  equal(oHistoryItemDNA.pageScore(), 0);
  equal(oHistoryItemDNA.timeTabActive(), -1);
  equal(oHistoryItemDNA.timeTabOpen(), 0);
  equal(oHistoryItemDNA.firstParagraph(), undefined);
  deepEqual(oHistoryItemDNA.paragraphs(), []);
  deepEqual(oHistoryItemDNA.bagOfWords().getWords(), ["alice", "wonderland"]);
  deepEqual(oHistoryItemDNA.queryWords(), ['Alice', 'Wonderland']);

});

test("setters.", function() {
  var oHistoryItemDNA = new Cotton.Model.HistoryItemDNA({
    'dBagOfWords': {'Alice': 3, 'Wonderland': 2},
    'iPercent' : 45,
    'lQueryWords': ['Alice', 'Wonderland']
  });
  oHistoryItemDNA.set('iPercent', 90);
  oHistoryItemDNA.setImageUrl('white_rabbit.png');
  oHistoryItemDNA.setPageScore(33);
  oHistoryItemDNA.setTimeTabActive(44);
  oHistoryItemDNA.setTimeTabOpen(55);
  var oParagraph = new Cotton.Model.ExtractedParagraph("She was not sleeping.");

  oHistoryItemDNA.addParagraph(oParagraph);

  oHistoryItemDNA.setQueryWords(['white', 'rabbit']);
  equal(oHistoryItemDNA.get('iPercent'), 90);
  equal(oHistoryItemDNA.percent(), 90);
  equal(oHistoryItemDNA.imageUrl(), 'white_rabbit.png');
  equal(oHistoryItemDNA.pageScore(), 33);
  equal(oHistoryItemDNA.timeTabActive(), 44);
  equal(oHistoryItemDNA.timeTabOpen(), 55);
  deepEqual(oHistoryItemDNA.firstParagraph(), oParagraph);
  deepEqual(oHistoryItemDNA.paragraphs(), [oParagraph]);
  deepEqual(oHistoryItemDNA.bagOfWords().getWords(), ['alice', 'wonderland']);
  deepEqual(oHistoryItemDNA.queryWords(), ['white', 'rabbit']);

});

test("addExtractedWordsToBagOfWords.", function() {
  var oHistoryItemDNA = new Cotton.Model.HistoryItemDNA({
    'dBagOfWords': {'Alice': 3, 'Wonderland': 2},
    'iPercent' : 45,
    'lQueryWords': ['Alice', 'Wonderland']
  });

  oHistoryItemDNA.addExtractedWordsToBagOfWords(['cat', 'Crazy']);
  deepEqual(oHistoryItemDNA.bagOfWords().getWords(), ['alice', 'wonderland', 'cat', 'crazy']);

});

test("setQueryWords.", function() {
  var oHistoryItemDNA = new Cotton.Model.HistoryItemDNA({});
  oHistoryItemDNA.setQueryWords(['the', 'Magical', 'Mystery', 'Tour', 'of', 'the', 'Beatles']);
  var lQueryWords = ['the', 'Magical', 'Mystery', 'Tour', 'of', 'the', 'Beatles'];
  deepEqual(oHistoryItemDNA.queryWords(), lQueryWords);
});

test("setStrongQueryWords.", function(){
  var oHistoryItemDNA = new Cotton.Model.HistoryItemDNA({});
  oHistoryItemDNA.setStrongQueryWords(['Magical', 'Mystery', 'Tour', 'Beatles']);
  var dBagOfWords = {"magical": 5, "mystery": 5, "tour": 5, "beatles": 5}
  deepEqual(oHistoryItemDNA.bagOfWords().get(), dBagOfWords);
});

test("setWeakQueryWords.", function(){
  var oHistoryItemDNA = new Cotton.Model.HistoryItemDNA({});
  oHistoryItemDNA.setWeakQueryWords(['the', 'of', 'the']);
  var dBagOfWords = {"the": 2, "of": 2}
  deepEqual(oHistoryItemDNA.bagOfWords().get(), dBagOfWords);
});


test("addParagraph.", function() {
  var oHistoryItemDNA = new Cotton.Model.HistoryItemDNA({});
  var oParagraph1 = new Cotton.Model.ExtractedParagraph("She was sleeping");
  oParagraph1.setId(1);
   var oParagraph2 = new Cotton.Model.ExtractedParagraph("He was late");
  oParagraph2.setId(2);
  oHistoryItemDNA.addParagraph(oParagraph1);
  oHistoryItemDNA.addParagraph(oParagraph2);
  deepEqual(oHistoryItemDNA.dbRecord()['lParagraphs'],
    [
      {
        'id': 1,
        'fPercent': 0,
        'sText': 'She was sleeping',
        'lQuotes': []
      },
      {
        'id': 2,
        'fPercent': 0,
        'sText': 'He was late',
        'lQuotes': []
      },

    ]);
});


