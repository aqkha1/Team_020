var listLocations = loadLocations();


for (var i = 1; i < LCI.length(); i++ ) {
    var list = document.createElement('list');
    list.setAttribute('class', "mdl-list__item mdl-list__item--two-line");
    list.setAttribute('id', "list" + i);
    document.getElementById('locationList').appendChild(list);
}

document.getElementById('locationList').onclick = function(e) {
    if (parseFloat(e.target.id.slice(-1)) !== undefined) {
             localStorage.setItem(APP_PREFIX + "-selectedLocation", parseFloat(e.target.id.slice(-1)))
             location.href ='viewlocation.html'   
    }

}

for (var index = 1; index < LCI.length(); index ++) {
			var currentDate = new Date;
			var apiDate = currentDate.forecastDateString();
			LCI.getWeatherAtIndexForDate(index, apiDate, addWeather);
}

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
