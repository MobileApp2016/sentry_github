var express = require("express");
var app = express();
var port = process.env.PORT || 3000;
var mysql = require("mysql");

var debug = require("debug");
var hat = require("hat");
var bodyParser = require("body-parser");
var md5 = require('md5');
var connectionpool = require('./db');

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/api'));
app.use(express.static(__dirname + '/views'));

// set up our express application
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({extended: true}));

//app.locals.isAuthenticated = false;
//app.locals.username = "test";
//app.locals.password = "password";
// IMPORT ROUTES
// =============================================================================
var router = express.Router();
app.get("/true", function (req, res) {
    res.isAuthenticated = true;
    res.sendFile("index.html", {root: __dirname + "/views/pages/"})
});

app.post("/authenticate", function (req, res) {
    //console.log(req.headers);
    connectionpool.getConnection(function (err, connection) {
        if (err) {
            console.error('CONNECTION error: ', err);
            res.statusCode = 503;
            res.send({
                result: 'error',
                err: err.code
            });
            //runs if no token exists
        } else if(!(req.body.token == null)) {
            //console.dir(req.body.token);
          //console.log("token exists: " + (req.body.token == null));
            //console.log(res.results[0].username);
            //console.dir(req.body.username);
            app.locals.username = req.body.username;
            app.locals.password = req.body.password;

            var query = "SELECT ??, ??, ??, ??, ??, ?? FROM ?? WHERE (??=? AND ??=?) LIMIT 1";
            var table = [`username`, `password`, 'firstname', 'lastname', `apikey`, `user_id`, `users`, `username`,
                app.locals.username, `password`, app.locals.password];
            query = mysql.format(query, table);
            res.header('Access-Control-Allow-Origin', '*');
            res.header({'Content-Type': 'application/json'});
            connection.query(query, function (err, result) {
                if (err) {
                    app.locals.isAuthenticated = false;
                    console.error('CONNECTION error: ', err);
                    res.statusCode = 503;
                   return res.send({
                            result: 'error',
                            err: err.code
                        }/*,
                         res.redirect("index.html")
                         */
                    );

                } else {
                        //console.dir(result);
                    if (result.length > 0) {
                        app.locals.isAuthenticated = true;
                        //console.log("User does exist");
                       return res.json({
                            "status": "true",
                            "description": "authenticated",
                            "results": result
                        });
                    } else {
                        app.locals.isAuthenticated = false;

                        console.log("User does not exist");
                       return res.json({
                            "status": "false",
                            "description": "authenticated",
                            "results": result
                        });
                    }
                    ///res.redirect("index.html");

                }
            });
        }
        //runs if token exists
        else {
            //console.log("token exists");
            //console.log(res.results[0].username);
            //console.dir(req.body.username);
            app.locals.username = req.body.username;
            app.locals.password = req.body.password;
            var query = "SELECT ??, ??, ??, ?? FROM ?? WHERE (??=? AND ??=?) LIMIT 1";
            var table = [`username`, `password`, `token`, `user_id`, `users`, `user_id`,
                app.locals.username, `apikey`, app.locals.password];
            query = mysql.format(query, table);
            res.header('Access-Control-Allow-Origin', '*');
            res.header({'Content-Type': 'application/json'});
            connection.query(query, function (err, result) {
                if (err) {
                    app.locals.isAuthenticated = false;
                    console.error('CONNECTION error: ', err);
                    res.statusCode = 503;
                    return res.send({
                            result: 'error',
                            err: err.code
                        }/*,
                         res.redirect("index.html")*/
                    );

                } else {
                    //console.dir(result);
                    if (result.length > 0) {
                        app.locals.isAuthenticated = true;

                        //console.log("User does exist");
                        return res.json({
                            "status": "true",
                            "description": "authenticated",
                            "results": result
                        });
                    } else {
                        app.locals.isAuthenticated = false;

                        console.log("User does not exist");
                        return res.json({
                            "status": "false",
                            "description": "authenticated",
                            "results": result
                        });
                    }
                    ///res.redirect("index.html");

                }
            });
        }
        connection.release();
    })
});
var isAuthenticated = function (req, res, next) {
    if (app.locals.isAuthenticated == false) {
         return res.status(404).send("Bad Request");
        //res.redirect("index.html");
        //res.render("index.html");

        //res.sendFile('index.html', {root: __dirname + "/views/pages/"});
    } else {
       //res.sendFile('index.html', {root: __dirname + "/views/pages/"});
        next();
        //console.log("it worked");
    }
    //next();

};
app.route("/")
    .get(function (req, res) {
        return res.sendFile('index.html', {root: __dirname + "/views/pages/"});
    });
    app.get('/registration', function (req, res) {
        return res.sendFile('registration.html', {root: __dirname + "/views/pages/"});
    });
