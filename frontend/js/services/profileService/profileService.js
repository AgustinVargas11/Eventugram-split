'use strict';

var app = angular.module('Eventugram');

app.service('ProfileService', ['$http', function ($http) {

    this.getUserProfile = function () {
        return $http.get('/api/user/userprofile')
            .then(function (response) {
                return response.data;
            });
    };

    this.getAllUsers = function () {
        return $http.get('/api/user/getAll')
            .then(function (response) {
                return response.data;
            })
    };

    this.getOtherUsersProfile = function (id) {
        return $http.get('/api/user/profile/' + id)
            .then(function (response) {
                return response.data;
            });
    };

    this.editUserProfile = function (updatedUser) {
        return $http.put('/api/userprofile/user', updatedUser).then(function (response) {
            return response.data;
        })
    };

    this.getFollowing = function () {
        return $http.get('/api/user/following')
            .then(function (response) {
                console.log(response)
                return response.data;
            })
    };

}]);