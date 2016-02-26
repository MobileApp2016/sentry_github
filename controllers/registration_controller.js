angular.module('registrationApp', [])
.controller('registrationController', ['$scope', '$http', function($scope, $http) {
	var vm = this;

	vm.checkPassword = function() {
			var validPassword;
			if(vm.inputData.password != vm.inputData.passwordConfirm){
				$scope.errorMsgConfrim = "Passwords do not match.";
				vaildPassword = false;
			}
			if(vm.inputData.password === vm.inputData.passwordConfirm){
				$scope.errorMsgConfrim = '';
				vaildPassword = true;
			}
		}

	$scope.postRegistration = function() {
		if(vaildPassword == false){
			$scope.errorMsg = "Passwords do not match";
		}else{

			var encodedData = 'username=' +
				encodeURIComponent(vm.inputData.username) +
				'&password=' +
				encodeURIComponent(vm.inputData.password) +
				'&email=' +
				encodeURIComponent(vm.inputData.email) +
				'&phone=' +
				encodeURIComponent(vm.inputData.phone);

		$http({
			method: 'POST',
			url: './models/registration_model.php',
			data: encodedData,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		})
		.success(function(data, status, headers, config) {
			console.log(data);
			if ( data.trim() === 'usernameExists') {
					$scope.errorMsgUsername = "That Username Already Exists";
				}
			if ( data.trim() === 'emailExists') {
					$scope.errorMsgEmail = "That Email Already Exists";
				}
			if ( data.trim() === 'success') {
					window.location.href = 'index.html';
				}

		})
		.error(function(data, status, headers, config) {
			console.log('Unable to submit form.');
			$scope.errorMsg = 'Unable to submit form';
		})
	}

}
}]);
