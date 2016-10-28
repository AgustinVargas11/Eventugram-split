'use strict';

var app = angular.module('Eventugram');

app.controller('FriendsController', ['$scope', 'ProfileService', function ($scope, ProfileService) {
    $scope.getFriends = function () {
        ProfileService.getFollowing()
            .then(function (response) {
                $scope.user = response;
            }).catch(function(e) {console.log(e)});
    };

    $scope.getFriends();
}]);
