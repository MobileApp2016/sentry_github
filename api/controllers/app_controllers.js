routerApp.factory("AuthService", function ($http) {
    var auth = {};
    var authenticator = function(){
     this.authenticate = function () {
        if (!(localStorage.getItem("user_id") === null) && !(localStorage.getItem("token") === null)) {
            //alert("UserID: " + localStorage.getItem("communit_user_id") + "  UserToken: " + localStorage.getItem("communit_user_token"));
            ////console.log(localStorage.getItem("username") + " " + localStorage.getItem("password"))
            var encodedData = 'username=' +
                encodeURIComponent(localStorage.getItem("user_id")) +
                '&password=' + encodeURIComponent(localStorage.getItem("token"));
            ////console.log("encodedData: " + encodedData);
           return $http({
                method: 'POST',
                url: "/authenticate",
                data: encodedData,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
            //if no error
                .then(function (data, status, headers, config) {
                        ////console.log(data);
                        if (data.data.status === "true") {
                          //  //console.log("http: if true");
                           return true;
                        }
                        else {
                            //console.log("http: false");
                            //localStorage.removeItem("username");
                            //localStorage.removeItem("password");
                            localStorage.removeItem("token");
                            localStorage.removeItem("user_id");

                           return false;
                        }
                        //if error
                    }, function (data, status, headers, config) {
                        //console.log("Error in auth http request");
                        return false;
                    }
                )
        }
        else {
            //console.log("AuthService: else false");
          return false;
        }}
    };
    return new authenticator();
});
routerApp.run(function ($rootScope, $state, AuthService) {
    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
      //  //console.log(AuthService.authenticate());

        if (toState.authenticate && !AuthService.authenticate()) {
          //  //console.log("Checked if authenticated");
            event.preventDefault();
            window.location.href = '/';
            $state.go("landing");
        }
        else {
            ////console.log("Auth correct")
        }
    });
});

routerApp.controller('logoutController', ['$scope', '$http', function($scope, $http) {
  $scope.logout = function() {
    //localStorage.removeItem("username");
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("firstname");
    localStorage.removeItem("lastname");
    //localStorage.removeItem("password");
    window.location.href = '/';
  }
}]);

routerApp.controller('navController', ['$scope', '$http', function($scope, $http) {

	$scope.getMaxSizeNumber = function() {
			return new Array(num);
	}


}]);

