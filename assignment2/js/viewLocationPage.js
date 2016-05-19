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

document.getElementById('slider').value=0;
document.getElementById('slider').addEventListener('onDrag', sliderMoved);

 

//https://api.forecast.io/forecast/20f60a445b8ef7c4bc15c13164edf445/37.8141,144.9633,2013-05-06T12:00:00-0400
//console.log(JSON.stringify('https://api.forecast.io/forecast/20f60a445b8ef7c4bc15c13164edf445/37.8141,144.9633,2013-05-06T12:00:00-0400'));

outputArea.innerHTML = "Loading..."; 

var change, currentDate, stringDate, firstLoad, script;


var test = {
    lat : 40.748817,
    lng : -73.985428,
    name: 'Melbourne'
};

if (firstLoad === undefined) {
    
   currentDate = new Date();
   stringDate = currentDate.toDateString(); 
    UNIXDate = Math.round(currentDate/1000);
    console.log( 'firstload ' + UNIXDate)
    test.time = UNIXDate;
    setURL();
    firstload = false;
    document.getElementById('date').innerHTML = stringDate;
    
    
}



function  weatherLocation(script)
{
     // YOUR CODE
     console.log(test.time)
    outputArea.innerHTML = " ";
	outputArea.innerHTML += "summary " + script.daily.data[0].summary + '</br>';
	outputArea.innerHTML += "icon " + script.daily.data[0].icon + '</br>';
	outputArea.innerHTML += 'humidity '+ script.daily.data[0].humidity*100 + "%" + '</br>';
	outputArea.innerHTML += 'windspeed ' + script.daily.data[0].windSpeed + 'km/h' + ' </br>';
	outputArea.innerHTML += 'temp Max ' + script.daily.data[0].temperatureMax + ' Celcius' + '</br>';
    outputArea.innerHTML += 'temp Min ' + script.daily.data[0].temperatureMin + ' Celcius' + '</br>';
	outputArea.innerHTML += 'preipitate ' + script.daily.data[0].precipProbability*100 + "%" + '</br>';
   
}

// Make the API request:
function setURL () {
    var url = "https://api.forecast.io/forecast/20f60a445b8ef7c4bc15c13164edf445/" + test.lat + "," + test.lng + "," + test.time  + "/?exclude=[flags,alerts,minutely,hourly,offset,currently]&units=si&callback=weatherLocation";
    var script = document.createElement('script');
    script.src = url;
    document.body.appendChild(script);
}

function sliderMoved () {
     change = slider.value*86400;
     UNIXDate = (Math.round(currentDate/1000) + change);
     test.time = UNIXDate;
     tempDate = new Date(UNIXDate*1000);
     stringDate = tempDate.toDateString();
     document.getElementById('date').innerHTML = stringDate;
     setURL();
     weatherLocation(script);
 };