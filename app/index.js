const _ = require('lodash');
const static = require('node-static');
const util = require('util');
const bot = require('./bot.js');
const data = require('./data.js');

$(document).ready(function () {
	const telegramToken = '425604028:AAH0poVhUMMNPq5_lIcLo0P1it3S2eHf8tM'

	var messagesResponse;
	var naysayers;
	var currentStudioId;

	var doorbellSnd = $("#doorbell-sound")[0];
	var successSnd = $('#success-sound')[0];
	var errorSnd = $('#error-sound')[0];

	var popupTimeoutId;
	var botTimeoutId;

	// Bot setup
	bot.setup(telegramToken, msg => {
		console.log(msg);

		//if someone is coming show it to the visitor
		if (msg.data === "door:yes") {
			showPopup('coming');
			successSnd.play();
			botTimeoutId && clearTimeout(botTimeoutId);
		
		} else if (msg.data === "door:no") {

			//keep track how many people responded negatively
			naysayers.push(msg.message.chat.id);
		
			//If no one can come, show the visitor whats up
			if (naysayers.length >= data.getMemberCount(currentStudioId)) {
				showPopup('not-coming');
				errorSnd.play();
				botTimeoutId && clearTimeout(botTimeoutId);
			}
		}

		//Notify other studio members
		if( msg.data.startsWith("door:") && data.getMemberCount(currentStudioId) > 1 ){
			var message = msg.data.endsWith('yes')? ' is going to open the door' : ' can\'t open the door';
			bot.notifyStudio(currentStudioId, msg.message.chat.first_name + message );
		}

	});
	



	// Display studios
	$('<ul/>', {
		html: _.map(data.getData(), (value, index) => {
			return '<li><a id="' + index + '" ' +
				( data.getMemberCount(index) == 0 ? 'class="no-one"':'' ) +
				'" href="#" onclick="return false;">' +
				value.studioName +
				"</a></li>";
		}).join("")
	}).appendTo('#studios');


	// Click handler for studios
	$('a').click(function (event) {
		currentStudioId = event.target.id;
		$('#popup .studio').html(event.target.innerText);
		naysayers = [];
		
		//When there are people listening for this studio notify them
		if ( data.getMemberCount(currentStudioId ) > 0 ) {
			doorbellSnd.play();
			showPopup('ringing');
			bot.dingDong(currentStudioId);

			botTimeoutId && clearTimeout(botTimeoutId);
			botTimeoutId = setTimeout(() => {
				console.log("time out");
				showPopup('no-response');
				errorSnd.play();
			}, 40000);

		// When nobody is in the office immediately show popup
		} else {
			showPopup('out-of-office');
			errorSnd.play();
		}
	});


	// Popup setup
	$('#popup #close-button button').click(e => {
		$(e.target.parentNode.parentNode).hide();
	});
	
	function showPopup(popupType) {
		//clear existing timeouts which might hide the dialog
		if (popupTimeoutId) {
			clearTimeout(popupTimeoutId);
			popupTimeoutId = null;
		}

		//set the message
		$('#popup .messages').hide();
		$('#popup #' + popupType).show();
		$('#popup').show();

		//set new time out
		popupTimeoutId = setTimeout(
			() => $('#popup').hide(),
			40000
		);
	}
});