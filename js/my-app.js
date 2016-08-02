// Initialize your app
var myApp = new Framework7({
	
	 // Default title for modals
    modalTitle: 'My App',
    material:true,
    // If it is webapp, we can enable hash navigation:
    pushState: true,
 
    // Hide and show indicator during ajax requests
    onAjaxStart: function (xhr) {
        myApp.showIndicator();
    },
    onAjaxComplete: function (xhr) {
        myApp.hideIndicator();
    }
});

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
domCache: true,
});



// Callbacks to run specific code for specific pages, for example for About page:
myApp.onPageInit('nearbyplaces', function (page) {
	checkonline();
	function checkonline(){
	 $$.post("http://213.133.97.233/cpdistrict/mobileapi/checkonline.php",
    {
        name: "Donald Duck",
        city: "Duckburg"
    },
    function(data, status){
        alert("Data: " + data + "\nStatus: " + status);
    });
	}
	
  var lat;
  var lon;	
  var request;
  var map;
  var infowindow;
  var mycoordinate;
  var menu;
  var placeLoc;
  var elems = [];
	 var place=page.query.place;
	  x(place);
	///////////////////////////////////////// 
	 function x(value){
    if(document.getElementById('demo')){
   console.log("hey");
   
	elems=[];
    } else {
    //do nothing
    }
	
   initialize();
   
   return false;
   }

  //////////////////////////////////////////////////////
  function initialize(){
    
    console.log(place);    
   getLocation();
   function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
        console.log("Geolocation is not supported by this device.");
    }
}

function showPosition(position) {
        lat=position.coords.latitude;
        lon=position.coords.longitude;
		
	   //////////////////////////////////
         
       var center=new google.maps.LatLng(lat,lon);   
      
	   map=new google.maps.Map(document.getElementById('map'),{
	        center:center,
			zoom:13,
			
	   });
	    request={
	     location:center,
		 radius:8047,
		 types:[place],
		
	   };
	   infowindow=new google.maps.InfoWindow();
	   var service=new google.maps.places.PlacesService(map);
	   service.nearbySearch(request,callback)
	   
	  
  }
   function callback(results,status){
      if(status==google.maps.places.PlacesServiceStatus.OK){
	   for(var i=0;i<results.length;i++){
	   createMarker(results[i]);
	    //////////////////////////////////////////////////////////
		displaydistance(results[i]);
		console.log(results[i]);
		/////////////////////////////////////////////////////////
	  //console.log(results[i].website);
	   //displaynearest(results[i]);
	   }
	   
	  }
	    
   }
   //////////////////////////////////////////////////////////////
   function createMarker(place){
    placeLoc=place.geometry.location;
	
   var marker=new google.maps.Marker({
       map:map,
	   position:place.geometry.location
   });
   
   google.maps.event.addListener(marker,'click',function(){
       infowindow.setContent(place.name);
	   infowindow.open(map,this);
   });
   }
  
  function displaydistance(loc){///////already baked
  
    var startLatRads = degreesToRadians(loc.geometry.location.lat());
	var startLongRads = degreesToRadians(loc.geometry.location.lng());
    var destLatRads = degreesToRadians(lat);
	var destLongRads = degreesToRadians(lon);
	var Radius = 6371; // radius of the Earth in km
	var distance = Math.acos(Math.sin(startLatRads) * Math.sin(destLatRads) +
					Math.cos(startLatRads) * Math.cos(destLatRads) *
					Math.cos(startLongRads - destLongRads)) * Radius;
	 var todecimal=distance.toString();
      
	addlist(todecimal.substring(0, 3)	+"km to "+" "+loc.name+"-"+loc.vicinity);
   }
function degreesToRadians(degrees) { ///////already baked
	radians = (degrees * Math.PI)/180;
	return radians;
}




  
   }
   ////////////////////////////////////////////////////////////////////
    function addlist(item){
   //var list = document.getElementById('demo');
   //var firstname = item;
   //var entry = document.createElement('li');
   //entry.appendChild(document.createTextNode(firstname));
   //list.appendChild(entry);
   
   elems.push(item);
   elems.sort();
   listelementinarray();
  
   }
   
    function listelementinarray(){///////already baked
	      var text, fLen, i;
          fLen = elems.length;
          text = "<ul>";
              for (i = 0; i < fLen; i++) {
                text+=" <li class='item-content'> <a href='direction.html?place=" + elems[i] + "' class='item-link item-content link'><div class='item-inner'><div class='item-text'>" + elems[i] + "</div><div class='item-after'><i class='material-icons'>directions</i></div></div></a></li>";
			   
			 }
		   text += "</ul>";
           document.getElementById("demo").innerHTML = text;
	}
	function rem() {               ///////already baked
         var list = document.getElementById('demo'),
	
        items = Array.prototype.slice.call(list.childNodes),
        item;
        while (item = items.pop()) {

            list.removeChild(item);
        
        }
   } 
