// Include npm modules

const http = require('http');
const _ = require('lodash');
const static = require('node-static');
const bot = require('./bot.js');
const util = require('util');

const port = 8888;
const telegramToken = '425604028:AAH0poVhUMMNPq5_lIcLo0P1it3S2eHf8tM'
const webroot = './static';




// Set up static server
var file = new(static.Server)(webroot, {cache: 0});

var messagesResponse;
var messageCallback = function(msg){
	if( messagesResponse ) {
		messagesResponse.writeHead(200, {'Content-Type': 'text/html'});
		messagesResponse.write("test messages");
		messagesResponse.end();
	}
}

// Bot setup
bot.setup(telegramToken, messageCallback);

var server = http.createServer(function (req, res) {
	req.addListener('end', function () {
		if( req.url.startsWith('/messages')){
			console.log("messages");
			messagesResponse = res;
		} else if (req.url === '/test') {
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write("test");
			res.end();
			

		} else if (req.url.startsWith('/dingdong') ){
 		    res.writeHead(200, {"Content-Type": "text/html"});
	        var clickID = req.url.split("?")[1].split("&")[0].split("=")[1];
	        res.write(clickID);
	        console.log(clickID);

	        bot.dingDong(clickID);
		
		} else {
		
	
			file.serve(req, res, function (err, result) {
				if (err) {
					console.error('Error serving %s - %s', req.url, err.message);
					res.writeHead(err.status, err.headers);
					res.write(""+err.status);
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