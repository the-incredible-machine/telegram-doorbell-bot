// // var myEl = document.getElementsByTagName('a');

// // myEl.addEventListener('click', function() {
// //     alert('Hello world');
// // }, false);
// $(document).ready(function(){
// 	$('h1').click(function(){
// 		alert("click!");
// 	});
// });

// document.getElementsByTag("a").addEventListener('click', ping);

// var ping = function() {
// 	alert('ping!');
// }
document.addEventListener('DOMContentLoaded', function(){
	(function() {
	  var httpRequest;
	  console.log("getID.js is running")
	  var links = document.getElementsByTagName("a");
	  console.log(links);
	  console.log(links.length)
	  var eventCheck = function() {
	  	for(var i = 0; i < links.length; i++){
	  		links[i].addEventListener('click', makeRequest);
	  		console.log(i);
	  	}	
	  }
	  if(links.length > 0){
	  	eventCheck();
	  	console.log("all is ok")
	  }
	  else{
	  	console.log("the fuck is going on?")
	  }
	  

	  

	  function makeRequest() {
	  	console.log("click")
	    httpRequest = new XMLHttpRequest();

	    if (!httpRequest) {
	      alert('Giving up :( Cannot create an XMLHTTP instance');
	      return false;
	    }
	    httpRequest.onreadystatechange = alertContents;
	    httpRequest.open('GET', 'test.html');
	    httpRequest.send();
	  }

	  function alertContents() {
	    if (httpRequest.readyState === XMLHttpRequest.DONE) {
	      if (httpRequest.status === 200) {
	        alert(httpRequest.responseText);
	      } else {
	        alert('There was a problem with the request.');
	      }
	    }
	  }
	})();
})