////////////////////////////////////////////////////////
var ptrContent = $$('.pull-to-refresh-content');

ptrContent.on('refresh', function (e) {
    // Emulate 2s loading
    setTimeout(function () {
		rem();
		 initialize();
		 
        myApp.pullToRefreshDone();
         return false;		
     }, 2000);
	 
	 
}); 
  //////////////////////////////////////////
  
   
});



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////direction page is below/////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




myApp.onPageInit('direction', function (page) {
    var place=page.query.place;
	
	var destination = place.substr(place.indexOf("-") + 1);
	
	var latlng;
    var directionDisplay;
    var directionsService = new google.maps.DirectionsService();
	initialize();
	setTimeout(calcRoute,1000);
  function initialize() 
  {
  
       getLocation();
       function getLocation()
	   {
             if (navigator.geolocation) 
			 {
                navigator.geolocation.getCurrentPosition(showPosition);
                 
				 } else
					 { 
                 console.log("Geolocation is not supported by this browser.");
            }
       }

        function showPosition(position) {
        lat=position.coords.latitude;
        lon=position.coords.longitude;
		latlng = new google.maps.LatLng(lat,lon);
	 
        directionsDisplay = new google.maps.DirectionsRenderer();
        var myOptions = {
           zoom: 14,
           center: latlng,
           mapTypeId: google.maps.MapTypeId.ROADMAP,
           mapTypeControl: false
          };
        var map = new google.maps.Map(document.getElementById("map_canvas"),myOptions);
        directionsDisplay.setMap(map);
        directionsDisplay.setPanel(document.getElementById("directionsPanel"));
        var marker = new google.maps.Marker({
        position: latlng, 
        map: map, 
        title:"My location"
       }); 
     }
  }

	function calcRoute() {
		  var value;
		  var value_1;
		  var startplace;
		  var geocoder = new google.maps.Geocoder();
          var address = destination;//"HFC Bank Dansoman Roundabout ATM 3rd Road, Accra";

          geocoder.geocode( { 'address': address}, function(results, status) {

          if (status == google.maps.GeocoderStatus.OK) {
             var latitude = results[0].geometry.location.lat();
             var longitude = results[0].geometry.location.lng();
             value=latitude+","+longitude;
			 
			 
			 
			    var geocoder = geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    //if (results[1]) {
                       // alert("Location: " + results[1].formatted_address);
				value_1=results[1].formatted_address;
						
                   // }
                }
			
			
    var start =value_1//"Accra " 
    var end = value;//"5.563053099999999,-0.27334619999999177";
    var request = {
      origin:start,
      destination:end,
      travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
    directionsService.route(request, function(response, status) {
      if (status == 'ZERO_RESULTS') {
  alert('No route could be found between the origin and destination.');
} else if (status == 'UNKNOWN_ERROR') {
  alert('A directions request could not be processed due to a server error. The request may succeed if you try again.');
} else if (status == 'REQUEST_DENIED') {
  alert('This webpage is not allowed to use the directions service.');
} else if (status == 'OVER_QUERY_LIMIT') {
  alert('The webpage has gone over the requests limit in too short a period of time.');
} else if (status == 'NOT_FOUND') {
  alert('At least one of the origin, destination, or waypoints could not be geocoded.');
} else if (status == 'INVALID_REQUEST') {
  alert('The DirectionsRequest provided was invalid.');         
} else if (status == google.maps.DirectionsStatus.OK) {
  directionsDisplay.setDirections(response);
} else {
  if (status == 'ZERO_RESULTS') {
    alert("Could not calculate a route to or from one of your destinations.");
  } else {
    alert("There was an unknown error in your request. Requeststatus: "+status);
  }
}
	  
       });
     });
    }
  }); 
 }
});//end of direction page
