$( document ).ready(function() {

	$('#popup #close-button button').click(e => {
		$(e.target.parentNode.parentNode).hide();
	});

	$.getJSON("data.json", function(result){ 																			// Open JSON Data file
		
		var doorbellSnd = $("#doorbell-sound")[0];
		var successSnd = $('#success-sound')[0];
		var errorSnd = $('#error-sound')[0];

		var items = [];																									// Make an empty array
        $.each(result, function(i, studio){
             items.push( "<li><a id='"+i+"' href='#' onclick='return false;'>" + studio.studioName + "</a></li>" );		// Get studio names from JSON file, turn them into links within list itmes and push in arry
        });
        $( "<ul/>", {
		    html: items.join( "" )																						// Put the Li's in a list in the HTML
		}).appendTo( "#studios" );
		
		
		$('a').click(function(event){																					// Add event listener to links
			var clickID = event.target.id;	
			console.log(clickID);
			console.log(event)																			// Store link ID of clicked link
			doorbellSnd.play();	
			
			$('#popup .studio').html(event.target.innerText);
			showPopup('ringing');

			// Play dingdong sound
			$.ajax({																									// Send AJAX GET request to server to trigger Telegram Bot to send a message
				type: "GET",	
				url: "dingdong",
				timeout:30000,
				data: {id: clickID},
				success:function(data){
					console.log(data);
					showPopup(data);
					if( data === "coming"){
						successSnd.play();
					} else if( data === "not-coming"){
						errorSnd.play();
					}
				},
				error: function(err){
					console.log("error", err);
					showPopup('no-response');
					errorSnd.play();
				}
				
			})
		});
	});

	var timeoutId;
	function showPopup( popupType ) {
		//clear existing timeouts which might hide the dialog
		if(timeoutId ){
			clearTimeout(timeoutId);
			timeoutId = null;
		}

		//set the message
		$('#popup .messages').hide();
		$('#popup #' + popupType).show();
		$('#popup').show();

		//set new time out
		timeoutId = setTimeout(
			() => $('#popup').hide(),
			40000
		);
	
	}

});

