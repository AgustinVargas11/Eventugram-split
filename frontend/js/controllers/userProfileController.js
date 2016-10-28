'use strict';

var app = angular.module('Eventugram');

app.controller('UserProfileController', ['$scope', '$routeParams', '$location', 'FollowerService', 'ProfileService', 'UserService', function ($scope, $routeParams, $location, FollowerService, ProfileService, UserService) {

    var userId = UserService.getUserId();

    $scope.getUser = function () {
        ProfileService.getOtherUsersProfile($routeParams.userId)
            .then(function (user) {
                $scope.user = user;
            }).catch(function (e) {
            console.log(e)
        });
    };
    $scope.getUser();

    // CHECK IF THE USER FOLLOWS THE USER WHO'S PROFILE THEY ARE VISITING
    $scope.checkFollowStatus = function (id) {
        FollowerService.checkFollowStatus(id)
            .then(function (response) {
                if (response.message) {
                    $scope.button = 'follow'
                } else {
                    $scope.button = 'following';
                }
            }).catch(function (e) {
            console.log(e)
        })
    };
    $scope.checkFollowStatus($routeParams.userId);


    $scope.notMyProfile = function (id) {
        return userId === id;
    };

    $scope.toggleFollow = function (user) {
        if (user.followers.indexOf(userId) < 0)
            user.followers.push(userId);
        else
            user.followers.splice(user.followers.indexOf(userId), 1);

        FollowerService.toggleFollow(user._id)
            .then(function (response) {
                if (response.code === 0)
                    $scope.button = 'following';
                else
                    $scope.button = 'follow';
            }).catch(function (e) {
            console.log(e)
        })
    };

    $scope.viewPost = function (id) {
        $location.path('/singlePost/' + id);
    }
}]);