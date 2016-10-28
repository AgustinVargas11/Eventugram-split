'use strict';

var app = angular.module('Eventugram');

app.controller('ProfileController', ['$scope', 'UserService', 'DialogService', 'ProfileService', '$location', function ($scope, UserService, DialogService, ProfileService, $location) {

    function getUserProfile() {
        ProfileService.getUserProfile()
            .then(function (response) {
                $scope.user = response;
                $scope.posts = response.posts;
            }).catch(function(e) {console.log(e)});
    }

    getUserProfile();

    $scope.openDialog = function (ev, imageUrl) {
        DialogService.changeProfileImage(ev, imageUrl)
            .then(function (response) {
                if (response)
                    getUserProfile();
            }).catch(function(e) {console.log(e)});
    };

    $scope.editProfile = function () {
        ProfileService.editUserProfile($scope.editUser)
            .then(function (response) {
                if (response) {
                    $scope.user = response;
                    $location.path('/profile');
                }
            }).catch(function(e) {console.log(e)});
    };

    $scope.viewPost = function (id) {
        $location.path('/singlePost/' + id);
    }
}]);