//authenticates all routes
app.all("*", isAuthenticated);


//DASHBOARD
//===================================================================

app.get('/dashboard', function (req, res) {
    return res.sendFile('dashboard.html', {root: __dirname + "/views/pages/"});
});

app.route('/groups/users/:userid')
    .get(function(req, res) {
        connectionpool.getConnection(function(err, connection) {
            if (err) {
                console.error('CONNECTION error: ', err);
                res.statusCode = 503;
                res.send({
                    result: 'error',
                    err: err.code
                });
            } else {
                //console.log(req.params.groupid);
                //var userid = req.body.userid;
                var groupid = req.params.userid;

                var query = "SELECT user_id, fkid_group, username, firstname, lastname FROM `users` INNER JOIN `users_to_groups` ON `users_to_groups`.`fkid_user` = `users`.`user_id` WHERE `users_to_groups`.`fkid_group` = ?;";
                var table = [groupid];
                //var table = ['groups', "groups_to_markers", "groups.group_id", "groups_to_markers.fkid_group", "markers", "groups_to_markers.fkid_marker", "markers.marker_id", groupid];
                query = mysql.format(query, table);
                res.header('Access-Control-Allow-Origin', '*');
                connection.query(query, function(err, result) {
                    if (err) {
                        console.error('Error', err);
                        res.statusCode = 404;
                        res.send({
                            "status": 'Error',
                            "description": "User ID: '" + userid + "' Not found."
                        });
                    } else {
                        res.json({
                            "status": "OK",
                            "description": "Returns all group information the user is in.",
                            "results": result
                        });
                    }
                    connection.release();
                });
            }
        });
    })
    .post(function(req, res) {
        connectionpool.getConnection(function(err, connection) {
            if (err) {
                console.error('CONNECTION error: ', err);
                res.statusCode = 503;
                res.send({
                    result: 'error',
                    err: err.code
                });
            } else {
                var userid = req.params.userid;

                var query = "SELECT * FROM groups INNER JOIN users_to_groups ON groups.group_id = users_to_groups.fkid_group WHERE users_to_groups.fkid_user = ?";
                var table = [userid];
                //var table = ['groups', "groups_to_markers", "groups.group_id", "groups_to_markers.fkid_group", "markers", "groups_to_markers.fkid_marker", "markers.marker_id", groupid];
                query = mysql.format(query, table);
                res.header('Access-Control-Allow-Origin', '*');
                connection.query(query, function(err, result) {
                    if (err) {
                        console.error('Error', err);
                        res.statusCode = 404;
                        res.send({
                            "status": 'Error',
                            "description": "User ID: '" + userid + "' Not found."
                        });
                    } else {
                        res.json({
                            "status": "OK",
                            "description": "Returns all group information the user is in.",
                            "results": result
                        });
                    }
                    connection.release();
                });
            }
        });
    });

    app.route('/users')
        .post(function(req, res) {
            connectionpool.getConnection(function(err, connection) {
                if (err) {
                    console.error('CONNECTION error: ', err);
                    res.statusCode = 503;
                    res.send({
                        result: 'error',
                        err: err.code
                    });
                } else {

                  var username = req.body.username;
                //  var email = req.body.email;

                  var query = "SELECT * FROM users WHERE username = ?";
                  var table = [username];
                  //var table = ['groups', "groups_to_markers", "groups.group_id", "groups_to_markers.fkid_group", "markers", "groups_to_markers.fkid_marker", "markers.marker_id", groupid];
                  query = mysql.format(query, table);
                  res.header('Access-Control-Allow-Origin', '*');
                  connection.query(query, function(err, result) {
                      if (err) {
                          console.error('Error', err);
                          res.statusCode = 404;
                          res.send({
                              "status": 'Error',
                              "description": "Not Found"
                          });
                      }else if (result.length > 0) {
                        res.json({
                            "status": "usernameExists",
                            "description": "Username already taken",
                            "results": result
                        });
                      }else{
                        var email = req.body.email;
                        var query = "SELECT * FROM users WHERE email = ?";
                        var table = [email];
                      query = mysql.format(query, table);
                        res.header('Access-Control-Allow-Origin', '*');
                        connection.query(query, function(err, result) {
                            if (err) {
                                console.error('Error', err);
                                res.statusCode = 404;
                                res.send({
                                    "status": 'Error',
                                    "description": "Not Found"
                                });
                            }else if (result.length > 0) {
                              res.json({
                                  "status": "emailExists",
                                  "description": "Email already registered",
                                  "results": result
                              });
                            }else{

                              var user_id = req.body.userid;
                              var marker_id = req.body.markerid;
                              var username = req.body.username;
                              var firstname = req.body.firstname;
                              var lastname = req.body.lastname;
                              var password = req.body.password;
                              var email = req.body.email;
                              var phone = req.body.phone;
                              var apikey = req.body.apikey;
                              var query = "INSERT INTO ?? (??,??,??,??,??,??,??,??,??) VALUES (?,?,?,?,?,?,?,?, NOW())";
                              var table = [`users`, `user_id`, `username`, 'firstname', 'lastname', `password`, `email`, `phone`, `apikey`, `date_created`, user_id, username, firstname, lastname, password, email, phone, apikey];
                              query = mysql.format(query, table);
                              //res.header('Access-Control-Allow-Origin', '*');
                              connection.query(query, function(err, result) {
                                if (err) {
                                    console.error('CONNECTION error: ', err);
                                    res.statusCode = 503;
                                    res.send({
                                        result: 'error',
                                        err: err.code,
                                        "description": err
                                    });
                                } else {
                                }
                              //  connection.release();
                            });
                                var query = "INSERT INTO ?? (??,??) VALUES (?,?)";
                                var table = [`markers`, 'marker_id', `color`, marker_id, '#22c0FF'];
                                query = mysql.format(query, table);
                                //res.header('Access-Control-Allow-Origin', '*');
                                connection.query(query, function(err, result) {
                                  if (err) {
                                      console.error('CONNECTION error: ', err);
                                      res.statusCode = 503;
                                      res.send({
                                          result: 'error',
                                          err: err.code,
                                          "description": err
                                      });
                                  } else {
                                  }
                                  //connection.release();
                              });

                                  var query = "INSERT INTO ?? (??,??) VALUES (?,?)";
                                  var table = [`users_to_markers`, 'fkid_user', `fkid_marker`, user_id, marker_id, ];
                                  query = mysql.format(query, table);
                                  //res.header('Access-Control-Allow-Origin', '*');
                                  connection.query(query, function(err, result) {
                                    if (err) {
                                        console.error('CONNECTION error: ', err);
                                        res.statusCode = 503;
                                        res.send({
                                            result: 'error',
                                            err: err.code,
                                            "description": err
                                        });
                                    } else {

                                        res.json({
                                            "status": "OK",
                                            "description": "Inserts a new user.",
                                            "results": result
                                        });

                                    }
                                  });

                            }

                        connection.release();
                    });
                }
            });
        }
      });
    });

