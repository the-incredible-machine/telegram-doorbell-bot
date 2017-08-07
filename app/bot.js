const TelegramBot = require('node-telegram-bot-api')
const jsonfile = require('jsonfile')
const _ = require('lodash');
const fs = require('fs');
const data = require('./data.js');


(function () {

  var bot;
  var dingDong;
  var setup;
  var dataObj = data.getData();
  var messageCallback;

  //TODO: update default keyboard, or remove..
  const defaultKeyboard = {
    reply_markup: {
      resize_keyboard: false,
      one_time_keyboard: false,
      // keyboard: [["/Mute \ud83d\udd15","/Unmute \ud83d\udd14"],["/Show Commands"]]
      keyboard: [
        [{
          text: "/start",
          callback_data: "/start"
        }]
      ]
    }
  }


  setup = function (token, _messageCallback) {

    messageCallback = _messageCallback;
    bot = new TelegramBot(token, {
      polling: true
    });
    console.log('bot:',bot);
    // Console.log each message that is received for debugging purposes
    bot.on('message', (msg) => {
      const chatId = msg.chat.id;
      console.log(msg)
    });
    
    // First command that is sent whena a Bot is added is "/Start/. Could be usefull for first time set up.
    bot.onText(/\/start/, (msg) => {

      var buttons = _.map(dataObj, function(s, i){
        return {text:s.studioName, callback_data:'studio:'+i};
      });
      var buttons2 = [];
      while(buttons.length) {
        buttons2.push( buttons.splice(0,2));
      }

      bot.sendMessage(
        msg.chat.id,
        "Hi! I am your front door. For which studio do you want to receive alerts?",
        {
            reply_markup: {
              inline_keyboard: buttons2
            }
          }
      );
      
    });
    bot.on('callback_query', function (msg) {
      console.log(msg);
      if( msg.data.startsWith('studio')){
        var studioId = msg.data.split(':')[1];
        var chatId = ""+msg.from.id;
        var firstName = msg.from.first_name;
        
        var resultMessage = data.toggleMembership(chatId, firstName, studioId);
        if(resultMessage.length) {
          bot.answerCallbackQuery(msg.id, resultMessage, false);
        }
      
      }else if( msg.data.startsWith('door')){
        if(messageCallback){
          messageCallback(msg);
        }
      }
    });
  }

  // Pulls telegram chat ID from the data JSON file and sends it an alert message.
  var dingDong = function (studioID) {
    
    _.each(dataObj[studioID].people, function(p){
      bot.sendMessage(
        p.chatId,
        "There is someone at the door for " + dataObj[studioID].studioName + "! Can you open the door?",
        {
            reply_markup: {
              inline_keyboard: [
                [{text:"Yes, I am coming", callback_data:"door:yes"}],
                [{text:"No, I can't come", callback_data:"door:no"}]
              ]
            }
          }
      )
    });
  }
  var notifyStudio = function( studioId, message, excludeId ) {
    if( !dataObj[studioId].people.length ) return;

    _.each(dataObj[studioId].people, function(p){
      //if( p.chatId == excludeId ) return;

      bot.sendMessage( p.chatId, message );
    });
  }
  
  module.exports.dingDong = dingDong;
  module.exports.setup = setup;
  module.exports.notifyStudio = notifyStudio;
  

}());