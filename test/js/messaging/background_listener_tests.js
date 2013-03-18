module('Cotton.Controller.BackgroundListener', {});

MockMessagingController = Class.extend({
  init: function(){
  },
  doAction: function(sAction, mCallback, lArguments){
    mCallback({'status': 'ok'});
  },
  // Bad idea because we can't do async response.
  getResponseForAction(sAction){
    return {'status': 'ok'};
  }
});

test('init.', function(){
  var oMockMessagingController = new MockMessagingController();
  var oBackgroundListener = new Cotton.Controllers.BackgroundListener(oMockMessagingController);
  ok(oBackgroundListener);
});

async('send a message', function(){
  chrome.extension.sendMessage({
    'action': 'fake_action'
  }, function(oResponse) {
      //The historyItem url was not in base, init this one with the new id created
      equal(oResponse['status'], 'ok');
      start();
    });
});