app.route('/groups/remove')
    .delete(function(req, res) {
        connectionpool.getConnection(function(err, connection) {
            if (err) {
                console.error('CONNECTION error: ', err);
                res.statusCode = 503;
                res.send({
                    result: 'error',
                    err: err.code
                });
            } else {
                var groupid = req.body.groupid;
                var userid = req.body.userid;
                var query = "DELETE FROM ?? WHERE ?? = ? AND ?? = ?";
                var table = ['users_to_groups', 'fkid_group', groupid, 'fkid_user', userid];
                query = mysql.format(query, table);
                res.header('Access-Control-Allow-Origin', '*');
                connection.query(query, function(err, result) {
                    if (err) {
                        console.error('Error', err);
                        res.statusCode = 404;
                        res.send({
                            "status": 'Error',
                            "description": "Group Not found."
                        });
                    } else {
                        res.json({
                            "status": "OK",
                            "description": "Removes a user from a group.",
                            "results": result
                        });
                    }
                    connection.release();
                });
            }
        });
    });
app.route('/map/:groupid')
    .get(function(req, res) {
        connectionpool.getConnection(function(err, connection) {
            if (err) {
                console.error('CONNECTION error: ', err);
                res.statusCode = 503;
                res.send({
                    result: 'error',
                    err: err.code
                });
            } else {
                var groupid = req.params.groupid;
                var query = "SELECT * FROM groups, users, users_to_markers, users_to_groups, markers WHERE groups.group_id = ? AND markers.marker_id = users_to_markers.fkid_marker AND users.user_id = users_to_markers.fkid_user AND users_to_groups.fkid_user = users.user_id AND users_to_groups.fkid_group = groups.group_id AND markers.latitude IS NOT NULL GROUP BY users.user_id";
                var table = [groupid];
                //var table = ['groups', "groups_to_markers", "groups.group_id", "groups_to_markers.fkid_group", "markers", "groups_to_markers.fkid_marker", "markers.marker_id", groupid];
                query = mysql.format(query, table);
                res.header('Access-Control-Allow-Origin', '*');
                connection.query(query, function(err, result) {
                    if (err) {
                        console.error('Error', err);
                        res.statusCode = 404;
                        res.send({
                            "status": 'Error',
                            "description": "Group ID: '" + groupid + "' Not found."
                        });
                    } else {
                        res.json({
                            "status": "OK",
                            "description": "Returns all group and marker information for a specific group",
                            "results": result
                        });
                    }
                    connection.release();
                });
            }
        });
    })
    .put(function(req, res) {
        connectionpool.getConnection(function(err, connection) {
            if (err) {
                console.error('CONNECTION error: ', err);
                res.statusCode = 503;
                res.send({
                    result: 'error',
                    err: err.code
                });
            } else {
                var userid = req.params.groupid;
                var latitude = req.body.latitude;
                var longitude = req.body.longitude;

                var query = "UPDATE `markers` SET `latitude`= ?, `longitude`= ? WHERE  markers.marker_id = (SELECT fkid_marker FROM users, users_to_markers WHERE users.user_id = ? AND users.user_id = users_to_markers.fkid_user)";
                var table = [latitude, longitude, userid];
                //var table = ['groups', "groups_to_markers", "groups.group_id", "groups_to_markers.fkid_group", "markers", "groups_to_markers.fkid_marker", "markers.marker_id", groupid];
                query = mysql.format(query, table);
                res.header('Access-Control-Allow-Origin', '*');
                connection.query(query, function(err, result) {
                    if (err) {
                        console.error('Error', err);
                        res.statusCode = 404;
                        res.send({
                            "status": 'Error',
                            "description": "User Not found."
                        });
                    } else {
                        res.json({
                            "status": "OK",
                            "description": "Updates the latitudeand longitude of a user.",
                            "results": result
                        });
                    }
                    connection.release();
                });
            }
        });
    })
    .post(function(req, res) {
        connectionpool.getConnection(function(err, connection) {
            if (err) {
                console.error('CONNECTION error: ', err);
                res.statusCode = 503;
                res.send({
                    result: 'error',
                    err: err.code
                });
            } else {
                var userid = req.params.groupid;

                var query = "SELECT * FROM groups, users, users_to_markers, users_to_groups, markers WHERE groups.group_id = ? AND markers.marker_id = users_to_markers.fkid_marker AND users.user_id = users_to_markers.fkid_user AND users_to_groups.fkid_user = users.user_id AND users_to_groups.fkid_group = groups.group_id AND markers.latitude IS NOT NULL GROUP BY users.user_id";
                var table = [userid];
                //var table = ['groups', "groups_to_markers", "groups.group_id", "groups_to_markers.fkid_group", "markers", "groups_to_markers.fkid_marker", "markers.marker_id", groupid];
                query = mysql.format(query, table);
                res.header('Access-Control-Allow-Origin', '*');
                connection.query(query, function(err, result) {
                    if (err) {
                        console.error('Error', err);
                        res.statusCode = 404;
                        res.send({
                            "status": 'Error',
                            "description": "Group ID: '" + groupid + "' Not found."
                        });
                    } else {
                        res.json({
                            "status": "OK",
                            "description": "Returns all group and marker information for a specific group",
                            "results": result
                        });
                    }
                    connection.release();
                });
            }
        });
    });

