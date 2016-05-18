// Code for the View Location page.

// This is sample code to demonstrate navigation.
// You need not use it for final app.

var locationIndex = localStorage.getItem(APP_PREFIX + "-selectedLocation"); 
if (locationIndex !== null)
{
    var locationNames = [ "Location A", "Location B" ];
    // If a location name was specified, use it for header bar title.
    document.getElementById("headerBarTitle").textContent = locationNames[locationIndex];
}
/*
var slider = document.getElementById('slider')
var slider = document.createElement("INPUT");
slider.defaultValue = 30;
slider.max = 30;
slider.setAttribute('step', 200);

*/

document.getElementById('slider').value=0;
document.getElementById('slider').addEventListener('onDrag', sliderMoved);

 function sliderMoved () {
     change = slider.value*86400;
     UNIXDate = Math.round(date/1000) + change;
     tempDate = new Date(UNIXDate);
     stringDate = tempDate.toDateString();
     document.getElementById('date').innerHTML = stringDate;
 };
var test = {
    lat : 37.8141,
    lng : 144.9366,
    name: 'Melbourne',
    time: 885254400
};

//https://api.forecast.io/forecast/20f60a445b8ef7c4bc15c13164edf445/37.8141,144.9633,2013-05-06T12:00:00-0400
//console.log(JSON.stringify('https://api.forecast.io/forecast/20f60a445b8ef7c4bc15c13164edf445/37.8141,144.9633,2013-05-06T12:00:00-0400'));

outputArea.innerHTML = "Loading..."; 

var change, currentDate, stringDate, UNIXDate, firstLoad;


if (firstLoad === undefined) {
   currentDate = new Date();
   stringDate = currentDate.toDateString(); 
    UNIXDate = Math.round(currentDate/1000)
    firstload = false;
    document.getElementById('date').innerHTML = stringDate;
}







this.weatherLocation = function(script)
{
     // YOUR CODE
    outputArea.innerHTML = " ";
	outputArea.innerHTML += "summary " + script.daily.data[0].summary + '</br>';
	outputArea.innerHTML += "icon " + script.daily.data[0].icon + '</br>';
	outputArea.innerHTML += 'humidity '+ script.daily.data[0].humidity*100 + "%" +  + '</br>';
	outputArea.innerHTML += 'windspeed ' + script.daily.data[0].windSpeed + 'km/h' + ' </br>';
	outputArea.innerHTML += 'temp Max ' + script.daily.data[0].temperatureMax + ' Celcius' + '</br>';
    outputArea.innerHTML += 'temp Min ' + script.daily.data[0].temperatureMin + ' Celcius' + '</br>';
	outputArea.innerHTML += 'preipitate ' + script.daily.data[0].precipProbability*100 + "%" + '</br>';
}

// Make the API request:
var url = "https://api.forecast.io/forecast/20f60a445b8ef7c4bc15c13164edf445/" + test.lat + "," + test.lng + "/?exclude=[flags,alerts,minutely,hourly,offset,currently]&units=si&callback=this.weatherLocation";
var script = document.createElement('script');
script.src = url;
document.body.appendChild(script);