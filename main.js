// Include npm modules

const http = require('http');
const _ = require('lodash');
const static = require('node-static');
const bot = require('./bot.js');
const util = require('util');

const port = 8888;
const telegramToken = '425604028:AAH0poVhUMMNPq5_lIcLo0P1it3S2eHf8tM'
const webroot = './static';


// Bot setup
bot.setup(telegramToken);

// Set up static server
var file = new(static.Server)(webroot, {cache: 0});


var server = http.createServer(function (req, res) {
	req.addListener('end', function () {
		if (req.url === '/test') {
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write("test");
			res.end();

		} else if (req.url.startsWith('/dingdong') ){
 			// When an AJAX request is received, the request url is split until the ID of the clicked link remains. This is used to send a telegram message to the right people.
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
	/*
	    switch (request.url) {
	        case "/style.css" :
	            response.writeHead(200, {"Content-Type": "text/css"});
	            response.write(cssFile);
	            break;
	        case "/index.js" :
	            response.writeHead(200, {"Content-Type": "text/javascript"});
	            response.write(jsFile);
	            break;
	        case "/data.json" :
	            response.writeHead(200, {"Content-Type": "application/json"});
	            response.write(jsonFile);
	            break;
	        case "/" :
	            response.writeHead(200, {"Content-Type": "text/html"});
	            response.write(htmlFile);
	            break;
	        case "/dingdong.mp3" :
	            response.writeHead(200, {"Content-Type": "audio/mpeg"});
	            response.write(mp3File);
	            break;
	        case "/favicon.ico" :
	            response.writeHead(200, {"Content-Type": "text/html"});
	            response.write(htmlFile);
	            break;
	        default :
	    };
		*/
	//res.end();
}).listen(port, function () {
	console.log("Now online on " + port)
});