//GROUPS
//===================================================================
app.route('/groups', isAuthenticated)
    .get(function (req, res) {
        connectionpool.getConnection(function (err, connection) {
            if (err) {
                console.error('CONNECTION error: ', err);
                res.statusCode = 503;
                 res.send({
                    result: 'error',
                    err: err.code
                });
            } else {
                var query = "SELECT * FROM ??";
                var table = ['allgroups_view'];
                res.set({
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                });
                query = mysql.format(query, table);

                /*res.header('Access-Control-Allow-Origin', '*');
                res.header({'Content-Type': 'application/json'});*/
                connection.query(query, function (err, result) {
                    if (err) {
                        console.error('CONNECTION error: ', err);
                        res.statusCode = 503;
                       return res.send({
                            result: 'error',
                            err: err.code
                        });
                    } else {
                        return res.json({
                            "status": "OK",
                            "description": "Gets all groups",
                            "results": result
                        });
                    }
                });
            }
            connection.release();
        });
    })
    .post(function (req, res) {
        connectionpool.getConnection(function (err, connection) {
            if (err) {
                console.error('CONNECTION error: ', err);
                res.statusCode = 503;
                res.send({
                    result: 'error',
                    err: err.code
                });
            } else {
                var groupid = req.body.groupid;
                var groupname = req.body.groupname;
                var maxsize = req.body.maxsize;
                var userid = req.body.userid;
                var query = "INSERT INTO ?? (??, ??, ??, ??) VALUES (?, ?, ?, NOW());";
                var table = ['groups', `group_id`, `group_name`, `max_size`, `date_created`, groupid, groupname, maxsize];
                query = mysql.format(query, table);
                res.header('Access-Control-Allow-Origin', '*');
                res.header({'Content-Type': 'application/json'});
                connection.query(query, function (err, result) {
                    if (err) {
                        console.error('CONNECTION error: ', err);
                        res.statusCode = 503;
                        res.send({
                            result: 'error',
                            err: err.code,
                            "description": err
                        });
                    } else {
                      /*
                        res.json({
                            "status": "OK",
                            "description": "Inserts a new Group",
                            "results": result
                        });
                        */
                    }
                });
                var query = "INSERT INTO ?? (??, ??, ??) VALUES (?, ?, '2')";
                var table = ['users_to_groups', `fkid_user`, `fkid_group`, `fkid_privilege`, userid, groupid];
                query = mysql.format(query, table);
                connection.query(query, function (err, result) {
                    if (err) {
                        console.error('CONNECTION error: ', err);
                        res.statusCode = 503;
                        res.send({
                            result: 'error',
                            err: err.code,
                            "description": err
                        });
                    } else {
                        res.json({
                            "status": "OK",
                            "description": "Inserts a new Group",
                            "results": result
                        });
                    }
                });
            }
            connection.release();
        });
    });

