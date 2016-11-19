//Request token from Yelp==============================================
				
									  

//Functions========================================================================================

//Function to build and append search results returned from yelp search api to the DOM

function resultBuilder(data) {
	console.log("ResultBuilder: ", data);
	data.businesses.forEach(function(biz, i){
		
		var business = {
			name: data.businesses[i].name,
			rating: data.businesses[i].rating,
			thumb_url: data.businesses[i].image_url,
			snippet_text: data.businesses[i].snippet_text,
			geo_lat: data.businesses[i].location.coordinate.latitude,
			geo_lng: data.businesses[i].location.coordinate.longitude,
			address: data.businesses[i].location.display_address,
			phone: data.businesses[i].display_phone,
		}
		
		console.log(biz);
		console.log(business.name);
		console.log(business.address);
		console.log(business.rating);
		console.log(business.geo_lat);
		console.log(business.geo_lng);
		console.log(business.phone);

		//<a id="my-anchor"><h1>..</h1></a>
		var bizName = "<a href=\"http://yelp.com\"><h4 class=\'biz-title\'>" + business.name + "</h4></a>";
		var bizSnippet = "<p>" + business.snippet_text + "</p>";
		var bizPhone = "<p>" + business.phone + "</p>";
		var thumbnail = "<img class = thumbnail src=\"" + business.thumb_url + "\">";

		console.log("This is bizName: " + bizName);
		console.log("This is bizPhone: ", bizPhone);
		
		var businessListing = $('<div>').addClass('row result-card').append(
								bizName,
								"<div class='col-xs-3' id='thumbnail'>"+ thumbnail + "</div>" + 
								"<div class='col-xs-9' id='mainText'>"+ bizSnippet + bizPhone +"</div>");

	
		$('#search-results').append(businessListing);
	});
	
}


//function to trigger a GET Request to Yelp Search API using zipcode entered from user===========
function yelpSearch () {

	var auth = {
		consumerKey : "Uy18Nj8CANiQaNqh6CYurA",
		consumerSecret : "gj8dtRRrThO9O5kgj-XIk90N1w8",
		accessToken : "Lpby6Q-XK6xJ5TvJSbcvZYJiQw_jx9YK",
		accessTokenSecret : "-e1Vqkn-H-JJH3CDUdlAiEP4EYc",
		serviceProvider : {signatureMethod : "HMAC-SHA1"}
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

	//get call to yelp search api
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

//Create a google map with businesses plotted
function initMap() {
        var mapDiv = document.getElementById('map'); 
        var mapOptions = {
        	center: new google.maps.latlng (41.9464283, 41.9464283),	
	        zoom: 5,
          	mapTypeId: google.maps.Map(mapDiv, mapOptions)
        };

        var locations = [];
 		locations.push ( {name:"", latlng: new google.maps.LatLng(41.9464283, 41.9464283)} );
 		locations.push ( {name:"", latlng: new google.maps.LatLng(41.9539560, -87.713707)} );

        var bounds = new google.maps.latlngBounds ();
        for (var i=0; i<locations.length; i++) {
        	var marker = new google.maps.Marker({position: location[i].latlng, map:map, title:location[i].name});
        	bounds.extend (locations[i].latlng);

        }
        map.fitBounds(bounds);
}

//Buttons===========================

$('#search-button').on('click', function() {
	$('#search-results').empty();
	yelpSearch();


});