angular.module('loginApp', [])
.controller('loginController', ['$scope', '$http', function($scope, $http) {
	var vm = this;
	vm.postLogin = function() {
			var encodedData = 'username=' +
				encodeURIComponent(vm.inputData.username) +
				'&password=' +
				encodeURIComponent(vm.inputData.password);

		$http({
			method: 'POST',
			url: './models/login_model.php',
			data: encodedData,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		})
		.success(function(data, status, headers, config) {
			console.log(data);
			if ( data.trim() === 'correct') {
					window.location.href = 'index.html';
				} else {
					$scope.errorMsg = "Login not correct";
				}
		})
		.error(function(data, status, headers, config) {
			console.log('Unable to submit form.');
			$scope.errorMsg = 'Unable to submit form';
		})
	}



}]);
