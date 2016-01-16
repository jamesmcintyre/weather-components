'use strict';
$( document ).ready(init);

function init() {

    autoLocate();

    // $('#searchform').keyup(searchCall);
    // $(document).on('click', '#delete-contact', removeContact);
    // $(document).on('click', '#save-new', addContact);
    // $('div.results').on('click', '.name', sortListName);
    // loadFromLocal(true);
}

//

var todaysWeather = {};

function autoLocate(){

  $.ajax({
    url : "http://api.wunderground.com/api/64f9593805d272a1/geolookup/q/autoip.json",
    dataType : "jsonp",
    success : function(parsed_json) {

      var autoCity = parsed_json.location.city;
      var autoState = parsed_json.location.state
      var autoLocString = autoCity + ", " + autoState;
      var autoZip = parsed_json.location.zip;
      var autoLink = parsed_json.location.wuiurl;

      var currentWeather = {
        locstring: autoLocString,
        zip: autoZip,
        link: autoLink,
        city: autoCity,
        state: autoState
      };

      pullWeather(currentWeather);

  }
  });

}

function pullWeather(autoresults) {


    $.ajax({
    url : "http://api.wunderground.com/api/64f9593805d272a1/geolookup/conditions/q/"+autoresults.state+"/"+autoresults.city+".json",
    dataType : "jsonp",
    success : function(parsed_json) {

    todaysWeather.windDirection = parsed_json.current_observation.wind_dir;
    todaysWeather.windSpeed = parsed_json.current_observation.wind_gust_mph + " mph";
    todaysWeather.humidity = parsed_json.current_observation.relative_humidity;
    todaysWeather.dewPoing = parsed_json.current_observation.dewpoint_f+" F";
    todaysWeather.pressure = parsed_json.current_observation.pressure_in+"in";
    todaysWeather.visibility = parsed_json.current_observation.visibility_mi+" mi";
    todaysWeather.weather = parsed_json.current_observation.weather;
    todaysWeather.temp = parsed_json.current_observation.temp_f+" F";

    }

    });


    $.ajax({
    url : "http://api.wunderground.com/api/64f9593805d272a1/forecast/q/"+autoresults.state+"/"+autoresults.city+".json",
    dataType : "jsonp",
    success : function(parsed_json) {
      todaysWeather.iconString = parsed_json.forecast.simpleforecast.forecastday[0].icon;
    }
    });


}
