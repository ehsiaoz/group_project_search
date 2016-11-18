//Request token from Yelp==============================================
				
									  

//Functions========================================================================================

//Function to build and append search results to the DOM

function resultBuilder(data) {
	console.log("ResultBuilder: ", data);
	data.businesses.forEach(function(biz, i){
		console.log("biz num: " + i, biz);
	});
	
}

//Create a google map with businesses plotted
function initMap() {
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 12,
          center: {lat: 41.9464283, lng: -87.7074089}
        });
        var marker = new google.maps.Marker({
          position: {lat: 41.9464283, lng: -87.7074089},
          map: map
        });
        var marker2 = new google.maps.Marker({
          position: {lat: 41.953956, lng: -87.713707},
          map: map
        });
      }

//Trigger a GET Request to Yelp Search API using zipcode entered from user===========
function yelpSearch () {

	var auth = {
	//
	// Update with your auth tokens.
	//
	consumerKey : "Uy18Nj8CANiQaNqh6CYurA",
	consumerSecret : "gj8dtRRrThO9O5kgj-XIk90N1w8",
	accessToken : "Lpby6Q-XK6xJ5TvJSbcvZYJiQw_jx9YK",
	// This example is a proof of concept, for how to use the Yelp v2 API with javascript.
	// You wouldn't actually want to expose your access token secret like this in a real application.
	accessTokenSecret : "-e1Vqkn-H-JJH3CDUdlAiEP4EYc",
	serviceProvider : {
	  signatureMethod : "HMAC-SHA1"
	}
	};

	var terms = 'plumber';
	var near = $('#location-input').val().trim();

	var accessor = {
	consumerSecret : auth.consumerSecret,
	tokenSecret : auth.accessTokenSecret
	};

	parameters = [];
	parameters.push(['term', terms]);
	parameters.push(['location', near]);
	parameters.push(['callback', 'cb']);
	parameters.push(['oauth_consumer_key', auth.consumerKey]);
	parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
	parameters.push(['oauth_token', auth.accessToken]);
	parameters.push(['oauth_signature_method', 'HMAC-SHA1']);


	var message = {
	'action' : 'http://api.yelp.com/v2/search',
	'method' : 'GET',
	'parameters' : parameters
	};

	OAuth.setTimestampAndNonce(message);
	OAuth.SignatureMethod.sign(message, accessor);

	var parameterMap = OAuth.getParameterMap(message.parameters);
	parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature)
	console.log(parameterMap);

	$.ajax({
	'url' : message.action,
	'data' : parameterMap,
	'cache' : true,
	'dataType' : 'jsonp',
	'jsonpCallback' : 'cb',
	'success' : function(data, textStats, XMLHttpRequest) {
	  resultBuilder(data);

	}
	});

}


//Buttons===========================

$('#search-button').on('click', yelpSearch);