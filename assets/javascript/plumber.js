//Global Variables========================================

var locationsGeo = [];
var searchLocation = "";


//Functions========================================================================================

$(document).ready(function() {

	//Buttons===========================

	//Search Button on page
	$('#page-search-button').on('click', function onclick() {

		if ($('#modal-find-input').val().trim() === "" || $('#page-location-input').val().trim() === "") {

			$('#form-error-msg').html("* Required Field");
		}

		else {

			$('#search-results').empty();
			$('#search-area').empty();
			locationsGeo = [];

			var searchTerm = $('#modal-find-input').val().trim();
			searchLocation = $('#page-location-input').val().trim();

			console.log("You are searching for " + searchTerm + " near " + searchLocation);
			yelpSearch(searchTerm, searchLocation);

		};

		
	});

	//Search Button in modal
	$('#search-button-modal').on('click', function onclick() {
		$('#search-results').empty();
		locationsGeo = [];
		modal.style.display = "none";

		var searchTerm = $('#modal-find-input').val().trim();
		searchLocation = $('#modal-near-input').val().trim(); 
		var searchLatitude = searchLongitude = '';

		// if(searchTerm == ''){
		// 	console.log("No search term entered..");
		// 	return;
		// }

		// if ($('#').){//nearby checkbox is checked...
		// 	var geoSuccess = function(position) {
		// 		searchLatitude = position.coords.latitude;
		// 		searchLongitude = position.coords.longitude;
		// 	};
		// 	navigator.geolocation.getCurrentPosition(geoSuccess, geoFailure);
		// 	console.log("You are searching for " + searchTerm + " near " + searchLatitude + "," + searchLongitude);
		// 	yelpSearch(searchTerm, searchLocation);
		// }
		// else{
		// 	if(searchLocation == ''){
		// 		console.log("error : no location entered...");
		// 		// error handling code here
		// 		return;
		// 	}
			console.log("You are searching for " + searchTerm + " near " + searchLocation);
			yelpSearch(searchTerm, searchLocation);


		// }

});



//Forms==============================

//Autoselection value in location input field on click
 $('#page-location-input').click( function highlight() {
    $(this).select();
  });

$('#modal-find-input').click( function highlight() {
    $(this).select();
  });

$('#modal-near-input').click( function highlight() {
    $(this).select();
  });

//Modal================================
// Get the modal
var modal = document.getElementById('searchModal');

// Get the button that opens the modal
var btn = document.getElementById("homeModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}








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
		var bizSnippet = "<p>\"" + business.snippet_text + "\"</p>";
		var bizPhone = "<p>(tel) " + business.phone + "</p>";
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
function yelpSearch (searchTerm, searchLocation) {

	var auth = {
		consumerKey : "Uy18Nj8CANiQaNqh6CYurA",
		consumerSecret : "gj8dtRRrThO9O5kgj-XIk90N1w8",
		accessToken : "Lpby6Q-XK6xJ5TvJSbcvZYJiQw_jx9YK",
		accessTokenSecret : "-e1Vqkn-H-JJH3CDUdlAiEP4EYc",
		serviceProvider : {signatureMethod : "HMAC-SHA1"}
		};

	// var terms = $('#modal-find-input').val().trim();
	// console.log("This is term: " + terms);
	// var near = $('#page-location-input').val().trim();

	var accessor = {
			consumerSecret : auth.consumerSecret,
			tokenSecret : auth.accessTokenSecret
		};

	parameters = [];
	parameters.push(['term', searchTerm]);
	parameters.push(['location', searchLocation]);
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
		})

		//If the request is successful
		.done(function(data) {

			console.log("this is data inside request: ", data);
			resultBuilder(data);
		})

		//if the request fails append error message with error code.
		.fail(function(data){

			console.log("oops : ", data);
			var errMsg = $('<div>').addClass('row').append(
				
				"<div class='col-xs-12' id='errorMsg'>" + 
				"<span id=errorCode>Error message: " + 
				data.status + 
				"</span>." + "<br><br>" + 
				"Sorry, but we didn't understand the location you entered. We accept locations in the following forms: "+ 
				"<br><br>" + 
				" - 1200 N. Michigan Ave, Chicago, IL" + "<br>" + 
				" - Chicago, IL" + "<br>" + 
				" - Chicago, IL 60640" + "<br>" + 
				" - 60640" + "<br><br>" + 
				"Also, it's possible we don't have a listing for \"" + searchLocation + "\". In that case, you should try adding a zip, or try a larger nearby city." +"</div>"); 

			//Append Search results to the DOM
			$('#search-results').append(errMsg);

		})

		//regardless or whether call was successful or failed..console.log response.
		.always(function(data){
			console.log(data);

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

