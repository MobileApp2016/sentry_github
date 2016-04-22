
var mysql = require("mysql");
/*
var connectionpool = mysql.createPool({
  connectionLimit : 10000,
  queueLimit : 0,
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'sentry',
  debug    :  false
});
*/
var connectionpool = mysql.createPool({
  connectionLimit : 10000,
  queueLimit : 0,
  host     : 'us-cdbr-iron-east-03.cleardb.net',
  user     : 'be3556fe3d1b32',
  password : '88c3f2fe',
  database : 'heroku_efc0652d23010ec',
  debug    :  false
});

connectionpool.getConnection(function(err) {
  if (err) throw err
  console.log('You are now connected to the database!....Yay')
})

module.exports = connectionpool;
