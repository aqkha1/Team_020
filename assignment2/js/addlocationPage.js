var infoWindow, lat, lng, name, map, realLocation;
    var markers = [];



function initMap () {
    var geocoder = new google.maps.Geocoder ();
    var mapDiv = document.getElementById('map');
    map = new google.maps.Map(mapDiv, 
                {
                zoom: 13,
                center: {lat: -37.9145, lng: 145.1303}
        
                });
	document.getElementById('btn1').addEventListener('click', function () {         addLocation();
    });                                                                        
    document.getElementById('address').addEventListener('keyup', function () {
     geocodeAddress(geocoder, map);
    });
   
    
}


function geocodeAddress(geocoder) {
        var address = document.getElementById("address").value;

                geocoder.geocode( { 'address': address}, function(results, status) {
                 if(results[0] !== undefined) {
                     var formattedAddress = results[0].formatted_address.toLocaleLowerCase();
                     var enteredAddress = document.getElementById("address").value.toLowerCase();
                     var rgxp = new RegExp(enteredAddress, "y")

                     if(formattedAddress.match(rgxp))  {

                         document.getElementById('address').style.backgroundColor = 'white'; 
                         map.setCenter(results[0].geometry.location); 
                         var marker = new google.maps.Marker({
                            map: map,
                            position: results[0].geometry.location
                                    });
                         markers.push(marker);
                        var infowindow = new google.maps.InfoWindow({
                                        content: results[0].formatted_address

                         });
                         infowindow.open(map, marker);
                         name = JSON.stringify(results[0].formatted_address); 

                         lat = JSON.stringify(results[0].geometry.location.lat());
                         lng = JSON.stringify(results[0].geometry.location.lng());    
                         realLocation = true;     
                     } else {
                         document.getElementById('address').style.backgroundColor = '#FF6666';
                         realLocation = false;
                         for (var i = 0; i < markers.length; i ++) {
                             markers[i].setMap(null)
                         }
                         markers = [];
                         
                     }
                 } else {
                     document.getElementById('address').style.backgroundColor = '#FF6666';
                     realLocation = false;
                     for (var i = 0; i < markers.length; i ++) {
                             markers[i].setMap(null)
                         }
                     markers = [];
                 }
                 
                 
                });
};

function addLocation () {
    if (realLocation === true) {
        if (document.getElementById('nickname').value !== "") {
            name = document.getElementById('nickname').value;
        };
        LCI.addLocation(lat, lng, name);
        location.href = 'index.html';
    } else {
        alert('Please enter a valid address')
    }
    
}
