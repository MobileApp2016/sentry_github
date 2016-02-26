'use strict';

var util = require('util');
var request = require('request');

module.exports = {
  getWeatherByCity: getWeatherByCity
}

function getWeatherByCity(req, res) {
  var city = req.swagger.params.city.value;
  var url = "http://api.openweathermap.org/data/2.5/weather?q="+city+"&units=imperial&APPID=cd4eda95a76d3de65a551a892bf8ce41";
  console.log('Executing request: '+url);
  request.get(url).pipe(res);
};
