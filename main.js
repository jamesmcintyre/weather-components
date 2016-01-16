'use strict';
$( document ).ready(init);

function init() {

    autoLocate();
    $("#zip").keyup(function (e) {
      if (e.keyCode == 13) {
        $('.card').removeClass('bounce');

        var zip = $(this).val();
        if(zip.match(/^\d{1,5}$/)){
            autoLocate(zip);
        }else{
          $('.card').addClass('shake');
          $("#zip").val("");
        }

      }
    });
}



var todaysWeather = {};
var locationData = {};

function autoLocate(x){
  var jsonEndpoint = "http://api.wunderground.com/api/64f9593805d272a1/geolookup/q/autoip.json";
  if (x){
    jsonEndpoint = "http://api.wunderground.com/api/64f9593805d272a1/geolookup/q/"+x+".json";
  }
  else {
    jsonEndpoint = "http://api.wunderground.com/api/64f9593805d272a1/geolookup/q/autoip.json"
  }


  $.ajax({
    url : jsonEndpoint,
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
      locationData = currentWeather;
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
    todaysWeather.windSpeed = "Wind Speed: "+parsed_json.current_observation.wind_gust_mph + " mph";
    todaysWeather.humidity = "Humidity: "+parsed_json.current_observation.relative_humidity;
    todaysWeather.dewPoing = "Dew Point: "+parsed_json.current_observation.dewpoint_f+" F";
    todaysWeather.pressure = "Pressure: "+parsed_json.current_observation.pressure_in+"in";
    todaysWeather.visibility = "Visibility: "+parsed_json.current_observation.visibility_mi+" mi";
    todaysWeather.weather = parsed_json.current_observation.weather;
    todaysWeather.temp = parsed_json.current_observation.temp_f+" F";
    todaysWeather.feels = parsed_json.current_observation.feelslike_f+" F";
    todaysWeather.windstr = parsed_json.current_observation.wind_string;
    var detailsArray = [todaysWeather.windSpeed, todaysWeather.humidity, todaysWeather.dewPoing, todaysWeather.pressure, todaysWeather.visibility, ("Temperature: "+todaysWeather.temp)];
    todaysWeather.details = detailsArray;
    }

    });


    $.ajax({
    url : "http://api.wunderground.com/api/64f9593805d272a1/forecast/q/"+autoresults.state+"/"+autoresults.city+".json",
    dataType : "jsonp",
    success : function(parsed_json) {
      todaysWeather.iconString = parsed_json.forecast.simpleforecast.forecastday[0].icon;
      todaysWeather.hightemp = parsed_json.forecast.simpleforecast.forecastday[0].high.fahrenheit+" F";
      selectIcon();
      setTimeout(function(){
        renderPage();
      },800);

    }
    });



}


function selectIcon() {

  var iconSelection = "";
  var iconBgColor = "";

  var descriptionsArray = ["chanceflurries", "chancesleet", "chancesnow", "flurries", "sleet", "snow",
  "cloudy", "fog", "hazy", "mostlycloudy", "partlycloudy", "cloudy", "partlycloudy", "overcast",
  "mostlysunny", "partlysunny", "sunny", "rain", "chancerain", "drizzle", "clear", "chancetstorms",
  "tstorms", "storm"];

  var descNum = $.inArray( todaysWeather.iconString, descriptionsArray );

  switch (true) {
  case (descNum <=5):
    iconSelection = "snowy";
    iconBgColor = "#80DC85";
    break;
  case (descNum >=6 && descNum <= 13):
    iconSelection = "cloudy";
    iconBgColor = "#2EAFE3";
    break;
  case (descNum >=14 && descNum <= 16):
    iconSelection = "sunny";
    iconBgColor = "#17B5FF";
    break;
  case (descNum >=17 && descNum <= 19):
    iconSelection = "rainy";
    iconBgColor = "#E4E4E4";
    break;
  case (descNum ===20):
    iconSelection = "rainbow";
    iconBgColor = "#F1D05E";
    break;
  case (descNum >=21 && descNum <=23):
    iconSelection = "stormy";
    iconBgColor = "#3C3C3C";
    break;
  default:
    iconSelection = "rainy";
    iconBgColor = "#E4E4E4";
    break;
  }

  todaysWeather.iconstr = iconSelection;
  todaysWeather.iconbg = iconBgColor;

}


function renderPage() {

  var alRoker = "It feels like "+todaysWeather.feels+" outside with "+todaysWeather.windstr+" wind, a high of "+todaysWeather.hightemp+" is forecasted!";
  var detailsList = todaysWeather.details;
  $('#weathericon').attr('class', '');
  $('#weathericon').addClass(todaysWeather.iconstr);
  $('#weather-thumb').css('background-color', todaysWeather.iconbg);
  $('#weatherdesc').text(todaysWeather.temp+" and "+todaysWeather.weather);
  $('#whereat').text('Weather in '+locationData.city+', '+locationData.state);
  $('#snippet').text(alRoker);
  $('#details-list').children().remove();
  for (var i = 0;i < detailsList.length;i++){
    $('#details-list').append($('<li>').addClass('list-group-item').text(detailsList[i]));
  }
  $('.card').removeClass('bounceInUp').addClass('bounce');



}
