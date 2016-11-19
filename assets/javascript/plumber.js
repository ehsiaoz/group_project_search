//Global Variables========================================

var locationsGeo = [];


//Functions========================================================================================

$(document).ready(function() {

//Buttons===========================
		$('#search-button').on('click', function onclick() {
			$('#search-results').empty();
			locationsGeo = [];
			yelpSearch();
	});

});


//Function to build and append search results returned from yelp search api to the DOM

function resultBuilder(yelpObject) {

	console.log("ResultBuilder: ", yelpObject);

	//Create search result cards
	yelpObject.businesses.forEach(function(biz, i){
		
		var business = {
			name: yelpObject.businesses[i].name,
			rating: yelpObject.businesses[i].rating,
			thumb_url: yelpObject.businesses[i].image_url || 'assets/images/noimage.jpg',
			snippet_text: yelpObject.businesses[i].snippet_text,
			geo_lat: yelpObject.businesses[i].location.coordinate.latitude,
			geo_lng: yelpObject.businesses[i].location.coordinate.longitude,
			address: yelpObject.businesses[i].location.display_address,
			phone: yelpObject.businesses[i].display_phone,
			url: yelpObject.businesses[i].url,
		}
		
		// console.log(biz);
		// console.log(business.name);
		// console.log(business.address);
		// console.log(business.rating);
		// console.log(business.geo_lat);
		// console.log(business.geo_lng);
		// console.log(business.phone);
		// console.log(business.snippet_text);
		// console.log(business.thumb_url);

		var bizName = "<a href=\"" + business.url + "\"><h4 class=\'biz-title\'>" + business.name + "</h4></a>";
		var bizSnippet = "<p>" + business.snippet_text + "</p>";
		var bizPhone = "<p>" + business.phone + "</p>";
		var thumbnail = "<img class = thumbnail src=\"" + business.thumb_url + "\">";

		// console.log("This is bizName: " + bizName);
		// console.log("This is bizPhone: ", bizPhone);
		
		var businessListing = $('<div>').addClass('row result-card').append(
								bizName,
								"<div class='col-xs-3' id='thumbnail'>"+ thumbnail + "</div>" + 
								"<div class='col-xs-9' id='mainText'>"+ bizSnippet + bizPhone +"</div>");

		locationsGeo.push ( {latlng: new google.maps.LatLng(business.geo_lat, business.geo_lng)} );
 			

	//Append Search results to the DOM
	$('#search-results').append(businessListing);
	

	});

	//Create map markers on google map
	var mapDiv = document.getElementById('map'); 
    var mapOptions = {
    	center: new google.maps.LatLng (41.9652791, -87.6756278),	
        zoom: 12,
      	mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(mapDiv, mapOptions);
     //create empty LatLngBounds object
	var bounds = new google.maps.LatLngBounds();
	var infowindow = new google.maps.InfoWindow();  

    for (var i=0; i<locationsGeo.length; i++) {
    	var marker = new google.maps.Marker({position: locationsGeo[i].latlng, map:map});

	  //extend the bounds to include each marker's position
	  bounds.extend(marker.position);

	  google.maps.event.addListener(marker, 'click', (function(marker, i) {
	    return function() {
	      infowindow.setContent(locationsGeo[i][0]);
	      infowindow.open(map, marker);
	    }
	  })(marker, i));
	}

	//now fit the map to the newly inclusive bounds
	map.fitBounds(bounds);


	        
	
}


//Function to trigger a GET Request to Yelp Search API using zipcode entered from user===========
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
		'jsonpCallback' : 'cb'
		
		}).done(function(data) {

			console.log("this is data inside request: ", data);
				resultBuilder(data);
	});

};


function initMap() {
        var mapDiv = document.getElementById('map'); 
        var mapOptions = {
        	center: new google.maps.LatLng (40.1747708, -101.0129668),	
	        zoom: 5,
          	mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(mapDiv, mapOptions);
        
 		// locationsGeo.push ( {latlng: new google.maps.LatLng(41.9464283, -87.7074089)} );
 		// locationsGeo.push ( {latlng: new google.maps.LatLng(41.9539560, -87.713707)});
 		console.log("Array");
 		console.log(locationsGeo);

        
        // map.fitBounds(bounds);
     
}

window.onload = initMap;

//Create a google map with businesses plotted
// function initMap() {
//         var mapDiv = document.getElementById('map'); 
//         var mapOptions = {
//         	center: new google.maps.LatLng (41.9464283, 41.9464283),	
// 	        zoom: 5,
//           	mapTypeId: google.maps.mapTypeId.ROADMAP
//         };
//         var map = new google.maps.Map(mapDiv, mapOptions);
        
//         var locations = [];
//  		locations.push ( {name:"", latlng: new google.maps.LatLng(41.9464283, 41.9464283)} );
//  		locations.push ( {name:"", latlng: new google.maps.LatLng(41.9539560, -87.713707});

//         // var bounds = new google.maps.latlngBounds ();
//         // for (var i=0; i<locations.length; i++) {
//         // 	var marker = new google.maps.Marker({position: location[i].latlng, map:map, title:location[i].name});
//         // 	bounds.extend (locations[i].latlng);

//         // }
//         // map.fitBounds(bounds);
// }

