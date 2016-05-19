// Code for the main app page (locations list).

// This is sample code to demonstrate navigation.
// You need not use it for final app.

function viewLocation(locationName)
{
    // Save the desired location to local storage
    localStorage.setItem(APP_PREFIX + "-selectedLocation", locationName); 
    // And load the view location page.
    location.href = 'viewlocation.html';
}
var LCI = new LocationWeatherCache();
var locations = LCI.retreiveLocations();


for(var i = 0; i < LCI.length(); i ++) {
   
    var span = document.createElement('span');
    span.setAttribute('id','mySpan');
    var t = document.createTextNode("This is a span element.");
    span.appendChild(t)
    document.body.appendChild(span)
    span.innerHTML(locations[i]);
}
