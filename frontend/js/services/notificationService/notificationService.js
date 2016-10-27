'use strict';

var app = angular.module('Eventugram');

app.service('NotificationService', ['$http', function ($http) {
    this.markAsSeen = function (id) {
        return $http.put('/api/notification/' + id + '/markasseen')
            .then(function (response) {
                return response.data;
            })
    };
}]);