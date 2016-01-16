'use strict';
$( document ).ready(init);

function init() {

    loadEmUp();

    // $('#searchform').keyup(searchCall);
    // $(document).on('click', '#delete-contact', removeContact);
    // $(document).on('click', '#save-new', addContact);
    // $('div.results').on('click', '.name', sortListName);
    // loadFromLocal(true);
}

//

function loadEmUp(){

  $.ajax({
    url : "http://api.wunderground.com/api/64f9593805d272a1/geolookup/q/autoip.json",
    dataType : "jsonp",
    success : function(parsed_json) {
    var location = parsed_json['location']['city'];
    var temp_f = parsed_json['current_observation']['temp_f'];
    alert("Current temperature in " + location + " is: " + temp_f);
    debugger
  }
  });





  // $.ajax({
  //   url : "http://api.wunderground.com/api/64f9593805d272a1/geolookup/conditions/q/IA/Cedar_Rapids.json",
  //   dataType : "jsonp",
  //   success : function(parsed_json) {
  //   var location = parsed_json['location']['city'];
  //   var temp_f = parsed_json['current_observation']['temp_f'];
  //   alert("Current temperature in " + location + " is: " + temp_f);
  // }
  // });

}
