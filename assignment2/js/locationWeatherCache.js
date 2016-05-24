
// Returns a date in the format "YYYY-MM-DD".
Date.prototype.simpleDateString = function() {
    function pad(value)
    {
        return ("0" + value).slice(-2);
    }

    var dateString = this.getFullYear() + "-" + 
            pad(this.getMonth() + 1, 2) + '-' + 
            pad(this.getDate(), 2);
    
    return dateString;
}

// Date format required by forecast.io API.
// We always represent a date with a time of midday,
// so our choice of day isn't susceptible to time zone errors.
Date.prototype.forecastDateString = function() {
    return this.simpleDateString() + "T12:00:00";
}


// Code for LocationWeatherCache class and other shared code.

// Prefix to use for Local Storage.  You may change this.
var APP_PREFIX = "1003_SUCKS";
//Create a new instance of the cache.
var LCI = new LocationWeatherCache();

function LocationWeatherCache()
{
    // Private attributes:
    
    // If there are no locations saved in storage, save the skeleton of the array and add the base of the current location to location[0].  In turn save that array to storage.
    if (localStorage.getItem(APP_PREFIX) === null) {
         var locations = [{lat: null,
                    lng: null,
                    name: 'Current Location',
                    forcasts: new Object()}]
         saveLocations(locations)
    }
   
    var callbacks = new Object();
    
    //Retrieves the locations from storage
    var locations = loadLocations();
    // Public methods:
    
    // Returns the number of locations stored in the cache.
    //
    this.length = function() {
        return locations.length;
    };
    
    // Returns the location object for a given index.
    // Indexes begin at zero.
    //
    this.locationAtIndex = function(index) {
        return location[index];
    };

    // Given a latitude, longitude and nickname, this method saves a 
    // new location into the cache.  It will have an empty 'forecasts'
    // property.  Returns the index of the added location.
    //
    this.addLocation = function(latitude, longitude, nickname)
    {    
        var newLocation = {
            lat: latitude,
            lng: longitude,
            name: nickname,
            forcasts: new Object ()
        }
        locations.push(newLocation)
        saveLocations(locations)
    }

    // Removes the saved location at the given index.
    // 
    this.removeLocationAtIndex = function(index)
    {
        locations.splice(index, 1);
        saveLocations(locations);
    }

    // This method is used by JSON.stringify() to serialise this class.
    // Note that the callbacks attribute is only meaningful while there 
    // are active web service requests and so doesn't need to be saved.
    //
    this.toJSON = function() {
        var newLocation = {
            lat: latitude,
            lng: longitude,
            name: nickname,
            forcasts: new Object ()
        };
        return newLocation;
    };

    // Given a public-data-only version of the class (such as from
    // local storage), this method will initialise the current
    // instance to match that version.
    //
    this.initialiseFromPDO = function(locationWeatherCachePDO) {
        return parse(localStorage.getItem(locationWeatherCachePDO))
    };

    // Request weather for the location at the given index for the
    // specified date.  'date' should be JavaScript Date instance.
    //
    // This method doesn't return anything, but rather calls the 
    // callback function when the weather object is available. This
    // might be immediately or after some indeterminate amount of time.
    // The callback function should have two parameters.  The first
    // will be the index of the location and the second will be the 
    // weather object for that location.
    // 
    this.getWeatherAtIndexForDate = function(index, date, callback) {
        locations = loadLocations();
        var name = locations[index].lat + "," +  locations[index].lng + "," + date;
        
        var url = "https://api.forecast.io/forecast/20f60a445b8ef7c4bc15c13164edf445/" + name  + "/?exclude=[flags,alerts,minutely,hourly,offset,currently]&units=si&callback=LCI.weatherResponse";
        
        callbacks[name] = callback;
        
        var script = document.createElement('script');
        script.src = url;
        document.body.appendChild(script);
    
    };
    
    // This is a callback function passed to forecast.io API calls.
    // This will be called via JSONP when the API call is loaded.
    //
    // This should invoke the recorded callback function for that
    // weather request.
    //
    this.weatherResponse = function(response) {
        
        var desiredDate = new Date(response.daily.data[0].time*1000)
        desiredDate = desiredDate.forecastDateString();

        var name = response.latitude + ',' + response.longitude + ',' + desiredDate;
        var callbackFunction = callbacks[name];
        
        for (var i = 0; i < locations.length; i ++) {
            if (locations[i].lat == response.latitude && locations[i].lng == response.longitude) {
                locations[i].forcasts[name] = response;
                callbackFunction(locations[i], name); 
                }
            }
        saveLocations(locations);
        }
    };

    // Private methods:
    
    // Given a latitude and longitude, this method looks through all
    // the stored locations and returns the index of the location with
    // matching latitude and longitude if one exists, otherwise it
    // returns -1.
    //
    function indexForLocation(latitude, longitude)
    {
        var locations = loadLocations();
        for (var i = 0; i < locations.length; i ++) {
            if (latitude === locations[i].lat && longitude === locations[i].lng) {
                return i;
            }
        }
        return -1;
    }


// Restore the singleton locationWeatherCache from Local Storage.
//
function loadLocations()
{
    return JSON.parse(localStorage.getItem(APP_PREFIX))
}

// Save the singleton locationWeatherCache to Local Storage.
//
function saveLocations(LOCS)
{
    localStorage.setItem(APP_PREFIX, JSON.stringify(LOCS));
}