app.route('/groups/:groupname')
    .get(function (req, res) {
        connectionpool.getConnection(function (err, connection) {
            if (err) {
                console.error('CONNECTION error: ', err);
                res.statusCode = 503;
                res.send({
                    result: 'error',
                    err: err.code
                });
            } else {
                //console.log(req.params.groupname);
                var groupname = req.params.groupname;

                var query = "SELECT * FROM ?? WHERE ?? = ?";
                var table = ['allgroups_view', "group_name", groupname];
                query = mysql.format(query, table);
                res.header('Access-Control-Allow-Origin', '*');
                connection.query(query, function (err, result) {
                    if (err) {
                        console.error('CONNECTION error: ', err);
                        res.statusCode = 503;
                        res.send({
                            result: 'error',
                            err: err.code
                        });
                    } else if (result[0] === undefined) {
                        res.statusCode = 404;
                        res.json({
                            "status": 'Error',
                            "description": "Group Name: '" + groupname + "' Not found."
                        });
                    } else {
                        res.json({
                            "status": "OK",
                            "description": "Gets a group by its group name.",
                            "results": result
                        });
                    }
                    connection.release();
                });
            }
        });
    });

app.route('/groups/:groupid')
    .delete(function (req, res) {
        connectionpool.getConnection(function (err, connection) {
            if (err) {
                console.error('CONNECTION error: ', err);
                res.statusCode = 503;
                res.send({
                    result: 'error',
                    err: err.code
                });
            } else {
                console.log(req.params.groupid);
                var groupid = req.params.groupid;

                var query = "DELETE FROM ?? WHERE ?? = ?";
                var table = ['groups', "group_id", groupid];
                query = mysql.format(query, table);
                res.header('Access-Control-Allow-Origin', '*');
                connection.query(query, function (err, result) {
                    if (err) {
                        console.error('Error', err);
                        res.statusCode = 404;
                        res.send({
                            "status": 'Error',
                            "description": "Group Name: '" + groupid + "' Not found."
                        });
                    } else {
                        res.json({
                            "status": "OK",
                            "description": "Deletes a group by its group id.",
                            "results": result
                        });
                    }
                    connection.release();
                });
            }
        });
    })
    .post(function (req, res) {
        connectionpool.getConnection(function (err, connection) {
            if (err) {
                console.error('CONNECTION error: ', err);
                res.statusCode = 503;
                res.send({
                    result: 'error',
                    err: err.code
                });
            } else {
                console.log(req.params.groupid);
                var group_id = req.params.groupid;
                var user_id = req.body.userid;

                var query = "INSERT INTO ?? (??, ??, ??) VALUES (?, ?, '4')";
                var table = ["users_to_groups", "fkid_user", "fkid_group", "fkid_privilege", user_id, group_id];
                query = mysql.format(query, table);
                res.header('Access-Control-Allow-Origin', '*');
                connection.query(query, function (err, result) {
                    if (err) {
                        console.error('Error', err);
                        res.statusCode = 404;
                        res.send({
                            "status": 'Error',
                            "description": "User already in selected group."
                        });
                    } else {
                        res.json({
                            "status": "OK",
                            "description": "Joins a user to group.",
                            "results": result
                        });
                    }
                    connection.release();
                });
            }
        });
    })
    .put(function (req, res) {
        connectionpool.getConnection(function (err, connection) {
            if (err) {
                console.error('CONNECTION error: ', err);
                res.statusCode = 503;
                res.send({
                    result: 'error',
                    err: err.code
                });
            } else {
                //console.log(req.params.groupid, req.body.groupname, req.body.maxsize);
                var groupid = req.params.groupid;
                var groupname = req.body.groupname;
                var maxsize = req.body.maxsize;

                var query = "UPDATE ?? SET ?? = ?, ?? = ? WHERE ?? = ?";
                var table = ['groups', "group_name", groupname, "max_size", maxsize, "group_id", groupid];
                query = mysql.format(query, table);
                res.header('Access-Control-Allow-Origin', '*');
                connection.query(query, function (err, result) {
                    if (err) {
                        console.error('Error', err);
                        res.statusCode = 404;
                        res.send({
                            "status": 'Error',
                            "description": "Group id: '" + groupid + "' Not found."
                        });
                    } else {
                        res.json({
                            "status": "OK",
                            "description": "Updates a group by its group id.",
                            "query": query,
                            "results": result
                        });
                    }
                    connection.release();
                });
            }
        });
    });


//router.use( 'index', router);

app.listen(port);
console.log('Sentry up and running on port: ' + port);
