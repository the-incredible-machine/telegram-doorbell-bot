// Include npm modules

const http = require('http');
const _ = require('lodash');
const static = require('node-static');
const bot = require('./bot.js');
const util = require('util');
const data = require('./data.js');

const port = 8888;
const telegramToken = '425604028:AAH0poVhUMMNPq5_lIcLo0P1it3S2eHf8tM'
const webroot = './web';




// Set up static server
var file = new(static.Server)(webroot, {
	cache: 0
});

var messagesResponse;
var naysayers;
var currentStudioId;

var messageCallback = function (msg) {

	if ( msg.data === "door:yes" ) {

		if (messagesResponse) {
			messagesResponse.writeHead(200, {
				'Content-Type': 'text/html'
			});
			//messagesResponse.write(msg.message.chat.username);
			messagesResponse.write("coming");
			messagesResponse.end();
		}
	} else if ( msg.data === "door:no") {
		naysayers.push(msg.message.chat.id);
		if( naysayers.length >= data.getMemberCount(currentStudioId)){
				messagesResponse.writeHead(200, {
				'Content-Type': 'text/html'
			});
			//messagesResponse.write(msg.message.chat.username);
			messagesResponse.write("not-coming");
			messagesResponse.end();
		}
	}
	//TODO : let ppl in studio know aobut response

}

// Bot setup
bot.setup(telegramToken, messageCallback);

var server = http.createServer(function (req, res) {
	req.addListener('end', function () {
		//if (req.url.startsWith('/messages')) {
			//console.log("messages");
			//messagesResponse = res;
		//} else 
		if (req.url.startsWith('/dingdong?')) {
			messagesResponse = res;
			// res.writeHead(200, {
			// 	"Content-Type": "text/html"
			// });
			var clickID = req.url.split("?")[1].split("&")[0].split("=")[1];
			bot.dingDong(clickID);
			currentStudioId = clickID;
			naysayers = [];
		} else {


			file.serve(req, res, function (err, result) {
				if (err) {
					console.error('Error serving %s - %s', req.url, err.message);
					res.writeHead(err.status, err.headers);
					res.write("" + err.status);
					res.end();
				} else {
					console.log('%s - %s', req.url, res.message);
				}
			});
		}
	}).resume();

}).listen(port, function () {
	console.log("Now online on " + port)
});