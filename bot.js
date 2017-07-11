const TelegramBot = require('node-telegram-bot-api')
const jsonfile = require('jsonfile')
const _ = require('lodash');

(function () {

  // Set up Telegram Bot that is polling for new messages. If a new Bot will be used, replace the token.

  var bot;
  var dingDong;
  var setup;

  // Set up the default keyboard
  // Dit leek me handig als een soort menu balk, met Mute en Unmute functie, 
  const defaultKeyboard = {
    reply_markup: {
      resize_keyboard: false,
      one_time_keyboard: false,
      // keyboard: [["/Mute \ud83d\udd15","/Unmute \ud83d\udd14"],["/Show Commands"]]
      keyboard: [
        [{
          text: "\ud83d\udd15 Mute doorbell",
          callback_data: "mute"
        }],
        [{
          text: "\ud83d\udd14 Unmute doorbell",
          callback_data: "unmute"
        }],
        ["\u2753 Show Commands"]
      ]
    }
  }



  setup = function (token) {
    bot = new TelegramBot(token, {
      polling: true
    });



    // Console.log each message that is received for debugging purposes
    bot.on('message', (msg) => {
      const chatId = msg.chat.id;
      console.log(msg)
    });

    // First command that is sent whena a Bot is added is "/Start/. Could be usefull for first time set up.
    bot.onText(/\/start/, (msg) => {

      const chatId = msg.chat.id;
      const resp = "Hi Stranger! Nice too meet you, I'm the front door of Voorhaven 57. If you want, I'll alert you when you when there is someone (or something) the door for you. Would you like to register? /Yes /No";
      bot.sendMessage(chatId, resp, defaultKeyboard);
    });

    // "Mute" command
    bot.onText(/\/mute/, (msg) => {
      var file = 'data.json'
      var i
      var j
      var studio
      var name
      const chatId = msg.chat.id;
      var data = fs.readFileSync(file)
      var obj = JSON.parse(data)
      for (i = 0; i < obj.length; i++) {
        for (j = 0; j < obj[i].people.length; j++) {
          if (obj[i].people[j].chatID == chatId) {
            name = obj[i].people[j].name
            studio = obj[i].studioName
            if (obj[i].people[j].mute == false) {
              obj[i].people[j].mute = true
              var data = JSON.stringify(obj, null, 2)
              fs.writeFile('data.json', data, finished)
              muteConfirm(name, studio, chatId)
            } else if (obj[i].people[j].mute == true) {
              muteDenial(name, studio, chatId)
            } else {
              obj[i].people[j].mute = false
              var data = JSON.stringify(obj, null, 2)
              fs.writeFile('data.json', data, finished)
              muteError(name, studio, chatId)
            }
            break
          }
        }
      }
    })












    var muteConfirm = function (name, studio, chatId) {
      msg = "Hi " + name + " from " + studio + ", I'll stop notifying you when there is someone at the door for you. If you want notifications again send me the command /unmute"
      bot.sendMessage(chatId, msg, defaultKeyboard)
    }

    var muteDenial = function (name, studio, chatId) {
      msg = "Hi " + name + " from " + studio + ", it seems you are already muted me!"
      bot.sendMessage(chatId, msg, defaultKeyboard)
    }

    var muteError = function (name, studio, chatId) {
      msg = "Hi " + name + " from " + studio + ", it seems like something went wrong, please try again by sending /mute"
      bot.sendMessage(chatId, msg, defaultKeyboard)
    }

    // "Unmute" command
    bot.onText(/\/unmute/, (msg) => {
      var file = 'data.json'
      var i
      var j
      var studio
      var name
      const chatId = msg.chat.id;
      var data = fs.readFileSync(file)
      var obj = JSON.parse(data)
      for (i = 0; i < obj.length; i++) {
        for (j = 0; j < obj[i].people.length; j++) {
          if (obj[i].people[j].chatID == chatId) {
            name = obj[i].people[j].name
            studio = obj[i].studioName
            if (obj[i].people[j].mute == true) {
              obj[i].people[j].mute = false
              var data = JSON.stringify(obj, null, 2)
              fs.writeFile('data.json', data, finished)
              unmuteConfirm(name, studio, chatId)
            } else if (obj[i].people[j].mute == false) {
              unmuteDenial(name, studio, chatId)
            } else {
              obj[i].people[j].mute = true
              var data = JSON.stringify(obj, null, 2)
              fs.writeFile('data.json', data, finished)
              unmuteError(name, studio, chatId)
            }
            break
          }
        }
      }
    })

    var unmuteConfirm = function (name, studio, chatId) {
      msg = "Hi " + name + " from " + studio + ", you will now receive notifications from again when there is someone at the door for you! You can mute me again by sending /mute"
      bot.sendMessage(chatId, msg, defaultKeyboard)
    }

    var unmuteDenial = function (name, studio, chatId) {
      msg = "Hi " + name + " from " + studio + ", it seems you are already receiving notifications from me!"
      bot.sendMessage(chatId, msg, defaultKeyboard)
    }

    var unmuteError = function (name, studio, chatId) {
      msg = "Hi " + name + " from " + studio + ", it seems like something went wrong, please try again by sending /unmute"
      bot.sendMessage(chatId, msg, defaultKeyboard)
    }

    finished = function (err) {
      console.log('all set!')
    }

    //2001: A Space Oddysey Easter Egg!!!
    bot.onText(/\/2001/, (msg) => {
      var file = 'data.json'
      var i
      var j
      var name
      const chatId = msg.chat.id;
      var data = fs.readFileSync(file)
      var obj = JSON.parse(data)
      for (i = 0; i < obj.length; i++) {
        for (j = 0; j < obj[i].people.length; j++) {
          if (obj[i].people[j].chatID == chatId) {
            name = obj[i].people[j].name
            studio = obj[i].studioName
            affirmative(name, chatId)
            break
          }
        }
      }
    })

    bot.onText(/\/open/, (msg) => {
      var file = 'data.json'
      var i
      var j
      var studio
      var name
      const chatId = msg.chat.id;
      var data = fs.readFileSync(file)
      var obj = JSON.parse(data)
      for (i = 0; i < obj.length; i++) {
        for (j = 0; j < obj[i].people.length; j++) {
          if (obj[i].people[j].chatID == chatId) {
            name = obj[i].people[j].name
            imSorryDave(name, chatId)
            break
          }
        }
      }
    })

    var affirmative = function (name, chatId) {
      msg = "Affirmative " + name + ", I can read you."
      const keyboard = {
        reply_markup: {
          resize_keyboard: false,
          one_time_keyboard: true,
          keyboard: [
            [{
              text: "/Open the pod bay door, Front Door."
            }]
          ]
        }
      }
      bot.sendMessage(chatId, msg, keyboard)
    }

    var imSorryDave = function (name, chatId) {
      var hal = '2001.png';

      msg = "I'm sorry " + name + ", I'm afraid I can't do that."
      bot.sendPhoto(chatId, hal, {
        caption: ''
      });
      bot.sendMessage(chatId, msg, defaultKeyboard)
    }
  }
  // Pulls telegram chat ID from the data JSON file and sends it an alert message.
  var dingDong = function (studioID) {
    var file = 'data.json'
    var chatId
    jsonfile.readFile(file, function (err, obj) {
      for (var i = 0; i < obj[studioID].people.length; i++) {
        if (obj[studioID].people[i].mute == false) {
          chatId = obj[studioID].people[i].chatID
          msg = "Hi " + obj[studioID].people[i].name + ", there is someone at the door for " + obj[studioID].studioName + "! Can you open the door? /Yes /No"
          const opts = {
            reply_markup: {
              resize_keyboard: false,
              one_time_keyboard: true,
              keyboard: [
                ["Yes I can open the door!"],
                ["No I cannout open the door"]
              ]
            }
          }
          bot.sendMessage(chatId, msg, opts)
        }
      }
    })
  }

  module.exports.dingDong = dingDong;
  module.exports.setup = setup;

}());