routerApp.controller('groupController', ['$scope', '$http', function($scope, $http) {
	var vm = this;
	$scope.showmembers = false;
	$scope.username = (localStorage.getItem("firstname") + " " + localStorage.getItem("lastname"));

	vm.maxSizeNumber = 25;
	vm.getMaxSizeNumber = function(num) {
	    return new Array(num);
	}

	var hexIDFinal = '';
		vm.genHex = function() {
			vm.hexIDFinal = vm.generate_HexCode();
		}

	vm.updateGroup = function(groupid){

					var encodedData = 'groupname=' + encodeURIComponent(vm.inputData.groupname) + '&maxsize=' + encodeURIComponent(vm.inputData.maxsize);

			$http({
				method: 'PUT',
				url: '/groups/' + groupid,
				data: encodedData,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			})
			.success(function(data, status, headers, config) {
				////console.log(data);
				$scope.errorMsg = "";
				$scope.successMsg = "Group Created Successfully";
			})
			.error(function(data, status, headers, config) {
				//console.log("Group not correct");
				$scope.successMsg = "";
				$scope.errorMsg = data.status;
			});

	}


	vm.deleteGroup = function(deletegroupid) {

			var encodedData = 'groupid=' + encodeURIComponent(deletegroupid);

			$http({
				method: 'DELETE',
				url: '/groups/' + deletegroupid,
				data: encodedData,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			})
			.success(function(data, status, headers, config) {
			////console.log(data);
				$scope.errorMsg = '';
				$scope.successMsg = "Group Deleted Successfully";
			})
			.error(function(data, status, headers, config) {
				//console.log("Group ID  incorrect");
				$scope.successMsg = '';
				$scope.errorMsg = data.status;
			});

	}

	vm.joinGroup = function(joingroupid) {

			var encodedData = 'groupid=' + encodeURIComponent(joingroupid) +
			'&userid=' +
			encodeURIComponent(localStorage.getItem("user_id"));

			$http({
				method: 'POST',
				url: '/groups/' + joingroupid,
				data: encodedData,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			})
			.success(function(data, status, headers, config) {
				////console.log(data);
				$scope.errorMsg = '';
				$scope.successMsg = "Group Joined Successfully";
			})
			.error(function(data, status, headers, config) {
				//console.log("Data Incorrect");
				$scope.successMsg = '';
				$scope.errorMsg = data.description;
			});
	}

	vm.leaveGroup = function(groupid) {

			var encodedData = 'groupid=' + encodeURIComponent(groupid) +
			'&userid=' +
			encodeURIComponent(localStorage.getItem("user_id"));

			$http({
				method: 'DELETE',
				url: '/groups/remove',
				data: encodedData,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			})
			.success(function(data, status, headers, config) {
				////console.log(data);
				$scope.errorMsg = '';
				$scope.successMsg = "Group left Successfully";
			})
			.error(function(data, status, headers, config) {
				//console.log("Data Incorrect");
				$scope.successMsg = '';
				$scope.errorMsg = data.description;
			});
	}


	vm.generate_HexCode = function() {
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
	        hexID +=  hexOptions[n];
	    }
	    return hexID;
	}

	function getRandomInt(min, max) {
	  return Math.floor(Math.random() * (max - min)) + min;
	}

	vm.postGroup = function() {
		if(vm.inputData.maxsize === 'placeholder'){
				$scope.errorMsg = 'Please select a max group size';
		}else{
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
		.success(function(data, status, headers, config) {
			////console.log(data);
			$scope.errorMsg = "";
			$scope.successMsg = "Group Created Successfully";
		})
		.error(function(data, status, headers, config) {
			//console.log("Group not correct");
			$scope.successMsg = "";
			$scope.errorMsg = data.status;
		});
	}
}
		vm.getAllGroups = function() {
			var groups;
			$http({
				method: 'GET',
				url: '/groups',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}).success(function(data, status, headers, config) {
				////console.log(data);
				vm.groups = data.results;
			})
				.error(function(data, status, headers, config) {
					//console.log('Unable to submit form.');
					$scope.errorMsg = 'Unable to submit form';
			})
		}

		vm.removeMemberGroup = function(groupid, userid) {
			var results;
			var encodedData = 'groupid=' +
					encodeURIComponent(groupid) +
					'&userid=' +
					encodeURIComponent(userid);

			$http({
				method: 'DELETE',
				url: '/groups/remove',
				data: encodedData,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}).success(function(data, status, headers, config) {
				$scope.successMsg = "User removed successfully.";
				vm.results = data.results;
			})
				.error(function(data, status, headers, config) {
					//console.log('Unable to submit form.');
					$scope.errorMsg = 'Unable to submit form';
			})
		}

		vm.getUserGroups = function() {
			var groups;
			$http({
				method: 'POST',
				url: '/groups/users/' + localStorage.getItem("user_id"),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}).success(function(data, status, headers, config) {
				////console.log(data);
				vm.groups = data.results;
			})
				.error(function(data, status, headers, config) {
					//console.log('Unable to submit form.');
					$scope.errorMsg = 'Unable to submit form';
			})
		}

		vm.getGroupsMembers = function(groupid) {
			var groups;
			$http({
				method: 'GET',
				url: '/groups/users/' + groupid,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}).success(function(data, status, headers, config) {
				////console.log(data);
				vm.groupsmembers = data.results;
			})
				.error(function(data, status, headers, config) {
					//console.log('Unable to submit form.');
					$scope.errorMsg = 'Unable to get group members.';
			})
		}

		vm.getGroupsByName = function() {
			var groups;
			$http({
				method: 'GET',
				url: '/groups/' + vm.inputData.groupname,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}).success(function(data, status, headers, config) {
				if(data.status === 'Error'){
					$scope.errorMsg = 'No Groups named: "' + vm.inputData.groupname + '" found.';
					vm.groupFound = false;
				}else{
				////console.log(data);
				$scope.errorMsg = '';
				vm.groups = data.results;
				vm.groupFound = true;
				}
			})
				.error(function(data, status, headers, config) {
					//console.log('Unable to submit form.');
					vm.groupFound = false;
					$scope.errorMsg = '"' + vm.inputData.groupname + '" Not Found.';
			});
		}

}]);


