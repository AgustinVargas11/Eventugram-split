'use strict';

var app = angular.module('Eventugram');

app.service('ProfileService', ['$http', function ($http) {

    this.getUserProfile = function () {
        return $http.get('/api/user/userprofile')
            .then(function (response) {
                return response.data;
            }).catch(function (e) {
                console.log(e)
            });
    };

    this.getAllUsers = function () {
        return $http.get('/api/user/getAll')
            .then(function (response) {
                return response.data;
            }).catch(function (e) {
                console.log(e)
            })
    };

    this.getOtherUsersProfile = function (id) {
        return $http.get('/api/user/profile/' + id)
            .then(function (response) {
                return response.data;
            }).catch(function (e) {
                console.log(e)
            });
    };

    this.editUserProfile = function (updatedUser) {
        return $http.put('/api/user/userprofile/', updatedUser).then(function (response) {
            return response.data;
        }).catch(function (e) {
            console.log(e)
        })
    };

    this.getFollowing = function () {
        return $http.get('/api/user/following')
            .then(function (response) {
                return response.data;
            }).catch(function (e) {
                console.log(e)
            })
    };
}]);