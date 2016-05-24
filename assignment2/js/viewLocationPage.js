//setting al the initial public variables
var littleMap, apiDate;
var output = document.getElementById('outputArea');
//Retieve the index that was saved hen the location was tapped on the main page, set all the base 0 values.
var index = localStorage.getItem(APP_PREFIX + '-selectedLocation')
    , sliderStart = 0
    , currentDate = new Date()
    , listLocations = loadLocations()
    , highAccuracy = false;
//set the heade to the saved name for the respective location
document.getElementById('headerBarTitle').innerHTML = listLocations[index].name;
//Dsplay the current time
document.getElementById('date').innerHTML = currentDate.simpleDateString();


//calls the function which 
onLoad();
//When the slider's position is changed this function takes the change from the initial to final slider positions and adds that to th current date in order to change it and then change the displayed current. It also changed th eicon and output area to their loading screens.
function sliderMoved() {
    var change = slider.value - sliderStart;
    sliderStart = slider.value;
    currentDate.setDate(currentDate.getDate() + change);
    document.getElementById('date').innerHTML = currentDate.simpleDateString();
    output.innerHTML = "Loading..."
    setIcon('loading');
};

//When the high accuracy checkbox is changed it reverts the high accuracy setting from on to off and off to on.
function changeAccuracy() {
    if (highAccuracy === true) {
        highccuracy = false;
    } else {
        highAccuracy = true;
    }
}

//Upon the page loading, if the selected location isn't the current location call the weather for the current date. Otherwise, change the text of the button from 'RemoveLocation' to 'Back' and add the High accuracy option to the page.
function onLoad() {
    apiDate = currentDate.forecastDateString();
    output.innerHTML = "Loading...";
    if (index !== '0') {
        LCI.getWeatherAtIndexForDate(index, apiDate, outputWeather);
    } else {
        document.getElementById('btn2').innerHTML = 'Back'
        var labelOff = document.createElement('label');
        labelOff.setAttribute('class', 'mdl-icon-toggle mdl-js-icon-toggle mdl-js-ripple-effect');
        labelOff.setAttribute('for', 'icon-toggle-2');
        labelOff.innerHTML = '<input onchange="changeAccuracy()" type="checkbox" id="icon-toggle-2" class="mdl-icon-toggle__input"> <i class="mdl-icon-toggle__label material-i class ="mdl-icon-toggle__label material-icons"> High Accuracy </i>'
        document.getElementById('toggle').appendChild(labelOff);
    }


}

//When the slider is released call the weather for that date, it s here instead of sliderMOved() because it takes a lot of time when the user may not want to know.
function sliderReleased() {
    apiDate = currentDate.forecastDateString();
    LCI.getWeatherAtIndexForDate(index, apiDate, outputWeather);
};

//When the remove location button is pressed, calls the removeLocationAtIndex from the cache if the selected location is not the current location. If so, it only directs them back to the main page.
function removeItem() {
    if (index !== 'current') {
        LCI.removeLocationAtIndex(index);
    }
    location.href = 'index.html';
};

//Takes the data from the forcasts property and outputs itthe the outputArea, for each entry the function first check that the responce has the necessary data before it outputs it. This prevents the outputting showin NaN for some data points, mainly humidity. It then finds the respective image and adds that to the image element. This function also rounds the humidity and the rain probbility to integers as it has a hibit of diaplaying '59.999999999999999'. All units are SI.
function outputWeather(response, callbackLocation) {

    outputArea.innerHTML = response.forcasts[callbackLocation].daily.data[0].summary + '</br>';
    if (response.forcasts[callbackLocation].daily.data[0].humidity * 100 !== undefined) {
        outputArea.innerHTML += '<b>Humidity: </b>' + Math.round(response.forcasts[callbackLocation].daily.data[0].humidity * 100) + "%" + '</br>';
    }
    if (response.forcasts[callbackLocation].daily.data[0].windSpeed !== undefined) {
        outputArea.innerHTML += '<b>Windspeed: </b>' + response.forcasts[callbackLocation].daily.data[0].windSpeed + 'km/h' + ' </br>';
    }
    if (response.forcasts[callbackLocation].daily.data[0].temperatureMax !== undefined && response.forcasts[callbackLocation].daily.data[0].temperatureMin !== undefined) {
        outputArea.innerHTML += '<b>Max: </b>' + response.forcasts[callbackLocation].daily.data[0].temperatureMax + ' °C ' + '<b> Min:</b> ' + response.forcasts[callbackLocation].daily.data[0].temperatureMin + ' °C' + '</br>';
    }
    if (response.forcasts[callbackLocation].daily.data[0].precipProbability !== undefined) {
        outputArea.innerHTML += '<b>Chance of rain:</b> ' + Math.round(response.forcasts[callbackLocation].daily.data[0].precipProbability * 100) + "%" + '</br>';
    }
    var image = document.getElementById('iconArea')
    var link = 'images/' + response.forcasts[callbackLocation].daily.data[0].icon + ".png";
    image.setAttribute('src', link);
}


//Sets up the map and if the selected location is the current location the function uses the google api to find the user's current location, centres the map and marker on it and adds it to the current location in the list of locations array. It then saves the array and calls the weather to be displayed. As the function is watchPosition, it reguarly update's the user's location and the weather. Depending on the high accuracy variable the User's location becomes more or less specific. High accuracy alows the user to be located at different points in a single room. However if the location is any other the function simply sets the map and marker to the saved lat and lng.
function initMap() {
    var geocoder = new google.maps.Geocoder();
    var mapDiv = document.getElementById('littleMap');
    littleMap = new google.maps.Map(mapDiv, {
        zoom: 13
    });
    var marker = new google.maps.Marker({
        map: littleMap
    });

    if (navigator.geolocation) {
        if (index === '0') {
            navigator.geolocation.watchPosition(function (position) {
                currentLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                littleMap.setCenter(currentLocation);
                marker.setPosition(currentLocation);
                listLocations[0].lat = position.coords.latitude;
                listLocations[0].lng = position.coords.longitude;
                saveLocations(listLocations);
                LCI.getWeatherAtIndexForDate(index, apiDate, outputWeather);

            }, function (error) {
                alert("browser doesn't support geolocation");
            }, {
                enableHighAccuracy: highAccuracy 
            });
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