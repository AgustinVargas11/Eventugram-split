'use strict';

var app = angular.module('Eventugram');

app.service('FollowerService', ['$http', function ($http) {

    this.toggleFollow = function (id) {
        return $http.patch('/api/user/following/add/' + id)
            .then(function (response) {
                return response.data;
            }).catch(function(e) {console.log(e)});
    };

    this.checkFollowStatus = function (id) {
        return $http.get('/api/user/following/user/' + id)
            .then(function (response) {
                return response.data;
            }).catch(function(e) {console.log(e)})
    };

}]);