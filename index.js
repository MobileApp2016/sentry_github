var SwaggerExpress = require('swagger-express-mw');
var express = require("express");
var debug = require("debug");
var hat = require("hat");
var yamljs = require("yamljs");
var mysql   = require("mysql");
var bodyParser  = require("body-parser");
var md5 = require('md5');
//var rest = require(__dirname + "/app/REST.js");
var app = require('express')();

var config = {
  appRoot: __dirname // required config
};

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/api'));
app.use(express.static(__dirname + '/views'));


app.get('/', function(req, res){
    res.header('Access-Control-Allow-Origin', '*');
    res.sendFile('index.html', { root: __dirname + "/views/pages/" } );
});


SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }
  // install middleware
  swaggerExpress.register(app);

  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
  }
});

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'us-cdbr-iron-east-03.cleardb.net',
  user     : 'be3556fe3d1b32',
  password : '88c3f2fe',
  database : 'heroku_efc0652d23010ec',
  debug    :  false
});

var port = process.env.PORT || 3000;
app.listen(port);