routerApp.controller('mapController', ['$scope', '$http', function($scope, $http, $uibModal) {
    var vm = this;

    var user_id = localStorage.getItem("user_id");

    var profile_request; // Varaible that will hold the request to get the profile of a marker; needed for aborted requests

    var clicked_marker; // Used to hold the clicked marker that will be used for different queries

    var map;
    var streetview = new google.maps.StreetViewService();
    var myCenter = new google.maps.LatLng(41.7605556, -88.3200)

    var markers = []; // This is the array for the markers
    var marker_ids = []; //Marker information
    var users_names = []; //Marker name
    var marker_latitudes = []; //holds marker latitude
    var marker_longitudes = []; //holds marker longitude
    var marker_latlngs = []; //holds parsed latlng marker data
    var marker_locations = []; //holds marker location
    var marker_pin_colors = []; //holds marker pin color
    var marker_has_floorplans = []; //Specifies that the marker has floorplans

    var infowindows = [];
    var prev_infowindow = false; // Varaible to check to

    //creates a bounds object that is extended in the main loop
    var bounds = new google.maps.LatLngBounds();

    //Holds values for the dropdown menu
    var divOptions = [];
    var optionsDiv = [];
    var options = [];

    getUsersGroups(localStorage.getItem("user_id")); // Get the groups the user is in by the user id

    vm.getLocationWatch = function() {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(vm.showPosition);
        } else {
            vm.latitude = "Geolocation is not supported by this browser.";
        }
      }
    vm.getLocationCurrent = function() {
          if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(vm.showPosition);
          } else {
              vm.latitude = "Geolocation is not supported by this browser.";
          }
      }


    vm.showPosition = function(position) {
        vm.latitude = position.coords.latitude;
        vm.longitude = position.coords.longitude;

        if (vm.latitude != null && vm.longitude != null){
          var encodedData = 'latitude=' +
            encodeURIComponent(vm.latitude) +
            '&longitude=' +
            encodeURIComponent(vm.longitude);
          $http({
                  method: 'PUT',
                  url: '/map/' + user_id,
                  data: encodedData,
                  headers: {
                      'Content-Type': 'application/x-www-form-urlencoded'
                  }
              }).success(function(data, status, headers, config) {
                  if (data.status === 'Error') {
                      $scope.errorMsg = 'User not found.';
                  } else {
                      $scope.errorMsg = '';
                      vm.positionObj = data.results;
                    //  vm.displayGroupMap();
                  }
              })
              .error(function(data, status, headers, config) {
                  //console.log('Unable to submit form.');
                  $scope.errorMsg = '"' + user_id + '" Not Found.';
              });

        }



    }

    vm.showError = function(error) {
        switch(error.code) {
            case error.PERMISSION_DENIED:
                vm.latitude = "User denied the request for Geolocation."
                break;
            case error.POSITION_UNAVAILABLE:
                vm.latitude = "Location information is unavailable."
                break;
            case error.TIMEOUT:
                vm.latitude = "The request to get user location timed out."
                break;
            case error.UNKNOWN_ERROR:
                vm.latitude = "An unknown error occurred."
                break;
        }
    }

    function getUsersGroups(userid) {
        var groups;
        $http({
                method: 'POST',
                url: '/groups/users/' + userid,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(function(data, status, headers, config) {
                if (data.status === 'Error') {
                    $scope.errorMsg = 'No Groups for : "' + userid + '" found.';
                    vm.groupFound = false;
                } else {
                    $scope.errorMsg = '';
                    vm.groups = data.results;
                    vm.groupFound = true;
                }
            })
            .error(function(data, status, headers, config) {
                //console.log('Unable to submit form.');
                vm.groupFound = false;
                $scope.errorMsg = '"' + userid + '" Not Found.';
            });
    }

    vm.displayGroupMap = function() {
        var groupid = $( "#inputGroupName option:selected" ).val();
        var groupname = $( "#inputGroupName option:selected" ).text();
        $http({
                method: 'GET',
                url: '/map/' + groupid,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(function(data, status, headers, config) {
                if (data.status === 'Error') {
                    $scope.errorMsg = 'No Groups for "' + groupname  + '" found.';
                } else {
                    if (data.results == "") {
                        initializeNewCommunity();
                    } else {
                        angular.forEach(data.results, function(value, key) {
                            marker_ids.push(value.marker_id);
                            users_names.push(value.firstname + " " + value.lastname);
                            marker_latitudes.push(value.latitude);
                            marker_longitudes.push(value.longitude);
                            marker_latlngs.push(new google.maps.LatLng(value.latitude, value.longitude));
                            marker_pin_colors.push(value.color);
                        });
                        $scope.errorMsg = '';

                        initializeFilledCommunity();
                    }
                }
            })
            .error(function(data, status, headers, config) {
                //console.log('Unable to submit form.');
                $scope.errorMsg = '"' + groupname + '" Not Found.';
            });
    }

    function initializeNewCommunity() {
        var mapProp = {
            center: new google.maps.LatLng(51.508742, -0.120850),
            zoom: 5,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

        google.maps.event.addDomListener(window, "resize", function() {
            google.maps.event.trigger(map, "resize");
            map.panTo(myCenter);
        });
    }

    function initializeFilledCommunity() {
        var mapProp = {
            center: new google.maps.LatLng(51.508742, -0.120850),
            zoom: 5,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

        google.maps.event.addDomListener(window, "resize", function() {
            google.maps.event.trigger(map, "resize");
            map.fitBounds(bounds);
        });

        //this loop will create all of the markers, then invoke the addlistener function
        for (i in marker_ids) {
            //extend the bounds object to fit the iterated marker
            bounds.extend(new google.maps.LatLng(marker_latitudes[i], marker_longitudes[i]));

            //Change the color of each image through this function
            //overalayColor(marker_pin_colors[i]);
            //creates a marker in the markers array
            markers.push(new MarkerWithLabel({
                map: map,
                position: marker_latlngs[i],
                //Place changed image as the icon
                //icon: fullimg,
                labelContent: users_names[i],
                labelAnchor: new google.maps.Point(35, 65),
                labelClass: "labels", // the CSS class for the label
                labelStyle: {opacity: 0.75},
                animation: google.maps.Animation.DROP
            }));

            markers[i].addListener('click', function() {
                map.panTo(marker_latlngs[i]);
            });

        };
        map.fitBounds(bounds);
    }
/*
    //PRocess to change the colors of each pin
    //Variables to store each process
    selectImg = '';
    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
    originalPixels = null;
    currentPixels = null;
    color = '';
    fullimg = '';
    img = new Image();
    img.src = "images/house_pin.png";
*/
    // Function for convert Hexdecimal code into RGB color
    function HexToRGB(Hex) {
        var Long = parseInt(Hex.replace(/^#/, ""), 16);
        return {
            R: (Long >>> 16) & 0xff,
            G: (Long >>> 8) & 0xff,
            B: Long & 0xff
        };
    }
    // Function to fill the color of generated image
    function fillColor(path) {
        color = path;

        if (!originalPixels) return; // Check if image has loaded
        var newColor = HexToRGB(color);

        for (var I = 0, L = originalPixels.data.length; I < L; I += 4) {
            if (currentPixels.data[I + 3] > 0) {
                currentPixels.data[I] = originalPixels.data[I] / 255 * newColor.R;
                currentPixels.data[I + 1] = originalPixels.data[I + 1] / 255 * newColor.G;
                currentPixels.data[I + 2] = originalPixels.data[I + 2] / 255 * newColor.B;
            }
        }

        ctx.putImageData(currentPixels, 0, 0);
        fullimg = canvas.toDataURL("image/house_pin.png");
    }

    // Function for draw a image
    function overlayColor(color) {
        //fullimg = document.getElementsByTagName('img')[0];
        selectImg = img;
        //alert(img.src);
        //alert(img.src);
        canvas.width = selectImg.width;
        canvas.height = selectImg.height;

        ctx.drawImage(selectImg, 0, 0, selectImg.naturalWidth, selectImg.naturalHeight, 0, 0, selectImg.width, selectImg.height);
        originalPixels = ctx.getImageData(0, 0, selectImg.width, selectImg.height);
        currentPixels = ctx.getImageData(0, 0, selectImg.width, selectImg.height);

        selectImg.onload = null;
        fillColor(color);
    }
    //End of the color process

}]);
