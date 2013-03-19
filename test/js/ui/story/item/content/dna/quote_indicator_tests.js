'use strict';

module("Cotton.UI.Story.Item.Content.Dna.QuoteIndicator",{
  setup: function() {
    // runs before each test
  },
  teardown: function() {
    // runs after each test
  }
});

test("init.", function(){
  var oQuoteIndicator = new Cotton.UI.Story.Item.Content.Dna.QuoteIndicator(0);
  ok(oQuoteIndicator);
});

test("do not display if zero quote.", function(){
  var oQuoteIndicator = new Cotton.UI.Story.Item.Content.Dna.QuoteIndicator(0);
  equal(oQuoteIndicator._$quote_indicator_number, undefined);
});

test("display if more than 1 quote.", function(){
  var oQuoteIndicator = new Cotton.UI.Story.Item.Content.Dna.QuoteIndicator(1);
  equal(oQuoteIndicator._$quote_indicator_number.text(), '1 Quote');
});

test("display if more than 2 quote.", function(){
  var oQuoteIndicator = new Cotton.UI.Story.Item.Content.Dna.QuoteIndicator(1);
  equal(oQuoteIndicator._$quote_indicator_number.text(), '2 Quotes');
});
