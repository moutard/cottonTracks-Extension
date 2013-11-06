'use strict';

module('Cotton.UI.Stand.Story.Card.Content.Quote', {

});

test('init.', function() {
  var sText = "The series centers primarily on Link, the playable character. Link is often given the task of rescuing Princess Zelda in the most common setting of the series, Hyrule, from Ganon (also known as Ganondorf), a Gerudo thief who is the primary antagonist of the series. However, other settings and antagonists have appeared throughout the games, with Vaati being a strong secondary antagonist during the lifespan of the Game Boy Advance. The story commonly involves a relic known as the Triforce, which is a set of three omnipotent golden triangles. The protagonist in each game is usually not the same incarnation of Link, but a few exceptions do exist.";
  var lQuotes = [{"start":3, "end": 20}, {"start":18, "end": 30}, {"start":40, "end": 45}];

  var oParagraphWithQuotes = new Cotton.Model.ExtractedParagraph(sText, lQuotes);

  var oQuote = new Cotton.UI.Stand.Story.Card.Content.Quote(oParagraphWithQuotes);
  ok(oQuote);
});