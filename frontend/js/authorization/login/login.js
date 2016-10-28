angular.module("Eventugram.auth")

    .controller("LoginController", ["$scope", 'UserService', function ($scope, UserService) {

        $scope.signin = function () {
            UserService.signin($scope.user)
                .then(function (response) {
                    if (response) {
                        if (response.field) {
                            if (response.field === 'username') {
                                $scope.usernameError = response.message;
                                $scope.passwordError = '';
                            } else {
                                $scope.passwordError = response.message;
                                $scope.usernameError = '';
                            }
                        }
                    }
                }).catch(function(e) {console.log(e)})
        };
    }]);