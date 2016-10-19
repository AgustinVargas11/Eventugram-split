'use strict';

var app = angular.module('Eventugram');

app.directive('navbar', ['UserService', '$location', function (UserService, $location) {
    return {
        restrict: 'E',
        templateUrl: 'js/directives/navbar/navbar.html',
        link: function (scope) {
            scope.userService = UserService;
            scope.location = $location;
        },
        controller: ['$scope', '$http', '$location', function ($scope, $http, $location) {
            $scope.querySearch = function (query) {
                return $http.get("/api/user/getAll", {params: {username: query}})
                    .then(function (response) {
                        return response.data;
                    })
            };

            $scope.goToProfile = function(id) {
                if (!id)
                    return;
                searchUserForm.reset();
                $location.path('/user/' + id);
            };
        }]
    }
}]);