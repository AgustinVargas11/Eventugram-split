'use strict';

var app = angular.module('Eventugram');

app.controller('ProfileController', ['$scope', 'UserService', 'DialogService', 'ProfileService', '$location', function ($scope, UserService, DialogService, ProfileService, $location) {

    function getUserProfile() {
        ProfileService.getUserProfile()
            .then(function (response) {
                $scope.user = response;
                $scope.user.bio = $scope.user.bio;
                $scope.posts = response.posts;
            });
    }

    getUserProfile();

    $scope.openDialog = function (ev, imageUrl) {
        DialogService.changeProfileImage(ev, imageUrl)
            .then(function (response) {
                if (response)
                    getUserProfile();
            });
    };

    $scope.editProfile = function () {
        ProfileService.editUserProfile($scope.editUser)
            .then(function (response) {
                if (response) {
                    $scope.user = response;
                    $location.path('/profile');
                }
            });
    };

    $scope.viewPost = function (id) {
        $location.path('/singlePost/' + id);
    }
}]);