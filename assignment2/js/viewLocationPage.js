var littleMap, apiDate;
var listLocations = loadLocations();
var index = localStorage.getItem(APP_PREFIX + '-selectedLocation'), sliderStart = 0, currentDate = new Date();
var highAccuracy = false;
document.getElementById('headerBarTitle').innerHTML = listLocations[index].name;
document.getElementById('date').innerHTML = currentDate.simpleDateString();

var output = document.getElementById('outputArea');

onLoad();

function sliderMoved () {
    var change = slider.value - sliderStart;
    sliderStart = slider.value;
    currentDate.setDate(currentDate.getDate() + change);
    document.getElementById('date').innerHTML = currentDate.simpleDateString();
    output.innerHTML = "Loading..."
    setIcon('loading');
};

function changeAccuracy () {
    if (highAccuracy === true) {
        highccuracy = false;
    } else {
        highAccuracy = true
    }
}

function onLoad () {
    apiDate = currentDate.forecastDateString();
    output.innerHTML = "Loading...";
    if(index !== '0') {
        LCI.getWeatherAtIndexForDate(index, apiDate, outputWeather);
    } else {
        
        var labelOff = document.createElement('label');
        labelOff.setAttribute('class', 'mdl-icon-toggle mdl-js-icon-toggle mdl-js-ripple-effect');
        labelOff.setAttribute('for', 'icon-toggle-2');
        labelOff.innerHTML = '<input onchange="changeAccuracy()" type="checkbox" id="icon-toggle-2" class="mdl-icon-toggle__input"> <i class="mdl-icon-toggle__label material-i class ="mdl-icon-toggle__label material-icons"> High <p> Accuracy </p> </i>'
        document.getElementById('toggle').appendChild(labelOff);
    }
    
    
}
function sliderReleased () {
  
    apiDate = currentDate.forecastDateString();
    output.innerHTML = "Loading..."; 
    LCI.getWeatherAtIndexForDate(index, apiDate, outputWeather);
};

function removeItem() {
    if (index !== 'current') {
        LCI.removeLocationAtIndex(index);
    }
        location.href = 'index.html';
};
function outputWeather(response, callbackLocation) {
    
    		outputArea.innerHTML = response.forcasts[callbackLocation].daily.data[0].summary + '</br>';
		   if(response.forcasts[callbackLocation].daily.data[0].humidity*100 !== undefined) {
			outputArea.innerHTML += '<b>Humidity: </b>'+ Math.round(response.forcasts[callbackLocation].daily.data[0].humidity*100) + "%" + '</br>';
		      }
		      if (response.forcasts[callbackLocation].daily.data[0].windSpeed !== undefined) {
			outputArea.innerHTML += '<b>Windspeed: </b>' + response.forcasts[callbackLocation].daily.data[0].windSpeed + 'km/h' + ' </br>';
				}
		      if (response.forcasts[callbackLocation].daily.data[0].temperatureMax !== undefined && response.forcasts[callbackLocation].daily.data[0].temperatureMin !== undefined) {
                outputArea.innerHTML += '<b>Max: </b>'  + response.forcasts[callbackLocation].daily.data[0].temperatureMax + ' °C ' + '<b> Min:</b> ' + response.forcasts[callbackLocation].daily.data[0].temperatureMin + ' °C' + '</br>';
                    }
            if (response.forcasts[callbackLocation].daily.data[0].precipProbability !== undefined) {
                outputArea.innerHTML += '<b>Chance of rain:</b> ' + Math.round(response.forcasts[callbackLocation].daily.data[0].precipProbability*100) + "%" + '</br>';
                    }

		setIcon(response.forcasts[callbackLocation].daily.data[0].icon);

   

}

function setIcon (iconText) {
    
    var image=document.getElementById('iconArea')
    var link = 'images/' + iconText + ".png";
    image.setAttribute('src', link) 
}



function initMap () 
{	
    var geocoder = new google.maps.Geocoder ();
    var mapDiv = document.getElementById('littleMap');
        littleMap = new google.maps.Map(mapDiv, 
                {
                zoom: 13
                });
    var marker = new google.maps.Marker({
                    map: littleMap
                });
	
        if(navigator.geolocation) {
			if(index === '0') {
				navigator.geolocation.watchPosition(function(position) {
						currentLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
						littleMap.setCenter(currentLocation);
                        marker.setPosition(currentLocation);
                        listLocations[0].lat = position.coords.latitude;
                        listLocations[0].lng = position.coords.longitude;
                        saveLocations(listLocations);
                        LCI.getWeatherAtIndexForDate(index, apiDate, outputWeather);

					}, function(error) {
                    alert("browser doesn't support geolocation");},{enableHighAccuracy: highAccuracy, maximumAge:0} );
			} else {
				var center = {
						lat: parseFloat(listLocations[index].lat),
						lng: parseFloat(listLocations[index].lng)
					}
				littleMap.setCenter(center);
				marker.setPosition(center);
            }	   
        }	 
}