const API_KEY = "210b29cbef5aa621a0c5449d884ffeb0";
var wData;
var fahrenheit = false;
/* global $ */
/*
This the function that i check if the fahrenheit is false(i.e the temp is in Celcius) then change it to Fahrenheit, else return Celcius(if it is in Fahrenheit). I am using
2 parameters, one for celcius and the other for fahrenheit.
*/
function displayTemp(celTemp, f) {
    if(f) return Math.round(celTemp * (1.8 + 32)) + "&#8457;"
    return Math.round(celTemp) + "&#8451;";
}
/*
This the function that i render the data from the API call. I have 2 parameters the wData is for the apiData and the fahrenheit for the temperature(because inside this
function i am calling the display function so i will need to check if fahrenheit is true or false)
*/
function render(wData, fahrenheit) {
    var currentLocation = wData.name;
    var currentWeather = wData.weather[0].description;
    var currentTemp = displayTemp(wData.main.temp, fahrenheit);
    var high = displayTemp(wData.main.temp_max, fahrenheit);
    var low = displayTemp(wData.main.temp_min, fahrenheit);
    var icon = wData.weather[0].icon;
            
    $("#nameLoc").html(currentLocation);
    $("#weather").html(currentWeather);
    $("#temp").html(currentTemp);
    $("#highLow").html("High/Low Temp: " + high + " / " + low);
    
    var iconSrc = "http://openweathermap.org/img/w/" + icon + ".png";
    $("#temp").prepend("<img src=" + iconSrc + ">");
}

$(function() {
    var location;
    //call the ip adress API
    $.getJSON('http://ipinfo.io', function(d){
        console.log("assigning the data...")
        location = d.loc.split(",");
        console.log(location);
        
        //call the weather api inside the ip adress API
        $.getJSON("http://api.openweathermap.org/data/2.5/weather?lat=" + location[0] + "&lon=" + location[1] + "&units=metric&APPID=" + API_KEY, function(apiData) {
            console.log("got the data, ", apiData);
            wData = apiData;
            
            render(wData, fahrenheit)
            
            $("#toggle").click(function() {
                fahrenheit = !fahrenheit//this a way to toggle a boolean
                render(wData, fahrenheit);//After i toggled the temperature i run again
                //the render function to get the new temperature
            });
        });
   
    
    console.log("data from outside", location);
});
});
