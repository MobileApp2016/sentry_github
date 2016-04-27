routerApp.factory("AuthService", function ($http) {
    var auth = {};
    var authenticator = function(){
     this.authenticate = function () {
        if (!(localStorage.getItem("user_id") === null) && !(localStorage.getItem("token") === null)) {
            //alert("UserID: " + localStorage.getItem("communit_user_id") + "  UserToken: " + localStorage.getItem("communit_user_token"));
            //console.log(localStorage.getItem("username") + " " + localStorage.getItem("password"))
            var encodedData = 'username=' +
                encodeURIComponent(localStorage.getItem("username")) +
                '&password=' + encodeURIComponent(localStorage.getItem("password"));
          //  console.log("encodedData: " + encodedData);
           return $http({
                method: 'POST',
                url: "/authenticate",
                data: encodedData,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
            //if no error
                .then(function (data, status, headers, config) {
                        //console.log(data);
                        if (data.data.status === "true") {
                            //console.log("http: if true");
                           return true;
                        }
                        else {
                            //console.log("http: false");
                            localStorage.removeItem("username");
                            localStorage.removeItem("password");
                            localStorage.removeItem("token");
                            localStorage.removeItem("user_id");
                           return false;
                        }
                        //if error
                    }, function (data, status, headers, config) {
                      //  console.log("Error in auth http request");
                        return false;
                    }
                )
        }
        else {
          //  console.log("AuthService: else false");
          return false;
        }}
    };
    return new authenticator();
});
routerApp.run(function ($rootScope, $state, AuthService) {
    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
        //console.log(AuthService.authenticate());

        if (toState.authenticate && !AuthService.authenticate()) {
          //  console.log("Checked if authenticated");
            event.preventDefault();
            $state.go("landing");
        }
        else {
        //    console.log("Auth check false")
        }
    });
});
routerApp.controller('loginController', ['$scope', '$http', function ($scope, $http) {

    var vm = this;
    vm.postLogin = function () {
        var encodedData = 'username=' +
            encodeURIComponent(vm.inputData.username) +
            '&password=' +
            encodeURIComponent(vm.inputData.password) +
            '&token=' +
            encodeURIComponent(vm.generateToken());
        $http({
            method: 'POST',
            url: '/authenticate',
            data: encodedData,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
            .success(function (data, status, headers, config) {

                if (data.status === 'true') {
                    //localStorage.setItem("username", data.results[0].username);
                    //localStorage.setItem("password", data.results[0].password);
                    localStorage.setItem("token", data.results[0].apikey);
                    localStorage.setItem("user_id", data.results[0].user_id);
                    localStorage.setItem("firstname", data.results[0].firstname);
                    localStorage.setItem("lastname", data.results[0].lastname);
                  //  alert("Successfully logged in as \nUsername: " + data.results[0].username);
                    vm.inputData.username = "";
                    vm.inputData.password = "";
                    window.location.href = '/dashboard';

                } else {
                    $scope.errorMsg = "Login not correct";
                }
            })
            .error(function (data, status, headers, config) {
                console.log('Unable to submit form.');
                $scope.errorMsg = 'Unable to submit form';
            })
    };


    vm.getLoginInfo = function () {
        $http({
            method: 'GET',
            url: '/authenticate',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function (data, status, headers, config) {
              //  console.log(data);

            })
            .error(function (data, status, headers, config) {
                console.log('Unable to submit form.');
                $scope.errorMsg = 'Error retrieving login information';
            })
    }

    vm.generateToken = function () {
        //Length of Hex Code
        var hexIDLength = 20;
        //Characters to use in Hex Code
        var hexOptions = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
        var hexID = '';
        //Assigns the
        var optionsLength = hexOptions.length;
        //Loops through and randomly creates a hex string
        for (var i = 0; i < hexIDLength; i++) {
            var n = getRandomInt(0, optionsLength);
            hexID += hexOptions[n];
        }
        return hexID;
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

}]);


routerApp.controller('authenticationController', ['$scope', '$http', function ($scope, $http) {
    var vm = this;
    vm.authenticator = function () {
        vm.authenticateCheck();
        //Uncomment to repeat the authentication every 5 seconds,
        //this will prevent users from continuing on the page after they've
        //somehow cleared their stored localStorage.
        /*
         setInterval(function() {
         $scope.authenticateCheck();
         }, 5000);
         */
    };

    vm.authenticateCheck = function () {
        if (!(localStorage.getItem("username") === null) && !(localStorage.getItem("password") === null)) {
            //alert("UserID: " + localStorage.getItem("communit_user_id") + "  UserToken: " + localStorage.getItem("communit_user_token"));
            var encodedData = 'username=' +
                encodeURIComponent(localStorage.getItem("username")) +
                'password=' + encodeURIComponent(localStorage.getItem("password"));
            $http({
                method: 'POST',
                url: "/authenticate",
                data: encodedData,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
                .then(function (data, status, headers, config) {
                    //console.log(data);
                    vm.contents = data.data;
                    if (vm.contents.error) {
                        window.location.href = 'index.html';
                        vm.tokenMsg = vm.contents.error;
                    }
                    if (vm.contents.inactivity) {
                        localStorage.removeItem("user_id");
                        localStorage.removeItem("user_id");
                        sessionStorage.removeItem("token");
                        sessionStorage.removeItem("token");
                        window.location.href = 'index.html';
                        vm.tokenMsg = vm.contents.inactivity;
                    }
                })

        }
    };

    vm.login = function () {
        if ((localStorage.getItem("user_id") === null) && (localStorage.getItem("token") === null)) {
          //  console.log("vm.login no username or password in localStorage");
            //localStorage.setItem("username","test");
            //localStorage.setItem("password", "password");
        }
        else {
            console.log("vm.login checking authentication");
            vm.authenticateCheck()
        }
    };
//$scope.authenticateCheck();

}]);

routerApp.controller('registrationController', ['$scope', '$http', function ($scope, $http) {
    var validPassword = false
    ;
    $scope.checkPassword = function () {
    //  window.alert("dogs");
        if ($scope.inputData.password != $scope.inputData.passwordConfirm) {
            $scope.errorMsgConfrim = "Passwords do not match.";
            vaildPassword = false;
        }
        if ($scope.inputData.password === $scope.inputData.passwordConfirm) {
            $scope.errorMsgConfrim = '';
            vaildPassword = true;
        }
    }

    $scope.clearForm = function () {
      $scope.inputData.username = '';
      $scope.inputData.password = '';
      $scope.inputData.firstname = '';
      $scope.inputData.lastname = '';
      $scope.inputData.email = '';
      $scope.inputData.phone = '';
      $scope.inputData.passwordConfirm = '';

    }

    $scope.postRegistration = function () {
        if (vaildPassword == false) {
            $scope.errorMsg = "Passwords do not match";
        } else {

            var encodedData = 'username=' +
                encodeURIComponent($scope.inputData.username) +
                '&password=' +
                encodeURIComponent($scope.inputData.password) +
                '&firstname=' +
                encodeURIComponent($scope.inputData.firstname) +
                '&lastname=' +
                encodeURIComponent($scope.inputData.lastname) +
                '&email=' +
                encodeURIComponent($scope.inputData.email) +
                '&phone=' +
                encodeURIComponent($scope.inputData.phone) +
                '&userid=' +
                encodeURIComponent($scope.generate_HexCode()) +
                '&markerid=' +
                encodeURIComponent($scope.generate_HexCode()) +
                '&apikey=' +
                encodeURIComponent($scope.generate_Apikey());

            $http({
                method: 'POST',
                url: '/users',
                data: encodedData,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
                .success(function (data, status, headers, config) {
                    console.log(data);
                    if (data.status === "OK") {
                        //window.location.href = '/';
                        $scope.successMsg = "Registration complete, please log in.";
                        $scope.clearForm();
                    }

                    if (data.status === 'usernameExists') {
                        $scope.errorMsgUsername = "That Username Already Exists";
                    }
                    if (data.status === 'emailExists') {
                        $scope.errorMsgEmail = "That Email Already Exists";
                    }


                })
                .error(function (data, status, headers, config) {
                    console.log('Unable to submit form.');
                    $scope.errorMsg = 'Unable to submit form';
                })
        }
    }

    $scope.generate_HexCode = function () {
        //Length of Hex Code
        var hexIDLength = 12;
        //Characters to use in Hex Code
        var hexOptions = 'ABCDEF1234567890';
        var hexID = '';
        //Assigns the
        var optionsLength = hexOptions.length;
        //Loops through and randomly creates a hex string
        for (var i = 0; i < hexIDLength; i++) {
            var n = getRandomInt(0, optionsLength);
            hexID += hexOptions[n];
        }
        return hexID;
    }
    $scope.generate_Apikey = function () {
        //Length of Hex Code
        var hexIDLength = 20;
        //Characters to use in Hex Code
        var hexOptions = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
        var hexID = '';
        //Assigns the
        var optionsLength = hexOptions.length;
        //Loops through and randomly creates a hex string
        for (var i = 0; i < hexIDLength; i++) {
            var n = getRandomInt(0, optionsLength);
            hexID += hexOptions[n];
        }
        return hexID;
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }


}]);


routerApp.controller('groupController', ['$scope', '$http', function ($scope, $http, $uibModal) {
    var vm = this;

    vm.maxSizeNumber = 25;
    vm.getMaxSizeNumber = function (num) {
        return new Array(num);
    }

    var hexIDFinal = '';
    vm.genHex = function () {
        vm.hexIDFinal = vm.generate_HexCode();
    }
    vm.updateGroup = function (groupid) {

        var encodedData = 'groupname=' + encodeURIComponent(vm.inputData.groupname) +
        '&maxsize=' + encodeURIComponent(vm.inputData.maxsize);

        $http({
            method: 'PUT',
            url: '/groups/' + groupid,
            data: encodedData,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
            .success(function (data, status, headers, config) {
                console.log(data);
                $scope.errorMsg = "";
                $scope.successMsg = "Group Created Successfully";
            })
            .error(function (data, status, headers, config) {
                console.log("Group not correct");
                $scope.successMsg = "";
                $scope.errorMsg = data.status;
            });

    }


    vm.deleteGroup = function (deletegroupid) {

        var encodedData = 'groupid=' + encodeURIComponent(deletegroupid);

        $http({
            method: 'DELETE',
            url: '/groups/' + deletegroupid,
            data: encodedData,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
            .success(function (data, status, headers, config) {
                console.log(data);
                $scope.errorMsg = '';
                $scope.successMsg = "Group Deleted Successfully";
            })
            .error(function (data, status, headers, config) {
                console.log("Group ID  incorrect");
                $scope.successMsg = '';
                $scope.errorMsg = data.status;
            });


    }

    vm.generate_HexCode = function () {
        //Length of Hex Code
        var hexIDLength = 12;
        //Characters to use in Hex Code
        var hexOptions = 'ABCDEF1234567890';
        var hexID = '';
        //Assigns the
        var optionsLength = hexOptions.length;
        //Loops through and randomly creates a hex string
        for (var i = 0; i < hexIDLength; i++) {
            var n = getRandomInt(0, optionsLength);
            hexID += hexOptions[n];
        }
        return hexID;
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    vm.postGroup = function () {
        if (vm.inputData.maxsize === 'placeholder') {
            $scope.errorMsg = 'Please select a max group size';
        } else {
            $scope.errorMsg = '';
            var encodedData =
                'groupid=' +
                encodeURIComponent(vm.generate_HexCode()) +
                '&groupname=' +
                encodeURIComponent(vm.inputData.groupname) +
                '&maxsize=' +
                encodeURIComponent(vm.inputData.maxsize) +
                '&userid=' +
                encodeURIComponent(localStorage.getItem("user_id"));

            $http({
                method: 'POST',
                url: '/groups',
                data: encodedData,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
                .success(function (data, status, headers, config) {
                    console.log(data);
                    $scope.errorMsg = "";
                    $scope.successMsg = "Group Created Successfully";
                })
                .error(function (data, status, headers, config) {
                    console.log("Group not correct");
                    $scope.successMsg = "";
                    $scope.errorMsg = data.status;
                });
        }
    }
    vm.getAllGroups = function () {
        var groups;
        $http({
            method: 'GET',
            url: '/groups',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function (data, status, headers, config) {
                console.log(data);
                vm.groups = data.results;
            })
            .error(function (data, status, headers, config) {
                console.log('Unable to submit form.');
                $scope.errorMsg = 'Unable to submit form';
            })
    }

    vm.getGroupsByName = function () {
        var groups;
        $http({
            method: 'GET',
            url: '/groups/' + vm.inputData.groupname,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function (data, status, headers, config) {
                if (data.status === 'Error') {
                    $scope.errorMsg = 'No Groups named: "' + vm.inputData.groupname + '" found.';
                    vm.groupFound = false;
                } else {
                    console.log(data);
                    $scope.errorMsg = '';
                    vm.groups = data.results;
                    vm.groupFound = true;
                }
            })
            .error(function (data, status, headers, config) {
                console.log('Unable to submit form.');
                vm.groupFound = false;
                $scope.errorMsg = '"' + vm.inputData.groupname + '" Not Found.';
            });
    }

}]);
