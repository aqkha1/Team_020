//loads the locations from storage
var listLocations = loadLocations();

//For however many locations are saved, create that many list elements
for (var i = 1; i < LCI.length(); i++ ) {
    var list = document.createElement('list');
    list.setAttribute('class', "mdl-list__item mdl-list__item--two-line");
    list.setAttribute('id', "list" + i);
    document.getElementById('locationList').appendChild(list);
}

//When something inside the locationLit is clicked it takes the id of the element that was clicked (list0, span1, div0 etc) and takes the last character which, because of how they were named, is the index of that location.It then save that index to local storage and directs the user to the view location page.
document.getElementById('locationList').onclick = function(e) {
    if (parseFloat(e.target.id.slice(-1)) !== undefined) {
             localStorage.setItem(APP_PREFIX + "-selectedLocation", parseFloat(e.target.id.slice(-1)))
             location.href ='viewlocation.html'   
    }

}

//Call the weather for each location in the list for the current date.
for (var index = 1; index < LCI.length(); index ++) {
			var currentDate = new Date;
			var apiDate = currentDate.forecastDateString();
			LCI.getWeatherAtIndexForDate(index, apiDate, addWeather);
}

//Create the inner elements of each location list and retrieve the weather summary and icon properties of the forcasts object and set them as the text fields. Retieve the corrosponding image and add it to the page. If the saved name is loger than 20 characters, shorten it and add '...' to signify that it has been shortened as the design can only cope with two lines of text.
function addWeather (response, callbackLocation) {
	
    var index = indexForLocation(response.lat, response.lng);
	if (index !==-1 && index !== 0) {
        var name;
        if (response.name.length > 17) {
            name = response.name.substr(0,20) + "...";
        } else {
            name = response.name
        }
        
        document.getElementById('list' + index).innerHTML += "<span class='mdl-list__item-primary-content'/> <img src=images/" + response.forcasts[callbackLocation].daily.data[0].icon + ".png class='mdl-list__item-icon list-avatar'/> <span></span> <span id='title" + index + "' >" + name + "</span> <span id=weatherSummary" + index + " class='mdl-list__item-sub-title'>" + response.forcasts[callbackLocation].daily.data[0].summary + "</span> </span>";

	} 
}
