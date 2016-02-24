var express = require("express");
var mysql   = require("mysql");
var bodyParser  = require("body-parser");
var md5 = require('MD5');
var rest = require(__dirname + "/app/REST.js");
var app  = express();

app.set('port', (process.env.PORT || 3000));

app.use(express.static(__dirname + '/app'));
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/app/views'));
app.use(express.static(__dirname + '/public'));



function REST(){
    var self = this;
   // self.connectMysql();
};
/*
REST.prototype.connectMysql = function() {
    var self = this;
    var pool = mysql.createPool({
        connectionLimit : 100,
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'restful_api_demo', //Was using this for a tutorial.
        debug    :  false
    });
    pool.getConnection(function(err,connection){
        if(err) {
          self.stop(err);
        } else {
          self.configureExpress(connection);
        }
    });
}
*/
REST.prototype.configureExpress = function(connection) {
      var self = this;
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(bodyParser.json());
      var router = express.Router();
      app.use('/api', router);
      var rest_router = new rest(router,connection,md5);
      self.startServer();
}

REST.prototype.startServer = function() {
      //The port we're using at the moment
      app.listen(app.get('port'), function() {
        console.log('Project Sentry is running on port', app.get('port'));
      });
}

REST.prototype.stop = function(err) {
    console.log("ISSUE WITH MYSQL \n" + err);
    process.exit(1);
}

new REST();
