$( document ).ready(function() {

	$.getJSON("data.json", function(result){ 																			// Open JSON Data file
		
		var audio = $("#dingdong")[0];																					// Point to Audio file
		var items = [];																									// Make an empty array
        $.each(result, function(i, studio){
             items.push( "<li><a id='"+i+"' href='#' onclick='return false;'>" + studio.studioName + "</a></li>" );		// Get studio names from JSON file, turn them into links within list itmes and push in arry
        });
        $( "<ul/>", {
		    html: items.join( "" )																						// Put the Li's in a list in the HTML
		}).appendTo( "#studios" );
		
		
		$('a').click(function(event){																					// Add event listener to links
			var clickID = event.target.id;																				// Store link ID of clicked link
			audio.play();																								// Play dingdong sound
			$.ajax({																									// Send AJAX GET request to server to trigger Telegram Bot to send a message
				type: "GET",	
				url: "dingdong",
				data: {id: clickID},
				success:function(data){
					console.log(data);
				},
				error: function(err){
					console.log("error", err);
				}
			})
		});
	});

	function waitForMsg(){
        
        $.ajax({
            type: "GET",
            url: "messages",

            async: true, /* If set to non-async, browser shows page as "Loading.."*/
            cache: false,
            timeout:50000, /* Timeout in ms */

            success: function(data){
								console.log('response:',data);
                setTimeout(
                    waitForMsg,
                    100
                );
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){
                console.log("error", textStatus + " (" + errorThrown + ")");
                setTimeout(
                    waitForMsg,
                    100);
            }
        });
	}
	waitForMsg();
});

